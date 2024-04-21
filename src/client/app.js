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
    },
  },
  {
    name: "Paris",
    about: {
      budget: "whatever",
      weather: "weather",
      tags: ["romantic", "cultural", "art"],
      language: ["French"],
    },
  },
  {
    name: "Bora Bora",
    about: {
      budget: "whatever",
      weather: "weather",
      tags: ["beach", "relaxation", "tropical"],
      language: ["English", "French"],
    },
  },
  {
    name: "Rome",
    about: {
      budget: "whatever",
      weather: "weather",
      tags: ["cultural", "art", "city"],
      language: ["Italian"],
    },
  },
  {
    name: "Los Angeles",
    about: {
      budget: "whatever",
      weather: "weather",
      tags: ["tropical", "city", "cultural"],
      language: ["English"],
    },
  },
];
