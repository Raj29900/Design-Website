// ---------- RGB Starfield Background ----------
(function initStarfield() {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let width, height, stars;
  const STAR_COUNT = 160;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function makeStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      hue: Math.random() * 360,
      hueSpeed: Math.random() * 20 + 6,
      phase: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 1.2 + 0.4,
      driftX: (Math.random() - 0.5) * 0.06,
      driftY: (Math.random() - 0.5) * 0.06,
    }));
  }

  function draw(time) {
    ctx.clearRect(0, 0, width, height);
    const t = time / 1000;

    for (const star of stars) {
      star.x += star.driftX;
      star.y += star.driftY;

      if (star.x < 0) star.x = width;
      if (star.x > width) star.x = 0;
      if (star.y < 0) star.y = height;
      if (star.y > height) star.y = 0;

      const twinkle = 0.35 + 0.65 * Math.abs(Math.sin(t * star.twinkleSpeed + star.phase));
      const hue = (star.hue + t * star.hueSpeed) % 360;
      const color = `hsla(${hue}, 100%, 72%, ${twinkle})`;

      ctx.beginPath();
      ctx.fillStyle = color;
      ctx.shadowColor = `hsla(${hue}, 100%, 65%, ${twinkle})`;
      ctx.shadowBlur = star.radius * 4;
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    if (!prefersReducedMotion) {
      requestAnimationFrame(draw);
    }
  }

  resize();
  makeStars();
  window.addEventListener("resize", () => {
    resize();
    makeStars();
  });

  if (prefersReducedMotion) {
    draw(0);
  } else {
    requestAnimationFrame(draw);
  }
})();

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".publication-card");
const searchInput = document.getElementById("searchInput");

let activeFilter = "all";

function filterCards() {
  const searchText = searchInput.value.toLowerCase();

  cards.forEach((card) => {
    const category = card.getAttribute("data-category");
    const text = card.innerText.toLowerCase();

    const matchesFilter = activeFilter === "all" || category === activeFilter;
    const matchesSearch = text.includes(searchText);

    if (matchesFilter && matchesSearch) {
      card.style.display = "block";
      card.classList.add("visible"); // force-reveal even if never scrolled into view
    } else {
      card.style.display = "none";
    }
  });
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.getAttribute("data-filter");
    filterCards();
  });
});

searchInput.addEventListener("input", filterCards);

// Scroll reveal animation
const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
  revealElements.forEach((element) => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const visiblePoint = 100;

    if (elementTop < windowHeight - visiblePoint) {
      element.classList.add("visible");
    }
  });
}

window.addEventListener("scroll", revealOnScroll);
window.addEventListener("load", revealOnScroll);