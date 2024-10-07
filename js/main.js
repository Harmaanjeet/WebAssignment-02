let page = 1; // Current page
const perPage = 15; // Listings per page
let searchName = null; // Current search term

document.addEventListener("DOMContentLoaded", () => {
    loadListingsData(); // Initial load

    // Search form submit event
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        searchName = document.getElementById('name').value.trim(); // Get search term
        page = 1; // Reset to first page
        loadListingsData(); // Load data
    });

    // Clear button event
    document.getElementById('clearForm').addEventListener('click', () => {
        searchName = null; // Clear search
        document.getElementById('name').value = ''; // Reset input
        page = 1; // Reset to first page
        loadListingsData(); // Load data
    });

    // Pagination - Previous page
    document.getElementById('previous-page').addEventListener('click', () => {
        if (page > 1) {
            page--; // Decrease page number
            loadListingsData(); // Load data
        }
    });

    // Pagination - Next page
    document.getElementById('next-page').addEventListener('click', () => {
        page++; // Increase page number
        loadListingsData(); // Load data
    });
});

// Load listings data from API
function loadListingsData(page = 1, perPage = 10, searchName = '') {
    let url = `https://your-api-url/api/listings?page=${page}&perPage=${perPage}`; // API URL
    if (searchName) url += `&name=${searchName}`; // Add search if present

    console.log('Fetching data from:', url); // Debugging line
    fetch(url)
        .then(res => res.ok ? res.json() : Promise.reject(res.status))
        .then(data => {
            console.log('Received data:', data); // Debugging line
            const container = document.querySelector('.row'); // Adjust based on your structure
            container.innerHTML = ''; // Clear previous cards
            if (data.length) {
                // Create cards using map
                const cards = data.map(item => {
                    const reviewsRating = item.review_scores ? item.review_scores.review_scores_rating : 'N/A';
                    const summary = item.summary ? item.summary : 'No summary available';

                    return `
                        <div class="col-12 col-md-6 col-lg-4">
                            <div class="card">
                                <img src="${item.images.picture_url || 'https://placehold.co/600x400?text=Photo+Not+Available'}" class="card-img-top" alt="${item.name}">
                                <div class="card-body">
                                    <h5 class="card-title">${item.name}</h5>
                                    <p class="card-text">${summary}</p>
                                    <p><strong>Rating:</strong> ${reviewsRating}</p>
                                    <a href="#" class="btn btn-primary" data-id="${item._id}">View Details</a>
                                </div>
                            </div>
                        </div>
                    `;
                }).join(''); // Join array into a string

                container.innerHTML = cards; // Insert cards into container
                addCardClickEvents(); // Attach click events to the buttons
            } else {
                container.innerHTML = '<div class="col"><strong>No data available</strong></div>'; // Handle no data
            }
        })
        .catch(err => console.error('Fetch error:', err)); // Error handling
}


// Add click events to view details buttons
function addCardClickEvents() {
    document.querySelectorAll('.btn.btn-primary[data-id]').forEach(button => {
        button.addEventListener('click', (e) => {
            const id = button.getAttribute('data-id'); // Get data-id
            fetch(`/api/listings/${id}`) // Fetch listing details
                .then(res => res.json())
                .then(data => {
                    // Update modal title and body
                    document.querySelector('#detailsModalLabel').textContent = data.name;
                    document.querySelector('.modal-body').innerHTML = `
                        <img id="photo" onerror="this.onerror=null;this.src='https://placehold.co/600x400?text=Photo+Not+Available'" class="img-fluid w-100" src="${data.images.picture_url}">
                        <br/><br/>
                        ${data.neighborhood_overview || 'No neighborhood overview available.'}
                        <br/><br/>
                        <strong>Price:</strong> ${data.price.toFixed(2)}<br/>
                        <strong>Room:</strong> ${data.room_type}<br/>
                        <strong>Bed:</strong> ${data.bed_type}<br/>
                        <strong>Bedrooms:</strong> ${data.beds || 0}<br/><br/>
                    `;
                    new bootstrap.Modal(document.getElementById('detailsModal')).show(); // Show modal
                });
        });
    });
}

// Pagination and current page logic (if needed)
function updateCurrentPage() {
    document.getElementById('current-page').textContent = page; // Update current page number
}
