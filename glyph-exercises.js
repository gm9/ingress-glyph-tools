/*
 * Copyright (c) 2014 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

(function(){
    var igt = gm9.IngressGlyphTools;
    var Glyph = igt.Glyph;

    function createExercisesElement()
    {
        var padSize = 300;
        var fontSize = 40;

        var exercisesElement = document.createElement("div");
        exercisesElement.style.width = (padSize+2) + "px";
        exercisesElement.style.marginLeft = "auto";
        exercisesElement.style.marginRight = "auto";
        exercisesElement.style.position = "relative";

        var wordDiv = document.createElement("div");
        exercisesElement.appendChild(wordDiv);
        wordDiv.style.fontWeight = "bold";
        wordDiv.style.fontSize = fontSize + "px";
        wordDiv.style.textAlign = "center";
        wordDiv.style.position = "absolute";
        wordDiv.style.width = (padSize+2) + "px";
        wordDiv.style.left = "0";
        wordDiv.style.top = (padSize - fontSize)/2 + "px";
        wordDiv.style.textShadow = "0 0 10px #000000";

        var pad = igt.createInputPad({
            size: padSize,
            style: {
                color: "white"
            }});
        exercisesElement.appendChild(pad);

        var dic = igt.glyphtionary;
        var currentGlyph = null;
        var currentWord = null;
        var currentResult = false;

        function showWord(str)
        {
            hideWord();
            wordDiv.appendChild(document.createTextNode(str));
        }
        function hideWord()
        {
            while(wordDiv.firstChild){wordDiv.removeChild(wordDiv.firstChild);}
        }
        function nextQuestion()
        {
            var entryIndex = Math.floor(Math.random() * dic.getEntryCount());
            var entry = dic.getEntryAt(entryIndex);
            currentGlyph = entry.keyGlyph;
            currentWord = entry.value[0]; ///@todo 
            showQuestion();
        }
        function showQuestion()
        {
            pad.style.background = "#202020";
            showQuestionWord();
        }
        function showQuestionWord()
        {
            pad.clearGlyph();
            pad.setLimitInputStroke(0);

            showWord(currentWord);

            setTimeout(showQuestionGlyph, 1000);
        }
        function showQuestionGlyph()
        {
            hideWord();
            pad.setGlyph(currentGlyph);
            setTimeout(inputAnswer, 1000);
        }
        function inputAnswer()
        {
            pad.style.background = "";
            pad.clearGlyph();
            pad.setLimitInputStroke(1);
            pad.addEventListener("glyphstrokeend", onStrokeEnd, false);
        }
        function onStrokeEnd()
        {
            pad.removeEventListener("glyphstrokeend", onStrokeEnd, false);
            showResult(Glyph.equals(pad.getGlyph(), currentGlyph));
        }
        function showResult(result){
            currentResult = result;
            pad.style.background = result ? "#8ef7d7" : "#ff5a5a";
            if(result){
                //correct
                showWord(currentWord);
                setTimeout(nextQuestion, 1000);
            }
            else{
                //incorrect
                setTimeout(showQuestion, 1000);
            }
        }

        nextQuestion();

        return exercisesElement;
    }
    function insertExercisesElementAfterLastScriptNode()
    {
        var exercisesElement = createExercisesElement();
        igt.getLastScriptNode().parentNode.appendChild(exercisesElement);

        igt.controlViewportMetaElement(exercisesElement);
    }

    igt.exercises = insertExercisesElementAfterLastScriptNode;
})();
