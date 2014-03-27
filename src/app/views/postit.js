/*globals define:false*/
define('app/views/postit',[
    'jquery-ui',
    'backbone'
], 

function($, Backbone){
    var PostitView = Backbone.View.extend({
        tagName: "div",

        events: {
            "mouseover": "showToolbar",
            "mouseout": "hideToolbar",
            "click .postit_close_image": "deletePostit",
            "mouseover .postit_color_image": "showColors",
            "keyup .postit_input": "updateText"
        },

        initialize: function(attrs){
            this.boardConnection = attrs.boardConnection;
            this.zoom = attrs.zoom;
            this.model.bind('change', this.render, this);
            this.model.bind('destroy', this.remove, this);
            this.model.bind('remove', this.remove, this);
            this.model.bind('focus', this.focus, this);
            this.model.bind('change:zoom', this.render, this);
            var _this = this;
            this.$el.attr("id", "postit"+this.model.id)
                    .addClass("postit")
                    .css("position", "absolute")
                    .css("top", (this.model.get("y")*this.zoom)+"px")
                    .css("left", (this.model.get("x")*this.zoom)+"px")
                    .css("width", (this.model.get("width")*this.zoom)+"px")
                    .css("height", (this.model.get("height")*this.zoom)+"px")
                    .css("padding", "22px 2px 2px 2px")
                    .css("background-color", this.model.get("back_color"))
                    .draggable({
                        stack: ".postit",
                        cursor: "move",
                        containment: "parent",
                        drag: function(){
                            var position = $(this).position();
                            _this.boardConnection.movePostit(_this.model.get("id"), position.left, position.top);
                        },
                        stop: function(){
                            var position = $(this).position();
                            _this.model.save({x: position.left, y: position.top});
                        }
                    })
                    .resizable({
                        resize: function(){
                            var width = $(this).width();
                            var height = $(this).height();
                            _this.boardConnection.resizePostit(_this.model.get("id"), width, height);
                        },
                        stop: function(event, ui){
                            var width = ui.size.width;
                            var height = ui.size.height;
                            _this.model.save({width: width, height: height});
                        }
                    });

            this.createPostitCloseElement().appendTo(this.$el);
            this.createPostitColorTool().appendTo(this.$el);
            this.createPostitTextArea().appendTo(this.$el);
            this.createChangePostitColorTool().appendTo(this.$el);

            this.input = this.$('.postit_input');
        },

        focus: function(){
            this.input.focus();
        },

        render: function(){
            this.$el
                .css("top", (this.model.get("y")*this.model.zoom)+"px")
                .css("left", (this.model.get("x")*this.model.zoom)+"px")
                .css("width", (this.model.get("width")*this.model.zoom)+"px")
                .css("height", (this.model.get("height")*this.model.zoom)+"px")
                .css("background-color", this.model.get("back_color"));
            this.input.css('background-color', this.model.get("back_color"))
                .css("font-size", (12*this.model.zoom)+"px");
            this.input.val(this.model.get("text"));
            return this;
        },

        createPostitCloseElement: function(){
            return $("<img/>")
                    .addClass("postit_close_image")
                    .attr("src", "/static/images/close.png");
        },

        deletePostit: function(){
            this.model.destroy();
            this.boardConnection.deletePostit(this.model.get("id"));
        },

        createPostitTextArea: function(){
            var postitTextArea =  $("<textarea/>").addClass("postit_input")
                    .css('background-color', this.model.get("back_color"));
            postitTextArea.val(this.model.get("text"));
            return postitTextArea;
        },

        updateText: function(){
            var text = this.input.val();
            this.model.save({text: text},{'silent':true});
            this.boardConnection.updatePostitText(this.model.get("id"), text);
        },

        createPostitColorTool: function(){
            var image = $("<img/>")
                    .addClass("postit_color_image")
                    .attr("src", "/static/images/colors.png");
            return image;
        },

        showColors: function(){
            this.$el.find(".postit_color_tool").show();
        },

        createChangePostitColorTool: function() {
            var postitChangeColorTool = $("<div />")
                    .addClass("postit_color_tool");
            postitChangeColorTool.mouseleave(function() {
                postitChangeColorTool.fadeOut('fast');
            });
            this.createColorSelectionElement("#FFFF33", "left").appendTo(postitChangeColorTool);
            this.createColorSelectionElement("#FF69B4", "right").appendTo(postitChangeColorTool);
            this.createColorSelectionElement("#ADFF2F", "left").appendTo(postitChangeColorTool);
            this.createColorSelectionElement("gold", "right").appendTo(postitChangeColorTool);
            return postitChangeColorTool.hide();
        },

        createColorSelectionElement: function(color, position){
            var _this = this;
            return $("<div class='postit_color'/>")
                    .css('background-color', color)
                    .css('float', position)
                    .click(function() {
                        _this.model.save({"back_color": color});
                        _this.boardConnection.changePostitColor(_this.model.get("id"), color, color);
                    });
        },

        showToolbar: function(){
            this.$el.find(".postit_close_image").show();//showCLoseImage
            this.$el.find(".postit_color_image").show();//showColorImage
            this.$el.css('padding-top','2px');
            this.$el.css('padding-bottom','20px');
        },

        hideToolbar: function(){
            this.$el.find(".postit_close_image").hide();//hideCloseImage
            this.$el.find(".postit_color_image").hide();//hideColorImage
            this.$el.css('padding-top','22px');
            this.$el.css('padding-bottom','2px');
        }
    });
    return PostitView;
});
