// JavaScript za izračun rezultata, prikaz grafova i upravljanje UI elementima
document.addEventListener("DOMContentLoaded", function () {
  // Dohvati potrebne elemente
  const calculateBtn = document.getElementById("calculateBtn");
  const questionnaireForm = document.querySelector(".questionnaire__form");
  const theory = document.querySelector(".theory");
  const results = document.getElementById("results");
  const showGraphBtn = document.getElementById("showGraphBtn");
  const graphPopup = document.getElementById("graphPopup");
  const closePopup = document.querySelector(".graph-popup__close");

  // Inicijalizacija varijabli za grafikone
  let pieChart = null;
  let barChart = null;
  let radarChart = null;

  // Dodaj CSS animaciju za spinner ako ne postoji
  const existingAnimation = document.querySelector("#loader-animation");
  if (!existingAnimation) {
    const styleElement = document.createElement("style");
    styleElement.id = "loader-animation";
    styleElement.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Funkcija za stvaranje i prikazivanje loadera
  function showLoader() {
    // Ukloni postojeći loader ako postoji
    const oldLoader = document.querySelector(".loader");
    if (oldLoader) {
      oldLoader.parentNode.removeChild(oldLoader);
    }

    // Stvori novi loader
    const newLoader = document.createElement("div");
    newLoader.className = "loader";
    newLoader.style.display = "flex";
    newLoader.style.justifyContent = "center";
    newLoader.style.alignItems = "center";
    newLoader.style.position = "fixed";
    newLoader.style.top = "0";
    newLoader.style.left = "0";
    newLoader.style.width = "100%";
    newLoader.style.height = "100%";
    newLoader.style.backgroundColor = "rgba(255, 255, 255, 0.95)";
    newLoader.style.zIndex = "9999";

    // Stvori spinner
    const spinner = document.createElement("div");
    spinner.className = "loader__spinner";
    spinner.style.width = "60px";
    spinner.style.height = "60px";
    spinner.style.border = "6px solid rgba(93, 194, 165, 0.2)";
    spinner.style.borderRadius = "50%";
    spinner.style.borderTop = "6px solid #5dc2a5";
    spinner.style.animation = "spin 1s linear infinite";

    // Dodaj spinner u loader
    newLoader.appendChild(spinner);

    // Dodaj loader na početak body elementa
    document.body.insertBefore(newLoader, document.body.firstChild);

    console.log("Loader dinamički kreiran i prikazan!");
    return newLoader;
  }

  // Dodaj event listener na gumb za izračun
  calculateBtn.addEventListener("click", function () {
    // Provjera jesu li sva pitanja odgovorena
    const form = document.getElementById("questionnaireForm");
    const questions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
    let allAnswered = true;

    for (let q of questions) {
      const answered = form.querySelector(`input[name="${q}"]:checked`);
      if (!answered) {
        allAnswered = false;
        break;
      }
    }

    if (!allAnswered) {
      alert("Molimo odgovorite na sva pitanja prije izračuna rezultata.");
      return;
    }

    // Sakrij upitnik
    questionnaireForm.style.display = "none";

    // Sakrij teorijsku sekciju
    theory.style.display = "none";

    // Prikaži loader koristeći našu novu funkciju
    const loader = showLoader();

    // Izračunaj rezultate
    let parentCount = 0;
    let adultCount = 0;
    let childCount = 0;

    for (let q of questions) {
      const answer = form.querySelector(`input[name="${q}"]:checked`).value;
      if (answer === "parent") parentCount++;
      else if (answer === "adult") adultCount++;
      else if (answer === "child") childCount++;
    }

    const totalQuestions = questions.length;
    const parentPercentage = Math.round((parentCount / totalQuestions) * 100);
    const adultPercentage = Math.round((adultCount / totalQuestions) * 100);
    const childPercentage = Math.round((childCount / totalQuestions) * 100);

    // Postavi vrijednosti za rezultate
    document.getElementById("parentPercentage").textContent = parentPercentage;
    document.getElementById("adultPercentage").textContent = adultPercentage;
    document.getElementById("childPercentage").textContent = childPercentage;

    document.getElementById("parentBar").style.width = parentPercentage + "%";
    document.getElementById("adultBar").style.width = adultPercentage + "%";
    document.getElementById("childBar").style.width = childPercentage + "%";

    // Određivanje dominantnog ego stanja
    let dominantState = "";
    let dominantPercentage = 0;

    if (
      parentPercentage >= adultPercentage &&
      parentPercentage >= childPercentage
    ) {
      dominantState = "Roditelj";
      dominantPercentage = parentPercentage;
    } else if (
      adultPercentage >= parentPercentage &&
      adultPercentage >= childPercentage
    ) {
      dominantState = "Odrasli";
      dominantPercentage = adultPercentage;
    } else {
      dominantState = "Dijete";
      dominantPercentage = childPercentage;
    }

    // Prikaz dominantnog ego stanja i interpretacije
    const dominantElement = document.getElementById("dominantEgoState");
    dominantElement.innerHTML = `<p class="results__dominant-text">Vaše dominantno ego stanje je <span class="results__ego-name">${dominantState}</span> (${dominantPercentage}%).</p>`;

    if (dominantState === "Roditelj") {
      dominantElement.innerHTML += `<p class="results__dominant-text">Ovo ego stanje često uključuje brigu o drugima, davanjem savjeta i pružanjem podrške. Možete biti pažljivi prema potrebama drugih, ali ponekad i previše zabrinuti oko toga što drugi misle ili očekuju od vas.</p>`;
    } else if (dominantState === "Odrasli") {
      dominantElement.innerHTML += `<p class="results__dominant-text">Ovo ego stanje karakterizira racionalno razmišljanje, objektivna analiza situacije i traženje praktičnih rješenja. Pristupate izazovima smireno i metodički, donoseći odluke temeljene na činjenicama.</p>`;
    } else {
      dominantElement.innerHTML += `<p class="results__dominant-text">Ovo ego stanje se očituje kroz spontanost, emocionalne reakcije i želju za igrom. Iskreno izražavate svoje osjećaje i možete biti kreativni, ali ponekad reagirate impulzivnije u stresnim situacijama.</p>`;
    }

    // Nakon 3 sekunde, sakrij loader i prikaži rezultate
    setTimeout(function () {
      // Sakrij loader
      if (loader) {
        loader.style.display = "none";
      }

      // Prikaži rezultate s animacijom
      results.style.display = "block";

      // Malo odgode prije animacije radi boljeg efekta
      setTimeout(function () {
        results.classList.add("results--visible");

        // Scroll do rezultata
        results.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }, 3000); // 3 sekunde delay
  });

  // Kod za popup s grafovima
  if (showGraphBtn) {
    showGraphBtn.addEventListener("click", function () {
      // Onemogući scrollanje na body elementu
      document.body.style.overflow = "hidden";
      document.body.style.width = "100%";
      document.body.style.position = "fixed";

      // Prikaži popup
      graphPopup.style.display = "flex";

      // Odgodite vidljivost popupa za bolju animaciju
      setTimeout(() => {
        graphPopup.classList.add("graph-popup--visible");

        // Dodatno odgodite renderiranje grafova za stabilniji prikaz
        setTimeout(() => {
          renderCharts();
        }, 300);
      }, 50);
    });
  }

  // Zatvaranje popupa
  if (closePopup) {
    closePopup.addEventListener("click", function () {
      closeModal();
    });
  }

  // Zatvaranje popupa klikom izvan sadržaja
  graphPopup.addEventListener("click", function (e) {
    if (e.target === graphPopup) {
      closeModal();
    }
  });

  // Funkcija za zatvaranje modalnog prozora
  function closeModal() {
    // Ukloni klasu visible za glatku animaciju
    graphPopup.classList.remove("graph-popup--visible");

    // Nakon što se animacija završi, sakrij popup i vrati scroll
    setTimeout(() => {
      graphPopup.style.display = "none";

      // Ponovno omogući scrollanje na body elementu
      document.body.style.overflow = "";
      document.body.style.width = "";
      document.body.style.position = "";
    }, 300);
  }

  // Funkcija za iscrtavanje grafova s pristupom resetiranja canvas elemenata
  function renderCharts() {
    console.log("Funkcija renderCharts() pozvana");

    // Dohvaćanje postotaka iz DOM-a s fallback vrijednostima ako su prazni
    const parentPercentage = parseInt(
      document.getElementById("parentPercentage").textContent || "0"
    );
    const adultPercentage = parseInt(
      document.getElementById("adultPercentage").textContent || "0"
    );
    const childPercentage = parseInt(
      document.getElementById("childPercentage").textContent || "0"
    );

    console.log("Postoci:", parentPercentage, adultPercentage, childPercentage);

    // Definiranje boja koje će se koristiti za svako ego stanje
    const colors = {
      parent: "#3498db", // Plava boja za Roditelja
      adult: "#5dc2a5", // Zelena boja za Odraslog
      child: "#e67e22", // Narančasta boja za Dijete
    };

    // NOVI PRISTUP: Resetiranje canvas elemenata
    // 1. Kružni dijagram (Pie Chart)
    try {
      // Resetiranje canvas elementa
      const pieCanvas = document.getElementById("pieChart");
      if (!pieCanvas) {
        console.error("Canvas element 'pieChart' nije pronađen!");
        return;
      }

      // Resetiraj canvas stvaranjem novog elementa
      const newPieCanvas = document.createElement("canvas");
      newPieCanvas.id = "pieChart";
      newPieCanvas.width = 300;
      newPieCanvas.height = 300;
      newPieCanvas.classList.add("graph-popup__canvas");
      pieCanvas.parentNode.replaceChild(newPieCanvas, pieCanvas);

      const pieCtx = newPieCanvas.getContext("2d");

      // Kreiraj novi grafikon
      pieChart = new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: ["Roditelj", "Odrasli", "Dijete"],
          datasets: [
            {
              data: [parentPercentage, adultPercentage, childPercentage],
              backgroundColor: [colors.parent, colors.adult, colors.child],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
            },
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.label}: ${context.raw}%`;
                },
              },
            },
          },
        },
      });
      console.log("Pie chart kreiran");
    } catch (error) {
      console.error("Greška pri kreiranju kružnog dijagrama:", error);
    }

    // 2. Stupčasti dijagram (Bar Chart)
    try {
      // Resetiranje canvas elementa
      const barCanvas = document.getElementById("barChart");
      if (!barCanvas) {
        console.error("Canvas element 'barChart' nije pronađen!");
        return;
      }

      // Resetiraj canvas stvaranjem novog elementa
      const newBarCanvas = document.createElement("canvas");
      newBarCanvas.id = "barChart";
      newBarCanvas.width = 300;
      newBarCanvas.height = 300;
      newBarCanvas.classList.add("graph-popup__canvas");
      barCanvas.parentNode.replaceChild(newBarCanvas, barCanvas);

      const barCtx = newBarCanvas.getContext("2d");

      // Kreiraj novi grafikon
      barChart = new Chart(barCtx, {
        type: "bar",
        data: {
          labels: ["Roditelj", "Odrasli", "Dijete"],
          datasets: [
            {
              label: "Postotak ego stanja",
              data: [parentPercentage, adultPercentage, childPercentage],
              backgroundColor: [colors.parent, colors.adult, colors.child],
              borderColor: [colors.parent, colors.adult, colors.child],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function (value) {
                  return value + "%";
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.raw}%`;
                },
              },
            },
          },
        },
      });
      console.log("Bar chart kreiran");
    } catch (error) {
      console.error("Greška pri kreiranju stupčastog dijagrama:", error);
    }

    // 3. Radar dijagram (Radar Chart)
    try {
      // Resetiranje canvas elementa
      const radarCanvas = document.getElementById("radarChart");
      if (!radarCanvas) {
        console.error("Canvas element 'radarChart' nije pronađen!");
        return;
      }

      // Resetiraj canvas stvaranjem novog elementa
      const newRadarCanvas = document.createElement("canvas");
      newRadarCanvas.id = "radarChart";
      newRadarCanvas.width = 300;
      newRadarCanvas.height = 300;
      newRadarCanvas.classList.add("graph-popup__canvas");
      radarCanvas.parentNode.replaceChild(newRadarCanvas, radarCanvas);

      const radarCtx = newRadarCanvas.getContext("2d");

      // Kreiraj novi grafikon
      radarChart = new Chart(radarCtx, {
        type: "radar",
        data: {
          labels: [
            "Briga o drugima",
            "Racionalno razmišljanje",
            "Spontanost",
            "Pružanje podrške",
            "Analitičnost",
            "Emotivnost",
            "Savjetovanje",
          ],
          datasets: [
            {
              label: "Profil ego stanja",
              data: [
                // Ponderirane vrijednosti koje naglašavaju različite karakteristike ego stanja
                parentPercentage * 0.9 +
                  adultPercentage * 0.2 +
                  childPercentage * 0.1,
                parentPercentage * 0.3 +
                  adultPercentage * 0.9 +
                  childPercentage * 0.1,
                parentPercentage * 0.1 +
                  adultPercentage * 0.2 +
                  childPercentage * 0.9,
                parentPercentage * 0.8 +
                  adultPercentage * 0.3 +
                  childPercentage * 0.2,
                parentPercentage * 0.2 +
                  adultPercentage * 0.8 +
                  childPercentage * 0.1,
                parentPercentage * 0.3 +
                  adultPercentage * 0.1 +
                  childPercentage * 0.8,
                parentPercentage * 0.7 +
                  adultPercentage * 0.4 +
                  childPercentage * 0.1,
              ],
              fill: true,
              backgroundColor: "rgba(93, 194, 165, 0.2)",
              borderColor: "#5dc2a5",
              pointBackgroundColor: "#5dc2a5",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#5dc2a5",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            r: {
              angleLines: {
                display: true,
              },
              suggestedMin: 0,
              suggestedMax: 100,
            },
          },
        },
      });
      console.log("Radar chart kreiran");
    } catch (error) {
      console.error("Greška pri kreiranju radar dijagrama:", error);
    }
  }
});
