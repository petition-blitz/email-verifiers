/* global fetch:false */

const assert = require('assert');
require('isomorphic-fetch');

const GRADES = ['high', 'medium', 'low', 'unknown'];

async function check (apiKey, email) {
  const url = 'https://api.mailgun.net/v4/address/validate?address=' + encodeURIComponent(email);

  const config = {
    headers: {
      Authorization: 'Basic ' + Buffer.from('api:' + apiKey).toString('base64'),
      Accept: 'application/json'
    }
  };

  const res = await fetch(url, config);

  if (res.ok) {
    return await res.json();
  }

  throw new Error(`Mailgun API error: HTTP ${res.status} ${res.statusText}`);
}

module.exports = ({ apiKey, accept }) => {
  assert.strictEqual('string', typeof apiKey, 'options.apiKey must be a string');
  assert(apiKey.length > 0, 'options.apiKey must not be empty');

  assert.strictEqual(true, Array.isArray(accept), 'options.accept must be an array');
  assert(accept.length > 0, 'options.accept must not be empty');

  return async function ({ email }) {
    const { risk } = await check(apiKey, email);
    console.debug('mailgun:', email, risk);
    return accept.includes(risk);
  };
};

module.exports.GRADES = GRADES;

module.exports.DEFAULTS = {
  apiKey: process.env.MAILGUN_API_KEY,
  accept: ['low', 'medium', 'unknown']
};
