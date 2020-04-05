/*
 * Copyright (c) 2014 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

(function(){
    // import
    var igt = gm9.IngressGlyphTools;


    //
    // Discovered:
    // - 20151120
    // - 20161029
    // - 20170106
    // - 20170513
    // - 20190401 toasty
    // - 20190531 osiris
    // - 20190720 nemesis
    // - 20190727 field,key,link,shield,star
    //            https://fevgames.net/new-glyphs-in-ingress/
    // - 20200401 n,l,1,3


    // レベル毎のグリフシーケンス
    // 小文字は読み方が曖昧な(自信がない)グリフ
    var SEQUENCES = [
        // Levels Discovered, Date Discovered, Sequence
        //L0
        //L1
        [0], 20170106, ["adapt"],
        [0], 20161029, ["abandon"],
        [0], 0, ["advance"],
        [0], 20170106, ["after"],
        [0], 0, ["again"],
        [0], 0, ["all"],
        [0], 0, ["answer"],
        [0], 0, ["attack"],
        [0], 0, ["avoid"],
        [0], 0, ["barrier"],
        [0], 20170106, ["before"],
        [0], 20161029, ["begin"],
        [0], 0, ["body"],
        [0], 0, ["breathe"],
        [0], 0, ["capture"],
        [0], 0, ["change"],
        [0], 0, ["chaos"],
        [0], 0, ["civilization"],
        [0], 0, ["clear"],
        [0], 0, ["clearall"],
        [0], 0, ["complex"],
        [0], 0, ["conflict"],
        [0], 20170513, ["CONSEQUENCE"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1
        [0], 0, ["contemplate"],
        [0], 0, ["courage"],
        [0], 0, ["create"],
        [0], 0, ["danger"],
        [0], 0, ["data"],
        [0], 0, ["defend"],
        [0], 20161029, ["destination"],
        [0], 0, ["destiny"],
        [0], 0, ["destroy"],
        [0], 0, ["deteriorate"],
        [0], 0, ["die"],
        [0], 0, ["difficult"],
        [0], 0, ["discover"],
        [0], 0, ["distance"],
        [0], 0, ["easy"],
        [0], 0, ["end"],
        [0], 0, ["enlightenment"],
        [0], 0, ["equal"],
        [0], 0, ["escape"],
        [0], 0, ["evolution"],
        [0], 0, ["failure"],
        [0], 0, ["fear"],
        [0], 20190727, ["field"],
        [0], 0, ["follow"],
        [0], 0, ["forget"],
        [0], 0, ["future"],
        [0], 0, ["gain"],
        [0], 0, ["harm"],
        [0], 0, ["harmony"],
        [0], 0, ["have"],
        [0], 0, ["help"],
        [0], 0, ["hide"],
        [0], 0, ["human"],
        [0], 0, ["idea"],
        [0], 0, ["ignore"],
        [0], 0, ["imperfect"],
        [0], 0, ["improve"],
        [0], 0, ["impure"],
        [0], 0, ["inside"],
        [0], 20170106, ["interrupt"],
        [0], 0, ["journey"],
        [0], 20190727, ["key"],
        [0], 20161029, ["knowledge"],
        [0], 0, ["lead"],
        [0], 20161029, ["legacy"],
        [0], 0, ["less"],
        [0], 0, ["liberate"],
        [0], 0, ["lie"],
        [0], 20190727, ["link"],
        [0], 20170513, ["LIVE AGAIN"],
        [0], 0, ["lose"],
        [0], 0, ["message"],
        [0], 0, ["mind"],
        [0], 0, ["more"],
        [0], 20170106, ["mystery"],
        [0], 0, ["nature"],
        [0], 20190720, ["nemesis"],
        [0], 0, ["new"],
        [0], 0, ["nourish"],
        [0], 20161029, ["n'zeer"],
        [0], 0, ["old"],
        [0], 0, ["open"],
        [0], 0, ["openall"],
        [0], 0, ["past"],
        [0], 0, ["path"],
        [0], 0, ["perfection"],
        [0], 20161029, ["perspective"],
        [0], 0, ["portal"],
        [0], 0, ["potential"],
        [0], 20170513, ["PRESENCE"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [0], 0, ["present"],
        [0], 0, ["pure"],
        [0], 0, ["pursue"],
        [0], 0, ["question"],
        [0], 0, ["react"],
        [0], 0, ["rebel"],
        [0], 0, ["repair"],
        [0], 0, ["resistance"],
        [0], 0, ["restraint"],
        [0], 0, ["retreat"],
        [0], 0, ["safety"],
        [0], 0, ["save"],
        [0], 0, ["search"],
        [0], 0, ["see"],
        [0], 0, ["self"],
        [0], 0, ["separate"],
        [0], 0, ["shapers"],
        [0], 20190727, ["shield"],
        [0], 0, ["simple"],
        [0], 0, ["soul"],
        [0], 0, ["stability"],
        [0], 20190727, ["star"],
        [0], 0, ["strong"],
        [0], 20170513, ["THEM"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [0], 0, ["together"],
        [0], 0, ["truth"],
        [0], 20161029, ["us"],
        [0], 0, ["use"],
        [0], 20170106, ["victory"],
        [0], 0, ["want"],
        [0], 0, ["weak"],
        [0], 20170513, ["WORTH"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [0], 0, ["xm"],
        [0], 20170106, ["you"],
        //L2
        //L3
        //L4
        // http://www.ingress.tv/2-glyph-hack-sequences.html
        [2], 20161029, ["ABANDON", "FEAR"], //https://fevgames.net/new-ingress-glyphs/
        [2], 20170106, ["ADAPT", "TECHNOLOGY"], //https://fevgames.net/happy-new-glyph-year/
        [2], 0, ["all", "chaos"],
        [2], 0, ["attack", "chaos"],
        [2], 0, ["attack", "difficult"],
        [2], 0, ["capture", "portal"],
        [2], 20161029, ["CHANGE", "PERSPECTIVE"], //https://fevgames.net/new-ingress-glyphs/
        [2], 0, ["civilization", "chaos"],
        [2], 20170513, ["CLEAR","CONSEQUENCE"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1
        [2], 20190727, ["clearall", "link"],
        [2], 0, ["create", "danger"],
        [2], 20170513, ["destroy","live again"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [2], 20190727, ["discover", "key"],
        [2], 0, ["discover", "lie"],
        [2], 0, ["discover", "portal"],
        [2], 0, ["discover", "safety"],
        [2], 20190727, ["field", "all"],
        [2], 20161029, ["FUTURE", "DESTINATION"], //https://fevgames.net/new-ingress-glyphs/
        [2], 20170513, ["help","them"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [2], 20170106, ["Interrupt", "Evolution"], //https://fevgames.net/happy-new-glyph-year/
        [2], 20190727, ["key", "link"],
        [2], 0, ["lead", "enlightenment"],
        [2], 0, ["liberate", "xm"],
        [2], 20190727, ["link", "field"],
        [2], 0, ["nourish", "journey"],
        [2], 0, ["openall", "truth"],
        [2], 0, ["path", "perfection"],
        [2], 20170513, ["PORTAL", "PRESENCE"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [2], 0, ["pure", "body"],
        [2], 0, ["pure", "human"],
        [2], 0, ["pure", "truth"],
        [2], 0, ["pursue", "truth"],
        [2], 0, ["pursue", "xm"],
        [2], 0, ["question", "war"],
        [2], 0, ["search", "past"],
        [2], 0, ["search", "potential"],
        [2], 0, ["separate", "war"],
        [2], 20190727, ["shield", "mind"],
        [2], 20190727, ["shield", "portal"],
        [2], 20190727, ["star", "nature"],
        [2], 20170106, ["YOU", "ADAPT"], //https://fevgames.net/happy-new-glyph-year/
        //L5
        //L6
        [5], 20161029, ["ABANDON", "FEAR", "TOGETHER"], //https://fevgames.net/new-ingress-glyphs/
        [5], 0, ["ACCEPT", "HUMAN", "WEAK"],
        [5], 0, ["ADVANCE", "PURE", "TRUTH"],
        [5], 0, ["ALL", "CIVILIZATION", "CHAOS"],
        [5], 20161029, ["ANSWER", "N'ZEER", "QUESTION"], //https://fevgames.net/new-ingress-glyphs/
        [5], 20190727, ["attack", "capture", "link"],
        [5], 0, ["ATTACK", "SHAPERS", "CHAOS"],
        [5], 0, ["AVOID", "CHAOS", "SOUL"],
        [5], 0, ["AVOID", "DESTINY", "LIE"],
        [5], 0, ["AVOID", "PURE", "CHAOS"],
        [5], 20161029, ["BEGIN", "NEW", "STRUGGLE"], //https://fevgames.net/new-ingress-glyphs/
        [5], 20170106, ["CAPTURE", "VICTORY", "TOGETHER"], //https://fevgames.net/happy-new-glyph-year/
        [5], 20161029, ["CHANGE", "PERSPECTIVE", "TECHNOLOGY"], //https://fevgames.net/new-ingress-glyphs/
        [5], 20170106, ["CLEAR", "YOUR", "MIND"], //https://fevgames.net/happy-new-glyph-year/
        [5], 20170513, ["conflict","grow","war"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 0, ["COURAGE", "DESTINY", "REBEL"],
        [5], 20170513, ["create","truth","legacy"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 0, ["DANGER", "CHANGE", "PAST"],
        [5], 20170513, ["defend","human","lie"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 0, ["DESTROY", "DIFFICULT", "BARRIER"],
        [5], 0, ["DESTROY", "IMPURE", "TRUTH"],
        [5], 20190727, ["destroy", "portal", "shield"],
        [5], 0, ["DISCOVER", "RESISTANCE", "TRUTH"],
        [5], 0, ["DISCOVER", "SHAPERS", "ENLIGHTENMENT"],
        [5], 0, ["DISCOVER", "SHAPERS", "LIE"],
        [5], 0, ["DISCOVER", "SHAPERS", "MESSAGE"],
        [5], 0, ["ESCAPE", "IMPURE", "EVOLUTION"],
        [5], 0, ["ESCAPE", "IMPURE", "FUTURE"],
        [5], 20170513, ["fear","imperfect","technology"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 20190727, ["field", "all", "mind"],
        [5], 20190727, ["field", "before", "civilization"],
        [5], 20190727, ["field", "nourish", "civilization"],
        [5], 0, ["FOLLOW", "PURE", "JOURNEY"],
        [5], 20161029, ["GAIN", "MORE", "KNOWLEDGE"], //https://fevgames.net/new-ingress-glyphs/
        [5], 20170513, ["grow","shapers","presence"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 0, ["HARM", "DANGER", "AVOID"],
        [5], 20161029, ["HELP", "US", "ALL"], //https://fevgames.net/new-ingress-glyphs/
        [5], 0, ["HUMAN", "GAIN", "SAFETY"],
        [5], 20161029, ["HUMAN", "KNOWLEDGE", "LEGACY"], //https://fevgames.net/new-ingress-glyphs/
        [5], 0, ["IMPROVE", "ADVANCE", "PRESENT"],
        [5], 0, ["IMPROVE", "HUMAN", "SHAPERS"],
        [5], 0, ["INSIDE", "XM", "TRUTH"],
        [5], 20170106, ["INTERRUPT", "ENLIGHTENED", "TECHNOLOGY"], //https://fevgames.net/happy-new-glyph-year/
        [5], 0, ["JOURNEY", "INSIDE", "SOUL"],
        [5], 20190727, ["journey", "link", "portal"],
        [5], 20190727, ["key", "potential", "link"],
        [5], 0, ["LEAD", "ENLIGHTENMENT", "CIVILIZATION"],
        [5], 0, ["LIBERATE", "HUMAN", "FUTURE"],
        [5], 20161029, ["LIE", "EQUAL", "FUTURE"], //https://fevgames.net/new-ingress-glyphs/
        [5], 20170513, ["N'ZEER", "technology", "perfection"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 0, ["PEACE", "SIMPLE", "JOURNEY"],
        [5], 20170513, ["peace","worth","more"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 0, ["PERFECTION", "PATH", "PEACE"],
        [5], 0, ["PURSUE", "PURE", "BODY"],
        [5], 0, ["QUESTION", "HIDE", "TRUTH"],
        [5], 20170513, ["question","potential","mystery"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 0, ["REACT", "IMPURE", "CIVILIZATION"],
        [5], 20190727, ["repair", "portal", "shield"],
        [5], 0, ["RETREAT", "SEARCH", "SAFETY"],
        [5], 20170513, ["share","enlightenment","knowledge"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 20170513, ["share","resistance","message"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [5], 20190727, ["star", "courage", "difficult"],
        [5], 20170106, ["TECHNOLOGY", "CAPTURE", "VICTORY"], //https://fevgames.net/happy-new-glyph-year/
        [5], 20170106, ["TOGETHER", "END", "MYSTERY"], //https://fevgames.net/happy-new-glyph-year/
        [5], 0, ["WAR", "DESTROY", "FUTURE"],
        [5], 20170106, ["XM", "GROW", "CREATIVITY(1216274548597a9a)"], //https://fevgames.net/happy-new-glyph-year/
        [5], 20190727, ["xm", "key", "knowledge"],
        [5], 0, ["XM", "NOURISH", "CIVILIZATION"],
        [5], 20170106, ["YOU", "HIDE", "CHAOS"], //https://fevgames.net/happy-new-glyph-year/
        //L7
        [7], 20161029, ["ABANDON", "FEAR", "DEFEND", "FUTURE"], //https://fevgames.net/new-ingress-glyphs/
        [7], 20161029, ["ABANDON", "FEAR", "SEE", "FUTURE"], //https://fevgames.net/new-ingress-glyphs/
        [7], 20170106, ["ADAPT", "thought", "DISCOVER", "evolution"], //https://fevgames.net/happy-new-glyph-year/
        [7], 0, ["ALL", "CHAOS", "INSIDE", "BODY"],
        [7], 0, ["ATTACK", "WEAK", "SHAPERS", "LIE"],
        [7], 20170106, ["BEFORE", "MYSTERY", "AFTER", "KNOWLEDGE"], //https://fevgames.net/happy-new-glyph-year/
        [7], 20161029, ["BEGIN", "HUMAN", "LEGACY", "NOW"], //https://fevgames.net/new-ingress-glyphs/
        [7], 20161029, ["BEGIN", "JOURNEY", "BREATHE", "XM"], //https://fevgames.net/new-ingress-glyphs/
        [7], 0, ["BREATHE", "AGAIN", "JOURNEY", "AGAIN"],
        [7], 0, ["BREATHE", "NATURE", "PERFECTION", "HARMONY"],
        [7], 0, ["CAPTURE", "FEAR", "DISCOVER", "COURAGE"],
        [7], 0, ["CHANGE", "FUTURE", "CAPTURE", "DESTINY"],
        [7], 0, ["CHANGE", "HUMAN", "POTENTIAL", "USE"],
        [7], 20161029, ["CHANGE", "PERSPECTIVE", "BEGIN", "NEW"], //https://fevgames.net/new-ingress-glyphs/
        [7], 0, ["CHAOS", "barrier", "SHAPERS", "PORTAL"],
        [7], 0, ["CLEAR", "MIND", "OPEN", "MIND"],
        [7], 0, ["CLEARALL", "OPENALL", "DISCOVER", "TRUTH"],
        [7], 20190727, ["contemplate", "chaos", "before", "link"],
        [7], 0, ["CONTEMPLATE", "COMPLEX", "SHAPERS", "CIVILIZATION"],
        [7], 0, ["CONTEMPLATE", "SELF", "PATH", "TRUTH"],
        [7], 0, ["COURAGE", "attack", "shapers", "FUTURE"],
        [7], 0, ["CREATE", "DISTANCE", "IMPURE", "PATH"],
        [7], 0, ["CREATE", "FUTURE", "NOT", "WAR"],
        [7], 20161029, ["CREATE", "NEW", "PORTAL", "POTENTIAL"], //https://fevgames.net/new-ingress-glyphs/
        [7], 20190727, ["defend", "field", "gain", "victory"],
        [7], 20170513, ["DEFEND","HUMAN","N'ZEER","LIE"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [7], 0, ["DEFEND", "MESSAGE", "ANSWER", "IDEA"],
        [7], 0, ["DESTROY", "DESTINY", "HUMAN", "LIE"],
        [7], 20190727, ["destroy", "field", "capture", "key"],
        [7], 0, ["DETERIORATE", "HUMAN", "WEAK", "REBEL"],
        [7], 20170513, ["difficult","knowledge","advance","mind"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [7], 20170106, ["ENLIGHTENED", "CAPTURE", "VICTORY", "TOGETHER"], //https://fevgames.net/happy-new-glyph-year/
        [7], 20170106, ["ESCAPE", "BEFORE", "PURE", "DEATH"], //https://fevgames.net/happy-new-glyph-year/
        [7], 0, ["ESCAPE", "SIMPLE", "HUMAN", "FUTURE"],
        [7], 20170513, ["fear","imperfect","n'zeer","technology"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [7], 0, ["FOLLOW", "SHAPERS", "PORTAL", "MESSAGE"],
        [7], 0, ["FORGET", "CONFLICT", "ACCEPT", "WAR"],
        [7], 0, ["HARMONY", "PATH", "NOURISH", "PRESENT"],
        [7], 20170106, ["HELP", "ENLIGHTENED", "STRONG", "VICTORY"], //https://fevgames.net/happy-new-glyph-year/
        [7], 0, ["HELP", "GAIN", "CREATE", "PURSUE"],
        [7], 20170106, ["HELP", "RESISTANCE", "STRONG", "VICTORY"], //https://fevgames.net/happy-new-glyph-year/
        [7], 20161029, ["HELP", "US", "SAVE", "US"], //https://fevgames.net/new-ingress-glyphs/
        [7], 20170106, ["HIDE", "CHAOS", "INSIDE", "BODY"], //https://fevgames.net/happy-new-glyph-year/
        [7], 0, ["HIDE", "IMPURE", "HUMAN", "THOUGHT"],
        [7], 0, ["HUMAN", "HAVE", "IMPURE", "CIVILIZATION"],
        [7], 0, ["HUMAN", "PAST", "PRESENT", "FUTURE"],
        [7], 0, ["HUMAN", "SOUL", "STRONG", "PURE"],
        [7], 0, ["IGNORE", "HUMAN", "CHAOS", "LIE"],
        [7], 0, ["IMPROVE", "BODY", "MIND", "SOUL"],
        [7], 0, ["IMPROVE", "BODY", "PURSUE", "JOURNEY"],
        [7], 0, ["INSIDE", "MIND", "JOURNEY", "PERFECTION"],
        [7], 20170106, ["INTERRUPT", "MESSAGE", "GAIN", "ADVANCE"], //https://fevgames.net/happy-new-glyph-year/
        [7], 0, ["JOURNEY", "INSIDE", "IMPROVE", "SOUL"],
        [7], 20170106, ["KNOWLEDGE", "HELP", "GAIN", "VICTORY"], //https://fevgames.net/happy-new-glyph-year/
        [7], 0, ["LEAD", "PURSUE", "REACT", "DEFEND"],
        [7], 20190727, ["less", "shield", "more", "harm"],
        [7], 0, ["LESS", "SOUL", "MORE", "MIND"],
        [7], 0, ["LESS", "TRUTH", "MORE", "CHAOS"],
        [7], 0, ["LIBERATE", "XM", "PORTAL", "TOGETHER"],
        [7], 20190727, ["link", "key", "field", "success"],
        [7], 20170513, ["live again","die","again","evolution"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [7], 0, ["LOSE", "DANGER", "GAIN", "SAFETY"],
        [7], 0, ["NOURISH", "XM", "CREATE", "THOUGHT"],
        [7], 20170513, ["N'ZEER", "legacy", "create", "future"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca (20170513? 20161029?)
        [7], 20161029, ["N'ZEER", "SHAPERS", "STRUGGLE", "KNOWLEDGE"], //https://fevgames.net/new-ingress-glyphs/
        [7], 20161029, ["N'ZEER", "TECHNOLOGY", "MIND", "EVOLUTION"], //https://fevgames.net/new-ingress-glyphs/
        [7], 20170513, ["N'ZEER", "TECHNOLOGY", "perfection", "truth"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca (20170513? 20161029?)
        [7], 20190727, ["openall", "link", "create", "star"],
        [7], 0, ["PAST", "AGAIN", "PRESENT", "AGAIN"],
        [7], 0, ["PATH", "RESTRAINT", "STRONG", "SAFETY"],
        [7], 0, ["PORTAL", "CHANGE", "CIVILIZATION", "END"],
        [7], 0, ["PORTAL", "DIE", "CIVILIZATION", "DIE"],
        [7], 0, ["PORTAL", "HAVE", "TRUTH", "DATA"],
        [7], 0, ["QUESTION", "TRUTH", "GAIN", "FUTURE"],
        [7], 0, ["RESTRAINT", "FEAR", "AVOID", "DANGER"],
        [7], 0, ["RESTRAINT", "PATH", "GAIN", "HARMONY"],
        [7], 0, ["SEARCH", "DATA", "DISCOVER", "PATH"],
        [7], 0, ["SEARCH", "TRUTH", "SAVE", "CIVILIZATION"],
        [7], 20161029, ["SEARCH", "XM", "DISTANCE", "DESTINATION"], //https://fevgames.net/new-ingress-glyphs/
        [7], 0, ["SEARCH", "XM", "SAVE", "PORTAL"],
        [7], 0, ["SEE", "TRUTH", "SEE", "FUTURE"],
        [7], 0, ["SEPARATE", "WEAK", "IGNORE", "TRUTH"],
        [7], 0, ["SHAPERS", "CHAOS", "PURE", "HARM"],
        [7], 0, ["SHAPERS", "MESSAGE", "END", "CIVILIZATION"],
        [7], 0, ["SHAPERS", "MIND", "COMPLEX", "HARMONY"],
        [7], 0, ["SHAPERS", "PAST", "PRESENT", "FUTURE"],
        [7], 0, ["SHAPERS", "SEE", "POTENTIAL", "EVOLUTION"],
        [7], 20190727, ["share", "key", "save", "all"],
        [7], 20190727, ["shield", "defend", "human", "civilization"],
        [7], 0, ["SIMPLE", "CIVILIZATION", "IMPURE", "WEAK"],
        [7], 0, ["SIMPLE", "MESSAGE", "COMPLEX", "IDEA"],
        [7], 0, ["SIMPLE", "TRUTH", "BREATHE", "NATURE"],
        [7], 0, ["SOUL", "REBEL", "HUMAN", "DIE"],
        [7], 0, ["STAY", "TOGETHER", "DEFEND", "TRUTH"],
        [7], 0, ["STRONG", "IDEA", "PURSUE", "TRUTH"],
        [7], 20190727, ["strong", "portal", "strong", "field"],
        [7], 0, ["STRONG", "TOGETHER", "AVOID", "WAR"],
        [7], 0, ["STRUGGLE", "DEFEND", "SHAPERS", "DANGER"],
        [7], 0, ["STRUGGLE", "IMPROVE", "HUMAN", "SOUL"],
        [7], 0, ["TOGETHER", "DISCOVER", "HARMONY", "EQUAL"],
        [7], 0, ["TRUTH", "IDEA", "DISCOVER", "XM"],
        //[7], 20170106, ["UNITY", "TOGETHER", "END", "MYSTERY"], //https://fevgames.net/happy-new-glyph-year/ (unity?)
        [7], 20170513, ["WAR","NOT","WORTH","CONSEQUENCE"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/gwk8syewNr1 https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [7], 20190727, ["weak", "portal", "weak", "field"],
        [7], 0, ["XM", "DIE", "CHAOS", "LIVE"],
        [7], 20170106, ["XM", "NOURISH", "STRONG", "CREATIVITY(1216274548597a9a)"], //https://fevgames.net/happy-new-glyph-year/
        [7], 20170513, ["xm","share","your","creativity"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        //L8
        [8], 20161029, ["ABANDON", "ALL", "TECHNOLOGY", "SAVE", "US"], //https://fevgames.net/new-ingress-glyphs/
        [8], 20161029, ["ABANDON", "FEAR", "DEFEND", "FUTURE", "TOGETHER"], //https://fevgames.net/new-ingress-glyphs/
        [8], 20161029, ["ABANDON", "FEAR", "SEE", "FUTURE", "DESTINATION"], //https://fevgames.net/new-ingress-glyphs/
        [8], 20170106, ["ADAPT", "THOUGHT", "DISCOVER", "SIMPLE", "SUCCESS"], //https://fevgames.net/happy-new-glyph-year/
        [8], 0, ["ADVANCE", "CIVILIZATION", "PURSUE", "SHAPERS", "PATH"],
        [8], 20170513, ["AFTER", "IMPERFECT", "HUMAN", "PRESENCE", "CONSEQUENCE"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca https://plus.google.com/101378392110622406150/posts/fmQLduJWVmi https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 20161029, ["ANSWER", "N'ZEER", "QUESTION", "POTENTIAL", "KNOWLEDGE"], //https://fevgames.net/new-ingress-glyphs/
        [8], 0, ["ANSWER", "QUESTION", "DISCOVER", "DIFFICULT", "TRUTH"],
        [8], 0, ["AVOID", "CHAOS", "AVOID", "SHAPERS", "LIE"],
        [8], 0, ["AVOID", "CHAOS", "REPAIR", "POTENTIAL", "WAR"],
        [8], 0, ["AVOID", "PERFECTION", "STAY", "HUMAN", "SELF"],
        [8], 20161029, ["BEGIN", "JOURNEY", "breathe", "XM", "EVOLUTION"], //https://fevgames.net/new-ingress-glyphs/
        [8], 0, ["breathe", "inside", "XM", "lose", "SELF"],
        [8], 0, ["CAPTURE", "PORTAL", "DEFEND", "PORTAL", "COURAGE"],
        [8], 20161029, ["CHANGE", "PERSPECTIVE", "BEGIN", "NEW", "STRUGGLE"], //https://fevgames.net/new-ingress-glyphs/
        [8], 0, ["CHAOS", "WAR", "CONFLICT", "DISCOVER", "PEACE"],
        [8], 0, ["civilization", "die", "new", "civilization", "BEGIN"],
        [8], 0, ["clear", "mind", "liberate", "barrier", "BODY"],
        [8], 20170106, ["CLEAR", "YOUR", "MIND", "CREATIVITY(1216274548597a9a)", "GROW"], //https://fevgames.net/happy-new-glyph-year/
        [8], 20170106, ["CLEAR", "YOUR", "MIND", "MORE", "BALANCE"], //https://fevgames.net/happy-new-glyph-year/
        [8], 0, ["clearall", "idea", "past", "present", "FUTURE"],
        [8], 20190727, ["contemplate", "field", "pursue", "human", "LEGACY"],
        [8], 0, ["CONTEMPLATE", "FUTURE", "NOT", "SHAPERS", "PATH"],
        [8], 0, ["contemplate", "restraint", "discover", "more", "COURAGE"],
        [8], 0, ["COURAGE", "ATTACK", "SHAPERS", "PORTAL", "TOGETHER"],
        [8], 20151120, ["CREATE", "NEW", "FUTURE", "SEE", "ALL"],
        [8], 20161029, ["CREATE", "NEW", "PORTAL", "POTENTIAL", "FUTURE"], //https://fevgames.net/new-ingress-glyphs/
        [8], 0, ["create", "pure", "future", "human", "civilization"],
        [8], 0, ["create", "pure", "future", "not", "WAR"],
        [8], 0, ["CREATE", "SEPARATE", "PATH", "END", "JOURNEY"],
        [8], 0, ["DEFEND", "DESTINY", "DEFEND", "HUMAN", "CIVILIZATION"],
        [8], 0, ["DEFEND", "HUMAN", "CIVILIZATION", "XM", "MESSAGE"],
        [8], 0, ["DEFEND", "HUMAN", "CIVILIZATION", "PORTAL", "DATA"],
        [8], 0, ["DEFEND", "HUMAN", "CIVILIZATION", "SHAPERS", "LIE"],
        [8], 0, ["DEFEND", "HUMAN", "CIVILIZATION", "SHAPERS", "PORTAL"],
        [8], 0, ["DESTROY", "CIVILIZATION", "END", "CONFLICT", "WAR"],
        [8], 0, ["destroy", "lie", "not", "gain", "SOUL"],
        [8], 0, ["DISTANCE", "SELF", "AVOID", "HUMAN", "LIE"],
        [8], 0, ["EASY", "PATH", "FUTURE", "FOLLOW", "SHAPERS"],
        [8], 0, ["END", "OLD", "CIVILIZATION", "CREATE", "NEW"],
        [8], 20170106, ["ESCAPE", "BEFORE", "DEATH", "END", "ALL"], //https://fevgames.net/happy-new-glyph-year/
        [8], 0, ["ESCAPE", "BODY", "JOURNEY", "OUTSIDE", "PRESENT"],
        [8], 0, ["ESCAPE", "BODY", "MIND", "SELF", "WANT"],
        [8], 20190727, ["field", "together", "improve", "human", "mind"],
        [8], 0, ["FORGET", "WAR", "SEE", "DISTANCE", "HARMONY"],
        [8], 0, ["FORGET", "PAST", "SEE", "PRESENT", "DANGER"],
        [8], 0, ["gain", "truth", "open", "human", "SOUL"],
        [8], 20151120, ["GROW", "UNBOUNDED", "CREATE", "NEW", "FUTURE"],
        [8], 20170106, ["HAVE", "HARMONY", "TOGETHER", "END", "MYSTERY"], //https://fevgames.net/happy-new-glyph-year/
        [8], 0, ["HARM", "PROGRESS", "PURSUE", "MORE", "WAR"],
        [8], 0, ["HELP", "ENLIGHTENMENT", "CAPTURE", "ALL", "PORTAL"],
        [8], 20170106, ["help", "gain", "knowledge", "inside", "resistance"], //https://fevgames.net/happy-new-glyph-year/
        [8], 0, ["HELP", "HUMAN", "CIVILIZATION", "PURSUE", "DESTINY"],
        [8], 20170106, ["HELP", "US", "PROGRESS", "STRONG", "VICTORY"], //https://fevgames.net/happy-new-glyph-year/
        [8], 20161029, ["HELP", "US", "SAVE", "US", "ALL"], //https://fevgames.net/new-ingress-glyphs/
        [8], 20170513, ["HELP", "US", "SAVE", "US", "DESTROY"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 0, ["help", "resistance", "capture", "all", "PORTAL"],
        [8], 0, ["HIDE", "STRUGGLE", "ADVANCE", "STRONG", "TOGETHER"],
        [8], 20170513, ["HIDE", "THEM", "inside", "COMPLEX", "INTELLIGENCE"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 20190727, ["human", "evolution", "create", "more", "field"],
        [8], 20161029, ["HUMAN", "LEGACY", "ABANDON", "OLD", "KNOWLEDGE"], //https://fevgames.net/new-ingress-glyphs/
        [8], 20161029, ["HUMAN", "LEGACY", "HAVE", "ABANDON", "now"], //https://fevgames.net/new-ingress-glyphs/
        [8], 0, ["human", "not", "together", "civilization", "deteriorate"],
        [8], 0, ["HUMAN", "SHAPERS", "TOGETHER", "CREATE", "DESTINY"],
        [8], 20161029, ["IMPERFECT", "MESSAGE", "BEGIN", "HUMAN", "CHAOS"], //https://fevgames.net/new-ingress-glyphs/
        [8], 0, ["IMPERFECT", "TRUTH", "ACCEPT", "COMPLEX", "ANSWER"],
        [8], 20190727, ["imperfect", "civilization", "lose", "key", "DATA"],
        [8], 0, ["IMPERFECT", "XM", "MESSAGE", "HUMAN", "CHAOS"],
        [8], 0, ["INSIDE", "MIND", "INSIDE", "SOUL", "HARMONY"],
        [8], 20170106, ["INTERRUPT", "ENLIGHTENED", "TECHNOLOGY", "CAPTURE", "VICTORY"], //https://fevgames.net/happy-new-glyph-year/
        [8], 20170106, ["interrupt", "message", "lose", "collective", "potential"], //https://fevgames.net/happy-new-glyph-year/
        [8], 0, ["liberate", "portal", "liberate", "human", "MIND"],
        [8], 0, ["liberate", "self", "liberate", "human", "CIVILIZATION"],
        [8], 20190727, ["link", "all", "portal", "create", "field"],
        [8], 20170513, ["LIVE AGAIN", "DIE", "REPEAT", "EVOLUTION", "FUTURE"], //https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 0, ["LOSE", "SHAPERS", "MESSAGE", "GAIN", "CHAOS"],
        [8], 0, ["MIND", "BODY", "SOUL", "PURE", "HUMAN"],
        [8], 20170513, ["MIND", "TECHNOLOGY", "CAPTURE", "HUMAN", "SOUL"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca (comment) https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 0, ["more", "data", "gain", "portal", "ADVANCE"],
        [8], 20170106, ["MYSTERY", "BEFORE", "PURE", "KNOWLEDGE", "AFTER"], //https://fevgames.net/happy-new-glyph-year/
        [8], 20170513, ["N'ZEER", "HIDE", "US", "EQUAL", "THEM"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 20190727, ["nourish", "portal", "avoid", "weak", "FIELD"],
        [8], 0, ["old", "nature", "less", "strong", "present"],
        [8], 0, ["past", "chaos", "create", "future", "HARMONY"],
        [8], 0, ["PAST", "PATH", "CREATE", "FUTURE", "JOURNEY"],
        [8], 0, ["PORTAL", "BARRIER", "DEFEND", "HUMAN", "SHAPERS"],
        [8], 0, ["portal", "create", "danger", "pursue", "SAFETY"],
        [8], 0, ["PORTAL", "IMPROVE", "HUMAN", "FUTURE", "CIVILIZATION"],
        [8], 0, ["PORTAL", "POTENTIAL", "HELP", "HUMAN", "FUTURE"],
        [8], 20170513, ["PRESENCE", "LIE", "EQUAL", "FUTURE", "CONSEQUENCE"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/RbZ93JYWPjH https://plus.google.com/u/1/116260179700704401059/posts/aDTm9pYj9ca https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 0, ["PRESENT", "CHAOS", "CREATE", "FUTURE", "CIVILIZATION"],
        [8], 20170513, ["PRESENT", "STRUGGLE", "WORTH", "STRONG", "VICTORY"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/RbZ93JYWPjH https://plus.google.com/u/1/116260179700704401059/posts/aDTm9pYj9ca https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 0, ["PURE", "HUMAN", "FAILURE", "NOW", "CHAOS"],
        [8], 0, ["PURSUE", "CONFLICT", "WAR", "ADVANCE", "CHAOS"],
        [8], 0, ["PURSUE", "PATH", "OUTSIDE", "SHAPERS", "LIE"],
        [8], 0, ["QUESTION", "LESS", "FORGET", "ALL", "LIE"],
        [8], 20170513, ["QUESTION", "POTENTIAL", "MYSTERY", "JOURNEY", "GROW"], //https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 0, ["REACT", "REBEL", "QUESTION", "SHAPERS", "LIE"],
        [8], 0, ["REBEL", "THOUGHT", "EVOLUTION", "DESTINY", "NOW"],
        [8], 0, ["REPAIR", "PRESENT", "REPAIR", "HUMAN", "SOUL"],
        [8], 0, ["REPAIR", "SOUL", "LESS", "HUMAN", "HARM"],
        [8], 0, ["save", "human", "civilization", "destroy", "PORTAL"],
        [8], 0, ["SEARCH", "DESTINY", "CREATE", "PURE", "FUTURE"],
        [8], 20161029, ["SEE", "TRUTH", "SEE", "FUTURE", "BEGIN"], //https://fevgames.net/new-ingress-glyphs/
        [8], 0, ["separate", "mind", "body", "discover", "ENLIGHTENMENT"],
        [8], 0, ["SEPARATE", "TRUTH", "LIE", "SHAPERS", "FUTURE"],
        [8], 0, ["SHAPERS", "LEAD", "HUMAN", "COMPLEX", "JOURNEY"],
        [8], 0, ["SHAPERS", "PORTAL", "DATA", "CREATE", "CHAOS"],
        [8], 0, ["SHAPERS", "PORTAL", "MESSAGE", "DESTROY", "CIVILIZATION"],
        [8], 0, ["shapers", "see", "complex", "path", "DESTINY"],
        [8], 0, ["SHAPERS", "WANT", "HUMAN", "MIND", "FUTURE"],
        [8], 20190727, ["shield", "mind", "clearall", "chaos", "xm"],
        [8], 0, ["SIMPLE", "OLD", "TRUTH", "JOURNEY", "INSIDE"],
        [8], 20190727, ["simple", "truth", "all", "human", "STAR"],
        [8], 0, ["simple", "truth", "forget", "easy", "SUCCESS"],
        [8], 0, ["simple", "truth", "shapers", "destroy", "civilization"],
        [8], 0, ["STAY", "STRONG", "TOGETHER", "DEFEND", "RESISTANCE"],
        [8], 0, ["STRONG", "TOGETHER", "WAR", "TOGETHER", "CHAOS"],
        [8], 0, ["STRONG", "TOGETHER", "WAR", "TOGETHER", "DESTINY"],
        [8], 20151120, ["TECHNOLOGY", "INTELLIGENCE", "SEE", "ALL", "UNBOUNDED"],
        [8], 20170513, ["TOGETHER", "PROGRESS", "RECHARGE", "present", "JOURNEY"], //https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment) https://plus.google.com/116260179700704401059/posts/aDTm9pYj9ca
        [8], 20190727, ["use", "key", "together", "create", "STAR"],
        [8], 0, ["use", "mind", "use", "courage", "CHANGE"],
        [8], 0, ["USE", "RESTRAINT", "FOLLOW", "EASY", "PATH"],
        [8], 20170513, ["WANT", "NEW", "DESTINATION", "IGNORE", "CONSEQUENCE"], // https://plus.google.com/108086824097369974579/posts/HWhW2461S2x (comment) https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)
        [8], 0, ["WANT", "TRUTH", "PURSUE", "DIFFICULT", "PATH"],
        [8], 0, ["weak", "human", "destiny", "destroy", "CIVILIZATION"],
        [8], 0, ["XM", "CREATE", "COMPLEX", "HUMAN", "DESTINY"],
        //[8], 0, ["XM", "create", "complex", "shapers", "DESTINY"],
        [8], 0, ["XM", "PATH", "FUTURE", "DESTINY", "HARMONY"],
        [8], 20170513, ["XM", "PORTAL", "SHARE", "YOUR", "CREATIVITY"], //https://plus.google.com/+NikitaKorolevSPbRus/posts/RbZ93JYWPjH https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo
        [8], 20170106, ["YOU", "HIDE", "CHAOS", "INSIDE", "BODY"], //https://fevgames.net/happy-new-glyph-year/
        [8], 20170513, ["your", "MESSAGE", "CLEAR", "USE", "CHAOS"], //https://plus.google.com/104078798708321963866/posts/eVHnzQUCsLo (comment)

        //
        // 2019-04-01 ~ 03?
        //
        /*
        [0], 20190401, ["TOASTY"],

        [5], 20190401, ["BEFORE", "TOAST", "CHAOS"],
        [5], 20190401, ["CREATE", "MORE", "TOAST"],
        [5], 20190401, ["DEFEND", "TOASTY", "PERFECTION"],
        [5], 20190401, ["HAVE", "MORE", "TOAST"],
        [5], 20190401, ["IGNORE", "IMPURE", "TOAST"],
        [5], 20190401, ["NEW", "TOASTY", "KNOWLEDGE"],
        [5], 20190401, ["OPENALL", "TOAST", "NOTIFICATION"],
        [5], 20190401, ["SEEK", "TOAST", "NOW"],
        [5], 20190401, ["SEEK", "TOASTY", "CIVILIZATION"],
        [5], 20190401, ["TOAST", "GROW", "CONFLICT"],
        [5], 20190401, ["TOAST", "NOURISH", "CIVILIZATION"],
        [5], 20190401, ["TOAST", "NOURISH", "HUMAN"],
        [5], 20190401, ["TOAST", "SUSTAIN", "HUMAN"],
        [5], 20190401, ["TOAST", "TOAST", "TOAST"],

        [7], 20190401, ["DEFEND", "HUMAN", "toasty", "FUTURE"],
        [7], 20190401, ["nourish", "human", "use", "toast"],
        [7], 20190401, ["SAVE", "ALL", "FUTURE", "TOAST"],
        [7], 20190401, ["TOAST", "CHANGE", "HUMAN", "PERSPECTIVE"],
        [7], 20190401, ["toast", "toast", "toast", "toast"],
        [7], 20190401, ["YOU", "SEE", "TOAST", "NOTIFICATION"],

        [8], 20190401, ["ADVANCE", "CIVILIZATION", "PURSUE", "TOASTY", "PATH"],
        [8], 20190401, ["ALL", "HUMAN", "AVOID", "IMPURE", "TOAST"],
        [8], 20190401, ["CAPTURE", "TOAST", "DEFEND", "TOAST", "COURAGE"],
        [8], 20190401, ["CHANGE", "HUMAN", "POTENTIAL", "USE", "TOAST"],
        [8], 20190401, ["HAVE", "TOAST", "BODY", "GROW", "UNBOUNDED"],
        [8], 20190401, ["HAVE", "TOAST", "NOW", "FUTURE", "CONSEQUENCE"],
        [8], 20190401, ["HAVE", "TOAST", "TOGETHER", "TOASTY", "FUTURE"],
        [8], 20190401, ["JOURNEY", "INSIDE", "TOAST", "NOURISH", "MIND"],
        [8], 20190401, ["SEE", "TOAST", "SEE", "FUTURE", "BEGIN"],
        [8], 20190401, ["SHAPERS", "GAIN", "KNOWLEDGE", "AFTER", "TOAST"],
        [8], 20190401, ["TOAST", "IMPROVE", "FUTURE", "HUMAN", "CIVILIZATION"],
        [8], 20190401, ["TOAST", "INSIDE", "MORE", "MIND", "CONFLICT"],
        [8], 20190401, ["TOAST", "NOURISH", "ALL", "HUMAN", "BODY"],
        [8], 20190401, ["toast", "toast", "toast", "toast", "toast"],
        [8], 20190401, ["USE", "TOAST", "GAIN", "MIND", "POTENTIAL"],
        */

        // 2019-05-31 ~ ?
        [8], 20190531, ["RESISTANCE", "GAIN", "ALL", "VICTORY", "OSIRIS"],

        // 2020-04-01 ~ 3?
        /*
        [0], 20200401, ["N"],
        [2], 20200401, ["AVOID", "CHAOS"], //new?
        [2], 20200401, ["DISCOVER", "PATH"], //new?
        [2], 20200401, ["N", "L"],
        [2], 20200401, ["STAY", "TOGETHER"], //new?
        [2], 20200401, ["USE", "KEY"], //new?
        [5], 20200401, ["BEGIN", "NEW", "JOURNEY"], //new?
        [5], 20200401, ["HELP", "CLEAR", "BARRIER"], //new?
        [5], 20200401, ["HELP", "CLEAR", "PATH"], //new? PATH=>BARRIER?
        [5], 20200401, ["REPAIR", "ALL", "LIVE AGAIN"], //new?
        [5], 20200401, ["SEE", "N", "L"],
        [7], 20200401, ["FOLLOW", "PATH", "SEE", "NATURE"],
        [7], 20200401, ["LOSE", "KEY", "CONTEMPLATE", "FUTURE"],
        [7], 20200401, ["MORE", "JOURNEY", "LESS", "DESTINATION"], //new?
        [7], 20200401, ["NOW", "YOU", "ALL", "STAR"],
        [8], 20200401, ["ADAPT", "CREATE", "NEW", "FUTURE", "TOGETHER"],
        [8], 20200401, ["SEE", "N", "L", "PURE", "PERFECTION"],
        [8], 20200401, ["TOAST", "NOURISH", "MIND", "BODY", "SOUL"],
        [8], 20200401, ["WANT", "1", "3", "3", "1"],
        [8], 20200401, ["YOU", "SEE", "N", "L", "AGAIN"]
        */
    ];

    var INFOS = [];
    var LEVEL_INFOS = [[],[],[],[],[],[],[],[],[]];
    var LEVEL_SEQUENCES = [[],[],[],[],[],[],[],[],[]];
    for(var si = 0; si < SEQUENCES.length; si += 3){
        // resolve aaa(bbb) notation
        var seqLevels = SEQUENCES[si+0];
        var seqDiscovered = SEQUENCES[si+1];
        var seqWordGlyphArray = SEQUENCES[si+2].map(
            function(str){
                var g = igt.glyphDic.getWordGlyphFromString(str);
                if(!g){
                    console.log("Failed to resolve glyph " + str);
                }
                return g;
            });

        var info = {
            levels: seqLevels,
            dateDiscovered: seqDiscovered,
            sequence: seqWordGlyphArray
        };
        INFOS.push(info);
        for(var li = 0; li < info.levels.length; ++li){
            LEVEL_INFOS[info.levels[li]].push(info);
            LEVEL_SEQUENCES[info.levels[li]].push(info.sequence);
        }
    }

    function getInfoRandom(lv){
        var seqs = LEVEL_INFOS[lv];
        return seqs && seqs.length > 0 ? seqs[Math.floor(Math.random() * seqs.length)] : null;
    }

    igt.sequenceDic = {
        getSequences: function(lv){ return LEVEL_SEQUENCES[lv];},
        getSequencesInfo: function(lv){ return typeof(lv) == "number" ? LEVEL_INFOS[lv] : INFOS;},
        getSequenceRandom: function(lv){
            var info = getInfoRandom(lv);
            return info ? info.sequence : null;
        },
        getSequenceInfoRandom: function(lv){
            return getInfoRandom(lv);
        }
    };
})();
