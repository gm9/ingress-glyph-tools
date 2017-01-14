* Ingress Glyph Tools
a JavaScript Library and Tools for Ingress Glyph.

Examples: [[http://gm9.github.io/ingress-glyph-tools]]

* License
This software is released under the [[http://opensource.org/licenses/mit-license.php][MIT license]], see LICENSE.txt.
* Usage
** Input Pad

#+BEGIN_SRC html
<!DOCTYPE html>
<html>
  <head>
    <script type="text/javascript" src="glyph-tools.js" charset="utf-8"></script>
  </head>
  <body>
    <h1>Input Pad</h1>
    <div id="input"></div>

    <script>
      var gm9igt = gm9.IngressGlyphTools;

      // Create Input Pad
      var options = {
        size: 200 //(default 300px)
      };
      var pad = gm9igt.createInputPad(options);
      document.getElementById("input").appendChild(pad);

      // Show Input Result(Glyph Code)
      pad.addEventListener("glyphstrokeend", onGlyphStrokeEnd, false);
      function onGlyphStrokeEnd(){
        var glyph = pad.getGlyph();
        alert(glyph.toString());
        pad.clearGlyph();
      }
    </script>
  </body>
</html>
#+END_SRC

** Glyph Dictionary

Require glyph-dic.js

#+BEGIN_SRC html
<script type="text/javascript" src="glyph-dic.js" charset="utf-8"></script>
#+END_SRC

Glyph to glyph names:

#+BEGIN_SRC js
var gm9igt = gm9.IngressGlyphTools;
var simpleGlyph = gm9igt.Glyph.fromString("78"); // node #7 to #8
var words = gm9igt.glyphDic.getWordsFromGlyph(simpleGlyph);
alert(words[0]); //=Simple
#+END_SRC

Glyph name to glyphs:

#+BEGIN_SRC js
var gm9igt = gm9.IngressGlyphTools;
var glyphs = gm9igt.glyphDic.getGlyphsFromWord("simple");
alert(glyphs[0].toString()); //=78
#+END_SRC

Enumerate all glyphs:

#+BEGIN_SRC js
var gm9igt = gm9.IngressGlyphTools;
var glyphs = gm9igt.glyphDic.getAllGlyphs();
#+END_SRC

** Create a Glyph Image

#+BEGIN_SRC js
var gm9igt = gm9.IngressGlyphTools;
var glyph = gm9igt.glyphDic.getGlyphsFromWord("idea")[0];
var GLYPH_SIZE = 100;
var GLYPH_STYLE = {
  //see: function completeGlyphStyle() in glyph-tools.js
};

// as HTML5 Canvas
var canvas = gm9igt.createGlyphImage(glyph, GLYPH_SIZE, GLYPH_STYLE);
document.body.appendChild(canvas);

// as SVG
var svg = gm9igt.createGlyphSVG(glyph, GLYPH_SIZE, GLYPH_STYLE);
document.body.appendChild(svg);
#+END_SRC
