// Register this widget instance
Fliplet.Widget.instance({
  name: 'search-and-filter',
  displayName: 'Search and filter',
  template: `
      <div class="search-container">
      <div class="search-filter-container">
        <i class="fa fa-search"></i>
        <input class="search-input" placeholder="Search">
        <input class="search-button" type="button" value="Search">
      </div>
      <div class="action-icons">
        <i class="fa fa-bookmark-o cursor-pointer active bookmark-icon"></i>
        <i class="fa fa-bookmark cursor-pointer bookmark-icon"></i>
        <i class="fa fa-filter cursor-pointer filter-icon"></i>
        <div class="sort-container">
          <i class="fa fa-sort-amount-desc cursor-pointer sort-icon"></i>
          <div class="sort-options-container">
            <ul>
              <li class="sort-option" data-column="Name">
                <span>Name</span>
                <div>
                  <i class="fa fa-sort sort-option-icon active"></i>
                  <i class="fa fa-sort-asc sort-option-icon"></i>
                  <i class="fa fa-sort-desc sort-option-icon"></i>
                </div>
              </li>
              <li class="sort-option" data-column="Surname">
                <span>Surname</span>
                <div>
                  <i class="fa fa-sort sort-option-icon active"></i>
                  <i class="fa fa-sort-asc sort-option-icon"></i>
                  <i class="fa fa-sort-desc sort-option-icon"></i>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `,
  render: {
    ready: function() {
      // Initialize children components when this widget is ready
      let filterAndSearchContainer = this;

      Fliplet.Widget.initializeChildren(filterAndSearchContainer.$el, filterAndSearchContainer);

      filterAndSearchContainer.fields = _.assign(
        {
          isListOnDifferentScreen: [],
          action: { action: 'screen' }
        },
        filterAndSearchContainer.fields
      );

      var bookmarkDataSourceName = 'Global Social Actions';
      var currentDataSourceId = 123; // set it from component dynamic-container
      let screenAction = filterAndSearchContainer.fields.action;
      let isListOnDifferentScreen = filterAndSearchContainer.fields.isListOnDifferentScreen.includes(true);

      var lfdPage = isListOnDifferentScreen ? screenAction : Fliplet.Env.get('pageId');

      $(document)
        .find('.search-input')
        .on('keyup', function(e) {
          if (e.keyCode === 13 && $(this).val()) {
            $('.active.bookmark-icon').hasClass('fa-bookmark')
              ? applyBookmarkedDataAndFilters()
              : applyFilters();
          }
        });

      $(document)
        .find('.search-button')
        .on('click', function() {
          $('.active.bookmark-icon').hasClass('fa-bookmark')
            ? applyBookmarkedDataAndFilters()
            : applyFilters();
        });

      $(document)
        .find('.bookmark-icon')
        .on('click', function() {
          $('.bookmark-icon').toggleClass('active');

          if ($(this).hasClass('fa-bookmark-o')) {
            applyBookmarkedDataAndFilters();
          } else {
            applyFilters();
          }
        });

      $(document)
        .find('.filter-icon')
        .on('click', function() {
          if (isListOnDifferentScreen) {
            Fliplet.Navigate.screen(lfdPage.page, { query: lfdPage.query || '', transition: lfdPage.transition || 'fade' });
          } else {
            $('.active.bookmark-icon').hasClass('fa-bookmark')
              ? applyBookmarkedDataAndFilters()
              : applyFilters();
          }
        });

      $(document)
        .find('.sort-icon')
        .on('click', function() {
          $('.sort-options-container').toggle();
        });

      $(document)
        .find('.sort-option')
        .on('click', function() {
          if ($(this).find('.sort-option-icon.active').hasClass('fa-sort')) {
            resetSortState($(this));
            $(this).find('.fa-sort-asc').addClass('active');
          } else if (
            $(this).find('.sort-option-icon.active').hasClass('fa-sort-asc')
          ) {
            resetSortState($(this));

            $(this).find('.fa-sort-desc').addClass('active');
          } else {
            resetSortState($(this), false);
          }

          $('.active.bookmark-icon').hasClass('fa-bookmark')
            ? applyBookmarkedDataAndFilters()
            : applyFilters();
        });

      function resetSortState($this, reset = true) {
        $(document).find('.sort-option-icon').removeClass('active');

        $(document).find('.sort-option-icon.fa-sort').addClass('active');

        if (reset) {
          $this.find('.sort-option-icon.fa-sort').removeClass('active');
        }
      }

      function applyFilters() {
        var query = collectQuery();

        // TODO apply filters
        if (Fliplet.ListRepeater) {
          return Fliplet.ListRepeater.get().then(function(repeater) {
            repeater.rows.query.where = query.where;

            if (query.order) {
              repeater.rows.query.order = query.order;
            } else {
              delete repeater.rows.query.order;
            }

            repeater.rows.update();
          });
        }

        Fliplet.UI.Toast('Please add List Repeater component');

        return Promise.reject('Please add List Repeater component');
      }

      function applyBookmarkedDataAndFilters() {
        // TODO filter bookmarks data

        if (Fliplet.ListRepeater) {
          return Fliplet.ListRepeater.get().then(function(repeater) {
            var where = {};

            return Fliplet.DataSources.connectByName(
              bookmarkDataSourceName
            ).then(function(connection) {
              return connection
                .find({ where: { 'Data Source Id': currentDataSourceId } })
                .then(function(records) {
                  debugger;

                  if (records) {
                    repeater.rows.query = where;
                    repeater.rows.update();
                  } else {
                    repeater.rows.query = { NoData: true }; // return no results
                    repeater.rows.update();
                  }
                })
                .catch(function() {
                  debugger;
                });
            });
          });
        }

        Fliplet.UI.Toast('Please add List Repeater component');

        return Promise.reject('Please add List Repeater component');
      }

      function collectQuery() {
        var query = {};
        var where = {}; // collect from the filters on the page
        var orderBy = null;

        // SORT ASC/DESC BY COLUMN
        var activeSortAsc = $(document).find('.sort-option-icon.fa-sort-asc.active');
        var activeSortDesc = $(document).find('.sort-option-icon.fa-sort-desc.active');

        if (activeSortAsc.length) {
          orderBy = [[`data.${activeSortAsc.closest('.sort-option').data('column')}`, 'ASC']];
        } else if (activeSortDesc.length) {
          orderBy = [[`data.${activeSortDesc.closest('.sort-option').data('column')}`, 'DESC']];
        }

        if (orderBy) {
          query.order = orderBy;
        }
        // END OF SORT ASC/DESC BY COLUMN

        if (Fliplet.Navigate.query.filtersApplied) {
          return Fliplet.App.Storage.get(lfdPage).then(function(value) {
            query.where = value;

            return query;
          });
        }

        query.where = where;

        return query;
      }
    }
  }
});
