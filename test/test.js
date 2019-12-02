const test = require('ava');

const Script = require('..');

test('should return object of Babsi', t => {
  const script = new Script(false);
  t.true(script instanceof Script);
});
