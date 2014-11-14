// The octaglyph object must know how to
// Handle text

// Read the Data
// On click...
// ... do the action associated with the node
// On hover...
// ... show the results of dragging to subsequent nodes
// On hold...
// ... wait, then move to an alternative set of options
// On dragstart
// ... show the results of dragging to subsequent nodes
// On dragremain...
// ... add the action to the current buffer

'use strict';
$(function() {
$('.octaglyph').each(function(){
	var todo = function(){console.log('todo')};
	var og = $(this);
	var o;
	o = {
		const: {
			classes: ['tl','tc','tr','ml','mc','mr','bl','bc','br']
		},
		ogcore: {
			arrayShallowCopy: function(original){
				var copy = [];
				for (var i in original) {
					copy.push(original[i]);
				}
				return copy;
			},
			bufferAppend: function(addition){
				o.status.buffer.push(addition);
				o.ogcore.updateBufferDisplay();
			},
			updateBufferDisplay: function(){
				og.find('.buffer').empty().append(o.status.buffer.join(''));
				},
			bufferComplete: todo,
			bufferUndo: function(){
				o.status.buffer.pop();
				o.ogcore.updateBufferDisplay();
			},
			setButtonText: function(button,text){
				var textHolder = og.find('.'+button+'>a');
				textHolder.empty();
				if (text) { // check for definedness
					textHolder.append(text);
				}
			},
			setButtonType: function(button,type){
				var textHolder = og.find('.'+button+'>a');
				var types = ['append', 'bufferUndo', 'unterminated'];
				for (var i in types){
					textHolder.removeClass( 'og-a-' + types[i] );
				}
				if (type) { // check for definedness
					textHolder.addClass('og-a-'+type);
				}
			},
			showHints: function(stack){
				var layout = o.ogcore.findLayout(stack);
				if (!layout) { return; }
				for (var i in o.const.classes) {
					var ogclass = o.const.classes[i];
					var text = layout[ogclass] ? layout[ogclass].label : '';
					var type = layout[ogclass] ? 
						layout[ogclass].actione ? 
							layout[ogclass].action.verb : 'unterminated' : '';
					o.ogcore.setButtonText(ogclass, text);
					o.ogcore.setButtonType(ogclass, type);
				}
			},
			performAction: function(action) {
				if (action.verb == 'append') {
					o.ogcore.bufferAppend(action.content);
					o.ogcore.stackClear();
					o.ogcore.showHints(o.status.stack);
				}
				else if (action.verb == 'bufferUndo'){
					o.ogcore.bufferUndo();
					o.ogcore.stackClear();
					o.ogcore.showHints(o.status.stack);
				}
			},
			stackComplete: function () {
				var layout = o.ogcore.findLayout(o.status.stack);
				console.log (layout);
				if (layout.action) {
					o.ogcore.performAction(layout.action);
				}
			},
			stackTempAppend: function(ogclass){
				var clonedStack = o.ogcore.arrayShallowCopy(o.status.stack);
				clonedStack.push(ogclass);
				var hintedLayout = o.ogcore.findLayout(clonedStack);
				if ( hintedLayout && hintedLayout.length ) {
					o.ogcore.showHints(clonedStack);
				}
			},
			stackAppend: function(ogclass){
				o.status.stack.push(ogclass);
				o.ogcore.showHints(o.status.stack);
				console.log('Stack is: ',o.status.stack.join(', '));
			},
			findLayout: function(stack){
				var current = [o.layout]; // to avoid modifying layout
				for (var i in stack){
					if (!current[0]){
						return {};
					}
					current = [ current[ 0 ][ stack[i] ] ];
				}
				return current[0];
			},
			loadLayout: function(layout){
				var upgrader;
				upgrader = function(original){
					var newLayout = {
					};
					if (typeof original == typeof 'string'){
						if (original == '<'){
							return {
								label: 'Bksp',
								action: {
									verb: 'bufferUndo'
								}
							}
						}
						return {
							label: original,
							action: {
								verb: 'append',
								content: original
							}
						}
					}
					else if (original && typeof (original) == typeof ({})) {
						if (typeof (original.action) == typeof ('')){
							var appendable = original.action
							original.action = {
								verb: 'append',
								content: appendable
							};
							newLayout.label = appendable;
						}
						for (var i in o.const.classes) {
							var ogclass = o.const.classes[i]
							newLayout[ogclass] = upgrader(original[ogclass]);
						}
						return newLayout;
					}
					else {
						return {};
					}
				};
				var loadedLayout = {};
				o.layout = upgrader(layout);
			},
			loadLayoutKey: function(key) {
				var loadedKey = {};
				if (typeof (key) == typeOf ('')) {
				}
				//o.ogcore.loadLayoutKey
			},
			stackUndo: function() {
				o.status.stack.pop();
					o.ogcore.showHints(o.status.stack);
			},
			stackClear: function(){
				o.status.stack = [];
			}
		},
		handlers: {},
		layout: {},
		status: {
			stack:  [],
			buffer: [],
			swiping: 0, //indicate if we are in the middle of a touch action
			swipeStartKey: null,
			intentionKey: null,
			timeoutID: null
		},
		ogui: {
			registerIntention: function(key){
				// todo: sensory feedback
				o.status.intentionKey = key;
				if (o.status.timeoutID) {
					window.clearTimeout(o.status.timeoutID);
				}
				o.status.timeoutID = window.setTimeout( 20, function(){ o.ogui.pointer.hold(key) } );
			},
			clearIntention: function() {
				if (o.timeoutID) {
					window.clearTimeout(o.status.timeoutID);
				}
				o.timeoutID = null;
				o.status.swipeStartKey = null;
				o.status.intentionKey = null;
			},
			confirmIntention: function (key) {
				if (key == 'mc') {
					// do something special
				}
				else {
					o.ogcore.stackAppend(key);
				}
			},
			swipeStart: function (key) {
				o.status.swipestart = key;
			},
			swipeEnd: function (key) {
				o.ogui.confirmIntention(key);
				o.ogcore.stackComplete();
			},
			pointer: {
				up: function(key) {
					// stop the counter and add intention key to the stack. 
					// if swipe is happening, perform the default action. 
					// Else if tap is happening, refresh the layout
					o.ogui.confirmIntention(key);
					if (o.status.swiping) {
						o.ogcore.stackComplete();
					}
					else {
						o.ogcore.stackComplete();
					}
					o.status.swipeStartKey = null;
					o.status.swiping    = 0;
				},
				down: function(key) {
					// start swipe, regiser current key, register swipestart key
					if (o.status.swiping) {
						console.log('oops');
						// this shouldn't happen!
					}
					o.status.swipeStartKey = key;
					o.ogui.registerIntention(key);
				},
				hold: function (key) {
					// sensory feedback?
					o.ogcore.stackAppend(key);
					o.ogui.registerIntention(key);
				},
				enter: function (key) {
					// if swipe is happening, reset and start counter and register intention key
					if (o.status.swiping) {
						o.ogui.registerIntention(key);
					}
				},
				leave: function(key) {
					if (o.status.swipeStartKey && o.status.swipeStartKey == key) {
						o.status.swiping = 1;
						o.ogui.confirmIntention(key);
					} // else?
					o.ogui.clearIntention();
				}
			},
		}
	};

	o.ogcore.loadLayout(_ogDefaultLayout);
	
	og.find('li').each(function(){
		var ogclass = $(this).attr('class');
		var btn = $(this).find('a');
		if (ogclass == 'mc'){
			btn.click(function(){
				o.ogcore.stackClear();
				o.ogcore.showHints(o.status.stack);
			});
		}
		else {
			btn
				.mouseup(    function(event){ o.ogui.pointer.up    (ogclass); event.preventDefault(); } )
				.mousedown(  function(event){ o.ogui.pointer.down  (ogclass); event.preventDefault(); } )
				.mouseenter( function(event){ o.ogui.pointer.enter (ogclass); event.preventDefault(); } )
				.mouseleave( function(event){ o.ogui.pointer.leave (ogclass); event.preventDefault(); } )
			;
		}
	});
	
});
});

