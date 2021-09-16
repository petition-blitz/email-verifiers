const verifiers = {
  datavalidation: require('./verifiers/datavalidation'),
  neverbounce: require('./verifiers/neverbounce'),
  mailgun: require('./verifiers/mailgun')
};

function detectVerifier (env = {}, fallback = null) {
  if (env.DATAVALIDATION_API_KEY) {
    return 'datavalidation';
  }

  if (env.NEVERBOUNCE_API_KEY) {
    return 'neverbounce';
  }

  if (env.MAILGUN_API_KEY) {
    return 'mailgun';
  }

  return fallback;
}

function createVerifier (verifier, options = {}) {
  if (!verifier) {
    throw new Error('verifier is required');
  }

  if (!verifiers[verifier]) {
    throw new Error(`Unsupported verifier: ${verifier}`);
  }

  const config = {
    ...verifiers[verifier].DEFAULTS,
    ...options
  };

  if (!config.apiKey) {
    throw new Error('options.apiKey is required');
  }

  console.log('Verifier:', verifier, config);

  return verifiers[verifier](config);
}

module.exports = { verifiers, createVerifier, detectVerifier };
