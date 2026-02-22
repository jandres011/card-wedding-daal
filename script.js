// ══════════════════════════════════════════════════════════════
//  DAAL WEDDING — script.js
//  Enhanced with scroll reveals & micro-interactions
// ══════════════════════════════════════════════════════════════

// ── Hamburger ──────────────────────────────────────────────────
const btn  = document.getElementById("menuBtn");
const list = document.getElementById("menuList");

btn.addEventListener("click", () => {
  const isOpen = list.classList.toggle("open");
  btn.classList.toggle("open", isOpen);
  btn.setAttribute("aria-expanded", isOpen);
});

list.querySelectorAll("a").forEach((a) => {
  a.addEventListener("click", () => {
    list.classList.remove("open");
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded", false);
  });
});

// ── Countdown ──────────────────────────────────────────────────
const weddingDate = new Date("April 25, 2026 16:00:00").getTime();

function updateCountdown() {
  const now      = new Date().getTime();
  const distance = weddingDate - now;

  const days    = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  const fmt = (n) => String(n).padStart(3, "0");

  const dEl = document.getElementById("days");
  const hEl = document.getElementById("hours");
  const mEl = document.getElementById("minutes");
  const sEl = document.getElementById("seconds");

  // Flip animation on change
  function setIfChanged(el, val) {
    if (!el) return;
    if (el.textContent !== val) {
      el.classList.remove("flip");
      void el.offsetWidth; // reflow
      el.classList.add("flip");
      el.textContent = val;
    }
  }

  setIfChanged(dEl, fmt(days));
  setIfChanged(hEl, String(hours).padStart(2, "0"));
  setIfChanged(mEl, String(minutes).padStart(2, "0"));
  setIfChanged(sEl, String(seconds).padStart(2, "0"));

  if (distance < 0) {
    document.getElementById("countdown").innerHTML =
      '<div style="grid-column:1/-1;font-size:2rem;text-align:center;">¡Hoy es el gran día! 💑</div>';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// ── Smooth scroll ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ── RSVP form ─────────────────────────────────────────────────
const asistencia  = document.getElementById("asistencia");
const campoMensaje     = document.getElementById("campo-mensaje");
const campoInvitados   = document.getElementById("campo-invitados");
const campoRestricciones = document.getElementById("campo-restricciones");
const campoCancion     = document.getElementById("campo-cancion");

function actualizarCampos() {
  const noAsiste = asistencia.value === "No asistiré";
  campoMensaje.style.display      = noAsiste ? "none" : "block";
  campoInvitados.style.display    = noAsiste ? "none" : "block";
  campoRestricciones.style.display = noAsiste ? "none" : "block";
  campoCancion.style.display      = noAsiste ? "none" : "block";
}

asistencia.addEventListener("change", actualizarCampos);
actualizarCampos();

document.getElementById("rsvpForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const formURL  = "https://docs.google.com/forms/d/e/1FAIpQLScyyI3uvPSyMhMoHyrom425qCDgTeuT1vq5vg3nev169f1Gzg/formResponse";
  const formData = new FormData();
  const asiste   = document.getElementById("asistencia").value === "Si, asistiré con alegría";

  formData.append("entry.1706339736", document.getElementById("nombre").value);
  formData.append("entry.1446504630", document.getElementById("email").value);
  formData.append("entry.1641371121", document.getElementById("asistencia").value);
  formData.append("entry.1097505183", asiste ? document.getElementById("invitados").value   : "0 cupos");
  formData.append("entry.1090726590", asiste ? document.getElementById("restricciones").value : "No aplica");
  formData.append("entry.1705162034", asiste ? document.getElementById("cancion").value      : "No aplica");
  formData.append("entry.98286622",   asiste ? document.getElementById("mensaje").value      : "No asistiré");

  // Mark token as used
  if (typeof token !== "undefined" && token) {
    await sb.from("tokens").update({ usado: true }).eq("codigo", token);
  }

  fetch(formURL, { method: "POST", mode: "no-cors", body: formData });

  if (asiste) {
    emailjs.send(
      "GOCSPX-Dod9S5_xSH7lVCY4K",
      "template_i7xynyj",
      { name: document.getElementById("nombre").value, email: document.getElementById("email").value },
      "U3qTJ_CkBlfqlpOdv"
    );
    confetti({ particleCount: 300, spread: 100, origin: { y: 0.6 }, colors: ["#D4A574", "#E88D67", "#2C5F6F", "#ffffff"] });
    alert("¡Gracias por confirmar! Nos vemos en la boda. 🎊");
  } else {
    document.body.style.animation = "shake 0.4s ease";
    confetti({
      particleCount: 250,
      spread: 100,
      origin: { y: 0.6 },
      colors: ["#444444", "#555555", "#777777", "#2C5F6F"],
    });
    alert("Lamentamos que no puedas asistir. Esperamos verte pronto.");
  }

  document.getElementById("rsvpForm").reset();
  document.getElementById("rsvpForm").style.display = "none";
  actualizarCampos();
});

// ── Dress Code carousel ───────────────────────────────────────
const dcState = {
  male:   { cur: 0, total: 2, timer: null, paused: false },
  female: { cur: 0, total: 8, timer: null, paused: false },
};
let dcActive = "male";

function dcGoto(gender, idx) {
  const s      = dcState[gender];
  const slides = document.querySelectorAll("#dc-car-"  + gender + " .dc-slide");
  const dots   = document.querySelectorAll("#dc-dots-" + gender + " .dc-dot");

  slides[s.cur].classList.remove("active");
  dots[s.cur].classList.remove("active");
  s.cur = (idx + s.total) % s.total;
  slides[s.cur].classList.add("active");
  dots[s.cur].classList.add("active");
  document.getElementById("dc-count-" + gender).textContent = (s.cur + 1) + " / " + s.total;
}

function dcMove(gender, dir) { dcGoto(gender, dcState[gender].cur + dir); }

function dcStopTimer(gender)  { clearInterval(dcState[gender].timer); dcState[gender].timer = null; }
function dcStartTimer(gender) {
  dcStopTimer(gender);
  dcState[gender].timer = setInterval(() => { if (!dcState[gender].paused) dcMove(gender, 1); }, 4000);
}
function dcResetAndStart(gender) { dcGoto(gender, 0); dcStartTimer(gender); }

function dcSwitch(gender) {
  dcActive = gender;
  document.querySelectorAll(".dc-btn").forEach((b, i) => {
    b.classList.toggle("active", (i === 0 && gender === "male") || (i === 1 && gender === "female"));
  });
  document.querySelectorAll(".dc-panel").forEach((p) => p.classList.remove("active"));
  document.getElementById("dc-panel-" + gender).classList.add("active");
  dcStopTimer(gender === "male" ? "female" : "male");
  dcResetAndStart(gender);
}

["male", "female"].forEach((g) => {
  const car = document.getElementById("dc-car-" + g);
  car.addEventListener("mouseenter", () => (dcState[g].paused = true));
  car.addEventListener("mouseleave", () => (dcState[g].paused = false));

  // Touch/swipe support
  let touchStartX = 0;
  car.addEventListener("touchstart", (e) => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
  car.addEventListener("touchend",   (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) dcMove(g, diff > 0 ? 1 : -1);
  });
});

const dcSection  = document.getElementById("dresscode");
const dcObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { dcResetAndStart(dcActive); }
      else { dcStopTimer("male"); dcStopTimer("female"); }
    });
  },
  { threshold: 0.25 }
);
dcObserver.observe(dcSection);

