//let sidebarVisible = window.innerWidth > 768;

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
    window.location.href = "../ExplorePage/explore.html";
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

const currentName = localStorage.getItem("currentName");
const currenttoken = localStorage.getItem("currentToken");
const currentusername = localStorage.getItem("currentUser");

console.log(currentName);
console.log(currenttoken);
console.log(currentusername);

window.onload = async () => {
    const posts = await getPosts();
    renderPosts(posts);
}

async function getPosts() {
    const response = await fetch("http://localhost:3000/api/v1/posts", {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${currenttoken}`
        }
    });
    const posts = await response.json();
    return posts;
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
    console.log("Display Posts was called");
    console.log("User token: " + currenttoken);
    const postsContainer = document.querySelector('.right__col'); // Select the container for posts
    const nameElement = document.getElementById("name");
    nameElement.textContent = currentName;
    const usernameElement = document.getElementById("username");
    usernameElement.textContent = "@"+currentusername;
    try {
        const res = await fetch(`http://localhost:3000/api/v1/posts?username=${currentusername}`, {
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
        console.log(postsData)
        // Sort postsData based on the dateTimePosted in descending order (latest first)
        postsData.sort((a, b) => new Date(b.dateTimePosted) - new Date(a.dateTimePosted));
        
        // Clear existing posts
        postsContainer.innerHTML = '';

        postsData.forEach(post => {
            const postId = post.postId;
            console.log("This is the ID:" + postId);
            const postElement = document.createElement('div');
            postElement.classList.add('right__col');

            // Avatar
            const postAvatar = document.createElement('div');
            postAvatar.classList.add('post__avatar');
            postAvatar.style.marginTop = '50px';
            const avatarImg = document.createElement('img');
            avatarImg.src = "https://i.pinimg.com/originals/a6/58/32/a65832155622ac173337874f02b218fb.png";
            postAvatar.appendChild(avatarImg);
            postElement.appendChild(postAvatar);

            // Header
            const postHeaderText = document.createElement('div');
            postHeaderText.classList.add('post__headerText');
            const username = document.createElement('h3');
            username.textContent = currentName;
            username.style.display = 'inline';
            username.style.marginRight = '10px';
            username.style.fontSize = '18px';
            const handle = document.createElement('span');
            handle.textContent = "@"+currentusername;
            postHeaderText.appendChild(username);
            postHeaderText.appendChild(handle);
            postElement.appendChild(postHeaderText);

            

            // Description
            const postHeaderDescription = document.createElement('div');
            postHeaderDescription.classList.add('post__headerDescription');
            const description = document.createElement('p');
            description.textContent = post.content;
            postHeaderDescription.appendChild(description);
            postElement.appendChild(postHeaderDescription);

            //date
            const datePosted = document.createElement('div');
            datePosted.classList.add('post__date');
            const formattedDate = new Date(post.dateTimePosted).toLocaleString();
            datePosted.textContent = formattedDate;
            postElement.appendChild(datePosted);
            
            // Footer
            // const postFooter = document.createElement('div');
            // postFooter.classList.add('post__footer');
            // const repeatIcon = document.createElement('span');
            // repeatIcon.classList.add('material-symbols-outlined'); 
            // repeatIcon.textContent = "repeat";
            // const heartIcon = document.createElement('span');
            // heartIcon.classList.add('material-symbols-outlined'); 
            // heartIcon.textContent = "favorite_border";
            // heartIcon.addEventListener('click', () => ToggleLikePost(postId));
            // const publishIcon = document.createElement('span');
            // publishIcon.classList.add('material-symbols-outlined'); 
            // publishIcon.textContent = "publish";
            // postFooter.appendChild(repeatIcon);
            // postFooter.appendChild(heartIcon);
            // postFooter.appendChild(publishIcon);
            // postElement.appendChild(postFooter);

            // Append the post element to the posts container
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
