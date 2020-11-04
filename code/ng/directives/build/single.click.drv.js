(function() {
    "use strict";

    angular.module("sn.core")
        .directive("snSingleClick", SingleClickDirective);

    SingleClickDirective.$inject = ["$parse", "$timeout"];

    function SingleClickDirective($parse, $timeout) {

        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var naSingleClick = $parse(attrs.snSingleClick);
                if(angular.isFunction(snSingleClick)) {
                    element.bind("click", function (e) {
                        e.stopPropagation();
                        var clickScope = (attrs.clickableScope == "parent") ? scope.$parent : scope;
                        if (attrs.invokeApply == "true") {
                            scope.$applyAsync(function () {
                                snSingleClick(clickScope, {$event: e});
                            });
                        }
                        else {
                            snSingleClick(clickScope, {$event: e});
                        }
                    });
                }

                scope.$on("$destroy", function() {
                    element.unbind("click");
                });
            }
        };
    }

})();

