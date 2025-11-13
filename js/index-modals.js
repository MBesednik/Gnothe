/* -------------------------------------------

GNOTHE - Index Page Modal & Form Functionality
Handles EmailJS integration, modals, and form submissions

------------------------------------------- */

// ============================================
// EMAILJS INICIJALIZACIJA
// ============================================
(function () {
  console.log("Inicijalizujem EmailJS sa Public Key: 2OG-XdSwXIE-FanHB");
  emailjs.init("2OG-XdSwXIE-FanHB");
  console.log("EmailJS objekat:", emailjs);
})();

// ============================================
// GLAVNA FUNKCIONALNOST - DOM READY
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  // ============================================
  // INTERSECTION OBSERVER - SCROLL ANIMACIJE
  // ============================================
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animationDelay = "0s";
        entry.target.classList.add("visible");
      }
    });
  }, observerOptions);

  document.querySelectorAll(".service-item").forEach((item) => {
    observer.observe(item);
  });

  // ============================================
  // PARALLAX EFEKT (DESKTOP ONLY)
  // ============================================
  if (window.innerWidth > 768) {
    document.addEventListener("mousemove", (e) => {
      const images = document.querySelectorAll(".image-content svg");
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;

      images.forEach((img) => {
        img.style.transform = `translateX(${x}px) translateY(${y}px)`;
      });
    });
  }

  // ============================================
  // MODAL 1: EGO ANALYSIS MODAL
  // ============================================
  const egoModal = document.getElementById("egoAnalysisModal");
  const openBtns = document.querySelectorAll(".service-button");
  const egoCloseBtn = egoModal?.querySelector(".ego-modal-close");
  const form = document.getElementById("contactForm");
  let selectedService = "";

  if (egoModal && egoCloseBtn) {
    // Otvori modal za sve buttone
    openBtns.forEach((btn, index) => {
      btn.onclick = function () {
        egoModal.style.display = "block";
        document.body.style.overflow = "hidden";

        const services = [
          "Individualno savjetovanje",
          "Partnersko savjetovanje",
          "Grupno savjetovanje",
          "Program podrške zaposlenicima (EAP)",
        ];
        selectedService = services[index];
        console.log("Otvorena usluga:", selectedService);
      };
    });

    // Zatvori modal - X button
    egoCloseBtn.onclick = function () {
      egoModal.style.display = "none";
      document.body.style.overflow = "";
      resetEgoModal();
    };

    // Reset funkcija
    function resetEgoModal() {
      form?.reset();
      const modalLoader = document.getElementById("modalLoader");
      if (modalLoader) modalLoader.style.display = "none";
      selectedService = "";
    }
  }

  // ============================================
  // MODAL 2: COMPANY MODAL
  // ============================================
  const companyModal = document.getElementById("companyModal");
  const companyCloseBtn = companyModal?.querySelector(".ego-modal-close");

  if (companyModal && companyCloseBtn) {
    // Funkcija za otvaranje
    window.openCompanyModal = function () {
      companyModal.style.display = "block";
      document.body.style.overflow = "hidden";
    };

    // Funkcija za zatvaranje
    function closeCompanyModal() {
      companyModal.style.display = "none";
      document.body.style.overflow = "";
    }

    // Zatvori modal - X button
    companyCloseBtn.addEventListener("click", function (e) {
      e.preventDefault();
      closeCompanyModal();
    });

    // Zatvori modal - klik izvan
    companyModal.addEventListener("click", function (event) {
      if (event.target === companyModal) {
        closeCompanyModal();
      }
    });

    // Zatvori modal - ESC tipka
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && companyModal.style.display === "block") {
        closeCompanyModal();
      }
    });
  }

  // ============================================
  // ZATVARANJE BILO KOJEG MODALA KLIKOM IZVAN
  // ============================================
  window.onclick = function (event) {
    // Zatvori Ego Analysis Modal
    if (event.target == egoModal && egoModal) {
      egoModal.style.display = "none";
      document.body.style.overflow = "";
      const modalLoader = document.getElementById("modalLoader");
      if (modalLoader) modalLoader.style.display = "none";
      form?.reset();
      selectedService = "";
    }

    // Zatvori Company Modal
    if (event.target == companyModal && companyModal) {
      companyModal.style.display = "none";
      document.body.style.overflow = "";
    }
  };

  // ============================================
  // TOAST NOTIFIKACIJE
  // ============================================
  window.showToast = function (id, message) {
    const toast = document.getElementById(id);
    if (message) {
      toast.textContent = message;
    }
    toast.classList.add("show");
    setTimeout(() => {
      hideToast(id);
    }, 5000);
  };

  function hideToast(id) {
    const toast = document.getElementById(id);
    toast.classList.remove("show");
  }

  // ============================================
  // HELPER FUNKCIJA - TRENUTNI DATUM
  // ============================================
  function getCurrentDate() {
    const now = new Date();
    const day = now.getDate().toString().padStart(2, "0");
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
  }

  // ============================================
  // FORMA 1: INDIVIDUALNA FORMA (EGO MODAL)
  // ============================================
  function sendEmail(event) {
    event.preventDefault();
    const submitBtn = document.getElementById("submitBtn");
    const modalLoader = document.getElementById("modalLoader");

    submitBtn.disabled = true;
    modalLoader.style.display = "flex";

    const currentDate = getCurrentDate();
    const templateParams = {
      user_name: document.getElementById("userName").value,
      user_email: document.getElementById("userEmail").value,
      message: document.getElementById("message").value,
      service_type: selectedService,
      current_date: currentDate,
      to_email: "info@gnothe.com",
    };

    console.log("Šaljem email za uslugu:", selectedService);

    emailjs
      .send("service_ssu11dk", "template_klby8m9", templateParams)
      .then(
        function (response) {
          console.log("SUCCESS!", response.status, response.text);
          modalLoader.style.display = "none";
          egoModal.style.display = "none";
          document.body.style.overflow = "";
          showToast(
            "successMessage",
            "Upit je uspješno poslan, očekujte odgovor unutar 24 sata."
          );
          form.reset();
          selectedService = "";
        },
        function (error) {
          console.log("FAILED...", error);
          modalLoader.style.display = "none";
          const errorMessage = `Dogodila se greška: ${
            error.text || error.message || "Pokušajte ponovo."
          }`;
          showToast("errorMessage", errorMessage);
        }
      )
      .finally(function () {
        submitBtn.disabled = false;
      });
  }

  // Event listener za individualnu formu
  if (form) {
    form.addEventListener("submit", sendEmail);
  }

  // ============================================
  // FORMA 2: COMPANY FORMA
  // ============================================
  function sendCompanyEmail(event) {
    event.preventDefault();

    console.log("Company forma submitted - pokrećem slanje emaila...");

    const companySubmitBtn = document.getElementById("companySubmitBtn");
    const companyModalLoader = document.getElementById("companyModalLoader");
    const companyForm = document.getElementById("companyForm");

    // Prikupi odabrane usluge (checkboxes)
    const servicesCheckboxes = document.querySelectorAll(
      'input[name="services[]"]:checked'
    );

    // Validacija - provjerava da li je barem jedan checkbox odabran
    if (servicesCheckboxes.length === 0) {
      showToast("errorMessage", "Molimo odaberite barem jednu uslugu!");
      return;
    }

    // Onemogući button i prikaži loader
    companySubmitBtn.disabled = true;
    companyModalLoader.style.display = "flex";

    // Prikupi podatke iz forme
    const companyName = document.getElementById("companyName").value;
    const employeeCount = document.getElementById("employeeCount").value;
    const contactPerson = document.getElementById("contactPerson").value;
    const contactEmail = document.getElementById("contactEmail").value;
    const contactPhone = document.getElementById("contactPhone").value;

    const servicesArray = Array.from(servicesCheckboxes).map((checkbox) => {
      return checkbox.nextElementSibling.textContent.trim();
    });
    const servicesText = servicesArray.join("\n• ");

    // Datum
    const currentDate = getCurrentDate();

    // Template parametri
    const templateParams = {
      company_name: companyName,
      employee_count: employeeCount,
      contact_person: contactPerson,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      services: "• " + servicesText,
      current_date: currentDate,
      to_email: "info@gnothe.com",
    };

    console.log("Šaljem company email sa parametrima:", templateParams);

    // Pošalji email
    emailjs
      .send("service_ssu11dk", "template_4gpce12", templateParams)
      .then(
        function (response) {
          console.log("Company email SUCCESS!", response.status, response.text);

          // Sakrij loader
          companyModalLoader.style.display = "none";

          // Zatvori modal
          companyModal.style.display = "none";
          document.body.style.overflow = "";

          // Prikaži success toast
          showToast(
            "successMessage",
            "Upit je uspješno poslan, očekujte odgovor unutar 24 sata."
          );

          // Resetuj formu
          companyForm.reset();
        },
        function (error) {
          console.log("Company email FAILED...", error);

          // Sakrij loader
          companyModalLoader.style.display = "none";

          // Prikaži error toast
          const errorMessage = `Dogodila se greška: ${
            error.text || error.message || "Pokušajte ponovo."
          }`;
          showToast("errorMessage", errorMessage);
        }
      )
      .finally(function () {
        // Omogući button ponovo
        companySubmitBtn.disabled = false;
      });
  }

  // Event listener za company formu
  const companyForm = document.getElementById("companyForm");
  if (companyForm) {
    console.log("Company forma pronađena - dodajem event listener");
    companyForm.addEventListener("submit", sendCompanyEmail);
  } else {
    console.error("Company forma NIJE pronađena!");
  }

  // ============================================
  // STAGGER ANIMACIJE - PAGE LOAD
  // ============================================
  window.addEventListener("load", () => {
    const elements = document.querySelectorAll(".text-content, .image-content");
    elements.forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
  });
});
