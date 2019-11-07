const { View } = require('backbone');
const { isFunction } = require('underscore');
const store = require('./store');

module.exports = View.extend({

    constructor: function (opt) {
        View.prototype.constructor.apply(this, arguments);
        this.template = opt.template || this.template;
        this.notify();
    },

    notify() {
        store.dep = this;
        this.$el.empty().append(
            isFunction(this.template) ? this.template.call(this) : this.template
        );
        store.dep = undefined;
    },

});
