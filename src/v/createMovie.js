pl.v.createMovie = {
    setupUserInterface: function () {
        let saveButton = document.forms['Movie'].commit;
        // load all movie objects
        Movie.retrieveAllFromStorage();
        // set an event handler for the submit/save button
        saveButton.addEventListener("click",
            pl.v.createMovie.handleSaveButtonClickEvent);
        // set a handler for the event when the browser window/tab is closed
        window.addEventListener("beforeunload", Movie.saveAllToStorage);
    },
    // save user input data
    handleSaveButtonClickEvent: function () {
        let formEl = document.forms['Movie'];
        let slots = { movieId: formEl.movieId.value,
            title: formEl.title.value,
            releaseDate: formEl.releaseDate.value};
        Movie.add( slots);
        formEl.reset();
    }
};