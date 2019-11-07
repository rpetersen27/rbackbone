const { RModel } = require('../src/main')

test('A model returns calculated values', () => {
    const model = new RModel({
        value: 5,
        computed: function () {
            return this.get('value') * 5;
        },
    });
    expect(model.get('computed')).toBe(25);
    model.set('value', 10);
    expect(model.get('computed')).toBe(50);
});

test('A calculated value will be updated without being got', () => {
    const model = new RModel({
        value: 5,
        computed: function () {
            return this.get('value') * 5;
        },
    });
    expect(model.attributes.computed.cache).toBe(25);
    model.set('value', 10);
    expect(model.attributes.computed.cache).toBe(50);
});

test('A calculated value will remove its dependencies if necessary', () => {
    const model = new RModel({
        a: true,
        b: true,
        computed: function () {
            return this.get('a') && this.get('b');
        },
    });
    expect(model.get('computed')).toBe(true);

    const spy = jest.spyOn(model.attributes.computed, 'execute');
    expect(spy.mock.calls.length).toBe(0);

    model.set('a', false);
    expect(model.get('computed')).toBe(false);
    expect(spy.mock.calls.length).toBe(1);

    model.set('b', false);
    expect(model.get('computed')).toBe(false);
    expect(spy.mock.calls.length).toBe(1);
});