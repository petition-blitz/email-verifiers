const assert = require('assert');
const fetchMock = require('fetch-mock');
const createVerifier = require('../src/datavalidation');

function mockDatavalidationResponse(email, grade) {
  const url = 'https://dv3.datavalidation.com/api/v2/realtime/?email=' + encodeURIComponent(email);

  const res = {
    status: 200,
    body: {
      status: 'ok',
      grade,
      disposable: false,
      email,
      role_based: true
    }
  };

  fetchMock.mock(url, res);
}

describe('datavalidation', function () {
  describe('createVerifier({ apiKey, acceptableGrades })', function () {
    it('is a function', function () {
      assert.strictEqual('function', typeof createVerifier);
    });

    it('requires apiKey', function () {
      assert.throws(() => {
        createVerifier({ acceptableGrades: ['A+'] });
      });

      assert.throws(() => {
        createVerifier({ apiKey: '', acceptableGrades: ['A+'] });
      });
    });

    it('requires acceptableGrades', function () {
      assert.throws(() => {
        createVerifier({ apiKey: 'test' });
      });

      assert.throws(() => {
        createVerifier({ apiKey: 'test', acceptableGrades: [] });
      });
    });

    it('returns verify()', function () {
      assert.strictEqual('function', typeof createVerifier({ apiKey: 'test', acceptableGrades: ['A'] }));
    });

    describe('verify()', function () {
      const verify = createVerifier({
        apiKey: 'MOCK_API_KEY', acceptableGrades: ['A', 'A+', 'B']
      });

      afterEach(() => fetchMock.restore());

      it('returns a Promise', function () {
        mockDatavalidationResponse('test1@example.com', 'A+');
        assert(verify({ email: 'test1@example.com' }) instanceof Promise);
      });

      it('resolves to true for acceptable grades', async function () {
        mockDatavalidationResponse('test1@example.com', 'A+');
        mockDatavalidationResponse('test2@example.com', 'A');
        mockDatavalidationResponse('test3@example.com', 'B');
        assert.strictEqual(true, await verify({ email: 'test1@example.com' }));
        assert.strictEqual(true, await verify({ email: 'test2@example.com' }));
        assert.strictEqual(true, await verify({ email: 'test3@example.com' }));
      });

      it('resolves to false for unacceptable grades', async function () {
        mockDatavalidationResponse('test4@example.com', 'D');
        mockDatavalidationResponse('test5@example.com', 'F');
        assert.strictEqual(false, await verify({ email: 'test4@example.com' }));
        assert.strictEqual(false, await verify({ email: 'test5@example.com' }));
      });
    });
  });
});
