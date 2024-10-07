const searchInput = document.getElementById("searchInput");
const clearButton = document.getElementById("clearButton");
const noResultsMessage = document.getElementById("noResults");
const listingCards = document.getElementById("listingCards");
const aboutSection = document.getElementById("about");
const aboutLink = document.getElementById("aboutLink");
const closeAboutButton = document.getElementById("closeAboutButton");

let listings = []; // Array to hold listing data
let searchName = ""; // Search input
let currentPage = 1; // Current page for pagination
const listingsPerPage = 3; // Number of listings to show per page

// Fetch listings data
async function fetchListings() {
    try {
        // Replace this URL with your actual data source if needed
        const response = await fetch('https://web-422-assignment-01-4pgt-6o7ou11kw-harmaanjeets-projects.vercel.app/api/listings?vercelToolbarCode=3dY_Vi4kCOFWLIF'); // Update with your URL
        listings = await response.json(); // Get JSON data from the response
        loadListingsData();
    } catch (error) {
        console.error("Error fetching listings:", error);
    }
}

// Load listings data and filter based on search input
function loadListingsData() {
    const filteredListings = listings.filter(listing =>
        listing.name.toLowerCase().includes(searchName.toLowerCase())
    );

    // Pagination logic
    const totalPages = Math.ceil(filteredListings.length / listingsPerPage);
    const startIndex = (currentPage - 1) * listingsPerPage;
    const paginatedListings = filteredListings.slice(startIndex, startIndex + listingsPerPage);

    // Clear existing cards
    listingCards.innerHTML = '';

    // Display listings or no results
    if (paginatedListings.length === 0) {
        noResultsMessage.style.display = 'block';
    } else {
        noResultsMessage.style.display = 'none';
        paginatedListings.forEach(listing => {
            const col = document.createElement('div');
            col.className = 'col-md-4';
            col.innerHTML = `
                <div class="card">
                    <img src="${listing.image || 'https://via.placeholder.com/300x200'}" class="card-img-top" alt="${listing.name}">
                    <div class="card-body">
                        <h5 class="card-title">${listing.name}</h5>
                        <p class="card-text">${listing.summary}</p>
                        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#listingModal" onclick="showDetails('${listing.name}', '${listing.description}', '${listing.image || 'https://via.placeholder.com/300x200'}')">View Listing</button>
                    </div>
                </div>
            `;
            listingCards.appendChild(col);
        });
    }

    updatePagination(totalPages);
}

// Update pagination based on current page and total pages
function updatePagination(totalPages) {
    const paginationElement = document.querySelector('.pagination');
    paginationElement.innerHTML = ''; // Clear existing pagination

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = document.createElement('li');
        pageItem.className = `page-item ${i === currentPage ? 'active' : ''}`;
        pageItem.innerHTML = `<a class="page-link" href="#">${i}</a>`;

        pageItem.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = i; // Set current page
            loadListingsData(); // Load new data
        });

        paginationElement.appendChild(pageItem);
    }
}

// Show details in modal
function showDetails(title, description, image) {
    document.getElementById("listingTitle").textContent = title;
    document.getElementById("listingDescription").textContent = description;
    document.getElementById("listingImage").src = image;
}

// Search event listener
searchInput.addEventListener("input", () => {
    searchName = searchInput.value; // Update search term
    currentPage = 1; // Reset to first page
    loadListingsData(); // Load filtered data
});

// Clear button event listener
clearButton.addEventListener("click", () => {
    searchInput.value = ''; // Clear input
    searchName = ''; // Reset search term
    currentPage = 1; // Reset to first page
    loadListingsData(); // Load all data
});

// About link toggle
aboutLink.addEventListener("click", (e) => {
    e.preventDefault();
    aboutSection.style.display = aboutSection.style.display === 'none' ? 'block' : 'none';
});

// Close about section
closeAboutButton.addEventListener("click", () => {
    aboutSection.style.display = 'none';
});

// Fetch data on load
fetchListings();
