(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridRow", GridRowDirective);

    GridRowDirective.$inject = ["$document"];

    function GridRowDirective($document) {
        var directive = {
            require: "^naGrid",
            bindToController: true,
            controller: GridRowController,
            controllerAs: "rowViewModel",
            link: link,
            restrict: "E",
            transclude: true,
            templateUrl: "views/grid.row.tpl.html",
            scope: {
                rowItem: "=",
                styles: "@?",
                containerStyles : "@?",
                placeHolderContainer: "@?",
                firstIn: "@?"
            }
        };
        return directive;

        function link(scope, element, attrs, gridCtrl) {
            scope.rowViewModel.myGridId = gridCtrl.gridId();
            scope.rowViewModel.myGridScope = gridCtrl.gridScope();
            scope.rowViewModel.myGridCtrl = gridCtrl;

            scope.$watch("rowViewModel.isRowSelected", function(newValue, oldValue) {
                if(newValue != oldValue) {
                    if(newValue) {
                        gridCtrl.onRowSelect(scope.rowViewModel.rowId());
                    }
                    else {
                        gridCtrl.onRowDeselect(scope.rowViewModel.rowId());
                    }
                }
            });

            //Row added to the grid
            gridCtrl.addRow(scope);
            scope.$evalAsync(function() {
                gridCtrl.onRowAdded(scope.rowViewModel.rowItem);
            });

            scope.$on("$destroy", function() {
                scope.rowViewModel.deleteFromSource(scope.$id);
                delete scope.rowViewModel;
            });
        }
    }


    /**Private Area */
    function fireEvent(handlerName, eventArgs, row, builder) {
        builder.createOrGetExisting(row.myGridId)
                .EventModel.Events.handler(handlerName).fire(eventArgs);
    }

    function clearPreviousContent(row) {
        angular.element(row.$document.find("#" + row.holderId)).empty();
    }

    function validateQueueType($utils, row, queueTypes) {
        return ($utils.directivePropertyAsBool(row, "firstIn", "true")) ? queueTypes.FIRST_IN : queueTypes.LAST_IN;
    }

    function safetSelectionState(row) {
        if(row.isRowSelected)
            row.myGridCtrl.onRowSelect(row.rowId());
        else
            row.myGridCtrl.onRowDeselect(row.rowId());
    }

    function calculateCurrentHeight(row) {
        row.currentHeight = angular.element(row.$document.find("#" + row.rowContainerId)).height();
    }

    GridRowController.$inject = ["GridBuilder", "GRID_EVENTS", "$timeout", "DirectiveUtil", "$document", "QueueTypeEnum"];

    /* @ngInject */
    function GridRowController($GridBuilder, GRID_EVENTS, $timeout, $utils, $document, QUEUE_TYPE) {
        var rowViewModel = this;
        rowViewModel.isPlaceHolder = $utils.directivePropertyAsBool(rowViewModel, "placeHolderContainer", "true");
        rowViewModel.Id = $GridBuilder.generateKey();
        rowViewModel.holderId = $GridBuilder.generateKey("placeholder");
        rowViewModel.rowContainerId = $GridBuilder.generateKey("container");
        rowViewModel.cells = [];
        rowViewModel.isRowSelected = false;
        rowViewModel.isRowFocused = false;
        rowViewModel.myGridId = null;
        rowViewModel.myGridScope = null;
        rowViewModel.myGridCtrl = null;
        rowViewModel.shownRow = true;
        rowViewModel.queueType = validateQueueType($utils, this, QUEUE_TYPE);
        rowViewModel.contentBuilder = null;
        rowViewModel.containerCellScope = null;
        rowViewModel.currentHeight = $GridBuilder.ROWS_STATES.EmptyHeight;
        rowViewModel.openContainer = false;
        rowViewModel.wasOpened = false;
        rowViewModel.builder = $GridBuilder;
        rowViewModel.GridEvents = GRID_EVENTS;
        rowViewModel.$timeout = $timeout;
        rowViewModel.$document = $document;

        //Timing management between click and double click
        rowViewModel.tm = { clicked: false, canceled: false };

    }

    //Row API
    GridRowController.prototype.gridId = function () {
        return this.myGridId;
    };

    GridRowController.prototype.deleteFromSource = function(rowId) {
        this.builder.createOrGetExisting(this.myGridId).deleteRowItem(rowId);
    };

    GridRowController.prototype.gridScope = function() {
        return this.myGridScope;
    };

    GridRowController.prototype.rowId = function() {
        return this.Id;
    };

    GridRowController.prototype.placeHolderId = function () {
        return this.isPlaceHolder ? this.holderId : null;
    };

    GridRowController.prototype.isOpenContainer = function () {
        return this.isPlaceHolder && this.openContainer;
    };

    GridRowController.prototype.addCell = function (cell) {
        this.cells.push(cell);
    };

    GridRowController.prototype.hasContainer = function () {
        return this.isPlaceHolder;
    };

    GridRowController.prototype.show = function(shown) {
        this.shownRow = shown;

        if(shown) {
            safetSelectionState(this);
            if(this.wasOpened)
                this.bindContent(this.containerCellScope, this.contentBuilder);
        }
        else {
            if(this.openContainer)
                this.wasOpened = true;
            this.unbindContent();
        }
    };

    GridRowController.prototype.select = function (selected) {
        this.isRowSelected = selected;
        fireEvent(this.GridEvents.OnRowSelected, { selected: selected, item: this.rowItem }, this, this.builder);
    };

    GridRowController.prototype.focus = function (focus) {
        this.isRowFocused = focus;
        fireEvent(this.GridEvents.OnRowFocus, { focused: focus, item: this.rowItem }, this, this.builder);
    };

    GridRowController.prototype.click = function ($evt) {
        $evt.stopPropagation();
        var row = this;
        this.tm.clicked = this.$timeout(function() {
            if(row.tm.canceled == false) {
                row.focus(!row.isRowFocused);
                fireEvent(row.GridEvents.OnRowClick, { result: $evt, item: row }, row, row.builder);
            }
        }, 100, false);
    };

    GridRowController.prototype.dblClick = function ($evt) {
        $evt.stopPropagation();
        var row = this;
        this.tm.canceled = this.$timeout.cancel(this.tm.clicked);
        this.$timeout(function () {
            row.select(!row.isRowSelected);
            fireEvent(row.GridEvents.OnRowDblClick, { result: $evt, item: row.rowItem }, row, row.builder);
            row.tm.canceled = false;
        }, 100, false);
    };

    GridRowController.prototype.hover = function ($evt) {
        $evt.stopPropagation();
        fireEvent(this.GridEvents.OnRowHover, { result: $evt, item: this.rowItem }, this, this.builder);
    };

    GridRowController.prototype.leave = function ($evt) {
        $evt.stopPropagation();
        fireEvent(this.GridEvents.OnRowLeave, { result: $evt, item: this.rowItem }, this, this.builder);
    };

    GridRowController.prototype.bindContent = function(cellScope, contentBuilder) {
        if(!this.openContainer) {
            if (angular.isDefined(contentBuilder)) {
                var rowViewModel = this;
                contentBuilder.buildElement()
                    .insertTo(this.$document.find("#" + this.holderId))
                    .scopeApply(function(){ calculateCurrentHeight(rowViewModel); });

                //change state of the container
                this.contentBuilder = contentBuilder;
                this.containerCellScope = cellScope;
                this.openContainer = true;
                //fireEvent(GRID_EVENTS.OnOpenRowContainer, {item: rowViewModel.rowItem});
            }
        }
    };

    GridRowController.prototype.unbindContent = function(previous) {
        if(this.openContainer) {
            clearPreviousContent(this);

            if (previous) {
                this.containerCellScope.unbindOpenContainerWatcher();
                this.containerCellScope.cellViewModel.openContainer = false;
                this.containerCellScope.bindOpenContainerWatcher();
            }

            this.openContainer = false;
            this.currentHeight = this.builder.ROWS_STATES.EmptyHeight;
            //fireEvent(GRID_EVENTS.OnCloseRowContainer, {item: rowViewModel.rowItem});
        }
    };

    GridRowController.prototype.alreadyBounded = function() {
        return this.openContainer;
    };

})();