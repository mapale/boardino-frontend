/*globals define:false, window:false */
define("app/utils",[
	'backbone',
	'app/models/userprofile'
],

function(Backbone, UserProfile){

	function getBoardId() {
		var urlparam = window.location.pathname.replace(/^\/([^\/]*).*$/, '$1');
		return (urlparam)? urlparam : "";
	}

    return {

        getBoardId: getBoardId
        
    };
    
});