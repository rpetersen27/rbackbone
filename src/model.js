const { Model, Events } = require('backbone');
const { each, extend, isFunction, isObject } = require('underscore');
const store = require('./store');

function makeDependency(attr, value) {
    const model = this;
    if (isFunction(value)) {
        value.cache = undefined;
        value.execute = function () {
            const temp = store.dep;
            store.dep = value;
            value.stopListening();
            const result = value.call(model);
            store.dep = temp;
            return result;
        };
        value.notify = function () {
            const next = value.execute();
            if (value.cache === next) return;
            value.cache = next;
            model.trigger('change:' + attr, model, next);
        };
        extend(value, Events);
        value.cache = value.execute();
    }
}

module.exports = Model.extend({
    get(attr) {
        if (store.dep) {
            store.dep.listenTo(this, `change:${attr}`, store.dep.notify);
        }
        let val = Model.prototype.get.call(this, attr);
        if (isFunction(val)) return val.cache;
        return val;
    },
    set(attr, value, options) {
        const result = Model.prototype.set.call(this, attr, value, options);
        if (isObject(attr)) each(attr, (value, key) => makeDependency.call(this, key, value));
        else makeDependency.call(this, attr, value);
        return result;
    },
});
