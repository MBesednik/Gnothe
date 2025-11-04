/* -------------------------------------------

Name: 		Ruizarch
Version:    1.0
Developer:	Nazar Miller (millerDigitalDesign)
Portfolio:  https://themeforest.net/user/millerdigitaldesign/portfolio?ref=MillerDigitalDesign

p.s. I am available for Freelance hire (UI design, web development). email: miller.themes@gmail.com

------------------------------------------- */

// Paralaks efekt na hero video
// window.addEventListener("scroll", () => {
//   const scrolled = window.pageYOffset;
//   const heroVideo = document.querySelector(".hero__video");

//   if (heroVideo && scrolled < window.innerHeight) {
//     heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
//   }
// });

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const targetId = this.getAttribute("href").substring(1);
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Smooth scroll na klik scroll indikatora
document
  .querySelector(".hero__scroll-indicator")
  ?.addEventListener("click", () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  });

// Promjena boje logo i hamburger menu na scroll
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroHeight = document.querySelector(".hero").offsetHeight;

  // Provjeri je li menu otvoren
  const menuFrame = document.querySelector(".mil-menu-frame");
  const isMenuOpen = menuFrame && menuFrame.classList.contains("mil-active");

  // Ne mijenjaj boju ako je menu otvoren
  if (!isMenuOpen) {
    if (scrolled > heroHeight * 0.95) {
      document.body.classList.add("scrolled-past-hero");
    } else {
      document.body.classList.remove("scrolled-past-hero");
    }
  }
});

// Inicijalna provjera pri učitavanju stranice
document.addEventListener("DOMContentLoaded", () => {
  const scrolled = window.pageYOffset;
  const heroHeight = document.querySelector(".hero")?.offsetHeight || 0;

  if (scrolled > heroHeight * 0.95) {
    document.body.classList.add("scrolled-past-hero");
  }
});

// Ponovno postavi boju nakon zatvaranja menija
document.addEventListener("click", (e) => {
  if (e.target.closest(".mil-menu-btn")) {
    setTimeout(() => {
      const menuFrame = document.querySelector(".mil-menu-frame");
      const isMenuOpen =
        menuFrame && menuFrame.classList.contains("mil-active");

      if (!isMenuOpen) {
        const scrolled = window.pageYOffset;
        const heroHeight = document.querySelector(".hero")?.offsetHeight || 0;

        if (scrolled > heroHeight * 0.95) {
          document.body.classList.add("scrolled-past-hero");
        } else {
          document.body.classList.remove("scrolled-past-hero");
        }
      }
    }, 300); // Sačekaj da se završi animacija
  }
});

// Prati promjene na .mil-menu-frame za fallback podršku
const observeMenuFrame = () => {
  const menuFrame = document.querySelector(".mil-menu-frame");
  if (!menuFrame) return;

  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "class") {
        if (menuFrame.classList.contains("mil-active")) {
          document.body.classList.add("menu-is-open");
        } else {
          document.body.classList.remove("menu-is-open");

          // Ponovno provjeri scroll poziciju
          const scrolled = window.pageYOffset;
          const heroHeight = document.querySelector(".hero")?.offsetHeight || 0;

          if (scrolled > heroHeight * 0.95) {
            document.body.classList.add("scrolled-past-hero");
          } else {
            document.body.classList.remove("scrolled-past-hero");
          }
        }
      }
    });
  });

  observer.observe(menuFrame, { attributes: true });
};

// Pokreni observer kada je DOM spreman
document.addEventListener("DOMContentLoaded", observeMenuFrame);

// Promjena boje logo i hamburger menu na scroll
window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const heroHeight = document.querySelector(".hero").offsetHeight;

  if (scrolled > heroHeight * 0.95) {
    document.body.classList.add("scrolled-past-hero");
  } else {
    document.body.classList.remove("scrolled-past-hero");
  }
});

