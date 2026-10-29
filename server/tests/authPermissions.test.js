import { describe, it } from 'node:test';
import assert from 'node:assert';
import bcrypt from 'bcryptjs';
import { signToken, verifyToken } from '../src/utils/jwt.js';
import { authorize } from '../src/middleware/authorize.js';
import { ROLES } from '../src/config/constants.js';

describe('Security & Authorization Tests', () => {
  it('should securely hash passwords and verify matches correctly', async () => {
    const rawPassword = 'SecureStudentPassword!456';
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(rawPassword, salt);

    assert.notStrictEqual(rawPassword, hash);
    assert.strictEqual(await bcrypt.compare(rawPassword, hash), true);
    assert.strictEqual(await bcrypt.compare('WrongPassword', hash), false);
  });

  it('should sign and verify valid JWT tokens', () => {
    const payload = { id: 'user_123', role: ROLES.STUDENT };
    const token = signToken(payload);

    assert.ok(token && typeof token === 'string');
    const decoded = verifyToken(token);
    assert.strictEqual(decoded.id, payload.id);
    assert.strictEqual(decoded.role, payload.role);
  });

  it('should reject invalid or tampered JWT tokens', () => {
    const invalidToken = 'ey12345.tampered.token';
    const decoded = verifyToken(invalidToken);
    assert.strictEqual(decoded, null);
  });

  it('should allow authorized role in role middleware', () => {
    const middleware = authorize(ROLES.ADMIN, ROLES.LIBRARIAN);
    const req = { user: { role: ROLES.LIBRARIAN } };
    let calledNext = false;
    const res = {};
    const next = () => { calledNext = true; };

    middleware(req, res, next);
    assert.strictEqual(calledNext, true);
  });

  it('should block unauthorized role in role middleware', () => {
    const middleware = authorize(ROLES.ADMIN);
    const req = { user: { role: ROLES.STUDENT } };
    let calledNext = false;
    let responseStatus = null;
    let responseJson = null;

    const res = {
      status(code) {
        responseStatus = code;
        return this;
      },
      json(data) {
        responseJson = data;
        return this;
      }
    };
    const next = () => { calledNext = true; };

    middleware(req, res, next);
    assert.strictEqual(calledNext, false);
    assert.strictEqual(responseStatus, 403);
    assert.strictEqual(responseJson.success, false);
  });
});
