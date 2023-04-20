pl.v.deleteMovie = {
    setupUserInterface: function () {
        let deleteButton = document.forms['Movie'].commit;
        let selectEl = document.forms['Movie'].selectMovie;
        let key = "", keys = [], movie = null, optionEl = null, i = 0;
        // load all movie objects
        Movie.retrieveAllFromStorage();
        keys = Object.keys( Movie.instances);
        // populate the selection list with movies
        for (i=0; i < keys.length; i++) {
            key = keys[i];
            movie = Movie.instances[key];
            optionEl = document.createElement("option");
            optionEl.text = movie.title;
            optionEl.value = movie.movieId;
            selectEl.add( optionEl, null);
        }
        // Set an event handler for the submit/delete button
        deleteButton.addEventListener("click",
            pl.v.deleteMovie.handleDeleteButtonClickEvent);
        // Set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Movie.saveAllToStorage);
    },
    // Event handler for deleting a movie
    handleDeleteButtonClickEvent: function () {
        let selectEl = document.forms['Movie'].selectMovie;
        let movieId = selectEl.value;
        if (movieId) {
            Movie.destroy( movieId);
            // remove deleted movie from select options
            selectEl.remove( selectEl.selectedIndex);
        }
    }
};