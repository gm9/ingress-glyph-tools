(function(){
    var igt = gm9.IngressGlyphTools;
    var Glyph = igt.Glyph;

    var GLYPH_INDICATOR_UNOPEN_NORMAL = 0;
    var GLYPH_INDICATOR_UNOPEN_HIGHLIGHT = 1;
    var GLYPH_INDICATOR_CORRECT = 2;
    var GLYPH_INDICATOR_INCORRECT = 3;
    var COLOR_CORRECT = "#84ebcd";
    var COLOR_INCORRECT = "#ff595a";
    function createGlyphIndicator(glyph, mode)
    {
        var modeColors = [
                {line: "#ad6e0e", bgLight: "rgba(0,0,0,0)", bgDark: "rgba(0,0,0,0)"},
                {line: "#fd9f15", bgLight: "#fd9f15", bgDark: "#543606"},
                {line: COLOR_CORRECT, bgLight: COLOR_CORRECT, bgDark: "#31514a"},
                {line: COLOR_INCORRECT, bgLight: COLOR_INCORRECT, bgDark: "#5a2021"}
        ];
        var colors = modeColors[mode || 0];

        var imageSize = 48;
        var imageWidth = Math.ceil(imageSize * Math.sqrt(3)/2);
        var imageCenterX = imageWidth / 2;
        var imageCenterY = imageSize / 2;
        var lineWidth = Math.ceil(imageSize * 0.04);
        var frameRadius = imageSize * 0.45;
        var glyphRadius = imageSize * 0.40;

        var canvas = document.createElement("canvas");
        canvas.setAttribute("width", imageWidth);
        canvas.setAttribute("height", imageSize);
        var ctx = canvas.getContext("2d");
        ctx.lineWidth = lineWidth;

        igt.limitContext(
            ctx,
            function(){
                var backGradient = ctx.createLinearGradient(0,0,0,imageSize);
                backGradient.addColorStop(0.0, colors.bgLight);
                backGradient.addColorStop(0.5, colors.bgDark);
                backGradient.addColorStop(1.0, colors.bgLight);
                ctx.strokeStyle = colors.line;
                ctx.fillStyle = backGradient;
                igt.drawHexagon(ctx, imageCenterX, imageCenterY, frameRadius);
                ctx.stroke();
                ctx.fill();
            });
        if(glyph){
            igt.limitContext(
                ctx,
                function(){
                    ctx.strokeStyle = colors.line;
                    igt.drawGlyph(ctx, imageCenterX, imageCenterY, glyphRadius, glyph);
                });
        }
        return canvas;
    }

    function createGameElement()
    {
        var padSize = 300;

        //
        // Game Div
        //

        var gameElement = document.createElement("div");
        gameElement.style.width = (padSize+2) + "px";
        gameElement.style.marginLeft = "auto";
        gameElement.style.marginRight = "auto";
        gameElement.style.position = "relative";
        gameElement.style.msUserSelect =
        gameElement.style.MozUserSelect =
        gameElement.style.webkitUserSelect =
        gameElement.style.userSelect = "none";
        gameElement.style.cursor = "default";

            // Glyph Sequence Indicator

        var glyphSequenceIndicator = document.createElement("div");
        glyphSequenceIndicator.style.textAlign = "center";
        gameElement.appendChild(glyphSequenceIndicator);
        function resetGlyphIndicator(count)
        {
            while(glyphSequenceIndicator.firstChild){
                glyphSequenceIndicator.removeChild(glyphSequenceIndicator.firstChild);
            }
            for(var i = 0; i < count; ++i){
                glyphSequenceIndicator.appendChild(createGlyphIndicator());
            }
        }
        function setGlyphIndicator(index, mode, glyph)
        {
            var node = glyphSequenceIndicator.childNodes[index];
            glyphSequenceIndicator.insertBefore(createGlyphIndicator(glyph, mode), node);
            glyphSequenceIndicator.removeChild(node);
        }
        resetGlyphIndicator(1);

            // Time Indicator

        var timeIndicator = document.createElement("div");
        timeIndicator.style.fontSize = "40px";
        timeIndicator.style.textAlign = "center";
        gameElement.appendChild(timeIndicator);
        function clearTimeIndicator()
        {
            while(timeIndicator.firstChild){
                timeIndicator.removeChild(timeIndicator.firstChild);
            }
        }
        function setTimeIndicator(msec)
        {
            clearTimeIndicator();
            timeIndicator.style.color = "#807030";
            timeIndicator.appendChild(document.createTextNode(
                Math.floor(msec/10000).toString()+
                (Math.floor(msec/1000)%10).toString()+
                ":"+
                (Math.floor(msec/100)%10).toString()+
                (Math.floor(msec/10)%10).toString()));
        }
        setTimeIndicator(0);
        function setGlyphWord(word, correct)
        {
            clearTimeIndicator();
            timeIndicator.style.color = correct ? COLOR_CORRECT : COLOR_INCORRECT;
            timeIndicator.appendChild(document.createTextNode(word));
        }

            // Glyph Pad

        var pad = igt.createInputPad({
            size: padSize,
            style: {
                color: "white"
            }});
        gameElement.appendChild(pad);


        //
        // Level Select
        //

        function inputLevel()
        {
            var div;
            function beginInputLevel()
            {
                div = document.createElement("div");
                div.style.width = padSize + "px";
                div.style.position = "absolute";
                div.style.left = "0";
                div.style.top = "0";
                div.style.background = "rgba(40,40,40,0.8)";
                div.style.textAlign = "center";
                div.style.paddingTop = "20px";
                div.style.paddingBottom = "20px";
                div.style.lineHeight = "180%";
                for(var lv = 0; lv <= 9; ++lv){
                    var button = document.createElement("input");
                    button.type = "button";
                    button.value = "Hack L"+lv+" Portal";
                    function setButtonLevel()
                    {
                        var buttonLevel = lv;
                        button.addEventListener("click", function(e){
                            endInputLevel(buttonLevel);
                        }, false);
                    }
                    setButtonLevel();
                    div.appendChild(button);
                    div.appendChild(document.createElement("br"));
                }
                gameElement.appendChild(div);
            }
            function endInputLevel(lv)
            {
                div.parentNode.removeChild(div);
                hack(lv);
            }
            beginInputLevel();
        }
        inputLevel();

        //
        // Hacking
        //

        function hack(lv)
        {
            var LEVEL_GLYPH_COUNT = [1,1,2,3,3,3,4,4,5, 6];
            var LEVEL_TIME_LIMIT = [20,20,20,20,19,18,17,16,15, 15];
            var glyphCount = LEVEL_GLYPH_COUNT[lv];
            var timeLimit = LEVEL_TIME_LIMIT[lv] * 1000;
            var sequence = createSequece();
            var sequenceInputGlyphs = [];
            presentSequence(sequence);

            // 問題作成
            function chooseGlyph()
            {
                var dic = igt.glyphtionary;
                do{
                    var entryIndex = Math.floor(Math.random() * dic.getEntryCount());
                    var entry = dic.getEntryAt(entryIndex);
                }
                while(!(entry && entry.keyGlyph && entry.value && entry.value.length > 0));
                return {
                    glyph: entry.keyGlyph,
                    word: entry.value[Math.floor(Math.random() * entry.value.length)]
                };
            }
            function createSequece()
            {
                var sequence = [];
                for(var i = 0; i < glyphCount; ++i){
                    sequence.push(chooseGlyph());
                }
                return sequence;
            }

            // 問題提示
            function presentSequence(sequence)
            {
                resetGlyphIndicator(glyphCount);
                setTimeIndicator(timeLimit);

                var index = 0;

                function showGlyph()
                {
                    setGlyphIndicator(index, GLYPH_INDICATOR_UNOPEN_HIGHLIGHT);
                    pad.setGlyph(sequence[index].glyph);
                    pad.setLimitInputStroke(0);
                }
                function hideGlyph()
                {
                    setGlyphIndicator(index, GLYPH_INDICATOR_UNOPEN_NORMAL);
                    pad.clearGlyph();
                }

                function beginShowGlyph()
                {
                    if(index >= glyphCount){
                        endPresentSequence();
                    }
                    else{
                        showGlyph();
                        setTimeout(endShowGlyph, 1500);
                    }
                }
                function endShowGlyph()
                {
                    hideGlyph();
                    ++index;
                    beginShowGlyph();
                }
                beginShowGlyph();
            }
            function endPresentSequence()
            {
                presentGetReady();
            }

            // Get Ready
            function presentGetReady()
            {
                var div = document.createElement("div");
                div.style.position = "absolute";
                div.style.top = "200px";
                div.style.width = padSize + "px";
                div.style.textAlign = "center";
                div.style.color = "#fd9f15";
                div.style.fontSize = "20px";
                div.style.borderWidth = "1px 0 1px 0";
                div.style.borderStyle = "solid";
                div.style.background = "#543606";
                div.appendChild(document.createTextNode("GET READY..."));

                gameElement.appendChild(div);

                function flush(beginTime){
                    var opacity = 1.0;
                    function fadeout(){
                        opacity -= 0.1;
                        if(opacity <= 0){
                            opacity = 0;
                        }
                        gameElement.style.background = "rgba(253, 159, 21, "+opacity.toFixed(6)+")";
                        if(opacity > 0){
                            setTimeout(fadeout, 20);
                        }
                    }
                    setTimeout(fadeout, beginTime);
                }
                flush(0);
                flush(1000);
                flush(2000);
                setTimeout(endGetReady, 2000);

                function endGetReady()
                {
                    div.parentNode.removeChild(div);
                    inputSequence();
                }
            }

            // 回答受付
            function inputSequence()
            {
                var index = 0;

                // Timer
                var beginTime = Date.now();
                var timerId = setInterval(progressTimer, 16);
                function progressTimer()
                {
                    var currTime = Math.min(Date.now() - beginTime, timeLimit);
                    setTimeIndicator(timeLimit - currTime);
                    if(currTime >= timeLimit){
                        endInputSequence(); //time is up
                    }
                }
                function stopTimer()
                {
                    clearInterval(timerId);
                }

                // InputGlyph
                pad.addEventListener("glyphstrokeend", onStrokeEnd, false);
                function beginInputGlyph()
                {
                    if(index >= glyphCount){
                        endInputSequence();
                    }
                    else{
                        setGlyphIndicator(index, GLYPH_INDICATOR_UNOPEN_HIGHLIGHT);
                        pad.setLimitInputStroke(1);
                    }
                }
                function onStrokeEnd()
                {
                    endInputGlyph();
                }
                function endInputGlyph()
                {
                    sequenceInputGlyphs.push(pad.getGlyph());
                    pad.clearGlyph();
                    setGlyphIndicator(index, GLYPH_INDICATOR_UNOPEN_NORMAL);
                    ++index;
                    beginInputGlyph();
                }
                beginInputGlyph();

                function endInputSequence()
                {
                    for(; index < glyphCount; ++index){
                        sequenceInputGlyphs.push(new Glyph());
                    }
                    stopTimer();
                    pad.clearGlyph();
                    resetGlyphIndicator(glyphCount);
                    pad.removeEventListener("glyphstrokeend", onStrokeEnd, false);
                    presentResult();
                }
            }

            // 結果表示
            function presentResult()
            {
                var index = 0;

                function beginShowGlyph()
                {
                    if(index >= glyphCount){
                        endPresentResult();
                    }
                    else{
                        var correct = Glyph.equals(sequenceInputGlyphs[index], sequence[index].glyph);
                        var glyph = sequence[index].glyph;
                        var word = sequence[index].word;
                        setGlyphIndicator(index, correct ? GLYPH_INDICATOR_CORRECT : GLYPH_INDICATOR_INCORRECT, glyph);
                        pad.setGlyph(glyph);
                        setGlyphWord(word, correct);
                        setTimeout(endShowGlyph, 1000);
                    }
                }
                function endShowGlyph()
                {
                    ++index;
                    beginShowGlyph();
                }
                setTimeout(beginShowGlyph, 1000);
            }
            function endPresentResult()
            {
                setTimeout(inputLevel, 1000);
            }
        }

        return gameElement;
    }

    function insertAfterLastScriptNode()
    {
        var gameElement = createGameElement();
        igt.getLastScriptNode().parentNode.appendChild(gameElement);

        igt.controlViewportMetaElement(gameElement);
    }

    igt.glyphHacking = insertAfterLastScriptNode;
})();
