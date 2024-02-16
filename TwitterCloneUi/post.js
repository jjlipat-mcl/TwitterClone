let sidebarVisible = window.innerWidth > 768;

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebarVisible = !sidebarVisible;
    if (sidebarVisible) {
        sidebar.style.display = 'block';
    } else {
        sidebar.style.display = 'none';
    }
}

function navigateToProfile() {
    window.location.href = "ProfilePage/index.html";
}

function navigateToExplore() {
    window.location.href = "ExplorePage/explore.html";
}
function logOut() {
    window.location.href = "login.html";
}

function heartClick() {
    const heart = document.querySelector('.heart');
    heart.classList.toggle('heart-filled');
}

window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
        const sidebar = document.querySelector('.sidebar');
        sidebar.style.display = 'block';
        sidebarVisible = true;
    }
});    

const currentName = localStorage.getItem("currentName")
const currenttoken = localStorage.getItem("currentToken")
const currentusername = localStorage.getItem("currentUser")
console.log(currentName)
console.log(currenttoken)
console.log(currentusername)

var following = [];
var followingCount = 0;
window.onload = async () => {
    const posts = await getPosts()
    renderPosts(posts)
    displayExistingUsers();
    renderFollowingPosts();
}

async function getPosts() {
    const response = await fetch("http://localhost:3000/api/v1/posts", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${currenttoken}`
        }
    });
    const posts = await response.json();
    return posts
}

async function NewPost() {
    var getNewPost = document.getElementById('userPost').value;

    try {
        const res = await fetch("http://localhost:3000/api/v1/posts", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${currenttoken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: getNewPost
            })
        });

        console.log("Awaiting newpost response: ", await res.text());

        // Show alert for successful post
        alert("New post successfully posted!");

        // Clear the text in the tweetbox
        document.getElementById('userPost').value = null;
        tweetButton.disabled = true;

        // After posting, refresh the posts
        await renderPosts();
    } catch (error) {
        console.error('Error posting:', error);
    }
}

async function ToggleLikePost(ID, isLiked) {
    console.log("ToggleLikePost was called");
    try {
        const currentToken = localStorage.getItem("currentToken");
        const response = await fetch(`http://localhost:3000/api/v1/posts/${ID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentToken}`,
            },
            body: JSON.stringify({ action: isLiked ? 'unlike' : 'like' }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error(`Error ${isLiked ? 'unliking' : 'liking'} post: ${errorData.message}`);
            return;
        }

        console.log(`Post ${isLiked ? 'unliked' : 'liked'} successfully!`);
        
        await renderPosts();
    } catch (error) {
        console.error(`Error ${isLiked ? 'unliking' : 'liking'} post:, error`);
    }
}

