// Import statements
import pouchdb from 'https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/+esm'

// Export
export const db = new pouchdb("scores");

const locations = [
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
function calculateScore(location, responses) {
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

// Export
export function calculateAndStoreScores(quizResponses) {
    // Loop through each location
    locations.forEach((location) => {
      calculateScore(location, quizResponses);
      console.log(location.score);
    });

    // Add the scores to the database
    locations.forEach((location) => {
      db.put({
        _id: location.name,
        score: location.score,
      });
    });

    // Store scores in local storage
    localStorage.setItem("scores", JSON.stringify(locations));

    // Redirect to the results page
    showPage("results");
}

// Return the top 3 locations and information about them
export async function topLocations(num) {
    const response = await db.allDocs({
      include_docs: true,
      attachments: true,
    });
    const scores = response.rows.map((row) => row.doc);
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, num);
}
