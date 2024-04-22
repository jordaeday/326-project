function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll(".page").forEach((page) => {
      page.style.display = "none";
    });
  
    // Show the requested page
    document.getElementById(pageId).style.display = "block";
  }
  
  // Initial display setup
  showPage("home"); // Show home page by default
  
  const locations = [
    {
      name: "Tokyo",
      about: {
        budget: "whatever",
        weather: "weather",
        tags: ["city", "unique", "electronics"],
        language: ["Japanese"],
        continent: ["Asia"],
      },
      score: 0
    },
    {
      name: "Paris",
      about: {
        budget: "whatever",
        weather: "weather",
        tags: ["romantic", "cultural", "art"],
        language: ["French"],
        continent: ["Europe"],
      },
      score: 0
    },
    {
      name: "Bora Bora",
      about: {
        budget: "whatever",
        weather: "weather",
        tags: ["beach", "relaxation", "tropical"],
        language: ["English", "French"],
        continent: ["None"],
      },
      score: 0
    },
    {
      name: "Rome",
      about: {
        budget: "whatever",
        weather: "weather",
        tags: ["cultural", "art", "city"],
        language: ["Italian"],
        continent: ["Europe"],
      },
      score: 0
    },
    {
      name: "Los Angeles",
      about: {
        budget: "whatever",
        weather: "weather",
        tags: ["tropical", "city", "cultural"],
        language: ["English"],
        continent: ["North America"],
      },
      score: 0
    },
  ];

//event listener for submission 
document.getElementById("quizForm").addEventListener("submit", submission);

function submission(event) {
    event.preventDefault(); // Prevent form submission

    // Log to console for debugging
    console.log("Quiz submitted!");

    const formData = new FormData(quizForm);

    // Convert FormData to an array of objects
    const quizResponses = Array.from(formData, ([name, value]) => ({ name, value }));
    console.log(quizResponses);

    // Loop through each location
    locations.forEach(location => {
        calculateScore(location, quizResponses);
        console.log(location.score);
    });
}

// Function to get value by name from responses array
function getValueByName(name, responses) {
    const item = responses.find(obj => obj.name === name);
    return item ? item.value : null;
}

// Function to calculate score for each location
function calculateScore(location, responses) {
    // Location questions
    const continentAnswer = getValueByName('q1', responses);
    const locationContinent = location.about.continent[0]; // Assuming there's only one continent per location

    if (getValueByName('q2', responses) === 'far') {
        if (continentAnswer !== locationContinent) 
            location.score += parseInt(getValueByName('q3', responses));
    } else {
        if (continentAnswer === locationContinent) 
            location.score += parseInt(getValueByName('q3', responses));
    }

    // Weather (TODO later)

    // Language questions
    const languageAnswers = responses.filter(obj => obj.name === 'languages').map(obj => obj.value);
    const locationLanguages = location.about.language;
    if (languageAnswers.some(elem => locationLanguages.includes(elem)))
        location.score += parseInt(getValueByName('q7', responses));

    // Activities (TODO later)
}