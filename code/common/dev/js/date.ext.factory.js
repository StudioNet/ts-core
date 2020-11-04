/**
 * Date formatter factory object
 * [Depend on the moment js library http://momentjs.com/]
 */
(function () {
    "use strict";

    angular
        .module("sn.core")
        .factory("DateFormat", DateFormatFactory);

    DateFormatFactory.$inject = ["moment"];

    function DateFormatFactory(moment) {
        var factory = this;

        factory.new = function () {
            return new moment();
        };

        factory.toTime = function (timestamp) {
            return factory.new().unix(timestamp).format("hh:mm:ss");
        };

        return factory;
    }
})();