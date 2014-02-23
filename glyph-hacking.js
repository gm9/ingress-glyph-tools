(function(){
    var igt = gm9.IngressGlyphTools;
    var Glyph = igt.Glyph;

    var GLYPH_INDICATOR_UNOPEN_NORMAL = 0;
    var GLYPH_INDICATOR_UNOPEN_HIGHLIGHT = 1;
    var GLYPH_INDICATOR_CORRECT = 2;
    var GLYPH_INDICATOR_INCORRECT = 3;
    function createGlyphIndicator(glyph, mode)
    {
        var modeColors = [
                {line: "#ad6e0e", bgLight: "rgba(0,0,0,0)", bgDark: "rgba(0,0,0,0)"},
                {line: "#fd9f15", bgLight: "#fd9f15", bgDark: "#543606"},
                {line: "#84ebcd", bgLight: "#84ebcd", bgDark: "#31514a"},
                {line: "#ff595a", bgLight: "#ff595a", bgDark: "#5a2021"}
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
        var fontSize = 30;

        //
        // Create Game Div
        //

        var gameElement = document.createElement("div");
        gameElement.style.width = (padSize+2) + "px";
        gameElement.style.marginLeft = "auto";
        gameElement.style.marginRight = "auto";
        gameElement.style.position = "relative";

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

        var timeIndicator = document.createElement("div");
        timeIndicator.style.color = "#807030";
        timeIndicator.style.fontSize = "40px";
        timeIndicator.style.textAlign = "center";
        gameElement.appendChild(timeIndicator);

        var pad = igt.createInputPad({
            size: padSize,
            style: {
                color: "white"
            }});
        gameElement.appendChild(pad);


        // Time Indicator
        timeIndicator.appendChild(document.createTextNode("20:00"));

        // 問題作成
        var glyphCount = 3;
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
        var sequence = createSequece();
        presentSequence(sequence);
        function endPresentSequence()
        {
            inputSequence();
        }

        // ready go!

        // 回答受付
        var sequenceInputGlyphs = [];
        function inputSequence()
        {
            var index = 0;

            ///@todo use timer

            function beginInputGlyph()
            {
                if(index >= glyphCount){
                    endInputSequence();
                }
                else{
                    setGlyphIndicator(index, GLYPH_INDICATOR_UNOPEN_HIGHLIGHT);
                    pad.setLimitInputStroke(1);
                    pad.addEventListener("glyphstrokeend", onStrokeEnd, false);
                }
            }
            function onStrokeEnd()
            {
                endInputGlyph();
            }
            function endInputGlyph()
            {
                sequenceInputGlyphs.push(pad.getGlyph());
                pad.removeEventListener("glyphstrokeend", onStrokeEnd, false);
                pad.clearGlyph();
                setGlyphIndicator(index, GLYPH_INDICATOR_UNOPEN_NORMAL);
                ++index;
                beginInputGlyph();
            }
            beginInputGlyph();
        }
        function endInputSequence()
        {
            presentResult();
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
                    ///@todo show word
                    setTimeout(endShowGlyph, 1000);
                }
            }
            function endShowGlyph()
            {
                ++index;
                beginShowGlyph();
            }
            beginShowGlyph();
        }
        function endPresentResult()
        {
            ///@todo
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
