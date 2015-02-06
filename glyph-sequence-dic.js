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
            ["ACCEPT", "HUMAN", "WEAK"],
            ["ADVANCE", "PURE", "TRUTH"],
            ["ALL", "CIVILIZATION", "CHAOS"],
            ["ATTACK", "SHAPERS", "CHAOS"],
            ["AVOID", "DESTINY", "LIE"],
            ["COURAGE", "DESTINY", "REBEL"],
            ["DESTROY", "IMPURE", "TRUTH"],
            ["DISCOVER", "RESISTANCE", "TRUTH"],
            ["DISCOVER", "SHAPERS", "ENLIGHTENMENT"],
            ["DISCOVER", "SHAPERS", "MESSAGE"],
            ["ESCAPE", "IMPURE", "EVOLUTION"],
            ["FOLLOW", "PURE", "JOURNEY"],
            ["HUMAN", "GAIN", "SAFETY"],
            ["IMPROVE", "HUMAN", "SHAPERS"],
            ["INSIDE", "XM", "TRUTH"],
            ["JOURNEY", "INSIDE", "SOUL"],
            ["LIBERATE", "HUMAN", "FUTURE"],
            ["PEACE", "SIMPLE", "JOURNEY"],
            ["PERFECTION", "PATH", "PEACE"],
            ["PURSUE", "PURE", "BODY"],
            ["QUESTION", "HIDE", "TRUTH"],
            ["RETREAT", "SEARCH", "SAFETY"],
            ["WAR", "DESTROY", "FUTURE"],
            ["XM", "NOURISH", "CIVILIZATION"]
        ],
        //L6
        [
        ],
        //L7
        [
            ["ATTACK", "WEAK", "SHAPERS", "LIE"],
            ["BREATHE", "AGAIN", "JOURNEY", "AGAIN"],
            ["CAPTURE", "FEAR", "DISCOVER", "COURAGE"],
            ["CHANGE", "FUTURE", "CAPTURE", "DESTINY"],
            ["CHANGE", "HUMAN", "POTENTIAL", "USE"],
            ["CHAOS", "barrier", "SHAPERS", "PORTAL"],
            ["CLEAR", "MIND", "OPEN", "MIND"],
            ["CLEARALL", "OPENALL", "DISCOVER", "TRUTH"],
            ["CONTEMPLATE", "COMPLEX", "SHAPERS", "CIVILIZATION"],
            ["COURAGE", "attack", "shapers", "FUTURE"],
            ["CREATE", "DISTANCE", "IMPURE", "PATH"],
            ["CREATE", "FUTURE", "NOT", "WAR"],
            ["DEFEND", "MESSAGE", "ANSWER", "IDEA"],
            ["DESTROY", "DESTINY", "HUMAN", "LIE"],
            ["DETERIORATE", "HUMAN", "WEAK", "REBEL"],
            ["ESCAPE", "SIMPLE", "HUMAN", "FUTURE"],
            ["FOLLOW", "SHAPERS", "PORTAL", "MESSAGE"],
            ["FORGET", "CONFLICT", "ACCEPT", "WAR"],
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
            ["LIBERATE", "XM", "PORTAL", "TOGETHER"],
            ["LOSE", "DANGER", "GAIN", "SAFETY"],
            ["PAST", "AGAIN", "PRESENT", "AGAIN"],
            ["PATH", "RESTRAINT", "STRONG", "SAFETY"],
            ["PORTAL", "CHANGE", "CIVILIZATION", "END"],
            ["PORTAL", "DIE", "CIVILIZATION", "DIE"],
            ["QUESTION", "TRUTH", "GAIN", "FUTURE"],
            ["RESTRAINT", "FEAR", "AVOID", "DANGER"],
            ["RESTRAINT", "PATH", "GAIN", "HARMONY"],
            ["SEARCH", "DATA", "DISCOVER", "PATH"],
            ["SEARCH", "TRUTH", "SAVE", "CIVILIZATION"],
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
            ["STRONG", "IDEA", "PURSUE", "TRUTH"],
            ["STRUGGLE", "DEFEND", "SHAPERS", "DANGER"],
            ["STRUGGLE", "IMPROVE", "HUMAN", "SOUL"],
            ["TOGETHER", "DISCOVER", "HARMONY", "EQUAL"],
            ["TRUTH", "IDEA", "DISCOVER", "XM"],
            ["XM", "DIE", "CHAOS", "LIVE"]
        ],
        //L8
        [
            ["advance", "civilization", "pursue", "shapers", "PATH"],
            ["ANSWER", "QUESTION", "DISCOVER", "DIFFICULT", "TRUTH"],
            ["AVOID", "PERFECTION", "STAY", "HUMAN", "SELF"],
            ["avoid", "chaos", "avoid", "shapers", "LIE"],
            ["avoid", "chaos", "repair", "potential", "WAR"],
            ["breathe", "inside", "XM", "lose", "SELF"],
            ["capture", "portal", "defend", "portal", "COURAGE"],
            ["CHAOS", "WAR", "CONFLICT", "DISCOVER", "PEACE"],
            ["civilization", "die", "new", "civilization", "BEGIN"],
            ["clear", "mind", "liberate", "barrier", "BODY"],
            ["clearall", "idea", "past", "present", "FUTURE"],
            ["CONTEMPLATE", "FUTURE", "NOT", "SHAPERS", "PATH"],
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
            ["DESTROY", "CIVILIZATION", "END", "CONFLICT", "WAR"],
            ["destroy", "lie", "not", "gain", "SOUL"],
            ["distance", "self", "avoid", "human", "LIE"],
            ["easy", "path", "future", "follow", "SHAPERS"],
            ["end", "old", "civilization", "create", "NEW"],
            ["escape", "body", "journey", "distance", "PRESENT"],
            ["escape", "body", "mind", "self", "WANT"],
            ["forget", "attack", "see", "outside", "harmony"],
            ["forget", "past", "see", "present", "DANGER"],
            ["gain", "truth", "open", "human", "SOUL"],
            ["HARM", "PROGRESS", "PURSUE", "MORE", "WAR"],
            ["help", "enlightened", "capture", "all", "portal"],
            ["HELP", "HUMAN", "CIVILIZATION", "PURSUE", "DESTINY"],
            ["help", "resistance", "capture", "all", "PORTAL"],
            ["hide", "struggle", "advance", "strong", "TOGETHER"],
            ["human", "not", "together", "civilization", "deteriorate"],
            ["human", "shapers", "together", "create", "DESTINY"],
            ["imperfect", "TRUTH", "open", "complex", "ANSWER"],
            ["imperfect", "XM", "message", "human", "CHAOS"],
            ["inside", "mind", "inside", "soul", "HARMONY"],
            ["liberate", "portal", "liberate", "human", "MIND"],
            ["liberate", "self", "liberate", "human", "CIVILIZATION"],
            ["lose", "shapers", "message", "gain", "CHAOS"],
            ["MIND", "BODY", "SOUL", "PURE", "HUMAN"],
            ["more", "data", "gain", "portal", "ADVANCE"],
            ["old", "nature", "less", "strong", "present"],
            ["past", "chaos", "create", "future", "HARMONY"],
            ["past", "path", "create", "future", "JOURNEY"],
            ["portal", "barrier", "defend", "human", "SHAPERS"],
            ["portal", "create", "danger", "pursue", "SAFETY"],
            ["portal", "improve", "human", "future", "CIVILIZATION"],
            ["portal", "potential", "help", "human", "future"],
            ["present", "chaos", "create", "future", "CIVILIZATION"],
            ["PURE", "HUMAN", "FAILURE", "NOW", "CHAOS"],
            ["PURSUE", "CONFLICT", "WAR", "ADVANCE", "CHAOS"],
            ["pursue", "path", "distance", "shapers", "LIE"],
            ["QUESTION", "LESS", "FORGET", "ALL", "LIE"],
            ["REACT", "REBEL", "QUESTION", "SHAPERS", "LIE"],
            ["REBEL", "THOUGHT", "EVOLUTION", "DESTINY", "NOW"],
            ["REPAIR", "PRESENT", "REPAIR", "HUMAN", "SOUL"],
            ["repair", "soul", "less", "human", "HARM"],
            ["save", "human", "civilization", "destroy", "PORTAL"],
            ["search", "destiny", "create", "pure", "future"],
            ["separate", "mind", "body", "discover", "ENLIGHTENMENT"],
            ["separate", "truth", "lie", "shapers", "future"],
            ["SHAPERS", "LEAD", "HUMAN", "COMPLEX", "JOURNEY"],
            ["shapers", "portal", "data", "create", "chaos"],
            ["shapers", "portal", "message", "destroy", "CIVILIZATION"],
            ["shapers", "see", "complex", "path", "DESTINY"],
            ["shapers", "want", "human", "mind", "FUTURE"],
            ["simple", "old", "truth", "journey", "INSIDE"],
            ["simple", "truth", "forget", "easy", "SUCCESS"],
            ["simple", "truth", "shapers", "destroy", "civilization"],
            ["STAY", "STRONG", "TOGETHER", "DEFEND", "RESISTANCE"],
            ["strong", "together", "attack", "together", "CHAOS"],
            ["STRONG", "TOGETHER", "WAR", "TOGETHER", "DESTINY"],
            ["use", "mind", "use", "courage", "CHANGE"],
            ["USE", "RESTRAINT", "FOLLOW", "EASY", "PATH"],
            ["want", "truth", "pursue", "difficult", "PATH"],
            ["weak", "human", "destiny", "destroy", "CIVILIZATION"],
            ["XM", "create", "complex", "human", "DESTINY"],
            //["XM", "create", "complex", "shapers", "DESTINY"],
            ["XM", "PATH", "FUTURE", "DESTINY", "HARMONY"]
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
