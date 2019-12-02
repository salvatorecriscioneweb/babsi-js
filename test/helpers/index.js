const Script = require('../../lib/babsi');

function beforeEach(t) {
  const script = new Script({});
  Object.assign(t.context, {script});
}

module.exports = {beforeEach};
