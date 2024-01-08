// // This function is used to generate the interface for the widget
// var dataSourceColumns = [];
var dataSourceId = 696452; // TODO get dsId from the dynamic container
var dataSourceName = 'Users'; // TODO get dsId from the dynamic container

// if (Fliplet.DynamicContainer) {
//   this.dataSourceId = await Fliplet.DynamicContainer.get().then(function(
//     container
//   ) {
//     return container.connection().then(function(connection) {
//       debugger;

//       return connection.id;
//     });
//   });
// }
// Fliplet.DataSources.getById(dataSourceId, {
//   attributes: ['columns']
// }).then(async function(dataSource) {
//   debugger;

//   dataSourceColumns = dataSource.columns;
Fliplet.Widget.generateInterface({
  title: 'Search and filter',
  fields: [
    {
      type: 'html',
      html: `<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">List from ${dataSourceName}(ID: <span class="data-source-id">${dataSourceId}</span>)</p>
                    <p style="font-size: 10px; font-weight: 400; color: #E7961E;">To change Data source go to Data Container Settings</p>
                    <hr/>`
    },
    {
      name: 'allowSearching',
      type: 'checkbox',
      label: 'List search',
      options: [{ value: true, label: 'Allow users to search the list' }],
      default: [],
      change: function(value) {
        $(document).find('#searchingOptions').toggle(value.includes(true));
        $(document).find('#searchingOptions').next('.selectize-control').toggle(value.includes(true));
      },
      ready: function() {
        let show = Fliplet.Helper.field('allowSearching').get().includes(true);

        if (show) {
          Fliplet.DataSources.getById(dataSourceId, {
            attributes: ['columns']
          }).then(async function(dataSource) {
            let dataSourceColumns = dataSource.columns;

            dataSourceColumns = dataSourceColumns.map(el => {
              return {
                id: el,
                label: el
              };
            });

            Fliplet.UI.Typeahead('#searchingOptions', {
              freeInput: false,
              options: dataSourceColumns,
              value: []
            });

            let instance = Fliplet.UI.Typeahead('#searchingOptions');
            let thisy = this;

            instance.change(function() {
              debugger;
              thisy.searchingOptionsSelected = instance.get();
            });
          });
        }

        $(document).find('#searchingOptions').toggle(show);
        $(document).find('#searchingOptions').next('.selectize-control').toggle(show);
      }
    },
    {
      name: 'searchingOptionsSelected',
      type: 'hidden'
    },
    {
      type: 'html',
      html: `<div class="form-group fl-typeahead" id="searchingOptions">
        <select placeholder="Start typing..."></select>
      </div>`
    },
    {
      type: 'html',
      html: '<br/>'
    },
    {
      name: 'allowSorting',
      type: 'checkbox',
      label: 'List storting',
      options: [{ value: true, label: 'Allow users to sort the list' }],
      default: [],
      change: function(value) {
        $(document).find('#sortingOptions').toggle(value.includes(true));
        $(document).find('#sortingOptions').next('.selectize-control').toggle(value.includes(true));
      },
      ready: function() {
        let show = Fliplet.Helper.field('allowSorting').get().includes(true);

        if (show) {
          Fliplet.DataSources.getById(dataSourceId, {
            attributes: ['columns']
          }).then(async function(dataSource) {
            let dataSourceColumns = dataSource.columns;

            dataSourceColumns = dataSourceColumns.map(el => {
              return {
                id: el,
                label: el
              };
            });

            Fliplet.UI.Typeahead('#sortingOptions', {
              freeInput: false,
              options: dataSourceColumns,
              value: []
            });
          });
        }

        $(document).find('#sortingOptions').toggle(show);
        $(document).find('#sortingOptions').next('.selectize-control').toggle(show);
      }
    },
    {
      type: 'html',
      html: `<div class="form-group fl-typeahead" id="sortingOptions">
        <select placeholder="Start typing..."></select>
      </div>`
    },
    {
      type: 'html',
      html: '<br/>'
    },
    {
      name: 'bookmarksEnabled',
      type: 'checkbox',
      label: 'Bookmarks',
      options: [{ value: true, label: 'Allow users to filter by bookmarks' }],
      default: []
    },
    {
      type: 'html',
      html: '<br/>'
    },
    {
      name: 'isFilterOnDifferentScreen',
      type: 'checkbox',
      label: 'Filter button',
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

