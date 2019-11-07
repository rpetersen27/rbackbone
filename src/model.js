const { Model } = require('backbone');
const { isFunction } = require('underscore');

module.exports = Model.extend({
    get: function (attr) {
        const val = Model.prototype.get.call(this, attr);
        if (isFunction(val)) return val.call(this);
        return val;
    },
});
