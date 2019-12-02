const test = require('ava');

const Script = require('./babsi');

test('should return object of Babsi', t => {
  const script = new Script(false);
  t.true(script instanceof Script);
});

test('should return false if IntersectionObserver is not supported', t => {
  const script = new Script(false);
  t.false(script.checkCompatibility());
});

test('should return true if IntersectionObserver is supported', t => {
  const script = new Script(false);
  const fakeWindow = {
    IntersectionObserver: 1
  };
  t.true(script.checkCompatibility(fakeWindow));
});
