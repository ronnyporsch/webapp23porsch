/**
 * @fileOverview  Contains various view functions for the use case listMovies
 * @author Gerd Wagner
 */
import Movie, { MovieRatingEL, GenreEL } from "../m/Movie.mjs";
import {formatDate} from "../../lib/myUtil.mjs";

const tableBodyEl = document.querySelector("table#movies>tbody");
// retrieve all book records
Movie.retrieveAll();
// list all book records
for (let key of Object.keys( Movie.instances)) {
    const movie = Movie.instances[key];
    const row = tableBodyEl.insertRow();
    row.insertCell().textContent = movie.movieId;
    row.insertCell().textContent = movie.title;
    row.insertCell().textContent = formatDate(movie.releaseDate) || "";
    row.insertCell().textContent = GenreEL.stringify(
        movie.genres);
    row.insertCell().textContent = MovieRatingEL.labels[movie.movieRating];
}
