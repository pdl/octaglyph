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

