(function() {
    "use strict";

    angular.module("sn.core")
        .directive("snMouseleave", MouseLeaveDirective);

    MouseLeaveDirective.$inject = ["$parse"];

    function MouseLeaveDirective($parse) {
        return {
            restrict: "A",
            link: function(scope, element, attrs) {
                var onMouseLeave = $parse(attrs.snMouseleave);
                element.bind("mouseleave", function(e) {
                    if(angular.isFunction(onMouseLeave)) {
                        onMouseLeave(scope, {$event: e});
                    }
                });
            }
        };
    }

})();
