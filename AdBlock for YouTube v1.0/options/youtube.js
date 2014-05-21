/*

Need to remove the storage calls and the push to array.  That isn't required here.

*/

var jsonYTSubs=new Array();  //Must be declared outside of the function because it'll get overwritten otherwise

sendAjax("");
setupOnchange();

function sendAjax(nextPageToken){
  chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
  jQuery.ajax({
            type: "GET",
            url: "https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&maxResults=50&order=alphabetical&fields=items(id%2Csnippet)%2CnextPageToken%2CtokenPagination&access_token="+token,
            dataType:"json",
            data:"pageToken="+nextPageToken,
            success:function(jsonObj){
					for (var i=0;i<jsonObj.items.length;i++){
						$('#youtubeSubscriptions').append($('<option id ='+jsonObj.items[i].snippet.resourceId.channelId+'>', { value : jsonObj.items[i].snippet.channelId }).text(jsonObj.items[i].snippet.title)); 
						//Add Subscriptions to the stored list
						jsonYTSubs.push(jsonObj.items[i].snippet.resourceId.channelId);
					}
					if(jsonObj.nextPageToken!=null){
						nextPageToken=jsonObj.nextPageToken;
						sendAjax(nextPageToken);
					}
					else{
						jsonYTSubs=jsonYTSubs.join();
						storage_set('youtube_subscriptions', jsonYTSubs);
					}
            },
            error:function (xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
            }
        });
	});
}

function setupOnchange(){
 //Select box onchange to open up youtube page.
  $("#youtubeSubscriptions").change(function(){
	window.open('https://www.youtube.com/channel/'+$( "select#youtubeSubscriptions option:selected").attr("id"),'_blank');
	return false;
	});
}