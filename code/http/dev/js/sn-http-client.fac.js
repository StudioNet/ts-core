(function () {
    'use strict';

    var httpModule = angular.module("studionet.core.http");

    function HttpRestClient($http, $q, httpHeadersFactory) {
        var factory = this;
        factory.httpHeaders = httpHeadersFactory.new();

        function qfactory() {
            return (function () {
                return $q.defer();
            })();
        }

        function isPromise(promise) {
            return promise && promise.then && typeof (promise.then) === "function";
        }

        function trustAndExec(promise, deferred) {
            if (isPromise(promise)) {
                promise
                    .then(
                        function (result) { deferred.resolve(result.data); },
                        function (failed) { deferred.reject(failed); }
                    );
            }
            return deferred.promise;
        }

        function updateHeaders(config) {
            var cng = {};

            function copyExistsHeaders(heads) {
                for (var h in heads) {
                    factory.httpHeaders.addHeader(h, heads[h]);
                }
            }

            if (config) {
                angular.extend(cng, config);
            }

            if (angular.isObject(cng["headers"])) {
                copyExistsHeaders(cng["headers"]);
            }
            
            if (factory.httpHeaders.hasHeaders()) {
                cng["headers"] = factory.httpHeaders.all();
            }

            return cng;
        }

        factory.get = function (resourceUri) {
            return trustAndExec($http.get(resourceUri, updateHeaders()), qfactory());
        }

        factory.getWith = function (resourceUri, config) {
            return trustAndExec($http.get(resourceUri, updateHeaders(config)), qfactory());
        }

        factory.post = function (resourceUri, data) {
            return trustAndExec($http.post(resourceUri, data, updateHeaders()), qfactory());
        }

        factory.postWith = function (resourceUri, data, config) {
            return trustAndExec($http.post(resourceUri, data, updateHeaders(config)), qfactory());
        }

        factory.put = function (resourceUri, data) {
            return trustAndExec($http.put(resourceUri, data, updateHeaders()), qfactory());
        }

        factory.putWith = function (resourceUri, data, config) {
            return trustAndExec($http.put(resourceUri, data, updateHeaders(config)), qfactory());
        }

        factory.delete = function (resourceUri, config) {
            return trustAndExec($http.delete(resourceUri, updateHeaders(config)), qfactory());
        }

        factory.head = function (resourceUri) {
            return trustAndExec($http.head(resourceUri, updateHeaders()), qfactory());
        }

        factory.headWith = function (resourceUri, config) {
            updateHeaders();
            return trustAndExec($http.head(resourceUri, config), qfactory());
        }

        return factory;
    }

    HttpRestClient.$inject = ["$http", "$q", "HttpHeaders"];
    httpModule.factory("HttpRestClient", HttpRestClient);
})();