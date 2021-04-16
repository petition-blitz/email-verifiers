const assert = require('assert');
const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mg = new Mailgun(formData);

module.exports = ({ apiKey, accept, url }) => {
  assert.strictEqual('string', typeof apiKey, 'options.apiKey must be a string');
  assert(apiKey.length > 0, 'options.apiKey must not be empty');

  assert.strictEqual(true, Array.isArray(accept), 'options.accept must be an array');
  assert(accept.length > 0, 'options.accept must not be empty');

  const client = mg.client({
    username: 'api',
    key: apiKey,
    public_key: apiKey
  });

  return async function (data) {
    const result = await client.validate.get(data.email);
    return accept.includes(!!result.is_valid);
  };
};

module.exports.DEFAULTS = {
  apiKey: process.env.MAILGUN_PUBLIC_API_KEY,
  accept: [true]
};
