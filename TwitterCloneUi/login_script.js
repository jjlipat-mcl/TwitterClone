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

    document.querySelector('#registerForm').addEventListener('submit', function (event) {
        event.preventDefault();
        register();
    });

    document.querySelector('#loginForm').addEventListener('submit', function (event) {
        event.preventDefault();
        login();

    });
});

async function register() {
    const name = document.querySelector('#registerName').value;
    const username = document.querySelector('#registerUsername').value;
    const password = document.querySelector('#registerPassword').value;

    var raw = JSON.stringify({
        name: name,
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
    fetch("http://localhost:3000/api/v1/auth/register", fetchRequest)
        .then(response => {
            if (response.ok) {
                saveName(username, name); // Save name after successful registration
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
        .then(response => {
            if (response.ok) {
                return response.text();
            } else if (response.status === 401) {
                throw new Error('Incorrect username or password');
            } else {
                throw new Error('Login failed');
            }
        })
        .then(async result => {
            const aNameStorage = JSON.parse(localStorage.getItem('aName'));
            console.log('aNameStorage:', aNameStorage); // Debugging statement

            if (aNameStorage && aNameStorage[username] && aNameStorage[username].aName) {
                const name = aNameStorage[username].aName;
                token = result;

                // save user
                saveUser(username, name, token);

                window.location.href = 'feed.html';
            } else {
                throw new Error('User data not found');
            }
        })
        .catch(error => {
            console.log('error', error);
            document.querySelector('#loginUsername').value = '';
            document.querySelector('#loginPassword').value = '';
            alert(error.message);
        });
}





function saveName(username, name) {
    const aName = JSON.parse(localStorage.getItem('aName')) || {};
    aName[username] = { aName: name };
    localStorage.setItem('aName', JSON.stringify(aName));
}

function saveUser(username, name, token) {
    const existingUsers = JSON.parse(localStorage.getItem('existingUsers')) || {};

    existingUsers[username] = { name: name, token: token };
    localStorage.setItem('existingUsers', JSON.stringify(existingUsers));
    localStorage.setItem('currentUser', username);
    localStorage.setItem('currentToken', token)
    localStorage.setItem('currentName', name)
}
