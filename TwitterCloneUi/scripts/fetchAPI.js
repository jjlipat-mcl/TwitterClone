import likePost from './utils/likeUtils.js';

export async function postCreateUser(formObject) {
    let username = formObject.username;
    let password = formObject.password;
  
    const res = await fetch("/api/v1/auth/register", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
        window.location.replace("index.html");
        return true;
    } else {
        return false;
    }
}

  export async function postLogIn(formObject) {
    let username = formObject.username;
    let password = formObject.password;
  
    const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    })
    if(res.ok){
        console.log('successful')
        const userToken = await res.text();
        console.log(`User token: ${userToken}`);
        localStorage.setItem("token", userToken)
        localStorage.setItem("user", username)
        console.log(localStorage)
        window.location.replace("home.html");
        return true;
    } else {
        console.log('login fails')
        return false;
    }
  }

export let sendToken = {
  token: localStorage.getItem("token")
};

export let getCurrentUser = {
  username: localStorage.getItem("user")
}
  export async function postCreatePost(writePostSelector) {
    let post = document.querySelector(writePostSelector).value;
    let token = localStorage.getItem("token");

    const res = await fetch('/api/v1/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            "content": post
        })
    });

    if (res.ok) {
        console.log('successful');
    } else {
        console.log('failed');
    }
}

export async function getPosts() {
  let token = localStorage.getItem("token");

  try {
    const res = await fetch('/api/v1/posts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch posts');
    }

    const data = await res.json();

    data.sort((a, b) => new Date(a.dateTimePosted) - new Date(b.dateTimePosted));

    const postContents = data.map(post => post.content);
    clearTrends();
    getUserTrends(postContents);

    const postsFeedContainer = document.querySelector(".posts-feed");
    postsFeedContainer.innerHTML = '';
    const postDetailsArray = [];

    data.forEach(post => {
      const postCard = createPostElement(post.postedBy, post.postId, post.content, post.dateTimePosted, post.dateTimePosted, post.dateTimePosted, post.dateTimePosted, post.dateTimePosted);
      const postDetails = {
        postId: post.postId,
        likes: post.likes
      }
      postDetailsArray.push(postDetails);
      postsFeedContainer.prepend(postCard);
      likePost('.feed-card .like-btn', postDetailsArray);
      // retainLike(postDetailsArray)
    });
  } catch (error) {
    console.error('Error occurred while fetching posts:', error);
  }
}


  
  async function getUserTrends(userPosts) {
    const trendCard = document.getElementById('trending-card');
    const hashtagCounts = {};
  
    userPosts.forEach(post => {
      if (SingleWordHashtag(post)) {
        const hashtags = HashtagsFromPost(post);
  
        hashtags.forEach(hashtag => {
          const normalizedHashtag = hashtag.substring(1);
          hashtagCounts[normalizedHashtag] = (hashtagCounts[normalizedHashtag] || 0) + 1;
        });
      }
    });
  
    const sortedHashtags = Object.keys(hashtagCounts).sort((a, b) => {
      const countComparison = hashtagCounts[b] - hashtagCounts[a];
      if (countComparison === 0) {
        return a.localeCompare(b);
      }
      return countComparison;
    });
  

    const numberOfTrendsToDisplay = Math.min(10, sortedHashtags.length);
    for (let i = 0; i < numberOfTrendsToDisplay; i++) {
      const hashtag = sortedHashtags[i];
      const trendItem = document.createElement("div");
      trendItem.className = "trend-item";
      trendItem.textContent = `#${hashtag}`;
      trendItem.classList.add('secondary')
      trendCard.appendChild(trendItem);
    }
    console.log(hashtagCounts);
  }

  function clearTrends() {
    const trendCard = document.getElementById('trending-card');
    const trendItems = document.querySelectorAll('.trend-item');
  
    trendItems.forEach(item => {
      trendCard.removeChild(item);
    });
  }
  
  function HashtagsFromPost(post) {
    const regex = /#\w+/g;
    const hashtags = post.match(regex);
    return hashtags;
  }
  
  function SingleWordHashtag(post) {
    const regex = /#\w+/g;
    return regex.test(post);
  }
  
