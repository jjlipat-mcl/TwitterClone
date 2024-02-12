// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('Login').addEventListener('click', function() {    
//         // Get username
//         const username = document.querySelector('input[placeholder="Username"]').value;

//         // Get password
//         const password = document.querySelector('input[placeholder="Password"]').value;
        
//         // Redirect to the next page
//         window.location.href = 'index.html';
        
//     });
// });

//localStorage.removeItem('existingUsers'); //clear users
document.addEventListener('DOMContentLoaded', (event) => {
    const wrapper = document.querySelector(".wrapper"),
    signupHeader = document.querySelector(".signup header"),
    loginHeader = document.querySelector(".login header");

    loginHeader.addEventListener("click", () => {
        wrapper.classList.add("active");
    });
    signupHeader.addEventListener("click", () => {
        wrapper.classList.remove("active");
    });

    document.querySelector('#registerForm').addEventListener('submit', function(event) {
        event.preventDefault();
        register();
    });

    document.querySelector('#loginForm').addEventListener('submit', function(event) {
        event.preventDefault();
        login();
        
    });


    async function register() {
        
        const username = document.querySelector('#registerUsername').value;
        const password = document.querySelector('#registerPassword').value;

        var raw = JSON.stringify({
            username: username,
            password: password
        });

        var fetchRequest = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: raw,
            redirect: 'follow',
        };

    //     fetch("http://localhost:3000/api/v1/auth/register", fetchRequest)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error)
    // );
        // fetch
        fetch("http://localhost:3000/api/v1/auth/register", fetchRequest)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Username already exists');
            }
        })
        .then(result => {
            console.log(result); // Handle successful registration response
            alert('User successfully created. You may now proceed to Login');
        })
        .catch(error => {
            console.log('error', error);
            // Clear the username and password input fields
            document.querySelector('#registerUsername').value = '';
            document.querySelector('#registerPassword').value = '';
            // Show the alert for username already exists
            alert('Username already exists');
        });

    }

    async function login() {
        const username = document.querySelector('#loginUsername').value;
        const password = document.querySelector('#loginPassword').value;

        var raw = JSON.stringify({
            "username": username,
            "password": password
        });
        
        var fetchRequest = {
            method: 'POST',
            body: raw,
            redirect: 'follow',
            headers: {
                'Content-Type': 'application/json'
            },
        };
    
    
         // fetch
        fetch("http://localhost:3000/api/v1/auth/login", fetchRequest)
        //     .then(response => response.text())
        //     .then(async result => {
        //         token = "Bearer " + result;  
    
        //         // save user
        //         saveUser(username, password, token)
        //     })
        // .catch(error => console.log('error', error));
        .then(response => {
            if (response.ok) {
                return response.text();
            } else {
                throw new Error('Incorrect password');
            }
        })
        .then(async result => {
            token = "Bearer " + result;  

            // save user
            saveUser(username, password, token);

            window.location.href = 'index.html';
        })
        .catch(error => {
            // console.log('error', error);
            // document.querySelector('#loginUsername').value = '';
            // // Clear the password input field and display an error message
            // document.querySelector('#loginPassword').value = '';
            // alert('Incorrect password');

            console.log('error', error);
            document.querySelector('#loginUsername').value = '';
            document.querySelector('#loginPassword').value = '';
            alert('Incorrect username or password');

        });
    
    }
    
    
    // save user
    function saveUser(username, password, token) {
        console.log("saveuser")
        const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};
    
        existingUsers[username] = { password: password, token: token };
        console.log(existingUsers)
        localStorage.setItem('existingUsers', JSON.stringify(existingUsers));
        localStorage.setItem('currentUser', username);
    
    }
    
    // async function start() { 
    //     await register()
    //     await login()
    // }

    // start()

});
