const assert = require('assert');
const { verifiers } = require('../src');

describe('verifiers', function () {
  for (const verifier of Object.keys(verifiers)) {
    describe(`${verifier}({ apiKey, accept })`, function () {
      const createVerifier = verifiers[verifier];

      it('is a function', function () {
        assert.strictEqual('function', typeof createVerifier);
      });

      it('requires apiKey', function () {
        assert.throws(() => {
          createVerifier({ accept: [0] });
        });

        assert.throws(() => {
          createVerifier({ apiKey: '', accept: [0] });
        });
      });

      it('requires accept', function () {
        assert.throws(() => {
          createVerifier({ apiKey: 'test' });
        });

        assert.throws(() => {
          createVerifier({ apiKey: 'test', accept: [] });
        });
      });

      it('returns verify({ email })', function () {
        assert.strictEqual('function', typeof createVerifier({ apiKey: 'test', accept: [0] }));
      });
    });
  }
});
