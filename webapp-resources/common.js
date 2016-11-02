(function(){
    window.addEventListener(
        "load",
        function(){
            var as=document.getElementsByTagName("a");
            for(var i = 0; i < as.length; ++i){
                (function(a){
                    var h=a.href;
                    a.href="#";
                    a.addEventListener("click", function(e){
                        window.location.href = h;
                        e.stopPropagation();
                        e.preventDefault();
                    }, false);
                })(as[i]);
            }
        }, false);
})();
