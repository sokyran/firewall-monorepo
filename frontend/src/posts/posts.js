import axios from 'axios';
import parseQuery from '../utils/parse-query';
import htmlSanitize from '../utils/html-sanitize';

const searchContainer = document.querySelector('#search-container');
const searchButton = document.querySelector('#search-button');
const searchResult = document.querySelector('#search-result');
const searchInput = document.querySelector('#search-input');

const apiUrl = import.meta.env.VITE_API_URL;

searchButton.addEventListener('click', async () => {
  const searchValue = searchInput.value;
  window.location.replace('/posts/?query=' + searchValue);
});

const createPost = (post) => {
  const posts = document.querySelector('#posts');
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
  posts.append(postElement);
}

const loadPosts = async () => {
  const { data } = await axios.get(`${apiUrl}/posts`);
  data.forEach((post) => createPost(post));
}

const findPostsByText = async (text) => {

  const { data } = await axios.post(`${apiUrl}/posts/search?query=${text}`);
  data.forEach((post) => createPost(post));
};

document.addEventListener('DOMContentLoaded', async () => {

  const parsed = parseQuery(decodeURI(location.search));

  if (parsed.query) {
    searchContainer.classList.toggle('d-none');

    searchResult.innerHTML = parsed.query;

    findPostsByText(parsed.query);
  } else {
    await loadPosts();
  }

  document.querySelector("#loading").remove();
});
