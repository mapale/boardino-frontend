/* globals define:false, jQuery:false */
define('app/toolbar',[
    'jquery'
],

function($) {

    var Toolbar = function Toolbar(){
        this.tools = [];
    };

    Toolbar.prototype.addTool = function(tool){
        this.tools.push(tool);
    };

    (function($){
        $.fn.tool = function(toolbar, options){

            var settings = $.extend({
                'element': this,
                'exclusive': true,
                'keep_selected': true
            }, options);

            this.click(function(){
                if(settings.exclusive){
                    $.each(toolbar.tools, function(i, otherTool){
                        otherTool.element.removeClass('tool_enabled');
                    });
                }
                if(settings.keep_selected){
                    $(this).addClass('tool_enabled');
                }
                if(settings.confirmable){
                    $("#dialog").dialog({
                                            buttons : {
                                                "Confirm" : function() {
                                                    $(this).dialog("close");
                                                    settings.action();
                                                },
                                                "Cancel" : function() {
                                                    $(this).dialog("close");
                                                }
                                            }
                                        });
                } else {
                    settings.action();
                }
            });

            return settings;
        };
    })(jQuery);

    return Toolbar;
});
