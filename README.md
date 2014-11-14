#data-bem jQuery Plugin

A jQuery Plugin that makes working with BEM data attributes (aka. [data-bem](https://github.com/futape/data-bem)) a joy.

Not tested yet. Feel free to download [jquery.data-bem.js](https://github.com/futape/jquery-data-bem/blob/master/jquery.data-bem.js) and test the plugin.

##API

###jQuery.bem()

`jquery $.bem( string blockOrElement [, string modifiers [, string alternateModifiers [, ...]]] )`

Searches for elements in the current document that match the given paramters.  
The arguments are passed through to the [`:bem()`](#bem) selector.
For more information, see the [`:bem()`](#bem) selector.

Escaping the modifiers, elements or blocks isn't necessary since the only character
that is not allowed inside if the parantheses following `:bem` is the closing
bracket (`)`).  
Another character with a special meaning inside the parantheses is the comma (`,`).
But unlike the closing bracket, it's up the author of a plugin how to handle
that character. Using that character as part of an identifier by escaping it using
a backslash (i.e. `"\\"`) is not supported yet but may be added in a future version.

###jQuery.bem.config()

`void $.bem.config( object options )`  
`mixed $.bem.config( string option )`

When an object is given, this function changes the settings
according to the options of the given object.  
If a string is given, this function returns the value of the
option specified by the string.

###.hasBem()

`hasBem( string blockOrElement [, string modifiers [, string alternateModifiers [, ...]]] )`

Checks whether an element matches the given parameters.  
A matching element, always contains `blockOrElement`, either as a
`data-*` attribute or as a class (if enabled).  
If `modifiers` or `alternateModifiers` are given, only elements that
contain at least one of the modifier sets (separated using whitespace characters)
match the parameters.

###.addBem()

`addBem( string blockOrElement [, string modifiers] )`

Adds the given parameters to the set of matched elements.  
If `modifiers` isn't set, only `blockOrElement` is added.
Otherwise, `blockOrElement` as well as the given modifiers
are added to the elements.  
If an element already contains a block or element identifier
or a modifier, either as `data-*` attribute or as a class
(if enabled), the block, element or modifier is not added
to that element.  
Multiple modifiers can be specified by separating them using
whitespace characters.

###.removeBem()

`removeBem( string blockOrElement [, string modifiers] )`

Removes the given block or element identifier and the given
modifiers from the set of matched elements.  
If `modifiers` isn't set, the whole `data-*` attribute
for the given block or element is removed and, if enabled,
all classes matching that identifier are removed.
Otherwise, the `data-*` and the `class` attribute (if enabled)
are altered to remove the specified modifiers only.  
Multiple modifiers can be specified by separating them using
whitespace characters.

###.toggleBem()

`toggleBem( string blockOrElement [, string modifiers] )`

This function combines [`addBem()`](#addbem) and [`removeBem()`](#removebem) and
adds or removes BEM attributes depending on their current
presence or absence.  
For more information see, [`addBem()`](#addbem) and [`removeBem()`](#removebem).

###:bem()

`:bem( string blockOrElement [, string modifiers [, string alternateModifiers [, ...]]] )`

This selector matches the given elements against the given parameters.  
The arguments are passed through to the [`hasBem()`](#hasbem) method.
For more information, see the that function.

##Author

[Lucas Krause](http://futape.de) ([@futape](https://twitter.com/futape))

##License

This plugin is available under the MIT license.
