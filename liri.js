
require("dotenv").config();
var fs = require('fs');

var keys = require('./keys.js');

var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var request = require('request');

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// accounting for user input
if (process.argv[2] == "spotify-this-song") {

	getSong();
}

if (process.argv[2] == "my-tweets") {

	getTwitterFeed();
}

if (process.argv[2] == "movie-this") {

	getMovie();
}



// Spotify Function
 function getSong(songQuery) {

     var search = songQuery || process.argv[3] || "The Sign Ace of Base";

     spotify.search({
     	type: "track",
         query: search,
         limit: 1
        }, function(err,data){

          if(err){
              return console.log('Error occured: ' + err)
          }
          
          console.log('\n-------------\n')
          console.log('Title: ' + data.tracks.items[0].name)
          console.log('Artist: ' + data.tracks.items[0].artists[0].name) 
          console.log('Album Name: ' + data.tracks.items[0].album.name)   
          console.log('Preview URL' + data.tracks.items[0].preview_url)
          console.log('\n-------------\n') 
      
        })
 };

// Twitter Function
function getTwitterFeed() {
    var params = { screen_name: 'TittysprinkleMD', count: 20};
    client.get('statuses/user_timeline', params, function (err, tweets, response) {
        if (!err){
            tweets.forEach(element => {
                console.log('\n-------------\n')
                console.log(element.text)
                console.log('\n-------------\n')
            });
        }
    })
 }; 

// Movie Function
 function getMovie(MovieChoice){

	var movieTitle = MovieChoice || process.argv[3] || "Mr. Nobody";

	request("http://www.omdbapi.com/?apikey=trilogy&t=" + movieTitle, function(error, response, body) {

	if(!error && response.statusCode === 200) {

		var responseJson = JSON.parse(body);

		var movie = responseJson.Title;
		var year = responseJson.Year;
		var IMDBrating = responseJson.Ratings[0].Source;
		var RTrating = responseJson.Ratings[1].Source;
		var country = responseJson.Country;
		var language = responseJson.Language;
		var plot = responseJson.Plot;
		var actors = responseJson.Actors;

		console.log('\n-------------\n')
		console.log("Movie title: " + movie + "\n" + "Year: " + year + "\n" + "IMBD Rating: " + IMDBrating + "\n" + "Rotten Tomatoes Rating: " + RTrating + "\n" + "Country: " + country + "\n" + "Language: " + language + "\n" + "Plot: " + plot + "\n" + "Actors: " + actors);
		console.log('\n-------------\n')
	}
});
};

// Reads text from random.txt file

if (process.argv[2] == "do-what-it-says") {

	fs.readFile("./random.txt", "utf8", function(error, data){
		if (error) throw error;

		data = data.split(",");

		switch(data[0]) {
			case "my-tweets":
				getTwitterFeed();
				break;
			case "spotify-this-song":
				getSong(data[1]);
				break;
			case "movie-this":
				getMovie(data[1]);
				break;
		}
	});
}