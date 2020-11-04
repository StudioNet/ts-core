(function () {
    "use strict";

    angular
        .module("sn.core")
        .factory("StringFormat", StringFormatFactory);

    function StringFormatFactory() {
        var factory = this;

        function escapeSpecial(str) {
            var specials = /[|\\{}()[\]^$+*?.]/g;
            return new String(str).replace(specials, "\\$&");
        }

        String.format = function () {
            var unformatedString = arguments[0];
            if (angular.isString(unformatedString)) {
                for (var index = 1; index < arguments.length; index++) {
                    var re = new RegExp("\\{" + (index - 1) + "\\}", "gm");
                    var arg = arguments[index].toString();
                    unformatedString = unformatedString.replace(re, arg);
                }
                return unformatedString;
            }
        };

        String.cut = function (str, iStart, iEnd) {
            var txt = new String(str);
            return txt.substring(0, iStart) + txt.substring(iEnd);
        };

        String.camelize = function (str) {
            var CAMELIZE = /(?:^|[-_])(\w)/g;
            var cml = new String(str).replace(CAMELIZE, function (_, camel) {
                return camel ? camel.toUpperCase() : "";
            });
            return cml;
        };

        String.decamelize = function (str, separator) {
            var DECAMELIZE = /([a-z\d])([A-Z])/g;
            var sep = separator || "-";
            var escapeSeparator = escapeSpecial(sep);

            var dcml = new String(str)
                .replace(DECAMELIZE, "$1" + sep + "$2")
                .replace(new RegExp("(" + escapeSeparator + "[A-Z])([A-Z])", "g"), "$1" + escapeSeparator + "$2")
                .toLowerCase();
            return dcml;
        };

        factory.format = String.format;
        factory.cut = String.cut;
        factory.camelize = String.camelize;
        factory.decamelize = String.decamelize;

        return factory;
    }
})();