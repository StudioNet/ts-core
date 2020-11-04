(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridHeader", GridHeaderDirective);

    //GridHeaderDirective.$inject = [''];

    function GridHeaderDirective() {
        var directive = {
            restrict: "E",
            link: function () {
            },
            transclude: true,
            templateUrl: "views/grid.header.tpl.html",
            scope: {
                styles: "@?"
            }
        };
        return directive;
    }
})();