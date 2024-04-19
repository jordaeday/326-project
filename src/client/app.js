function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.style.display = 'none';
    });

    // Show the requested page
    document.getElementById(pageId).style.display = 'block';
}

// Initial display setup
showPage('home'); // Show home page by default
