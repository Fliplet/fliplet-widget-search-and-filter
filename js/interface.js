Fliplet.Widget.findParents({ filter: { package: 'com.fliplet.dynamic-container' } }).then(async widgets => {
  if (widgets.length === 0) {
    return Fliplet.UI.Toast('This component needs to be placed inside a Dynamic Data Container');
  }

  const dynamicContainer = widgets[0];

  return Fliplet.DataSources.getById(dynamicContainer && dynamicContainer.dataSourceId, {
    attributes: ['name', 'columns']
  }).then(dataSource => {
    const dataSourceColumns = dataSource.columns.map(el => {
      return {
        id: el,
        label: el
      };
    });

    return Fliplet.Widget.generateInterface({
      title: 'Search and filter',
      fields: [
        {
          type: 'html',
          html: `<p style="color: #A5A5A5; font-size: 12px; font-weight: 400;">List from ${dataSource.name}(ID: <span class="data-source-id">${dynamicContainer.dataSourceId}</span>)</p>
                <p style="font-size: 10px; font-weight: 400; color: #E7961E;">To change Data source go to Data Container Settings</p>
                <hr/>`
        },
        {
          name: 'allowSearching',
          type: 'checkbox',
          label: 'List search',
          options: [{ value: true, label: 'Enable list search' }],
          description: 'Select data columns to be available in search',
          default: [],
          change: function(value) {
            $(document).find('#searchingOptions').toggle(value.includes(true));
            $(document).find('#searchingOptions').next('.selectize-control').toggle(value.includes(true));
          },
          ready: function() {
            let show = Fliplet.Helper.field('allowSearching').get().includes(true);
            var value = Fliplet.Widget.getData().searchingOptionsSelected || [];

            Fliplet.UI.Typeahead('#searchingOptions', {
              freeInput: false,
              options: dataSourceColumns,
              value
            });

            let instance = Fliplet.UI.Typeahead('#searchingOptions');

            instance.change(function(value) {
              Fliplet.Widget.getData().fields.searchingOptionsSelected = value;
              instance.set(value, true);
            });

            $(document).find('#searchingOptions').toggle(show);
            $(document).find('#searchingOptions').next('.selectize-control').toggle(show);
          }
        },
        {
          name: 'searchingOptionsSelected',
          type: 'text',
          label: 'Searching Options Selected',
          ready: function() {
            $($(this)[0].$el).find('[data-field="searchingOptionsSelected"]').hide();
          }
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
          label: 'List sorting',
          options: [{ value: true, label: 'Enable list sort' }],
          description: 'Select data columns to be available in sort',
          default: [],
          change: function(value) {
            $(document).find('#sortingOptions').toggle(value.includes(true));
            $(document).find('#sortingOptions').next('.selectize-control').toggle(value.includes(true));
          },
          ready: function() {
            let show = Fliplet.Helper.field('allowSorting').get().includes(true);
            var value = Fliplet.Widget.getData().sortingOptionsSelected || [];

            Fliplet.UI.Typeahead('#sortingOptions', {
              freeInput: false,
              options: dataSourceColumns,
              value
            });

            let instance = Fliplet.UI.Typeahead('#sortingOptions');

            instance.change(function(value) {
              Fliplet.Widget.getData().fields.sortingOptionsSelected = value;
              instance.set(value, true);
            });

            $(document).find('#sortingOptions').toggle(show);
            $(document).find('#sortingOptions').next('.selectize-control').toggle(show);
          }
        },
        {
          name: 'sortingOptionsSelected',
          type: 'text',
          label: 'Sorting Options Selected',
          ready: function() {
            $($(this)[0].$el).find('[data-field="sortingOptionsSelected"]').hide();
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
          options: [{ value: true, label: 'Enable list filtering by bookmarks' }],
          default: []
        },
        {
          type: 'html',
          html: '<br/>'
        },
        {
          name: 'isFilterOnDifferentScreen',
          type: 'checkbox',
          label: 'List filtering',
          description: 'Note that list filter needs to be created separately: add filter container inside data container. Add form fields to create your filters.',
          options: [{ value: true, label: 'List Filter is on another screen' }],
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
          package: 'com.fliplet.link',
          data: function(value) {
            return _.assign({}, value, {
              options: {
                actionLabel: 'Click action'
              }
            });
          }
        }
      ]
    });
  });
});
