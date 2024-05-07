/** Import statements */
import pouchdb from "https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/+esm";

/**
 * Database connection setup using PouchDB.
 * @type {PouchDB.Database}
 */
export const db = new pouchdb("scores");

/**
 * Predefined list of locations with details about budget, weather, tags, languages, and continent.
 * @type {Array.<{name: string, about: Object, score: number}>}
 */
export const locations = [
  {
    name: "Tokyo",
    airport: "NRT", // Narita International Airport
    about: {
      budget: 157,
      weather: [40, 45, 50, 55, 65, 74, 80, 81, 75, 64, 55, 47],
      tags: ["city", "unique", "electronics"],
      language: ["Japanese"],
      continent: ["Asia"],
    },
    score: 0,
  },
  {
    name: "Paris",
    airport: "CDG", // Charles de Gaulle Airport
    about: {
      budget: 252,
      weather: [40, 43, 48, 55, 65, 74, 72, 72, 63, 55, 48, 43],
      tags: ["romantic", "cultural", "art", "city"],
      language: ["French"],
      continent: ["Europe"],
    },
    score: 0,
  },
  {
    name: "Bora Bora",
    airport: "BOB", // Bora Bora Airport
    about: {
      budget: 163,
      weather: [77, 77, 77, 77, 77, 75, 75, 75, 75, 75, 76, 76],
      tags: ["beach", "relaxation", "tropical"],
      language: ["English", "French"],
      continent: ["None"], // Geographically part of Oceania, not associated with a continent
    },
    score: 0,
  },
  {
    name: "Rome",
    airport: "FCO", // Leonardo da Vinci–Fiumicino Airport
    about: {
      budget: 184,
      weather: [45, 46, 50, 55, 65, 73, 79, 79, 74, 60, 55, 47],
      tags: ["cultural", "art", "city"],
      language: ["Italian"],
      continent: ["Europe"],
    },
    score: 0,
  },
  {
    name: "Los Angeles",
    airport: "LAX", // Los Angeles International Airport
    about: {
      budget: 258,
      weather: [58, 59, 61, 63, 67, 70, 74, 76, 74, 70, 63, 59],
      tags: ["tropical", "city", "cultural"],
      language: ["English"],
      continent: ["North America"],
    },
    score: 0,
  },
];

export const mockFlights = [
  {
    flightNumber: "FL123",
    airline: "United Airlines",
    departureTime: "10:00 AM",
    arrivalTime: "12:00 PM",
    price: "$150",
  },
  {
    flightNumber: "FL456",
    airline: "JetBlue Airlines",
    departureTime: "1:00 PM",
    arrivalTime: "3:00 PM",
    price: "$200",
  },
  {
    flightNumber: "FL789",
    airline: "Delta Airlines",
    departureTime: "4:00 PM",
    arrivalTime: "6:00 PM",
    price: "$250",
  },
];

/**
 * Retrieves a value by name from a list of response objects.
 * @param {string} name - The name to search for in the responses.
 * @param {Array.<{name: string, value: any}>} responses - The responses to search through.
 * @returns {any} The value associated with the name, or null if not found.
 */
function getValueByName(name, responses) {
  const item = responses.find((obj) => obj.name === name);
  return item ? item.value : null;
}

/**
 * Calculates the score for a given location based on user responses.
 * @param {Object} location - The location to calculate score for.
 * @param {Array.<{name: string, value: any}>} responses - User responses to various questions.
 */
