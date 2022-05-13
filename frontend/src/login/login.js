import axios from 'axios';
import Cookies from 'js-cookie';

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
    const { data: { accessToken } } = await axios.post(`${apiUrl}/users/login`, body);
    Cookies.set('token', accessToken, { expires: 7, path: '/' });
    window.location.assign('/posts/');
  } catch(err) {
    if (err.response.data.error) {
      return alert(err.response.data.error);
    }
    alert(err.message);
  }
});
