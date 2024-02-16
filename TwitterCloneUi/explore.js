//page load function
//follow function for follow button

document.addEventListener('DOMContentLoaded', function () {
    // Fetch tweets when the page loads
    loadPosts();
});

async function loadPosts() {
    //1.get all users
    //2.get all posts from all users
    //3.put all posts into an array
    //4.sort all post into latest
    //5.display to Frontend

    const userListURL = "http://localhost:3000/api/v1/users";
    const postListURL = "http://localhost:3000/api/v1/posts?username=";
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    console.log(username);

    var userList = [];
    var postList = [];

    //Debug. Will be removed soon.
    console.log("Token: ",token);

    //Step1.get all users
    const get_users = await fetch(userListURL,{
         method: "GET",
         headers: {
              "Authorization": `Bearer ${token}`,
         }
    })

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
    //Step2
    for (const element of userList){
         const uPost = await fetch(`${postListURL}${element}`, {
              method: "GET",
              headers: {
                   "Authorization": `Bearer ${token}`,
              }
         })//Step3
         if(uPost.ok){
              const uData = await uPost.json();
              for (const post1 of uData){
                   postList.push(post1);
              }
         }
         else{
              console.error("Error loading tweets:", response.status, response.statusText);
         }
    }//Step4
    postList.sort((a,b) => {
         let compareA = new Date(a.dateTimePosted), compareB = new Date(b.dateTimePosted);
         return compareB - compareA;
    });
    console.log(postList);

    //Use this for frontend
    const container = document.getElementById("container");
    postList.forEach(postContent => {
         const post = document.createElement("div");
         post.classList.add("post");
         post.innerHTML = `
         <div style="background: grey; padding: 60px; border-radius: 100px; margin-right: 20px; width: 20px; height: 20px;
              display: flex; flex-direction: row; margin-top: 10px;">
              <div id="user-profile">
                   <!-- You can include user profile information here -->
                   <p>${postContent.postedBy}</p>
              </div>
         </div>
         <div style="background-color: darkgrey; padding: 35px; border-radius: 20px; width: 390px; font-size: 16px; 
              display:flex; flex-direction: column; margin-top: 10px; overflow: hidden; word-wrap: break-word;">
              <div class="post-content" id="post-area">
                   <p style="color: dark-green; font-size: 14px; font-weight: 600px; display: flex; flex-align: start; position: relative; top: -10px; left: -10px; "
                   <p>${postContent.content}</p>
              </div>
         </div>
         `;//i dont know how to connect a dynamically made button to a script
         /*container.appendChild(post); 
         const followB = document.createElement("button");
         followB.setAttribute("type","submit");
         followB.innerHTML = "Follow";
         followB.addEventListener('submit',follow_user());
         const post_div = document.getElementById("post-area");
         post_div.appendChild(followB);*/
    });
};


async function follow_user() {
    const poster = "#"; //i dont know a way to get from a tweet div
    const username = localStorage.getItem('username');
    const token = localStorage.getItem('token');

    const follow_url = `http://localhost:3000/api/v1/users/${username}/following/${poster}`;

    const post_follow = await fetch(follow_url, {
         method: "POST",
         headers: {
              "Authorization": `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
           }
    })
    if (post_follow.ok){
         location.reload();
    }
}
