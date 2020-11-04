(function() {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .directive("naGridBody", GridBodyDirective);

    //GridBodyDirective.$inject = ["$timeout"];
    
    function GridBodyDirective() {
        var directive = {
            restrict: "E",
            transclude: true,
            require: "^naGrid",
            templateUrl: "views/grid.body.tpl.html",
            bindToController: {
                styles:  "@",
                sourceItems: "=?",
                endLessScroll: "@?",
                itemOnDisplay: "@?",
                scrollAreaId: "@?"
            },
            controller: GridBodyController,
            controllerAs: "bodyViewModel",
            link: link
        };
        return directive;
        
        function link (scope, element, attr, gridCtrl) {
            scope.bodyViewModel.gridId = gridCtrl.gridId();
            scope.bodyViewModel.bodyScope = scope;
            scope.bodyViewModel.bodyElement = angular.element(element);
        }
    }
    
    GridBodyController.$inject = ["GridBuilder", "GRID_EVENTS", "DirectiveUtil", "$timeout", "ScrollFactory"];
        
    function GridBodyController($GridBuilder, GRID_EVENTS, $utils, $timeout, $scroll) {
        var bodyViewModel = this;
        bodyViewModel.endLessScroll = $utils.directivePropertyAsBool(bodyViewModel, "endLessScroll", "true"); 
        bodyViewModel.bodyElement = null;
        bodyViewModel.gridId = null;
        bodyViewModel.bodyScope = null;

        /**
         * Iitialize end less scroll body 
         */
        if(bodyViewModel.endLessScroll) {
            if(angular.isUndefined(bodyViewModel.sourceItems))
                throw new Error("Source items array must be initialized...");

            var cancelationToken = $timeout(function() {
                var scroller = $scroll.new(bodyViewModel.bodyElement);
                $GridBuilder.scrollFactory(scroller);
                if(angular.isElement(bodyViewModel.bodyElement)) {
                    var builder = $GridBuilder.createOrGetExisting(bodyViewModel.gridId);
                    bodyViewModel.bodyElement.bind("scroll", function(eventArgs){
                        scroller.setScrollPosition(eventArgs.target.scrollTop);
                        bodyViewModel.bodyScope.$evalAsync(function(){
                            builder.scrollNow(scroller.getScrollTopPosition(), scroller.getBodyHeight());
                        });
                        //eventArgs.target.scrollHeight
                    });
                }
                $timeout.cancel(cancelationToken);
            }, 1000, false);
        }
    }
})();

