const assert = require('assert');
const { detectVerifier } = require('../src');

describe('detectVerifier()', function () {
  it('is a function', function () {
    assert.strictEqual(typeof detectVerifier, 'function');
  });

  it('returns null by default', function () {
    assert.strictEqual(detectVerifier(), null);
  });

  it('returns datavalidation if DATAVALIDATION_API_KEY is present', function () {
    assert.strictEqual(detectVerifier({ DATAVALIDATION_API_KEY: 'asdf' }), 'datavalidation');
  });

  it('returns neverbounce if NEVERBOUNCE_API_KEY is present', function () {
    assert.strictEqual(detectVerifier({ NEVERBOUNCE_API_KEY: 'asdf' }), 'neverbounce');
  });

  it('returns mailgun if MAILGUN_PUBLIC_API_KEY is present', function () {
    assert.strictEqual(detectVerifier({ MAILGUN_PUBLIC_API_KEY: 'asdf' }), 'mailgun');
  });
});
