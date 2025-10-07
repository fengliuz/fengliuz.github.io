feather.replace(); // Feather icons
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

let activeCategories = new Set(); // multiple active filters

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.getAttribute("data-category");

    // 🟦 Handle "All" button as toggle
    if (category === "all") {
      button.classList.toggle("active");

      if (button.classList.contains("active")) {
        activeCategories.clear(); // clear other filters
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

    // 🧩 Handle regular category toggles
    button.classList.toggle("active");
    button.classList.toggle("bg-blue-600");

    if (button.classList.contains("active")) {
      activeCategories.add(category);
    } else {
      activeCategories.delete(category);
    }

    // Disable "All" button if specific filters are selected
    const allBtn = document.querySelector("[data-category='all']");
    if (activeCategories.size > 0) {
      allBtn.classList.remove("active", "bg-blue-600");
      activeCategories.delete("all");
    }

    filterSkills();
  });
});

function showAll() {
  skillCards.forEach((card) => card.classList.remove("hidden", "opacity-0"));
}

function hideAll() {
  skillCards.forEach((card) => card.classList.add("hidden", "opacity-0"));
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
      card.classList.remove("hidden");
      setTimeout(() => card.classList.remove("opacity-0"), 50);
    } else {
      card.classList.add("opacity-0");
      setTimeout(() => card.classList.add("hidden"), 300);
    }
  });
}

// 🎨 Modal logic (same as before)
const modal = document.createElement("div");
modal.className =
  "fixed inset-0 bg-black/70 hidden items-center justify-center z-[9999]";
modal.innerHTML = `
    <div class="bg-slate-800 text-white rounded-xl p-8 w-[90%] max-w-md relative shadow-lg animate-fadeIn">
      <button id="close-modal" class="absolute top-3 right-3 text-gray-400 hover:text-white text-xl">&times;</button>
      <h3 id="modal-title" class="text-2xl font-bold text-blue-400 mb-2"></h3>
      <p id="modal-desc" class="text-gray-300 mb-6"></p>
      <div class="flex flex-col items-center">
        <svg id="circle-progress" width="120" height="120" class="transform -rotate-90">
          <circle cx="60" cy="60" r="50" stroke="gray" stroke-width="10" fill="none" />
          <circle id="progress-bar" cx="60" cy="60" r="50" stroke="#3b82f6" stroke-width="10" stroke-linecap="round" fill="none"
            stroke-dasharray="314" stroke-dashoffset="314" />
        </svg>
        <div id="percent-text" class="text-2xl font-semibold mt-4 text-blue-400">0%</div>
      </div>
    </div>
  `;
document.body.appendChild(modal);

const progressBar = modal.querySelector("#progress-bar");
const percentText = modal.querySelector("#percent-text");

document.querySelectorAll(".skill-card").forEach((card) => {
  card.addEventListener("click", () => {
    const name = card.getAttribute("data-name");
    const desc = card.getAttribute("data-description");
    const percent = parseFloat(card.getAttribute("data-percent"));

    modal.querySelector("#modal-title").textContent = name;
    modal.querySelector("#modal-desc").textContent = desc;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    // Animate circle progress
    const circumference = 314;
    progressBar.style.transition = "none";
    progressBar.style.strokeDashoffset = circumference;

    // Force reflow
    void progressBar.offsetWidth;

    let transitionTime = 0
    transitionTime =+ (percent / 55 + 1.2)
    setTimeout(() => {
      progressBar.style.transition = `stroke-dashoffset ${transitionTime}s ease-in-out`;
      const offset = circumference - (percent / 100) * circumference;
      progressBar.style.strokeDashoffset = offset;
    }, 100);

    // Animate number
    let current = 0;
    const animateNumber = () => {
      if (current < percent) {
        current += 1;
        percentText.textContent = current + "%";
        requestAnimationFrame(animateNumber);
      }
    };
    percentText.textContent = "0%";
    requestAnimationFrame(animateNumber);
  });
});

modal.querySelector("#close-modal").addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});
