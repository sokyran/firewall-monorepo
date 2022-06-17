import axios from 'axios';
axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL;

const loginButton = document.querySelector('#login');
const usernameInput = document.querySelector('#username');
const passwordInput = document.querySelector('#password');

loginButton.addEventListener('click', async () => {
  const username = usernameInput.value;
  const password = passwordInput.value;
  const body = {
    username,
    password,
  };

  try {
    await axios.post(`${apiUrl}/users/login`, body);
    window.location.assign('/posts/');
  } catch(err) {
    if (err.response.data.error) {
      return alert(err.response.data.error);
    }
    alert(err.message);
  }
});
