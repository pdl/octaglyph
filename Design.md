structure layout 
	has [tmb][lcr] is key

structure key
	has label
		unless defined is terminate.content or ''
	has terminate? is action
	has continue is layout
	has hold is array of layouts

structure action
	has action
	has content
	has args



- tc:
  - label: 'x'
  - terminate: 
    - action: append
    - content: 'x'
  - continue: 
    - tl: 

All of the following do the same thing:
'a'
['a','A']
{action: 'append', content: 'a'}

o.plugins.capsMode - enable a shift and a caps lock. 
o.status.plugins.capsMode.caps

Get all biglyphs and triglyphs. Get all biglyphs and tryglyphs that are word-initial. Normalise and weight.

Then determine placement of glyphs when only 7 possibilities. Only use a-z. 

For punctuation, closing punctuation gets

. , space ; ? 

. gets ) .



Actions
 append
 stackUndo &stackUndo
 wordComplete =thinking
 stackReplace <ê


Vowels
0 caps
1 acute
2 grave
3 circumflex
4 tilde
5 diaeresis
6 currency

===

Populating the rings

Given a corpus of words,

And given fixed position for 26 letters,

Find the most frequent word form at any given 'release point', make that the action. It may be a complete word or not, e.g. 

fri     => friday
frien   => friend
friend  => friend
friendl => friendly

In addition find the most likely next letter at any given point, from the ones available.

Remember that we don't really handle double letters or collisions so we have to deal with that by holding, which is annoying.

tol     => tool
told    => told
tol_    => toll

If we have spare spaces, we can offer them up for disambiguation. So maybe

tol^tr  => toll

It is worth looking at a corpus of words to determine letters in words which are replaceable, e.g. fi[rl]e and avoid giving these letters the same position so as to make disambiguation easier. Generally this will be good anyway as we put vowels one one ring, stops on another, etc, but there may be some more optimisation we can do. 


Given that the compiled size is about 8mb and probably bigger in memory we probably need to be doing something clever with ajax rather than loading the whole thing sin at once and then enriching it. .


Consider: 
 mc = click to accept or hover for stackUndo


Two modes of operation, tap and swipe. Ideally can switch between them

mousedown > start swipe, regiser current key, register swipestart key
mouseenter > if swipe is happening, reset and start counter and register intention key
when counter hits target (ideally also if mouse is still in same place), add intention key to the stack. In the case of MC, remove the top from the stack and refresh the layout
 - then restart the counter and register the intention key again
mouseleave > if this is the swipestart, add to the stack and clear the swipestart. if counter is running, stop and reset, clear intention key, 
mouseup > stop the counter and add intention key to the stack. if swipe is happening, perform the default action. Else if tap is happening, refresh the layout
window loses focus - intention key and timer are cleared

refactor out registerKey, stackPop

move this stuff (anything which references actual HTML elements or interaction events) into ogui not ogcore. Ogcore must not call ogui

NB: for mc, 
- the performed action when hovering is different depending on whether it was registered by timer or mouseup. In mouseup it ends the swipe but not the stack, in hild it does stackundo.
- the performed action when not 


