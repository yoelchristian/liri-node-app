var request = require("request");
var movieTitle = "";
var nodeArgs = process.argv;

for(var i = 2; i < nodeArgs.length; i++) {
    movieTitle = movieTitle + " " + nodeArgs[i];
};

console.log(movieTitle);

request("http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=trilogy", function(error, response, body) {

  if (!error && response.statusCode === 200) {
    console.log("The movie's release year is: " + JSON.parse(body).Year);
  }
});