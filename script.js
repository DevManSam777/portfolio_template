// theme management
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  document.documentElement.setAttribute("data-theme", newTheme);

  const icon = document.getElementById("theme-icon");
  icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";

  // If you are not using the form web component you can comment this out
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.setAttribute("theme", newTheme);
  }

  localStorage.setItem("theme", newTheme);
}

function initializeTheme() {
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");

  document.documentElement.setAttribute("data-theme", savedTheme);

  const icon = document.getElementById("theme-icon");
  if (icon) {
    icon.className = savedTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
  }

  // If you are not using the form web component from DevManSam777 you can comment this out
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.setAttribute("theme", savedTheme);
  }
}

// smooth scrolling
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        const headerHeight = document.querySelector(".header").offsetHeight;
        const targetPosition = target.offsetTop - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });

        closeMobileMenu();
      }
    });
  });
}

// mobile menu functionality
function initializeMobileMenu() {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const navLinks = document.querySelector(".nav-links");
  const body = document.body;

  if (mobileMenuBtn && navLinks) {
    const overlay = document.createElement("div");
    overlay.className = "mobile-menu-overlay";
    body.appendChild(overlay);

    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    overlay.addEventListener("click", () => {
      closeMobileMenu();
    });

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMobileMenu();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeMobileMenu();
      }
    });
  }
}

function toggleMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

  if (navLinks && overlay && mobileMenuBtn) {
    const isOpen = navLinks.classList.contains("mobile-open");

    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }
}

function openMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

  navLinks.classList.add("mobile-open");
  overlay.classList.add("active");
  mobileMenuBtn.innerHTML = '<i class="fas fa-times"></i>';
  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  const navLinks = document.querySelector(".nav-links");
  const overlay = document.querySelector(".mobile-menu-overlay");
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");

  if (navLinks && overlay && mobileMenuBtn) {
    navLinks.classList.remove("mobile-open");
    overlay.classList.remove("active");
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    document.body.style.overflow = "";
  }
}


//   BLOG FUNCTIONALITY (OPTIONAL)

  //  Uncomment the functions below if you want to use the blog feature.
  //  This will fetch blog posts from Hashnode and display them on your site.

  //  To enable:
  //  1. Uncomment all the code in this section
  //  2. Update the 'host' variable in fetchHashnodePosts() with your blog URL
  //  3. Uncomment the blog section in index.html
  //  4. Uncomment the fetchHashnodePosts() call in the DOMContentLoaded event

  //  Note: This example uses Hashnode's GraphQL API. You can modify it to work
  //  with other blogging platforms or your own blog API.


/*
// blog functionality
async function fetchHashnodePosts() {
  try {
    const response = await fetch("https://gql.hashnode.com/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query GetPublicationPosts($host: String!) {
            publication(host: $host) {
              title
              posts(first: 3) {
                edges {
                  node {
                    title
                    brief
                    slug
                    coverImage {
                      url
                    }
                    publishedAt
                    readTimeInMinutes
                    tags {
                      name
                    }
                    url
                  }
                }
              }
            }
          }
        `,
        variables: {
          // TODO: Replace with your Hashnode blog URL
          host: "yourblog.hashnode.dev",
        },
      }),
    });

    const data = await response.json();

    if (data.errors) {
      console.error("GraphQL errors:", data.errors);
      return;
    }

    const posts = data.data?.publication?.posts?.edges || [];

    if (posts.length > 0) {
      renderBlogPosts(posts.map((edge) => edge.node));
    }
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    // keep the static placeholder posts if API fails
  }
}

function renderBlogPosts(posts) {
  const blogGrid = document.querySelector(".blog-grid");
  if (!blogGrid) return;

  blogGrid.innerHTML = posts
    .map((post) => {
      const date = new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      const tags = post.tags
        .slice(0, 3)
        .map((tag) => `<span class="blog-tag">${tag.name}</span>`)
        .join("");

      return `
        <a href="${post.url}" target="_blank" rel="noopener noreferrer" class="blog-card">
          <div class="blog-image">
            ${
              post.coverImage?.url
                ? `<img src="${post.coverImage.url}" alt="${post.title}" loading="lazy"/>`
                : '<i class="fas fa-code"></i>'
            }
          </div>
          <div class="blog-content">
            <div class="blog-meta">
              <div class="blog-date">
                <i class="fas fa-calendar"></i>
                <span>${date}</span>
              </div>
              <div class="blog-read-time">
                <i class="fas fa-clock"></i>
                <span>${post.readTimeInMinutes} min read</span>
              </div>
            </div>
            <h3>${post.title}</h3>
            <p class="blog-excerpt">${post.brief}</p>
            <div class="blog-tags">
              ${tags}
            </div>
          </div>
        </a>
      `;
    })
    .join("");
}

// make blog cards clickable (for static version)
function initializeBlogCards() {
  const blogCards = document.querySelectorAll(".blog-card");
  blogCards.forEach((card) => {
    // add click handler for static cards that don't have hrefs
    if (!card.href) {
      card.style.cursor = "pointer";
      card.addEventListener("click", () => {
        // TODO: Replace with your actual blog URL
        window.open("https://yourblog.com", "_blank");
      });
    }
  });
}
*/

// form event handlers
function initializeFormEventHandlers() {
  document.addEventListener("form-submit", (event) => {
    // Handle form submission if needed
  });

  document.addEventListener("form-success", (event) => {
    // Handle successful form submission if needed
  });

  document.addEventListener("form-error", (event) => {
    // Handle form errors if needed
  });
}

// header scroll effect
function initializeHeaderScrollEffect() {
  const header = document.querySelector(".header");
  let lastScrollY = window.scrollY;

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.style.transform =
        currentScrollY > lastScrollY ? "translateY(-100%)" : "translateY(0)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScrollY = currentScrollY;
  });
}

// scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, observerOptions);

  document.querySelectorAll("section").forEach((section) => {
    section.style.opacity = "0";
    section.style.transform = "translateY(30px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });
}

function initializeSystemThemeListener() {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  mediaQuery.addListener((e) => {
    if (!localStorage.getItem("theme")) {
      const newTheme = e.matches ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);

      const icon = document.getElementById("theme-icon");
      if (icon) {
        icon.className = newTheme === "dark" ? "fas fa-sun" : "fas fa-moon";
      }

      const contactForm = document.getElementById("contact-form");
      if (contactForm) {
        contactForm.setAttribute("theme", newTheme);
      }
    }
  });
}

function handleWindowResize() {
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });
}

// initialize everything
document.addEventListener("DOMContentLoaded", () => {
  initializeTheme();
  initializeSmoothScrolling();
  initializeFormEventHandlers();
  initializeMobileMenu();
  initializeHeaderScrollEffect();
  initializeScrollAnimations();
  initializeSystemThemeListener();
  handleWindowResize();

  // Optional: Initialize blog functionality
  // Uncomment the lines below if you want to use the blog feature:
  // initializeBlogCards();
  // fetchHashnodePosts();

  // set dynamic copyright year
  document.getElementById("current-year").textContent =
    new Date().getFullYear();

  console.log("Portfolio site initialized successfully!");
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    // Page is hidden
  } else {
    // Page is visible
  }
});
