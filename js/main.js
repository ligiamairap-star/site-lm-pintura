/* ==========================================================================
   LM - PINTURA EM GERAL · Scripts Principais
   ========================================================================== */

/* CONFIGURAÇÃO RÁPIDA DE CONTATO */
const WHATSAPP_NUMBER = "5511960637781"; // (11) 96063-7781 - Leonildo

/* 1. Cabeçalho Fixo e Menu Mobile ---------------------------------------- */
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const navToggle = document.getElementById("nav-toggle");

window.addEventListener(
  "scroll",
  () => {
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  },
  { passive: true }
);

if (navToggle && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* Links dinâmicos de WhatsApp -------------------------------------------- */
document.querySelectorAll("[data-whats]").forEach((el) => {
  const msg = el.getAttribute("data-whats") || "Olá! Gostaria de pedir um orçamento com a LM Pintura.";
  el.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  el.target = "_blank";
  el.rel = "noopener";
});

/* 2. Hero Carrossel Automático (troca a cada 4 segundos) ----------------- */
const heroSlides = [...document.querySelectorAll(".hero__slide")];
const heroDots = [...document.querySelectorAll("[data-hero-dot]")];
let currentHeroSlide = 0;
let heroInterval = null;

function showHeroSlide(index) {
  currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, i) => {
    slide.classList.toggle("is-active", i === currentHeroSlide);
  });
  heroDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === currentHeroSlide);
  });
}

function startHeroAutoPlay() {
  stopHeroAutoPlay();
  heroInterval = setInterval(() => {
    showHeroSlide(currentHeroSlide + 1);
  }, 4000);
}

function stopHeroAutoPlay() {
  if (heroInterval) clearInterval(heroInterval);
}

heroDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const index = Number(dot.getAttribute("data-hero-dot"));
    showHeroSlide(index);
    startHeroAutoPlay();
  });
});

if (heroSlides.length > 0) {
  startHeroAutoPlay();
}

/* 5. Antes e Depois - Carrossel de Arrastar (Touch + Mouse) -------------- */
const baCarousel = document.getElementById("ba-carousel");
const baPrev = document.getElementById("ba-prev");
const baNext = document.getElementById("ba-next");

if (baCarousel) {
  const getScrollStep = () => {
    const firstCard = baCarousel.querySelector(".ba-card");
    return firstCard ? firstCard.offsetWidth + 24 : 340;
  };

  if (baPrev) {
    baPrev.addEventListener("click", () => {
      baCarousel.scrollBy({ left: -getScrollStep(), behavior: "smooth" });
    });
  }

  if (baNext) {
    baNext.addEventListener("click", () => {
      baCarousel.scrollBy({ left: getScrollStep(), behavior: "smooth" });
    });
  }

  // Arrastar com o mouse no desktop (no celular o touch scroll-snap já é nativo)
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  baCarousel.addEventListener("mousedown", (e) => {
    isDown = true;
    baCarousel.classList.add("is-dragging");
    startX = e.pageX - baCarousel.offsetLeft;
    scrollLeft = baCarousel.scrollLeft;
  });

  baCarousel.addEventListener("mouseleave", () => {
    isDown = false;
    baCarousel.classList.remove("is-dragging");
  });

  baCarousel.addEventListener("mouseup", () => {
    isDown = false;
    baCarousel.classList.remove("is-dragging");
  });

  baCarousel.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - baCarousel.offsetLeft;
    const walk = (x - startX) * 1.4;
    baCarousel.scrollLeft = scrollLeft - walk;
  });
}

/* 9. Depoimentos - Carrossel Pequeno ------------------------------------- */
const testimonialCards = [...document.querySelectorAll(".testimonial-card")];
const testimonialDots = [...document.querySelectorAll("[data-test-dot]")];
const testPrev = document.getElementById("test-prev");
const testNext = document.getElementById("test-next");
let currentTestimonial = 0;

function showTestimonial(index) {
  currentTestimonial = (index + testimonialCards.length) % testimonialCards.length;
  testimonialCards.forEach((card, i) => {
    card.classList.toggle("is-active", i === currentTestimonial);
  });
  testimonialDots.forEach((dot, i) => {
    dot.classList.toggle("is-active", i === currentTestimonial);
  });
}

if (testPrev) {
  testPrev.addEventListener("click", () => showTestimonial(currentTestimonial - 1));
}
if (testNext) {
  testNext.addEventListener("click", () => showTestimonial(currentTestimonial + 1));
}
testimonialDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    showTestimonial(Number(dot.getAttribute("data-test-dot")));
  });
});

// Troca automática suave dos depoimentos a cada 6 segundos
if (testimonialCards.length > 1) {
  setInterval(() => {
    showTestimonial(currentTestimonial + 1);
  }, 6000);
}

/* Galeria de Fotos: Filtro por Categoria + Lightbox Tela Cheia ----------- */
const filterButtons = [...document.querySelectorAll(".gallery-filter")];
const galleryCards = [...document.querySelectorAll("#gallery-grid .portfolio-card")];

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const filter = btn.getAttribute("data-filter");
    filterButtons.forEach((b) => b.classList.toggle("is-active", b === btn));
    galleryCards.forEach((card) => {
      const cat = card.getAttribute("data-category");
      const show = filter === "all" || cat === filter;
      card.classList.toggle("is-hidden", !show);
    });
  });
});

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxClose = document.getElementById("lightbox-close");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
let currentLightboxIndex = 0;

function getVisibleGalleryCards() {
  return galleryCards.filter((c) => !c.classList.contains("is-hidden"));
}

function openLightbox(index) {
  const visible = getVisibleGalleryCards();
  if (!visible.length) return;
  currentLightboxIndex = (index + visible.length) % visible.length;
  const card = visible[currentLightboxIndex];
  lightboxImg.src = card.getAttribute("data-lightbox-src");
  lightboxImg.alt = card.getAttribute("data-lightbox-caption") || "";
  lightboxCaption.textContent = card.getAttribute("data-lightbox-caption") || "";
  lightbox.classList.add("is-open");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightbox() {
  lightbox.classList.remove("is-open");
  lightbox.setAttribute("aria-hidden", "true");
}

galleryCards.forEach((card) => {
  card.addEventListener("click", () => {
    const visible = getVisibleGalleryCards();
    const idx = visible.indexOf(card);
    openLightbox(idx >= 0 ? idx : 0);
  });
});

if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
if (lightboxPrev) lightboxPrev.addEventListener("click", () => openLightbox(currentLightboxIndex - 1));
if (lightboxNext) lightboxNext.addEventListener("click", () => openLightbox(currentLightboxIndex + 1));
if (lightbox) {
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
}
document.addEventListener("keydown", (e) => {
  if (!lightbox || !lightbox.classList.contains("is-open")) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") openLightbox(currentLightboxIndex - 1);
  if (e.key === "ArrowRight") openLightbox(currentLightboxIndex + 1);
});
