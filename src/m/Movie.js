//constructor function
function Movie( slots) {
    this.movieId = slots.movieId;
    this.title = slots.title;
    this.releaseDate = slots.releaseDate;
}

//collection of movies
Movie.instances = {};

Movie.convertRow2Obj = function (movieRow) {
    return new Movie(movieRow);
};

Movie.retrieveAllFromStorage = function () {
    let key = "";
    let keys = [];
    let moviesString = "";
    let movies = {};
    let i = 0;
    try {
        if (localStorage.getItem("movies")) {
            moviesString = localStorage.getItem("movies");
        }
    } catch (e) {
        alert("Error when reading from Local Storage\n" + e);
    }
    if (moviesString) {
        movies = JSON.parse( moviesString);
        keys = Object.keys( movies);
        console.log( keys.length +" movies loaded.");
        for (i=0; i < keys.length; i++) {
            key = keys[i];
            Movie.instances[key] = Movie.convertRow2Obj( movies[key]);
        }
    }
};

Movie.saveAllToStorage = function ()  {
    let moviesString = "";
    try {
        moviesString = JSON.stringify( Movie.instances);
        localStorage.setItem("movies", moviesString);
    } catch (e) {
        alert("Error when writing to Local Storage\n" + e);
    }
};
//adds new movie to the collection
Movie.add = function (slots) {
    Movie.instances[slots.movieId] = new Movie(slots);
};

Movie.update = function (slots) {
    let movie = Movie.instances[slots.movieId];
    movie.title = slots.title;
    movie.releaseDate = slots.releaseDate;
};

Movie.destroy = function (movieId) {
    if (Movie.instances[movieId]) {
        console.log("Movie " + movieId + " deleted");
        delete Movie.instances[movieId];
    } else {
        console.log("There is no movie with id " + movieId + " in the database!");
    }
};