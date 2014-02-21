
(function(){
    // import
    var igt = gm9.IngressGlyphTools;
    var Glyph = igt.Glyph;
    var Dictionary = igt.Dictionary;
    var DictionaryEntry = igt.DictionaryEntry;

    // ref: http://glyphtionary.com/
    var DIC =
            [
                [1,6,3,4,4,8,6,10,8,10], ["Abandon"]
                ,[5,8,7,10,8,10], ["Adapt"]
                ,[0,9,4,9], ["Advance"]
                ,[4,9,6,7,6,10,8,9,8,10], ["Again", "Repeat"]
                ,[0,1,0,5,1,2,2,3,3,4,4,5], ["All"]
                ,[6,7,6,9,7,10], ["Answer"]
                ,[0,6,0,9,2,6,4,9], ["War", "Attack"]
                ,[0,5,0,6,1,6,1,7], ["Avoid", "Struggle"]
                ,[0,10,2,7,7,10], ["Barrier", "Obstacle"]
                ,[0,8,3,7,3,8], ["Begin"]
                ,[3,7,3,8,6,7,6,9,8,9], ["Being", "Human"]
                ,[6,9,6,10,9,10], ["Body", "Shell"]
                ,[1,6,5,9,6,10,9,10], ["Breathe"]
                ,[1,7,3,4,4,8,7,10,8,10], ["Capture"]
            ];

    var dic = new Dictionary();
    for(var ei = 0; ei < DIC.length; ei += 2){
        dic.add(Glyph.fromArray(DIC[ei+0]), DIC[ei+1]);
    }
    igt.glyphtionary = dic;
})();
