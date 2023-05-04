/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 */
import Movie from "../m/Movie.mjs";
import { fillSelectWithOptions, createChoiceWidget } from "../../lib/util.mjs";

const formEl = document.forms["Movie"],
    movieRatingEl = formEl["movieRating"],
    genresEl = formEl["genres"],
    saveButton = formEl["commit"];
// load all book records
Movie.retrieveAll();
// add event listeners for responsive validation
formEl.movieId.addEventListener("input", function () {
    formEl.movieId.setCustomValidity(Movie.checkMovieIdAsId( formEl.movieId.value).message);
});
formEl.title.addEventListener("input", function () {
    formEl.title.setCustomValidity( Movie.checkTitle( formEl.title.value).message);
});
formEl.releaseDate.addEventListener("input", function () {
    formEl.releaseDate.setCustomValidity(Movie.checkReleaseDate( formEl.releaseDate.value).message);
});
// formEl.edition.addEventListener("input", function () {formEl.edition.setCustomValidity(
//     Movie.checkEdition( formEl.edition.value).message);
// });
// Set an event handler for the submit/save button
saveButton.addEventListener("click", function () {
    const slots = {
        movieId: formEl.movieId.value,
        title: formEl.title.value,
        releaseDate: formEl.releaseDate.value };
    // set error messages in case of constraint violations
    formEl.movieId.setCustomValidity( Movie.checkMovieIdAsId( slots.movieId).message);
    formEl.title.setCustomValidity( Movie.checkTitle( slots.title).message);
    if (formEl.releaseDate.value) {
        slots.releaseDate = formEl.releaseDate.value;
        formEl.releaseDate.setCustomValidity( Movie.checkReleaseDate( slots.releaseDate).message);
    }
    // save the input data only if all of the form fields are valid
    if (formEl.checkValidity()) Movie.add( slots);
});

// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    formEl.reset();
});

// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);
