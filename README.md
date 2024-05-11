# Destination: Vacation

A website to accomodate your travel needs!

## Setup:

In the terminal, paste 
```bash
npm run milestone-02
```

## Structure:

Navigation bar with 4 page options:
1. Home: 
- Welcomes user to website, slideshow of travel-inspired photos
2. Quiz: 
- Helps user find ideal destination based on personal preferences
3. Flights: 
- User chooses dates for their destination and filtered flights are presented
4. Confirm Booking: 
- User is given list of their final destination and flight information

## Relevant Files

- app.js
    - Contains application logic and event listeners
- db.js
    - Uses PouchDB for database purposes and quiz results
- index.html
    - Page setup
- styles.css
    - Styling


Client-side (app.js):

Fetch Flight Schedules: A function named fetchFlightSchedules takes departure and arrival IATA codes along with a flight date, makes an API request to the server, and retrieves a list of flights. It filters these flights based on the criteria and shows up to 5 results.

Display Results: The displayFlightResults function takes the fetched flight data and displays it in a user-friendly format on the webpage. It lists details like flight number, departure time, duration, and estimated arrival.

Form Submission Handling: There's an event listener for form submission on the flight search form. This triggers the flight search and result display process.

Server-side (server.js):

Setup and API Routes: The server uses Express.js to handle requests and responses. It serves static files from a client directory and defines an API endpoint for fetching advanced flight schedules from an external API.

API Integration: The endpoint /api/advanced-flights-schedules makes a request to an external flight data API using parameters provided by the client-side. It handles errors and ensures only successful data fetches are sent back to the client.

Running the Server: The server listens on a specified port and logs a message when it's successfully running.
