/**
 * Created by iraor108 on 4/18/16.
 */
(function() {
    "use strict";

    angular.module("sn.core")
        .directive("snMouseover", MouseOverDirective);

    MouseOverDirective.$inject = ["$parse"];

    function MouseOverDirective($parse) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var onMouseOver = $parse(attrs.snMouseover);
                element.bind("mouseover", function(e) {
                    if(angular.isFunction(onMouseOver)) {
                        onMouseOver(scope, {$event: e});
                    }
                });
            }
        };
    }

})();
