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

test('computed of computed property', () => {
    const model = new RModel({
        value: 5,
        belowTen: function () {
            return this.get('value') < 10;
        },
        invert: function () {
            return !this.get('belowTen');
        },
    });

    expect(model.get('belowTen')).toBe(true);
    expect(model.get('invert')).toBe(false);

    const spyBelowTen = jest.spyOn(model.attributes.belowTen, 'execute');
    const spyInvert = jest.spyOn(model.attributes.invert, 'execute');

    model.set('value', 7);

    expect(model.get('belowTen')).toBe(true);
    expect(model.get('invert')).toBe(false);
    expect(spyBelowTen.mock.calls.length).toBe(1);
    expect(spyInvert.mock.calls.length).toBe(0);

    model.set('value', 12);

    expect(model.get('belowTen')).toBe(false);
    expect(model.get('invert')).toBe(true);
    expect(spyBelowTen.mock.calls.length).toBe(2);
    expect(spyInvert.mock.calls.length).toBe(1);
});

test('compute values from different models', () => {
    const m1 = new RModel({ value: 3 });
    const m2 = new RModel({ value: 7 });
    const m3 = new RModel({
        computed: function () {
            return m1.get('value') * m2.get('value');
        },
    });
    expect(m3.get('computed')).toBe(21);

    m1.set('value', 4);
    expect(m3.get('computed')).toBe(28);

    m2.set('value', 5);
    expect(m3.get('computed')).toBe(20);
});
