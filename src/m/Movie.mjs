/**
 * @fileOverview  The model class Movie with attribute definitions and storage management methods
 * @author Gerd Wagner
 * @copyright Copyright 2013-2014 Gerd Wagner, Chair of Internet Technology, Brandenburg University of Technology, Germany.
 * @license This code is licensed under The Code Project Open License (CPOL), implying that the code is provided "as-is",
 * can be modified to create derivative works, can be redistributed, and can be used in commercial applications.
 */
/**
 * Constructor function for the class Movie
 * @constructor
 * @param {{movieId: string, title: string, releaseDate: Date?}} slots
 */
import {cloneObject, isIntegerOrIntegerString, isNonEmptyString} from "../../lib/util.mjs";
import {
    IntervalConstraintViolation,
    MandatoryValueConstraintViolation,
    NoConstraintViolation,
    RangeConstraintViolation,
    StringLengthConstraintViolation,
    UniquenessConstraintViolation
} from "../../lib/errorTypes.mjs";
import {formatDate} from "../../lib/myUtil.mjs";
import Enumeration from "../../lib/Enumeration.mjs";

/**
 * Define three Enumerations
 */
const MovieRatingEL = new Enumeration({"G":"General Audiences", "PG":"Parental Guidance",
    "PG13":"Not Under 13","R":"Restricted", "NC17":"Not Under 17"});
const GenreEL = new Enumeration(["Action","Animation", "Comedy","Documentary", "Drama", "Family", "Film-Noir", "Horror", "Musical", "Romance"]);
class Movie {
    constructor({movieId, title, releaseDate, movieRating, genres}) {
        this.movieId = movieId
        this.title = title
        this.releaseDate = releaseDate
        this.movieRating = movieRating;
        this.genres = genres;
    }

    /*********************************************************
     ***  Checks and Setters  *********************************
     **********************************************************/

    get movieId() {
        return this._movieId;
    }

    set movieId(id) {
        const validationResult = Movie.checkMovieIdAsId(id);
        if (validationResult instanceof NoConstraintViolation) {
            this._movieId = id;
        } else {
            throw validationResult;
        }
    };

    static checkMovieId = function (id) {
        if (!id) return new NoConstraintViolation();
        if (!(/^\+?(0|[1-9]\d*)$/.test(id))) {
            return new RangeConstraintViolation('movie id must be a positive integer!');
        } else {
            return new NoConstraintViolation();
        }
    };
    static checkMovieIdAsId = function (id) {
        let validationResult = Movie.checkMovieId(id);
        if ((validationResult instanceof NoConstraintViolation)) {
            if (!id) {
                validationResult = new MandatoryValueConstraintViolation(
                    "A value for the movie id must be provided!");
            } else if (Movie.instances[id]) {
                validationResult = new UniquenessConstraintViolation(
                    "There is already a movie record with this id!");
            } else {
                validationResult = new NoConstraintViolation();
            }
        }
        return validationResult;
    };

    static checkMovieRating(rating) {
        if (!rating) return new NoConstraintViolation();
        if (!isIntegerOrIntegerString(rating) ||
            parseInt(rating) < 1 || parseInt(rating) > MovieRatingEL.MAX) {
            return new RangeConstraintViolation(
                `Invalid value for movie rating: ${rating}`);
        } else {
            return new NoConstraintViolation();
        }
    }

    set movieRating(rating) {
        const validationResult = Movie.checkMovieRating(rating);
        if (validationResult instanceof NoConstraintViolation) {
            this._movieRating = parseInt(rating);
        } else {
            throw validationResult;
        }
    }

    get movieRating() {
        return this._movieRating;
    }

    static checkGenre(genre) {
        if (!Number.isInteger(genre) || genre < 1 ||
            genre > GenreEL.MAX) {
            return new RangeConstraintViolation(
                `Invalid value for genre: ${genre}`);
        } else {
            return new NoConstraintViolation();
        }
    }

