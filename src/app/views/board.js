/*globals define:false*/
define('views/board',[
    'jquery',
    'backbone',
    'src/app/views/postit',
    'src/app/views/canvas',
    'src/app/models/postit',
    'src/app/collections/postits'
], function($, Backbone, PostitView, BoardCanvas, Postit, PostitList){
    var BoardView = Backbone.View.extend({
        el: $("#board"),

        events: {
            "mousedown #board-canvas": "mousedown",
            "mousemove": "mouseMove",
            "mouseup": "mouseUp"
        },

        initialize: function(attrs){
            this.boardConnection = attrs.boardConnection;

            this.tool = "postits";
            this.canvas = new BoardCanvas({boardConnection: this.boardConnection});
            this.canvas.render();

            this.postits = new PostitList();
            this.postits.bind('add', this.addOne, this);
            this.postits.bind('reset', this.addAll, this);
            this.postits.bind('all', this.render, this);
            this.postits.fetch();
        },

        mousedown: function(e){
            if (this.tool === "drawing") {
                this.canvas.startLine(e.pageX, e.pageY, "free");
            }
            if (this.tool === "rectDrawing") {
                this.canvas.startLine(e.pageX, e.pageY, "rect");
            }
            if (this.tool === "eraser") {
                this.canvas.tryToErase(e.pageX, e.pageY);
            }
            if (this.tool === "postits") {
                var postit = new Postit({"x":e.pageX, "y":e.pageY, "width":120, "height":120, "text":""});
                this.postits.add(postit);//TODO: check what is this doing
                var _this = this;
                postit.save(null, {
                    success: function(model, response){
                        _this.boardConnection.newPostit(model.get("id"), postit.get("x"), postit.get("y"), postit.get("width"), postit.get("height"), postit.get("text"));
                    }
                });
                postit.trigger('focus');
            }
            return false;
        },

        mouseMove: function(e){
            if(this.tool === "drawing" || this.tool === "rectDrawing"){
                this.canvas.mouseMove(e);
            }
        },

        mouseUp: function(e){
            if(this.tool === "drawing" || this.tool === "rectDrawing"){
                this.canvas.finishLine(e);
            }
        },

        showPostit: function(id){
            var postit = new Postit({id:id});
            postit.fetch();
            this.postits.add(postit);
        },

        addAll: function() {
            this.postits.each(this.addOne);
        },

        addOne: function(postit){
            var view = new PostitView({model: postit, boardConnection: this.boardConnection});
            $("#board").append(view.render().el);
        },

        movePostit: function(id, newX, newY){
            this.postits.get(id).set({x: newX, y: newY});
        },

        resizePostit: function(id, width, height){
            this.postits.get(id).set({width: width, height: height});
        },

        changePostitColor: function(id, color){
            this.postits.get(id).set("back_color", color);
        },

        deletePostit: function(id){
            this.postits.remove(id);
        },

        updatePostitText: function(id, text){
            this.postits.get(id).set("text",text);
        },

        startPath: function(id, x, y, color){
            this.canvas.startPath(id, x, y, color);
        },

        addPathPoint: function(id, x, y){
            this.canvas.addPathPoint(id, x, y);
        },

        finishPath: function(id){
            this.canvas.finishPath(id);
        },

        selectPostitTool: function(){
            this.tool = "postits";
        },

        selectPencilTool: function(color){
            this.tool = "drawing";
            this.canvas.setStrokeColor(color);
        },

        selectRectLineTool: function(){
            this.tool = "rectDrawing";
            this.canvas.setStrokeColor("black");
        },

        selectEraserTool: function(){
            this.tool = "eraser";
        },

        clearLines: function(){
            this.canvas.clearLines();
        },

        deleteLine: function(id){
            this.canvas.deleteLine(id);
        }
    });

    return BoardView;
});
