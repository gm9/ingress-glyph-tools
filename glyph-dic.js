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
    var DIC =
            [
                "1634486a8a", ["Abandon"]
                ,"587a8a", ["Adapt"]
                ,"0949", ["Advance"]
                ,"49676a898a", ["Again", "Repeat"]
                ,"010512233445", ["All"]
                ,"67697a", ["Answer"]
                ,"06092649", ["War", "Attack"]
                ,"05061617", ["Avoid", "Struggle"]
                ,"0a277a", ["Barrier", "Obstacle"]
                ,"083738", ["Begin"]
                ,"3738676989", ["Being", "Human"]
                ,"696a9a", ["Body", "Shell"]
                ,"16596a9a", ["Breathe"]
                ,"1734487a8a", ["Capture"]
            ];

    var dic = new Dictionary();
    for(var ei = 0; ei < DIC.length; ei += 2){
        dic.add(Glyph.fromString(DIC[ei+0]), DIC[ei+1]);
    }
    igt.glyphtionary = dic;
})();
