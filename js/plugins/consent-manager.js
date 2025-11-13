// consent-manager.js - GNOTHE Psihoterapija
// Upravljanje kolačićima i GDPR pristankom

// ========================================
// GLAVNE FUNKCIJE ZA PRISTANAK
// ========================================

/**
 * Funkcija kada korisnik prihvati kolačiće
 */
function acceptCookies() {
  // Spremi pristanak u localStorage
  localStorage.setItem("cookieConsent", "accepted");
  localStorage.setItem("consentDate", new Date().toISOString());

  // Zapamti koje kategorije su prihvaćene
  const consentDetails = {
    necessary: true,
    analytics: true,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("consentDetails", JSON.stringify(consentDetails));

  // Aktiviraj Google Analytics
  activateGoogleAnalytics();

  // Sakrij banner
  hideCookieBanner();

  // Opcionalno: pošalji event u GA
  if (typeof gtag !== "undefined") {
    gtag("event", "cookie_consent", {
      event_category: "engagement",
      event_label: "accepted",
    });
  }

  console.log("✓ Kolačići prihvaćeni:", new Date().toLocaleString("hr-HR"));
}

/**
 * Funkcija kada korisnik odbije kolačiće
 */
function rejectCookies() {
  // Spremi odbijanje
  localStorage.setItem("cookieConsent", "rejected");
  localStorage.setItem("consentDate", new Date().toISOString());

  // Zapamti koje kategorije su odbijene
  const consentDetails = {
    necessary: true, // Nužni uvijek aktivni
    analytics: false,
    timestamp: new Date().toISOString(),
  };
  localStorage.setItem("consentDetails", JSON.stringify(consentDetails));

  // Obriši postojeće Google Analytics kolačiće
  deleteGoogleAnalyticsCookies();

  // Sakrij banner
  hideCookieBanner();

  console.log("✗ Kolačići odbijeni:", new Date().toLocaleString("hr-HR"));
}

/**
 * Funkcija za zatvaranje bannera bez odluke (X gumb)
 */
function closeBanner() {
  // Zapamti da je banner zatvoren za ovu sesiju
  sessionStorage.setItem("cookieBannerClosed", "true");

  // Sakrij banner
  hideCookieBanner();

  console.log("Banner zatvoren bez odluke");
}

// ========================================
// POMOĆNE FUNKCIJE
// ========================================

/**
 * Prikaži cookie banner
 */
function showCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    banner.classList.add("show");
    console.log("Cookie banner prikazan");

    // Fokusiraj na banner za pristupačnost
    const acceptBtn = banner.querySelector(".btn-accept");
    if (acceptBtn) {
      setTimeout(() => acceptBtn.focus(), 500);
    }
  }
}

/**
 * Sakrij cookie banner
 */
function hideCookieBanner() {
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    banner.classList.remove("show");
    // Potpuno ukloni nakon animacije
    setTimeout(() => {
      banner.style.display = "none";
    }, 500);
  }
}

/**
 * Aktiviraj Google Analytics
 */
function activateGoogleAnalytics() {
  if (typeof gtag !== "undefined") {
    // Ažuriraj consent status
    gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied", // Ne koristimo marketing kolačiće
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "granted",
    });

    console.log("📊 Google Analytics aktiviran");

    // Pošalji pageview event
    gtag("event", "page_view", {
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  } else {
    console.warn("Google Analytics (gtag) nije učitan");
  }
}

/**
 * Obriši Google Analytics kolačiće
 */