const createPostElement = (username, postId, postText, timestamp1, timestamp2, timestamp3, timestamp4, timestamp5) => {
  const postDiv = document.createElement("div");
  postDiv.className = "feed-card";
  const hPostText = postText.replace(/#(\w+)/g, '<span class="secondary">#$1</span>');
  const year = timestamp1.substring(0,4);
  const minute = timestamp2.substring(14, 16);
  let dayornight = ''; 
  let day = (parseInt(timestamp5.substring(8, 10)));

  let hour = parseInt(timestamp3.substring(11, 13)) + 8;
  if (hour >= 24) {
    hour -= 24;
    day += 1;
    if (hour < 12) {
      dayornight = 'AM';
    }
    else if (hour >= 12) {
      dayornight = 'PM';
    }
  }
  else if (hour < 24) {
    if (hour < 12) {
      dayornight = 'AM';
    }
    else if (hour > 13) {
      hour -= 12;
      dayornight = 'PM';
    }
  }
   
  let month = parseInt(timestamp4.substring (5, 7));
  switch (month) {
    case 1:
      month = 'JAN'; break;
    case 2:
      month = 'FEB'; break;
    case 3:
      month = 'MAR'; break;
    case 4:
      month = 'APR'; break;
    case 5:
      month = 'MAY'; break;
    case 6:
      month = 'JUN'; break;
    case 7:
      month = 'JUL'; break;
    case 8:
      month = 'AUG'; break;
    case 9:
      month = 'SEP'; break;
    case 10:
      month = 'OCT'; break; 
    case 11:
      month = 'NOV'; break;
    case 12:
      month = 'DEC'; break;
  }


  postDiv.innerHTML = `
    <div class="profile-photo">
      <img src="./images/profile-photo-1.png" alt="Profile Photo">
    </div>
    <div class="post-container">
      <div class="user">
        <h5>${username} <span class="handle muted">@${username.toLowerCase()}</span></h5>
        <p class="primary">${hour}:${minute} ${dayornight} · ${month} ${day}, ${year}</p>
      </div>
      <div class="post-content">${hPostText}</div>
      <div class="like-btn">
        <input type="checkbox" class='likeButton' id='${postId}'/>
        <div class="like-btn-content">
          <i class="ri-heart-line"></i>
          <label class="likeButtonLabel">Like Post</label>
        </div>
      </div>
    </div>
    <div class="post-logo">
      <i class="ri-chat-smile-2-line"></i>
    </div>
  `;

  return postDiv;
};

export async function likePostAPI(postId, isChecked) {
  let token = localStorage.getItem("token");
  const likeAction = isChecked ? "like" : "unlike";
  
  const res = await fetch(`/api/v1/posts/${postId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        action: likeAction
      })
  })
  if(res.ok && likeAction === 'like') {
    console.log("Post Liked")
  } else if (res.ok && likeAction === 'unlike') {
    console.log("Post Unliked")
  }  else {
    console.log("Post Like Failure")
  }
}

  export async function fetchUserList() {
    let token = localStorage.getItem("token");
    const res = await fetch("/api/v1/users", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    if(res.ok){
      const userList = await res.json();
      const randomizedUserList = shuffleArray(userList);
      displayUserList(randomizedUserList);
      
      //displayUserList(userList) // Non-Randomized - disable shuffleArray function too
      displayExplore(randomizedUserList);
    }
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  async function displayUserList(users) {
    const followDiv = document.querySelector('.suggest-follows-card');
    const userName = getCurrentUser.username;
    let displayedUsers = 0; 
    users.forEach(user => {
      if (user !== userName && displayedUsers < 3) {
        const userSuggestion = document.createElement("div");
        userSuggestion.className = "follow-container"
        const randomProfilePhotoNumber = Math.floor(Math.random() * 4) + 1;
        userSuggestion.innerHTML = `
          <div class="profile-container">
            <div class="profile-photo">
              <img src="./images/profile-photo-${randomProfilePhotoNumber}.png" alt="Profile Photo">
            </div>
            <div class="handle">
              <h5>${user}</h5> 
              <p class="muted">@${user.toLowerCase()}</p> 
            </div>
          </div>
  
          <div class="btn primary-btn follow-btn">
            <input type="checkbox" class="follow-box" data-username="${user}"/>
            <div class="follow-btn-content link-1">
              <label>Follow</label>
            </div>
          </div>`;
          followCheck(userName)
          .then(followerList => {
            for (let u of followerList) {
              const checkbox = document.querySelector(`[data-username="${u}"]`);
              if (user === u) {
                if (checkbox) {
                  const followState = checkbox.closest('.btn');
                  const followLabel = checkbox.nextElementSibling.querySelector('label');
                  checkbox.checked = true;
                  console.log(u, "is checked");
                  followState.classList.add('default-btn')
                  followState.classList.remove('primary-btn')
                  followLabel.innerText = "Unfollow"
                  followDiv.removeChild(userSuggestion);
                } else {
                  console.log("can't see user: ", u)
                }
              }
            }
          })  
        followDiv.appendChild(userSuggestion);
        
        displayedUsers++;
  
        const followButton = document.querySelector('[data-username='+user+']')
  
        followButton.addEventListener('click', function () {
          const usernameToFollow = this.getAttribute('data-username');
          const followState = followButton.closest('.btn');
          const followLabel = this.nextElementSibling.querySelector('label');
          
          if (followButton.checked) {
            console.log(`Followed ${usernameToFollow} by ${userName}`);
            followUser(userName, usernameToFollow);
            followState.classList.add('default-btn');
            followState.classList.remove('primary-btn');
            followLabel.innerText = "Unfollow"
            followDiv.removeChild(userSuggestion);
          } else {
            console.log(`Unfollowed ${usernameToFollow} by ${userName}`);
            unfollowUser(userName, usernameToFollow);
            followState.classList.remove('default-btn');
            followState.classList.add('primary-btn');
            followLabel.innerText = "Follow"
          }
        }); 
      }
    });
    const showMore = document.createElement('p');
    showMore.classList.add('footnote', 'link-2');
    showMore.innerHTML = `
    <a href="./search.html" class="link-1">Show more<span><i class="ri-arrow-right-line"></i></span></a>
    `
    followDiv.appendChild(showMore);
  }

  
  async function followUser(user,following) { 
    let token = localStorage.getItem("token");
    const res = await fetch("/api/v1/users/"+user+"/following/"+following, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    displayFollowing(); 
  }
  
  async function unfollowUser(user,following) { 
    let token = localStorage.getItem("token");
    const res = await fetch("/api/v1/users/"+user+"/following/"+following, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    displayFollowing();
  }
  
  async function followCheck(user) {
    let token = localStorage.getItem("token");
    const res = await fetch("/api/v1/users/"+user+"/following/", {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    })
    let data = await res.json();
    return data;
  }

  export async function displayFollowing() {
    const user = getCurrentUser.username;
    const followingData = await followCheck(user);
    const numberOfFollowing = followingData.length;
    
    const followingCount = document.querySelector('.following-count');
    followingCount.innerHTML = `${numberOfFollowing} <span class="muted">Following</span>`;
  }

  export async function displayExplore(users) {
    const userGrid = document.querySelector('.users-grid');
    userGrid.innerHTML = '';

    const userName = getCurrentUser.username;

    users.forEach(user => {
      followCheck(userName)
        .then(followerList => {
          for (let u of followerList) {
            if (user === u) {
              const checkbox = document.querySelector(`[data-username="${u}"]`);
              if (checkbox) {
                const followState = checkbox.closest('.btn');
                const followLabel = checkbox.nextElementSibling.querySelector('label');
                checkbox.checked = true;
                console.log(u, "is checked");
                followState.classList.add('default-btn')
                followState.classList.remove('primary-btn')
                followLabel.innerText = "Unfollow"
              } else {
                console.log("can't see user: ", u)
              }
            }
          }
        })


      if (user !== userName) {
        const userProfile = document.createElement('div');
        userProfile.classList.add('user-profile-card');
        const randomCoverPhotoNumber = Math.floor(Math.random() * 5) + 1;
        const randomProfilePhotoNumber = Math.floor(Math.random() * 4) + 1;

        userProfile.innerHTML = `<div class="cover-container">
          <img class="cover-photo" src="./images/background/cover-photo-${randomCoverPhotoNumber}.webp" alt="Cover Photo">
          <div class="profile-photo">
            <img src="./images/profile-photo-${randomProfilePhotoNumber}.png" alt="Profile Photo">
          </div>
        </div>
        <div class="profile-container">
          <div class="handle">
            <h5 >`+user+`</h5> 
            <p class="muted">@`+user+`</p> 
          </div> 
          <div class="btn primary-btn follow-btn">
            <input type="checkbox" class="follow-box" data-username="${user}"/>
            <div class="follow-btn-content link-1">
              <label>Follow</label>
            </div>
          </div>`
        userGrid.appendChild(userProfile);
        const followButton = document.querySelector('[data-username='+user+']')
  
        followButton.addEventListener('click', function () {
          const usernameToFollow = this.getAttribute('data-username');
          const followState = followButton.closest('.btn');
          const followLabel = this.nextElementSibling.querySelector('label');
          
          if (followButton.checked) {
            console.log(`Followed ${usernameToFollow} by ${userName}`);
            followUser(userName, usernameToFollow);
            followState.classList.add('default-btn');
            followState.classList.remove('primary-btn');
            followLabel.innerText = "Unfollow"
            
          } else {
            console.log(`Unfollowed ${usernameToFollow} by ${userName}`);
            unfollowUser(userName, usernameToFollow);
            followState.classList.remove('default-btn');
            followState.classList.add('primary-btn');
            followLabel.innerText = "Follow"
          }
        })
      }
    })  
  }

  function filterUserProfiles(query) {
    const userCards = document.querySelectorAll('.user-profile-card');
    userCards.forEach(card => {
        const username = card.querySelector('h5').textContent.toLowerCase();
        if (username.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', () => {
        const searchQuery = searchInput.value.trim();
        filterUserProfiles(searchQuery);
    });
});