const test = require('node:test');
const assert = require('node:assert');
const { requireAuth } = require('../functions/auth/middleware.js');

class MockResponse {
  constructor() {
    this.statusCode = null;
    this.headers = null;
    this.body = null;
    this.ended = false;
  }
  writeHead(status, headers) {
    this.statusCode = status;
    this.headers = headers;
  }
  end(body) {
    this.body = body;
    this.ended = true;
  }
}

test('Auth Middleware: allow mock SCRB_ADMIN in local dev environment', async () => {
  // Setup environment
  const originalEnv = process.env.CATALYST_ENV;
  delete process.env.CATALYST_ENV;
  process.env.NODE_ENV = 'development';

  const req = {
    headers: {
      'x-mock-role': 'SCRB_ADMIN',
      'x-mock-email': 'admin@ksp.gov.in',
      'x-mock-employee-id': '99'
    }
  };
  const res = new MockResponse();
  let handlerCalled = false;
  const handler = async (req, res) => {
    handlerCalled = true;
    assert.strictEqual(req.user.role, 'SCRB_ADMIN');
    assert.strictEqual(req.user.isMock, true);
    assert.strictEqual(req.user.employee.employeeID, 99);
  };

  const middleware = requireAuth(['SCRB_ADMIN']);
  await middleware(req, res, handler);

  assert.strictEqual(handlerCalled, true);
  assert.strictEqual(res.ended, false);

  // Restore env
  process.env.CATALYST_ENV = originalEnv;
});

test('Auth Middleware: reject mock role when not in allowedRoles', async () => {
  // Setup environment
  const originalEnv = process.env.CATALYST_ENV;
  delete process.env.CATALYST_ENV;
  process.env.NODE_ENV = 'development';

  const req = {
    headers: {
      'x-mock-role': 'INVESTIGATION_OFFICER',
      'x-mock-email': 'officer@ksp.gov.in'
    }
  };
  const res = new MockResponse();
  let handlerCalled = false;
  const handler = async (req, res) => {
    handlerCalled = true;
  };

  const middleware = requireAuth(['SCRB_ADMIN']);
  await middleware(req, res, handler);

  assert.strictEqual(handlerCalled, false);
  assert.strictEqual(res.statusCode, 403);
  const body = JSON.parse(res.body);
  assert.strictEqual(body.error, 'Forbidden');

  // Restore env
  process.env.CATALYST_ENV = originalEnv;
});

test('Auth Middleware: reject mock headers in production environments', async () => {
  // Setup environment
  process.env.CATALYST_ENV = 'Production';
  process.env.NODE_ENV = 'production';

  const req = {
    headers: {
      'x-mock-role': 'SCRB_ADMIN',
      'x-mock-email': 'admin@ksp.gov.in'
    }
  };
  const res = new MockResponse();
  let handlerCalled = false;
  const handler = async (req, res) => {
    handlerCalled = true;
  };

  const middleware = requireAuth(['SCRB_ADMIN']);
  await middleware(req, res, handler);

  // Should bypass the mock block and hit Catalyst initialize which throws/fails in mock unit test, yielding 500
  assert.strictEqual(handlerCalled, false);
  assert.strictEqual(res.statusCode, 500);

  // Clean up env
  delete process.env.CATALYST_ENV;
  process.env.NODE_ENV = 'development';
});
