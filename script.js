// --- KONFIGURASI ---
// GANTI DENGAN TMDB API KEY ANDA YANG VALID
const TMDB_API_KEY = '%%TMDB_API_KEY%%';

// URL dasar untuk API TMDB dan vidsrc
const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/multi';
const VIDSRC_EMBED_URL = 'https://vidsrc.xyz/embed/';

// --- ELEMEN HTML ---
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const videoPlayerContainer = document.getElementById('video-player-container');
const searchResults = document.getElementById('search-results');

// --- EVENT LISTENERS ---
searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    if (query) {
        searchMedia(query);
    }
});

searchInput.addEventListener('keyup', (event) => {
    if (event.key === 'Enter') {
        searchButton.click();
    }
});

// --- FUNGSI-FUNGSI ---

/**
 * Mencari media (film/TV) menggunakan API TMDB
 * @param {string} query - Kata kunci pencarian
 */
async function searchMedia(query) {
    searchResults.innerHTML = '<p class="placeholder-text">Mencari...</p>';
    videoPlayerContainer.innerHTML = ''; // Kosongkan player saat pencarian baru

    // Pastikan API key sudah diisi
    if (TMDB_API_KEY === 'MASUKKAN_API_KEY_TMDB_ANDA') {
        searchResults.innerHTML = '<p class="placeholder-text">Error: API Key TMDB belum dimasukkan di script.js</p>';
        return;
    }

    try {
        const response = await fetch(`${TMDB_SEARCH_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        displayResults(data.results);
    } catch (error) {
        console.error('Error fetching from TMDB:', error);
        searchResults.innerHTML = '<p class="placeholder-text">Gagal mencari. Coba lagi nanti.</p>';
    }
}

/**
 * Menampilkan hasil pencarian dari TMDB sebagai kartu-kartu
 * @param {Array} results - Array berisi hasil dari TMDB
 */
function displayResults(results) {
    searchResults.innerHTML = ''; // Kosongkan hasil sebelumnya

    if (!results || results.length === 0) {
        searchResults.innerHTML = '<p class="placeholder-text">Tidak ada yang ditemukan untuk pencarian ini.</p>';
        return;
    }

    results.forEach(media => {
        // Hanya tampilkan film (movie) atau acara TV (tv) yang punya poster
        if ((media.media_type === 'movie' || media.media_type === 'tv') && media.poster_path) {
            const card = document.createElement('div');
            card.className = 'result-card';
            // Simpan ID dan tipe media sebagai data attribute untuk digunakan nanti
            card.dataset.id = media.id;
            card.dataset.type = media.media_type;

            const title = media.media_type === 'movie' ? media.title : media.name;
            const posterUrl = `https://image.tmdb.org/t/p/w500${media.poster_path}`;

            card.innerHTML = `
                <img src="${posterUrl}" alt="${title}">
                <div class="card-info">
                    <h3>${title}</h3>
                    <span>${media.media_type.toUpperCase()}</span>
                </div>
            `;
            
            // Tambahkan event listener untuk memutar video saat kartu diklik
            card.addEventListener('click', () => {
                playMedia(media.id, media.media_type, title);
            });

            searchResults.appendChild(card);
        }
    });
}

/**
 * Memutar media menggunakan ID TMDB dan API vidsrc
 * @param {string} id - ID dari TMDB
 * @param {string} type - 'movie' atau 'tv'
 * @param {string} title - Judul media untuk ditampilkan
 */
function playMedia(id, type, title) {
    const embedUrl = `${VIDSRC_EMBED_URL}${type}/${id}`;
    
    // Tampilkan player di atas hasil pencarian
    videoPlayerContainer.innerHTML = `
        <h2>Sedang Memutar: ${title}</h2>
        <div class="responsive-iframe-container">
            <iframe 
                src="${embedUrl}" 
                frameborder="0" 
                allowfullscreen>
            </iframe>
        </div>
    `;

    // Scroll ke atas agar player terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
}