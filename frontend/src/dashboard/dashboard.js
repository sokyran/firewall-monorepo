import axios from 'axios';
axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL;

const tableBody = document.querySelector('.table > tbody');
const usernamePlace = document.querySelector('#username-place');

const getUser = async () => {
  try {
    const { data } = await axios.post(`${apiUrl}/users/check-token`);
    usernamePlace.innerHTML = data.username;
  } catch (err) {
    console.error(err);
    alert('Something went wrong', err.message);
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/users`);
    data.forEach( user => {
      const userRow = createRow(user);
      tableBody.appendChild(userRow);
    })
    await getUser();
  } catch(err) {
    console.error(err);
  }
});

const createRow = ({id, name, role}) => {
  const row = document.createElement('tr');
  const html = `
    <th scope="row">${id}</th>
    <td>${name}</td>
    <td>${role}</td>
  `
  row.innerHTML = html;
  return row;
}
