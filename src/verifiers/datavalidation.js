/* global fetch:false */

const assert = require('assert');
require('isomorphic-fetch');

const GRADES = ['A', 'A+', 'B', 'D', 'F'];

async function check (apiKey, email) {
  const url = 'https://dv3.datavalidation.com/api/v2/realtime/?email=' + encodeURIComponent(email);

  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: 'application/json'
    }
  };

  const res = await fetch(url, config);

  if (res.ok) {
    return await res.json();
  }

  throw new Error(`DataValidation API error: HTTP ${res.status} ${res.statusText}`);
}

module.exports = ({ apiKey, accept }) => {
  assert.strictEqual('string', typeof apiKey, 'options.apiKey must be a string');
  assert(apiKey.length > 0, 'options.apiKey must not be empty');

  assert.strictEqual(true, Array.isArray(accept), 'options.accept must be an array');
  assert(accept.length > 0, 'options.accept must not be empty');

  return async function ({ email }) {
    const { status, reason, grade } = await check(apiKey, email);

    if (status !== 'ok') {
      throw new Error(`DataValidation validation error: ${reason}`);
    }

    return accept.includes(grade);
  };
};

module.exports.GRADES = GRADES;

module.exports.DEFAULTS = {
  apiKey: process.env.DATAVALIDATION_API_KEY,
  accept: ['A+', 'A', 'B']
};
