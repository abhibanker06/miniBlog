const token = localStorage.getItem("token");

document.addEventListener('DOMContentLoaded',()=>{
  const loginBtn = document.getElementById("loginBtn");
      const logoutBtn = document.getElementById("logoutBtn");

      if (token) {
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
      } else {
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
      }
})


const url = new URL(window.location.href);
const postId = url.searchParams.get('PostId');

async function renderPost() {

  try {
    const res = await fetch(`http://localhost:5000/posts/${postId}`);
    const post = await res.json();

    const postImage = post.image || "assets/images/noimage.jpg";
    const postDate = new Date(post.createdAt).toLocaleDateString();
    const postAuthor = post.author?.username || "Unknown";

    function calculateReadTime(content) {
        const words = content.trim().split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
      }
    
      const readTime = calculateReadTime(post.content);

    const renderPostHTML = `
      <div class="post-header">
          <div class="post-category">${post.category}</div>
          <h1 class="post-title">${post.title}</h1>
          <div class="post-meta">
              <span class="post-author">By ${postAuthor}</span>
              <span class="post-date">${postDate}</span>
              <span class="post-read-time">${readTime}</span>
          </div>
      </div>

      <div class="post-featured-image">
          <img class="product-image" src="${postImage}" alt="${post.title}">
      </div>

      <div class="post-body">
          <p>${post.content}</p>
      </div>
    `;

    document.getElementById('postContent').innerHTML = renderPostHTML;
  } catch (error) {
    console.error("Failed to load post:", error);
    document.getElementById('postContent').innerHTML = "<p>Failed to load post.</p>";
  }
}

renderPost();
