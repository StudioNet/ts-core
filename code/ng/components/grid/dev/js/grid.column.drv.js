(function GridColumnDirectiveScope() {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridColumn", GridColumnDirective);

    GridColumnDirective.$inject = ["GridBuilder"];

    function GridColumnDirective($GridBuilder) {
        var directive = {
            require: "^naGrid",
            link: link,
            restrict: "E",
            transclude: true,
            bindToController: {
                binding: "@",
                displayName: "@",
                styles: "@?",
                sortable: "@?",
                sortFactory: "&?",
                filterable: "@?",
                getSortData: "&",
                filterFactory: "&?",
                visible: "@?"
            },
            controller: GridColumnController,
            controllerAs: "columnViewModel",
            templateUrl: "views/grid.column.tpl.html"
        };
        return directive;

        function link(scope, element, attrs, gridCtrl, transclude) {
            scope.columnViewModel.contentTranscluded = $GridBuilder.isContentTranscluded(transclude);
            scope.columnViewModel.myGridId = gridCtrl.gridId();
            gridCtrl.addColumn(scope);
        }
    }

    GridColumnController.$inject = ["$scope", "GridBuilder", "$filter", "GRID_EVENTS", "DirectiveUtil", "$compile"];


    /**Private region */
    function defaultSortStrategy(srcItem, column) {
        debugger;
        return Number(srcItem.rowViewModel.rowItem[column.binding]);
    }

    function columnValidForPopUp(column) {
        if (column) {
            return (column.filterable || column.sortable);
        }
    }

    function GridColumnController($scope, $GridBuilder, $filter, GRID_EVENTS, $utils, $compile) {
        var columnViewModel = this;
        //privates
        columnViewModel.lastSort = {fieldName: "", ascending: true};
        //publics
        columnViewModel.sortable = $utils.directivePropertyAsBool(columnViewModel, "sortable", "true");
        columnViewModel.filterable = $utils.directivePropertyAsBool(columnViewModel, "filterable", "true");
        columnViewModel.visible = $utils.directivePropertyAsBool(columnViewModel, "visible", "true");
        columnViewModel.contentTranscluded = false;
        columnViewModel.myGridId = null;
        columnViewModel.isHighlight = columnViewModel.sortable || columnViewModel.filterable;
        columnViewModel.isAscending = columnViewModel.sortable && columnViewModel.lastSort.ascending;
        columnViewModel.isSortable = columnViewModel.sortable;
        columnViewModel.builder = $GridBuilder;
        columnViewModel.GridEvents = GRID_EVENTS;
        columnViewModel.filter = $filter("orderBy");
        columnViewModel.$scope = $scope;
        columnViewModel.$compile = $compile;
    }

    GridColumnController.prototype.sort = function (sortData) {
        var builder = this.builder.createOrGetExisting(this.myGridId);
        if(sortData){
            builder.setLastSort(sortData);
        }
        //this.builder = builder;
        var externalSorting = false;
        var dataSource = builder.asScope();
        var orderedResult = [];
        var orderedModel = [];

        if (angular.isFunction(this.sortFactory)) {
            orderedResult = this.sortFactory(builder.lastSort);
            externalSorting = true;
        }

        if (!externalSorting) {
            builder.lastSort.fieldName = this.binding;
            orderedResult = this.filter(dataSource, function(srcItem) { defaultSortStrategy.call(srcItem, this);}, builder.lastSort.ascending);
        }

        if (!externalSorting && orderedResult.length > 0) {
            builder.source(orderedResult);
            orderedModel = builder.asModelOnly();
        }

        this.isAscending = builder.lastSort.ascending = !builder.lastSort.ascending;

        //Emit to the controller ordered result
        builder.EventModel.Events.handler(this.GridEvents.OnSort).fire(externalSorting ? orderedResult : orderedModel);
    };

    //TODO: This is very bad approach for sorting component for grid.
    //TODO: Its very coupled to column and can't be changed in the future In addition,
    //TODO: When naSortMenu directive call to the sort method pass itself own scope and cause to exception.
    GridColumnController.prototype.showSortMenuPopup = function showSortMenuPopup(e, headerConfig, gridOptions) {

        var $tpl = $("<div na-sort-menu />"),
            content,
            $buttonEl = $(e.target),
            button,
            dialogSize,
            sortData;

        if (!columnValidForPopUp(headerConfig)) {
            return;
        }

        var remainingSpace = $(document).outerHeight() - $buttonEl.offset().top;
        var popupTop = $buttonEl.offset().top;
        var popupHeight = 375;
        if (remainingSpace < popupHeight) {
            popupTop -= (popupHeight - remainingSpace);
        }
        button = {
            width: $buttonEl.outerWidth(),
            height: $buttonEl.outerHeight(),
            top: popupTop,
            left: $buttonEl.offset().left - 110
        };
        dialogSize = {
            width: 200
        };

        sortData = this.getSortData({fieldName:headerConfig.fieldName});

        if (headerConfig.fieldName === "incident") {
            sortData.sort(function (a, b) {
                a.value - b.value;
            });
        }
        else {
            if (headerConfig.dataType === "time") {
                sortData.sort(function (a, b) {
                    return a.value - b.value;
                });
            }
            else {
                sortData.sort(function (a) {
                    return a.value;
                });
            }
        }

        this.$scope.$sortScope = this.$scope.$new(true); //Generate new isolated child scope for sort popup

        this.$scope.$sortScope.sort = {
            type: headerConfig.dataType,
            fieldName: headerConfig.fieldName,
            filterable: gridOptions.showFilter && headerConfig.filterable,
            sortable: headerConfig.sortable,
            visible: headerConfig.visible,
            data: sortData
        };

        this.$scope.$sortScope.doSort =  this.sort;

        // reCheck if filterable changed due to empty values in grid although flag was true
        if (!columnValidForPopUp(this.$scope.$sortScope.sort)) {
            //headerConfig.filterable = false;
            return;
        }

        this.$scope.$sortScope.filterAlerts = this.$scope.filterAlerts; //Will be undefined on first time
        content = this.$compile($tpl)(this.$scope.$sortScope);
        this.$scope.$sortScope.sortMenuDialog = new window.evc.Dialog({
            className: "sortMenuPopup menuPopup",
            title: "",
            content: content,
            center: false,
            modal: false,
            top: (button.top + button.height) + "px",
            left: button.left + "px",
            width: dialogSize.width + "px",
            height: undefined + "px",
            overlay: {
                visible: false
            },
            styles: {
                "border": "none",
                "padding": 0
            },
            footer: {
                visible: false
            },
            close: {
                visible: true
            },
            triangle: {
                visible: false
            }
        });

    };

})();