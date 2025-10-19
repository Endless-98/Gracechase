#!/usr/bin/env node
const crypto = require('crypto');

function b64url(buf) { return Buffer.from(buf).toString('base64').replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_'); }

function signToken(payload, secret) {
  const body = Buffer.from(JSON.stringify(payload));
  const sig = crypto.createHmac('sha256', secret).update(body).digest();
  return b64url(body) + '.' + b64url(sig);
}

function usage() {
  console.log('Usage: REDIRECT_TOKEN_SECRET=... node sign-redirect-token.js <subscriberId> <expiresInSeconds>');
}

(async () => {
  const secret = process.env.REDIRECT_TOKEN_SECRET;
  const id = process.argv[2];
  const expires = parseInt(process.argv[3] || '604800', 10); // default 7 days
  if (!secret || !id) { usage(); process.exit(1); }
  const exp = Math.floor(Date.now()/1000) + expires;
  const token = signToken({ id, exp }, secret);
  console.log(token);
})();
