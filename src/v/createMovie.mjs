/**
 * @fileOverview  View methods for the use case "create book"
 * @author Gerd Wagner
 */
import Movie, {GenreEL, MovieRatingEL} from "../m/Movie.mjs";
import {createChoiceWidget} from "../../lib/util.mjs";

const formEl = document.forms["Movie"],
    movieRatingFieldsetEl = formEl.querySelector("fieldset[data-bind='movieRating']"),
    genreFieldsetEl = formEl.querySelector("fieldset[data-bind='genres']"),
    saveButton = formEl["commit"];
// load all book records
Movie.retrieveAll();
// fillSelectWithOptions( genreFieldsetEl, GenreEL.labels);
createChoiceWidget(movieRatingFieldsetEl, "movieRating", [], "radio", MovieRatingEL.labels, false);
createChoiceWidget(genreFieldsetEl, "genres", [], "checkbox", GenreEL.labels, true);

// add event listeners for responsive validation
formEl.movieId.addEventListener("input", function () {
    formEl.movieId.setCustomValidity(Movie.checkMovieIdAsId(formEl.movieId.value).message);
});
formEl.title.addEventListener("input", function () {
    formEl.title.setCustomValidity(Movie.checkTitle(formEl.title.value).message);
});
formEl.releaseDate.addEventListener("input", function () {
    formEl.releaseDate.setCustomValidity(Movie.checkReleaseDate(formEl.releaseDate.value).message);
});

// mandatory value check
genreFieldsetEl.addEventListener("click", function () {
    const val = genreFieldsetEl.getAttribute("data-value");
    formEl.genres[0].setCustomValidity(
        (!val || Array.isArray(val) && val.length === 0) ?
            "At least one genre must be selected!" : "");
});

// formEl.edition.addEventListener("input", function () {formEl.edition.setCustomValidity(
//     Movie.checkEdition( formEl.edition.value).message);
// });
// Set an event handler for the submit/save button
saveButton.addEventListener("click", handleSaveButtonClickEvent);


// event handler for the submit/save button
function handleSaveButtonClickEvent() {
    const slots = {
        movieId: formEl.movieId.value,
        title: formEl.title.value,
        releaseDate: formEl.releaseDate.value,
        movieRating: movieRatingFieldsetEl.getAttribute("data-value"),
        genres: JSON.parse(genreFieldsetEl.getAttribute("data-value"))
    };
    // // construct the list of selected otherAvailableLanguages
    // for (const o of selectedOtherAvLangOptions) {
    //     slots.otherAvailableLanguages.push(parseInt(o.value));
    // }
    // set error messages in case of constraint violations
    formEl.movieId.setCustomValidity(Movie.checkMovieIdAsId(slots.movieId).message);
    formEl.title.setCustomValidity(Movie.checkTitle(slots.title).message);
    if (formEl.releaseDate.value) {
        slots.releaseDate = formEl.releaseDate.value;
        formEl.releaseDate.setCustomValidity(Movie.checkReleaseDate(slots.releaseDate).message);
    }
    // formEl.genres.setCustomValidity(Movie.checkGenres(slots.genres).message);
    // formEl.movieRating.setCustomValidity(Movie.checkMovieRating(slots.movieRating).message);
    if (formEl.checkValidity()) Movie.add(slots);
}

// neutralize the submit event
formEl.addEventListener("submit", function (e) {
    e.preventDefault();
    formEl.reset();
});

// Set a handler for the event when the browser window/tab is closed
window.addEventListener("beforeunload", Movie.saveAll);
