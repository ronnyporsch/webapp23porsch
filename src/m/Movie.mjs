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
import {isNonEmptyString, cloneObject}
    from "../../lib/util.mjs";
import {
    NoConstraintViolation, MandatoryValueConstraintViolation, RangeConstraintViolation,
    IntervalConstraintViolation, UniquenessConstraintViolation, StringLengthConstraintViolation
}
    from "../../lib/errorTypes.mjs";
import {formatDate} from "../../lib/myUtil.mjs";


function Movie(slots) {
    // assign default values
    this.movieId = "";
    this.title = "";
    this.releaseDate = "";
    // this.edition   number (int) optional
    // set properties only if constructor is invoked with an argument
    if (arguments.length > 0) {
        this.setMovieId(slots.movieId);
        this.setTitle(slots.title);
        if (slots.releaseDate) this.setReleaseDate(slots.releaseDate);  // optional
    }
}

/*********************************************************
 ***  Class-level ("static") properties  ******************
 **********************************************************/
// initially an empty collection (in the form of a map)
Movie.instances = {};

/*********************************************************
 ***  Checks and Setters  *********************************
 **********************************************************/
Movie.checkMovieId = function (id) {
    if (!id) return new NoConstraintViolation();
    if (!(/^\+?(0|[1-9]\d*)$/.test(id))) {
        return new RangeConstraintViolation('movie id must be a positive integer!');
    } else {
        return new NoConstraintViolation();
    }
};
Movie.checkMovieIdAsId = function (id) {
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
Movie.prototype.setMovieId = function (id) {
    const validationResult = Movie.checkMovieIdAsId(id);
    if (validationResult instanceof NoConstraintViolation) {
        this.movieId = id;
    } else {
        throw validationResult;
    }
};
Movie.checkTitle = function (t) {
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
Movie.prototype.setTitle = function (t) {
    const validationResult = Movie.checkTitle(t);
    if (validationResult instanceof NoConstraintViolation) {
        this.title = t;
    } else {
        throw validationResult;
    }
};
Movie.checkReleaseDate = function (y) {
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
Movie.prototype.setReleaseDate = function (y) {
    const validationResult = Movie.checkReleaseDate(y);
    if (validationResult instanceof NoConstraintViolation) {
        this.releaseDate = new Date(y);
    } else {
        throw validationResult;
    }
};
// Movie.checkEdition = function (e) {
//     // the "edition" attribute is optional
//     if (!e || e === "") return new NoConstraintViolation();
//     else {
//         if (!isIntegerOrIntegerString(e) || parseInt(e) < 1) {
//             return new RangeConstraintViolation(
//                 "The value of edition must be a positive integer!");
//         } else {
//             return new NoConstraintViolation();
//         }
//     }
// };
// Movie.prototype.setEdition = function (e) {
//     let validationResult = Movie.checkEdition(e);
//     if (validationResult instanceof NoConstraintViolation) {
//         if (!e || e === "") delete this.edition;  // unset optional property
//         else this.edition = parseInt(e);
//     } else {
//         throw validationResult;
//     }
// };
/*********************************************************
 ***  Other Instance-Level Methods  ***********************
 **********************************************************/
/**
 *  Serialize movie object
 */
Movie.prototype.toString = function () {
    let movieStr = `Movie{ ID: ${this.movieId}, title: ${this.title}`;
    if (this.releaseDate) movieStr += `, edition: ${this.releaseDate}`;
    return movieStr;
};
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
            movie.setTitle(slots.title);
            updatedProperties.push("title");
        }
        if (movie.releaseDate !== new Date(slots.releaseDate)) {
            movie.setReleaseDate(slots.releaseDate);
            updatedProperties.push("releaseDate");
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
    let moviesString = "", error = false;
    const nmrOfMovies = Object.keys(Movie.instances).length;
    try {
        moviesString = JSON.stringify(Movie.instances);
        localStorage["movies"] = moviesString;
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