// Inicijalna provjera pri učitavanju stranice
document.addEventListener("DOMContentLoaded", () => {
  const scrolled = window.pageYOffset;
  const heroHeight = document.querySelector(".hero")?.offsetHeight || 0;

  if (scrolled > heroHeight * 0.95) {
    document.body.classList.add("scrolled-past-hero");
  }
});

$(function () {
  "use strict";

  /***************************

    swup

    ***************************/
  const options = {
    containers: ["#swupMain", "#swupMenu"],
    animateHistoryBrowsing: true,
    linkSelector: "a:not([data-no-swup])",
    animationSelector: '[class="mil-main-transition"]',
  };
  const swup = new Swup(options);

  /***************************

    register gsap plugins

    ***************************/
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  /***************************

    color variables

    ***************************/

  var accent = "rgba(255, 152, 0, 1)";
  var dark = "#000";
  var light = "#fff";

  /***************************

    preloader
    
    ***************************/

  var timeline = gsap.timeline();

  timeline.to(".mil-preloader-animation", {
    opacity: 1,
  });

  timeline.fromTo(
    ".mil-animation-1 .mil-h3",
    {
      y: "30px",
      opacity: 0,
    },
    {
      y: "0px",
      opacity: 1,
      stagger: 0.4,
    }
  );

  timeline.to(
    ".mil-animation-1 .mil-h3",
    {
      opacity: 0,
      y: "-30",
    },
    "+=.3"
  );

  timeline.fromTo(
    ".mil-reveal-box",
    0.1,
    {
      opacity: 0,
    },
    {
      opacity: 1,
      x: "-30",
    }
  );

  timeline.to(
    ".mil-reveal-box",
    0.45,
    {
      width: "100%",
      x: 0,
    },
    "+=.1"
  );
  timeline.to(".mil-reveal-box", {
    right: "0",
  });
  timeline.to(".mil-reveal-box", 0.3, {
    width: "0%",
  });
  timeline.fromTo(
    ".mil-animation-2 .mil-h3",
    {
      opacity: 0,
    },
    {
      opacity: 1,
    },
    "-=.5"
  );
  timeline.to(
    ".mil-animation-2 .mil-h3",
    0.6,
    {
      opacity: 0,
      y: "-30",
    },
    "+=.5"
  );
  timeline.to(
    ".mil-preloader",
    0.8,
    {
      opacity: 0,
      ease: "sine",
    },
    "+=.2"
  );
  timeline.fromTo(
    ".mil-up",
    0.8,
    {
      opacity: 0,
      y: 40,
      scale: 0.98,
      ease: "sine",
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      onComplete: function () {
        $(".mil-preloader").addClass("mil-hidden");
      },
    },
    "-=1"
  );
  /***************************

    anchor scroll

    ***************************/
  $(document).on("click", 'a[href^="#"]', function (event) {
    event.preventDefault();

    var target = $($.attr(this, "href"));
    var offset = 0;

    if ($(window).width() < 1200) {
      offset = 90;
    }

    $("html, body").animate(
      {
        scrollTop: target.offset().top - offset,
      },
      400
    );
  });
  /***************************

    append

    ***************************/
  $(document).ready(function () {
    $(".mil-arrow").clone().appendTo(".mil-arrow-place");
    $(".mil-dodecahedron").clone().appendTo(".mil-animation");
    $(".mil-lines").clone().appendTo(".mil-lines-place");
    $(".mil-main-menu ul li.mil-active > a")
      .clone()
      .appendTo(".mil-current-page");
  });
  /***************************

    accordion

    ***************************/

  let groups = gsap.utils.toArray(".mil-accordion-group");
  let menus = gsap.utils.toArray(".mil-accordion-menu");
  let menuToggles = groups.map(createAnimation);

  menus.forEach((menu) => {
    menu.addEventListener("click", () => toggleMenu(menu));
  });

  function toggleMenu(clickedMenu) {
    menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
  }

  function createAnimation(element) {
    let menu = element.querySelector(".mil-accordion-menu");
    let box = element.querySelector(".mil-accordion-content");
    let symbol = element.querySelector(".mil-symbol");
    let minusElement = element.querySelector(".mil-minus");
    let plusElement = element.querySelector(".mil-plus");

    gsap.set(box, {
      height: "auto",
    });

    let animation = gsap
      .timeline()
      .from(box, {
        height: 0,
        duration: 0.4,
        ease: "sine",
      })
      .from(
        minusElement,
        {
          duration: 0.4,
          autoAlpha: 0,
          ease: "none",
        },
        0
      )
      .to(
        plusElement,
        {
          duration: 0.4,
          autoAlpha: 0,
          ease: "none",
        },
        0
      )
      .to(
        symbol,
        {
          background: accent,
          ease: "none",
        },
        0
      )
      .reverse();

    return function (clickedMenu) {
      if (clickedMenu === menu) {
        animation.reversed(!animation.reversed());
      } else {
        animation.reverse();
      }
    };
  }
  /***************************

    back to top

    ***************************/
  const btt = document.querySelector(".mil-back-to-top .mil-link");

  gsap.set(btt, {
    x: -30,
    opacity: 0,
  });

  gsap.to(btt, {
    x: 0,
    opacity: 1,
    ease: "sine",
    scrollTrigger: {
      trigger: "body",
      start: "top -40%",
      end: "top -40%",
      toggleActions: "play none reverse none",
    },
  });
  /***************************

    cursor

    ***************************/
  const cursor = document.querySelector(".mil-ball");

  gsap.set(cursor, {
    xPercent: -50,
    yPercent: -50,
  });

  document.addEventListener("pointermove", movecursor);

  function movecursor(e) {
    gsap.to(cursor, {
      duration: 0.6,
      ease: "sine",
      x: e.clientX,
      y: e.clientY,
    });
  }

  $(".mil-drag, .mil-more, .mil-choose").mouseover(function () {
    gsap.to($(cursor), 0.2, {
      width: 90,
      height: 90,
      opacity: 1,
      ease: "sine",
    });
  });

  $(".mil-drag, .mil-more, .mil-choose").mouseleave(function () {
    gsap.to($(cursor), 0.2, {
      width: 20,
      height: 20,
      opacity: 0.1,
      ease: "sine",
    });
  });

  $(".mil-accent-cursor").mouseover(function () {
    gsap.to($(cursor), 0.2, {
      background: accent,
      ease: "sine",
    });
    $(cursor).addClass("mil-accent");
  });

  $(".mil-accent-cursor").mouseleave(function () {
    gsap.to($(cursor), 0.2, {
      background: dark,
      ease: "sine",
    });
    $(cursor).removeClass("mil-accent");
  });

  $(".mil-drag").mouseover(function () {
    gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
      scale: "1",
      ease: "sine",
    });
  });

  $(".mil-drag").mouseleave(function () {
    gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
      scale: "0",
      ease: "sine",
    });
  });

  $(".mil-more").mouseover(function () {
    gsap.to($(".mil-ball .mil-more-text"), 0.2, {
      scale: "1",
      ease: "sine",
    });
  });

  $(".mil-more").mouseleave(function () {
    gsap.to($(".mil-ball .mil-more-text"), 0.2, {
      scale: "0",
      ease: "sine",
    });
  });

  $(".mil-choose").mouseover(function () {
    gsap.to($(".mil-ball .mil-choose-text"), 0.2, {
      scale: "1",
      ease: "sine",
    });
  });

  $(".mil-choose").mouseleave(function () {
    gsap.to($(".mil-ball .mil-choose-text"), 0.2, {
      scale: "0",
      ease: "sine",
    });
  });

  $(
    'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input , textarea, .mil-accordion-menu'
  ).mouseover(function () {
    gsap.to($(cursor), 0.2, {
      scale: 0,
      ease: "sine",
    });
    gsap.to($(".mil-ball svg"), 0.2, {
      scale: 0,
    });
  });

  $(
    'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input, textarea, .mil-accordion-menu'
  ).mouseleave(function () {
    gsap.to($(cursor), 0.2, {
      scale: 1,
      ease: "sine",
    });

    gsap.to($(".mil-ball svg"), 0.2, {
      scale: 1,
    });
  });

  $("body").mousedown(function () {
    gsap.to($(cursor), 0.2, {
      scale: 0.1,
      ease: "sine",
    });
  });
  $("body").mouseup(function () {
    gsap.to($(cursor), 0.2, {
      scale: 1,
      ease: "sine",
    });
  });
  /***************************

     menu

    ***************************/
  $(".mil-menu-btn").on("click", function () {
    $(".mil-menu-btn").toggleClass("mil-active");
    $(".mil-menu").toggleClass("mil-active");
    $(".mil-menu-frame").toggleClass("mil-active");
  });
  /***************************

    main menu

    ***************************/
  $(".mil-has-children a").on("click", function () {
    $(".mil-has-children ul").removeClass("mil-active");
    $(".mil-has-children a").removeClass("mil-active");
    $(this).toggleClass("mil-active");
    $(this).next().toggleClass("mil-active");
  });
  /***************************

    progressbar

    ***************************/
  gsap.to(".mil-progress", {
    height: "100%",
    ease: "sine",
    scrollTrigger: {
      scrub: 0.3,
    },
  });
  /***************************

    scroll animations

    ***************************/

  const appearance = document.querySelectorAll(".mil-up");

  appearance.forEach((section) => {
    gsap.fromTo(
      section,
      {
        opacity: 0,
        y: 40,
        scale: 0.98,
        ease: "sine",
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.4,
        scrollTrigger: {
          trigger: section,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const scaleImage = document.querySelectorAll(".mil-scale");

  scaleImage.forEach((section) => {
    var value1 = $(section).data("value-1");
    var value2 = $(section).data("value-2");
    gsap.fromTo(
      section,
      {
        ease: "sine",
        scale: value1,
      },
      {
        scale: value2,
        scrollTrigger: {
          trigger: section,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });

  const parallaxImage = document.querySelectorAll(".mil-parallax");

  if ($(window).width() > 960) {
    parallaxImage.forEach((section) => {
      var value1 = $(section).data("value-1");
      var value2 = $(section).data("value-2");
      gsap.fromTo(
        section,
        {
          ease: "sine",
          y: value1,
        },
        {
          y: value2,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }

  const rotate = document.querySelectorAll(".mil-rotate");

  rotate.forEach((section) => {
    var value = $(section).data("value");
    gsap.fromTo(
      section,
      {
        ease: "sine",
        rotate: 0,
      },
      {
        rotate: value,
        scrollTrigger: {
          trigger: section,
          scrub: true,
          toggleActions: "play none none reverse",
        },
      }
    );
  });
  /***************************

    fancybox

    ***************************/
  $('[data-fancybox="gallery"]').fancybox({
    buttons: ["slideShow", "zoom", "fullScreen", "close"],
    loop: false,
    protect: true,
  });
  $.fancybox.defaults.hash = false;
  /***************************

    reviews slider

    ***************************/

  var menu = [
    '<div class="mil-custom-dot mil-slide-1"></div>',
    '<div class="mil-custom-dot mil-slide-2"></div>',
    '<div class="mil-custom-dot mil-slide-3"></div>',
    '<div class="mil-custom-dot mil-slide-4"></div>',
    '<div class="mil-custom-dot mil-slide-5"></div>',
    '<div class="mil-custom-dot mil-slide-6"></div>',
    '<div class="mil-custom-dot mil-slide-7"></div>',
  ];
  var mySwiper = new Swiper(".mil-reviews-slider", {
    // If we need pagination
    pagination: {
      el: ".mil-revi-pagination",
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + menu[index] + "</span>";
      },
    },
    speed: 800,
    effect: "fade",
    parallax: true,
    navigation: {
      nextEl: ".mil-revi-next",
      prevEl: ".mil-revi-prev",
    },
  });

  /***************************

    infinite slider

    ***************************/
  var swiper = new Swiper(".mil-infinite-show", {
    slidesPerView: 2,
    spaceBetween: 30,
    speed: 5000,
    autoplay: true,
    autoplay: {
      delay: 0,
    },
    loop: true,
    freeMode: true,
    breakpoints: {
      992: {
        slidesPerView: 4,
      },
    },
  });

  /***************************

    portfolio slider

    ***************************/
  var swiper = new Swiper(".mil-portfolio-slider", {
    slidesPerView: 1,
    spaceBetween: 0,
    speed: 800,
    parallax: true,
    mousewheel: {
      enable: true,
    },
    navigation: {
      nextEl: ".mil-portfolio-next",
      prevEl: ".mil-portfolio-prev",
    },
    pagination: {
      el: ".swiper-portfolio-pagination",
      type: "fraction",
    },
  });
  /***************************

    1 item slider

    ***************************/
  var swiper = new Swiper(".mil-1-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    parallax: true,
    navigation: {
      nextEl: ".mil-portfolio-next",
      prevEl: ".mil-portfolio-prev",
    },
    pagination: {
      el: ".swiper-portfolio-pagination",
      type: "fraction",
    },
  });
  /***************************

    2 item slider

    ***************************/
  var swiper = new Swiper(".mil-2-slider", {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 800,
    parallax: true,
    navigation: {
      nextEl: ".mil-portfolio-next",
      prevEl: ".mil-portfolio-prev",
    },
    pagination: {
      el: ".swiper-portfolio-pagination",
      type: "fraction",
    },
    breakpoints: {
      992: {
        slidesPerView: 2,
      },
    },
  });

  /*----------------------------------------------------------
    ------------------------------------------------------------

    REINIT

    ------------------------------------------------------------
    ----------------------------------------------------------*/

  document.addEventListener("swup:contentReplaced", function () {
    window.location.reload();

    $("html, body").animate(
      {
        scrollTop: 0,
      },
      0
    );

    gsap.to(".mil-progress", {
      height: 0,
      ease: "sine",
      onComplete: () => {
        ScrollTrigger.refresh();
      },
    });

    /***************************

         menu

        ***************************/
    $(".mil-menu-btn").removeClass("mil-active");
    $(".mil-menu").removeClass("mil-active");
    $(".mil-menu-frame").removeClass("mil-active");
    /***************************

        append

        ***************************/
    $(document).ready(function () {
      $(
        ".mil-arrow-place .mil-arrow, .mil-animation .mil-dodecahedron, .mil-current-page a"
      ).remove();
      $(".mil-arrow").clone().appendTo(".mil-arrow-place");
      $(".mil-dodecahedron").clone().appendTo(".mil-animation");
      $(".mil-lines").clone().appendTo(".mil-lines-place");
      $(".mil-main-menu ul li.mil-active > a")
        .clone()
        .appendTo(".mil-current-page");
    });
    /***************************

        accordion

        ***************************/

    let groups = gsap.utils.toArray(".mil-accordion-group");
    let menus = gsap.utils.toArray(".mil-accordion-menu");
    let menuToggles = groups.map(createAnimation);

    menus.forEach((menu) => {
      menu.addEventListener("click", () => toggleMenu(menu));
    });

    function toggleMenu(clickedMenu) {
      menuToggles.forEach((toggleFn) => toggleFn(clickedMenu));
    }

    function createAnimation(element) {
      let menu = element.querySelector(".mil-accordion-menu");
      let box = element.querySelector(".mil-accordion-content");
      let symbol = element.querySelector(".mil-symbol");
      let minusElement = element.querySelector(".mil-minus");
      let plusElement = element.querySelector(".mil-plus");

      gsap.set(box, {
        height: "auto",
      });

      let animation = gsap
        .timeline()
        .from(box, {
          height: 0,
          duration: 0.4,
          ease: "sine",
        })
        .from(
          minusElement,
          {
            duration: 0.4,
            autoAlpha: 0,
            ease: "none",
          },
          0
        )
        .to(
          plusElement,
          {
            duration: 0.4,
            autoAlpha: 0,
            ease: "none",
          },
          0
        )
        .to(
          symbol,
          {
            background: accent,
            ease: "none",
          },
          0
        )
        .reverse();

      return function (clickedMenu) {
        if (clickedMenu === menu) {
          animation.reversed(!animation.reversed());
        } else {
          animation.reverse();
        }
      };
    }

    /***************************

        cursor

        ***************************/

    $(".mil-drag, .mil-more, .mil-choose").mouseover(function () {
      gsap.to($(cursor), 0.2, {
        width: 90,
        height: 90,
        opacity: 1,
        ease: "sine",
      });
    });

    $(".mil-drag, .mil-more, .mil-choose").mouseleave(function () {
      gsap.to($(cursor), 0.2, {
        width: 20,
        height: 20,
        opacity: 0.1,
        ease: "sine",
      });
    });

    $(".mil-accent-cursor").mouseover(function () {
      gsap.to($(cursor), 0.2, {
        background: accent,
        ease: "sine",
      });
      $(cursor).addClass("mil-accent");
    });

    $(".mil-accent-cursor").mouseleave(function () {
      gsap.to($(cursor), 0.2, {
        background: dark,
        ease: "sine",
      });
      $(cursor).removeClass("mil-accent");
    });

    $(".mil-drag").mouseover(function () {
      gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
        scale: "1",
        ease: "sine",
      });
    });

    $(".mil-drag").mouseleave(function () {
      gsap.to($(".mil-ball .mil-icon-1"), 0.2, {
        scale: "0",
        ease: "sine",
      });
    });

    $(".mil-more").mouseover(function () {
      gsap.to($(".mil-ball .mil-more-text"), 0.2, {
        scale: "1",
        ease: "sine",
      });
    });

    $(".mil-more").mouseleave(function () {
      gsap.to($(".mil-ball .mil-more-text"), 0.2, {
        scale: "0",
        ease: "sine",
      });
    });

    $(".mil-choose").mouseover(function () {
      gsap.to($(".mil-ball .mil-choose-text"), 0.2, {
        scale: "1",
        ease: "sine",
      });
    });

    $(".mil-choose").mouseleave(function () {
      gsap.to($(".mil-ball .mil-choose-text"), 0.2, {
        scale: "0",
        ease: "sine",
      });
    });

    $(
      'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input , textarea, .mil-accordion-menu'
    ).mouseover(function () {
      gsap.to($(cursor), 0.2, {
        scale: 0,
        ease: "sine",
      });
      gsap.to($(".mil-ball svg"), 0.2, {
        scale: 0,
      });
    });

    $(
      'a:not(".mil-choose , .mil-more , .mil-drag , .mil-accent-cursor"), input, textarea, .mil-accordion-menu'
    ).mouseleave(function () {
      gsap.to($(cursor), 0.2, {
        scale: 1,
        ease: "sine",
      });

      gsap.to($(".mil-ball svg"), 0.2, {
        scale: 1,
      });
    });

    $("body").mousedown(function () {
      gsap.to($(cursor), 0.2, {
        scale: 0.1,
        ease: "sine",
      });
    });
    $("body").mouseup(function () {
      gsap.to($(cursor), 0.2, {
        scale: 1,
        ease: "sine",
      });
    });
    /***************************

        main menu

        ***************************/
    $(".mil-has-children a").on("click", function () {
      $(".mil-has-children ul").removeClass("mil-active");
      $(".mil-has-children a").removeClass("mil-active");
      $(this).toggleClass("mil-active");
      $(this).next().toggleClass("mil-active");
    });
    /***************************

        scroll animations

        ***************************/

    const appearance = document.querySelectorAll(".mil-up");

    appearance.forEach((section) => {
      gsap.fromTo(
        section,
        {
          opacity: 0,
          y: 40,
          scale: 0.98,
          ease: "sine",
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.4,
          scrollTrigger: {
            trigger: section,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    const scaleImage = document.querySelectorAll(".mil-scale");

    scaleImage.forEach((section) => {
      var value1 = $(section).data("value-1");
      var value2 = $(section).data("value-2");
      gsap.fromTo(
        section,
        {
          ease: "sine",
          scale: value1,
        },
        {
          scale: value2,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    const parallaxImage = document.querySelectorAll(".mil-parallax");

    if ($(window).width() > 960) {
      parallaxImage.forEach((section) => {
        var value1 = $(section).data("value-1");
        var value2 = $(section).data("value-2");
        gsap.fromTo(
          section,
          {
            ease: "sine",
            y: value1,
          },
          {
            y: value2,
            scrollTrigger: {
              trigger: section,
              scrub: true,
              toggleActions: "play none none reverse",
            },
          }
        );
      });
    }

    const rotate = document.querySelectorAll(".mil-rotate");

    rotate.forEach((section) => {
      var value = $(section).data("value");
      gsap.fromTo(
        section,
        {
          ease: "sine",
          rotate: 0,
        },
        {
          rotate: value,
          scrollTrigger: {
            trigger: section,
            scrub: true,
            toggleActions: "play none none reverse",
          },
        }
      );
    });
    /***************************

        fancybox

        ***************************/
    $('[data-fancybox="gallery"]').fancybox({
      buttons: ["slideShow", "zoom", "fullScreen", "close"],
      loop: false,
      protect: true,
    });
    $.fancybox.defaults.hash = false;
    /***************************

        reviews slider

        ***************************/

    var menu = [
      '<div class="mil-custom-dot mil-slide-1"></div>',
      '<div class="mil-custom-dot mil-slide-2"></div>',
      '<div class="mil-custom-dot mil-slide-3"></div>',
      '<div class="mil-custom-dot mil-slide-4"></div>',
      '<div class="mil-custom-dot mil-slide-5"></div>',
      '<div class="mil-custom-dot mil-slide-6"></div>',
      '<div class="mil-custom-dot mil-slide-7"></div>',
    ];
    var mySwiper = new Swiper(".mil-reviews-slider", {
      // If we need pagination
      pagination: {
        el: ".mil-revi-pagination",
        clickable: true,
        renderBullet: function (index, className) {
          return '<span class="' + className + '">' + menu[index] + "</span>";
        },
      },
      speed: 800,
      effect: "fade",
      parallax: true,
      navigation: {
        nextEl: ".mil-revi-next",
        prevEl: ".mil-revi-prev",
      },
    });

    /***************************

        infinite slider

        ***************************/
    var swiper = new Swiper(".mil-infinite-show", {
      slidesPerView: 2,
      spaceBetween: 30,
      speed: 5000,
      autoplay: true,
      autoplay: {
        delay: 0,
      },
      loop: true,
      freeMode: true,
      breakpoints: {
        992: {
          slidesPerView: 4,
        },
      },
    });

    /***************************

        portfolio slider

        ***************************/
    var swiper = new Swiper(".mil-portfolio-slider", {
      slidesPerView: 1,
      spaceBetween: 0,
      speed: 800,
      parallax: true,
      mousewheel: {
        enable: true,
      },
      navigation: {
        nextEl: ".mil-portfolio-next",
        prevEl: ".mil-portfolio-prev",
      },
      pagination: {
        el: ".swiper-portfolio-pagination",
        type: "fraction",
      },
    });
    /***************************

        1 item slider

        ***************************/
    var swiper = new Swiper(".mil-1-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 800,
      parallax: true,
      navigation: {
        nextEl: ".mil-portfolio-next",
        prevEl: ".mil-portfolio-prev",
      },
      pagination: {
        el: ".swiper-portfolio-pagination",
        type: "fraction",
      },
    });
    /***************************

        2 item slider

        ***************************/
    var swiper = new Swiper(".mil-2-slider", {
      slidesPerView: 1,
      spaceBetween: 30,
      speed: 800,
      parallax: true,
      navigation: {
        nextEl: ".mil-portfolio-next",
        prevEl: ".mil-portfolio-prev",
      },
      pagination: {
        el: ".swiper-portfolio-pagination",
        type: "fraction",
      },
      breakpoints: {
        992: {
          slidesPerView: 2,
        },
      },
    });
  });
});
