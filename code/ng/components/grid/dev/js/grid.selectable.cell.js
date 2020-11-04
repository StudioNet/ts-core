(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridSelectableCell", GridSelectableCellDirective);

    GridSelectableCellDirective.$inject = ["$compile", "GridBuilder", "GRID_EVENTS"];

    function GridSelectableCellDirective($compile, $GridBuilder, GRID_EVENTS) {
        var directive = {
            bindToController: true,
            transclude: true,
            controller: GridSelectableCellController,
            controllerAs: "selectableCellViewModel",
            require: "^naGridRow",
            link: link,
            restrict: "EA",
            templateUrl: "views/grid.selectable.cell.tpl.html",
            scope: {
                styles: "@?"
            }
        };
        return directive;

        function link(scope, element, attrs, rowCtrl, transclude) {
            scope.selectableCellViewModel.contentTranscluded = $GridBuilder.isContentTranscluded(transclude);
            rowCtrl.addCell(scope);

            if (scope.selectableCellViewModel.contentTranscluded) {
                $GridBuilder.bindTransclusionContent(element, scope, transclude);
            }

            //Watch for select / unselect 
            scope.$watch("selectableCellViewModel.isSelect", function (newValue, oldValue) {
                if (oldValue !== newValue) {
                    //if row already selected don't select it 
                    if (!rowCtrl.isRowSelected && newValue) {
                        rowCtrl.select(newValue);
                    }
                    else if (rowCtrl.isRowSelected && !newValue) { //deselect row
                        rowCtrl.select(newValue);
                    }
                }
            });

            var currentGrid = $GridBuilder.createOrGetExisting(rowCtrl.gridId());

            //Listen for selection event
            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRowsSelect).on(rowCtrl.gridScope(), function (selected) {
                scope.selectableCellViewModel.isSelect = selected;
            });

            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRowSelect).on(rowCtrl.gridScope(), function (args) {
                //console.log(args.rowId + " === " + rowCtrl.rowId());
                if (args.rowId === rowCtrl.rowId()) {
                    scope.selectableCellViewModel.isSelect = args.selected;
                }
            });
        }
    }

    /*@ngInject */
    function GridSelectableCellController() {
        var selectableCellViewModel = this;
        selectableCellViewModel.contentTranscluded = false;
        selectableCellViewModel.isSelect = false;
    }

    GridSelectableCellController.prototype.select = function ($evt) {
        this.isSelect = !this.isSelect;
        if ($evt)
            $evt.stopPropagation();
    };

})();