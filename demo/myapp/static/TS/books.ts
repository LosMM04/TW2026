// API Card
// API Name:        Open Library
// Base URL:        https://openlibrary.org
// Endpoint used:   /search.json?q=dracula&limit=10
// HTTP method:     GET
// Status code seen: 200
// Fields used:     docs, title, author_name, first_publish_year
// Relevance:       Allows web technology community users to search technical books and study resources

interface Book {
    title: string;
    author_name?: string[];
    first_publish_year?: number;
}

interface BookSearchResponse {
    docs: Book[];
}

// Generic helper - works with any type T
async function getJSON<T>(url: string): Promise<T> {
    // Create an AbortController for the request timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 5000); // 5000 ms

    try {
        const response = await fetch(url, { signal: controller.signal });

        // fetch() does NOT reject on 404/500 - we must check ok!
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        return await response.json() as T;
    } finally {
        clearTimeout(timer);
    }
}

const statusEl = document.getElementById("status") as HTMLParagraphElement;
const resultsEl = document.getElementById("results") as HTMLDivElement;

// Display the current status message (Loading / Loaded / No results / Error)
function setStatus(text: string): void {
    statusEl.textContent = text;
}

// Create a DOM card for one result item
// IMPORTANT: use createElement + textContent, NOT innerHTML with API data
function createCard(item: Book): HTMLElement {
    const card = document.createElement("div");
    card.className = "card";

    const title = document.createElement("h3");
    title.textContent = item.title;

    const detail = document.createElement("p");
    const author = item.author_name?.[0] ?? "Unknown author";
    const year = item.first_publish_year ? ` (${item.first_publish_year})` : "";
    detail.textContent = `${author}${year}`;

    card.appendChild(title);
    card.appendChild(detail);
    return card;
}

// Render an array of items into the results area
function render(items: Book[]): void {
    resultsEl.innerHTML = ""; // OK: clearing our own container
    if (items.length === 0) {
        setStatus("No results found.");
        return;
    }
    items.forEach(item => resultsEl.appendChild(createCard(item)));
    setStatus(`Loaded ${items.length} result(s).`);
}

const searchForm = document.getElementById("searchForm") as HTMLFormElement;
const queryInput = document.getElementById("queryInput") as HTMLInputElement;
const searchBtn = document.getElementById("searchBtn") as HTMLButtonElement;

// Build the request URL with the search parameter
function buildURL(query: string): string {
    const BASE_URL = "https://openlibrary.org/search.json";
    return `${BASE_URL}?q=${encodeURIComponent(query)}&limit=10`;
}

async function search(): Promise<void> {
    const query = queryInput.value.trim();
    if (!query) {
        setStatus("Please enter a search term.");
        return;
    }

    // Disable the button while the request is in progress
    searchBtn.disabled = true;
    setStatus("Loading...");
    resultsEl.innerHTML = "";

    try {
        const data = await getJSON<BookSearchResponse>(buildURL(query));
        const items: Book[] = data.docs;
        render(items);
        // Save the last search term (Step 8)
        localStorage.setItem("lastQuery", query);
    } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Unknown error";
        setStatus(`Load failed: ${msg}`);
    } finally {
        searchBtn.disabled = false; // re-enable the button
    }
}

searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    search();
});

// On page load, restore the previously saved search query
window.addEventListener("DOMContentLoaded", () => {
    const lastQuery = localStorage.getItem("lastQuery");
    if (lastQuery) {
        queryInput.value = lastQuery;
        // Optional: trigger the search automatically
        // search();
    }
});

