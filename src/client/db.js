// Import statements
import pouchdb from "https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/+esm";

// Export
export const db = new pouchdb("scores");

export const locations = [
  {
    name: "Tokyo",
    about: {
      budget: 157,
      weather: "cloudy",
      tags: ["city", "unique", "electronics"],
      language: ["Japanese"],
      continent: ["Asia"],
    },
    score: 0,
  },
  {
    name: "Paris",
    about: {
      budget: 252,
      weather: "sunny",
      tags: ["romantic", "cultural", "art"],
      language: ["French"],
      continent: ["Europe"],
    },
    score: 0,
  },
  {
    name: "Bora Bora",
    about: {
      budget: 163,
      weather: "hot",
      tags: ["beach", "relaxation", "tropical"],
      language: ["English", "French"],
      continent: ["None"],
    },
    score: 0,
  },
  {
    name: "Rome",
    about: {
      budget: 184,
      weather: "cool",
      tags: ["cultural", "art", "city"],
      language: ["Italian"],
      continent: ["Europe"],
    },
    score: 0,
  },
  {
    name: "Los Angeles",
    about: {
      budget: 258,
      weather: "sunny",
      tags: ["tropical", "city", "cultural"],
      language: ["English"],
      continent: ["North America"],
    },
    score: 0,
  },
];

// Function to get value by name from responses array
function getValueByName(name, responses) {
  const item = responses.find((obj) => obj.name === name);
  return item ? item.value : null;
}

// Function to calculate score for each location
export function calculateScore(location, responses) {
  // Location questions
  const continentAnswer = getValueByName("q1", responses);
  const locationContinent = location.about.continent[0]; // Assuming there's only one continent per location

  if (getValueByName("q2", responses) === "far") {
    if (continentAnswer !== locationContinent)
      location.score += parseInt(getValueByName("q3", responses));
  } else {
    if (continentAnswer === locationContinent)
      location.score += parseInt(getValueByName("q3", responses));
  }

  // Weather (TODO later)

  // Language questions
  const languageAnswers = responses
    .filter((obj) => obj.name === "languages")
    .map((obj) => obj.value);
  const locationLanguages = location.about.language;
  if (languageAnswers.some((elem) => locationLanguages.includes(elem)))
    location.score += parseInt(getValueByName("q7", responses));

  // Activities (TODO later)
}

// Function to store/update location's score
async function storeLocationScore(location) {
  try {
    // retrieve the document with the same id as the location name
    const doc = await db.get(location.name);
    // if found, update score
    doc.score = location.score;
    // put updated document back in db
    await db.put(doc);
  } catch (error) {
    if (error.name === "not_found") {
      //if document not found, create new one
      await db.put({
        _id: location.name,
        score: location.score,
      });
    } else {
      // log and rethrow errors
      console.error("Error storing location score:", error);
      throw error;
    }
  }
}

// Calculates and stores scores for all locations
export async function calculateAndStoreScores(quizResponses) {
  // loop through each location and calculate score
  locations.forEach((location) => {
    calculateScore(location, quizResponses);
  });

  //store in local storage
  localStorage.setItem("quizResponses", JSON.stringify(quizResponses));

  // wait for all the storeLocationScore promises to resolve
  try {
    await Promise.all(
      locations.map((location) => storeLocationScore(location))
    );
    // after storing the scores, save them to local storage
    localStorage.setItem("scores", JSON.stringify(locations));
  } catch (error) {
    console.error("An error occurred while storing scores:", error);
  }
}

// Return the top 3 locations and information about them
export async function topLocations(num) {
  const response = await db.allDocs({
    include_docs: true,
  });
  const scores = response.rows.map((row) => row.doc);
  scores.sort((a, b) => b.score - a.score);
  return scores.slice(0, num);
}