    static checkGenres(genres) {
        if (!genres || (Array.isArray(genres) && genres.length === 0)) {
            return new MandatoryValueConstraintViolation("at least one genre has to be provided!")
        } else if (!Array.isArray(genres)) {
            return new RangeConstraintViolation(
                "The value of genres must be a list/array!");
        } else {
            for (const i of genres.keys()) {
                const validationResult = Movie.checkGenre(genres[i]);
                if (!(validationResult instanceof NoConstraintViolation)) {
                    return validationResult;
                }
            }
            return new NoConstraintViolation();
        }
    }
    set genres(genres) {
        const validationResult = Movie.checkGenres(genres);
        if (validationResult instanceof NoConstraintViolation) {
            this._genres = genres;
        } else {
            throw validationResult;
        }
    }

    get genres() {
        return this._genres
    }

    static checkTitle = function (t) {
        if (!t) {
            return new MandatoryValueConstraintViolation("A title must be provided!");
        } else if (!isNonEmptyString(t)) {
            return new RangeConstraintViolation("The title must be a non-empty string!");
        }
        if (t.length > 120) {
            return new StringLengthConstraintViolation("max length for the title is 120 characters")
        }
        return new NoConstraintViolation();

    };
    set title(t) {
        let validationResult = Movie.checkTitle(t);
        if (validationResult instanceof NoConstraintViolation) {
            this._title = t;
        } else {
            throw validationResult;
        }
    };

    get title() {
        return this._title
    }
    static checkReleaseDate = function (y) {
        const MIN_DATE = Date.parse("1895-12-28");
        const MAX_DATE = new Date().setFullYear(new Date().getFullYear() + 1)
        let date = Date.parse(y);
        if (isNaN(date)) {
            return new RangeConstraintViolation("The value of releaseDate must be a date!");
        }
        if (date < MIN_DATE || date > MAX_DATE) {
            return new IntervalConstraintViolation(`The value of releaseDate must be between ${formatDate(MIN_DATE)} and next year!`);
        }
        return new NoConstraintViolation();
    };
    set releaseDate(y) {
        const validationResult = Movie.checkReleaseDate(y);
        if (validationResult instanceof NoConstraintViolation) {
            this._releaseDate = new Date(y);
        } else {
            throw validationResult;
        }
    };

    get releaseDate() {
        return this._releaseDate;
    }

    /*********************************************************
     ***  Other Instance-Level Methods  ***********************
     **********************************************************/
    /**
     *  Serialize movie object
     */
    toString() {
        let movieStr = `Movie{ ID: ${this.movieId}, title: ${this.title}, movieRating: ${this.movieRating}, genres: ${this.genres.toString()}`;
        if (this.releaseDate) movieStr += `, releaseDate: ${this.releaseDate}`;
        return movieStr;
    };

    toJSON() {  // is invoked by JSON.stringify
        const rec = {};
        for (let p of Object.keys( this)) {
            // copy only property slots with underscore prefix
            if (p.charAt(0) === "_") {
                // remove underscore prefix
                rec[p.substr(1)] = this[p];
            }
            // rec[p] = this[p];
        }
        return rec;
    }
}

/*********************************************************
 ***  Class-level ("static") properties  ******************
 **********************************************************/
// initially an empty collection (in the form of a map)
Movie.instances= {};

/*********************************************************
 ***  Class-level ("static") storage management methods ***
 **********************************************************/
/**
 *  Create a new movie row
 */
Movie.add = function (slots) {
    let movie;
    try {
        movie = new Movie(slots);
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        movie = null;
    }
    if (movie) {
        Movie.instances[movie.movieId] = movie;
        console.log(`${movie.toString()} created!`);
    }
};
/**
 *  Update an existing movie row
 */
