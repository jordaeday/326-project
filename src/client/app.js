import * as db from "./db.js";

function showPage(pageId) {
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

//event listener for submission
document.getElementById("quizForm").addEventListener("submit", submission);

function submission(event) {
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

// Event listener for when results page is shown
document.getElementById("results").addEventListener("show", function () {
  const scores = db.topLocations(3);
  const sortedScores = scores.sort((a, b) => b.score - a.score);

  const resultsList = document.getElementById("resultsList");
  resultsList.innerHTML = ""; // Clear the list

  sortedScores.forEach((location) => {
    const item = document.createElement("li");
    item.textContent = `${location.name}: ${location.score}`;
    resultsList.appendChild(item);
  });
});


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

// Ensuring the slideshow starts when the document is loaded
document.addEventListener("DOMContentLoaded", function () {
  showImageSlide();
  document.getElementById("homeLink").addEventListener("click", () => showPage("home"));
  document.getElementById("quizLink").addEventListener("click", () => showPage("quiz"));
  document.getElementById("flightsLink").addEventListener("click", () => showPage("flights"));
  document.getElementById("confirmationLink").addEventListener("click", () => showPage("confirmation"));
});
