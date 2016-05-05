This is a set of SVG widgets for use in web pages.

I will add to them over time as I find that I need additional widgets. If you want a specific one, ask. I might make it.


Usage
==============
Look in the test directory to see how to use SVG if you do not already know.

One simple way is to treat them like images:
```
<img src='chevron-white.svg' />
<div class='box' style="background: rgb(100,100,100) url(chevron-white.svg); background-size: 4px 4px;" /><br/></div>
```

More Colors
==============
Also, you can make more colors and other things using the build script. 

Look in `build.js` and you will see a list of colors with names using in the output files and actual color 
values to use in the fiels that are created. I would not use spaces and generally be careful with the filename
parts as I hve not really tested that all that much.


More Templates
==============
If you want to make more shapes, just put a new ".hdb" file in the templates directory and run grunt.

