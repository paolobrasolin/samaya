// Your use of the YouTube API must comply with the Terms of Service:
// https://developers.google.com/youtube/terms
// Called automatically when JavaScript client library is loaded.
function onClientLoad() {
  //  gapi.client.load('youtube', 'v3', onYouTubeApiLoad);
  gapi.client.load("youtube", "v3").then(
    function(response) {
      onYouTubeApiLoad();
    },
    function(reason) {
      console.log(reason.message);
    }
  );
}
// Called automatically when YouTube API interface is loaded (see line 9).
function onYouTubeApiLoad() {
  // See http://goo.gl/PdPA1 to get a key for your own applications.
  gapi.client.setApiKey("AIzaSyAE3mhfMe9P05kMxbv_6ysVzFMsSLyMsC0");
  search();
}
//function onYouTubeIframeAPIReady() {
//  console.log ("yt player ready");
//}
function search() {
  //  $.getJSON("ragas.json", function(json) {
  var json = ragasDB;
  var name = _.sample(
    json.filter(function(x) {
      return x.prahar == 4;
    })
  ).name;
  console.log(name);
  // Use the JavaScript client library to create a search.list() API call.
  var request = gapi.client.youtube.search.list({
    part: "snippet",
    q: "raga " + name,
    order: "rating",
    maxResults: 5,
    type: "video"
  });
  request.execute(onSearchResponse);
  //});
}
// Called automatically with the response of the YouTube API request.
function onSearchResponse(response) {
  var id = _.sample(response.items).id.videoId;
  player.loadVideoById(id);
}
