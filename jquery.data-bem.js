(function($){
    var settings={
            "useClass":true,
            "modDelim":"--",
            "attrPrefix":"bem-" // => data-bem-module
        },
        jq_helper=$('<div />'),
        fn_escRegex=function(str_a, str_delim){
            return str_a.replace(new RegExp("[\.\\+*?\[^\]$(){}=!<>|:"+(str_delim!=null ? str_delim : "")+"-]", "g"), "\\$&");
        },
        fn_escSelector=function(str_selector){
            return str_selector.replace(new RegExp("["+fn_escapeRegex("!\"#$%&'()*+,./:;<=>?@[\\]^`{|}~")+"]", "g"), "\\$&");
        },
        fn_getAttr=function(str_el){
            return "data-"+settings.attrPrefix+str_el;
        },
        fn_prepareMod=function(str_mod){
            str_mod=str_mod!=null ? $.trim(str_mod).replace(/\s+/g, " ") : str_mod;
            str_mod=str_mod==="" ? null : str_mod;
            
            return str_mod;
        },
        fn_getModPrefix=function(str_el){
            return str_el+settings.modDelim;
        };
    
    $.bem=function(str_el, str_mod){
        var arr_mods=$.makeArray(arguments).slice(1);
        
        return $(":bem("+fn_escSelector(str_el)+(arr_mods.length>0 ? ","+$.map(arr_mods, fn_escSelector).join(",") : "")+")");
    };
    
    // $.bem.config( object options )
    // $.bem.config( string option )
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
    
    // :bem( blockOrElement [, modifier [, ...]] )
    // seen in jquery source as `function(elem, i, match, array)`,
    // but most often only as `function(elem)`.
    $.expr[":"].bem=function(el_a, i, arr_match){
        /*
        arr_match: result of String.prototype.match
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
