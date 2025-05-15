import { limitWords } from "./utils/limitwords.js";

let allPosts = [];
let visiblePosts = 0;
const postsPerLoad = 6;

document.addEventListener('DOMContentLoaded', () => {
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  // Fetch posts from backend
  fetch('http://localhost:5000/posts')
    .then((res) => res.json())
    .then((posts) => {
      allPosts = posts.reverse(); // Reverse to show latest first
      displayNextPosts(); // Show initial 6 posts
    })
    .catch((err) => console.error('Failed to load posts:', err));

  // Show/hide login/logout button
  const token = localStorage.getItem("token");
  const loginBtn = document.getElementById("loginBtn");
  const logoutBtn = document.getElementById("logoutBtn");

  if (token) {
    loginBtn.style.display = "none";
    logoutBtn.style.display = "inline-block";
  } else {
    loginBtn.style.display = "inline-block";
    logoutBtn.style.display = "none";
  }

  // Load more button handler
  loadMoreBtn.addEventListener("click", displayNextPosts);
});

// Display posts in chunks
function displayNextPosts() {
  const postsGrid = document.getElementById("postsGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  const nextPosts = allPosts.slice(visiblePosts, visiblePosts + postsPerLoad);
  nextPosts.forEach((details) => {
    const postImage = details.image || 'assets/images/noimage.jpg';
    const excerpt = limitWords(details.excerpt, 20);

    const postHTML = `
      <article class="post-card">
        <a href="post.html?PostId=${details._id}">
          <div class="post-image">
            <img class="product-image" src="${postImage}">
          </div>
          <div class="post-content">
            <div class="post-category">${details.category}</div>
            <h3 class="post-title">${details.title}</h3>
            <p class="post-excerpt">${excerpt}</p>
            <div class="post-meta">
              <span class="post-author">${details.author?.username || 'Unknown'}</span>
              <span class="post-date">${new Date(details.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </a>     
      </article>
    `;

    postsGrid.insertAdjacentHTML("beforeend", postHTML);
  });

  visiblePosts += postsPerLoad;

  // Hide button if all posts are displayed
  if (visiblePosts >= allPosts.length) {
    loadMoreBtn.style.display = "none";
  }
}
