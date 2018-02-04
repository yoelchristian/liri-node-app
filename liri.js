require("dotenv").config();
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var request = require('request');
var fs = require('fs');
var keys = require("./keys.js");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var command = process.argv[2];
var nodeArgs = process.argv;
var searchParameter = "";
var text = "";

switch(command) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        searchSong();
        break;
    case "movie-this":
        searchMovie();
        break;
    case "do-what-it-says":
        randomFile();
        break;
    default:
        console.log("Please select between the following choices: ");
        break;
}

function combineArgv() {
        searchParameter = nodeArgs[3];
        for(var i = 4; i < nodeArgs.length; i++) {       
            searchParameter = searchParameter + " " + nodeArgs[i]; 
        };
}

function myTweets() {
    var params = {screen_name: 'HomeworkEight'};
    client.get('statuses/user_timeline', params, function(error, tweets, response) {
    if (!error) {
        for(var i = 0; i < tweets.length; i++) {
            console.log("========================================");
            console.log("Tweet: " + tweets[i].text);
            console.log("Time: " + tweets[i].created_at);
        
            if(i === 20) {
                return;
                }
            }
        }      
    });
};

function searchSong() {
    combineArgv();
    if(searchParameter === undefined) {
        spotify
        .search({ type: 'track', query: "The Sign Ace of Base" })
        .then(function(response) {
        console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
        console.log("Track Name: " + response.tracks.items[0].name);
        console.log("Album: " + response.tracks.items[0].album.name);
        console.log("Preview Link: " + response.tracks.items[0].external_urls.spotify);
        });
    } else {
        spotify
        .search({ type: 'track', query: searchParameter })
        .then(function(response) {
          console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
          console.log("Track Name: " + response.tracks.items[0].name);
          console.log("Album: " + response.tracks.items[0].album.name);
          console.log("Preview Link: " + response.tracks.items[0].external_urls.spotify);
        })
        .catch(function(err) {
            console.log("Song not found");
        });
    };
}
  
function searchMovie() {
    combineArgv();
    if(searchParameter === undefined) {
        var mrNoBody = "Mr.Nobody"
        request("http://www.omdbapi.com/?t=" + mrNoBody + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
        if (!error && response.statusCode === 200) {
          console.log("Title: " + JSON.parse(body).Title);
          console.log("Release Year: " + JSON.parse(body).Released);
          console.log("imdb Rating: " + JSON.parse(body).imdbRating);
          console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
          console.log("Country: " + JSON.parse(body).Country);
          console.log("Lanugage: " + JSON.parse(body).Language);
          console.log("Plot: " + JSON.parse(body).Plot);
          console.log("Actors: " + JSON.parse(body).Actors);
        } else {
            console.log("Movie not found!");
        }
    });
    } else {
        request("http://www.omdbapi.com/?t=" + searchParameter + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
            if (!error && response.statusCode === 200) {
              console.log("Title: " + JSON.parse(body).Title);
              console.log("Release Year: " + JSON.parse(body).Released);
              console.log("imdb Rating: " + JSON.parse(body).imdbRating);
              console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
              console.log("Country: " + JSON.parse(body).Country);
              console.log("Lanugage: " + JSON.parse(body).Language);
              console.log("Plot: " + JSON.parse(body).Plot);
              console.log("Actors: " + JSON.parse(body).Actors);
            } else {
                console.log("Movie not found!");
            }
        });
    }  
};

function randomFile() {
    fs.readFile('random.txt', 'utf8', function(error, data) {
        if (error) {
          console.log(error);
          console.log('something went wrong');
        }
      
        text = data.split(',');
        useArgs = false;

        switch(text[0]) {
            case "my-tweets":
                myTweets();
                break;
            case "spotify-this-song":
                spotify
                .search({ type: 'track', query: text[1] })
                .then(function(response) {
                console.log("Artist(s): " + response.tracks.items[0].artists[0].name);
                console.log("Track Name: " + response.tracks.items[0].name);
                console.log("Album: " + response.tracks.items[0].album.name);
                console.log("Preview Link: " + response.tracks.items[0].external_urls.spotify);
                });
                break;
            case "movie-this":
                request("http://www.omdbapi.com/?t=" + text[1] + "&y=&plot=short&apikey=trilogy", function(error, response, body) {
                    if (!error && response.statusCode === 200) {
                    console.log("Title: " + JSON.parse(body).Title);
                    console.log("Release Year: " + JSON.parse(body).Released);
                    console.log("imdb Rating: " + JSON.parse(body).imdbRating);
                    console.log("Rotten Tomatoes: " + JSON.parse(body).Ratings[1].Value);
                    console.log("Country: " + JSON.parse(body).Country);
                    console.log("Lanugage: " + JSON.parse(body).Language);
                    console.log("Plot: " + JSON.parse(body).Plot);
                    console.log("Actors: " + JSON.parse(body).Actors);
                    } else {
                        console.log("Movie not found!");
                    }
                });
                break;
            default:
                console.log("Wrong input");
                break;
        }
    });
}
