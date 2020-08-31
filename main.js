function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({scope: "https://www.googleapis.com/auth/youtube.readonly"})
        .then(function() { console.log("Sign-in successful"); },
              function(err) { console.error("Error signing in", err); });
}
var mykey = config.MY_KEY;
var myid = config.MY_ID;


function loadClient() {
    gapi.client.setApiKey(mykey);
    return gapi.client.load("https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest")
        .then(function() { console.log("GAPI client loaded for API"); },
              function(err) { console.error("Error loading GAPI client for API", err); });
}

function execute() {
    return gapi.client.youtube.playlists.list({
      "part": [
        "snippet,contentDetails"
      ],
      "maxResults": 25,
      "mine": true
    })
        .then(function(response) {
                // Handle the results here (response.result has the parsed body).
                //console.log("Response", response.result.items);

                var playlist = response.result.items;
                var output = '';

                for(var i in playlist){
                    var imgUrl = playlist[i].snippet.thumbnails.high.url;
                    var id = playlist[i].id;
                    //console.log(id);

                    
                    
                   
                    output += '<li id="'+id+'" class="list-group-item">TITLE: '+playlist[i].snippet.localized.title+'</li>';
                    
                }
                document.getElementById('playlist').innerHTML = output;
                function my(x) {

                    for(var i in x){
                        var id1 = x[i].id;
                        document.getElementById(id1).onclick = clicked;

                        var el = document.getElementById(id1);
                        if(el){
                        el.addEventListener('click', loadList);
                        }

                        function clicked(i) {
                            window.val = this.id; //set a global variable val
                        }
                        
                        function loadList() {
                            return gapi.client.youtube.playlistItems.list({
                              "part": [
                                "snippet,contentDetails"
                              ],
                              "maxResults": 25,
                              "playlistId": val
                            })
                                .then(function(response) {
                                        // Handle the results here (response.result has the parsed body).
                                        //console.log("The response is: ", response.result.items);
                        
                                        var items = response.result.items;
                                        var output = '';
                                        
                                        for(var i in items){
                                          var vidId = items[i].snippet.resourceId.videoId;
                                          //console.log(vidId);
                                          output += '<div class="border border-primary">' +
                                          '<ul>' +
                                          '<li>TITLE: '+items[i].snippet.title+'</li>' +
                                          '<iframe width="400" height="200" src="https://www.youtube.com/embed/'+vidId+'?list='+val+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>' +
                                          '</ul>' +
                                          '</div>';
                        
                        
                        
                        
                                        }
                        
                                        document.getElementById('items').innerHTML = output;
                        
                                      },
                                      function(err) { console.error("LoadList error", err); });
                          }


                    }

                }
                my(playlist);
                
                






              },
              function(err) { console.error("Execute error", err); });
}

gapi.load("client:auth2", function() {
    gapi.auth2.init({client_id: myid});
});