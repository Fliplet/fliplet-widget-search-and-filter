// This function is used to generate the interface for the widget
var dataSourceColumns = [];

Fliplet.Widget.generateInterface({
  title: 'Search and filter',
  // Define the fields that will be available in the interface
  beforeReady() {
    Fliplet.DataSources.getById(696452, {
      attributes: ['columns']
    }).then(function(dataSource) {
      dataSourceColumns = dataSource.columns;
    });
  },
  data: {
    dsColumns: []
  },
  fields: [
    {
      name: 'allowSearching',
      type: 'checkbox',
      label: 'List search',
      options: [{ value: true, label: 'Allow users to search the list' }],
      default: []
    },
    {
      name: 'allowSorting',
      type: 'checkbox',
      label: 'List storting',
      options: [{ value: true, label: 'Allow users to sort the list' }],
      default: [],
      change: function() {
        // $(document).find('#sortingOptions').toggle(value.includes(true));
      },
      ready: function() {
        // $(document).find('#sortingOptions').toggle(
        //   Fliplet.Helper.field('allowSorting').get().includes(true)
        // );
        console.log(dataSourceColumns);
      }
    },
    {
      name: 'bookmarksEnabled',
      type: 'checkbox',
      label: 'Bookmarks',
      options: [{ value: true, label: 'Allow users to filter by bookmarks' }],
      default: []
    },
    {
      name: 'isFilterOnDifferentScreen',
      type: 'checkbox',
      label: '',
      options: [{ value: true, label: 'Filter is on another screen' }],
      default: [],
      change: function(value) {
        Fliplet.Helper.field('action').toggle(value.includes(true));
      },
      ready: function() {
        Fliplet.Helper.field('action').toggle(
          Fliplet.Helper.field('isFilterOnDifferentScreen').get().includes(true)
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
