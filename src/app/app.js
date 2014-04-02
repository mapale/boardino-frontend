/* globals $:false, define:false, document:false, window:false */
define("app",[
  'jquery',
  'app/views/main',
  'app/views/board',
  'app/views/canvas',
  'app/boardconnection',
  'app/boardmessagehandler',
  'app/toolbar',
  'app/utils',
  'app/models/board',
  'bootstrap'
], 

function($, MainView, BoardView, BoardCanvas, BoardConnection, BoardMessageHandler, Toolbar, Utils){
    var initialize = function(){

        var boardConnection, boardView;// Added

        function initBoard(){
          var boardId = Utils.getBoardId();
          var boardMessageHandler = new BoardMessageHandler();
          boardConnection = new BoardConnection(boardId, boardMessageHandler);
          boardView = new BoardView({boardConnection: boardConnection});
          boardMessageHandler.setBoardView(boardView);

          var mainView = new MainView({boardView: boardView, boardId: boardId});
          mainView.render();
        }

        $(document).ready(function() {
          initBoard();
          loadToolbar();
          var pencil_tool = $("#pencil_tools");
          pencil_tool.mouseover(function(){
              $("#pencil_green_tool").fadeIn('fast');
              $("#pencil_red_tool").fadeIn('fast');
              $("#pencil_blue_tool").fadeIn('fast');
          });
          pencil_tool.mouseleave(function(){
              $("#pencil_green_tool").fadeOut('fast');
              $("#pencil_red_tool").fadeOut('fast');
              $("#pencil_blue_tool").fadeOut('fast');
          });

          $(window).bind("beforeunload", function() {
            boardConnection.disconnect();
          });
        });

        function loadToolbar(){
            var toolbar = new Toolbar();
            toolbar.addTool($("#eraser_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/eraser_disabled.ico),default');
                        boardView.selectEraserTool();
                    }
            }));

            toolbar.addTool($("#postit_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/postit_disabled.ico),default');
                        boardView.selectPostitTool();
                    }
            }));

            toolbar.addTool($("#pencil_black_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_disabled.ico),default');
                        boardView.selectPencilTool("black");
                    }
            }));

            toolbar.addTool($("#pencil_green_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_green_disabled.ico),default');
                        boardView.selectPencilTool("green");
                        $("#pencil_black_tool").addClass("tool_enabled");
                   }
            }));

            toolbar.addTool($("#pencil_red_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_red_disabled.ico),default');
                        boardView.selectPencilTool("red");
                        $("#pencil_black_tool").addClass("tool_enabled");
                    }
            }));

            toolbar.addTool($("#pencil_blue_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','url(/static/images/pencil_blue_disabled.ico),default');
                        boardView.selectPencilTool("blue");
                        $("#pencil_black_tool").addClass("tool_enabled");
                    }
            }));

            toolbar.addTool($("#clear_lines_tool").tool(toolbar, {
                    "action": function(){
                        boardView.clearLines();
                    },
                    "confirmable": true,
                    "exclusive": false,
                    "keep_selected": false
            }));

            toolbar.addTool($("#rectline_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','crosshair');
                        boardView.selectRectLineTool("FF000000");
                    }
            }));

            toolbar.addTool($("#text_tool").tool(toolbar, {
                    "action": function(){
                        $("#board").css('cursor','crosshair');
                        boardView.selectTextTool();
                    }
            }));

            toolbar.addTool($("#undo-tool").tool(toolbar, {
                "action": function(){
                    boardView.undo();
                },
                "exclusive": false,
                "keep_selected": false
            }));
        }
  };

  return {
    initialize: initialize
  };
});
