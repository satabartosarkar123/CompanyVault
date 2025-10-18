import dotenv from 'dotenv';
import { Client } from 'pg';
import { parse as parseConnectionString } from 'pg-connection-string';

dotenv.config({ path: '.env' });

// Use an ephemeral port during verification to avoid conflicts with existing services.
process.env.PORT = '0';

const { startServer } = await import('../src/server.js');
const { default: pool } = await import('../src/config/db.js');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ensureDatabaseExists = async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set.');
  }

  const parsed = parseConnectionString(connectionString);
  const targetDatabase = parsed.database;

  if (!targetDatabase) {
    return;
  }

  const verificationClient = new Client({ connectionString });
  try {
    await verificationClient.connect();
  } catch (error) {
    if (error.code === '3D000') {
      throw new Error(
        `The database "${targetDatabase}" does not exist. Update DATABASE_URL in backend/.env or create the database before running verification.`
      );
    }
    throw error;
  } finally {
    await verificationClient.end();
  }
};

const run = async () => {
  await ensureDatabaseExists();

  const server = startServer();
  await new Promise((resolve, reject) => {
    server.on('listening', resolve);
    server.on('error', reject);
  });

  const { port } = server.address();
  const baseUrl = `http://127.0.0.1:${port}`;

  const uniqueId = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  const email = `verify_${uniqueId}@example.com`;
  const password = 'VerifyPass123!';
  const companyName = `Verify Company ${uniqueId}`;

  let newUserId = null;

  try {
    // Register user
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        password,
        fullname: `Verification User ${uniqueId}`,
        gender: 'M',
        mobileno: '1234567890',
        signuptype: 'email',
      }),
    });

    if (registerResponse.status !== 201) {
      const errorBody = await registerResponse.text();
      throw new Error(
        `Registration failed with status ${registerResponse.status}: ${errorBody}`
      );
    }

    const registerData = await registerResponse.json();
    newUserId = registerData.user?.id;
    if (!registerData.token || !newUserId) {
      throw new Error('Registration response did not include token or user.');
    }

    const token = registerData.token;

    // Register company
    const registerCompanyResponse = await fetch(`${baseUrl}/api/company/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: companyName,
        description: 'Verification company description',
        address: '123 Verification Ave',
      }),
    });

    if (registerCompanyResponse.status !== 201) {
      const errorBody = await registerCompanyResponse.text();
      throw new Error(
        `Company registration failed with status ${registerCompanyResponse.status}: ${errorBody}`
      );
    }

    const companyData = await registerCompanyResponse.json();

    // Fetch company profile
    const profileResponse = await fetch(`${baseUrl}/api/company/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (profileResponse.status !== 200) {
      const errorBody = await profileResponse.text();
      throw new Error(
        `Company profile fetch failed with status ${profileResponse.status}: ${errorBody}`
      );
    }

    const profileData = await profileResponse.json();

    if (profileData?.name !== companyName) {
      throw new Error(
        `Unexpected company name in profile. Expected "${companyName}", received "${profileData?.name}".`
      );
    }

    console.log('Backend verification succeeded:', {
      userId: newUserId,
      companyId: companyData?.id,
    });
  } finally {
    if (newUserId) {
      await pool.query('DELETE FROM companies WHERE owner_id = $1', [newUserId]);
      await pool.query('DELETE FROM users WHERE id = $1', [newUserId]);
    }

    await new Promise((resolve) => server.close(resolve));
  }
};

run().catch((error) => {
  console.error('Backend verification failed:', error);
  process.exitCode = 1;
});
