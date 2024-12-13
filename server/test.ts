import * as crypto from 'crypto';

async function test() {
  return crypto.randomBytes(32).toString('hex');
}

test().then((data) => console.log(data));
