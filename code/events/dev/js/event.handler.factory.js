(function () {
    "use strict";

    angular
        .module("sn.core")
        .factory("EventHandler", EventHandlerFactory);

    function EventHandlerFactory() {
        var factory = this;

        /**
         * Event Handler
         * */
        var EventHandler = (function () {

            function Listener() {
                this.deregistration = null;
                this.ownerScope = null;
            }

            Listener.prototype.listenerScope = function(scope){
                this.ownerScope = scope;
                return this;
            };

            Listener.prototype.listenerDeregistrator = function(deregistration) {
                this.deregistration = deregistration;
                return this;
            };

            Listener.prototype.id = function() {
                return this.ownerScope.$id;
            };

            Listener.create = function (scope, deregistration) {
                return new Listener().listenerScope(scope).listenerDeregistrator(deregistration);
            };

            function Handler(handlerName) {
                if (angular.isUndefined(handlerName))
                    throw new Error("Handler name is required"); //Handle error properly?

                this.eventName = handlerName;
                this.listeners = {};
            }

            /**
             * Private subscribe and publish method
             */
            function subscribe(eventName, callback, scope) {
                var deregistration = scope.$on(eventName, function ($event, args) {
                    if (!angular.isFunction(callback))
                        throw new TypeError("Callback is not a function");
                    callback(args);
                });
                return Listener.create(scope, deregistration);
            }

            function publish(listeners, eventName, eventArgs, broadcast) {
                angular.forEach(listeners, function(listener, key){
                    publishOne(listener.ownerScope, eventName, eventArgs, broadcast);
                });
            }

            function publishOne(scope, eventName, eventArgs, broadcast) {
                if (scope != null && angular.isDefined(scope) && broadcast) {
                    scope.$broadcast(eventName, eventArgs);
                }
                else {
                    if (scope !== null && angular.isDefined(scope) && scope.$emit) {
                        scope.$emit(eventName, eventArgs);
                    }
                }
            }
            
            function existingListener(listeners, id) {
                if(angular.isDefined(listeners)) {
                    return listeners.hasOwnProperty(id);
                }
                return false; 
            }

            function addListener(listener, listeners){
                if(!existingListener(listeners, listener.id())){
                    listeners[listener.id()] = listener;
                }
            }

            function removeListener(id, listeners) {
                if(existingListener(listeners, id)) {
                    listeners[id].deregistration();
                    delete listeners[id];
                }
            }
            
            Handler.prototype.name = function () {
                return this.eventName;
            };

            Handler.prototype.on = function (scope, handler) {
                if (angular.isUndefined(scope))
                    throw new Error("Scope is required");
                var listener = subscribe(this.eventName, handler, scope);
                addListener(listener, this.listeners);
            };

            Handler.prototype.off = function (scope) {
               removeListener(scope.$id, this.listeners);
            };

            Handler.prototype.fire = function (eventArgs, broadcast) {
                publish(this.listeners, this.eventName, eventArgs, broadcast);
            };

            return Handler;
        })();

        factory.createHandler = function (eventName) {
            return new EventHandler(eventName);
        };

        return factory;
    }

})();