export function calculateScore(location, responses) {
  /** Location questions */
  const continentAnswer = getValueByName("q1", responses);
  const locationContinent =
    location.about
      .continent[0]; /**Assuming there's only one continent per location */

  if (getValueByName("q2", responses) === "far") {
    if (continentAnswer !== locationContinent)
      location.score += parseInt(getValueByName("q3", responses));
  } else {
    if (continentAnswer === locationContinent)
      location.score += parseInt(getValueByName("q3", responses));
  }

  /** Weather questions */
  const month = parseInt(
    getValueByName("q4", responses)
  ); /**month index in array of months */
  const temp = parseInt(location.about.weather[month]);

  if (getValueByName("q5", responses) === "freezing") {
    if (temp < 35) location.score += parseInt(getValueByName("q6", responses));
  } else if (getValueByName("q5", responses) === "cold") {
    if (temp >= 35 && temp < 45)
      location.score += parseInt(getValueByName("q6", responses));
  } else if (getValueByName("q5", responses) === "warm") {
    if (temp >= 45 && temp < 70)
      location.score += parseInt(getValueByName("q6", responses));
  } else {
    if (temp < 75) location.score += parseInt(getValueByName("q6", responses));
  }

  /** Language questions */
  const languageAnswers = responses
    .filter((obj) => obj.name === "languages")
    .map((obj) => obj.value);
  const locationLanguages = location.about.language;
  if (languageAnswers.some((elem) => locationLanguages.includes(elem)))
    location.score += parseInt(getValueByName("q7", responses));

  /** Activity questions (vibe of area) */
  const vibe = getValueByName(
    "q8",
    responses
  ); /**rural, urban, beach, or hike */

  if (vibe === "rural") {
    if (location.about.tags.includes("relaxation"))
      location.score += parseInt(getValueByName("q9", responses));
  } else if (vibe === "urban") {
    if (location.about.tags.includes("city"))
      location.score += parseInt(getValueByName("q9", responses));
  } else if (vibe === "beach") {
    if (location.about.tags.includes("beach"))
      location.score += parseInt(getValueByName("q9", responses));
  } else {
    if (location.about.tags.includes("cultural"))
      location.score += parseInt(getValueByName("q9", responses));
  }

  console.log(location.name + ": " + location.score); // check scores in console
}

/**
 * Stores or updates the score of a location in the database.
 * @param {Object} location - The location whose score is to be stored or updated.
 * @returns {Promise<void>}
 */
async function storeLocationScore(location) {
  try {
    /**retrieve the document with the same id as the location name */
    const doc = await db.get(location.name);
    /**if found, update score */
    doc.score = location.score;
    /**put updated document back in db */
    await db.put(doc);
  } catch (error) {
    if (error.name === "not_found") {
      /**if document not found, create new one */
      await db.put({
        _id: location.name,
        score: location.score,
      });
    } else {
      /**log and rethrow errors */
      console.error("Error storing location score:", error);
      throw error;
    }
  }
}

/**
 * Calculates and stores scores for all locations based on provided quiz responses.
 * @param {Array.<{name: string, value: any}>} quizResponses - The responses from the quiz.
 * @returns {Promise<void>}
 */
export async function calculateAndStoreScores(quizResponses) {
  /**loop through each location and calculate score */
  locations.forEach((location) => {
    calculateScore(location, quizResponses);
  });

  /**store in local storage */
  localStorage.setItem("quizResponses", JSON.stringify(quizResponses));

  /**wait for all the storeLocationScore promises to resolve */
  try {
    await Promise.all(
      locations.map((location) => storeLocationScore(location))
    );
    /**after storing the scores, save them to local storage */
    localStorage.setItem("scores", JSON.stringify(locations));
  } catch (error) {
    console.error("An error occurred while storing scores:", error);
  }
}

/**
 * Clears scores for all locations, resetting them to zero.
 */
export function clearScores() {
  locations.forEach((location) => {
    location.score = 0;
  });
}

/**
 * Retrieves the top N locations based on their scores.
 * @param {number} num - Number of top locations to retrieve.
 * @returns {Promise<Array.<Object>>} The top N locations sorted by score.
 */
export async function topLocations(num) {
  const response = await db.allDocs({
    include_docs: true,
  });
  const scores = response.rows.map((row) => row.doc);
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, num);
}
