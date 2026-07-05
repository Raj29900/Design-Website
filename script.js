/* =====================================================
   RAHUL — ENGINEERING DESIGN | SIGNAL
   Interactions: mobile nav, scroll reveal, active nav
   link tracking, header state, progress bar, canvas RGB
   particle background, RGB cursor-glow on hoverable cards
   ===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById("menuToggle");
  const navMenu = document.getElementById("navMenu");

  if (menuToggle && navMenu) {
    const closeMenu = () => {
      navMenu.classList.remove("show");
      menuToggle.setAttribute("aria-expanded", "false");
    };

    menuToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("show");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close menu when clicking outside it
    document.addEventListener("click", (e) => {
      const isOpen = navMenu.classList.contains("show");
      if (isOpen && !navMenu.contains(e.target) && e.target !== menuToggle) {
        closeMenu();
      }
    });

    // Close menu on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMenu.classList.contains("show")) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  /* ---------- Header scroll state + progress bar ---------- */
  const header = document.querySelector(".header");
  const progressBar = document.getElementById("scrollProgress");

  const onScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (progressBar) progressBar.style.width = progress + "%";
    if (header) header.classList.toggle("scrolled", scrollTop > 12);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Scroll-reveal animation ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window && revealEls.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("in-view");
            }, (i % 6) * 80);
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    revealEls.forEach((el) => revealObserver.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("in-view"));
  }

  /* ---------- Active nav link tracking ---------- */
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  if ("IntersectionObserver" in window && sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              const match = link.getAttribute("href") === `#${id}`;
              link.classList.toggle("active", match);
            });
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    sections.forEach((section) => navObserver.observe(section));
  }

  /* ---------- RGB cursor-glow on hoverable cards ---------- */
  const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const glowCards = document.querySelectorAll(".glow-card");

  if (isFinePointer && glowCards.length) {
    glowCards.forEach((card) => {
      let hueRaf = null;
      let hue = Math.floor(Math.random() * 360);

      const spinHue = () => {
        hue = (hue + 1.4) % 360;
        card.style.setProperty("--hue", hue.toFixed(1));
        hueRaf = requestAnimationFrame(spinHue);
      };

      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const mx = ((e.clientX - rect.left) / rect.width) * 100;
        const my = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty("--mx", `${mx}%`);
        card.style.setProperty("--my", `${my}%`);
      });

      card.addEventListener("mouseenter", () => {
        if (!hueRaf) hueRaf = requestAnimationFrame(spinHue);
      });

      card.addEventListener("mouseleave", () => {
        if (hueRaf) {
          cancelAnimationFrame(hueRaf);
          hueRaf = null;
        }
      });
    });
  }

  /* ---------- Canvas RGB particle background ---------- */
  const canvas = document.getElementById("particleCanvas");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (canvas && canvas.getContext && !prefersReducedMotion) {
    const ctx = canvas.getContext("2d");
    let width, height, particles;
    const COLORS = ["#ff2d78", "#ffb020", "#3cff9e", "#45e0ff", "#b23cff", "#3556ff"];

    const getParticleCount = () =>
      Math.min(70, Math.floor((window.innerWidth * window.innerHeight) / 22000));

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const createParticles = () => {
      const particleCount = getParticleCount();
      particles = Array.from({ length: particleCount }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      }));
    };

    resize();
    createParticles();
    window.addEventListener("resize", () => {
      resize();
      createParticles();
    });

    const LINK_DIST = 130;

    const drawFrame = () => {
      ctx.clearRect(0, 0, width, height);

      // update + draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.fill();
      });
      ctx.shadowBlur = 0;

      // faint connecting lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < LINK_DIST) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(120, 160, 255, ${0.12 * (1 - dist / LINK_DIST)})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(drawFrame);
    };

    requestAnimationFrame(drawFrame);
  }
});
