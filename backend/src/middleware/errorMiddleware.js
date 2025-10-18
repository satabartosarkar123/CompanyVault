// Error handling middleware
export function errorHandler(err, req, res, next) {
  console.error(err);
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  
  if (err.code === '23505') { // PostgreSQL unique violation
    return res.status(409).json({ error: 'Email already exists' });
  }
  
  res.status(500).json({ error: 'Internal server error' });
}