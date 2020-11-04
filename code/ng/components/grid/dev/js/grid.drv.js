///<reference path="grid.builder.factory.js"/>

(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGrid", GridDirective);

    function GridDirective() {
        var directive = {
            bindToController: true,
            controller: GridDirectiveController,
            controllerAs: "gridViewModel",
            link: function link(scope) {
                //self referencing scope.
                scope.gridViewModel.Scope = scope;
            },
            restrict: "E",
            templateUrl: "views/grid.tpl.html",
            transclude: true,
            scope: {
                clientId: "@",
                styles: "@"
            }
        };
        return directive;
    }

    GridDirectiveController.$inject = ["GridBuilder", "GRID_EVENTS"];

    /*@ngInject */
    function GridDirectiveController($GridBuilder, GRID_EVENTS) {
        var gridViewModel = this;
        gridViewModel.Scope = null;
        var currentGrid = $GridBuilder.createOrGetExisting(gridViewModel.clientId);

        gridViewModel.gridId = function () {
            return currentGrid.gridId();
        };

        gridViewModel.gridScope = function () {
            return gridViewModel.Scope;
        };

        gridViewModel.addColumn = function (column) {
            currentGrid.addColumn(column);
        };

        gridViewModel.addRow = function (row) {
            currentGrid.addRowItem(row);
        };

        /**Internal events*/
        gridViewModel.onSelectAll = function () {
            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRowsSelect).fire(true, true/*broadcasted*/);
        };

        gridViewModel.onDeselectAll = function () {
            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRowsSelect).fire(false, true/*broadcasted*/);
        };

        gridViewModel.onRowSelect = function (rowId) {
            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRowSelect).fire({
                selected: true,
                rowId: rowId
            } /*select*/, true /*broadcasted*/);
        };

        gridViewModel.onRowDeselect = function (rowId) {
            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRowSelect).fire({
                selected: false,
                rowId: rowId
            } /*select*/, true /*broadcasted*/);
        };

        /**Public events*/
        gridViewModel.onRenderComplete = function () {
            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRenderComplete).fire({rows: currentGrid.rowCount()});
        };

        gridViewModel.onRowAdded = function (rowItem) {
            currentGrid.EventModel.Events.handler(GRID_EVENTS.OnRowAdded).fire({item: rowItem});
        };
    }
})();