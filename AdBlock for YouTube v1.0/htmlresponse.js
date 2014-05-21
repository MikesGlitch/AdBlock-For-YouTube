//Content script required to access the page DOM

//Youtube uses a push style navigation (HTML5) to load it's pages so the content script will not always be called from the manifest file (e.g. if you're clicking a link from related videos).  To make the script get called, even when selecting a related video, i've attached a listener to the progress bar (that measures how far the page has loaded).  When the page is loading, send a page refresh to allow all the full code to be run & a channel Id to be gathered.

(document.documentElement).addEventListener('webkitTransitionEnd',
function(/*TransitionEvent*/ event) {
	if (event.propertyName === 'width' && event.target.id === 'progress') {
		if(window.location.toString().indexOf("youtube.com/watch?")!==-1){
			//If not watching video, send message back to initialise the variables
			chrome.runtime.sendMessage({id: "reinitialise"});
			window.location.reload(true);
		}else{
			$(document.head).ready(function() {
				getMetaContent("channelId");
			});
		}
	}
}, true);

//As soon as the head is ready, get the channel ID
$(document.head).ready(function() {
	getMetaContent("channelId");
});

function getMetaContent(channelId) {
    var metas = document.getElementsByTagName('meta');
    for (i = 0; i < metas.length; i++) {
        if (metas[i].getAttribute("itemprop") == channelId) {
			chrome.runtime.sendMessage({id: metas[i].getAttribute("content")});
			break;
        }
		if(i==(metas.length-1)){  
			//If not viewing  video, send message back to initialise the variables
			chrome.runtime.sendMessage({id: "reinitialise"});
			break;
		}
    }
}


	
