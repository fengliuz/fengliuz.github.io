feather.replace()
const header = document.querySelector("header");
const toTop = document.getElementById("to-top");
const typedText = document.getElementById("typed-text");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");
const darkToggle = document.getElementById("dark-toggle");
const body = document.querySelector("body");
const html = document.querySelector("html");
// --- Navbar awal ---
header.classList.add("navbar-white");

// --- Efek ketik ---
const words = ["Web Developer", "Student", "Gamer", "NPC"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

// function type() {
//   const currentWord = words[wordIndex];
//   const currentText = currentWord.substring(0, charIndex);
//   typedText.textContent = currentText;

//   if (!isDeleting && charIndex < currentWord.length) {
//     charIndex++;
//     setTimeout(type, 100);
//   } else if (isDeleting && charIndex > 0) {
//     charIndex--;
//     setTimeout(type, 60);
//   } else {
//     isDeleting = !isDeleting;
//     if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
//     setTimeout(type, 3000);
//   }
// }
function type() {
  const currentWord = words[wordIndex];
  const currentText = currentWord.substring(0, charIndex);
  if (typedText.textContent !== currentText) {
    typedText.textContent = currentText;
  }
  if (!isDeleting && charIndex < currentWord.length) {
    charIndex++;
    setTimeout(type, 100);
  } else if (isDeleting && charIndex > 0) {
    charIndex--;
    setTimeout(type, 60);
  } else {
    isDeleting = !isDeleting;
    if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
    setTimeout(type, 3000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(type, 0);
});

// --- Hamburger menu ---

hamburger.addEventListener("click", function () {
  hamburger.classList.toggle("hamburger-active");
  navMenu.classList.toggle("translate-x-[500px]");
});

document.addEventListener("click", function (e) {
  if (
    !hamburger.contains(e.target) &&
    !navMenu.contains(e.target) &&
    window.innerWidth < 1280
  ) {
    hamburger.classList.remove("hamburger-active");
    navMenu.classList.add("translate-x-[500px]");
  }
});

// Navbar highlight
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const id = entry.target.getAttribute("id");
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove("text-primary");
          link.classList.add("dark:text-white");
          link.classList.remove("dark:text-primary");
          if (link.getAttribute("href") === "#" + id) {
            link.classList.add("text-primary");
            link.classList.remove("dark:text-white");
            link.classList.add("dark:text-primary");
          }
        });
      }
    });
  },
  { threshold: 0.35 }
);

sections.forEach((section) => navObserver.observe(section));

// --- Animasi section muncul ---
const animateObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove(
          "opacity-0",
          "translate-y-10",
          "invisible"
        );
        entry.target.classList.add("opacity-100", "translate-y-0");
        obs.unobserve(entry.target); // animasi sekali saja
      }
    });
  },
  { threshold: 0.2 }
);

document.querySelectorAll("[data-animate]").forEach((el) => {
  animateObserver.observe(el);
});
// --- Fixed header saat scroll ---
let scrollTimeout;
window.onscroll = function () {
  const fixedNav = header.offsetTop;
  if (window.pageYOffset > fixedNav) {
    toTop.classList.remove("hidden");
    header.classList.remove("navbar-white");
    header.classList.add("navbar-fixed");
    header.classList.add("opacity");
  } else {
    toTop.classList.add("hidden");
    header.classList.add("navbar-white");
    header.classList.remove("navbar-fixed");
    header.classList.remove("opacity");
  }

  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (header.classList.contains("opacity")) {
      header.classList.remove("opacity");
    }
  }, 100);
};

// DARK MODE TOGGLE
let selectedTheme;
selectedTheme = localStorage.getItem("theme");
darkToggle.addEventListener("click", () => {
  if (darkToggle.checked) {
    localStorage.setItem("theme", "dark");
    body.classList.add("dark");
    html.classList.add("dark");
  } else {
    localStorage.setItem("theme", "light");
    html.classList.remove("dark");
    body.classList.remove("dark");
  }
});

function switchTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    darkToggle.checked = true;
  } else {
    body.classList.remove("dark");
  }
}
switchTheme(selectedTheme);

// black
function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Filter Buttons
const filterButtons = document.querySelectorAll(".filter-btn");
const skillCards = document.querySelectorAll(".skill-card");

let activeCategories = new Set();
let animationTimers = new Map(); // track animations to cancel later

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");

    // Handle "All"
    if (category === "all") {
      button.classList.toggle("active");

      if (button.classList.contains("active")) {
        activeCategories.clear();
        filterButtons.forEach((btn) => {
          if (btn !== button) btn.classList.remove("active", "bg-blue-600");
        });
        activeCategories.add("all");
        button.classList.add("bg-blue-600");
        showAll();
      } else {
        activeCategories.delete("all");
        button.classList.remove("bg-blue-600");
        hideAll();
      }
      return;
    }

    // Regular category toggle
    button.classList.toggle("active");
    button.classList.toggle("bg-blue-600");

    if (button.classList.contains("active")) {
      activeCategories.add(category);
    } else {
      activeCategories.delete(category);
    }

    const allBtn = document.querySelector("[data-category='all']");
    if (activeCategories.size > 0) {
      allBtn.classList.remove("active", "bg-blue-600");
      activeCategories.delete("all");
    }

    filterSkills();
  });
});

function showAll() {
  skillCards.forEach(showCard);
}

function hideAll() {
  skillCards.forEach(hideCard);
}

function showCard(card) {
  clearAnimation(card);

  card.classList.remove("hidden");
  card.style.opacity = "0";
  card.style.transform = "scale(0.95)";
  void card.offsetWidth; // force reflow

  card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  card.style.opacity = "1";
  card.style.transform = "scale(1)";
}

function hideCard(card) {
  clearAnimation(card);

  card.style.transition = "opacity 0.3s ease, transform 0.3s ease";
  card.style.opacity = "0";
  card.style.transform = "scale(0.95)";

  const timer = setTimeout(() => card.classList.add("hidden"), 300);
  animationTimers.set(card, timer);
}

function filterSkills() {
  if (activeCategories.size === 0) {
    hideAll();
    return;
  }

  skillCards.forEach((card) => {
    const cardCategory = Array.from(card.classList).find((cls) =>
      ["frontend", "backend", "fullstack", "networking", "ai"].includes(cls)
    );

    if (activeCategories.has(cardCategory)) {
      showCard(card);
    } else {
      hideCard(card);
    }
  });
}

function clearAnimation(card) {
  if (animationTimers.has(card)) {
    clearTimeout(animationTimers.get(card));
    animationTimers.delete(card);
  }
}
