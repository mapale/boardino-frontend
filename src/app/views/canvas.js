/*globals define:false*/
define('app/views/canvas',[
    'jquery',
    'backbone',
    'underscore',
    'paper',
    'app/models/line',
    'app/collections/lines'
], 

function($, Backbone, _, paper, Line, LineList){
    var BoardCanvas = Backbone.View.extend({
        el: $("#board-canvas"),

        lines : new LineList(),

        initialize: function(attrs){
            this.boardConnection = attrs.boardConnection;
            this.zoom = attrs.zoom;
            this.strokeColor = "black";
            var _this = this;
            var canvas = this.el;
            paper.setup(canvas);
            paper.view.viewSize = new paper.Size(3000*this.zoom, 1500*this.zoom);
            paper.view.draw();
            this.lines.fetch({success: function(lineList){
                _.each(lineList.models, function(line){
                    if(line.get("path")){
                        line.path = _this.drawLinePath(line);
                        line.path.model = line;
                    }
                    line.bind('change:zoom', _this.render, _this);
                    paper.view.draw();
                });
            }});
        },

        render: function(){
            paper.view.draw();
        },

        startLine: function(x, y, type){
          var line = new Line();
          line.set("color_l",this.strokeColor);
          line.type = type;

          this.shadowPath = new paper.Path();
          this.shadowPath.strokeColor = this.strokeColor;
          this.shadowPath.dashArray = [10, 12];

          var path = new paper.Path();
          path.model = line;

          path.strokeColor = this.strokeColor;
          var start = new paper.Point(x, y);
          path.add(start);
          this.shadowPath.add(start);

          var _this = this;

          line.save({"stroke_w":1},{
            success: function(model, response){
              _this.line = model;
              _this.line.path = path;
              _this.lines.add(model);
              _this.boardConnection.startPath(model.get("id"), x/_this.zoom, y/_this.zoom, model.get("color_l"));
              paper.view.draw();
            }
          });
        },

        mouseMove: function(e){
            var _this = this;
            setTimeout(function() {
                if(_this.line && e.which === 1){
                  if(_this.line.type === "free") {
                    _this.line.path.add(new paper.Point(e.pageX, e.pageY));
                    _this.boardConnection.addPathPoint(_this.line.get("id"), e.pageX/_this.zoom, e.pageY/_this.zoom);
                  } else {
                    _this.shadowPath.removeSegment(1);
                    _this.shadowPath.add(new paper.Point(e.pageX, e.pageY));
                  }
                }
                paper.view.draw();
            }, 0);
        },

        finishLine: function(e){
          if(this.line){
            if(this.line.type === "rect"){
              this.shadowPath.remove();
              this.line.path.add(new paper.Point(e.pageX, e.pageY));
              this.boardConnection.addPathPoint(this.line.get("id"), e.pageX/this.zoom, e.pageY/this.zoom);
            }
            else{
              this.line.path.simplify(10);
            }
            paper.view.draw();
            this.boardConnection.finishPath(this.line.get("id"));
            this.line.save({path: this.serialize(this.line.path)});
            this.lines.add(this.line);
            this.line = null;
          }
        },

        serialize: function(path){
            var pathToSerialize = [];
            var _this = this;
            $.each(path.getSegments(), function(i, segment){
                var segmentToSerialize = {
                    point: {x: segment.getPoint().x/_this.zoom, y: segment.getPoint().y/_this.zoom},
                    handleIn :  {x: segment.getHandleIn().x/_this.zoom, y: segment.getHandleIn().y/_this.zoom},
                    handleOut :  {x: segment.getHandleOut().x/_this.zoom, y: segment.getHandleOut().y/_this.zoom}
                };
                pathToSerialize.push(segmentToSerialize);
            });
            return JSON.stringify(pathToSerialize);
        },

        // Convert a line model to paper.pathObject
        drawLinePath: function(line){
            var path = new paper.Path();
            path.strokeColor = line.get("color_l");
            $.each($.parseJSON(line.get("path")), function(i, segment){
                path.add(new paper.Segment(segment.point, segment.handleIn, segment._handleOut));
            });
            return path;
        },

        startPath: function(id, x, y, color){
            var line = new Line({id:id});
            var path = new paper.Path();
            path.add(new paper.Point(x*this.zoom, y*this.zoom));
            line.path = path;
            line.path.model = line;
            line.fetch({
                success: function(model){
                    path.strokeColor = model.get("color_l");
                }
            });
            this.lines.add(line);
        },

        addPathPoint: function(id, x, y){
            this.lines.get(id).path.add(new paper.Point(x*this.zoom, y*this.zoom));
            paper.view.draw();
        },

        finishPath: function(id){
            var _this = this;
            this.lines.get(id).path.simplify(10);
            this.lines.get(id).fetch({success: function(line){
                line.path.remove();
                line.path = _this.drawLinePath(line);
                paper.view.draw();
            }});
        },

        setStrokeColor: function(color){
            this.strokeColor = color;
        },

        clearLines: function(color){
            var _this = this;
            _.chain(this.lines.models).clone().each(function(model){
                if (model.path) {
                    model.path.remove();
                }
                model.destroy();
                _this.boardConnection.deleteLine(model.get("id"));
            });
            paper.view.draw();
        },

        tryToErase: function(x, y){
            var hitOptions = {
                segments: true,
                stroke: true,
                fill: true,
                tolerance: 5
            };
            var hitResult = paper.project.hitTest(new paper.Point(x,y), hitOptions);
            if(hitResult){
                hitResult.item.remove();
                this.boardConnection.deleteLine(hitResult.item.model.get("id"));
                hitResult.item.model.destroy();
                paper.view.draw();
            }
        },

        deleteLine: function(id){
            var line = this.lines.get(id);
            if( line){
                if (line.path) {
                    line.path.remove();
                    paper.view.draw();
                }
            }
        },

        setZoom: function(zoom) {
            var _this = this;
            this.zoom = zoom;
            _.each(this.lines.models, function(line){
                if(line.path){
                    var segments = line.path.getSegments();
                    if(line.get("path")){
                        $.each($.parseJSON(line.get("path")), function(i, jsonSegment){
                            var paperSegment = segments[i];
                            if (paperSegment) {
                                var point = paperSegment.getPoint();
                                var handleIn = paperSegment.getHandleIn();
                                var handleOut = paperSegment.getHandleOut();
                                point.x = jsonSegment.point.x*_this.zoom;
                                point.y = jsonSegment.point.y*_this.zoom;
                                handleIn.x = jsonSegment.handleIn.x*_this.zoom;
                                handleIn.y = jsonSegment.handleIn.y*_this.zoom;
                                handleOut.x = jsonSegment.handleOut.x*_this.zoom;
                                handleOut.y = jsonSegment.handleOut.y*_this.zoom;
                            }
                        });
                    }
                }
            });
            paper.view.viewSize = new paper.Size(3000*this.zoom, 1500*this.zoom);
            paper.view.draw();
        }
    });

    return BoardCanvas;
});
