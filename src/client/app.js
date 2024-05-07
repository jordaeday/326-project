import * as db from "./db.js";

/**
 * Displays the specified page and hides others.
 * @param {string} pageId - The ID of the page to display.
 */
// Function to display the specified page and handle special logic for the flights page
export function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.style.display = "none";
    page.classList.remove("active");
  });

  // Populate the 'to' dropdown for flights with airport codes
  if (pageId === "flights") {
    const toAirportSelect = document.getElementById("toAirport");
    toAirportSelect.innerHTML = ""; // Clear existing options

    db.locations.forEach(location => {
      const el = document.createElement("option");
      el.textContent = `${location.name} (${location.airport})`; // Show name and airport code
      el.value = location.airport; // Use airport code as value
      toAirportSelect.appendChild(el);
    });

    // Automatically select the top location's airport code if results are available
    const results = JSON.parse(localStorage.getItem("quizResults"));
    if (results && results.length > 0) {
      toAirportSelect.value = results[0].airport; // results[0] should be the top location
    }
  }

  // Show the requested page
  document.getElementById(pageId).style.display = "block";
  document.getElementById(pageId).classList.add("active");
}

/**Initial display setup */
showPage("home"); /** Show home page by default */

/**
 * Calculates the total points from quiz responses.
 * @param {Object[]} responses - Array of quiz responses.
 * @returns {number} Total points.
 */

function calculateTotalPoints(responses) {
  return responses.reduce((total, curr) => total + parseInt(curr.value), 0);
}

/**
 * Displays the quiz results after they have been calculated.
 */
function displayResults() {
  const quizResponses = JSON.parse(localStorage.getItem("quizResponses"));
  const totalPoints = calculateTotalPoints(quizResponses);
  const rankedLocations = db.locations.sort((a, b) => b.score - a.score);
  const resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = "";

  rankedLocations.forEach((location, index) => {
    const listItem = document.createElement("div");
    const locScore = location.score;

    /**Start building the list item's HTML */
    let listItemHTML = `
      <div class="rank">${index + 1}</div>
      <div class="score-circle">${locScore}</div>
      <div class="location-name" data-location="${location.name}">${location.name}</div>
    `;

    /**Adding a new div to contain the tags attribute for the locations */
    listItemHTML += '<div class="location-tags">';
    location.about.tags.forEach((tag) => {
      listItemHTML += `<span class="tag">${tag}</span>`;
    });

    listItemHTML += "</div>"; /**Closing the tags container div */
    listItem.innerHTML = listItemHTML;
    resultsList.appendChild(listItem);
  });

  if (rankedLocations.length > 0) {
    const topLocation = rankedLocations[0];

    /**Update destination */
    const topDestinationElement = document.getElementById("top-destination");
    topDestinationElement.textContent = topLocation.name;

    /** Update budget */
    const topBudgetElement = document.getElementById("top-budget");
    topBudgetElement.textContent = `$${topLocation.about.budget}`;

    /**Update tags */
    const topTagsElement = document.getElementById("top-tags");
    topTagsElement.textContent = topLocation.about.tags.join(", ");
  }

  showPage("results");
}

/**
 * Clears the quiz results and redirects to the quiz page.
 */
function clearResults() {
  localStorage.removeItem("quizResponses"); /**Remove the stored responses */
  const resultsList = document.getElementById("resultsList");
  if (resultsList) {
    resultsList.innerHTML = ""; /**Clear the results list in the DOM */
  }
  db.clearScores();
  showPage("quiz"); /**Redirect to the quiz page */
}

/**
 * Handles the form submission for quiz responses.
 * @param {Event} event - The submission event.
 */
async function submission(event) {
  event.preventDefault(); /**Prevent form submission */

  const formData = new FormData(quizForm);
  db.clearScores();

  /** Convert FormData to an array of objects */
  const quizResponses = Array.from(formData, ([name, value]) => ({
    name,
    value,
  }));

  /**Loop through each location */
  try {
    await db.calculateAndStoreScores(quizResponses);
    displayResults();
  } catch (error) {
    console.error("An error occured while submitting your quiz.");
  }
}

let slideIndex = 0;

/**
 * Cycles through image slides automatically.
 */
function showImageSlide() {
  let i;
  let slides = document.getElementsByClassName("imgSlides");
  let dots = document.getElementsByClassName("dot");
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
  setTimeout(showImageSlide, 3500); /** Change image every 3.5 seconds */
}

const API_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI0IiwianRpIjoiZjc4OGU0MWMwNDYyYzExMjg4NzRiYzQ3NWQ4ODU0OWVlYjY2NGY2YTgxMWVmMDVkNTczYjM4N2U3MWFmYmMxMjQ0ZDZlNWM1YTdlOWJmOWYiLCJpYXQiOjE3MTQ5NzkxMjAsIm5iZiI6MTcxNDk3OTEyMCwiZXhwIjoxNzQ2NTE1MTIwLCJzdWIiOiIyMjUwNCIsInNjb3BlcyI6W119.KrMg7pjGNipTe9i3EIiIejXuaIZe9cBLBgDrVITYtT8VfeSHS0sqgiWlEdTl-dFh0K-b4noAFSdwOcgX__mcgA';

async function fetchFlightSchedules(depIata, arrIata, date) {
  const url = `/api/advanced-flights-schedules?iataCode=${depIata}&type=departure`;

  try {
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      if (!data.success) throw new Error('Failed to fetch flights');
      /* filtered the fetched data to match the departure airport and arrival airport*/
      /* the date filter works but sometimes gives no data because I guess there are no flights on that day from and to the inputted airports*/
      /* also I limited the fetch to only 5 flights, feel free to change the number. No change needed elsewhere because the new elements are created dynamically */
      const filteredFlights = data.data.filter(flight => 
        flight.dep_iata === depIata && 
        flight.arr_iata === arrIata //&& 
        //flight.dep_time.includes(date)
    ).slice(0, 5);

    console.log("Filtered Flights:", filteredFlights);  // Debugging line to log filtered flights
    return filteredFlights;
  } catch (error) {
      console.error('Error fetching flight data:', error);
      return [];
  }
}


document.addEventListener("DOMContentLoaded", function () {
  showImageSlide();

  const flightButton = document.getElementById("flightButton");
  const quizButton = document.getElementById("quizButton");
  const clearResultsButton = document.getElementById("clearResultsButton");
  const homeLink = document.getElementById("homeLink");
  const quizLink = document.getElementById("quizLink");
  const flightsLink = document.getElementById("flightsLink");
  const confirmationLink = document.getElementById("confirmationLink");
  const quizForm = document.getElementById("quizForm");
  const previousResultsButton = document.getElementById(
    "previousResultsButton"
  );
  const backToQuizButton = document.getElementById("backToQuizButton");
  const clearAnswersButton = document.getElementById("clearAnswersButton");

  /** Navigation event listeners */
  flightButton.addEventListener("click", () => showPage("flights"));
  quizButton.addEventListener("click", () => showPage("quiz"));
  clearResultsButton.addEventListener("click", clearResults);

  homeLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("home");
  });

  flightsLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("flights");
  });

  confirmationLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("confirmation");
  });

  quizLink.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("quiz");
  });

  /** Quiz form event listener */
  quizForm.addEventListener("submit", submission);

  previousResultsButton.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("results");
  });

  backToQuizButton.addEventListener("click", (e) => {
    e.preventDefault();
    showPage("quiz");
  });

  clearAnswersButton.addEventListener("click", (e) => {
    e.preventDefault();
    quizForm.reset();
    db.clearScores();
  });
});
