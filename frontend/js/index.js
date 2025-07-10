import { limitWords } from "./utils/limitwords.js";

let allPosts = [];
let visiblePosts = 0;
const postsPerLoad = 6;

document.addEventListener('DOMContentLoaded', async() => {
  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const searchInput = document.getElementById("searchInput");

  loadMoreBtn.textContent='Please wait,loading content...';
  loadMoreBtn.classList.add('loading');
  loadMoreBtn.disabled=true;

  // Fetch posts from backend
  try{
    const res= await fetch('https://miniblog-iwf4.onrender.com/posts');
    const posts = await res.json();

    allPosts=posts.reverse();
    displayNextPosts();

    loadMoreBtn.textContent='Load More';
    loadMoreBtn.classList.remove('loading');
    loadMoreBtn.disabled=false;
    }catch (err){
      console.error('Falied to load posts',err);
      loadMoreBtn.textContent='Falied to load posts';
      loadMoreBtn.classList.add('error');
      loadMoreBtn.disabled=true;
    }
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

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const searchTerm = searchInput.value.trim().toLowerCase();
      const filteredPosts = allPosts.filter(post =>
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
      );
      displayPosts(filteredPosts);
    }
  });
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

function displayPosts(posts) {
  const postsGrid = document.getElementById("postsGrid");
  const loadMoreBtn = document.getElementById("loadMoreBtn");

  postsGrid.innerHTML = ""; // Clear existing posts
  loadMoreBtn.style.display = "none"; // Hide "Load More" during search results

  if (posts.length === 0) {
    postsGrid.innerHTML = "<p>No posts available for your search.</p>";
    return;
  }

  posts.forEach((details) => {
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
}



