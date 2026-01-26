// Añadir evento al calendario
document.getElementById("add-calendar").addEventListener("click", function () {
  const event = {
    title: "Boda Carmen & Julio",
    description: "Boda de Carmen & Julio",
    location: "Hacienda de Xenis, Chucena",
    start: "2026-10-10T10:00:00",
    end: "2026-10-10T02:00:00",
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
DESCRIPTION:Recordatorio: Boda Carmen & Julio
END:VALARM
END:VEVENT
END:VCALENDAR`;

  // Descargar el archivo
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = "carmen-y-julio-10-10-2026.ics";
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

// Comprobar si ya se ha enviado el formulario
window.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("rsvpSubmitted") === "true") {
    showThankYouMessage();
  }
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const formData = {
    guestName: document.getElementById("guest-name").value,
    companionName: document.getElementById("companion-name").value,
    dietary: document.getElementById("dietary").value,
    message: document.getElementById("message").value,
    timestamp: new Date().toISOString(),
  };

  try {
    // Mostrar mensaje de carga
    formMessage.className =
      "mt-4 p-4 bg-neutral-100 border-l-4 border-neutral-500 text-neutral-800 font-sans";
    formMessage.textContent = "Enviando confirmación...";
    formMessage.classList.remove("hidden");

    // Enviar POST al servidor
    const response = await fetch(
      "https://admin.casadocondedental.es/api/wedding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      },
    );

    if (response.status === 201) {
      // Guardar en localStorage que ya se ha enviado
      localStorage.setItem("rsvpSubmitted", "true");
      localStorage.setItem("rsvpData", JSON.stringify(formData));

      // Mostrar mensaje de agradecimiento
      showThankYouMessage();
    } else {
      // Error del servidor
      formMessage.className =
        "mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 font-sans";
      formMessage.textContent =
        "Hubo un error al enviar tu confirmación. Por favor, inténtalo de nuevo.";
    }
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
    formMessage.className =
      "mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-800 font-sans";
    formMessage.textContent =
      "No se pudo conectar con el servidor. Por favor, verifica tu conexión e inténtalo de nuevo.";
  }
});

function showThankYouMessage() {
  // Ocultar el formulario
  form.style.display = "none";

  // Mostrar mensaje de agradecimiento
  const thankYouHTML = `
    <div class="text-center py-12">
      <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-neutral-900 mb-6">
        <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
      </div>
      <h3 class="font-display text-4xl md:text-5xl text-neutral-900 mb-4">¡Gracias!</h3>
      <p class="font-sans text-lg text-neutral-600 max-w-md mx-auto">
        Hemos recibido tu confirmación. ¡Nos vemos el 10 de Octubre de 2026 en Hacienda de Xenis!
      </p>
    </div>
  `;

  // Insertar el mensaje después del título de la sección
  const titleDiv = document.querySelector("#confirm");
  if (titleDiv) {
    titleDiv.insertAdjacentHTML("afterend", thankYouHTML);
  }

  // Ocultar el mensaje de error/éxito si existe
  formMessage.classList.add("hidden");
}

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

// Menú hamburguesa
const menuToggle = document.getElementById("menu-toggle");
const menuOverlay = document.getElementById("menu-overlay");
const menuLinks = document.querySelectorAll(".menu-link");

menuToggle.addEventListener("click", function () {
  const isOpen = menuOverlay.classList.contains("opacity-0");

  if (isOpen) {
    // Abrir menú
    menuOverlay.classList.remove("opacity-0", "pointer-events-none");
    menuOverlay.classList.add("opacity-100");
    // Animar hamburguesa a X
    const spans = menuToggle.querySelectorAll("span");
    spans[0].style.transform = "rotate(45deg) translateY(8px)";
    spans[1].style.opacity = "0";
    spans[2].style.transform = "rotate(-45deg) translateY(-8px)";
  } else {
    // Cerrar menú
    menuOverlay.classList.add("opacity-0", "pointer-events-none");
    menuOverlay.classList.remove("opacity-100");
    // Restaurar hamburguesa
    const spans = menuToggle.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "";
  }
});

// Cerrar menú al hacer clic en un enlace
menuLinks.forEach((link) => {
  link.addEventListener("click", function () {
    menuOverlay.classList.add("opacity-0", "pointer-events-none");
    menuOverlay.classList.remove("opacity-100");
    // Restaurar hamburguesa
    const spans = menuToggle.querySelectorAll("span");
    spans[0].style.transform = "";
    spans[1].style.opacity = "1";
    spans[2].style.transform = "";
  });
});
