(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridCell", GridCellDirective);

    GridCellDirective.$inject = ["GridBuilder"];

    function GridCellDirective($GridBuilder) {
        var directive = {
            bindToController: true,
            controller: GridCellController,
            controllerAs: "cellViewModel",
            require: "^naGridRow",
            link: link,
            restrict: "E",
            transclude: true,
            templateUrl: "views/grid.cell.tpl.html",
            scope: {
                styles: "@?",
                binding: "@?",
                placeHolderContent: "=?",
                transcludedType: "@?"
            }
        };
        return directive;

        function link(scope, element, attrs, rowCtrl, transclude) {

            scope.cellViewModel.placeHolderId = rowCtrl.placeHolderId();
            rowCtrl.addCell(scope);

            if (scope.cellViewModel.transcludedType != "directive") {
                scope.cellViewModel.contentTranscluded = $GridBuilder.isContentTranscluded(transclude);
                if (scope.cellViewModel.contentTranscluded) {
                    $GridBuilder.bindTransclusionContent(element, scope, transclude);
                }
            }
            else {
                scope.cellViewModel.contentTranscluded = true;
            }

            function openContainerWatcher(newValue, oldValue) {
                if (newValue != oldValue && rowCtrl.hasContainer()) {
                    //debugger;
                    if(newValue) {
                        if(rowCtrl.alreadyBounded())
                            rowCtrl.unbindContent(true);
                        rowCtrl.bindContent(scope, scope.cellViewModel.contentBuilder);
                    }
                    else {
                        rowCtrl.unbindContent();
                    }
                }
            }
            
            scope.bindOpenContainerWatcher = function () {
                scope.unbindOpenContainerWatcher = scope.$watch("cellViewModel.openContainer", openContainerWatcher);    
            };
            
            scope.unbindOpenContainerWatcher = scope.$watch("cellViewModel.openContainer", openContainerWatcher);
        }
    }

    GridCellController.$inject = ["GridBuilder", "$timeout"];

    /*@ngInject */
    function GridCellController($GridBuilder, $timeout) {
        var cellViewModel = this;
        cellViewModel.Id = $GridBuilder.generateKey();
        cellViewModel.contentTranscluded = false;
        cellViewModel.placeHolderId = null;
        cellViewModel.openContainer = false;
        cellViewModel.contentBuilder = $GridBuilder.componentBuilder();

        if(angular.isObject(cellViewModel.placeHolderContent) && angular.isObject(cellViewModel.placeHolderContent.scope)) {
            //debugger;
            if(angular.isDefined(cellViewModel.placeHolderContent.scope["onCloseCallback"])) {
                cellViewModel.placeHolderContent.scope["onCloseCallback"] = function onCloseCallback() { cellViewModel.bindContainerContent(); };
            }
        }

        if(angular.isDefined(cellViewModel.placeHolderContent) 
                    && angular.isDefined(cellViewModel.placeHolderContent["immediatelyBind"]) 
                    && cellViewModel.placeHolderContent["immediatelyBind"]) {
                        
            var cancelationToken = $timeout(function () {
                cellViewModel.bindContainerContent();
                $timeout.cancel(cancelationToken);
            }, 0, false);
        }
    }

    /*
     * Call this API method from cell when you need open content within container row
     * */
    GridCellController.prototype.bindContainerContent = function () {
        //TODO: if need release  old scope and build new un remark this row
        //cellViewModel.contentBuilder = $GridBuilder.componentBuilder();
        if (angular.isObject(this.placeHolderContent)) {
            //debugger;
            this.openContainer = !this.openContainer;

            if (!this.contentBuilder.alreadyBuilt(this.placeHolderContent.component)) {
                this.contentBuilder
                    .name(this.placeHolderContent.component)
                    .bindAs(this.placeHolderContent.bindAs)
                    .contentScope(this.placeHolderContent.scope);
            }
        }
    };

})();