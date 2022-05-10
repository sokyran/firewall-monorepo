import axios from 'axios';
import Cookies from 'js-cookie';

const nonAuthSection = document.querySelector('#non-auth');
const authSection = document.querySelector('#auth');
const usernamePlace = document.querySelector('#username-place');

const apiUrl = import.meta.env.VITE_API_URL;

document.addEventListener('DOMContentLoaded', async () => {
  if (!window.location.pathname.endsWith('/')) {
    window.location.replace(window.location.pathname + '/');
  }

  const token = Cookies.get('token');

  if (!token) {
    return nonAuthSection.classList.remove('d-none');
  }

  try {
    const { data } = await axios.post(`${apiUrl}/users/check-token`, { token });
    authSection.classList.remove('d-none');
    usernamePlace.innerHTML = data.username;
  } catch(err) {
    console.error(err);
    return nonAuthSection.classList.remove('d-none');
  }

});
