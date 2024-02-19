export default function likePost(likeBtnSelector, postDetails) {
  const likeBtns = document.querySelectorAll(likeBtnSelector);
  const currentUser = localStorage.getItem("user");

  likeBtns.forEach(function(likeBtn) {
    const checkbox = likeBtn.querySelector('input[type="checkbox"]');
    const heartIcon = likeBtn.querySelector('.like-btn-content i');
    const label = likeBtn.querySelector('.like-btn-content label');

    const postId = checkbox.id;

    for (let i = 0; i < postDetails.length; i++) {
      if(postDetails[i].postId === postId  && postDetails[i].likes.includes(currentUser)) {
        checkbox.checked = true;
        likeBtn.classList.add('like-effect');

        heartIcon.classList.remove('ri-heart-line');
        heartIcon.classList.add('ri-heart-fill');
        label.textContent = 'Unlike Post';
      }
    }

    checkbox.addEventListener('change', function() {
      if (this.checked) {
        likeBtn.classList.add('like-effect');

        heartIcon.classList.remove('ri-heart-line');
        heartIcon.classList.add('ri-heart-fill');
        label.textContent = 'Unlike Post';
      } else {
        likeBtn.classList.add('like-effect');

        heartIcon.classList.remove('ri-heart-fill');
        heartIcon.classList.add('ri-heart-line');
        label.textContent = 'Like Post';  
      }
    });

    likeBtn.addEventListener('animationend', function() {
      likeBtn.classList.remove('like-effect');
    });
  });
}

// export function retainLike(postDetails) {
//   // console.log(postDetails[2])
//   document.addEventListener('DOMContentLoaded', function() {
//     const currentUser = localStorage.getItem("user");
//     const likeButton = document.querySelector('.posts-feed') // Selects the parent element that contains the like button

//     console.log(likeButton)

//     likeButton.forEach(element => {
//       console.log("wow")
//     });
//     likeButton.addEventListener('DOMContentLoaded', function(event) {
//       console.log("wow")
//       if (event.target.matches('.likeButton')) {
      
//         const postId = event.target.id;
//         const isChecked = event.target.checked;

//         for (let i = 0; i < postDetails.length; i++) {
//           if(postDetails[i].postId === postId) {
//             console.log("wow")
//           }
//         }
//       }
//   });
// });
