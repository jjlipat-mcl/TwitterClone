import { postCreatePost, getPosts, fetchUserList, sendToken, getCurrentUser, likePostAPI, displayFollowing, displayExplore } from './fetchAPI.js';

const validateToken = () => {
  console.log(sendToken);
  if(sendToken.token === null) {
    window.location.replace("index.html")
  } else {
    console.log("There is a token");
  }
}

let displayCurrentUserHome = () => {
  let username = getCurrentUser.username;
  let usernameHolder = document.getElementById('username');
  console.log(usernameHolder + '   ' + username)
  usernameHolder.innerText = username;

  let smallUsernameHolder = document.getElementById('@username');
  smallUsernameHolder.innerText = '@'+username.toLowerCase();
}

let displayCurrentUserProfile = () => {
  let username = getCurrentUser.username;
  let usernameprofileHolder = document.getElementById('usernameProfile');
  let smallUsernameProfileHolder = document.getElementById('@usernameProfile');
  
  if (usernameprofileHolder != null && smallUsernameProfileHolder != null) {
    usernameprofileHolder.innerText = username;
  smallUsernameProfileHolder.innerText = '@'+username.toLowerCase();
  } else {
    console.log("Failure due to being in Homepage")
  }
  displayFollowing();
}

const validateForm = (formSelector, writePostSelector, postButtonSelector, callback) => {
  const formGroup = document.querySelector(formSelector);
  const textarea = formGroup.querySelector(writePostSelector);
  const charCount = formGroup.querySelector('.char-count');
  const postButton = document.getElementById(postButtonSelector);
  formGroup.setAttribute('novalidate', '');

  postButton.disabled = true;

  const updateCharCount = () => {
    const remainingChars = 280 - textarea.value.length;
    charCount.innerHTML = `${remainingChars} / 280 characters <i class="ri-quill-pen-line"></i>`;
  };

  textarea.addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
    updateCharCount();
  });

  textarea.addEventListener('focus', updateCharCount);
  textarea.addEventListener('blur', function() {
    if (this.value.trim() === '') {
        charCount.textContent = '';
    }
  });

  formGroup.addEventListener('keyup', () => {
    if (!textarea.value.trim()) {
      postButton.disabled = true;
    } else {
      postButton.disabled = false;
    }
  });

  formGroup.addEventListener('submit', event => {
    event.preventDefault();

    if (textarea.value.trim()) {
      charCount.textContent = '';
      postButton.disabled = true;
      callback(formGroup, writePostSelector, event);
    }
  });
};

const sendtoAPI = async (formGroup, writePostSelector, event) => {
  const textarea = formGroup.querySelector(writePostSelector);
  const text = textarea.value.trim();

  try {
    console.log(text);
    postCreatePost(writePostSelector);
    getPosts();
    textarea.value = '';
    event.preventDefault();
  } catch (error) {
    console.error('Error occurred while posting:', error);
  }
};

const likeHandler = () => {
  const likeButton = document.querySelector('.posts-feed')

  likeButton.addEventListener('change', function(event) {
      const postId = event.target.id;
      const isChecked = event.target.checked;

      likePostAPI(postId, isChecked);
  });
}

const userLogout = () => {
  let logoutButton = document.querySelector('.menu-item[href="./index.html"]')

  logoutButton.addEventListener('click', event =>  {
    localStorage.clear();
  })
}

export let displayCurrentUser = () => {
  let username = getCurrentUser.username;
  let usernameHolder = document.getElementById('username');
  usernameHolder.innerText = username;
  let handlenameHolder = document.getElementById('handlebar');
  handlenameHolder.innerText = `@${username}`;
}

userLogout();

validateToken();

displayCurrentUserHome();
displayCurrentUserProfile();

//HIGHER THAN LOADER! Dont Touch
fetchUserList();


validateForm('#JS-createPostModal', '#writePostModal', 'postButtonModal', sendtoAPI);
validateForm('#JS-createPost', '#writePost', 'postButton', sendtoAPI);
 
document.addEventListener("DOMContentLoaded", getPosts);

likeHandler();

document.addEventListener('DOMContentLoaded', function () {
  const postButton = document.querySelector('.btn.link-1');
  const modalBackdrop = document.querySelector('.modal-backdrop');
  const modal = document.querySelector('.post-card.modal');
  const closeModalButton = document.getElementById('closeModalButton');

  postButton.addEventListener('click', function () {
    modalBackdrop.style.display = 'block';
    modal.style.display = 'block';
  });

  closeModalButton.addEventListener('click', function () {
    modalBackdrop.style.display = 'none';
    modal.style.display = 'none';
  });
});