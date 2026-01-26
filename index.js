// Añadir evento al calendario
document.getElementById("add-calendar").addEventListener("click", function () {
  const event = {
    title: "Boda - Hacienda de Xenis",
    description: "Celebración de nuestra boda en Hacienda de Xenis, Chucena",
    location: "Hacienda de Xenis, Chucena",
    start: "2026-10-10T17:00:00",
    end: "2026-10-11T04:00:00",
  };

  // Crear archivo .ics
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Nuestra Boda//ES
BEGIN:VEVENT
UID:${Date.now()}@bodainvitacion.com
DTSTAMP:${formatDateForICS(new Date())}
DTSTART:${formatDateForICS(new Date(event.start))}
DTEND:${formatDateForICS(new Date(event.end))}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
LOCATION:${event.location}
STATUS:CONFIRMED
SEQUENCE:0
BEGIN:VALARM
TRIGGER:-P1W
ACTION:DISPLAY
DESCRIPTION:Recordatorio: Boda en una semana
END:VALARM
END:VEVENT
END:VCALENDAR`;

  // Descargar el archivo
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "boda-10-10-2026.ics";
  link.click();
});

// Función para formatear fecha en formato ICS
function formatDateForICS(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}T${hours}${minutes}${seconds}`;
}

// Copiar número de cuenta
document.getElementById("copy-iban").addEventListener("click", function () {
  const iban = "ES93 0073 0100 5105 7530 1567";

  navigator.clipboard
    .writeText(iban)
    .then(() => {
      const button = document.getElementById("copy-iban");
      const originalText = button.innerHTML;

      button.innerHTML = `
      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      ¡Copiado!
    `;

      setTimeout(() => {
        button.innerHTML = originalText;
      }, 2000);
    })
    .catch((err) => {
      console.error("Error al copiar:", err);
    });
});

// Formulario de confirmación
const form = document.getElementById("rsvp-form");
const formMessage = document.getElementById("form-message");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const formData = {
    guestName: document.getElementById("guest-name").value,
    companionName: document.getElementById("companion-name").value,
    dietary: document.getElementById("dietary").value,
    message: document.getElementById("message").value,
    timestamp: new Date().toISOString(),
  };

  // Aquí puedes enviar los datos a un servidor
  // Por ahora, solo mostramos un mensaje de confirmación
  console.log("Datos del formulario:", formData);

  // Mostrar mensaje de éxito
  formMessage.className =
    "mt-4 p-4 bg-neutral-100 border-l-4 border-neutral-900 text-neutral-800 font-sans";
  formMessage.textContent =
    "✓ ¡Gracias por confirmar tu asistencia! Nos vemos el 10 de Octubre de 2026";
  formMessage.classList.remove("hidden");

  // Limpiar formulario
  form.reset();

  // Guardar en localStorage (opcional)
  const savedRSVPs = JSON.parse(localStorage.getItem("rsvps") || "[]");
  savedRSVPs.push(formData);
  localStorage.setItem("rsvps", JSON.stringify(savedRSVPs));

  // Scroll suave al mensaje
  formMessage.scrollIntoView({ behavior: "smooth", block: "center" });

  // Ocultar mensaje después de 5 segundos
  setTimeout(() => {
    formMessage.classList.add("hidden");
  }, 5000);
});

// Animación de scroll suave para todos los enlaces internos
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

// Animación de scroll reveal para secciones
const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
};

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("section-visible");
    } else {
      entry.target.classList.remove("section-visible");
    }
  });
}, observerOptions);

// Observar todas las secciones
const sections = document.querySelectorAll("section");
sections.forEach((section) => {
  section.classList.add("section-hidden");
  sectionObserver.observe(section);
});

// Efecto parallax suave en scroll para imágenes
let ticking = false;

window.addEventListener("scroll", function () {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const scrolled = window.pageYOffset;
      const parallaxElements = document.querySelectorAll(".photo-card");

      parallaxElements.forEach((el, index) => {
        const speed = 0.02;
        const offset = scrolled * speed;
        el.style.transform = `translateY(${offset}px)`;
      });

      ticking = false;
    });
    ticking = true;
  }
});
