/*
 * Copyright (c) 2014 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

(function(){
    // import
    var igt = gm9.IngressGlyphTools;
    // レベル毎のグリフシーケンス
    // 小文字は読み方が曖昧な(自信がない)グリフ
    var LEVEL_SEQUENCES = [
        //L0
        [
        ],
        //L1
        [
        ],
        //L2
        [
        ],
        //L3
        [
        ],
        //L4
        [
        ],
        //L5
        [
        ],
        //L6
        [
        ],
        //L7
        [
            ["ATTACK", "WEAK", "SHAPERS", "LIE"],
            ["CAPTURE", "FEAR", "DISCOVER", "COURAGE"],
            ["CHANGE", "FUTURE", "CAPTURE", "DESTINY"],
            ["CHANGE", "HUMAN", "POTENTIAL", "USE"],
            ["CHAOS", "barrier", "SHAPERS", "PORTAL"],
            ["CLEAR", "MIND", "OPEN", "MIND"],
            ["CLEARALL", "OPENALL", "DISCOVER", "TRUTH"],
            ["CONTEMPLATE", "COMPLEX", "SHAPERS", "CIVILIZATION"],
            ["COURAGE", "attack", "shapers", "FUTURE"],
            ["CREATE", "FUTURE", "NOT", "WAR"],
            ["DEFEND", "MESSAGE", "ANSWER", "IDEA"],
            ["DESTROY", "DESTINY", "HUMAN", "LIE"],
            ["DETERIORATE", "HUMAN", "WEAK", "REBEL"],
            ["ESCAPE", "SIMPLE", "HUMAN", "FUTURE"],
            ["HARMONY", "PATH", "NOURISH", "PRESENT"],
            ["HELP", "GAIN", "CREATE", "PURSUE"],
            ["HIDE", "IMPURE", "HUMAN", "THOUGHT"],
            ["HUMAN", "HAVE", "IMPURE", "CIVILIZATION"],
            ["HUMAN", "PAST", "PRESENT", "FUTURE"],
            ["HUMAN", "SOUL", "STRONG", "PURE"],
            ["IMPROVE", "BODY", "MIND", "SOUL"],
            ["IMPROVE", "BODY", "PURSUE", "JOURNEY"],
            ["INSIDE", "MIND", "JOURNEY", "PERFECTION"],
            ["JOURNEY", "not", "IMPROVE", "SOUL"],
            ["LEAD", "PURSUE", "REACT", "DEFEND"],
            ["LESS", "SOUL", "MORE", "MIND"],
            ["LESS", "TRUTH", "MORE", "CHAOS"],
            ["LOSE", "DANGER", "GAIN", "SAFETY"],
            ["PAST", "AGAIN", "PRESENT", "AGAIN"],
            ["PATH", "RESTRAINT", "STRONG", "SAFETY"],
            ["PORTAL", "CHANGE", "CIVILIZATION", "END"],
            ["PORTAL", "DIE", "CIVILIZATION", "DIE"],
            ["QUESTION", "TRUTH", "GAIN", "FUTURE"],
            ["RESTRAINT", "FEAR", "AVOID", "DANGER"],
            ["RESTRAINT", "PATH", "GAIN", "HARMONY"],
            ["SEARCH", "DATA", "DISCOVER", "PATH"],
            ["SEARCH", "XM", "SAVE", "PORTAL"],
            ["SEE", "TRUTH", "SEE", "FUTURE"],
            ["SHAPERS", "CHAOS", "PURE", "HARM"],
            ["SHAPERS", "MIND", "COMPLEX", "HARMONY"],
            ["SHAPERS", "PAST", "PRESENT", "FUTURE"],
            ["SIMPLE", "CIVILIZATION", "IMPURE", "WEAK"],
            ["SIMPLE", "MESSAGE", "COMPLEX", "IDEA"],
            ["SIMPLE", "TRUTH", "BREATHE", "NATURE"],
            ["SOUL", "REBEL", "HUMAN", "DIE"],
            ["STAY", "TOGETHER", "DEFEND", "TRUTH"],
            ["STRONG", "idea", "PURSUE", "TRUTH"],
            ["TOGETHER", "DISCOVER", "HARMONY", "EQUAL"],
            ["TRUTH", "IDEA", "DISCOVER", "XM"],
            ["struggle", "DEFEND", "SHAPERS", "DANGER"]
        ],
        //L8
        [
            ["XM", "create", "complex", "shapers", "DESTINY"],
            ["advance", "civilization", "pursue", "shapers", "PATH"],
            ["answer", "question", "discover", "difficult", "TRUTH"],
            ["avoid", "balance", "stay", "human", "SELF"],
            ["avoid", "chaos", "avoid", "shapers", "LIE"],
            ["avoid", "chaos", "repair", "potential", "WAR"],
            ["breathe", "inside", "XM", "lose", "SELF"],
            ["capture", "portal", "defend", "portal", "COURAGE"],
            ["chaos", "war", "conflict", "discover", "PEACE"],
            ["civilization", "die", "new", "civilization", "BEGIN"],
            ["clear", "mind", "liberate", "barrier", "BODY"],
            ["clearall", "idea", "past", "present", "FUTURE"],
            ["contemplate", "future", "inside", "shapers", "PATH"],
            ["contemplate", "restraint", "discover", "more", "COURAGE"],
            ["courage", "attack", "shapers", "portal", "TOGETHER"],
            ["create", "pure", "future", "human", "civilization"],
            ["create", "pure", "future", "not", "WAR"],
            ["create", "separate", "path", "end", "journey"],
            ["defend", "destiny", "defend", "human", "CIVILIZATION"],
            ["defend", "human", "civilization", "XM", "MESSAGE"],
            ["defend", "human", "civilization", "portal", "DATA"],
            ["defend", "human", "civilization", "shapers", "LIE"],
            ["defend", "human", "civilization", "shapers", "PORTAL"],
            ["destroy", "civilization", "end", "conflict", "WAR"],
            ["destroy", "lie", "not", "gain", "SOUL"],
            ["distance", "self", "avoid", "human", "LIE"],
            ["easy", "path", "future", "follow", "SHAPERS"],
            ["end", "old", "civilization", "create", "NEW"],
            ["escape", "body", "journey", "distance", "PRESENT"],
            ["forget", "past", "see", "present", "DANGER"],
            ["gain", "truth", "open", "human", "SOUL"],
            ["harm", "evolution", "pursue", "more", "WAR"],
            ["help", "enlightened", "capture", "all", "portal"],
            ["help", "human", "civilization", "pursue", "DESTINY"],
            ["help", "resistance", "capture", "all", "PORTAL"],
            ["hide", "struggle", "advance", "strong", "TOGETHER"],
            ["human", "shapers", "together", "create", "DESTINY"],
            ["imperfect", "XM", "message", "human", "CHAOS"],
            ["imperfect", "XM", "open", "complex", "ANSWER"],
            ["inside", "mind", "inside", "soul", "HARMONY"],
            ["liberate", "portal", "liberate", "human", "MIND"],
            ["liberate", "self", "liberate", "human", "CIVILIZATION"],
            ["lose", "shapers", "message", "gain", "CHAOS"],
            ["mind", "body", "soul", "pure", "HUMAN"],
            ["more", "data", "gain", "portal", "ADVANCE"],
            ["old", "nature", "less", "strong", "present"],
            ["past", "chaos", "create", "future", "HARMONY"],
            ["past", "path", "create", "future", "JOURNEY"],
            ["portal", "barrier", "defend", "human", "SHAPERS"],
            ["portal", "create", "danger", "pursue", "SAFETY"],
            ["portal", "improve", "human", "future", "CIVILIZATION"],
            ["present", "chaos", "create", "future", "CIVILIZATION"],
            ["pure", "human", "failure", "present", "CHAOS"],
            ["pursue", "conflict", "attack", "advance", "CHAOS"],
            ["pursue", "path", "distance", "shapers", "LIE"],
            ["question", "less", "forget", "all", "LIE"],
            ["react", "rebel", "question", "shapers", "LIE"],
            ["rebel", "idea", "evolution", "destiny", "NOW"],
            ["repair", "present", "repair", "human", "SOUL"],
            ["repair", "soul", "less", "human", "HARM"],
            ["search", "destiny", "create", "pure", "future"],
            ["separate", "mind", "body", "discover", "ENLIGHTENMENT"],
            ["shapers", "lead", "human", "complex", "JOURNEY"],
            ["shapers", "portal", "data", "create", "chaos"],
            ["shapers", "portal", "message", "destroy", "CIVILIZATION"],
            ["shapers", "see", "complex", "path", "DESTINY"],
            ["shapers", "want", "human", "mind", "FUTURE"],
            ["simple", "old", "truth", "journey", "INSIDE"],
            ["simple", "truth", "forget", "easy", "SUCCESS"],
            ["simple", "truth", "shapers", "destroy", "civilization"],
            ["stay", "strong", "together", "defend", "RESISTANCE"],
            ["strong", "together", "attack", "together", "CHAOS"],
            ["strong", "together", "attack", "together", "DESTINY"],
            ["use", "mind", "use", "courage", "CHANGE"],
            ["use", "restraint", "follow", "easy", "PATH"],
            ["want", "truth", "pursue", "difficult", "PATH"],
            ["weak", "human", "destiny", "destroy", "CIVILIZATION"]
        ]
    ];

    igt.sequenceDic = {
        getSequences: function(lv){ return LEVEL_SEQUENCES[lv];},
        getSequenceRandom: function(lv){
            var seqs = LEVEL_SEQUENCES[lv];
            return seqs && seqs.length > 0 ? seqs[Math.floor(Math.random() * seqs.length)] : null;
        }
    };
})();
