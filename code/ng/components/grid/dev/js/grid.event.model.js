(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .factory("GridEventsModel", GridEventsModelFactory);

    angular.module("evigilo.na.grid")
        .constant("GRID_EVENTS", {
            "OnSort": "GRID.ONSORT",
            "OnFilter": "GRID.ONFILTER",
            "OnRowSelect": "GRID.ONROWSELECT",
            "OnRowSelected": "GRID.ONROWSELECTED",
            "OnRowsSelect": "GRID.ONROWSSELECT",
            "OnRowsSelected": "GRID.ONROWSSELECTED",
            "OnRowClick": "GRID.ONROWCLICK",
            "OnRowDblClick": "GRID.ONROWDBLCLICK",
            "OnRowHover": "GRID.ONROWHOVER",
            "OnRowLeave": "GRID.ONROWLEAVE",
            "OnRenderComplete": "GRID.ONRENDERCOMPLETE",
            "OnRowAdded": "GRID.ONROWADDED",
            "OnRowFocus": "GRID.ONROWFOCUS",
            "OnOpenRowContainer": "GRID.ONOPENROWCONTAINER",
            "OnCloseRowContainer": "GRID.ONCLOSEROWCONTAINER"
        });

    GridEventsModelFactory.$inject = ["EventsModelBuilder", "GRID_EVENTS"];

    function GridEventsModelFactory($eventsModelBuilder, GridEvents) {
        var factory = this;

        var GridEventsModel = (function () {
            function EventModel(gridId) {
                this.Events = $eventsModelBuilder.build(gridId, GridEvents);
            }

            return EventModel;
        })();

        factory.new = function (gridId) {
            return new GridEventsModel(gridId);
        };

        return factory;
    }

})();