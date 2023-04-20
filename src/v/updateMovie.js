pl.v.updateMovie = {
    setupUserInterface: function () {
        let formEl = document.forms['Movie'],
            saveButton = formEl.commit,
            selectMovieEl = formEl.selectMovie;
        let key = "", keys = [], movie = null, optionEl = null, i = 0;
        // load all movie objects
        Movie.retrieveAllFromStorage();
        // populate the selection list with books
        keys = Object.keys( Movie.instances);
        for (i=0; i < keys.length; i++) {
            key = keys[i];
            movie = Movie.instances[key];
            optionEl = document.createElement("option");
            optionEl.text = movie.title;
            optionEl.value = movie.movieId;
            selectMovieEl.add( optionEl, null);
        }
        // when a movie is selected, fill the form with its data
        selectMovieEl.addEventListener("change",
            pl.v.updateMovie.handleBookSelectionEvent);
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.updateMovie.handleSaveButtonClickEvent);
        // handle the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Movie.saveAllToStorage);
    },
    handleBookSelectionEvent: function () {
        let formEl = document.forms['Movie'];
        let selectMovieEl = formEl.selectMovie,
            movie = null, key = selectMovieEl.value;
        if (key) {
            movie = Movie.instances[key];
            formEl.movieId.value = movie.movieId;
            formEl.title.value = movie.title;
            formEl.releaseDate.value = movie.releaseDate;
        } else {
            formEl.reset();
        }
    },
    // save data
    handleSaveButtonClickEvent: function () {
        let formEl = document.forms['Movie'],
            selectMovieEl = formEl.selectMovie;
        let slots = {
            movieId: formEl.movieId.value,
            title: formEl.title.value,
            releaseDate: formEl.releaseDate.value
        };
        Movie.update( slots);
        // update the selection list option
        selectMovieEl.options[selectMovieEl.selectedIndex].text = slots.title;
        formEl.reset();
    }
};