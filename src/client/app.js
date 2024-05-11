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

    const fromAirportSelect = document.getElementById("fromAirport");
    fromAirportSelect.innerHTML = ""; // Clear existing options

    db.locations.forEach(location => {
      const toEl = document.createElement("option"); // Create option element for toAirport dropdown
      toEl.textContent = `${location.airport}`;
      toEl.value = location.airport;
      toAirportSelect.appendChild(toEl); // Append to toAirport dropdown

      const fromEl = document.createElement("option"); // Create option element for fromAirport dropdown
      fromEl.textContent = `${location.airport}`;
      fromEl.value = location.airport;
      fromAirportSelect.appendChild(fromEl); // Append to fromAirport dropdown
    });

    // Automatically select the top location's airport code if results are available
    const results = JSON.parse(localStorage.getItem("quizResponses"));
    if (results && results.length > 0) {
      toAirportSelect.value = results[0].airport; // results[0] should be the top location
      fromAirportSelect.value = results[0].airport;
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

    /**Update tags */
    const topInfoElement = document.getElementById("top-info");
    topInfoElement.textContent = topLocation.about.info;
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

/**
 * Fetches flight schedules based on departure airport IATA code, arrival airport IATA code, and a specified date.
 * @param {string} depIata - IATA code for the departure airport.
 * @param {string} arrIata - IATA code for the arrival airport.
 * @param {string} date - The date of the flight (unused currently but can be implemented for date filtering).
 * @returns {Promise<Array>} A promise that resolves to an array of flight objects, filtered and limited to 5 entries.
 */
async function fetchFlightSchedules(depIata, arrIata, date) {
  const url = `/api/advanced-flights-schedules?iataCode=${depIata}&type=departure`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (!data.success) throw new Error('Failed to fetch flights');
    
    const filteredFlights = data.data.filter(flight => 
      flight.dep_iata === depIata && 
      flight.arr_iata === arrIata
    ).slice(0, 5);

    if(filteredFlights.length === 0) {
      document.getElementById("flightError").innerHTML = "No flights found for the selected route.";
    }

    console.log("Filtered Flights:", filteredFlights);
    return filteredFlights;
  } catch (error) {
    console.error('Error fetching flight data:', error);
    return [];
  }
}

/**
 * Displays flight results in a formatted list.
 * @param {Array} flights - An array of flight objects to display.
 */
function displayFlightResults(flights) {
  const flightsList = document.getElementById("flightsList");
  flightsList.innerHTML = '';

  flights.forEach((flight, index) => {
    const baseId = `flight${index+1}`;
    const item = document.createElement("div");
    item.className = "flight-card";
    item.innerHTML = `
      <div id="${baseId}_iata"><strong>IATA:</strong> ${flight.flight_iata}</div>
      <div id="${baseId}_number"><strong>Number:</strong> ${flight.flight_number}</div>
      <div id="${baseId}_departure"><strong>Departure Time:</strong> ${flight.dep_time}</div>
      <div id="${baseId}_duration"><strong>Duration:</strong> ${flight.duration} minutes</div>
      <div id="${baseId}_arrEst"><strong>Estimated Arrival:</strong> ${flight.arr_estimated}</div>
    `;
    flightsList.appendChild(item);
  });

  showPage("flightResults");
}

/**
 * Handles the flight search form submission.
 * @param {Event} event - The form submission event.
 */
async function handleFlightSearch(event) {
  event.preventDefault();
  const fromIata = document.getElementById("fromAirport").value;
  const toIata = document.getElementById("toAirport").value;
  const date = document.getElementById("departureDate").value;

  const flightResults = await fetchFlightSchedules(fromIata, toIata, date);

  if (flightResults.length === 0) {
    return;
  }
  displayFlightResults(flightResults);
}

document.getElementById("flightForm").addEventListener("submit", handleFlightSearch);

document.addEventListener("DOMContentLoaded", function () {
  showImageSlide();
});
  const flightButton = document.getElementById("flightButton");
  const quizButton = document.getElementById("quizButton");
  const clearResultsButton = document.getElementById("clearResultsButton");
  const searchFlightsButton = document.getElementById("searchFlightsButton");
  const homeLink = document.getElementById("homeLink");
  const quizLink = document.getElementById("quizLink");
  const flightsLink = document.getElementById("flightsLink");
  const confirmationLink = document.getElementById("confirmationLink");
  const quizForm = document.getElementById("quizForm");
  const previousResultsButton = document.getElementById("previousResultsButton");
  const backToQuizButton = document.getElementById("backToQuizButton");
  const clearAnswersButton = document.getElementById("clearAnswersButton");

  /** Navigation event listeners */
  flightButton.addEventListener("click", () => showPage("flights"));
  quizButton.addEventListener("click", () => showPage("quiz"));
  clearResultsButton.addEventListener("click", clearResults);
  //searchFlightsButton.addEventListener("click", showPage("flightResults"));

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

  /**Check for stored quiz responses and display results or show quiz*/
  
  /** const storedResponses = localStorage.getItem("quizResponses");
  if (storedResponses) {
    quizLink.addEventListener("click", (e) => {
      e.preventDefault();
      showPage("results");
    });
  } else {
    quizLink.addEventListener("click", (e) => {
      e.preventDefault();
      showPage("quiz");
    });
  }
}); */
