// Initialize Supabase client
const SUPABASE_URL = 'https://upkmjagmqnwddjgfjbsf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwa21qYWdtcW53ZGRqZ2ZqYnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNjI1MjAsImV4cCI6MjA2MDYzODUyMH0.PEUcSi2668cqE1Rk2RibZaP5fTcNvrmtIn6qAF3yiJ0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Pagination state
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let totalItems = 0;
let totalPages = 1;
let lastSearchTerm = '';

// Get visible page range
function getVisiblePageRange() {
    let start = 1;
    let end = Math.min(5, totalPages);

    if (currentPage >= 3) {
        start = currentPage - 2;
        end = Math.min(currentPage + 2, totalPages);

        if (end - start < 4) {
            start = Math.max(1, end - 4);
        }
    }

    return { start, end };
}

// Update pagination UI
function updatePaginationUI() {
    const prevButton = document.getElementById('prevPage');
    const nextButton = document.getElementById('nextPage');
    const firstButton = document.getElementById('firstPage');
    const lastButton = document.getElementById('lastPage');
    const pageNumbers = document.getElementById('pageNumbers');
    const totalCountSpan = document.getElementById('totalCount');
    const currentPageSpan = document.getElementById('currentPage');

    // Update navigation buttons
    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
    firstButton.disabled = currentPage === 1;
    lastButton.disabled = currentPage === totalPages;

    // Update info text
    totalCountSpan.textContent = `Total: ${totalItems} items`;
    currentPageSpan.textContent = `Page: ${currentPage}`;

    // Update page numbers
    pageNumbers.innerHTML = '';
    const { start, end } = getVisiblePageRange();

    for (let i = start; i <= end; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => goToPage(i);
        if (i === currentPage) {
            button.classList.add('active');
        }
        pageNumbers.appendChild(button);
    }
}

// Go to specific page
async function goToPage(page) {
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        await searchMedicine(currentPage);
    }
}

// Go to last page
async function goToLastPage() {
    await goToPage(totalPages);
}

// Change page
async function changePage(delta) {
    await goToPage(currentPage + delta);
}

// Search function
async function searchMedicine(page = 1) {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('medicineTableBody');
    tableBody.innerHTML = '';
    currentPage = page;
    lastSearchTerm = searchInput;

    try {
        // First, get total count
        let countQuery = supabase
            .from('artg_finder')
            .select('id', { count: 'exact' });

        if (searchInput) {
            countQuery = countQuery.ilike('product_name', `%${searchInput}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
            console.error('Error getting count:', countError);
            throw countError;
        }

        totalItems = count;
        totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        
        // Then, get paginated data
        let query = supabase
            .from('artg_finder')
            .select('product_name, active_ingredients, indications, warnings, additional_product_information, poison_schedule, image_url');

        if (searchInput) {
            query = query.ilike('product_name', `%${searchInput}%`);
        }

        // Add pagination
        const start = (page - 1) * ITEMS_PER_PAGE;
        query = query.range(start, start + ITEMS_PER_PAGE - 1);

        const { data: medicines, error } = await query;

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!medicines || medicines.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No results found</td></tr>';
            totalItems = 0;
            totalPages = 1;
            updatePaginationUI();
            return;
        }

        medicines.forEach(medicine => {
            const row = document.createElement('tr');
            
            // HTML escape function for safe text display
            const escapeHtml = (text) => {
                if (!text) return '';
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            };
            
            // add data cells first
            const cells = [
                escapeHtml(medicine.product_name),
                escapeHtml(medicine.active_ingredients),
                escapeHtml(medicine.indications),
                escapeHtml(medicine.warnings),
                escapeHtml(medicine.additional_product_information),
                escapeHtml(medicine.poison_schedule)
            ];

            cells.forEach(text => {
                const cell = document.createElement('td');
                cell.textContent = text;
                row.appendChild(cell);
            });

            // add image cell at the end
            const imageCell = document.createElement('td');
            imageCell.className = 'medicine-image';
            if (medicine.image_url) {
                const img = document.createElement('img');
                img.src = medicine.image_url;
                img.alt = medicine.product_name;
                imageCell.appendChild(img);
            } else {
                const noImage = document.createElement('div');
                noImage.className = 'no-image';
                noImage.textContent = 'No Image';
                imageCell.appendChild(noImage);
            }
            row.appendChild(imageCell);
            
            tableBody.appendChild(row);
        });

        updatePaginationUI();
    } catch (error) {
        console.error('Error fetching medicines:', error);
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">Error loading data</td></tr>';
        totalItems = 0;
        totalPages = 1;
        updatePaginationUI();
    }
}

// Handle Enter key in search input
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMedicine(1); // Reset to first page on new search
    }
});

// Load search results when page loads
window.onload = () => {
    searchMedicine(1);
}; 