async function renderPosts() {
    console.log("Display Posts was called")
    console.log("User token: "+currenttoken)
    const postsContainer = document.querySelector('.feed');
    
    try {
        const res = await fetch("http://localhost:3000/api/v1/posts", {
            headers: {
                'Authorization': `Bearer ${currenttoken}`
            }
        });

        if (!res.ok) {
            console.error(`Error fetching posts: ${res.status} ${res.statusText}`);
            // Handle the error here, for example, display an error message to the user.
            return;
        }

        const postsData = await res.json();

        // Sort postsData based on the dateTimePosted in descending order (latest first)
        postsData.sort((a, b) => new Date(b.dateTimePosted) - new Date(a.dateTimePosted));

        const existingPosts = postsContainer.querySelectorAll('.post');
        existingPosts.forEach(post => {
            postsContainer.removeChild(post);
        });

        postsData.forEach(post => {
            const postId = post.postId;
            console.log("This is the ID:" + postId);
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            const isLiked = post.likes.includes(currentusername);

            const postAvatar = document.createElement('div');
            postAvatar.classList.add('post__avatar');
            const avatarImg = document.createElement('img');
            avatarImg.src = "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png";
            postAvatar.appendChild(avatarImg);
            postElement.appendChild(postAvatar);

            const postBody = document.createElement('div');
            postBody.classList.add('post__body');

            const postHeader = document.createElement('div');
            postHeader.classList.add('post__header');

            const postHeaderText = document.createElement('div');
            postHeaderText.classList.add('post__headerText');
            const username = document.createElement('h3');
            username.textContent = post.postedBy;
            username.style.display = 'inline';
            username.style.marginRight = '10px';
            username.style.fontSize = '18px';
            const postHeaderSpecial = document.createElement('span');
            postHeaderSpecial.classList.add('post__headerSpecial');
            const badge = document.createElement('span');
            const handle = document.createElement('span');
            handle.textContent = "@"+post.postedBy;
            handle.style.fontSize = '18px';
            postHeaderSpecial.appendChild(badge);
            postHeaderText.appendChild(username);
            // postHeaderSpecial.appendChild(handle);
            postHeaderText.appendChild(postHeaderSpecial);
            postHeader.appendChild(postHeaderText);
            
            // Add date posted
            const datePosted = document.createElement('div');
            datePosted.classList.add('post__date');
            const formattedDate = new Date(post.dateTimePosted).toLocaleString();
            datePosted.textContent = formattedDate;
            postHeader.appendChild(datePosted);

            const postHeaderDescription = document.createElement('div');
            postHeaderDescription.classList.add('post__headerDescription');
            const description = document.createElement('p');
            description.textContent = post.content;
            description.style.fontSize = '18px';
            description.style.marginTop = '15px';
            description.style.marginBottom = '15px';
            postHeaderDescription.appendChild(description);
            postHeader.appendChild(postHeaderDescription);
            postBody.appendChild(postHeader);

            // const postImage = document.createElement('img');
            // postImage.src = post.image; // Assuming you have an image property in your post object
            // postBody.appendChild(postImage);

            const postFooter = document.createElement('div');
            postFooter.classList.add('post__footer');
            const repeatIcon = document.createElement('span');
            repeatIcon.classList.add('material-symbols-outlined'); 
            repeatIcon.textContent = "repeat";
            postFooter.appendChild(repeatIcon);
            const heartButton = document.createElement('button');
            heartButton.classList.add('heart');
            if (isLiked) {
                heartButton.classList.toggle('heart-filled');
            }
            heartButton.onclick = async () => ToggleLikePost(post.postId, isLiked);
            const heartIcon = document.createElement('i');
            heartIcon.classList.add('material-symbols-outlined');
            heartIcon.textContent = "favorite_border";
            heartButton.appendChild(heartIcon);
            postFooter.appendChild(heartButton);

            const likeCount = document.createElement('span');
            likeCount.textContent = post.likes.length.toString();
            likeCount.style.marginLeft = '-170px';
            likeCount.style.marginTop = '4px';
            postFooter.appendChild(likeCount)

            const publishIcon = document.createElement('span');
            publishIcon.classList.add('material-symbols-outlined');
            publishIcon.textContent = "publish";
            postFooter.appendChild(publishIcon);
            postBody.appendChild(postFooter);

            postElement.appendChild(postBody);

            postsContainer.appendChild(postElement);
        });
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}




function checkInput() {
    var textarea = document.getElementById('userPost');
    var tweetButton = document.getElementById('tweetButton');
    var counter = document.getElementById('counter');

    var remainCharacters = 255 - textarea.value.length;
    counter.textContent = remainCharacters;

    if (remainCharacters < 0 || textarea.value.length === 0 || textarea.value.length > 255) {
        tweetButton.disabled = true;
    } else {
        tweetButton.disabled = false;
    }
}


/* FOLLOWING SECTION */

async function displayExistingUsers() {
    console.log("displayExistingUsers called");
    const usersContainer = document.querySelector('.follow__container');
    usersContainer.innerHTML = ""; // Clear previous content

    // Retrieve existing users from local storage
    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    // Retrieve current user's information
    const currentName = localStorage.getItem("currentName");
    const currentUser = localStorage.getItem("currentUser");

    try {
        Object.entries(existingUsers).forEach(([username, user]) => {
            // Skip rendering for the current user
            if (username === currentUser) {
                return;
            }

            const profileContainer = document.createElement('div');
            profileContainer.classList.add('profile_container');

            const profile = document.createElement('div');
            profile.classList.add('profile');

            const userImage = document.createElement('img');
            userImage.src = 'https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png'; // Update with the actual image source
            userImage.classList.add('user-follow-pfp');
            profile.appendChild(userImage);

            const followUserDiv = document.createElement('div');
            followUserDiv.classList.add('followuser');

            const nameParagraph = document.createElement('p');
            nameParagraph.textContent = user.name; // Assuming 'name' is the property name
            followUserDiv.appendChild(nameParagraph);

            const usernameParagraph = document.createElement('p');
            usernameParagraph.textContent = `@${username}`;
            followUserDiv.appendChild(usernameParagraph);

            profile.appendChild(followUserDiv);


            // Create a unique follow button for each user
            const followButton = document.createElement('button');
            followButton.classList.add('followButton');
            followButton.textContent = 'Follow';
            followButton.onclick = () => {
                followUser(username); // Pass the username to followUser
                followButton.disabled = true;
                followButton.textContent = 'Followed';
                followButton.style.backgroundColor = 'white'; 
                followButton.style.color = 'black'; 
                
            };
            profile.appendChild(followButton);

            

            

            profileContainer.appendChild(profile);
            usersContainer.appendChild(profileContainer);
        });
    } catch (error) {
        console.error('Error parsing existing users from local storage:', error);
    }
}

async function followUser(toFollow) {
    try {
        const currentToken = localStorage.getItem("currentToken");
        const currentUser = localStorage.getItem("currentUser");

        if (following.includes(toFollow)) {
            console.log("Already Following or cannot be followed");
            alert("You are already following this person");
        } else {
            const res = await fetch(`http://localhost:3000/api/v1/users/${currentUser}/following/${toFollow}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                }
            });

            if (res.ok) {
                console.log(`Now following: ${toFollow}`);
                alert(`You are now following: ${toFollow}`);
                following.push(toFollow); // Add the followed user to the 'following' array
                followingCount++;

                // Save followed users in local storage
                localStorage.setItem('followingUsers', JSON.stringify(following));

                // Call renderPosts() to render posts after following the user
                await renderPosts();

                
            } else {
                const errorMessage = await res.text();
                console.error(`Error following user: ${errorMessage}`);
            }
        }
    } catch (error) {
        console.error('Error following user:', error);
    }
}

