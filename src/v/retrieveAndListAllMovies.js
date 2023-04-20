pl.v.retrieveAndListAllMovies = {
    setupUserInterface: function () {
        let tableBodyEl = document.querySelector("table#movies>tbody");
        let keys = [], key = "", row = {}, i = 0;
        // load all movie objects
        Movie.retrieveAllFromStorage();
        keys = Object.keys( Movie.instances);
        // for each movie, create a table row with a cell for each attribute
        for (i=0; i < keys.length; i++) {
            key = keys[i];
            row = tableBodyEl.insertRow();
            row.insertCell(-1).textContent = Movie.instances[key].movieId;
            row.insertCell(-1).textContent = Movie.instances[key].title;
            row.insertCell(-1).textContent = Movie.instances[key].releaseDate;
        }
    }
};