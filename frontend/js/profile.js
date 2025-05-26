import { limitWords } from "./utils/limitwords.js";

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

    // Logout with confirmation
        logoutBtn.addEventListener("click", () => {
            const confirmed = confirm("Are you sure you want to log out?");
            if (confirmed) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            }
        });
})

// Fetch the user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  window.location.href = "login.html"; // Redirect to login if no user found in localStorage
}

// Display user info
document.getElementById("username").textContent = user.username;
document.getElementById("userEmail").textContent = user.email;

// Fetch and display user's posts
async function fetchUserPosts() {
  try {
    const res = await fetch(`https://miniblog-iwf4.onrender.com/posts/user/${user.id}`);
    const posts = await res.json();

    
    let postHTML='';
    if (posts.length > 0) {
        
      posts.slice().reverse().forEach((post)=>{
        const postImage = post.image || 'assets/images/noimage.jpg';
        const excerpt=limitWords(post.excerpt,20);
        postHTML+=`
        <article class="post-card" >
        <a href="post.html?PostId=${post._id}">
                <div class="post-image">
                    <img class="product-image"
                src="${postImage}">
                </div>
                <div class="post-content">
                <div class="post-category">${post.category}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-excerpt">${excerpt}</p>
                <div class="post-meta">
                    <span class="post-author">${post.author?.username || 'Unknown'}</span>
                    <span class="post-date">${new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
            </div>
            </a>
            </article> 
        `
      });

      document.querySelector(".js-user-posts").innerHTML=postHTML;
    } else {
      document.querySelector(".js-user-posts").innerHTML = "<p>No posts available.</p>";
    }
  } catch (err) {
    console.error("Error fetching posts:", err);
  }
}

fetchUserPosts();
