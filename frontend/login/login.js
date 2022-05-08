import axios from 'axios';
import Cookies from 'js-cookie';

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
    const { data } = await axios.post('http://localhost:8080/users/login', body);
    const { accessToken } = data;
    console.log(accessToken);
    Cookies.set('token', accessToken, { expires: 7, path: '/' });
    window.location.assign('/posts/');
  } catch(err) {
    console.error(err);
    alert(err.message);
  }
});
