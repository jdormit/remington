var values = require('object.values');
if (!Object.values) {
    values.shim();
}
var Remington = module.exports = require('./lib/remington');
