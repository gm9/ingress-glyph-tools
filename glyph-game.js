/*
 * Copyright (c) 2014 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

// requires:
// - glyph-tools.js
// - glyph-dic.js
// - glyph-sequence-dic.js

(function(){
    var igt = gm9.IngressGlyphTools;
    var Glyph = igt.Glyph;

    var LEVEL_GLYPH_COUNT = [1,1,2,3,3,3,4,4,5, 6];
    var LEVEL_TIME_LIMIT = [20000,20000,20000,20000,19000,18000,17000,16000,15000, 15000];
    var GLYPHS_TRANSLATOR_POINT = [0,1,2,4,8,15];

    function getLevelGlyphCount(lv){
        return LEVEL_GLYPH_COUNT[lv];
    }
    function getLevelTimeLimit(lv){
        return LEVEL_TIME_LIMIT[lv];
    }

    //
    // 問題作成
    //

    function createRandomSequence(glyphCount)
    {
        var sequence = [];
        for(var i = 0; i < glyphCount; ++i){
            sequence.push(igt.glyphDic.getWordGlyphRandom());
        }
        return sequence;
    }
    function chooseSequenceRandom(lv)
    {
        // シーケンス辞書から取得できればそれを出題する。
        // 取得できなければ、完全にランダムでシーケンスを作る。
        var sequence = igt.sequenceDic.getSequenceRandom(lv);
        if(sequence && sequence.length > 0){
            return sequence;
        }
        else{
            return createRandomSequence(LEVEL_GLYPH_COUNT[lv]);
        }
    }


    //
    // UI Parts
    //
    function createButton(text, onclick)
    {
        ///@todo ライブラリ化する。
        var button = document.createElement("input");
        button.type = "button";
        button.value = text;
        if(onclick){
            button.addEventListener("click", onclick, false);
        }
        return button;
    }
    function putButton(parent, text, onclick)
    {
        var button = createButton(text, onclick);
        parent.appendChild(button);
        return button;
    }

    //
    // Level Selector UI
    //

    function createLevelSelector(onSelected)
    {
        var div;
        div = document.createElement("div");
        div.style.width = "100%";//padSize + "px";
        div.style.position = "absolute";
        div.style.left = "0";
        div.style.top = "0";
        div.style.background = "rgba(40,40,40,0.8)";
        div.style.textAlign = "center";
        div.style.paddingTop = "20px";
        div.style.paddingBottom = "20px";
        div.style.lineHeight = "180%";
        for(var lv = 0; lv <= 9; ++lv){
            (function(){
                var buttonLevel = lv;
                putButton(div, "Hack L"+lv+" Portal", function(){
                    endSelectLevel(buttonLevel); });
            })();
            div.appendChild(document.createElement("br"));
        }
        function endSelectLevel(lv)
        {
            div.parentNode.removeChild(div);
            if(onSelected){
                onSelected(lv);
            }
        }
        return div;
    }




    //
    // Glyph Indicator
    //

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



    //
    // Game UI
    //

    function createGame()
    {
        var gameObj = {
            showRetryButton: true,
            onUpdateResult: null,
            onEndGame: null,
            userSelectedLevel: undefined,
            presentSequenceGlyphTime: 1000,
            presentResultGlyphTime: 1000,
            speakResultGlyphName: false
        };
        var padSize = 300;

        //
        // Game Div
        //

        var gameElement = gameObj.element = document.createElement("div");
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
        function msecToString(msec)
        {
            return Math.floor(msec/10000).toString()+
                (Math.floor(msec/1000)%10).toString()+
                ":"+
                (Math.floor(msec/100)%10).toString()+
                (Math.floor(msec/10)%10).toString();
        }
        function setTimeIndicator(msec)
        {
            clearTimeIndicator();
            timeIndicator.style.color = "#807030";
            timeIndicator.appendChild(document.createTextNode(msecToString(msec)));
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
                color: "white",
                background: "transparent"
            }});
        gameElement.appendChild(pad);

        //
        // Speech
        //
        function createUtterance(text)
        {
            if(window.speechSynthesis && window.SpeechSynthesisUtterance){
                var msg = new SpeechSynthesisUtterance();
                var voices = window.speechSynthesis.getVoices();
                msg.text = text;
                msg.lang = 'en-US';
                return msg;
            }
            else{
                return null;
            }
        }
        function speakText(text)
        {
            if(window.speechSynthesis && window.SpeechSynthesisUtterance && typeof(text) == "string"){
                //speechSynthesis.cancel();
                speechSynthesis.speak(createUtterance(text));
            }
        }
        function speakUtterance(utterance)
        {
            if(window.speechSynthesis && window.SpeechSynthesisUtterance && utterance){
                //speechSynthesis.cancel();
                speechSynthesis.speak(utterance);
            }
        }

        //
        // Level Select
        //

        gameObj.inputLevel = inputLevel;
        function inputLevel()
        {
            function beginInputLevel()
            {
                gameElement.appendChild(createLevelSelector(endInputLevel));
            }
            function endInputLevel(lv)
            {
                gameObj.userSelectedLevel = lv;
                hackLevelRandom(lv);
            }
            beginInputLevel();
        }

        //
        // Hacking
        //

        gameObj.hackLevelRandom = hackLevelRandom;
        function hackLevelRandom(lv)
        {
            hack(chooseSequenceRandom(lv), LEVEL_TIME_LIMIT[lv]);
        }

        gameObj.hack = hack;
        function hack(sequence, timeLimit)
        {
            var glyphCount = sequence.length;
            gameObj.sequence = sequence;
            presentSequence(sequence);


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
                        setTimeout(endShowGlyph, gameObj.presentSequenceGlyphTime);
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
                var currTime = 0;
                var lastEndInputGlyphTime = 0;
                var inputGlyphs = [];
                var glyphInputTimes = [];

                // Timer
                var beginTime = Date.now();
                var timerId = setInterval(progressTime, 16);
                function progressTime()
                {
                    currTime = Math.min(Date.now() - beginTime, timeLimit);
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
                    glyphInputTimes.push(currTime - lastEndInputGlyphTime);
                    lastEndInputGlyphTime = currTime;
                    inputGlyphs.push(pad.getGlyph());
                    pad.clearGlyph();
                    setGlyphIndicator(index, GLYPH_INDICATOR_UNOPEN_NORMAL);
                    ++index;
                    beginInputGlyph();
                }
                beginInputGlyph();

                function createResultObject()
                {
                    var correctCount = 0;
                    var correctArray = [];
                    for(var i = 0; i < inputGlyphs.length; ++i){
                        var correct = Glyph.equals(
                            inputGlyphs[i],
                            sequence[i].glyph);
                        correctArray.push(correct);
                        if(correct){
                            ++correctCount;
                        }
                    }
                    return {
                        time: currTime,
                        inputGlyphs: inputGlyphs, //lengthは入力が終わった個数
                        glyphInputTimes: glyphInputTimes, //lengthは入力が終わった個数
                        correctCount: correctCount,
                        correctArray: correctArray //lengthは入力が終わった個数
                    };
                }
                function endInputSequence()
                {
                    gameObj.result = createResultObject();
                    if(gameObj.onUpdateResult){
                        gameObj.onUpdateResult(gameObj.result);
                    }
                    stopTimer();
                    pad.clearGlyph();
                    resetGlyphIndicator(glyphCount);
                    pad.removeEventListener("glyphstrokeend", onStrokeEnd, false);
                    presentResult(gameObj.result);
                }
            }

            // 結果表示
            function presentResult(gameResult)
            {
                var index = 0;

                function waitTime(duration, callback)
                {
                    var timeoutID = setTimeout(end, duration);
                    pad.addEventListener("mousedown", end, true);
                    pad.addEventListener("touchstart", end, true);
                    function end()
                    {
                        if(timeoutID !== null){
                            clearTimeout(timeoutID);
                            timeoutID = null;
                            pad.removeEventListener("mousedown", end, true);
                            pad.removeEventListener("touchstart", end, true);
                            callback();
                        }
                    }
                }

                beginPreWait();
                function beginPreWait()
                {
                    waitTime(1000, endPreWait);
                }
                function endPreWait()
                {
                    beginShowGlyph();
                }

                function beginShowGlyph()
                {
                    if(index >= glyphCount){
                        presentScore();
                    }
                    else{
                        var correct = index < gameResult.correctArray.length ? gameResult.correctArray[index] : false;
                        var glyph = sequence[index].glyph;
                        var word = sequence[index].word.toUpperCase();
                        setGlyphIndicator(index, correct ? GLYPH_INDICATOR_CORRECT : GLYPH_INDICATOR_INCORRECT, glyph);
                        pad.setGlyph(glyph);
                        pad.setLimitInputStroke(0);
                        setGlyphWord(word, correct);
                        if(gameObj.speakResultGlyphName){
                            speakText(word.toLowerCase());
                        }
                        waitTime(gameObj.presentResultGlyphTime, endShowGlyph);
                    }
                }
                function endShowGlyph()
                {
                    ++index;
                    beginShowGlyph();
                }
                function createScoreDiv()
                {
                    function tx(text){
                        return document.createTextNode(text);
                    }
                    function sc(text){
                        var span = document.createElement("span");
                        span.style.fontSize = "24px";
                        span.style.color = "white";
                        span.appendChild(document.createTextNode(text));
                        return span;
                    }
                    var div = document.createElement("div");
                    div.style.fontSize = "16px";
                    div.style.textAlign = "left";
                    div.style.color = COLOR_CORRECT;
                    div.style.position = "absolute";
                    div.style.left = "10px";
                    div.style.top = "140px";
                    div.style.right = "10px";
                    div.style.border = "solid 1px " + COLOR_CORRECT;
                    div.style.background = "#002525";
                    div.style.padding = "1em";
                    div.style.lineHeight = "1.25";
                    div.appendChild(tx("TIME: "));
                    div.appendChild(sc(msecToString(gameResult.time)));
                    div.appendChild(tx(" / " + msecToString(timeLimit)));
                    div.appendChild(document.createElement("br"));
                    div.appendChild(tx("CORRECT GLYPHS: "));
                    div.appendChild(sc(gameResult.correctCount));
                    div.appendChild(tx(" / " + glyphCount));
                    div.appendChild(document.createElement("br"));
                    if(timeLimit > 0){
                        div.appendChild(tx("SPEED BONUS: "));
                        div.appendChild(sc((gameResult.correctCount == glyphCount ? Math.floor(100 * (timeLimit - gameResult.time) / timeLimit) : 0) + "%")); //@todo floor?
                        div.appendChild(document.createElement("br"));
                    }
                    div.appendChild(tx("TRANSLATOR POINT: "));
                    div.appendChild(sc(gameResult.correctCount == glyphCount && glyphCount < GLYPHS_TRANSLATOR_POINT.length ? GLYPHS_TRANSLATOR_POINT[glyphCount] : 0));

                    var buttonBar = document.createElement("div");
                    buttonBar.style.marginTop = "0.5em";
                    buttonBar.style.textAlign = "right";
                    div.appendChild(buttonBar);
                    if(gameObj.showRetryButton){
                        putButton(buttonBar, "RETRY", function(){
                            closeScoreDiv();
                            ///@todo call gameObj.onEndGame?
                            hack(sequence, timeLimit);
                        }).style.marginRight = "0.5em";
                    }
                    putButton(buttonBar, "DONE", function(){
                        closeScoreDiv();
                        endPresentResult();
                    });

                    function closeScoreDiv()
                    {
                        div.parentNode.removeChild(div);
                    }

                    return div;
                }
                function presentScore()
                {
                    gameElement.appendChild(createScoreDiv());
                }
            }
            function endPresentResult()
            {
                if(gameObj.onEndGame){
                    gameObj.onEndGame();
                }
            }
        }

        return gameObj;
    }

    function insertSimpleGameAfterLastScriptNode(recordHackResult)
    {
        var gameObj = createGame();
        if(recordHackResult){ //require glyph-game-record.js
            if(!igt.glyphGameRecord){
                alert("require glyph-game-record.js");
            }
            gameObj.onUpdateResult = function(){
                igt.glyphGameRecord.addGlyphGameResult(
                    gameObj.userSelectedLevel,
                    gameObj.sequence.map(function(g){return g.glyph.toString();}), //getGlyphCodesFromSequence
                    gameObj.result);
                igt.glyphGameRecord.save();
            };
        }
        gameObj.onEndGame = function(){
            gameObj.inputLevel();
        };
        igt.getLastScriptNode().parentNode.appendChild(gameObj.element);

        igt.controlViewportMetaElement(gameObj.element);

        gameObj.inputLevel();
    }

    igt.glyphHacking = insertSimpleGameAfterLastScriptNode;
    igt.glyphGame = {
        createGame: createGame,
        putSimpleGame: insertSimpleGameAfterLastScriptNode,
        getLevelGlyphCount: getLevelGlyphCount,
        getLevelTimeLimit: getLevelTimeLimit
    };
})();
