document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("nav a");
    //console.log(navLinks);
    const sections = document.querySelectorAll("main section");
    //console.log(sections);

    function hideAll() {
        sections.forEach(section => {
            section.style.display = "none";
        });
    }
    hideAll();

    function showSection(sectionId) {
        console.log(sectionId);
        const section = document.getElementById(sectionId);
        console.log(section);
        console.log(section.style);
        console.log(section.style.display);
        section.style.display = "block";
    }

    const activePage = document.getElementById("active-page");

    showSection("home"); // show home by default
    activePage.innerHTML = "Active page: home";

    navLinks.forEach(link => {
        link.addEventListener("click", function(event) {
            event.preventDefault();
            const sectionId = link.getAttribute("href").substring(1); // removes the # from the href
            hideAll();
            showSection(sectionId);
            activePage.innerHTML = "Active page: " + sectionId;
        });
    });
});
