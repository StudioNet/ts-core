(function () {
    'use strict';

    var httpModule = angular.module("studionet.core.http");

    function HttpHeadersCollection(collections, dictionaryFactory) {
        var factory = this;

        var HttpHeaders = (function () {
            function Headers() {
                this.headers = dictionaryFactory.new();
            }

            Headers.prototype.addHeader = function (key, value) {
                if (angular.isDefined(key) && angular.isDefined(value)) {
                    this.headers.setValue(key, value);
                }
            }

            Headers.prototype.removeHeader = function (key) {
                if (angular.isDefined(key) && this.headers.contains(key)) {
                    this.headers.remove(key);
                }
            }

            Headers.prototype.updateHeader = function (key, newValue) {
                if (angular.isDefined(key) && angular.isDefined(newValue) && this.headers.contains(key)) {
                    this.headers.setValue(key, newValue);
                }
            }

            Headers.prototype.all = function () {
                var heads = {};

                this.headers.forEach(function (key, value) {
                    heads[key] = value;
                });

                return heads;
            }

            Headers.prototype.hasHeaders = function () {
                return this.headers.length() > 0;
            }

            return Headers;
        })();

        factory.new = function () {
            return new HttpHeaders();
        }

        return factory;
    }

    HttpHeadersCollection.$inject = ["CollectionsUtil", "Dictionary"];
    httpModule.factory("HttpHeaders", HttpHeadersCollection);
})();