(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridSelectableColumn", GridSelectableColumnDirective);

    GridSelectableColumnDirective.$inject = ["GridBuilder"];

    function GridSelectableColumnDirective($GridBuilder) {
        var directive = {
            bindToController: true,
            transclude: true,
            controller: GridSelectableColumnController,
            controllerAs: "selectableColumnViewModel",
            require: "^naGrid",
            link: link,
            restrict: "E",
            templateUrl: "views/grid.selectable.column.tpl.html",
            scope: {
                styles: "@?",
                binding: "@?"
            }
        };

        return directive;

        function link(scope, element, attrs, gridCtrl, transclude) {
            scope.selectableColumnViewModel.gridId = gridCtrl.gridId();
            scope.selectableColumnViewModel.contentTranscluded = $GridBuilder.isContentTranscluded(transclude);
            gridCtrl.addColumn(scope);

            if (scope.selectableColumnViewModel.contentTranscluded) {
                $GridBuilder.bindTransclusionContent(element, scope, transclude);
            }

            //Watch for select all / unselect all
            scope.$watch("selectableColumnViewModel.isAllSelected", function (newValue, oldValue) {
                if (oldValue !== newValue) {
                    if (newValue)
                        gridCtrl.onSelectAll();
                    else
                        gridCtrl.onDeselectAll();
                }
            });
        }
    }

    /*@ngInject */
    function GridSelectableColumnController() {
        var selectableColumnViewModel = this;
        selectableColumnViewModel.contentTranscluded = false;
        selectableColumnViewModel.isAllSelected = false;
        selectableColumnViewModel.gridId = null;
    }

    GridSelectableColumnController.prototype.selectAll = function () {
        this.isAllSelected = !this.isAllSelected;
    };

})();