Movie.update = function (slots) {
    let noConstraintViolated = true,
        updatedProperties = [];
    const movie = Movie.instances[slots.movieId],
        objectBeforeUpdate = cloneObject(movie);
    try {
        if (movie.title !== slots.title) {
            movie.title = slots.title;
            updatedProperties.push("title");
        }
        if (movie.releaseDate !== new Date(slots.releaseDate)) {
            movie.releaseDate = slots.releaseDate;
            updatedProperties.push("releaseDate");
        }
        if (movie.movieRating !== slots.movieRating) {
            movie.movieRating = slots.movieRating;
            updatedProperties.push("movieRating");
        }
        if (!movie.genres.isEqualTo( slots.genres)) {
            movie.genres = slots.genres;
            updatedProperties.push("genres");
        }
        // if (slots.edition && parseInt(slots.edition) !== movie.edition) {
        //     // slots.edition has a non-empty value that is new
        //     movie.setEdition(slots.edition);
        //     updatedProperties.push("edition");
        // } else if (!slots.edition && movie.edition) {
        //     // slots.edition has an empty value that is new
        //     delete movie.edition;  // unset the property "edition"
        //     updatedProperties.push("edition");
        // }
    } catch (e) {
        console.log(`${e.constructor.name}: ${e.message}`);
        noConstraintViolated = false;
        // restore object to its state before updating
        Movie.instances[slots.movieId] = objectBeforeUpdate;
    }
    if (noConstraintViolated) {
        if (updatedProperties.length > 0) {
            console.log(`Properties ${updatedProperties.toString()} modified for movie ${slots.movieId}`);
        } else {
            console.log(`No property value changed for movie ${slots.movieId}!`);
        }
    }
};
/**
 *  Delete a movie
 */
Movie.destroy = function (movieId) {
    if (Movie.instances[movieId]) {
        console.log(`${Movie.instances[movieId].toString()} deleted!`);
        delete Movie.instances[movieId];
    } else {
        console.log(`There is no movie with id ${movieId} in the database!`);
    }
};
/**
 *  Convert row to object
 */
Movie.convertRec2Obj = function (movieRow) {
    let movie = {};
    try {
        movie = new Movie(movieRow);
    } catch (e) {
        console.log(`${e.constructor.name} while deserializing a movie row: ${e.message}`);
    }
    return movie;
};
/**
 *  Load all movie table rows and convert them to objects
 */
Movie.retrieveAll = function () {
    let moviesString = "";
    try {
        if (localStorage["movies"]) {
            moviesString = localStorage["movies"];
        }
    } catch (e) {
        alert("Error when reading from Local Storage\n" + e);
    }
    if (moviesString) {
        const movies = JSON.parse(moviesString);
        console.log(`${Object.keys(movies).length} movies loaded.`);
        for (let key of Object.keys(movies)) {
            Movie.instances[key] = Movie.convertRec2Obj(movies[key]);
        }
    }
};
/**
 *  Save all movie objects
 */
Movie.saveAll = function () {
    let error = false;
    const nmrOfMovies = Object.keys(Movie.instances).length;
    try {
        localStorage["movies"] = JSON.stringify(Movie.instances);
    } catch (e) {
        alert("Error when writing to Local Storage\n" + e);
        error = true;
    }
    if (!error) console.log(`${nmrOfMovies} movies saved.`);
};
/*******************************************
 *** Auxiliary methods for testing **********
 ********************************************/
/**
 *  Create and save test data
 */
Movie.generateTestData = function () {
    try {
        Movie.instances[123] = new Movie({
            movieId: 123,
            title: "Weaving the Web",
            releaseDate: new Date(1895 - 12 - 28)
            // edition: 2
        });
        // Movie.instances["456"] = new Movie({
        //     movieId: 456,
        //     title: "Gödel, Escher, Bach",
        //     releaseDate: new Date(1795-12-28)
        // });
        // Movie.instances["789"] = new Movie({
        //     movieId: 789,
        //     title: "I Am A Strange Loop",
        //     releaseDate: new Date(1995-12-28)
        // });
        Movie.saveAll();
        console.log("created test data")
    } catch (e) {
        console.trace()
        console.log(`${e.constructor.name}: ${e.message}`);
    }
};
/**
 * Clear data
 */
Movie.clearData = function () {
    if (confirm("Do you really want to delete all movie data?")) {
        try {
            Movie.instances = {};
            localStorage["movies"] = "{}";
            console.log("All data cleared.");
        } catch (e) {
            console.log(`${e.constructor.name}: ${e.message}`);
        }
    }
};

export default Movie;
export {MovieRatingEL, GenreEL}
