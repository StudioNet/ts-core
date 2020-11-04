(function () {
    "use strict";

    angular
        .module("sn.core")
        .factory("EventsModelBuilder", EventsModelBuilder);

    EventsModelBuilder.$inject = ["$cacheFactory", "EventHandler"];

    function EventsModelBuilder($cacheFactory, $eventHandler) {
        var builder = this;

        var ModelBuilder = (function () {

            function initialize(model, eventsDictionary) {
                angular.forEach(eventsDictionary, function (evtValue, evtKey) {
                    model.put(evtValue, $eventHandler.createHandler(eventsDictionary[evtKey]));
                });
            }

            function Builder(modelName, eventsDictionary) {
                this.events = $cacheFactory("events_" + modelName);
                initialize(this.events, eventsDictionary);
            }

            Builder.prototype.handler = function (handlerName) {
                if (angular.isUndefined(handlerName))
                    throw new Error("Handler name is required");
                if (angular.isUndefined(this.events.get(handlerName)))
                    throw new Error("Handler not exist on the events model");
                return this.events.get(handlerName);
            };

            Builder.prototype.destroy = function () {
                this.events.removeAll();
                this.events.destroy();
            };

            return Builder;

        })();

        builder.build = function (eventsModelName, events) {
            return new ModelBuilder(eventsModelName, events);
        };

        return builder;
    }

})();