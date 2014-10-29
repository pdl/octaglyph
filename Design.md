structure layout 
	has [tmb][lcr] is key

structure key
	has label
		unless defined is terminate.content or ''
	has terminate?
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
o.plugins.status.capsMode

Get all biglyphs and triglyphs. Get all biglyphs and tryglyphs that are word-initial. Normalise and weight.

Then determine placement of glyphs when only 7 possibilities. Only use a-z. 

For punctuation, closing punctuation gets

. , space ; ? 

. gets ) .



Actions
 append
 stackUndo &stackUndo
 wordComplete =thinking
 stacReplace <ê


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

