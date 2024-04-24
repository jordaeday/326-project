import * as db from "./db.js";

export function showPage(pageId) {
  // Hide all pages
  document.querySelectorAll(".page").forEach((page) => {
    page.style.display = "none";
    page.classList.remove("active");
  });

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
    //console.log(location.name + " locScore value: " + location.score);
    listItem.innerHTML = `
    <div class="rank">${index + 1}</div>
    <div class="score-circle">${locScore}</div>
    <div class="location-name" data-location="${location.name}">${location.name}</div>
    `;
    resultsList.appendChild(listItem);
  });
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

  // Log to console for debugging
  console.log("Quiz submitted!");

  const formData = new FormData(quizForm);

  // Convert FormData to an array of objects
  const quizResponses = Array.from(formData, ([name, value]) => ({
    name,
    value,
  }));
  console.log(quizResponses);

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
  const previousResultsButton = document.getElementById("previousResultsButton");
  const backToQuizButton = document.getElementById("backToQuizButton");
  const clearAnswersButton = document.getElementById("clearAnswersButton");

  // Navigation event listeners
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
