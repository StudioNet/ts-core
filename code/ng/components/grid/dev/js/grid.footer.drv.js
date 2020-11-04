(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridFooter", GridFooterDirective);

    //GridFooterDirective.$inject = [];

    function GridFooterDirective() {
        var directive = {
            restrict: "E",
            transclude: true,
            templateUrl: "views/grid.footer.tpl.html",
            scope: {
                styles: "@"
            }
        };
        return directive;
    }
})();