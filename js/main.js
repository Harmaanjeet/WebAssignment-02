/****************************************************************************
* I declare that this assignment is my own work in accordance with the Seneca Academic
* Policy. No part of this assignment has been copied manually or electronically from
* any other source (including web sites) or distributed to other students.
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Assignment: 2247 / 2
* Student Name: Harmanjeet Singh Hara
* Student Email: hhara.email@myseneca.ca
* Course/Section: WEB422/ZAA
* Deployment URL: https://web-assignment-02-jd34.vercel.app/#
*****************************************************************************/

// Grabbing key DOM elements for the search input, clear button, and listing cards
const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");
const noResultsMessage = document.getElementById("noResults");
const listingCards = document.getElementById("listingCards");
const aboutSection = document.getElementById("about");
const aboutLink = document.getElementById("aboutLink");
const closeAboutButton = document.getElementById("closeAboutButton");

let listings = []; // This will store the listings data fetched from the server
let searchName = ""; // Stores the current search term input by the user
let currentPage = 1; // Tracks the current page for pagination
const listingsPerPage = 3; // How many listings to show per page

// Fetches listing data from the API
async function fetchListings() {
    try {
        // Fetch the listing data from your API
        const response = await fetch('https://web-422-assignment-01-4pgt-6o7ou11kw-harmaanjeets-projects.vercel.app/api/listings?vercelToolbarCode=3dY_Vi4kCOFWLIF');
        listings = await response.json(); // Parse JSON response into 'listings'
        loadListingsData(); // Load listings into the DOM after fetching
    } catch (error) {
        console.error("Error fetching listings:", error); // Log any errors that occur during fetch
    }
}

// Filters and displays the listings based on the current search input and pagination
function loadListingsData() {
    // Filter listings based on the search input
    const filteredListings = listings.filter(listing =>
        listing.name.toLowerCase().includes(searchName.toLowerCase())
    );

    // Calculate the number of pages required for pagination
    const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
    const startIndex = (currentPage - 1) * listingsPerPage; // Starting index for current page
    const paginatedListings = filteredListings.slice(startIndex, startIndex + listingsPerPage); // Get listings for the current page

    // Clear existing listing cards before adding new ones
    listingCards.innerHTML = '';

    // If there are no results after filtering, show the 'no results' message
    if (paginatedListings.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none'; // Hide 'no results' message if there are results

        // Loop through the paginated listings and create a card for each one
        paginatedListings.forEach(listing => {
            const col = document.createElement('div'); // Create a new column for the listing card
            col.className = 'col-md-4'; // Apply Bootstrap column class
            col.innerHTML = `
                <div class="card">
                    <img src="${listing.image || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${listing.name}">
                    <div class="card-body">
                        <h5 class="card-title">${listing.name}</h5>
                        <p class="card-text">${listing.summary}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#listingModal" 
                            onclick="showDetails('${listing.name}', '${listing.description}', '${listing.image || 'https://via.placeholder.com/300x200'}')">View Listing</button>
                    </div>
                </div>
            `;
            listingCards.appendChild(col); // Append the card to the container
        });
    }

    updatePagination(totalPages); // Update pagination controls
}

// Updates pagination controls based on the number of pages available
function updatePagination(totalPages) {
    const paginationElement = document.querySelector('.pagination');
    paginationElement.innerHTML = ''; // Clear out any existing pagination buttons

    // Loop through the number of total pages and create pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li'); // Create a new list item for each page
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`; // Highlight the current page
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`; // Create the page link

        // Add click event to switch to the clicked page
        pageItem.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i; // Update current page number
            loadListingsData(); // Reload the listings data for the new page
        });

        paginationElement.appendChild(pageItem); // Append the page item to the pagination controls
    }
}

// Displays listing details in a modal window
function showDetails(title, description, image) {
    // Set the modal's title, description, and image source dynamically
    document.getElementById("listingTitle").textContent = title;
    document.getElementById("listingDescription").textContent = description;
    document.getElementById("listingImage").src = image;
}

// Event listener for search input changes
searchInput.addEventListener("input", () => {
    searchName = searchInput.value; // Update the search term with the current input
    currentPage = 1; // Reset to the first page for fresh search results
    loadListingsData(); // Reload listings based on the search term
});

// Event listener for the 'clear' button to reset search input
clearButton.addEventListener("click", () => {
    searchInput.value = ''; // Clear the search input field
    searchName = ''; // Reset the search term
    currentPage = 1; // Reset to the first page
    loadListingsData(); // Reload all listings
});

// Toggles the visibility of the 'About' section when clicked
aboutLink.addEventListener("click", (e) => {
    e.preventDefault();
    // Toggle the display of the About section
    aboutSection.style.display = aboutSection.style.display === 'none' ? 'block' : 'none';
});

// Close the 'About' section when the close button is clicked
closeAboutButton.addEventListener("click", () => {
    aboutSection.style.display = 'none'; // Hide the About section
});

// Fetch and display the listings data when the page loads
fetchListings();