function deleteGoogleAnalyticsCookies() {
  // Lista GA kolačića
  const gaCookies = ["_ga", "_gid", "_gat", "_ga_"];

  // Obriši sve GA kolačiće
  document.cookie.split(";").forEach((cookie) => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();

    // Provjeri je li GA kolačić
    if (gaCookies.some((gaCookie) => name.startsWith(gaCookie))) {
      // Obriši kolačić
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${window.location.hostname}`;
      console.log(`Obrisan kolačić: ${name}`);
    }
  });
}

/**
 * Provjeri status pristanka pri učitavanju stranice
 */
function checkCookieStatus() {
  const consent = localStorage.getItem("cookieConsent");
  const bannerClosed = sessionStorage.getItem("cookieBannerClosed");

  console.log("Status pristanka:", consent || "nema odluke");

  // Ako je korisnik već dao pristanak
  if (consent === "accepted") {
    // Aktiviraj Google Analytics odmah
    activateGoogleAnalytics();
    return;
  }

  // Ako je korisnik odbio, osiguraj da GA ostane neaktivan
  if (consent === "rejected") {
    deleteGoogleAnalyticsCookies();
    return;
  }

  // Ako nema odluke i banner nije zatvoren u ovoj sesiji
  if (!consent && !bannerClosed) {
    // Pokaži banner nakon 1.5 sekunde
    setTimeout(() => {
      showCookieBanner();
    }, 1500);
  }
}

/**
 * Revidiraj pristanak (za Privacy Policy stranicu)
 */
function reviseCookieConsent() {
  // Obriši postojeći pristanak
  localStorage.removeItem("cookieConsent");
  localStorage.removeItem("consentDate");
  localStorage.removeItem("consentDetails");
  sessionStorage.removeItem("cookieBannerClosed");

  // Obriši kolačiće
  deleteGoogleAnalyticsCookies();

  // Ponovno pokaži banner
  showCookieBanner();

  console.log("Pristanak resetiran - banner ponovno prikazan");
}

// ========================================
// FUNKCIJE ZA PRIVACY POLICY STRANICU
// ========================================

/**
 * Prikaži trenutni status pristanka
 */
function displayConsentStatus() {
  const consent = localStorage.getItem("cookieConsent");
  const consentDate = localStorage.getItem("consentDate");
  const consentDetails = localStorage.getItem("consentDetails");

  const statusElement = document.getElementById("consent-status");
  if (statusElement) {
    let statusHTML = "<h3>Vaš trenutni pristanak:</h3>";

    if (consent) {
      const date = new Date(consentDate).toLocaleString("hr-HR");
      statusHTML += `<p>Status: <strong>${
        consent === "accepted" ? "Prihvaćen" : "Odbijen"
      }</strong></p>`;
      statusHTML += `<p>Datum: ${date}</p>`;

      if (consentDetails) {
        const details = JSON.parse(consentDetails);
        statusHTML += "<p>Kategorije:</p><ul>";
        statusHTML += `<li>Nužni kolačići: ✓</li>`;
        statusHTML += `<li>Analitički kolačići: ${
          details.analytics ? "✓" : "✗"
        }</li>`;
        statusHTML += "</ul>";
      }

      statusHTML +=
        '<button onclick="reviseCookieConsent()" class="btn-revise">Promijeni postavke</button>';
    } else {
      statusHTML += "<p>Niste još dali pristanak za kolačiće.</p>";
    }

    statusElement.innerHTML = statusHTML;
  }
}

// ========================================
// EVENT LISTENERS
// ========================================

/**
 * Dodaj keyboard support za pristupačnost
 */
function setupAccessibility() {
  const banner = document.getElementById("cookieBanner");
  if (!banner) return;

  // ESC zatvara banner
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && banner.classList.contains("show")) {
      closeBanner();
    }
  });

  // Tab trap unutar bannera kada je otvoren
  const focusableElements = banner.querySelectorAll(
    'button, a[href], [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length > 0) {
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    lastElement.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && !e.shiftKey) {
        e.preventDefault();
        firstElement.focus();
      }
    });

    firstElement.addEventListener("keydown", (e) => {
      if (e.key === "Tab" && e.shiftKey) {
        e.preventDefault();
        lastElement.focus();
      }
    });
  }
}

// ========================================
// INICIJALIZACIJA
// ========================================

/**
 * Inicijaliziraj cookie banner sustav
 */
function initCookieBanner() {
  // Provjeri status pristanka
  checkCookieStatus();

  // Postavi pristupačnost
  setupAccessibility();

  // Ako smo na Privacy Policy stranici, prikaži status
  if (window.location.pathname.includes("privacy")) {
    displayConsentStatus();
  }

  console.log("Cookie banner sustav inicijaliziran");
}

// ========================================
// POKRENI KAD SE DOM UČITA
// ========================================

// Provjeri je li DOM već učitan
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCookieBanner);
} else {
  // DOM je već učitan
  initCookieBanner();
}

// ========================================
// EXPORT FUNKCIJA (za debugging)
// ========================================

// Omogući pristup funkcijama iz konzole za testiranje
window.cookieBanner = {
  accept: acceptCookies,
  reject: rejectCookies,
  close: closeBanner,
  reset: reviseCookieConsent,
  checkStatus: () => {
    console.log("Consent:", localStorage.getItem("cookieConsent"));
    console.log("Date:", localStorage.getItem("consentDate"));
    console.log("Details:", localStorage.getItem("consentDetails"));
  },
};

// Log verziju skripte
console.log("Cookie Banner v1.0 - GNOTHE Psihoterapija");
