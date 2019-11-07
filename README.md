# rbackbone
This is a demo project to find out, whether Backbone can be modified to be reactive. Theoretically, the wrapping around getting and setting values and the collection as a representation of arrays should be sufficient to create a reactive library. 

## How to use

Just create a reactive model and a view with a template and that model like so: 

```
const model = new RModel({ 
  value: 5,
  computed: function () {
    return this.get('value') * 5;
  },
});
const view = new RView({
  model,
  template: function () {
    return this.model.get('computed');
  },
});
$('body').append(view.$el);
```

Then you can modify the model

```
model.set('value', 3);
```

and the view will automatically update.