// ── Video section ──────────────────────────────────────────────
const video   = document.getElementById("daal-video");
const section = document.getElementById("section-daal");

const videoObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) video.play();
      else video.pause();
    });
  },
  { threshold: 0.6 }
);
videoObserver.observe(section);

// ── Music button ───────────────────────────────────────────────
const musicBtn = document.getElementById("musicBtn");
const bgMusic  = document.getElementById("bgMusic");

musicBtn.addEventListener("click", () => {
  if (bgMusic.paused) {
    bgMusic.volume = 0.2;
    bgMusic.play();
    musicBtn.textContent = "❚❚";
    musicBtn.classList.add("playing");
  } else {
    bgMusic.pause();
    musicBtn.textContent = "▶";
    musicBtn.classList.remove("playing");
  }
});

// ── Nav adaptive theme ────────────────────────────────────────
(function () {
  const nav = document.querySelector("nav");

  const sectionThemes = [
    { selector: "#inicio",             theme: "theme-inicio" },
    { selector: ".countdown-section",  theme: "theme-countdown" },
    { selector: "#historia",           theme: "theme-historia" },
    { selector: "#evento",             theme: "theme-evento" },
    { selector: "#dresscode",          theme: "theme-dresscode" },
    { selector: "#rsvp",               theme: "theme-rsvp" },
    { selector: "#recomendados",       theme: "theme-recomendados" },
    { selector: "#section-daal",       theme: "theme-video" },
  ];

  const allThemes  = sectionThemes.map((s) => s.theme);
  const visibleMap = new Map();

  function setTheme(theme) {
    nav.classList.remove(...allThemes);
    if (theme) nav.classList.add(theme);
  }

  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const match = sectionThemes.find((s) => entry.target.matches(s.selector));
        if (!match) return;
        entry.isIntersecting ? visibleMap.set(entry.target, match.theme) : visibleMap.delete(entry.target);
      });

      if (!visibleMap.size) return;
      let bestTheme = null, minDist = Infinity;
      visibleMap.forEach((theme, el) => {
        const dist = Math.abs(el.getBoundingClientRect().top);
        if (dist < minDist) { minDist = dist; bestTheme = theme; }
      });
      if (bestTheme) setTheme(bestTheme);
    },
    { threshold: 0, rootMargin: "-60px 0px -55% 0px" }
  );

  sectionThemes.forEach(({ selector }) => {
    const el = document.querySelector(selector);
    if (el) navObserver.observe(el);
  });

  setTheme("theme-inicio");
})();

