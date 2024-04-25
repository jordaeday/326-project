import * as db from "./db.js";

export function showPage(pageId) {
  console.log("Showing page:", pageId); // debug

  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none";
    page.classList.remove("active");
  });

  // Populates dropdown for flights to locations in database
  if (pageId === "flights") {
    const toAirportSelect = document.getElementById("toAirport");
    toAirportSelect.innerHTML = ""; // Clear existing options

    const options = db.locations;

    for (let i = 0; i < options.length; i++) {
      const opt = options[i];
      const el = document.createElement("option");
      el.textContent = opt.name;
      el.value = opt;
      toAirportSelect.appendChild(el);
    }
  }

  // Show the requested page
  document.getElementById(pageId).style.display = "block";
  document.getElementById(pageId).classList.add("active");
}

// Initial display setup
showPage("home"); // Show home page by default

//Calculates total points from quiz responses
function calculateTotalPoints(responses) {
  return responses.reduce((total, curr) => total + parseInt(curr.value), 0);
}

// Call after quiz submitted and scores calculated
function displayResults() {
  const quizResponses = JSON.parse(localStorage.getItem("quizResponses"));
  const totalPoints = calculateTotalPoints(quizResponses);
  const rankedLocations = db.locations.sort((a, b) => b.score - a.score);
  const resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = "";

  rankedLocations.forEach((location, index) => {
    const listItem = document.createElement("div");
    const locScore = location.score;

    // Start building the list item's HTML
    let listItemHTML = `
      <div class="rank">${index + 1}</div>
      <div class="score-circle">${locScore}</div>
      <div class="location-name" data-location="${location.name}">${location.name}</div>
    `;

    // Adding a new div to contain the tags attribute for the locations
    listItemHTML += '<div class="location-tags">';
    location.about.tags.forEach((tag) => {
      listItemHTML += `<span class="tag">${tag}</span>`;
    });

    listItemHTML += "</div>"; // Closing the tags container div
    listItem.innerHTML = listItemHTML;
    resultsList.appendChild(listItem);
  });

  if (rankedLocations.length > 0) {
    const topLocation = rankedLocations[0];

    // Update destination
    const topDestinationElement = document.getElementById("top-destination");
    topDestinationElement.textContent = topLocation.name;

    // Update budget
    const topBudgetElement = document.getElementById("top-budget");
    topBudgetElement.textContent = `$${topLocation.about.budget}`;

    // Update tags
    const topTagsElement = document.getElementById("top-tags");
    topTagsElement.textContent = topLocation.about.tags.join(", ");
  }

  showPage("results");
}

function clearResults() {
  localStorage.removeItem("quizResponses"); // Remove the stored responses
  const resultsList = document.getElementById("resultsList");
  if (resultsList) {
    resultsList.innerHTML = ""; // Clear the results list in the DOM
  }
  db.clearScores();
  showPage("quiz"); // Redirect to the quiz page
}

async function submission(event) {
  event.preventDefault(); // Prevent form submission

  const formData = new FormData(quizForm);
  db.clearScores();

  // Convert FormData to an array of objects
  const quizResponses = Array.from(formData, ([name, value]) => ({
    name,
    value,
  }));

  // Loop through each location
  try {
    await db.calculateAndStoreScores(quizResponses);
    displayResults();
  } catch (error) {
    console.error("An error occured while submitting your quiz.");
  }
}

// // Event listener for when results page is shown
// document.getElementById("results").addEventListener("show", function () {
//   const scores = db.topLocations(3);
//   const sortedScores = scores.sort((a, b) => b.score - a.score);

//   const resultsList = document.getElementById("resultsList");
//   resultsList.innerHTML = ""; // Clear the list

//   sortedScores.forEach((location) => {
//     const item = document.createElement("li");
//     item.textContent = `${location.name}: ${location.score}`;
//     resultsList.appendChild(item);
//     //resultsList.appendChild(document.createElement("div").innerText="test");
//   });
// });

let slideIndex = 0;

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
  setTimeout(showImageSlide, 3500); // Change image every 3.5 seconds
}

const mockFlights = [
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

function showFlightResults(fromCity, toCity, date) {
  document.getElementById("resultFrom").textContent = fromCity;
  document.getElementById("resultTo").textContent = toCity;
  console.log(toCity);
  document.getElementById("resultDate").textContent = date;

  const flightsList = document.getElementById("flightsList");
  flightsList.innerHTML = ""; // Clear previous results

  mockFlights.forEach((flight) => {
    const flightItem = document.createElement("div");
    flightItem.classList.add("flight-item");
    flightItem.innerHTML = `
      <p><strong>Flight:</strong> ${flight.flightNumber}</p>
      <p><strong>Airline:</strong> ${flight.airline}</p>
      <p><strong>Departure:</strong> ${flight.departureTime}</p>
      <p><strong>Arrival:</strong> ${flight.arrivalTime}</p>
      <p><strong>Price:</strong> ${flight.price}</p>
    `;
    flightsList.appendChild(flightItem);
  });

  showPage("flightResults");
}

document
  .getElementById("flightForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Get values from previous search
    const fromAirportValue = document.getElementById("fromAirport").value;
    const toAirportSelect = document.getElementById("toAirport");
    const toAirportValue =
      toAirportSelect.options[toAirportSelect.selectedIndex].text;

    const departureDateValue = document.getElementById("departureDate").value;

    // Set values in flightResults
    document.getElementById("resultFrom").textContent = fromAirportValue;
    document.getElementById("resultTo").textContent = toAirportValue;
    document.getElementById("resultDate").textContent = departureDateValue;

    // show the flightResults page
    showFlightResults(fromAirportValue, toAirportValue, departureDateValue);
  });

document.addEventListener("DOMContentLoaded", function () {
  showImageSlide();

  const flightButton = document.getElementById("flightButton");
  const quizButton = document.getElementById("quizButton");
  const clearResultsButton = document.getElementById("clearResultsButton");
  const searchFlightsButton = document.getElementById("searchFlightsButton");
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

  // Navigation event listeners
  flightButton.addEventListener("click", () => showPage("flights"));
  quizButton.addEventListener("click", () => showPage("quiz"));
  clearResultsButton.addEventListener("click", clearResults);
  searchFlightsButton.addEventListener("click", showPage("flightResults"));

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

  // Quiz form event listener
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

  // // Check for stored quiz responses and display results or show quiz
  // const storedResponses = localStorage.getItem("quizResponses");
  // if (storedResponses) {
  //   quizLink.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     showPage("results");
  //   });
  // } else {
  //   quizLink.addEventListener("click", (e) => {
  //     e.preventDefault();
  //     showPage("quiz");
  //   });
  // }
});
