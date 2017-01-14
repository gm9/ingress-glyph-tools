/*
 * Copyright (c) 2015 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

(function(){
    var igt = gm9.IngressGlyphTools;

    // Export:
    igt.ui = {
        // Functions
        putButton: putButton,
        openTextDialog: openTextDialog,
        // Classes
        DataTable: DataTable,
        DataTableRow: DataTableRow,
        DataTableColumnSelector: DataTableColumnSelector,
        DataTableRowFilter: DataTableRowFilter,
        RecordRangeSelector: RecordRangeSelector
    };

    // -------------------------------------------------
    // UI Library
    // -------------------------------------------------
    function putButton(parent, text, onclick){
        var button = document.createElement("input");
        button.type = "button";
        button.value = text;
        button.addEventListener("click", function(e){onclick();}, false);
        parent.appendChild(button);
    }

    function openTextDialog(text, okFunc){
        var dlg = document.createElement("div");
        var textArea = document.createElement("textarea");
        textArea.value = text || "";
        dlg.appendChild(textArea);

        var bottomBar = document.createElement("div");
        dlg.appendChild(bottomBar);

        function close(){
            if(dlg.parentNode){
                dlg.parentNode.removeChild(dlg);
            }
        }
        if(okFunc){
            putButton(bottomBar, "OK", function(){
                okFunc(textArea.value);
                close();
            });
        }
        putButton(bottomBar, "Close", close);

        dlg.style.position = "fixed";
        dlg.style.left = "0";
        dlg.style.top = "0";
        dlg.style.right = "0";
        dlg.style.bottom = "0";
        dlg.style.background = "rgba(128,128,128,0.5)";
        dlg.style.padding = "1em";
        document.body.appendChild(dlg);
    }

    // -------------------------------------------------
    // Data Table UI Library
    // -------------------------------------------------
    function DataTable(columns){
        var element = document.createElement("table");
        element.setAttribute("border", "1");

        var sortOrderColumnIndex = 0;
        var sortAscendant = true;
        var dataRows = [];

        // Header
        var headerTr = document.createElement("tr");
        var headerThs = [];
        for(var ci = 0; ci < columns.length; ++ci){
            var th = document.createElement("th");
            th.style.display = columns[ci].visible ? "" : "none";
            th.appendChild(document.createTextNode(columns[ci].text));
            headerThs.push(th);
            headerTr.appendChild(th);

            (function(columnIndex){
                th.addEventListener("click", function(e){
                    if(columnIndex == sortOrderColumnIndex){
                        sortAscendant = !sortAscendant;
                    }
                    else{
                        sortOrderColumnIndex = columnIndex;
                        sortAscendant = true;
                    }
                    updateTableHeaderSortMark();
                    sortDataRows();
                }, false);
            })(ci);
        }
        element.appendChild(headerTr);

        // Sort Mark
        var sortMark = document.createElement("span");
        function updateTableHeaderSortMark(){
            if(sortMark.parentNode){
                sortMark.parentNode.removeChild(sortMark);
            }
            while(sortMark.firstChild){
                sortMark.removeChild(sortMark.firstChild);
            }
            sortMark.appendChild(document.createTextNode(sortAscendant ? "↓" : "↑"));
            headerThs[sortOrderColumnIndex].appendChild(sortMark);
        }
        updateTableHeaderSortMark();

        // Column
        function setColumnVisible(columnIndex, visible){
            columns[columnIndex].visible = visible; ///@todo ここで変更すべきか、ColumnSelectorで変更すべきか。columnsとColumnSelectorとTableが1対1対多になることがあるのが問題。
            headerThs[columnIndex].style.display = visible ? "" : "none";
            dataRows.forEach(function(r){
                r.setColumnVisible(columnIndex, visible);
            });
        }

        // Row
        function addRow(row){
            element.appendChild(row.getTr());
            for(var ci = 0; ci < columns.length; ++ci){
                row.addColumn(columns[ci].formatter, columns[ci].visible);
            }
            row.update();
            dataRows.push(row);
        };

        function updateAllRows(){
            dataRows.forEach(function(r){r.update();});
        }
        function sortDataRows(){
            dataRows.forEach(function(r){r.getTr().parentNode.removeChild(r.getTr());});
            dataRows.sort(makeDataTableRowComparator(columns, sortOrderColumnIndex, sortAscendant));
            dataRows.forEach(function(r){element.appendChild(r.getTr());});
        }

        // Public Properties
        this.element = element;
        this.sort = sortDataRows;
        this.updateAllRows = updateAllRows;
        this.addRow = addRow;
        this.setColumnVisible = setColumnVisible;
        this.getDataRows = function(){return dataRows;};
    }
    DataTable.formatter = {
        number: function(value){return value.toString();},
        percentage1: function(rate){return (Math.floor(rate*1000)/10).toFixed(1) + "%";},
        averageCount1: function(count){return (Math.floor(count*10)/10).toFixed(1);},
        seconds1: function(sec){return sec.toFixed(3) + "s";}
    };

    function DataTableRow(source){
        var tr = document.createElement("tr");
        this.getTr = function(){ return tr;};
        var cols = [];

        this.addColumn = function(formatter, visible){
            var columnIndex = cols.length;
            var td = document.createElement("td");
            td.style.display = visible ? "" : "none";
            tr.appendChild(td);
            cols.push({td:td, formatter:formatter, source:null, value:undefined});
        };

        this.getColumnValue = getColumnValue;
        function getColumnValue(columnIndex){
            return (columnIndex >= 0 && columnIndex < cols.length) ?
                cols[columnIndex].value : undefined;
        }

        function setColumnValue(columnIndex, value){
            if(columnIndex >= 0 && columnIndex < cols.length){
                var col = cols[columnIndex];
                if(value != col.value){
                    var td = col.td;
                    while(td.firstChild){
                        td.removeChild(td.firstChild);
                    }
                    col.value = value;
                    var formatted = col.formatter ? col.formatter(value) : value.toString();
                    if(typeof(formatted) == "string"){
                        td.appendChild(document.createTextNode(formatted));
                    }
                    else{
                        td.appendChild(formatted);
                    }
                }
            }
        }
        this.setColumnVisible = setColumnVisible;
        function setColumnVisible(columnIndex, visible){
            if(columnIndex >= 0 && columnIndex < cols.length){
                cols[columnIndex].td.style.display = visible ? "" : "none";
            }
        }

        this.update = function(){
            var values = source();
            for(var i = 0; i < values.length; ++i){
                setColumnValue(i, values[i]);
            }
        };
    }
    function makeDataTableRowComparator(columns, columnIndex, ascendant){
        return function(lhs, rhs){
            var comp = columns[columnIndex].comparator || defaultComparator;
            var lv = lhs.getColumnValue(columnIndex);
            var rv = rhs.getColumnValue(columnIndex);
            var delta = comp(lv, rv);
            if(delta == 0){
                var comp0 = columns[0].comparator || defaultComparator;
                var lv0 = lhs.getColumnValue(0);
                var rv0 = rhs.getColumnValue(0);
                delta = comp0(lv0, rv0);
            }
            return ascendant ? delta : -delta;
        };
    }
    function defaultComparator(lhs, rhs){
        return lhs < rhs ? -1 : lhs > rhs ? 1 : 0;
    }


    function DataTableColumnSelector(storageKey, columns, onChangeColumnVisible)
    {
        var targetTable = null;
        this.setTargetTable = setTargetTable;
        function setTargetTable(t){
            targetTable = t;
        }

        function loadSettings(){
            if(window.localStorage){
                var checkedStr = localStorage.getItem(storageKey);
                if(checkedStr){
                    for(var ci = 0; ci < checkedStr.length && ci < columns.length; ++ci){
                        columns[ci].visible = (checkedStr.charAt(ci) == "1");
                    }
                }
            }
        }
        loadSettings();
        function saveSettings(){
            if(window.localStorage){
                localStorage.setItem(storageKey, columns.map(function(c){return c.visible ? "1" : "0";}).join(""));
            }
        }

        var element = document.createElement("p");
        element.style.lineHeight = "1.5";
        this.element = element;

        for(var ci = 0; ci < columns.length; ++ci){
            (function(){
                var columnIndex = ci;
                var checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.checked = columns[ci].visible;
                checkbox.addEventListener("click", function(e){
                    var visible = checkbox.checked;
                    if(onChangeColumnVisible){
                        onChangeColumnVisible(columnIndex, visible);
                    }
                    if(targetTable){
                        targetTable.setColumnVisible(columnIndex, visible);
                    }
                    columns[columnIndex].visible = visible; ///@todo ここで変更すべきか、ColumnSelectorで変更すべきか。columnsとColumnSelectorとTableが1対1対多になることがあるのが問題。
                    saveSettings();
                }, false);
                var label = document.createElement("label");
                label.style.display = "inline-block";
                label.style.paddingRight = "0.5em";
                label.appendChild(checkbox);
                label.appendChild(document.createTextNode(columns[ci].text));
                element.appendChild(label);
            })();
        }
    }

    function DataTableRowFilter(table, columnIndex){
        var sel = document.createElement("select");
        var values = [undefined].concat(table.getDataRows().map(function(row){return row.getColumnValue(columnIndex);}).filter(function(v,i,a){return a.indexOf(v) === i;}).sort());
        values.forEach(function(value){
            var opt = document.createElement("option");
            opt.value = value;
            opt.appendChild(document.createTextNode(value));
            sel.appendChild(opt);
        });
        sel.addEventListener("change", onChange, false);
        function onChange()
        {
            var selectedValue = values[sel.selectedIndex];
            table.getDataRows().forEach(function(row){row.getTr().style.display = (selectedValue === undefined || row.getColumnValue(1) == selectedValue) ? "" : "none";});
        }

        this.element = sel;
    }

    // -------------------------------------------------
    // UI Library for glyph-game-record.js
    // -------------------------------------------------

    function RecordRangeSelector(storageKey, onChange){
        var sel = document.createElement("select");
        var ranges = [
            {value:0, text:"All"},
            {value:1, text:"Today"},
            {value:7, text:"Week"},
            {value:30, text:"Month"}];
        ranges.forEach(function(optData){
            var opt = document.createElement("option");
            opt.value = optData.value;
            opt.appendChild(document.createTextNode(optData.text));
            sel.appendChild(opt);
        });
        function loadSettings(){
            if(window.localStorage){
                var p = parseInt(localStorage.getItem(storageKey));
                if(p >= 0 && p < sel.options.length){
                    sel.selectedIndex = p;
                }
            }
        }
        function saveSettings(){
            if(window.localStorage){
                window.localStorage.setItem(storageKey, sel.selectedIndex);
            }
        }
        sel.addEventListener("change", function(e){
            saveSettings();
            if(onChange){
                onChange();
            }
        }, false);

        // Public Properties
        this.element = sel;
        this.getSelectedRangeDays = function(){
            return ranges[sel.selectedIndex].value;
        };
    }


})();
