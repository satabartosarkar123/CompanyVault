import httpMocks from 'node-mocks-http';
import { EventEmitter } from 'events';

export function performRequest(app, { method, path, body, headers = {} }) {
  return new Promise((resolve, reject) => {
    const req = httpMocks.createRequest({
      method,
      url: path,
      headers: {
        'content-type': 'application/json',
        ...headers,
      },
    });

    const res = httpMocks.createResponse({
      eventEmitter: EventEmitter,
    });

    res.on('end', () => {
      let data = null;
      try {
        if (res._isJSON()) {
          data = res._getJSONData();
        } else {
          data = res._getData();
        }
      } catch (error) {
        data = res._getData();
      }
      resolve({
        statusCode: res.statusCode,
        body: data,
        headers: res._getHeaders(),
      });
    });

    res.on('error', reject);

    if (body !== undefined) {
      const payload = JSON.stringify(body);
      req.headers['content-type'] = 'application/json';
      req.headers['content-length'] = Buffer.byteLength(payload);
      req.body = body;
      req.rawBody = payload;
      req._body = true;
    } else {
      req.body = {};
      req._body = true;
    }

    app.handle(req, res, (err) => {
      if (err) {
        reject(err);
      }
    });
  });
}
