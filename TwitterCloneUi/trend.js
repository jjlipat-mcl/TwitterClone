document.addEventListener('DOMContentLoaded', function () {
    loadTrendingNews();
});

async function loadTrendingNews() {
    try {
        const apiKey = '968f4f95f4064cc3a2e1b04cd557672c'; // Replace with your actual News API key
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);

        if (response.ok) {
            const data = await response.json();
            console.log("Trending News Data:", data);

            // Process the data and update your HTML accordingly
            const trendingNewsList = document.getElementById('trendingNewsList');

            data.articles.forEach((article) => {
                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="${article.url}" target="_blank">${article.title}</a>`;
                trendingNewsList.appendChild(listItem);
            });
        } else {
            console.error("Error fetching trending news:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error fetching trending news:", error.message);
    }
}
