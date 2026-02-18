const weddingDate = new Date("April 25, 2026 16:00:00").getTime();

function updateCountdown() {
  const now = new Date().getTime();
  const distance = weddingDate - now;

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = String(days).padStart(3, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(
    2,
    "0",
  );
  document.getElementById("seconds").textContent = String(seconds).padStart(
    2,
    "0",
  );

  if (distance < 0) {
    document.getElementById("countdown").innerHTML =
      '<div style="grid-column: 1/-1; font-size: 2rem;">¡Hoy es el gran día! 💑</div>';
  }
}

updateCountdown();
setInterval(updateCountdown, 1000);

// RSVP Form Handler
document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert(
    "¡Gracias por confirmar tu asistencia! Te enviaremos un email de confirmación pronto.",
  );
  // Aquí puedes agregar integración con servicios como Formspree, Google Forms, etc.
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

document.getElementById("rsvpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const formURL =
    "https://docs.google.com/forms/d/e/1FAIpQLScyyI3uvPSyMhMoHyrom425qCDgTeuT1vq5vg3nev169f1Gzg/formResponse";

  const formData = new FormData();
  formData.append("entry.1706339736", document.getElementById("nombre").value);
  formData.append("entry.1446504630", document.getElementById("email").value);
  formData.append(
    "entry.1641371121",
    document.getElementById("asistencia").value,
  );
  formData.append(
    "entry.1097505183",
    document.getElementById("invitados").value,
  );
  formData.append(
    "entry.1090726590",
    document.getElementById("restricciones").value,
  );
  formData.append("entry.1705162034", document.getElementById("cancion").value);
  formData.append("entry.98286622", document.getElementById("mensaje").value);

  fetch(formURL, {
    method: "POST",
    mode: "no-cors",
    body: formData,
  });

  alert("¡Gracias por confirmar! Nos vemos en la boda.");
  document.getElementById("rsvpForm").reset();
});

const dcState = {
  male: { cur: 0, total: 2, timer: null, paused: false },
  female: { cur: 0, total: 8, timer: null, paused: false },
};

let dcActive = "male";

function dcSwitch(gender) {
  dcActive = gender;
  document.querySelectorAll(".dc-btn").forEach((b, i) => {
    b.classList.toggle(
      "active",
      (i === 0 && gender === "male") || (i === 1 && gender === "female"),
    );
  });
  document
    .querySelectorAll(".dc-panel")
    .forEach((p) => p.classList.remove("active"));
  document.getElementById("dc-panel-" + gender).classList.add("active");
}

function dcGoto(gender, idx) {
  const s = dcState[gender];
  const slides = document.querySelectorAll("#dc-car-" + gender + " .dc-slide");
  const dots = document.querySelectorAll("#dc-dots-" + gender + " .dc-dot");
  slides[s.cur].classList.remove("active");
  dots[s.cur].classList.remove("active");
  s.cur = (idx + s.total) % s.total;
  slides[s.cur].classList.add("active");
  dots[s.cur].classList.add("active");
  document.getElementById("dc-count-" + gender).textContent =
    s.cur + 1 + " / " + s.total;
}

function dcMove(gender, dir) {
  dcGoto(gender, dcState[gender].cur + dir);
}

function dcStartTimer(gender) {
  dcState[gender].timer = setInterval(() => {
    if (!dcState[gender].paused) dcMove(gender, 1);
  }, 2000);
}

// Pause on hover
["male", "female"].forEach((g) => {
  const car = document.getElementById("dc-car-" + g);
  car.addEventListener("mouseenter", () => (dcState[g].paused = true));
  car.addEventListener("mouseleave", () => (dcState[g].paused = false));
  dcStartTimer(g);
});


// Música
document.addEventListener("click", function () {
  const music = document.getElementById("bgMusic");
  music.play();
}, { once: true });