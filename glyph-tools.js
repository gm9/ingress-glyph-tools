/*
 * Copyright (c) 2014 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

(function(window){
    //
    // Grid & Node Position
    //
    // Node Indices:
    //         0
    //   5            1
    //      9      6
    //         10
    //      8      7
    //   4            2
    //         3
    //

    var RT3 = Math.sqrt(3);
    var NODE_POS = [
        [0,-1],
        [RT3/2,-1/2],
        [RT3/2,1/2],
        [0,1],
        [-RT3/2,1/2],
        [-RT3/2,-1/2],
        [RT3/4,-1/4],
        [RT3/4,1/4],
        [-RT3/4,1/4],
        [-RT3/4,-1/4],
        [0,0]];

    function getNodePosX(glyphCenterX, glyphRadius, nodeIndex)
    {
        return glyphCenterX + glyphRadius*NODE_POS[nodeIndex][0];
    }
    function getNodePosY(glyphCenterY, glyphRadius, nodeIndex)
    {
        return glyphCenterY + glyphRadius*NODE_POS[nodeIndex][1];
    }

    function getNodeIndexAtPosition(glyphCenterX, glyphCenterY, glyphRadius, nodeRadius, x, y)
    {
        var nodeRadius2 = nodeRadius*nodeRadius;
        for(var ni = 0; ni < NODE_POS.length; ++ni){
            var dx = getNodePosX(glyphCenterX, glyphRadius, ni) - x;
            var dy = getNodePosY(glyphCenterY, glyphRadius, ni) - y;
            if(dx*dx + dy*dy <= nodeRadius2){
                return ni;
            }
        }
        return -1;
    }

    // Private functions

    function uniqueSortedArray(arr, funLess)
    {
        if(arr.length == 0){
            return;
        }
        if(!funLess){funLess = function(a, b){return a < b;};}

        var j = 1;
        for(var i = 1; i < arr.length; ++i){
            if(funLess(arr[j - 1], arr[i])){
                if(j != i){
                    arr[j] = arr[i];
                }
                ++j;
            }
        }
        arr.splice(j, arr.length - j);
    }

    //
    // Set(ordered container)
    //
    function Set(keyComp)
    {
        this.values = [];
        this.keyComp = keyComp;
    }
    Set.prototype = {
        size: function(){
            return this.values.length;
        },
        at: function(i){
            return this.values[i];
        },
        add: function(value){
            var i = this.lowerBound(value);
            if(i == this.values.length || this.keyComp(value, this.values[i])){
                this.insert(i, value);
                return true;
            }
            else{
                return false;
            }
        },
        addMulti: function(value){
            this.insert(this.lowerBound(value), value);
        },
        insert: function(i, value){
            this.values.splice(i, 0, value);
        },
        push: function(value){
            this.values.push(value);
        },
        pop: function(){
            return this.values.pop();
        },
        lowerBound: function(value){
            ///@todo binary search?
            var i;
            for(i = 0; i < this.values.length; ++i){
                if(!this.keyComp(this.values[i], value)){
                    break;
                }
            }
            return i;
        },
        sort: function(){
            var keyComp = this.keyComp;
            this.values.sort(
                function comp(a, b){
                    return keyComp(a, b) ? -1 :
                        keyComp(b, a) ? 1 :
                        0;
                });
            return this;
        },
        sortAndUnique: function(){
            if(this.values.length >= 1){
                this.sort();
                uniqueSortedArray(this.values, this.keyComp);
            }
            return this;
        },
        clone: function(){
            var newSet = new Set();
            newSet.values = this.values.slice(0);
            newSet.keyComp = this.keyComp;
            return newSet;
        }
    };


    //
    // Edge
    //

    function Edge(nodeIndexA, nodeIndexB)
    {
        if(nodeIndexA > nodeIndexB){
            var tmp = nodeIndexA;
            nodeIndexA = nodeIndexB;
            nodeIndexB = tmp;
        }

        this.a = nodeIndexA;
        this.b = nodeIndexB;
    }
    Edge.prototype = {
        isValid: function(){
            return this.a < this.b &&
                this.a >= 0 && this.a < NODE_POS.length &&
                this.b >= 0 && this.b < NODE_POS.length;
        }
    };
    Edge.compare = function(edgeA, edgeB){
        return edgeA.a > edgeB.a ? 1 :
            edgeA.a < edgeB.a ? -1 :
            edgeA.b > edgeB.b ? 1 :
            edgeA.b < edgeB.b ? -1 :
            0;
    };
    Edge.less = function(edgeA, edgeB){
        return Edge.compare(edgeA, edgeB) < 0;
    };
    Edge.equals = function(edgeA, edgeB){
        return Edge.compare(edgeA, edgeB) == 0;
    };

    //
    // Glyph
    //

    function Glyph() ///@todo Separate class UnnormalizedGlyph. Unnormalized glyph is not comparable. Delete addEdgeForced().
    {
        this.edges = new Set(Edge.less);
    }
    Glyph.prototype = {
        getEdge: function(i){
            return this.edges.at(i);
        },
        addEdge: function(edge){
            return edge.isValid() && this.edges.add(edge);
        },
        addEdgeForced: function(edge){
            this.edges.push(edge);
            return true;
        },
        removeLastEdge: function(){
            return this.edges.pop();
        },
        getEdgeCount: function(){
            return this.edges.size();
        },
        normalize: function(){
            this.edges.sortAndUnique();
            return this;
        },
        getUniqueNodeIndices: function(additionalIndices){
            var indices = additionalIndices || [];
            for(var i = 0; i < this.edges.size(); ++i){
                var edge = this.edges.at(i);
                indices.push(edge.a);
                indices.push(edge.b);
            }
            indices.sort(function(a, b){return a - b;});
            uniqueSortedArray(indices);
            return indices;
        },
        clone: function(){
            var newGlyph = new Glyph();
            newGlyph.edges = this.edges.clone();
            return newGlyph;
        },
        toString: function(){
            var str = "";
            for(var ei = 0; ei < this.getEdgeCount(); ++ei){
                var edge = this.getEdge(ei);
                str += edge.a.toString(NODE_POS.length) +
                       edge.b.toString(NODE_POS.length);
            }
            return str;
        }
    };
    Glyph.compare = function(glyphA, glyphB){
        for(var gi = 0; gi < glyphA.getEdgeCount() && gi < glyphB.getEdgeCount(); ++gi){
            var c = Edge.compare(glyphA.getEdge(gi), glyphB.getEdge(gi));
            if(c != 0){
                return c;
            }
        }
        return glyphA.getEdgeCount() - glyphB.getEdgeCount();
    };
    Glyph.less = function(glyphA, glyphB){
        return Glyph.compare(glyphA, glyphB) < 0;
    };
    Glyph.equals = function(glyphA, glyphB){
        return Glyph.compare(glyphA, glyphB) == 0;
    };
    Glyph.fromString = function(str){
        var glyph = new Glyph();
        for(var i = 1; i < str.length; i += 2){
            glyph.addEdge(new Edge(
                parseInt(str.charAt(i-1), NODE_POS.length),
                parseInt(str.charAt(i-0), NODE_POS.length)));
        }
        return glyph;
    };

    //
    // Glyph Dictionary Entry
    //
    function DictionaryEntry(keyGlyph, value)
    {
        this.keyGlyph = keyGlyph;
        this.value = value;
    }
    DictionaryEntry.compare = function(entryA, entryB){
        return Glyph.compare(entryA.keyGlyph, entryB.keyGlyph);
    };
    DictionaryEntry.less = function(entryA, entryB){
        return DictionaryEntry.compare(entryA, entryB) < 0;
    };
    DictionaryEntry.equals = function(entryA, entryB){
        return DictionaryEntry.compare(entryA, entryB) == 0;
    };

    //
    // Glyph Dictionary
    //
    function Dictionary()
    {
        this.entries = new Set(DictionaryEntry.less);
    }
    Dictionary.prototype = {
        add: function(glyph, value){
            return this.entries.add(new DictionaryEntry(glyph, value));
        },
        lowerBound: function(glyph){
            return this.entries.lowerBound(new DictionaryEntry(glyph, null)); ///@todo Avoid object creation.
        },
        get: function(glyph){
            var i = this.lowerBound(glyph);
            if(i < this.entries.size() && Glyph.equals(this.entries.at(i).keyGlyph, glyph)){
                return this.entries.at(i).value;
            }
            else{
                return null;
            }
        },
        getEntryCount: function(){
            return this.entries.size();
        },
        getEntryAt: function(i){
            return this.entries.at(i);
        },
        createIndex: function(){
            var index = {};
            for(var ei = 0; ei < this.getEntryCount(); ++ei){
                var entry = this.getEntryAt(ei);
                for(var wi = 0; wi < entry.value.length; ++wi){
                    var word = entry.value[wi].toLowerCase();
                    if(!index[word]){index[word] = [];}
                    index[word].push(entry.keyGlyph);
                }
            }
            return index;
        }
    };



    // -----------------------------------------------------------------------

    //
    // HTML Utility
    //

    function getLastScriptNode()
    {
        var n = document;
        while(n && n.nodeName.toLowerCase() != "script") { n = n.lastChild;}
        return n;
    }

        // Mouse Position

    function getElementAbsPos(elem)
    {
        var x = 0;
        var y = 0;
        while(elem && elem.offsetLeft != null && elem.offsetTop != null){
            x += elem.offsetLeft;
            y += elem.offsetTop;
            elem = elem.offsetParent;
        }

        return [x, y];
    }

    function getMousePosOnElement(elem, ev)
    {
        if(!ev){ev = event;}
        if(elem.getBoundingClientRect){
            var bcr = elem.getBoundingClientRect();
            var x = ev.clientX - bcr.left;
            var y = ev.clientY - bcr.top;
            return [x, y];
        }
        else if(typeof(ev.pageX) == "number" && typeof(ev.pageY) == "number"){
            var pos = getElementAbsPos(elem);
            return [ev.pageX-pos[0], ev.pageY-pos[1]];
        }
        else{
            return [0, 0];
        }
    };


        // Canvas

    function limitContext(targetCtx, funCtx, funDraw)
    {
        targetCtx.save();
        if(funCtx){funCtx(targetCtx);}
        if(funDraw){funDraw(targetCtx);}
        targetCtx.restore();
    }

        // Viewport

    function acquireViewportMetaElement()
    {
        var metaArray = document.getElementsByTagName("meta");
        var index = 0;
        while(index < metaArray.length){
            var elem = metaArray[index++];
            if(elem.getAttribute("name") == "viewport"){
                return elem;
            }
        }

        elem = document.createElement("meta");
        elem.setAttribute("name", "viewport");
        document.getElementsByTagName("head")[0].appendChild(elem);
        return elem;
    }
    function getViewportMetaContent(targetWidth, targetHeight)
    {
//console.log("window w=" + window.innerWidth + " h=" + window.innerHeight);
//console.log("target w=" + targetWidth + " h=" + targetHeight);

        var windowWidth = window.innerWidth;
        var windowHeight = window.innerHeight;
        var fitToWindowHeight = windowWidth * targetHeight > windowHeight * targetWidth;
        var metaSize
            = fitToWindowHeight
            ? "width=" + (Math.ceil(targetHeight*windowWidth/windowHeight))
            : "width=" + targetWidth;
        return metaSize + ", user-scalable=no";
    }
    function controlViewportMetaElement(targetElement)
    {
        var meta = acquireViewportMetaElement();
        var oldContent = meta.getAttribute("content");
        var prevContent = null;

        function updateViewport(){
            var currContent = getViewportMetaContent(
                targetElement.getBoundingClientRect().width,
                targetElement.getBoundingClientRect().height);
            if(currContent != prevContent){
                meta.setAttribute("content", "initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no"); //for iOS: cancel user scaling
                meta.setAttribute("content", currContent);
//console.log("viewport " + meta.getAttribute("content"));
                prevContent = currContent;
            }
        }
        updateViewport();

        var cancelled = false;
        var count = 0;
        function onResize(e){
            if(!cancelled){
//                console.log("onResize " + (count++));
                updateViewport();
            }
            else{
//                console.log("onResize: already cancelled");
            }
        }
        window.addEventListener("resize", onResize, false);
        window.addEventListener("orientationchange", onResize, false);
        targetElement.addEventListener("resize", onResize, false);

        function cancel(){
            if(!cancelled){
                cancelled = true;
                window.removeEventListener("resize", onResize, false);
                window.removeEventListener("orientationchange", onResize, false);
                targetElement.removeEventListener("resize", onResize, false);

                var meta = acquireViewportMetaElement();
                if(oldContent){
                    meta.setAttribute("content", oldContent);
                }
                else{
                    meta.removeAttribute("content");
                }
            }
        }

        return {
            cancel: cancel
        };
    }




    //
    // Drawing
    //
    function completeGlyphStyle(glyphSize, style){
        if(style===undefined){style = {};}
        if(style.color===undefined){style.color = "black";}

        if(style.hexagon === undefined){style.hexagon = {};}
        if(style.hexagon.visible === undefined){style.hexagon.visible = false;}
        if(style.hexagon.color === undefined){style.hexagon.color = style.color;}
        if(style.hexagon.radiusRate === undefined){style.hexagon.radiusRate = 0.48;}
        if(style.hexagon.lineWidthRate === undefined){style.hexagon.lineWidthRate = 0.02;}
        if(style.hexagon.radius === undefined){style.hexagon.radius = glyphSize * style.hexagon.radiusRate;}
        if(style.hexagon.lineWidth === undefined){style.hexagon.lineWidth = Math.ceil(glyphSize * style.hexagon.lineWidthRate);}
        if(style.hexagon.fill === undefined){style.hexagon.fill = "none";}

        if(style.grid === undefined){style.grid = {};}
        if(style.grid.visible === undefined){style.grid.visible = false;}
        if(style.grid.color === undefined){style.grid.color = style.color;}
        if(style.grid.nodeRadiusRate === undefined){style.grid.nodeRadiusRate = 0.02;}
        if(style.grid.nodeRadius === undefined){style.grid.nodeRadius = Math.ceil(glyphSize * style.grid.nodeRadiusRate);}
        if(style.grid.lineWidthRate === undefined){style.grid.lineWidthRate = 0.02;}
        if(style.grid.lineWidth === undefined){style.grid.lineWidth = Math.ceil(glyphSize * style.grid.lineWidthRate);}
        if(style.grid.fill === undefined){style.grid.fill = "none";}

        if(style.glyph === undefined){style.glyph = {};}
        if(style.glyph.visible === undefined){style.glyph.visible = true;}
        if(style.glyph.color === undefined){style.glyph.color = style.color;}
        if(style.glyph.radiusRate === undefined){style.glyph.radiusRate = style.hexagon.visible ? 0.38 : 0.48;} //NOTE:
        if(style.glyph.lineWidthRate === undefined){style.glyph.lineWidthRate = 0.02;}
        if(style.glyph.radius === undefined){style.glyph.radius = glyphSize * style.glyph.radiusRate;}
        if(style.glyph.lineWidth === undefined){style.glyph.lineWidth = Math.ceil(glyphSize * style.glyph.lineWidthRate);}

        // for backward compatibility
        if(style.glyphLineWidth!==undefined){style.glyph.lineWidth = style.glyphLineWidth;}
        return style;
    }

    // HTML5 Canvas

    function drawGrid(ctx, glyphCenterX, glyphCenterY, glyphRadius, nodeRadius, funDraw)
    {
        if(!funDraw){
            funDraw = function(ctx, x, y, r){
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2*Math.PI, false);
                ctx.stroke();
            };
        }
        for(var ni = 0; ni < NODE_POS.length; ++ni){
            funDraw(
                ctx,
                getNodePosX(glyphCenterX, glyphRadius, ni),
                getNodePosY(glyphCenterY, glyphRadius, ni),
                nodeRadius);
        }
    }

    function drawEdgeLine(ctx, glyphCenterX, glyphCenterY, glyphRadius, edge)
    {
        if(edge && edge.isValid()){
            ctx.moveTo(
                getNodePosX(glyphCenterX, glyphRadius, edge.a),
                getNodePosY(glyphCenterY, glyphRadius, edge.a));
            ctx.lineTo(
                getNodePosX(glyphCenterX, glyphRadius, edge.b),
                getNodePosY(glyphCenterY, glyphRadius, edge.b));
        }
    }

    function drawEdge(ctx, glyphCenterX, glyphCenterY, glyphRadius, edge)
    {
        if(edge && edge.isValid()){
            ctx.beginPath();
            drawEdgeLine(ctx, glyphCenterX, glyphCenterY, glyphRadius, edge);
            ctx.stroke();
        }
    }

    function drawGlyph(ctx, glyphCenterX, glyphCenterY, glyphRadius, glyph)
    {
        if(glyph){
            ctx.beginPath();
            for(var gi = 0; gi < glyph.getEdgeCount(); ++gi){
                drawEdgeLine(ctx, glyphCenterX, glyphCenterY, glyphRadius, glyph.getEdge(gi));
            }
            ctx.stroke();
        }
    }

    function drawNodes(ctx, glyphCenterX, glyphCenterY, glyphRadius, nodeRadius, indices, funDraw)
    {
        if(!funDraw){
            funDraw = function(ctx, x, y, r){
                ctx.beginPath();
                ctx.arc(x, y, r, 0, 2*Math.PI, false);
                ctx.fill();
            };
        }
        if(indices){
            for(var i = 0; i < indices.length; ++i){
                var ni = indices[i];
                funDraw(
                    ctx,
                    getNodePosX(glyphCenterX, glyphRadius, ni),
                    getNodePosY(glyphCenterY, glyphRadius, ni),
                    nodeRadius);
            }
        }
    }

    function drawHexagon(ctx, centerX, centerY, radius)
    {
        ctx.beginPath();
        ctx.moveTo(
            getNodePosX(centerX, radius, 0),
            getNodePosY(centerY, radius, 0));
        for(var i = 1; i < 6; ++i){
            ctx.lineTo(
            getNodePosX(centerX, radius, i),
            getNodePosY(centerY, radius, i));
        }
        ctx.closePath();
    }

    function createGlyphImage(glyph, glyphSize, style)
    {
        style = completeGlyphStyle(glyphSize, style);

        var glyphCenter = glyphSize/2;

        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", glyphSize);
        canvas.setAttribute("height", glyphSize);
        var ctx = canvas.getContext("2d");

        if(style.hexagon.visible){
            limitContext(
                ctx,
                style.hexagon.brush || function(targetCtx) {
                    targetCtx.lineWidth = style.hexagon.lineWidth;
                    if(style.hexagon.color.toLowerCase() != "none"){
                        targetCtx.strokeStyle = style.hexagon.color;
                    }
                    if(style.hexagon.fill.toLowerCase() != "none"){
                        targetCtx.fillStyle = style.hexagon.fill;
                    }
                },
                function(){
                    drawHexagon(ctx, glyphCenter, glyphCenter, style.hexagon.radius);
                    if(style.hexagon.fill.toLowerCase() != "none"){
                        ctx.fill();
                    }
                    if(style.hexagon.color.toLowerCase() != "none" && style.hexagon.lineWidth > 0){
                        ctx.stroke();
                    }
                });
        }

        if(style.grid.visible){
            limitContext(
                ctx,
                style.grid.brush || function(targetCtx) {
                    targetCtx.lineWidth = style.grid.lineWidth;
                    if(style.grid.color.toLowerCase() != "none"){
                        targetCtx.strokeStyle = style.grid.color;
                    }
                    if(style.grid.fill.toLowerCase() != "none"){
                        targetCtx.fillStyle = style.grid.fill;
                    }
                },
                function(){
                    drawGrid(
                        ctx, glyphCenter, glyphCenter, style.glyph.radius,
                        style.grid.nodeRadius,
                        function(ctx, x, y, r){
                            ctx.beginPath();
                            ctx.arc(x, y, r, 0, 2*Math.PI, false);
                            if(style.grid.fill.toLowerCase() != "none"){
                                ctx.fill();
                            }
                            if(style.grid.color.toLowerCase() != "none" && style.grid.lineWidth > 0){
                                ctx.stroke();
                            }
                        });
                });
        }

        if(style.glyph.visible){
            limitContext(
                ctx,
                style.glyph.brush || style.brushGlyph || function(targetCtx) {
                    targetCtx.strokeStyle = style.glyph.color;
                    targetCtx.lineWidth = style.glyph.lineWidth;
                    targetCtx.lineCap = "round";
                    targetCtx.lineJoin = "round";
                },
                function(){
                    drawGlyph(ctx, glyphCenter, glyphCenter, style.glyph.radius, glyph);
                });
        }

        return canvas;
    }

    // SVG

    function createGlyphSVGPathData(glyph, glyphCenterX, glyphCenterY, glyphRadius)
    {
        var d = "";
        for(var gi = 0; gi < glyph.getEdgeCount(); ++gi){
            var edge = glyph.getEdge(gi);
            if(edge && edge.isValid()){
                if(d != ""){
                    d += " ";
                }
                ///@todo Avoid scientific notation
                d += "M " +
                    getNodePosX(glyphCenterX, glyphRadius, edge.a) + " " +
                    getNodePosY(glyphCenterY, glyphRadius, edge.a) + " " +
                    "L " +
                    getNodePosX(glyphCenterX, glyphRadius, edge.b) + " " +
                    getNodePosY(glyphCenterY, glyphRadius, edge.b);
            }
        }
        return d;
    }
    function createHexagonSVGPathData(centerX, centerY, radius)
    {
        var d = "M " +
            getNodePosX(centerX, radius, 0) + " " +
            getNodePosY(centerY, radius, 0);
        for(var i = 1; i < 6; ++i){
            d += " L " +
                getNodePosX(centerX, radius, i) + " "+
                getNodePosY(centerY, radius, i);
        }
        d += " Z";
        return d;
    }
    function createGridSVGCircles(glyphCenterX, glyphCenterY, glyphRadius, nodeRadius)
    {
        var g = createSVGElement("g");
        for(var ni = 0; ni < NODE_POS.length; ++ni){
            g.appendChild(createSVGElement("circle", {
                cx:getNodePosX(glyphCenterX, glyphRadius, ni),
                cy:getNodePosY(glyphCenterY, glyphRadius, ni),
                r:nodeRadius}));
        }
        return g;
    }
    function createSVGElement(elemName, attrs){
        var elem = document.createElementNS("http://www.w3.org/2000/svg",elemName);
        for(var attr in attrs){
            elem.setAttributeNS(null, attr, attrs[attr]);
        }
        return elem;
    }
    function createGlyphSVG(glyph, glyphSize, style)
    {
        style = completeGlyphStyle(glyphSize, style);

        var glyphCenter = glyphSize/2;

        var svg = createSVGElement("svg", {width:glyphSize, height:glyphSize});

        if(style.hexagon.visible){
            var pathHexagon = createSVGElement(
                "path",
                {d: createHexagonSVGPathData(glyphCenter, glyphCenter, style.hexagon.radius),
                 stroke: style.hexagon.color,
                 "stroke-width": style.hexagon.lineWidth,
                 fill: style.hexagon.fill});
            svg.appendChild(pathHexagon);
        }

        if(style.grid.visible){
            for(var ni = 0; ni < NODE_POS.length; ++ni){
                svg.appendChild(createSVGElement("circle", {
                    cx:getNodePosX(glyphCenter, style.glyph.radius, ni),
                    cy:getNodePosY(glyphCenter, style.glyph.radius, ni),
                    r:style.grid.nodeRadius,
                    stroke: style.grid.color,
                    "stroke-width": style.grid.lineWidth,
                    fill: style.grid.fill
                }));
            }
        }

        if(style.glyph.visible){
            var pathGlyph = createSVGElement(
                "path",
                {d: createGlyphSVGPathData(glyph, glyphCenter, glyphCenter, style.glyph.radius),
                 stroke: style.glyph.color,
                 "stroke-width": style.glyph.lineWidth,
                 "stroke-linejoin": "round",
                 "stroke-linecap": "round"});
            svg.appendChild(pathGlyph);
        }

        return svg;
    }



    // -----------------------------------------------------------------------

    //
    // Input Pad
    //

    function createInputPad(options)
    {
        if(!options){options = {};}
        if(!options.style){options.style = {};}
        if(!options.style.color){options.style.color = "white";}

        // Glyph

        var glyph = new Glyph();
        function getGlyph()
        {
            return glyph.clone().normalize();
        }
        function fireGlyphChangeEvent()
        {
            var evChange = document.createEvent("HTMLEvents");
            evChange.initEvent("glyphchange", false, false);
            canvas.dispatchEvent(evChange);
        }
        function setGlyph(newGlyph)
        {
            glyph = newGlyph ? newGlyph.clone() : new Glyph();
            redraw();
            fireGlyphChangeEvent();
        }
        function clearGlyph()
        {
            glyph = new Glyph();
            redraw();
            fireGlyphChangeEvent();
        }
        function addEdge(nodeIndexA, nodeIndexB)
        {
            var edge = new Edge(nodeIndexA, nodeIndexB);
            if(edge.isValid() && glyph.addEdgeForced(edge)){ // able to 'undo'
                //drawEdge(ctx, glyphCenter, glyphCenter, glyphRadius, edge);
                redraw();

                fireGlyphChangeEvent();
            }
        }
        function removeLastEdge()
        {
            if(glyph.getEdgeCount() > 0){
                var lastEdge = glyph.removeLastEdge();
                redraw();
                fireGlyphChangeEvent();
                return lastEdge;
            }
            else{
                return null;
            }
        }

        // Canvas

        var inputPadSize = options.size || 300;
        var glyphRadius = inputPadSize * 84 / 200;
        var glyphCenter = inputPadSize/2;
        var nodeRadiusGrid = inputPadSize*2.5/100;
        var nodeRadiusInput = inputPadSize*6/100;

        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", inputPadSize);
        canvas.setAttribute("height", inputPadSize);
        canvas.style.border = options.style.border || "1px solid "+options.style.color;
        canvas.style.background = options.style.background || "black";

        var ctx = canvas.getContext("2d");

        function defaultBrushNodeGrid(targetCtx)
        {
            targetCtx.strokeStyle = options.style.color;
            targetCtx.lineWidth = 2;
        }
        function defaultBrushNodeInput(targetCtx)
        {
            targetCtx.strokeStyle = "rgba(0,0,0,0)";//options.style.color;
        }
        function defaultBrushGlyph(targetCtx)
        {
            targetCtx.strokeStyle = options.style.color;
            targetCtx.lineWidth = inputPadSize*2/100;
            targetCtx.lineCap = "round";
            targetCtx.lineJoin = "round";
        }
        function defaultDrawNodeGradient(targetCtx, x, y, r)
        {
            var gradient = targetCtx.createRadialGradient(x, y, nodeRadiusGrid, x, y, nodeRadiusInput);
            gradient.addColorStop(0.0, "rgba(147,116,149,0.0)");
            gradient.addColorStop(0.01, "rgba(147,116,149,0.9)");
            gradient.addColorStop(1.0, "rgba(147,116,149,0.0)");
            targetCtx.fillStyle = gradient;
            targetCtx.fillRect(x-nodeRadiusInput, y-nodeRadiusInput, nodeRadiusInput*2, nodeRadiusInput*2);
        }
        function redraw()
        {
            ctx.clearRect(0, 0, inputPadSize, inputPadSize);
            limitContext(
                ctx,
                options.style.brushGlyphNode || function(targetCtx){targetCtx.fillStyle = "#ffff00";},
                function(){
                    drawNodes(ctx, glyphCenter, glyphCenter, glyphRadius, nodeRadiusGrid, getTouchedNodeIndices());
                });
            limitContext(
                ctx,
                null,
                function(){
                    drawGrid(ctx, glyphCenter, glyphCenter, glyphRadius, nodeRadiusInput, options.style.drawNodeGradient || defaultDrawNodeGradient);
                });
            limitContext(
                ctx,
                options.style.brushNodeInput || defaultBrushNodeInput,
                function(){
                    drawGrid(ctx, glyphCenter, glyphCenter, glyphRadius, nodeRadiusInput);
                });
            limitContext(
                ctx,
                options.style.brushNodeGrid || defaultBrushNodeGrid,
                function(){
                    drawGrid(ctx, glyphCenter, glyphCenter, glyphRadius, nodeRadiusGrid);
                });
            limitContext(
                ctx,
                options.style.brushGlyph || defaultBrushGlyph,
                function(){
                    drawGlyph(ctx, glyphCenter, glyphCenter, glyphRadius, glyph);
                });
        }
        redraw();

        // Input Event

        function getNodeIndexAtMousePosition(pos)
        {
            return getNodeIndexAtPosition(glyphCenter, glyphCenter, glyphRadius, nodeRadiusInput, pos[0], pos[1]);
        }
        function getNodeIndexAtMouseEvent(ev)
        {
            return getNodeIndexAtMousePosition(getMousePosOnElement(canvas, ev));
        }
        function fireGlyphStrokeEndEvent()
        {
            var evChange = document.createEvent("HTMLEvents");
            evChange.initEvent("glyphstrokeend", false, false);
            canvas.dispatchEvent(evChange);
        }

        var mouseDown = false;
        var lastNodeIndex = -1;
        var limitInputStroke = -1;
        var lastMousePos = null;

        function setLastNodeIndex(index)
        {
            lastNodeIndex = index;
            redraw();
            if(lastNodeIndex != -1){
                if(options.vibrationEnabled !== false && window.navigator.vibrate){
                    window.navigator.vibrate(10);
                }
            }
        }
        function onMouseDown(ev)
        {
            if(!mouseDown && limitInputStroke != 0){
                if(limitInputStroke > 0){
                    --limitInputStroke;
                }
                mouseDown = true;
                var pos = getMousePosOnElement(canvas, ev);
                setLastNodeIndex(getNodeIndexAtMousePosition(pos));
                lastMousePos = pos;
            }
        }
        function onMouseUp(ev)
        {
            if(mouseDown){
                mouseDown = false;
                setLastNodeIndex(-1);
                lastMousePos = null;

                fireGlyphStrokeEndEvent();
            }
        }
        function onMouseMoveInner(pos)
        {
            if(mouseDown){
                var newNodeIndex = getNodeIndexAtMousePosition(pos);
                if(newNodeIndex != -1 && newNodeIndex != lastNodeIndex){
                    if(lastNodeIndex != -1){
                        addEdge(lastNodeIndex, newNodeIndex);
                    }
                    setLastNodeIndex(newNodeIndex);
                }
            }
        }
        function onMouseMove(ev)
        {
            if(mouseDown){
                // Interpolate mouse positions
                var pos = getMousePosOnElement(canvas, ev);
                var dx = pos[0] - lastMousePos[0];
                var dy = pos[1] - lastMousePos[1];
                var distance = Math.sqrt(dx*dx+dy*dy);
                var maxSpan = nodeRadiusInput / 2;
                var numDivisions = Math.ceil(distance / maxSpan);
                for(var di = 1; di <= numDivisions; ++di){
                    onMouseMoveInner([
                        lastMousePos[0] + dx * di / numDivisions,
                        lastMousePos[1] + dy * di / numDivisions
                    ]);
                }
                lastMousePos = pos;
            }
        }
        function getTouchedNodeIndices()
        {
            return glyph.getUniqueNodeIndices(lastNodeIndex >= 0 ? [lastNodeIndex] : []);
        }
        function setLimitInputStroke(count)
        {
            limitInputStroke = count;
        }
        function getLimitInputStroke()
        {
            return limitInputStroke;
        }

        canvas.addEventListener("mousedown", onMouseDown, false);
        canvas.addEventListener("mouseup", onMouseUp, false);
        canvas.addEventListener("mousemove", onMouseMove, false);
        canvas.addEventListener("mouseleave", onMouseUp, false);
        canvas.addEventListener("touchstart", function(ev){
            ev.preventDefault();
            onMouseDown(ev.touches[0]);
        }, false);
        canvas.addEventListener("touchend", onMouseUp, false);
        canvas.addEventListener("touchmove", function(ev){
            ev.preventDefault();
            onMouseMove(ev.touches[0]);
        }, false);


        // Export Functions
        canvas.getGlyph = getGlyph;
        canvas.setGlyph = setGlyph;
        canvas.clearGlyph = clearGlyph;
        canvas.removeLastEdge = removeLastEdge;
        canvas.setLimitInputStroke = setLimitInputStroke;
        canvas.getLimitInputStroke = getLimitInputStroke;
        return canvas;
    }



    if(!window.gm9){ window.gm9 = {};}
    window.gm9.IngressGlyphTools = {
        // Classes
        Set: Set,
        Edge: Edge,
        Glyph: Glyph,
        DictionaryEntry: DictionaryEntry,
        Dictionary: Dictionary,

        // Functions
        getLastScriptNode: getLastScriptNode,
        controlViewportMetaElement: controlViewportMetaElement,
        limitContext: limitContext,
        getNodePosX: getNodePosX,
        getNodePosY: getNodePosY,
        getNodeIndexAtPosition: getNodeIndexAtPosition,
        drawGrid: drawGrid,
        drawEdge: drawEdge,
        drawGlyph: drawGlyph,
        drawNodes: drawNodes,
        drawHexagon: drawHexagon,
        createGlyphImage: createGlyphImage,
        createGlyphSVG: createGlyphSVG,
        createInputPad: createInputPad
    };
})(this);
