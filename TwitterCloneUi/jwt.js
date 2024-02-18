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
        const jwtToken = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        var postArr = new Array();

        const usernameURL = `/api/v1/users/${username}/following`;
        const postURL = "/api/v1/posts";

        const response = await fetch(postURL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();

            for (var post of data){
                postArr.push(post);
            }
            console.log("Step1:", data);
        } else {
            console.error("Error loading tweets:", response.status, response.statusText);
        }

        postArr.sort((a, b) => {
            let compareA = new Date(a.dateTimePosted),
                compareB = new Date(b.dateTimePosted);
            return compareB - compareA;
        });
        console.log("Sorted Posts:", postArr);

        const container = document.getElementById("container");
        container.innerHTML = ""; 

        postArr.forEach(postContent => {
            var like_status = "like";
            for(let x of postContent.likes){
                if(username == x.toString()){
                    like_status = "liked";
                    break;
                }
            }
            const post = document.createElement("div");
            post.classList.add("post");
        
            post.innerHTML = `
<<<<<<< HEAD
                <div class="user-profile-container">
                    <p class="user-profile">${postContent.postedBy}</p>
                </div>
        
                <div class="post-content-container">
                    <p class="post-content">${postContent.content}</p>
                    <p class="post-time">${new Date(postContent.dateTimePosted).toLocaleString()}</p>
                </div>
        
                <div class="button-container">
                    <button onclick="likePost('${postContent.id}')" class="btn"><i class="fas fa-heart"></i></button>
                    <button onclick="Toggle3()" class="btn"><i class="fab fa-gratipay"></i></button>
                </div>
            `;
        
=======
            <div style="margin-bottom: 20px;"></div>
            <div style="background: darkgrey; padding: 30px; border-radius: 10px; margin-right: 20px;  height: 30px;
            display: flex; flex-direction: row; margin-top: 20px; max-width: 100%; align-items: center;">
            <div id="user-profile">
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
                <button onclick="likePost('${postContent.postId}','${like_status}')" id="btnh1" class="btn"><i class="fas fa-heart"></i></button>    
                <button onclick="Toggle3()" id="btnh3" class="btn"><i class="fab fa-gratipay"></i></button>
            </div>
        </div>`;
>>>>>>> 5c1453c20294c9abaf88fba3274638f543c5e60b
            container.appendChild(post);
        });
        
        
    } catch (error) {
        console.error("Error loading tweets:", error.message);
    }
}

async function postTweet() {
    try {
        const tweetContent = document.getElementById('tweetContent').value;

        if (!tweetContent) {
            console.error("Tweet content is required.");
            return;
        }

        const jwtToken = localStorage.getItem('token');

        const response = await fetch("/api/v1/posts", {
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
            console.log('Tweet posted successfully');
            document.getElementById('tweetContent').value = "";
            loadTweets();
        } else {
            console.error("Error posting tweet:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error posting tweet:", error.message);
    }
}

async function likePost(id,likeS){
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');
    let body = "like";

    const likeURL = `/api/v1/posts/${id}`;

    if(likeS == "liked"){
         body = "unlike";
    }
    const patch_like = await fetch(likeURL,{
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({action: body})
    })
    if(patch_like.ok){
        loadTweets();
    }
    else{
        console.error("Unable to Patch",error.status);
    }
}

function logout() {
    try {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Error during logout:", error.message);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadUserProfile();
});

async function loadUserProfile() {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    console.log("Current User:", username);

    // Display the username in the profile header
    const profileHeaderText = document.querySelector(".profile__headerUsername");
    if (profileHeaderText) {
        profileHeaderText.textContent = username;
    }

    // Load and display posts
    loadPosts();
}

async function loadPosts() {
    try {
        const jwtToken = localStorage.getItem('token');
        const username = localStorage.getItem('username');

        const postURL = `/api/v1/posts/user/${username}`;

        const response = await fetch(postURL, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();

            const postContainer = document.getElementById("postProfileContainer");
            postContainer.innerHTML = "";

            data.forEach(postContent => {
                const post = document.createElement("div");
                post.classList.add("postProfileItem");

                // Customize the post structure as needed
                post.innerHTML = `
                    <p class="post-content">${postContent.content}</p>
                    <p class="post-time">${new Date(postContent.dateTimePosted).toLocaleString()}</p>
                    <!-- Add more details as needed -->

                `;

                postContainer.appendChild(post);
            });

        } else {
            console.error("Error loading posts:", response.status, response.statusText);
        }
    } catch (error) {
        console.error("Error loading posts:", error.message);
    }
}