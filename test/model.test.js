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