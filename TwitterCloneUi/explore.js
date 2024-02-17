//page load function
//follow function for follow button

document.addEventListener('DOMContentLoaded', function () {
    // Fetch tweets when the page loads
    loadPosts();
});

async function loadPosts() {
    //posts algorithm
    //1.get all registered users into an array 
    //2.remove from list- users that are already followed
    //3.retrieve all post of remaining users into an array
    //4.sort all post based on post time
    //5.display post to front end

    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    console.log("Current User:",username)

    const userListURL = "http://localhost:3000/api/v1/users";
    const followedListURL = `http://localhost:3000/api/v1/users/${username}/following`;
    const postListURL = "http://localhost:3000/api/v1/posts?username=";

    var userList = new Array();
    var exploringList = new Array();
    var postList = new Array();

    //Step1.get all users, that is not the current user, into an array
    const get_users = await fetch(userListURL,{
         method: "GET",
         headers: {
              "Authorization": `Bearer ${token}`,
         }
    })
    //prevents current user's post from being displayed
    if (get_users.ok){
         const user = await get_users.json();
         console.log(user);
         for (let x of user){
              if(!(x.toString() === username)){
                   userList.push(x);
              }
         }
    }else {
         console.error("Error getting users:", response.status, response.statusText);
    }
    console.log(userList);

    //Step2.remove from list- users already followed
    //retrieve followed users
    const get_followed = await fetch(followedListURL,{
          method: "GET",
          headers: {
               "Authorization": `Bearer ${token}`,
          }
    })
    
    if(get_followed.ok){
          const followed = await get_followed.json();

          //compare the user array and the followed array to check for which users not to display.
          for(var user of userList){
               let bool_notFollowed = true; //used as a gate for followed users

               for(var followee of followed){
                    //compare values of two arrays
                    if(user.toString() === followee.toString()){
                         bool_notFollowed = false;
                         break;
                    }
               }

               if(bool_notFollowed){
                    exploringList.push(user);
               }
          }
    }
    else{
     console.error("Something went wrong:", response.status, response.statusText);
    }

    //Step3.retrieve all posts of remaining users
    for (const element of exploringList){
         const uPost = await fetch(`${postListURL}${element}`, {
              method: "GET",
              headers: {
                   "Authorization": `Bearer ${token}`,
              }
         })
         if(uPost.ok){
              const uData = await uPost.json();
              for (const post1 of uData){
                   postList.push(post1);
              }
         }
         else{
              console.error("Error loading tweets:", response.status, response.statusText);
         }
    }//Step4.sort all post based on post time
    postList.sort((a,b) => {
         let compareA = new Date(a.dateTimePosted), compareB = new Date(b.dateTimePosted);
         return compareB - compareA;
    });
    console.log(postList);

    //Use this for frontend
     const container = document.getElementById("container");
     container.innerHTML = "";

     postList.forEach(postContent => {
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

     <div style="background-color: darkgrey; padding: 50px; border-radius: 20px; width: 400px; max-width: 100%; height: 150px; font-size: 13px; 
          display:flex; flex-direction: column; margin-top: 20px; overflow: hidden; word-wrap: break-word;">
          <div class="post-content">
               <p style="color: dark-green; font-weight: 600px; display: flex; flex-align: start; position: relative; top: -15px; left: -10px; 
               padding-bottom: 10px; max-width: 100%;">
               ${postContent.content}
               </p>
          </div>
          <p class="post-time">${new Date(postContent.dateTimePosted).toLocaleString()}</p>
          <div style="background-color: none; display: flex; flex-direction: row; margin-top: 10px;">
               <button onclick="likePost('${postContent.id}')" id="btnh1" class="btn"><i class="fas fa-heart"></i></button>    
               <button onclick="follow_user('${postContent.postedBy}')" id="btnh3" class="btn"><i class="fab fa-gratipay"></i></button>
          </div>
     </div>
               
          `;
          container.appendChild(post);
     });
};


async function follow_user(name) {
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    const follow_url = `http://localhost:3000/api/v1/users/${username}/following/${name}`;

    const post_follow = await fetch(follow_url, {
         method: "POST",
         headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
           }
    })
    if (post_follow.ok){
         location.reload();
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
