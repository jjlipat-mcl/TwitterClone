document.addEventListener('DOMContentLoaded', function () {
    // Fetch tweets when the page loads
    loadTweets();

    const tweetForm = document.getElementById('tweetForm');

    tweetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        postTweet();
    });
});

/*async function authenticateUser(username, password) {
    try {
        const response = await fetch("http://127.0.0.1:8080/api/v1/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return data.token; // Assuming the token is returned in the response
        } else {
            console.error("Authentication failed:", response.status, response.statusText);
            return null;
        }
    } catch (error) {
        console.error("Authentication failed:", error.message);
        return null;
    }
}*/

async function loadTweets() {
    try {
        /*const jwtToken = await authenticateUser("username", "password");

        if (!jwtToken) {
            console.error("Authentication failed. Unable to fetch tweets.");
            return;
        }*/
        //token needed for endpoints is retrieved from localStorage
        const jwtToken = localStorage.getItem('token');

        const response = await fetch("http://localhost:3000/api/v1/posts", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        console.log("Response Status:", response.status);

        if (response.ok) {
            // Parse and process the response if needed
            const data = await response.json();
            console.log("Response Data:", data);
        } else {
            console.error("Error loading tweets:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error loading tweets:", error.message);
    }
}

async function postTweet() {
    try {
        /*const tweetContent = document.getElementById('tweetContent').value;

        // Validate tweet content
        if (!tweetContent) {
            console.error("Tweet content is required.");
            return;
        }

        const jwtToken = await authenticateUser("username", "password");

        if (!jwtToken) {
            console.error("Authentication failed. Unable to post tweet.");
            return;
        }*/
        
        //token is retrieved from localStorage for Post request
        const jwtToken = localStorage.getItem('token');

        const response = await fetch("http://localhost:3000/api/v1/posts", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                content: tweetContent,
            }),
        });

        if (response.ok) {
            // Handle successful tweet post (e.g., update UI, load updated tweets, etc.)
            console.log('Tweet posted successfully');
            loadTweets(); // Reload tweets after posting
        } else {
            console.error("Error posting tweet:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error posting tweet:", error.message);
    }
}

