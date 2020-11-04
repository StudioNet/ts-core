(function () {
    "use strict";

    angular.module("evigilo.na.grid", ["evigilo.na.core"]);

    angular.module("evigilo.na.grid").run(GridInitializator);

    GridInitializator.$inject = ["$templateCache"];

    function GridInitializator($templateCache) {
        /*Here register all templates of the grid parts*/

        $templateCache.put("views/grid.tpl.html", [
            "<div id=\"{{gridViewModel.gridId()}}\" class=\"{{::gridViewModel.styles}}\">",
            "<ng-transclude>",
            "</ng-transclude>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.header.tpl.html", [
            "<div class=\"{{::styles}}\" data-role=\"grid-header\">",
            "<div class=\"row\">",
            "<ng-transclude>",
            "</ng-transclude>",
            "</div>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.column.tpl.html", [
            "<div class=\"{{::columnViewModel.styles}}\">",
            "<div class=\"row\" ng-if=\"!columnViewModel.contentTranscluded\">",
            "<div class=\"col-xs-2\" ng-show=\"columnViewModel.isSortable\" ng-single-click=\"columnViewModel.sort()\" invoke-apply=\"true\">",
            "<text ng-show=\"columnViewModel.isAscending\">&#9650;</text>",
            "<text ng-show=\"!columnViewModel.isAscending\">&#9660;</text>",
            "</div>",
            "<div class=\"col-xs-10\">",
            "<a ng-class=\"{highlight: columnViewModel.isHighlight}\" ng-bind-html=\"columnViewModel.displayName\"></a>",
            "</div>",
            "</div>",
            "<ng-transclude></ng-transclude>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.body.tpl.html", [
            "<div class=\"{{::styles}}\" data-role=\"grid-body\">",
            "<div class=\"row\">",
            "<div class=\"col-xl-12\">",
            "<ng-transclude></ng-transclude>",
            "</div>",
            "</div>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.row.tpl.html", [
            "<div ng-if=\"!rowViewModel.shownRow\" class=\"row grid-empty-row\">&nbsp;</div>",
            "<div id=\"{{rowViewModel.rowContainerId}}\" ng-if=\"rowViewModel.shownRow\" class=\"row {{::rowViewModel.styles}}\"",
                "ng-class=\"{selected: rowViewModel.isRowSelected || rowViewModel.isRowFocused}\"",
                "na-single-click=\"rowViewModel.click($event)\"",
                "ng-dblclick=\"rowViewModel.dblClick($event)\"",
                "na-mouseover=\"rowViewModel.hover($event)\"",
                "na-mouseleave=\"rowViewModel.leave($event)\">",
                "<div class=\"col-xl-12\">",
                    "<div class=\"row grid-row\" id=\"{{rowViewModel.Id}}\">",
                        "<ng-transclude>",
                        "</ng-transclude>",
                    "</div>",
                    "<div class=\"row {{::rowViewModel.containerStyles}}\" id=\"{{rowViewModel.holderId}}\" ng-show=\"rowViewModel.isOpenContainer()\" ng-class=\"{selected: rowViewModel.isRowSelected}\">",
                    "</div>",
                "</div>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.cell.tpl.html", [
            "<div class=\"{{::cellViewModel.styles}}\">",
            "<span ng-if=\"!cellViewModel.contentTranscluded\" ng-bind=\"cellViewModel.binding\"></span>",
            "<ng-transclude></ng-transclude>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.selectable.column.tpl.html", [
            "<div class=\"{{::selectableColumnViewModel.styles}}\">",
            "<div ng-if=\"!selectableColumnViewModel.contentTranscluded\"",
            "ng-single-click=\"selectableColumnViewModel.selectAll()\"",
            "ng-model=\"selectableColumnViewModel.isAllSelected\">",
            "<input type=\"checkbox\" ng-checked=\"selectableColumnViewModel.isAllSelected\"/>",
            "</div>",
            "<ng-transclude></ng-transclude>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.selectable.cell.tpl.html", [
            "<div class=\"{{::selectableCellViewModel.styles}}\">",
            "<div ng-if=\"!selectableCellViewModel.contentTranscluded\" ng-model=\"selectableCellViewModel.isSelect\"",
            "ng-single-click=\"selectableCellViewModel.select($event)\">",
            "<input type=\"checkbox\" ng-checked=\"selectableCellViewModel.isSelect\"/>",
            "</div>",
            "<ng-transclude></ng-transclude>",
            "</div>"
        ].join(""));

        $templateCache.put("views/grid.footer.tpl.html", [
            "<div class=\"{{::styles}}\" data-role=\"grid-footer\">",
            "<div class=\"row\">",
            "<ng-transclude>",
            "</ng-transclude>",
            "</div>",
            "</div>"
        ].join(""));
    }
})();