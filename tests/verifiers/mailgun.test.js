const assert = require('assert');
const fetchMock = require('fetch-mock');
const createVerifier = require('../../src/verifiers/mailgun');

function mockDatavalidationResponse (address, risk) {
  const url = 'https://api.mailgun.net/v4/address/validate?address=' + encodeURIComponent(address);

  const res = {
    status: 200,
    body: {
      address,
      is_disposable_address: false,
      is_role_address: false,
      reason: [],
      result: 'deliverable',
      risk
    }
  };

  fetchMock.mock(url, res);
}

describe('mailgun', function () {
  describe('verify()', function () {
    const verify = createVerifier({
      apiKey: 'MOCK_API_KEY', accept: ['low', 'medium', 'unknown']
    });

    afterEach(() => fetchMock.restore());

    it('returns a Promise', function () {
      mockDatavalidationResponse('test1@example.com', 'low');
      assert(verify({ email: 'test1@example.com' }) instanceof Promise);
    });

    it('resolves to true for acceptable risks', async function () {
      mockDatavalidationResponse('test1@example.com', 'low');
      mockDatavalidationResponse('test2@example.com', 'medium');
      mockDatavalidationResponse('test3@example.com', 'unknown');
      assert.strictEqual(true, await verify({ email: 'test1@example.com' }));
      assert.strictEqual(true, await verify({ email: 'test2@example.com' }));
      assert.strictEqual(true, await verify({ email: 'test3@example.com' }));
    });

    it('resolves to false for unacceptable risks', async function () {
      mockDatavalidationResponse('test4@example.com', 'high');
      assert.strictEqual(false, await verify({ email: 'test4@example.com' }));
    });
  });
});
