require('jquery'); // need to required jquery as backbone depends on it
const { RView, RModel } = require('../src/main')

test('A view updates ', () => {
    const model = new RModel({ value: 5 });
    const view = new RView({
        model,
        template() {
            return this.model.get('value');
        },
    });
    expect(view.$el.prop('outerHTML')).toEqual('<div>5</div>');
    model.set('value', 3);
    expect(view.$el.prop('outerHTML')).toEqual('<div>3</div>');
});