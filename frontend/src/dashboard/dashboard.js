import axios from 'axios';
axios.defaults.withCredentials = true;

const apiUrl = import.meta.env.VITE_API_URL;

const tableBody = document.querySelector('.table > tbody');

document.addEventListener('DOMContentLoaded', async () => {
  try {
    const { data } = await axios.get(`${apiUrl}/users`);
    data.forEach( user => {
      const userRow = createRow(user);
      tableBody.appendChild(userRow);
    })
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
