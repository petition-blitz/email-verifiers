const assert = require('assert');
const NeverBounce = require('neverbounce');

module.exports = ({ apiKey, accept }) => {
  assert.strictEqual('string', typeof apiKey, 'options.apiKey must be a string');
  assert(apiKey.length > 0, 'options.apiKey must not be empty');

  assert.strictEqual(true, Array.isArray(accept), 'options.accept must be an array');
  assert(accept.length > 0, 'options.accept must not be empty');

  const client = new NeverBounce({ apiKey });

  return async function (data) {
    if (data['nb-result'] && data['nb-confirmation-token'] && data['nb-transaction-token']) {
      try {
        const result = await client.poe.confirm(
          data.email,
          data['nb-result'],
          data['nb-confirmation-token'],
          data['nb-transaction-token']
        );
        if (result.token_confirmed === true) {
          return true;
        }
      } catch (err) {
        console.error('verifyNeverbounce confirmation failure:', err, {
          email: data.email,
          result: data['nb-result'],
          confirmationToken: data['nb-confirmation-token'],
          transactionToken: data['nb-transaction-token']
        });
      }
    }

    const result = await client.single.check(data.email);
    return result.is(accept);
  };
};

module.exports.DEFAULTS = {
  apiKey: process.env.NEVERBOUNCE_API_KEY,
  accept: [0, 3, 4]
};
