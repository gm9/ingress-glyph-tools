/*
 * Copyright (c) 2015 gm9
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
//require glyph-game.js

(function(){
    var igt = gm9.IngressGlyphTools;
    var WORST_TIME = 99999;

    // Export:
    igt.glyphGameRecord = {
        // Functions
        load: load,
        save: save,
        updateCurrentTime: updateCurrentTime,
        addGlyphGameResult: addGlyphGameResult,
        addHackResult: addHackResult,
        getSequenceRecord: getSequenceRecord,
        getGlyphRecord: getGlyphRecord,
        exportRecord: exportRecord,
        importRecord: importRecord,

        // Classes
        SequenceRecord: SequenceRecord,
        GlyphRecord: GlyphRecord,

        // Constants
        WORST_TIME: WORST_TIME
    };



    function addGlyphGameResult(level, glyphCodes, result)
    {
        addHackResult(level, glyphCodes,
                      result.correctArray, result.time, result.glyphInputTimes);
    }

    function addHackResult(level, glyphCodes, arrCorrect, time, timeGlyphs)
    {
        load(); //一度もloadせずにaddすると過去の記録が消えるので。
        addSequenceRecord(level, glyphCodes, arrCorrect, time);

        for(var gi = 0; gi < arrCorrect.length; ++gi){
            addGlyphRecord(glyphCodes[gi], arrCorrect[gi], timeGlyphs[gi]);
        }
    }

    /**
     * グリフシーケンス毎の成績を表すクラス。
     */
    function SequenceRecord()
    {
        this.numHacks = 0; //ハック回数
        this.numCorrectGlyphs = 0; //正解した総グリフ数
        this.numFullyCorrectSequences = 0; //全問正解したシーケンスの総数
        this.timeFullyCorrectSequences = 0; //全問正解した場合のハック時間の合計
        this.bestTime = WORST_TIME; //全問正解した場合のハック時間の最短値
    }
    SequenceRecord.prototype = {
        getAverageCorrectGlyphs: function(){
            return this.numCorrectGlyphs / this.numHacks;
        },
        getFullyCorrectRate: function(){
            return this.numFullyCorrectSequences / this.numHacks;
        },
        getAverageFullyCorrectHackTime: function(){
            return this.numFullyCorrectSequences > 0 ? this.timeFullyCorrectSequences / this.numFullyCorrectSequences : WORST_TIME;
        },
        getAverageFullyCorrectSpeedBonus: function(timeLimitPerSequence){
            return typeof(timeLimitPerSequence) == "number" && timeLimitPerSequence > 0 && this.numFullyCorrectSequences > 0 ? this.timeFullyCorrectSequences / (timeLimitPerSequence * this.numFullyCorrectSequences) : 0;
        },
        getAverageSpeedBonus: function(timeLimitPerSequence){
            return typeof(timeLimitPerSequence) == "number" && timeLimitPerSequence > 0 && this.numHacks > 0 ? this.timeFullyCorrectSequences / (timeLimitPerSequence * this.numHacks) : 0;
        },
        clone: function(){
            var rec = new SequenceRecord();
            rec.numHacks = this.numHacks;
            rec.numCorrectGlyphs = this.numCorrectGlyphs;
            rec.numFullyCorrectSequences = this.numFullyCorrectSequences;
            rec.timeFullyCorrectSequences = this.timeFullyCorrectSequences;
            rec.bestTime = this.bestTime;
            return rec;
        },
        addRecord: function(rec){
            if(rec){
                this.numHacks += rec.numHacks;
                this.numCorrectGlyphs += rec.numCorrectGlyphs;
                this.numFullyCorrectSequences += rec.numFullyCorrectSequences;
                this.timeFullyCorrectSequences += rec.timeFullyCorrectSequences;
                this.bestTime = Math.min(this.bestTime, rec.bestTime);
            }
            return this;
        },
        toString: function(){
            return this.numHacks + " " +
                this.numCorrectGlyphs + " " +
                this.numFullyCorrectSequences + " " +
                this.timeFullyCorrectSequences + " " +
                0 + " " +//(numSpeedBonus obsolete)
                this.bestTime;
        }
    };
    SequenceRecord.fromHackResult = function(numCorrectGlyphs, time, level){
        var rec = new SequenceRecord();
        rec.numHacks = 1;
        rec.numCorrectGlyphs += numCorrectGlyphs;
        var fullyCorrect = (numCorrectGlyphs == igt.glyphGame.getLevelGlyphCount(level));
        if(fullyCorrect){
            ++rec.numFullyCorrectSequences;
            rec.timeFullyCorrectSequences += time;
            rec.bestTime = time;
        }
        return rec;
    };
    SequenceRecord.fromString = function(str){
        var rec = new SequenceRecord();
        var arr = str.split(" ");
        rec.numHacks = parseInt(arr[0]);
        rec.numCorrectGlyphs = parseInt(arr[1]);
        rec.numFullyCorrectSequences = parseInt(arr[2]);
        rec.timeFullyCorrectSequences = parseInt(arr[3]);
        // skip arr[4]; (numSpeedBonus obsolete)
        rec.bestTime = parseInt(arr[5]) || WORST_TIME;

        if(rec.numHacks >= 0 &&
           rec.numCorrectGlyphs >= 0 &&
           rec.numFullyCorrectSequences >= 0 && rec.numFullyCorrectSequences <= rec.numHacks &&
           rec.timeFullyCorrectSequences >= 0 &&
           rec.bestTime >= 0 && rec.bestTime <= WORST_TIME){
            return rec;
        }
        else{
            return null;
        }
    };

    /**
     * グリフ毎の成績を表すクラス。
     */
    function GlyphRecord()
    {
        this.numHacks = 0;
        this.numCorrectHacks = 0;
        this.timeCorrectHacks = 0;
        this.bestTime = WORST_TIME;
    }
    GlyphRecord.prototype = {
        getAverageCorrect: function(){
            return this.numCorrectHacks / this.numHacks;
        },
        getAverageCorrectHackTime: function(){
            return this.numCorrectHacks > 0 ? this.timeCorrectHacks / this.numCorrectHacks : WORST_TIME;
        },
        clone: function(){
            var rec = new GlyphRecord();
            rec.numHacks = this.numHacks;
            rec.numCorrectHacks = this.numCorrectHacks;
            rec.timeCorrectHacks = this.timeCorrectHacks;
            rec.bestTime = this.bestTime;
            return rec;
        },
        addRecord: function(rec){
            if(rec){
                this.numHacks += rec.numHacks;
                this.numCorrectHacks += rec.numCorrectHacks;
                this.timeCorrectHacks += rec.timeCorrectHacks;
                this.bestTime = Math.min(this.bestTime, rec.bestTime);
            }
            return this;
        },
        toString: function(){
            return this.numHacks + " "+
                this.numCorrectHacks + " "+
                this.timeCorrectHacks + " "+
                this.bestTime;
        }
    };
    GlyphRecord.fromHackResult = function(correct, time){
        var rec = new GlyphRecord();
        ++rec.numHacks;
        if(correct){
            ++rec.numCorrectHacks;
            rec.timeCorrectHacks += time;
            rec.bestTime = time;
        }
        return rec;
    };
    GlyphRecord.fromString = function(str){
        var rec = new GlyphRecord();

        var arr = str.split(" ");
        rec.numHacks = parseInt(arr[0]);
        rec.numCorrectHacks = parseInt(arr[1]);
        rec.timeCorrectHacks = parseInt(arr[2]);
        rec.bestTime = parseInt(arr[3]) || WORST_TIME;
        if(rec.numHacks >= 0 &&
           rec.numCorrectHacks >= 0 && rec.numCorrectHacks <= rec.numHacks &&
           rec.timeCorrectHacks >= 0 &&
           rec.bestTime >= 0 && rec.bestTime <= WORST_TIME){
            return rec;
        }
        else{
            return null;
        }
    };


    /**
     * 期間毎の成績を記録するクラス。
     *
     * 成績管理方針:
     * - 一日毎の成績を最大30日分保持する。30日を過ぎたものは捨てていく。
     * - 通算の成績を保持する。
     * - All, Month(今日を含めて過去30日分), Week(今日を含めて過去7日分), Today(今日0時から現在まで)の成績を提供する。
     */
    function RecordHistory(argAll, argDaily)
    {
        var MAX_DAYS = 30;
        var daily = argDaily || [];
        var all = argAll || null;

        this.addRecord = addRecord;
        function addRecord(record)
        {
            if(daily.length == 0){
                daily.push(record.clone());
            }
            else if(!daily[0]){
                daily[0] = record.clone();
            }
            else{
                daily[0].addRecord(record);
            }
            if(!all){
                all = record.clone();
            }
            else{
                all.addRecord(record);
            }
        }
        this.rotateDays = rotateDays;
        function rotateDays(n)
        {
            if(n >= 0 && n < MAX_DAYS){
                for(var i = 0; i < n; ++i){
                    daily.splice(0, 0, null);
                }
                if(daily.length > MAX_DAYS){
                    daily.splice(MAX_DAYS, daily.length - MAX_DAYS);
                }
            }
            else if(n >= MAX_DAYS){
                daily.splice(0, daily.length);
            }
        }
        this.getAll = getAll;
        function getAll(){
            return all ? all.clone() : null;
        }
        this.getToday = getToday;
        function getToday(){
            return daily[0] ? daily[0].clone() : null;
        }
        this.getWeek = getWeek;
        function getWeek(){
            return getLastDays(7);
        }
        this.getMonth = getMonth;
        function getMonth(){
            return getLastDays(30);
        }
        this.getLastDays = getLastDays;
        function getLastDays(n){
            var rec = null;
            for(var i = 0; i < n; ++i){
                if(daily[i]){
                    if(!rec){
                        rec = daily[i].clone();
                    }
                    else{
                        rec.addRecord(daily[i]);
                    }
                }
            }
            return rec;
        }
        this.toString = toString;
        function toString(){
            var str = (all ? all.toString() : "null");
            for(var i = 0; i < daily.length; ++i){
                str += "," + (daily[i] ? daily[i].toString() : "null");
            }
            return str;
        }
    }
    RecordHistory.fromString = function(str, RecordClass){
        var arr = str.split(",");
        var all = RecordClass.fromString(arr[0]);
        var daily = [];
        for(var i = 1; i < arr.length; ++i){
            daily.push(RecordClass.fromString(arr[i]));
        }
        return new RecordHistory(all, daily);
    };

    function IndexedRecordHistory(argDic)
    {
        var dic = argDic || {};

        this.get = get;
        function get(key){
            return dic[key];
        }
        this.add = add;
        function add(key, rec){
            var hist = dic[key] || (dic[key] = new RecordHistory());
            hist.addRecord(rec);
        }
        this.rotateDays = rotateDays;
        function rotateDays(n){
            for(var key in dic){
                var hist = dic[key];
                hist.rotateDays(n);
            }
        }
        this.toString = toString;
        function toString(){
            var str = "";
            for(var key in dic){
                var hist = dic[key];

                if(str != ""){
                    str += ":";
                }
                str += key + ":" + hist.toString();
            }
            return str;
        }
    }
    IndexedRecordHistory.fromString = function(str, RecordClass){
        var arr = str.split(":");
        if(arr.length % 2 != 0){
            return null;
        }
        var dic = {};
        for(var i = 0; i < arr.length; i += 2){
            dic[arr[i]] = RecordHistory.fromString(arr[i+1], RecordClass);
        }
        return new IndexedRecordHistory(dic);
    };


    // Sequence Record

    var dicSequences = new IndexedRecordHistory();

    function toSeqKey(level, glyphCodes)
    {
        return level + "/" + glyphCodes.join("/");
    }

    function addSequenceRecord(level, glyphCodes, arrCorrect, time)
    {
        var key = toSeqKey(level, glyphCodes);
        var numCorrectGlyphs = arrCorrect.filter(function(c){return c;}).length;
        dicSequences.add(key, SequenceRecord.fromHackResult(numCorrectGlyphs, time, level));
    }
    function getSequenceRecord(level, glyphCodes)
    {
        return dicSequences.get(toSeqKey(level, glyphCodes));
    }

    // Glyph Record

    var dicGlyphs = new IndexedRecordHistory();

    function addGlyphRecord(glyphCode, correct, time)
    {
        dicGlyphs.add(glyphCode.toLowerCase(), GlyphRecord.fromHackResult(correct, time));
    }
    function getGlyphRecord(glyphCode)
    {
        return dicGlyphs.get(glyphCode.toLowerCase());
    }

    // Time Management

    var lastDate = null;

    function updateCurrentTime()
    {
        var t = new Date();
        var currDate = (new Date(t.getFullYear(), t.getMonth(), t.getDate())).getTime();

        var deltaDays = lastDate ? Math.max(0, Math.floor((currDate - lastDate) / (24*60*60*1000))) : 0;
        if(deltaDays > 0){
            dicSequences.rotateDays(deltaDays);
            dicGlyphs.rotateDays(deltaDays);
        }
        lastDate = currDate;
        return deltaDays;
    }


    // Serialize

    function toString()
    {
        return lastDate + "'" +
            dicSequences.toString() + "'" +
            dicGlyphs.toString();
    }
    function loadFromString(str)
    {
        var arr = str.split("'");
        var ld = parseInt(arr[0]) || null;
        var seq = (arr[0] && IndexedRecordHistory.fromString(arr[1], SequenceRecord)) || null;
        var glp = (arr[1] && IndexedRecordHistory.fromString(arr[2], GlyphRecord)) || null;

        if(seq && glp){
            lastDate = ld;
            dicSequences = seq;
            dicGlyphs = glp;
            return true;
        }
        else{
            return false;
        }
    }

    var STORAGE_KEY = "IngressGlyphTools.glyphGameRecord";
    var loaded = false;
    function load()
    {
        if(loaded){
            return;
        }
        if(!window.localStorage){
            return;
        }
        loaded = true;
        if(localStorage.getItem(STORAGE_KEY)){
            if(!loadFromString(localStorage.getItem(STORAGE_KEY))){
                console.log("Error: Failed to load.");
            }
        }
        updateCurrentTime();
    }

    function save()
    {
        if(!window.localStorage){
            return;
        }
        localStorage.setItem(STORAGE_KEY, toString());
    }

    function exportRecord(){
        return toString();
    }
    function importRecord(str){
        if(loadFromString(str)){
            loaded = true;
            save();
            updateCurrentTime();
            return true;
        }
        else{
            return false;
        }
    }
})();
