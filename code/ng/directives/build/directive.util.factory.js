(function () {
    "use strict";

    angular
        .module("sn.core")
        .factory("DirectiveUtil", DirectiveUtilFactory);

    DirectiveUtilFactory.$inject = ["$parse", "$compile", "StringFormat"];

    function DirectiveUtilFactory($parse, $compile, $string) {
        var factory = this;

        factory.directivePropertyAsBool = function (context, propertyName, strBool) {
            return context.hasOwnProperty(propertyName) && context[propertyName] === strBool;
        };

        factory.camelizeProperty = function (propertyName) {
            return $string.camelize(propertyName);
        };

        factory.decamelizeProperty = function (propertyName, separater) {
            return $string.decamelize(propertyName, separater);
        };

        factory.buildKeyPairAttribute = function (decamelized, propertyName) {
            return $string.format("{0}=\"{1}\"", decamelized, propertyName);
        };

        return factory;
    }
})();