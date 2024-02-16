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
        // 1. Get followed users
        // 2. Get user posts
        // 3. Get posts of each followed user
        // 4. Concatenate all posts into an array
        // 5. Sort all posts based on the time of posting
        // 6. Display to Frontend

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

        // Step 1: Get followed users
        if (get_follower.ok) {
            users = await get_follower.json();
            console.log("Users:", users);
        } else {
            console.error("Something went wrong", get_follower.status, get_follower.statusText);
        }

        // Step 2: Get own user's posts
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

            postArr = data;
        } else {
            console.error("Error loading tweets:", response.status, response.statusText);
        }

        // Step 3: Get posts of all followed users
        // Join all retrieved posts in one array
        for (const follower of users) {
            try {
                const fPost = await fetch(`${postURL}?username=${follower}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${jwtToken}`,
                    },
                });

                if (fPost.ok) {
                    const fdata = await fPost.json();
                    postArr = postArr.concat(fdata);
                    console.log("Post:", postArr);
                } else {
                    console.error("Error loading tweets:", fPost.status, fPost.statusText);
                }
            } catch (error) {
                console.error("Error loading tweets:", error.message);
            }
        }

        // Step 4: Sort all retrieved posts based on the time of posting
        // Source: https://www.javascripttutorial.net/array/javascript-sort-an-array-of-objects/
        postArr.sort((a, b) => {
            let compareA = new Date(a.dateTimePosted),
                compareB = new Date(b.dateTimePosted);
            return compareB - compareA;
        });
        console.log("All Posts:", postArr);

       
        const container = document.getElementById("container");
        container.innerHTML = ""; 

        postArr.forEach(postContent => {
            const post = document.createElement("div");
            post.classList.add("post");
            post.innerHTML = `
            <div style="margin-bottom: 20px;"></div>
            <div style="background: darkgrey; padding: 30px; border-radius: 10px; margin-right: 20px;  height: 30px;
            display: flex; flex-direction: row; margin-top: 20px; max-width: 100%; align-items: center;">
            <div id="user-profile">
                <!-- You can include user profile information here -->
                <p>${postContent.postedBy}</p>
            </div>
        </div>

        <div style="background-color: darkgrey; padding: 50px; border-radius: 20px; width: 350px; max-width: 100%; height: 150px;  
            display:flex; flex-direction: column; margin-top: 20px; overflow: hidden; word-wrap: break-word;">
            <div class="post-content">
                <p style="color: dark-green; font-weight: 600px; display: flex; flex-align: start; position: relative; top: -15px; left: -10px; 
                padding-bottom: 10px; max-width: 100%;">
                    ${postContent.content}
                </p>
            </div>
            <p class="post-time">${new Date(postContent.dateTimePosted).toLocaleString()}</p>
            <div style="background-color: none; display: flex; flex-direction: row; margin-top: 10px;">
                <Button onclick="Toggle1()" id="btnh1" class="btn"><i class="fas fa-heart"></i></Button>    
                <Button onclick="Toggle3()" id="btnh3" class="btn"><i class="fab fa-gratipay"></i></Button>
            </div>
        </div>
        
                
            `;
            container.appendChild(post);
        });
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

        // Token is retrieved from localStorage for the POST request
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
            // Handle successful tweet post
            console.log('Tweet posted successfully');

            // Clear tweet content after posting
            document.getElementById('tweetContent').value = "";

            // Reload tweets after posting
            loadTweets();
        } else {
            console.error("Error posting tweet:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error posting tweet:", error.message);
    }
}

function logout() {
    try {
        // Remove token and username from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        // Redirect to the login page or perform any other desired action
        window.location.href = 'index.html'; // Change 'login.html' to your actual login page
    } catch (error) {
        console.error("Error during logout:", error.message);
    }
}
