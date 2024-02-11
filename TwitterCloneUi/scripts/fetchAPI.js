export async function postCreateUser(formObject) {
  let username = formObject.username;
  let password = formObject.password;

  const res = await fetch("http://localhost:3000/api/v1/auth/register", {
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
      return true;
  } else {
      return false;
  }
}

export async function postLogIn() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;

  const res = await fetch('http://localhost:3000/api/v1/auth/login', {
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
      console.log(localStorage)
  } else {
      console.log('login fails')
  }
}