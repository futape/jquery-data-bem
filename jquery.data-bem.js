/*! http://mths.be/cssescape v0.2.1 by @mathias | MIT license */
;(function(root) {

	if (!root.CSS) {
		root.CSS = {};
	}

	var CSS = root.CSS;

	var InvalidCharacterError = function(message) {
		this.message = message;
	};
	InvalidCharacterError.prototype = new Error;
	InvalidCharacterError.prototype.name = 'InvalidCharacterError';

	if (!CSS.escape) {
		// http://dev.w3.org/csswg/cssom/#serialize-an-identifier
		CSS.escape = function(value) {
			var string = String(value);
			var length = string.length;
			var index = -1;
			var codeUnit;
			var result = '';
			var firstCodeUnit = string.charCodeAt(0);
			while (++index < length) {
				codeUnit = string.charCodeAt(index);
				// Note: there’s no need to special-case astral symbols, surrogate
				// pairs, or lone surrogates.

				// If the character is NULL (U+0000), then throw an
				// `InvalidCharacterError` exception and terminate these steps.
				if (codeUnit == 0x0000) {
					throw new InvalidCharacterError(
						'Invalid character: the input contains U+0000.'
					);
				}

				if (
					// If the character is in the range [\1-\1F] (U+0001 to U+001F) or is
					// U+007F, […]
					(codeUnit >= 0x0001 && codeUnit <= 0x001F) || codeUnit == 0x007F ||
					// If the character is the first character and is in the range [0-9]
					// (U+0030 to U+0039), […]
					(index == 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
					// If the character is the second character and is in the range [0-9]
					// (U+0030 to U+0039) and the first character is a `-` (U+002D), […]
					(
						index == 1 &&
						codeUnit >= 0x0030 && codeUnit <= 0x0039 &&
						firstCodeUnit == 0x002D
					)
				) {
					// http://dev.w3.org/csswg/cssom/#escape-a-character-as-code-point
					result += '\\' + codeUnit.toString(16) + ' ';
					continue;
				}

				// If the character is not handled by one of the above rules and is
				// greater than or equal to U+0080, is `-` (U+002D) or `_` (U+005F), or
				// is in one of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to
				// U+005A), or [a-z] (U+0061 to U+007A), […]
				if (
					codeUnit >= 0x0080 ||
					codeUnit == 0x002D ||
					codeUnit == 0x005F ||
					codeUnit >= 0x0030 && codeUnit <= 0x0039 ||
					codeUnit >= 0x0041 && codeUnit <= 0x005A ||
					codeUnit >= 0x0061 && codeUnit <= 0x007A
				) {
					// the character itself
					result += string.charAt(index);
					continue;
				}

				// Otherwise, the escaped character.
				// http://dev.w3.org/csswg/cssom/#escape-a-character
				result += '\\' + string.charAt(index);

			}
			return result;
		};
	}

}(typeof global != 'undefined' ? global : this));

/*! https://github.com/futape/jquery-data-bem v0.0.1 by Lucas Krause (@futape) | MIT license */
(function($){
    var settings={
            /**
             * If set to `true`, also classes are used when searching for
             * BEM elements or altering their BEM attributes.
             */
            "useClass":true,
            
            /**
             * The delimiter that separates the modifier from the element/block.
             *
             *     block__element--modifier
             *                   __
             *        delimiter -´
             */
            "modDelim":"--",
            
            /**
             * A term that prefixes the element or block identifier in a
             * BEM `data-*` attribute name.
             * `bem-` for example would result in `data-bem-element`.
             */
            "attrPrefix":"bem-"
        },
        jq_helper=$('<div />'),
        
        // string fn_escRegex( string aString [, string regExDelimiter] )
        fn_escRegex=function(str_a, str_delim){
            return str_a.replace(new RegExp("[\.\\+*?\[^\]$(){}=!<>|:"+(str_delim!=null ? fn_escRegex(str_delim) : "")+"-]", "g"), "\\$&");
        },
        
        // string fn_escSelector( string selector )
        fn_escSelector=function(str_selector){
            return CSS.escape(str_selector);
        },
        
        // string fn_getAttr( string blockOrElement )
        fn_getAttr=function(str_el){
            return "data-"+settings.attrPrefix+str_el;
        },
        
        // string fn_prepareMod( string modifiers )
        fn_prepareMod=function(str_mod){
            str_mod=str_mod!=null ? $.trim(str_mod).replace(/\s+/g, " ") : str_mod;
            str_mod=str_mod==="" ? null : str_mod;
            
            return str_mod;
        },
        
        // string fn_getModPrefix( string blockOrElement )
        fn_getModPrefix=function(str_el){
            return str_el+settings.modDelim;
        };
    
    /**
     * jquery $.bem( string blockOrElement [, string modifiers [, string alternateModifiers [, ...]]] )
     *
     * Searches for elements in the current document that match the given paramters.
     * The arguments are passed through to the `:bem()` selector.
     * For more information, see the `:bem()` selector.
     */
    $.bem=function(str_el, str_mod){
        var arr_mods=$.makeArray(arguments).slice(1);
        
        return $(":bem("+fn_escSelector(str_el)+(arr_mods.length>0 ? ","+$.map(arr_mods, fn_escSelector).join(",") : "")+")");
    };
    
    /**
     * void $.bem.config( object options )
     * mixed $.bem.config( string option )
     *
     * When an object is given, this function changes the settings
     * according to the options of the given object.
     * If a string is given, this function returns the value of the
     * option specified by the string.
     */
    $.bem.config=function(options){
        if(typeof options!="object"){
            var mix_setting=settings[options];
            
            if(typeof mix_setting=="object"){
                mix_setting=$.extend(true, {}, mix_setting);
            }
            
            return mix_setting;
        }
            
        $.extend(settings, $.extend(true, {}, options));
    };
    
    /**
     * hasBem( string blockOrElement [, string modifiers [, string alternateModifiers [, ...]]] )
     *
     * Checks whether an element matches the given parameters.
     * A matching element, always contains `blockOrElement`, either as a
     * `data-*` attribute or as a class (if enabled).
     * If `modifiers` or `alternateModifiers` are given, only elements that
     * contain at least one of the modifier sets (separated using whitespace characters)
     * match the parameters.
     */
    $.fn.hasBem=function(str_el, str_mod){
        str_mod=fn_prepareMod(str_mod);
        
        var that=this,
            str_attr=fn_getAttr(str_el);
        
        if(this.attr(str_attr)!=null || settings.useClass && this.hasClass(str_el)){
            if(str_mod==null){
                return true;
            }
        }else{
            return false;
        }
        
        // str_mod!=null
        var str_val=$(this).attr(str_attr),
            str_modPrefix=fn_getModPrefix(str_el),
            q_a=false;
        
        jq_helper.removeAttr("class");
        if(str_val!=null){
            jq_helper.attr("class", str_val);
        }
        
        $.each($.makeArray(arguments).slice(1), function(i, val){
            val=fn_prepareMod(val);
            
            if(val!=null){
                if(jq_helper.hasClass(val) || settings.useClass && that.hasClass(str_modPrefix+val.replace(/ /g, "$&"+str_modPrefix))){
                    q_a=true;
                    
                    return false;
                }
            }
        });
        
        return q_a;
    };
    
    /**
     * addBem( string blockOrElement [, string modifiers] )
     *
     * Adds the given parameters to the set of matched elements.
     * If `modifiers` isn't set, only `blockOrElement` is added.
     * Otherwise, `blockOrElement` as well as the given modifiers
     * are added to the elements.
     * If an element already contains a block or element identifier
     * or a modifier, either as `data-*` attribute or as a class
     * (if enabled), the block, element or modifier is not added
     * to that element.
     * Multiple modifiers can be specified by separating them using
     * whitespace characters.
     */
    $.fn.addBem=function(str_el, str_mod){
        str_mod=fn_prepareMod(str_mod);
        
        var arr_mod=str_mod!=null ? str_mod.split(" ") : null,
            str_attr=fn_getAttr(str_el);
         
        return this.each(function(){
            var that=this;
            
            if(!$(this).hasBem(str_el)){
                $(this).attr(str_attr, "");
            }
            
            if(arr_mod!=null){
                var str_val=$(this).attr(str_attr);
                
                jq_helper.removeAttr("class");
                if(str_val!=null){
                    jq_helper.attr("class", str_val);
                }
                
                $.each(arr_mod, function(i, val){
                    if(!$(that).hasBem(str_el, val)){
                        jq_helper.addClass(val);
                    }
                });
                
                var str_newVal=jq_helper.attr("class");
                
                if(str_newVal!=null){
                    $(this).attr(str_attr, str_newVal);
                }
            }
        });
    };
    
    /**
     * removeBem( string blockOrElement [, string modifiers] )
     *
     * Removes the given block or element identifier and the given
     * modifiers from the set of matched elements.
     * If `modifiers` isn't set, the whole `data-*` attribute
     * for the given block or element is removed and, if enabled,
     * all classes matching that identifier are removed.
     * Otherwise, the `data-*` and the `class` attribute (if enabled)
     * are altered to remove the specified modifiers only.
     * Multiple modifiers can be specified by separating them using
     * whitespace characters.
     */
    $.fn.removeBem=function(str_el, str_mod){
        str_mod=fn_prepareMod(str_mod);
        
        var str_attr=fn_getAttr(str_el),
            str_modPrefix=fn_getModPrefix(str_el);
        
        if(str_mod==null){
            this.removeAttr(str_attr);
            
            this.each(function(){
                var str_class=$(this).attr("class");
                
                if(str_class!=null){
                    $(this).attr("class", str_class.replace(new RegExp("(?:^|\s)"+fn_escRegex(str_modPrefix)+"\S*", "g"), "")).removeClass(str_el);
                }
            });
        }else{
            this.each(function(){
                var str_val=$(this).attr(str_attr);
                
                if(str_val!=null){
                    this.attr(str_attr, jq_helper.attr("class", str_val).removeClass(str_mod).attr("class"));
                }
                
                if(settings.useClass){
                    $(this).removeClass(str_modPrefix+str_mod.replace(/ /g, "$&"+str_modPrefix));
                }
            });
        }
        
        return this;
    };
    
    /**
     * toggleBem( string blockOrElement [, string modifiers] )
     *
     * This function combines `addBem()` and `removeBem()` and
     * adds or removes BEM attributes depending on their current
     * presence or absence.
     * For more information see, `addBem()` and `removeBem()`.
     */
    $.fn.toggleBem=function(str_el, str_mod){
        str_mod=fn_prepareMod(str_mod);
        
        var that=this,
            arr_mod=str_mod.split(" ");
        
        return this.each(function(){
            $.each(arr_mod==null ? [null] : arr_mod, function(i, val){
                if(that.hasBem(str_el, val)){
                    that.removeBem(str_el, val);
                }else{
                    that.addBem(str_el, val);
                }
            });
        });
    };
    
    /**
     * :bem( string blockOrElement [, string modifiers [, string alternateModifiers [, ...]]] )
     *
     * This selector matches the given elements against the given parameters.
     * The arguments are passed through to the `hasBem()` method.
     * For more information, see the that function.
     */
    // seen in jquery source as `function(elem, i, match, array)`,
    // but most often only as `function(elem)`.
    $.expr[":"].bem=function(el_a, i, arr_match){
        /*
        arr_match: result of String.prototype.match()
        [
            ":bem( 1, 2, 3 )",
            "bem",
            "",
            " 1, 2, 3 "
        ]
        */
        
        var arr_args=$.map(arr_match[3].split(","), $.trim),
            str_el=arr_args.shift(),
            arr_mods=arr_args;
        
        return $.fn.hasBem.apply($(el_a), [str_el, arr_mods]);
    };
})(jQuery);
