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
        function setBGColor(color)
        {
            pad.style.background = color;
        }

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
        function showWord(str)
        {
            hideWord();
            wordDiv.appendChild(document.createTextNode(str));
        }
        function hideWord()
        {
            while(wordDiv.firstChild){wordDiv.removeChild(wordDiv.firstChild);}
        }

        var pad = igt.createInputPad({
            size: padSize,
            style: {
                color: "white"
            }});
        exercisesElement.appendChild(pad);

        var currentGlyph = null;
        var currentWord = null;


        function nextQuestion()
        {
            var wg = igt.glyphDic.getWordGlyphRandom();
            currentGlyph = wg.glyph;
            currentWord = wg.word;
            showQuestion();
        }
        function showQuestion()
        {
            setBGColor("#303030");
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
            setBGColor("");
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
            if(result){
                //correct
                setBGColor("#8ef7d7");
                showWord(currentWord);
                setTimeout(nextQuestion, 1000);
            }
            else{
                //incorrect
                setBGColor("#ff5a5a");
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
