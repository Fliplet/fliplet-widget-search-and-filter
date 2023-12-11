// This function is used to generate the interface for the widget
Fliplet.Widget.generateInterface({
  title: 'Search and filter',
  // Define the fields that will be available in the interface
  fields: [
    {
      name: 'isListOnDifferentScreen',
      type: 'checkbox',
      label: 'List is on the different screen than filter',
      options: [{ value: true, label: 'yes' }],
      default: [],
      change: function(value) {
        Fliplet.Helper.field('action').toggle(value.includes(true));
      },
      ready: function() {
        Fliplet.Helper.field('action').toggle(
          Fliplet.Helper.field('isListOnDifferentScreen').get().includes(true)
        );
      }
    },
    {
      name: 'action',
      type: 'provider',
      label: 'Select a screen with filter',
      package: 'com.fliplet.link'
    }
  ]
});
