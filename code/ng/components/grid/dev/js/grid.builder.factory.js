/*global angular */
(function () {
    "use strict";

    angular
        .module("evigilo.na.grid")
        .factory("GridBuilder", GridBuilderFactory);


    angular
        .module("evigilo.na.grid").constant("QueueTypeEnum", {
            "FIRST_IN": "FirstIn",
            "LAST_IN": "LastIn"
        });

    angular
        .module("evigilo.na.grid").constant("DisplayQueueItem", 15);

    angular
        .module("evigilo.na.grid")
        .constant("DefaultRowHeight", {
            "EmptyHeight" : 55
        });

    GridBuilderFactory.$inject = ["$compile", "$cacheFactory", "$translate", "StringFormat", "GridEventsModel",
                                    "ComponentBuilder", "QueueTypeEnum", "DisplayQueueItem", "DefaultRowHeight"];

    function GridBuilderFactory($compile, $cacheFactory, $translate, $stringFormat, $GridEventsModel, $ComponentBuilder, QUEUE_TYPE, DisplayQueueItem, DefaultRowHeight) {
        var factory = this;
        //initialize builders dictionary
        var builders = $cacheFactory("builders");
        var scrollerFactory = null;

        var GridBuilder = (function () {
            /**Private region */
            
            var id = null;
            
            function destroyScope(destroyableScope) {
                if(destroyableScope && destroyableScope.$destroy) {
                    destroyableScope.$destroy();
                } 
            }
            
            function destroyColumns(headers) {
                angular.forEach(headers, function(column) {
                    destroyScope(column); 
                });
            }
            
            function destroyBody(body) {
                angular.forEach(body, function(row){
                    if(row.cells && row.cells.length > 0) {
                        angular.forEach(row.cells, function(cell) {
                           destroyScope(cell); 
                        });   
                        destroyScope(row);
                    } 
                });
            }
            
            function updateRowItemProcess(rows, rowKey, rowKeyValue, action, actionInput){
                 angular.forEach(rows, function(row) {
                    if(row.rowViewModel.rowItem.hasOwnProperty(rowKey) && row.rowViewModel.rowItem[rowKey] === rowKeyValue) {
                        if(angular.isFunction(row.rowViewModel[action])) {
                            row.rowViewModel[action](actionInput);
                        }
                    }   
                });    
            }

            function closeOpenedContainers(rows) {
                angular.forEach(rows, function(row) {
                    if(row.rowViewModel.openContainer)
                        row.rowViewModel.unbindContent();
                });
            }

            /**Public  region */
            
            function Builder(clientGridId) {
                this.id = clientGridId;
                this.cacheHolder = $cacheFactory(clientGridId);
                this.cacheHolder.put("headers", []);
                this.cacheHolder.put("body",[]);
                this.cacheHolder.put("previousSource",[]);
                this.EventModel = $GridEventsModel.new(clientGridId);
                this.endLessScoll = false;
            }

            Builder.prototype.lastSort = function () {
                return this.lastSort;
            };

            Builder.prototype.setLastSort = function (lastSort) {
                return this.lastSort = lastSort;
            };

            Builder.prototype.gridId = function () {
                return this.id;
            };

            Builder.prototype.addColumn = function (column) {
                this.cacheHolder.get("headers").push(column);
            };

            Builder.prototype.clearColumns = function () {
                this.cacheHolder.put("headers", []);
            };

            Builder.prototype.addRowItem = function (row) {
                //closeOpenedContainers(this.cacheHolder.get("body"));

                if(row.rowViewModel.queueType == QUEUE_TYPE.FIRST_IN) {
                    this.cacheHolder.get("body").unshift(row);
                    closeOpenedContainers(this.cacheHolder.get("body"));
                }
                else {
                    this.cacheHolder.get("body").push(row);
                }
                //Show only display queue item
                if(this.endLessScoll) {
                    var rowCount = this.rowCount();
                    if (rowCount > DisplayQueueItem) {
                        var unvisibleIndex = rowCount - (rowCount - DisplayQueueItem);
                        this.cacheHolder.get("body")[unvisibleIndex].rowViewModel.show(false);
                    }
                }
            };

            Builder.prototype.startLessScroll = function(onOff) {
                this.endLessScoll = onOff;
            };
            
            Builder.prototype.deleteRowItem = function(rowId) {
                if(angular.isDefined(rowId)) {
                    var src = this.asScope();
                    var removedIdx = -1;
                    if(src != null) {
                        angular.forEach(src, function (row, idx) {
                            if (row.$id == rowId)
                                removedIdx = idx;
                        });
                        if (removedIdx > -1)
                            src.splice(removedIdx, 1);
                    }
                }
            };

            Builder.prototype.clearRows = function () {
                this.cacheHolder.put("body", []);
            };

            Builder.prototype.source = function (data) {
                if (angular.isDefined(data) && angular.isArray(data)) {
                    this.cacheHolder.put("body", data);
                }
                return this.cacheHolder.get("body");
            };

            Builder.prototype.asScope = function () {
                return this.cacheHolder.get("body");
            };

            Builder.prototype.asModelOnly = function () {
                var src = this.asScope();
                var model = [];
                angular.forEach(src, function (item) {
                    model.push(item.rowViewModel.rowItem);
                });
                return model;
            };
            
            Builder.prototype.destroy = function() {
                destroyColumns(this.cacheHolder.get("headers"));
                destroyBody(this.cacheHolder.get("body"));
                this.cacheHolder.removeAll();
                this.cacheHolder.destroy();
            };
            
            Builder.prototype.filterBy = function (filterKeyValuePairs/**collection of key & filtered by it.*/) {
                var src = this.asScope();
                //save data source before filtering
                this.cacheHolder.put("previousSource", angular.copy(this.asModelOnly()));
                var filteredModel = []; 
                angular.forEach(src, function(item) {
                   angular.forEach(filterKeyValuePairs, function(keyValuePair){
                       var rowItem = item.rowViewModel.rowItem;
                       if(angular.isDefined(rowItem[keyValuePair.key]) && rowItem[keyValuePair.key] === keyValuePair.value) {
                           filteredModel.push(rowItem);
                       }
                       item.$destroy();
                   }); 
                });
                return filteredModel;
            };
            
            Builder.prototype.clearFilter = function() {
                return this.cacheHolder.get("previousSource");
            };
            
            Builder.prototype.selectRowItem = function(keyName, keyValue) {
                updateRowItemProcess(this.cacheHolder.get("body"), keyName, keyValue, "select", true);      
            };

            Builder.prototype.unSelectRowItem = function(keyName, keyValue) {
                updateRowItemProcess(this.cacheHolder.get("body"), keyName, keyValue, "select", false);
            };
            
            Builder.prototype.focusRowItem = function(keyName, keyValue) {
                updateRowItemProcess(this.cacheHolder.get("body"), keyName, keyValue, "focus", true);
            };

            Builder.prototype.getRowItem = function(keyName, keyValue) {
                var rowItem = undefined;
                var src = this.asScope();
                var idx = 0;
                if(src != null) {
                    while (idx <= src.length) {
                        var row = src[idx];
                        if (row.rowViewModel.rowItem.hasOwnProperty(keyName) && row.rowViewModel.rowItem[keyName] === keyValue) {
                            rowItem = row.rowViewModel.rowItem;
                            break;
                        }
                        idx++;
                    }
                }
                return rowItem;
            };
            
            Builder.prototype.scrollNow = function (currentScrollTop, currentContainerHeigth) {
                var alertOffset = 500;
                var currentHeight = 0;
                var lastHeight = 0;
                var scrollTop = currentScrollTop - alertOffset;
                var containerHeight = currentContainerHeigth + scrollTop + alertOffset;
                //debugger;
                var src = this.asScope();
                for (var i = 0; i < src.length && src != null; i++) {
                    lastHeight = currentHeight;
                    currentHeight += src[i].rowViewModel.currentHeight;
                    if(!src[i].rowViewModel.shownRow)
                        src[i].rowViewModel.show(currentHeight >= scrollTop && lastHeight <= containerHeight);
                }
            };
            
            Builder.prototype.rowCount = function () {
                return this.cacheHolder.get("body").length ? this.cacheHolder.get("body").length : 0;                                
            };
            
            return Builder;
        })();
        
         
        /**
         * Must be initialized with client grid id
         */
        factory.new = function (id) {
            if (angular.isDefined(id)) {
                var builder = new GridBuilder(id);
                builders.put(builder.gridId(), builder);
                return builder;
            }
            throw new Error("Id is required");
        };

        factory.ROWS_STATES = DefaultRowHeight;

        factory.createOrGetExisting = function (id) {
            if (!angular.isDefined(id)) {
                throw new Error("Id is required");
            }

            var builder = builders.get(id);

            if (!angular.isDefined(builder)) {
                builder = factory.new(id);
            }
            return builder;
        };

        factory.generateKey = function (prefix, suffix) {
            var key = prefix || "";

            function part4() {
                return Math.floor((Math.random() + 1) * 0x10000).toString(16).substring(1);
            }

            function guid() {
                return $stringFormat
                    .format("{0}-{1}-{2}-{3}-{4}",
                        part4() + part4(),
                        part4(),
                        part4(),
                        part4(),
                        part4() + part4() + part4());
            }

            key += "_{0}_{1}";
            return $stringFormat.format(key, guid(), suffix ? suffix : "");
        };

        factory.translate = function (translationId) {
            return $translate(translationId);
        };

        factory.isContentTranscluded = function (transclusionFunc) {
            var transcluded = false;
            if (angular.isFunction(transclusionFunc)) {
                transclusionFunc(function (cloneElem) {
                    transcluded = cloneElem.contents().length > 0;
                });
            }
            return transcluded;
        };
        
        factory.componentBuilder = function () {
            return $ComponentBuilder.builder(); 
        };
        
        factory.bindTransclusionContent = function(element, scope, transclusionFunc) {
            if(angular.isFunction(transclusionFunc) && angular.isElement(element) && angular.isDefined(scope)) {
                transclusionFunc(function(cloneElem) {
                   $compile(cloneElem)(scope);
                   element.empty().append(cloneElem);
                });
            }
        };

        factory.scrollFactory = function(scroller) {
            if(angular.isDefined(scroller)){
                scrollerFactory = scroller;
            }
            return scrollerFactory;
        };

        return factory;
    }
})();