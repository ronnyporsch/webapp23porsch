/**
 * @fileOverview  View methods for the use case "update movie"
 * @author Gerd Wagner
 */
import Movie, {GenreEL, MovieRatingEL} from "../m/Movie.mjs";
import {createChoiceWidget} from "../../lib/util.mjs";
import {fillSelectWithOptions} from "../../lib/util.mjs";
import {formatDate} from "../../lib/myUtil.mjs";

const formEl = document.forms["Movie"],
    submitButton = formEl["commit"],
    selectMovieEl = formEl["selectMovie"],
    movieRatingFieldsetEl = formEl.querySelector("fieldset[data-bind='movieRating']"),
    genresFieldsetEl = formEl.querySelector("fieldset[data-bind='genres']")
// load all movie records
Movie.retrieveAll();
// set up the movie selection list
fillSelectWithOptions(selectMovieEl, Movie.instances, {displayProp: "title"});
// when a movie is selected, populate the form with its data
selectMovieEl.addEventListener("change", function () {
    const movieKey = selectMovieEl.value;
    if (movieKey) {  // set form fields
        const movie = Movie.instances[movieKey];
        formEl.movieId.value = movie.movieId;
        formEl.title.value = movie.title;
        formEl.releaseDate.value = formatDate(movie.releaseDate)
        // set up the movieRating radio button group
        createChoiceWidget(movieRatingFieldsetEl, "movieRating",
            [movie.movieRating], "radio", MovieRatingEL.labels);
        // set up the publicationForms checkbox group
        createChoiceWidget(genresFieldsetEl, "genres",
            movie.genres, "checkbox", GenreEL.labels);
    } else {
        formEl.reset();
    }
});
// add event listeners for responsive validation
formEl.title.addEventListener("input", function () {
    formEl.title.setCustomValidity(
        Movie.checkTitle(formEl.title.value).message);
});
formEl.releaseDate.addEventListener("input", function () {
    formEl.releaseDate.setCustomValidity(
        Movie.checkReleaseDate(formEl.releaseDate.value).message);
});

// mandatory value check
genresFieldsetEl.addEventListener("click", function () {
    const val = genresFieldsetEl.getAttribute("data-value");
    formEl.genres[0].setCustomValidity(
        (!val || Array.isArray(val) && val.length === 0) ?
            "At least one genre must be selected!" : "" );
});
// Set an event handler for the submit/save button
submitButton.addEventListener("click", handleSubmitButtonClickEvent);

// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    formEl.reset();
});
// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);

/**
 * check data and invoke update
 */
function handleSubmitButtonClickEvent() {
    const slots = {
        movieId: formEl.movieId.value,
        title: formEl.title.value,
        releaseDate: formEl.releaseDate.value,
        movieRating: movieRatingFieldsetEl.getAttribute("data-value"),
        genres: JSON.parse(genresFieldsetEl.getAttribute("data-value"))
    };
    // set error messages in case of constraint violations
    formEl.title.setCustomValidity(Movie.checkTitle(slots.title).message);
    // set the error message for movieRating constraint violations on the first radio button
    formEl.movieRating[0].setCustomValidity(
        Movie.checkMovieRating(slots.movieRating).message);
    // set the error message for publicationForms constraint violations on the first checkbox
    formEl.genres[0].setCustomValidity(
        Movie.checkGenres(slots.genres).message);
    if (formEl.checkValidity()) {
        Movie.update(slots);
        // update the selection list option
        selectMovieEl.options[selectMovieEl.selectedIndex].text = slots.title;
    }
}
