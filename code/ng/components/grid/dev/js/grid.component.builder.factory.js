(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .factory("ComponentBuilder", ComponentBuilderFactory);

    ComponentBuilderFactory.$inject = ["$compile", "DirectiveUtil", "$rootScope", "$timeout"];

    function ComponentBuilderFactory($compile, $directiveUtil, $rootScope, $timeout) {
        var factory = this;

        var ComponentBuilder = (function () {

            function nameRequired(name) {
                if (angular.isUndefined(name))
                    throw new Error("Component name is required");
            }

            function controllerExist(model) {
                return model.controllerAs !== null && angular.isDefined(model.controllerAs);
            }

            //TODO: may be implement later
            function bindToController(model, scope) {
                model.componentScope[model.controllerAs] = (angular.isDefined(scope))
                    ? angular.merge(model.componentScope[model.controllerAs], scope) : null;
            }

            function newMerge(componentScope, contentScope) {
                angular.forEach(contentScope, function (value, key) {
                    if (!angular.isDefined(componentScope[key])) {
                        componentScope[key] = contentScope[key];
                    }
                });
                return componentScope;
            }

            function bindToScope(model, scope) {
                model.componentScope =  newMerge(model.componentScope, scope);
            }

            function denormalizeAttrs(scope) {
                var attrs = "";
                angular.forEach(scope, function (value, key) {

                    var attr = "";
                    if (angular.isObject(value))
                        attr = $directiveUtil.buildKeyPairAttribute($directiveUtil.decamelizeProperty(key, "-"), key);
                    else if(angular.isFunction(value)) {
                        attr = $directiveUtil.buildKeyPairAttribute($directiveUtil.decamelizeProperty(key, "-"), value.name);
                    }
                    else
                        attr = $directiveUtil.buildKeyPairAttribute($directiveUtil.decamelizeProperty(key, "-"), value);
                    attrs += attr + " ";
                });
                return attrs;
            }

            function createElement(model, container) {
                var component = "";
                var attrs = denormalizeAttrs(model.contentScope);
                switch (model.componentBindAs) {
                    case "E" : {
                        component += "<" + model.componentName + " " + attrs + "></" + model.componentName + ">";
                        break;
                    }
                    case "A" : {
                        component += "<div " + model.componentName + " " + attrs + "></div>";
                        break;
                    }
                }
                model.linkingFunc = $compile(component);
                model.componentElement = model.linkingFunc(model.componentScope);
            }

            function componentBuilder(scope) {
                this.model = {
                    componentScope: scope,
                    contentScope: null,
                    componentName: "empty",
                    componentBindAs: "E",
                    componentElement: null,
                    controllerAs: null,
                    linkingFunc: null
                };
            }

            componentBuilder.prototype.name = function (componentName) {
                nameRequired(componentName);
                this.model.componentName = componentName;
                return this;
            };

            componentBuilder.prototype.alreadyBuilt = function(name) {
                return this.model.componentName === name;
            };

            componentBuilder.prototype.bindAs = function (bindAs) {
                this.model.componentBindAs = bindAs || "E";
                return this;
            };

            componentBuilder.prototype.controllerAs = function (controllerAlias) {
                this.model.controllerAs = controllerAlias || null;
                return this;
            };

            componentBuilder.prototype.contentScope = function (scope) {
                //debugger;
                this.model.contentScope = scope;
                bindToScope(this.model, scope);
                return this;
            };

            componentBuilder.prototype.buildElement = function (containerElement) {
                //debugger;
                nameRequired(this.model.componentName);
                createElement(this.model, containerElement);
                return this;
            };

            componentBuilder.prototype.insertTo = function (containerElement) {
                if (!angular.isElement(containerElement))
                    throw new Error("Container element is not a DOM element");
                containerElement.empty().prepend(this.model.componentElement);
                return this;
            };

            componentBuilder.prototype.scopeApply = function (callback) {
                if (angular.isDefined(this.model.componentScope)) {
                    this.model.componentScope.$applyAsync(callback);
                }
            };

            componentBuilder.prototype.destroyScope = function() {
                if (angular.isDefined(this.model.componentScope)) {
                    this.model.componentScope.$destroy();
                    this.model.componentScope = null;
                }
            };

            return componentBuilder;
        })();

        factory.builder = function () {
            return new ComponentBuilder($rootScope.$new(true /*isolated*/));
        };

        return factory;
    }

})();