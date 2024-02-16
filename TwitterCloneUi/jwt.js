document.addEventListener('DOMContentLoaded', function () {
    // Fetch tweets when the page loads
    loadTweets();

    const tweetForm = document.getElementById('tweetForm');

    tweetForm.addEventListener('submit', function (event) {
        event.preventDefault();
        postTweet();
    });
});

async function loadTweets() {
    try {
        //get followed users
        //get the post of each followed user
        //concat all post to an array
        //apply selection sort
        //display as tweets

        const jwtToken = localStorage.getItem('token');
        const username = localStorage.getItem('username');
        var postArr = new Array();
        var users = new Array();

        const usernameURL = `http://localhost:3000/api/v1/users/${username}/following`;
        const postURL = "http://localhost:3000/api/v1/posts";

        const get_follower = await fetch(usernameURL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        if (get_follower.ok) {
            users = await get_follower.json();
            console.log("Users:", users);
            //users.forEach
        }
        else {
            console.error("Something went wrong", get_follower.status, get_follower.statusText);
        }

        const response = await fetch(postURL, {
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

            postArr = data.reverse();
            console.log("Post:",postArr)

            const container = document.getElementById("container");
            data.forEach(postContent => {
                const post = document.createElement("div");
                post.classList.add("post");
                post.innerHTML = `
                    <div id="user-profile">
                        <!-- You can include user profile information here -->
                    </div>
                    <div class="post-content">
                        <p>${postContent.content}</p>
                    </div>
                `;
                container.appendChild(post);
            });
        } else {
            console.error("Error loading tweets:", response.status, response.statusText);
        }

        users.forEach(followers => {
            const fPost = fetch(`${postURL}?username=${followers}`,{
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${jwtToken}`,
                },
            });
            if (fPost.ok){
                const fdata = fpost.json();
                postArr.concat(fdata);
                console.log("Post:",postArr);
            } else {
                console.error("Error loading tweets:", response.status, response.statusText);
            }
        });

        //postArr.sort((a,b) => {

        //})
    } catch (error) {
        console.error("Error loading tweets:", error.message);
    }
}

async function postTweet() {
    try {
        const tweetContent = document.getElementById('tweetContent').value;

        // Validate tweet content
        if (!tweetContent) {
            console.error("Tweet content is required.");
            return;
        }
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

