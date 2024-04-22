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
    event.preventDefault(); //prevent form submission

    //make sure button works
    console.log("Quiz submitted!");

    const formData = new FormData(quizForm);

    //convert to array
    const quizResponses = Array.from(formData, ([name, value]) => ({ name, value }));
    console.log(quizResponses);

    for (location in location) {
        calculateScore(location, quizResponses)
    }
    
  }

  
  
