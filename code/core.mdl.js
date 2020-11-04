(function () {
    "use strict";
    angular.module("sn.core", []);

    angular.isEmptyObject = function (obj) {
        return angular.isObject(obj) && angular.equals({}, obj);
    };
})();