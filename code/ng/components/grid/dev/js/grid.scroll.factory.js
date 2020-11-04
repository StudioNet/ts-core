(function() {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .factory("ScrollFactory", ScrollFactory);

    function ScrollFactory() {
        var factory = this;

        var scroll = (function() {

            function Scroll(area) {
                this.scrollingArea = area;
                this.startPosition = area[0].scrollTop;
                this.scrollPosition = area[0].scrollTop;
            }

            Scroll.prototype.setScrollPosition = function(unit) {
                this.scrollPosition = unit;
            };

            Scroll.prototype.getScrollTopPosition = function() {
                return this.scrollPosition;
            };

            Scroll.prototype.getBodyHeight = function() {
                return this.scrollingArea[0].offsetHeight;
            };

            Scroll.prototype.updateStartPosition = function() {
                this.startPosition = this.scrollPosition;
            };

            Scroll.prototype.isScrollUp = function() {
                return this.scrollPosition < this.startPosition;
            };

            Scroll.prototype.isScrollDown = function() {
                return this.scrollPosition > this.startPosition;
            };

            Scroll.prototype.isEOS = function() {
                if(this.isScrollDown()) {
                    return this.scrollingArea.scrollTop() + this.scrollingArea[0].offsetHeight >= this.scrollingArea[0].scrollHeight;
                }

                if(this.isScrollUp()) {
                    return this.scrollingArea.scrollTop() <= 0;
                }

                return false;
            };

            return Scroll;
        })();

        factory.new = function(areaElement) {
            return new scroll(areaElement);
        };

        return factory;
    }

})();