// ── Scroll Reveal ─────────────────────────────────────────────
(function () {
  // Add .reveal class to key elements automatically
  const targets = [
    "section h2",
    ".countdown-box",
    ".timeline-content",
    ".event-card",
    ".story-content p",
    ".dc-panel .dc-description",
    ".rsvp-form",
    "footer p",
    ".hashtag",
  ];

  targets.forEach((sel) => {
    document.querySelectorAll(sel).forEach((el) => {
      if (!el.classList.contains("reveal") &&
          !el.classList.contains("reveal-left") &&
          !el.classList.contains("reveal-right") &&
          !el.classList.contains("reveal-scale")) {
        el.classList.add("reveal");
      }
    });
  });

  // Add h2 special class for underline animation
  document.querySelectorAll("section h2").forEach((h) => {
    // is-visible handled by observer, keep reveal for h2 opacity only
  });

  // Stagger countdown boxes
  const countdownBoxes = document.querySelectorAll(".countdown-box");
  countdownBoxes.forEach((box, i) => {
    box.style.transitionDelay = (0.08 * i) + "s";
  });

  // Stagger timeline items alternating sides
  document.querySelectorAll(".timeline-item:nth-child(odd) .timeline-content").forEach((el) => {
    el.classList.remove("reveal");
    el.classList.add("reveal-left");
  });
  document.querySelectorAll(".timeline-item:nth-child(even) .timeline-content").forEach((el) => {
    el.classList.remove("reveal");
    el.classList.add("reveal-right");
  });

  // Observer
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-scale").forEach((el) => {
    revealObserver.observe(el);
  });
})();

// ── Autenticación Supabase ────────────────────────────────────
const SUPABASE_URL  = 'https://oyyehipwuipkopvnvzck.supabase.co';
const SUPABASE_ANON = 'sb_publishable_NrN6Sc2wTvKCK1CCh5Zvyw_FtuIsLVB';

const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

const params = new URLSearchParams(window.location.search);
const token  = params.get("codigo");

if (token) {
  verificarToken(token);
} else {
  window.location.href = "private.html";
}

async function verificarToken(token) {
  const { data } = await sb
    .from("tokens")
    .select("*")
    .eq("codigo", token)
    .single();

  if (data && !data.usado) {
    document.getElementById("rsvpForm").style.display = "block";
  } else if (data && data.usado) {
    document.getElementById("li-rsvp").style.display = "none";
    document.getElementById("rsvp").style.display = "none";
  } else {
    window.location.href = "private.html";
  }
}
