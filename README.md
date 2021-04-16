# @petition-blitz/email-verifiers

Provides a unified interface for checking email address deliverability

## Supported Vendors

* DataValidation
* NeverBounce
* Mailgun

## Installation

```
npm install --save @petition-blitz/email-verifiers
```

## Usage

```js
const { detectVerifier, createVerifier } = require('@petition-blitz/email-verifiers');

// auto-detect verifier from environment variables
let verifier = createVerifier(detectVerifier(process.env));

// manually configure a verifier
let verifier = createVerifier('neverbounce', {
  apiKey: '...',
  accept: [
    // list acceptable grades/scores
  ]
});

// run validator
const isValid = await verifier(data.payload); // returns boolean
```

## License

MIT license
