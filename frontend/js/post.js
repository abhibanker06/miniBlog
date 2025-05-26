const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));
const userId = user?.id;

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
    const res = await fetch(`https://miniblog-iwf4.onrender.com/posts/${postId}`);
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

async function loadComments() {
  try {
    const res = await fetch(`https://miniblog-iwf4.onrender.com/comments/${postId}`);
    const comments = await res.json();

    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = "";

    if (comments.length === 0) {
      commentsList.innerHTML = "<p>No comments yet. Be the first to comment!</p>";
      return;
    }
    comments.slice().reverse().forEach(comment => {
      const authorName = comment.author?.username || "Anonymous";
      const commentDate = new Date(comment.date).toLocaleDateString();
      const commentHTML = `
        <div class="comment">
          <div class="comment-meta">
              <span class="comment-author">${authorName}</span>
              <span class="comment-date">${commentDate}</span>
          </div>
          <div class="comment-content">
              <p>${comment.content}</p>
          </div>
        </div>
      `;
      commentsList.innerHTML += commentHTML;
    });
  } catch (error) {
    console.error("Failed to load comments:", error);
    document.getElementById('commentsList').innerHTML = "<p>Failed to load comments.</p>";
  }
}


const commentForm = document.getElementById("commentForm");

commentForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const content = document.getElementById("commentContent").value;

  if (!token) {
      alert("Please login first.");
      window.location.href = "login.html";
      return;
    }

  try {
    const res = await fetch("https://miniblog-iwf4.onrender.com/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        author: userId, // Replace with logged-in user ID if available
        postId
      })
    });

    if (!res.ok) throw new Error("Failed to post comment.");

    // Clear form and reload comments
    commentForm.reset();
    loadComments();
  } catch (error) {
    alert("Error submitting comment: " + error.message);
  }
});

async function loadRelatedPosts() {
  try {
    // First, try to fetch related posts based on category or other criteria
    const res = await fetch(`https://miniblog-iwf4.onrender.com/posts/related/${postId}`);
    const relatedPosts = await res.json();

    const relatedPostsContainer = document.getElementById('relatedPosts');
    relatedPostsContainer.innerHTML = "";

    if (relatedPosts.length === 0) {
      // If no related posts, fetch the latest posts
      const related=document.getElementById('related');
      const notrelated=document.getElementById('not-related');

      related.style.display='none';
      notrelated.style.display='inline-block';
      const latestRes = await fetch('https://miniblog-iwf4.onrender.com/posts');
      const latestPosts = await latestRes.json();

      if (latestPosts.length > 0) {
        const filteredPosts = latestPosts.filter(post => post._id !== postId);
        filteredPosts.slice().reverse().slice(0,3).forEach(post => {
          const postHTML = `
          <a href="post.html?PostId=${post._id}">
            <div class="related-post">
              <div class="related-post-image">
                <img src="${post.image || 'assets/images/noimage.jpg'}" alt="${post.title}" />
              </div>
              <h4>${post.title}</h4>
            </div>
          </a>
          `;
          relatedPostsContainer.innerHTML += postHTML;
        });
      } else {
        relatedPostsContainer.innerHTML = "<p>No posts available at the moment.</p>";
      }
    } else {
      // If related posts exist, display them
      relatedPosts.forEach(post => {
        const postHTML = `
        <a href="post.html?PostId=${post._id}">
          <div class="related-post">
            <div class="related-post-image">
              <img src="${post.image || 'assets/images/noimage.jpg'}" alt="${post.title}" />
            </div>
            <h4>${post.title}</h4>
          </div>
        </a>
        `;
        relatedPostsContainer.innerHTML += postHTML;
      });
    }
  } catch (error) {
    console.error("Failed to load related posts:", error);
    document.getElementById('relatedPosts').innerHTML = "<p>Failed to load posts.</p>";
  }
}

loadComments();
loadRelatedPosts()
renderPost();
