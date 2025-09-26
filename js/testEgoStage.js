// JavaScript za izračun rezultata, prikaz grafova i upravljanje UI elementima u modalnom prozoru
document.addEventListener("DOMContentLoaded", function () {
  // Dohvati potrebne elemente
  const calculateBtn = document.getElementById("calculateBtn");
  const questionnaireForm = document.getElementById("questionnaireForm");
  const questionnaireIntro = document.getElementById("questionnaireIntro");
  const results = document.getElementById("results");
  const modalLoader = document.getElementById("modalLoader");

  // Inicijalizacija varijabli za grafikone
  let barChart = null;
  let radarChart = null;

  // Funkcija za prikazivanje loadera u modalu
  function showModalLoader() {
    modalLoader.style.display = "flex";
    console.log("Modal loader prikazan!");
  }

  // Funkcija za skrivanje loadera u modalu
  function hideModalLoader() {
    modalLoader.style.display = "none";
    console.log("Modal loader sakriven!");
  }

  // Dodaj event listener na gumb za izračun
  calculateBtn.addEventListener("click", function () {
    // Provjera jesu li sva pitanja odgovorena
    const questions = ["q1", "q2", "q3", "q4", "q5", "q6", "q7"];
    let allAnswered = true;

    for (let q of questions) {
      const answered = questionnaireForm.querySelector(
        `input[name="${q}"]:checked`
      );
      if (!answered) {
        allAnswered = false;
        break;
      }
    }

    if (!allAnswered) {
      alert("Molimo odgovorite na sva pitanja prije izračuna rezultata.");
      return;
    }

    // Sakrij upute - ovo je novo u modalnoj verziji
    questionnaireIntro.style.display = "none";

    // Sakrij upitnik
    questionnaireForm.style.display = "none";

    // Prikaži loader
    showModalLoader();

    // Izračunaj rezultate
    let parentCount = 0;
    let adultCount = 0;
    let childCount = 0;

    for (let q of questions) {
      const answer = questionnaireForm.querySelector(
        `input[name="${q}"]:checked`
      ).value;
      if (answer === "parent") parentCount++;
      else if (answer === "adult") adultCount++;
      else if (answer === "child") childCount++;
    }

    const totalQuestions = questions.length;
    const parentPercentage = Math.round((parentCount / totalQuestions) * 100);
    const adultPercentage = Math.round((adultCount / totalQuestions) * 100);
    const childPercentage = Math.round((childCount / totalQuestions) * 100);

    // Postavimo skrivene vrijednosti za grafove
    document.getElementById("parentPercentage").textContent = parentPercentage;
    document.getElementById("adultPercentage").textContent = adultPercentage;
    document.getElementById("childPercentage").textContent = childPercentage;

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
      hideModalLoader();

      // Prikaži rezultate s animacijom
      results.style.display = "block";

      // Malo odgode prije animacije radi boljeg efekta
      setTimeout(function () {
        results.classList.add("results--visible");

        // Renderiranje grafova direktno u rezultatima
        renderCharts();

        // Scroll na vrh modalnog sadržaja da se vide rezultati
        const modalBody = document.querySelector(".ego-modal-body");
        modalBody.scrollTop = 0;
      }, 50);
    }, 3000); // 3 sekunde delay
  });

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
      adult: "#689483", // Zelena boja za Odraslog
      child: "#e67e22", // Narančasta boja za Dijete
    };

    // Stupčasti dijagram (Bar Chart)
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
      // Koristite responzivne vrijednosti
      const containerWidth = Math.min(window.innerWidth * 0.8, 300);
      newBarCanvas.width = containerWidth;
      newBarCanvas.height = containerWidth;
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

    // Radar dijagram (Radar Chart)
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
              borderColor: "#689483",
              pointBackgroundColor: "#689483",
              pointBorderColor: "#fff",
              pointHoverBackgroundColor: "#fff",
              pointHoverBorderColor: "#689483",
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
