/// <reference path="../../../../types/typings/index.d.ts" />

export namespace Core.Directives {

    /**
     * Recursive compiler factory 
     */
    export class RecursiveCompilerFactory {
    
        private clr: ng.ICompileService;

        static $inject = ['$compile']
        constructor($compile: ng.ICompileService) {
            this.clr = $compile;
        }

        public compile(element: ng.IAugmentedJQuery, link: ng.IDirectivePrePost) {
           
            let elementContent = element.contents().remove();
            let compiledFunction = null;

            return {
                pre: (link.pre) ? link.pre : null,
                post: function post(scope: ng.IScope, element: ng.IAugmentedJQuery) {
                    if(!angular.isFunction(compiledFunction)) {
                        compiledFunction = this.clr(elementContent);
                    }

                    compiledFunction(scope, function cloned(clonedElement){
                        element.append(clonedElement);
                    });

                    if (angular.isFunction(link.post)) {
                        link.post.apply(null, arguments);
                    }
                }
            };
        }

        public static Instance() {
            var instance = ($compile: ng.ICompileService) => {return new RecursiveCompilerFactory($compile);}
            instance.$inject = ['$compile'];
            return instance;
        }
    }

    angular.module("sn.core.directives")
           .factory("RecursiveCompiler", RecursiveCompilerFactory.Instance());
}