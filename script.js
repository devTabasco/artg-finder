// Initialize Supabase client
const SUPABASE_URL = 'https://upkmjagmqnwddjgfjbsf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwa21qYWdtcW53ZGRqZ2ZqYnNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNjI1MjAsImV4cCI6MjA2MDYzODUyMH0.PEUcSi2668cqE1Rk2RibZaP5fTcNvrmtIn6qAF3yiJ0';

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Search function
async function searchMedicine() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const tableBody = document.getElementById('medicineTableBody');
    tableBody.innerHTML = '';

    try {
        let query = supabase
            .from('artg_finder')
            .select('*');

        if (searchInput) {
            query = query.ilike('product_name', `%${searchInput}%`);
        }

        const { data: medicines, error } = await query.limit(50);

        if (error) {
            console.error('Supabase error:', error);
            throw error;
        }

        if (!medicines || medicines.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No results found</td></tr>';
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
            
            row.innerHTML = `
                <td>${escapeHtml(medicine.product_name)}</td>
                <td>${escapeHtml(medicine.artg_id)}</td>
                <td>${escapeHtml(medicine.active_ingredients)}</td>
                <td>${escapeHtml(medicine.indications)}</td>
                <td>${escapeHtml(medicine.warnings)}</td>
            `;
            
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching medicines:', error);
        tableBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">Error loading data</td></tr>';
    }
}

// Handle Enter key in search input
document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchMedicine();
    }
});

// Load search results when page loads
window.onload = () => {
    searchMedicine();
}; 