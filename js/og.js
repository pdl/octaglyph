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
				o.status.buffer.pop;
				o.ogcore.updateBufferDisplay();
			},
                        setButtonText: function(button,text){
                        	var textHolder = og.find('.'+button+'>a');
                                textHolder.empty();
                                if (text) { // check for definedness
                                	textHolder.append(text);
                                }
                        },
                        showHints: function(stack){
                        	var layout = o.ogcore.findLayout(stack);
                                for (var i in o.const.classes) {
                                	var ogclass = o.const.classes[i];
                                        var text = layout ? layout[ogclass] : '';
                                	o.ogcore.setButtonText(ogclass, text);
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
				var loadedLayout = {};
				for (var i in layout) {
					loadedLayout[i] = layout[i];
					// But actually we need to recurse through and process it.
				}
				o.layout = layout;
			},
			loadLayoutKey: function(key){
				var loadedKey = {};
				if (typeof (key) == typeOf ('')) {
				}
				//o.ogcore.loadLayoutKey
			},
                        stackUndo: function(){
                        	o.status.stack.pop();
                                o.ogcore.showHints(o.status.stack);
                        },
			stackClear: function(){
				o.status.stack = [];
			}
        	},
                handlers: {

                },
                layout: {},
		status: {
                	stack:  [],
                	buffer: []
                }
        };

	o.ogcore.loadLayout(_ogDefaultLayout);

	og.find('li').each(function(){
        	var ogclass = $(this).attr('class');
                var btn = $(this).find('a');
                //btn.draggbble({revert:true,helper:'clone'});
				if (ogclass == 'mc'){
					btn.click(function(){
						o.ogcore.stackClear();
						o.ogcore.showHints(o.status.stack);
					});
				}
				else {
					btn.hover(function(){
						o.ogcore.stackTempAppend(ogclass);
					}, function(){
						o.ogcore.showHints(o.status.stack);
					}).click(function(){
						var newStack = o.ogcore.arrayShallowCopy(o.status.stack);
						newStack.push(ogclass);
						var action = o.ogcore.findLayout(newStack);
						console.log (action);
						if (typeof(action) == typeof 'string') {
							o.ogcore.bufferAppend(action);
							o.ogcore.stackClear();
						}
						else {
							o.ogcore.stackAppend(ogclass);
						}
					});
				}
        });
		
});
});

