import axios from 'axios';
import parseQuery from '../utils/parse-query';
import htmlSanitize from '../utils/html-sanitize';

const searchContainer = document.querySelector('#search-container');
const searchButton = document.querySelector('#search-button');
const postButton = document.querySelector('#post-button');
const searchResult = document.querySelector('#search-result');
const searchInput = document.querySelector('#search-input');
const usernamePlace = document.querySelector('#username-place');
const textArea = document.querySelector('#text-area');
const posts = document.querySelector('#posts');

const apiUrl = import.meta.env.VITE_API_URL;

let csrfToken = null;

searchButton.addEventListener('click', async () => {
  const searchValue = searchInput.value;
  window.location.replace('/posts/?query=' + searchValue);
});

postButton.addEventListener('click', async () => {
  const { value } = textArea;

  if (value.length > 0) {
    const { data } = await axios.post(`${apiUrl}/posts`, { text: value }, { headers: { 'X-CSRF-TOKEN': csrfToken } });
    textArea.value = '';
    renderPost({ name: data.username, text: value });
  } else {
    alert('You need to write something');
  }
});

const renderPost = (post) => {
  if (!post || !post.name || !post.text) {
    return alert('Not valid post');
  }

  const postElement = document.createElement('div');
  const postHTML = `
    <div class="card mb-4 bg-light">
      <div class="card-header">Blog title by <b>${post.name}</b></div>
      <div class="card-body">
        <p class="card-text">${htmlSanitize(post.text)}</a>
      </div>
      <div class="card-footer text-muted">
        <button class="btn btn-outline-primary">Comment</button>
      </div>
    </div>
    `;

  postElement.innerHTML = postHTML;
  posts.prepend(postElement);
}

const loadPosts = async () => {
  const { data } = await axios.get(`${apiUrl}/posts`);
  data.forEach((post) => renderPost(post));
}

const findPostsByText = async (text) => {
  const { data } = await axios.post(`${apiUrl}/posts/search?query=${text}`);
  data.forEach((post) => renderPost(post));
};

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
  const parsed = parseQuery(decodeURI(location.search));

  const { data } = await axios.post(`${apiUrl}/users/csrf-token`);
  csrfToken = data.csrfToken;

  if (parsed.query) {
    searchContainer.classList.toggle('d-none');

    searchResult.innerHTML = parsed.query;

    findPostsByText(parsed.query);
  } else {
    await getUser();
    await loadPosts();
  }

  document.querySelector("#loading").remove();
});
