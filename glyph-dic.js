/*
 * Copyright (c) 2014 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

(function(){
    // import
    var igt = gm9.IngressGlyphTools;
    var Glyph = igt.Glyph;
    var Dictionary = igt.Dictionary;
    var DictionaryEntry = igt.DictionaryEntry;

    // ref: http://glyphtionary.com/
    // ref: https://plus.google.com/u/1/+Ingress/posts/6Ey9jT3mhsD
    // ref: https://plus.google.com/u/1/+NianticProject/posts/LSnjYR3YKCW
    // ref: https://plus.google.com/+NianticProject/posts/1b1aEfxWW4w
    var DIC =
            [
                "1634486a8a", ["Abandon"]
                ,"587a8a", ["Adapt"]
                ,"0949", ["Advance"]
                ,"1216276a7a", ["After"]
                ,"49676a898a", ["Again", "Repeat"]
                ,"010512233445", ["All"]
                ,"67697a", ["Answer"]
                ,"06092649", ["Attack", "War"]
                ,"05061617", ["Avoid"] //"Struggle"
                ,"0a277a", ["Barrier", "Obstacle"]
                ,"4548598a9a", ["Before"]
                ,"083738", ["Begin"]
                ,"3738676989", ["Being", "Human"]
                ,"696a9a", ["Body", "Shell"]
                ,"16596a9a", ["Breathe","Live"]
                ,"1734487a8a", ["Capture"]
                ,"373a8a", ["Change","Modify"]
                ,"01051638456a8a", ["Chaos","Disorder"]
                ,"0a3a", ["Clear"]
                ,"01050a1223343a45", ["Close All", "Clear All", "Clearall"]
                ,"698a9a", ["Complex"]
                ,"2649677889", ["Conflict"]
                ,"27597889", ["Consequence"]
                ,"011223386a899a", ["Contemplate"]
                ,"497889", ["Courage"]
                ,"16486a8a", ["Create","Creation"]
                ,"1216274548597a9a", ["Creativity","Idea","Thought"]//, "Mind"
                ,"393a9a", ["Creativity"]
                ,"093a9a", ["Danger"]
                ,"06386a8a", ["Data","Signal"]//"Message"
                ,"17373858", ["Defend"]
                ,"38676a789a", ["Destiny"]
                ,"1223", ["Destination"]
                ,"27597a9a", ["Destroy","Destruction"]
                ,"488a9a", ["Deteriorate","Erode"]
                ,"386a8a", ["Easy"]
                ,"27487a8a", ["Die","Death"]
                ,"16677a8a", ["Difficult"]
                ,"122334", ["Discover"]
                ,"0545", ["Distance","Outside"]
                ,"010a17373a", ["End","Close"]
                ,"01091223696a9a", ["Enlightened", "Enlightenment"]
                ,"676989", ["Equal"]
                ,"01166989", ["Escape"]
                ,"0a899a", ["Evolution","Progress","Success"]
                ,"0a676a", ["Failure"]
                ,"176769", ["Fear"]
                ,"061216", ["Follow"]
                ,"48", ["Forget"]
                ,"162767", ["Future"] //"Forward-Time"
                ,"58", ["Gain"]
                ,"1659677889", ["Government","City","Civilization","Structure"]
                ,"4989", ["Grow"]
                ,"0609276a7a9a", ["Harm"]
                ,"060937386a7a8a9a", ["Harmony","Peace"]
                ,"387a8a", ["Have"]
                ,"59788a9a", ["Help"]
                ,"16176978", ["Hide"]
                ,"363969", ["I","Me"] //"Self"
                ,"27", ["Ignore"]
                ,"6a898a9a", ["Imperfect"]
                ,"686a898a9a", ["Imperfect"] //NOTE: Scanner bug?
                ,"166a7a", ["Improve"]
                ,"3a898a9a", ["Impure"]
                ,"16486a899a", ["Intelligence"]
                ,"0a3a4548598a9a", ["Interrupt"]
                ,"163445596a9a", ["Journey"]
                ,"36396a9a", ["Knowledge"]
                ,"05384548", ["Lead"]
                ,"0105162748596789", ["Legacy"]
                ,"6a9a", ["Less"]
                ,"0116496a9a", ["Liberate"]
                ,"676a7a899a", ["Lie"]
                ,"16496a898a", ["Live Again", "Reincarnate"]
                ,"17", ["Lose"]
                ,"17497a9a", ["Message"]
                ,"383a899a", ["Mind"] //"Idea","Thought"
                ,"7a8a", ["More"]
                ,"0609596989", ["Mystery"]
                ,"06090a3a6a9a", ["N'zeer"]
                ,"2748676989", ["Nature"]
                ,"2767", ["New"]
                ,"6769", ["Not","Inside"] //"No", "Absent"
                ,"343a488a", ["Nourish"]
                ,"5989", ["Old"]
                ,"373878", ["Open","Accept"]
                ,"010512233437384578", ["Open All", "Openall"]
                ,"1216274548596978", ["Portal"] //"Opening","Doorway"
                ,"485989", ["Past"]
                ,"0a488a", ["Path"]
                ,"0a232734487a8a", ["Perfection","Balance"]
                ,"060927486a7a8a9a", ["Perspective"]
                ,"0a12277a", ["Potential"]
                ,"3738676a78899a", ["Presence"]
                ,"677889", ["Present","Now"]
                ,"0a676a7a", ["Pure"] //"Purity"
                ,"060959", ["Pursue"]
                ,"0a48899a", ["Chase"] //"Pursue"
                ,"066989", ["Question"]
                ,"27697a9a", ["React"]
                ,"1216586a8a", ["Rebel"]
                ,"050a599a", ["Recharge","Repair"]
                ,"2667", ["Reduce"] //"Contract"
                ,"090a383a69", ["Resist","Resistance","Struggle"]
                ,"2327597a9a", ["Restraint"]
                ,"0626", ["Retreat"]
                ,"264969", ["Safety"]
                ,"177a8a", ["Save"] //"Rescue"
                ,"09", ["See"]
                ,"696a7889", ["Seek","Search"]
                ,"2334", ["Self","Individual"]
                ,"2759676a898a", ["Separate"]
                ,"060927486789", ["Shapers","Collective"] //"Shaper"
                //"060927373848676989", ["Shaper/Collective + Being/Human"]
                ,"27344878", ["Share"]
                ,"78", ["Simple"]
                ,"373a676a", ["Soul"] //"Spirit","Life Force"
                ,"274878", ["Stability", "Stay"]
                ,"67697889", ["Strong"]
                ,"0a1216273a6a7a", ["Sustain"]
                ,"01050a12162327343a456a7a", ["Sustain All"]
                ,"16276a7a898a9a", ["Technology"]
                ,"0878", ["Them"]
                ,"48696a8a9a", ["Together"]
                ,"676a7a898a9a", ["Truth"]
                ,"010517233445696a7889", ["Unbounded"]
                ,"177a", ["Use"]
                ,"06093639", ["Victory"]
                ,"373848", ["Want"]
                ,"3669", ["We","Us"]
                ,"596769", ["Weak"]
                ,"17587a8a", ["Worth"]
                ,"67697a898a", ["XM"] //(Exotic Matter)
                ,"070878", ["You","Your","Other"]
                //,"0109122334696a9a", ["[unknown]"]
                //,"0609232734486789", ["[unknown]"]
                //,"01061226", ["[unknown]"]
                //,"090a373a69", ["[unknown]"]
            ];

    var dicGlyphToWord = new Dictionary();
    for(var ei = 0; ei < DIC.length; ei += 2){
        dicGlyphToWord.add(Glyph.fromString(DIC[ei+0]), DIC[ei+1]);
    }
    var dicWordToGlyph = dicGlyphToWord.createIndex();

    function getWordsFromGlyph(glyph)
    {
        return dicGlyphToWord.get(glyph); //return array
    }
    function getGlyphsFromWord(word)
    {
        return dicWordToGlyph[word.toLowerCase()];
    }

    // ex:
    // "idea" => {word:"idea", Glyph.fromString("1216274548597a9a")}
    // "creativity(1216274548597a9a)" => {word:"creativity", glyph:Glyph.fromString("1216274548597a9a")}
    // "creativity(idea)" => {word:"creativity", glyph:Glyph.fromString("1216274548597a9a")}
    function getWordGlyphFromString(str)
    {
        var arrayWordCode = /^(.+)\((([0-9a][0-9a])*)\)$/i.exec(str); // ex:creativity(1216274548597a9a)
        if(arrayWordCode){
            return {word:arrayWordCode[1], glyph:Glyph.fromString(arrayWordCode[2])};
        }
        else{
            var arrayWordWord = /^(.+)\(([^)]+)\)$/.exec(str); // ex:creativity(idea)
            var wDisplay = arrayWordWord ? arrayWordWord[1] : str;
            var wSearch = arrayWordWord ? arrayWordWord[2] : str;
            var gs = getGlyphsFromWord(wSearch);
            return gs && gs.length > 0 ? {word:wDisplay, glyph:gs[0]} : null;
        }
    }
    function toStringFromWordGlyph(wg)
    {
        return wg.word + "(" + wg.glyph.toString() + ")";
    }

    function getAllWords()
    {
        return Object.keys(dicWordToGlyph);
    }
    function getAllGlyphs()
    {
        var glyphs = [];
        for(var gi = 0; gi < dicGlyphToWord.getEntryCount(); ++gi){
            glyphs.push(dicGlyphToWord.getEntryAt(gi).keyGlyph);
        }
        return glyphs;
    }

    function getWordGlyphRandom()
    {
        do{
            var entryIndex = Math.floor(Math.random() * dicGlyphToWord.getEntryCount());
            var entry = dicGlyphToWord.getEntryAt(entryIndex);
        }
        while(!(entry && entry.keyGlyph && entry.value && entry.value.length > 0));
        return {
            glyph: entry.keyGlyph,
            word: entry.value[Math.floor(Math.random() * entry.value.length)]
        };
    }


    // Exports
    igt.glyphDic = {
        getWordsFromGlyph: getWordsFromGlyph,
        getGlyphsFromWord: getGlyphsFromWord,
        getWordGlyphFromString: getWordGlyphFromString,
        toStringFromWordGlyph: toStringFromWordGlyph,
        getAllWords: getAllWords,
        getAllGlyphs: getAllGlyphs,
        getWordGlyphRandom: getWordGlyphRandom
    };
    // obsolete
    igt.glyphtionary = dicGlyphToWord;
    igt.glyphtionaryIndex = dicWordToGlyph;

})();
