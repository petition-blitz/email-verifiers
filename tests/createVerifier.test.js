const assert = require('assert');
const { createVerifier } = require('../src');

describe('createVerifier()', function () {
  it('is a function', function () {
    assert.strictEqual(typeof createVerifier, 'function');
  });

  it('throws if verifier is missing or invalid', function () {
    assert.throws(() => createVerifier());
    assert.throws(() => createVerifier(null));
    assert.throws(() => createVerifier('non_existent_verifier'));
  });

  it('throws if apiKey is missing', function () {
    assert.throws(() => createVerifier('datavalidation'));
  });

  it('returns a function', function () {
    const verifier = createVerifier('datavalidation', { apiKey: 'asdf' });
    assert.strictEqual(typeof verifier, 'function');
  });
});
