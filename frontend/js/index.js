import { limitWords } from "./utils/limitwords.js";

document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:5000/posts')
      .then((res) => res.json())
      .then((posts) => {
        displayPosts(posts); // Function to display posts (step 2)
      })
      .catch((err) => console.error('Failed to load posts:', err));


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

    // Logout with confirmation
        logoutBtn.addEventListener("click", () => {
            const confirmed = confirm("Are you sure you want to log out?");
            if (confirmed) {
            localStorage.removeItem("token");
            window.location.href = "index.html";
            }
        });
  });
 


function displayPosts(posts){
    let postHTML='';
    posts.slice().reverse().forEach((details)=>{
        const postImage = details.image || 'assets/images/noimage.jpg';
        const excerpt=limitWords(details.excerpt,20);
          


        postHTML+=`
        <article class="post-card" >
            <a href="post.html?PostId=${details._id}">
                <div class="post-image">
                    <img class="product-image"
                src="${postImage}">
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
    });

    document.querySelector('.js-post-grid').innerHTML=postHTML;
}

displayPosts();

