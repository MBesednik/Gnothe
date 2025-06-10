document.addEventListener("DOMContentLoaded", function () {
  // Elements
  const slides = document.querySelectorAll(".banner__slide");
  const dots = document.querySelectorAll(".banner__dot");
  const quotes = document.querySelectorAll(".banner__quote");
  const banner = document.querySelector(".mil-banner");
  const frame = document.querySelector(".mil-frame");
  const body = document.body;

  // Variables
  let currentSlide = 0;
  let isScrolling = false;
  let touchStartY = 0;
  let touchEndY = 0;
  let hasViewedAllSlides = false;
  let isAtTopOfPage = true;
  let isReverseNavigating = false;

  // Initially hide the frame
  if (frame) {
    frame.style.opacity = "0";
    frame.style.pointerEvents = "none";
    frame.style.transition = "opacity 0.5s ease";
  }

  // Prevent scrolling function
  function lockScroll() {
    body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
  }

  // Enable scrolling function
  function unlockScroll() {
    body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }

  // Initially lock scrolling
  lockScroll();

  // Reset to initial state when returning to top with reverse navigation
  function resetSliderExperience() {
    // Hide frame when experience resets
    if (frame) {
      frame.style.opacity = "0";
      frame.style.pointerEvents = "none";
    }

    // Hide scroll indicator
    const scrollIndicator = document.querySelector(".banner__scroll-indicator");
    if (scrollIndicator) {
      scrollIndicator.style.opacity = "0";
      scrollIndicator.style.animation = "none";
    }

    // Set flag to prevent other navigation while reverse navigating
    isReverseNavigating = true;

    // We should already be at the last slide (index 4), but let's ensure it
    if (currentSlide !== slides.length - 1) {
      updateSlide(slides.length - 1, false); // No animation delay
    }

    // Start the reverse navigation sequence (from slide 5 back to slide 1)
    navigateInReverse(slides.length - 1);
  }

  // Function to navigate in reverse order with timed transitions
  function navigateInReverse(fromIndex) {
    // Lock scrolling during reverse navigation
    lockScroll();
    hasViewedAllSlides = false;

    if (fromIndex <= 0) {
      // We've reached slide 1, end reverse navigation
      isReverseNavigating = false;
      return;
    }

    // Wait a moment before going to the previous slide
    setTimeout(() => {
      // Go to previous slide
      updateSlide(fromIndex - 1, false);

      // Continue reverse sequence with the next previous slide
      navigateInReverse(fromIndex - 1);
    }, 600); // Slightly faster than normal transitions for a smoother reverse experience
  }

  // Set initial slide
  updateSlide(0, false);

  // Update active slide
  function updateSlide(index, withDelay = true) {
    // Update slides
    slides.forEach((slide) => slide.classList.remove("banner__slide--active"));
    slides[index].classList.add("banner__slide--active");

    // Update pagination dots
    dots.forEach((dot) => dot.classList.remove("banner__dot--active"));
    dots[index].classList.add("banner__dot--active");

    // Update quotes (alternate between the two quotes)
    quotes.forEach((quote) => quote.classList.remove("banner__quote--active"));
    quotes[index % quotes.length].classList.add("banner__quote--active");

    // Update current slide tracker
    currentSlide = index;

    // Check if we're on the last slide (fifth slide, index 4)
    if (index === slides.length - 1 && !isReverseNavigating) {
      // Only proceed if we're not in the reverse navigation sequence
      if (withDelay) {
        setTimeout(() => {
          // We've seen all five slides, unlock scrolling
          hasViewedAllSlides = true;
          unlockScroll();

          // Show "Scroll to explore" message with animation
          const scrollIndicator = document.querySelector(
            ".banner__scroll-indicator"
          );
          if (scrollIndicator) {
            scrollIndicator.style.opacity = "1";
            scrollIndicator.style.animation = "pulse 2s infinite";
          }
        }, 1500); // Give user time to view the last slide
      } else {
        // No delay version for reverse navigation
        hasViewedAllSlides = false;
      }
    }

    // Apply parallax effect
    applyParallaxEffect();
  }

  // Function to show frame
  function showFrame() {
    if (frame && hasViewedAllSlides) {
      frame.style.opacity = "1";
      frame.style.pointerEvents = "auto";
    }
  }

  // Handle wheel event for slide changes
  function handleWheel(e) {
    // If we're reverse navigating, block all wheel events
    if (isReverseNavigating) {
      e.preventDefault();
      return;
    }

    // Always prevent default until all slides viewed
    if (!hasViewedAllSlides) {
      e.preventDefault();
    }

    // If currently animating, ignore wheel events
    if (isScrolling) return;

    // Determine scroll direction
    if (e.deltaY > 0) {
      // Scrolling down
      if (currentSlide < slides.length - 1) {
        // Still have slides to show, go to next slide
        isScrolling = true;
        updateSlide(currentSlide + 1);
      }
    } else if (e.deltaY < 0) {
      // Scrolling up
      if (currentSlide > 0) {
        // Go to previous slide
        isScrolling = true;
        updateSlide(currentSlide - 1);
      }
    }

    // Reset animation flag after transition
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }

  // Track scroll position to detect when user returns to top
  window.addEventListener("scroll", function () {
    // Don't do anything if reverse navigating
    if (isReverseNavigating) return;

    // Check if we're at the top of the page
    if (window.scrollY <= 50) {
      if (!isAtTopOfPage && hasViewedAllSlides) {
        isAtTopOfPage = true;
        // If we've scrolled back to the top, start reverse navigation
        resetSliderExperience();
      }
    } else {
      isAtTopOfPage = false;

      // Only show frame when scrolled down and has viewed all slides
      if (hasViewedAllSlides) {
        if (window.scrollY > 100) {
          if (frame) {
            frame.style.opacity = "1";
            frame.style.pointerEvents = "auto";
          }
        } else {
          if (frame) {
            frame.style.opacity = "0";
            frame.style.pointerEvents = "none";
          }
        }
      }
    }
  });

  // Prevent scrolling when necessary
  window.addEventListener(
    "wheel",
    function (e) {
      if (!hasViewedAllSlides || isReverseNavigating) {
        e.preventDefault();
        // Only process wheel events for slides if not reverse navigating
        if (!isReverseNavigating) {
          handleWheel(e);
        }
      }
    },
    { passive: false, capture: true }
  );

  // Add additional events to ensure scrolling is fully blocked
  window.addEventListener("scroll", function (e) {
    if ((!hasViewedAllSlides || isReverseNavigating) && !isAtTopOfPage) {
      window.scrollTo(0, 0);
    }
  });

  // Handle touch events for mobile
  function handleTouchStart(e) {
    // Ignore if reverse navigating
    if (isReverseNavigating) {
      e.preventDefault();
      return;
    }

    touchStartY = e.touches[0].clientY;
  }

  function handleTouchMove(e) {
    // Always prevent default during reverse navigation or before seeing all slides
    if (isReverseNavigating || !hasViewedAllSlides) {
      e.preventDefault();
    }

    if (!touchStartY || isReverseNavigating) return;
    touchEndY = e.touches[0].clientY;
  }

  function handleTouchEnd() {
    // Ignore if reverse navigating
    if (isReverseNavigating) return;

    if (!touchStartY || !touchEndY || isScrolling) return;

    const touchDiff = touchStartY - touchEndY;
    const threshold = 50;

    if (touchDiff > threshold) {
      // Swipe up
      if (currentSlide < slides.length - 1) {
        // Still have slides to show, go to next slide
        isScrolling = true;
        updateSlide(currentSlide + 1);
      }
    } else if (touchDiff < -threshold && currentSlide > 0) {
      // Swipe down - go to previous slide
      isScrolling = true;
      updateSlide(currentSlide - 1);
    }

    // Reset values
    touchStartY = 0;
    touchEndY = 0;

    // Reset animation flag after transition
    setTimeout(() => {
      isScrolling = false;
    }, 800);
  }

  // Handle pagination clicks
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      // Ignore clicks during reverse navigation
      if (isReverseNavigating) return;

      if (currentSlide !== index && !isScrolling) {
        isScrolling = true;
        updateSlide(currentSlide + 1);

        // Reset animation flag after transition
        setTimeout(() => {
          isScrolling = false;
        }, 800);
      }
    });
  });

  // Apply parallax effect on mouse movement
  function applyParallaxEffect() {
    document.addEventListener("mousemove", function (e) {
      // Only apply parallax if we haven't scrolled down past the banner
      if (window.scrollY > banner.offsetHeight) return;

      const mouseX = e.clientX;
      const mouseY = e.clientY;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      const moveX = (mouseX - windowWidth / 2) / 50;
      const moveY = (mouseY - windowHeight / 2) / 50;

      // Move active slide content
      const activeSlide = document.querySelector(".banner__slide--active");
      if (activeSlide) {
        const title = activeSlide.querySelector(
          ".banner__title, .banner__subtitle"
        );
        const tagline = activeSlide.querySelector(".banner__tagline");

        if (title)
          title.style.transform = `translateY(0) translate(${moveX * 0.5}px, ${
            moveY * 0.5
          }px)`;
        if (tagline)
          tagline.style.transform = `translateY(0) translate(${
            -moveX * 0.2
          }px, ${-moveY * 0.2}px)`;
      }

      // Move active quote
      const activeQuote = document.querySelector(".banner__quote--active");
      if (activeQuote) {
        activeQuote.style.transform = `translate(${-moveX * 0.3}px, ${
          -moveY * 0.3
        }px)`;
      }

      // Move background gradients in opposite direction
      const bgGradient1 = document.querySelector(".banner__bg-gradient--1");
      const bgGradient2 = document.querySelector(".banner__bg-gradient--2");

      if (bgGradient1)
        bgGradient1.style.transform = `translate(${-moveX * 2}px, ${
          -moveY * 2
        }px) scale(1)`;
      if (bgGradient2)
        bgGradient2.style.transform = `translate(${moveX * 3}px, ${
          moveY * 3
        }px) scale(1)`;
    });
  }

  // Add event listeners
  window.addEventListener("touchstart", handleTouchStart, { passive: false });
  window.addEventListener("touchmove", handleTouchMove, {
    passive: false,
    capture: true,
  });
  window.addEventListener("touchend", handleTouchEnd, { passive: true });

  // Initialize parallax effect
  applyParallaxEffect();

  // Add automatic slide change every 8 seconds if no interaction
  let autoSlideInterval = setInterval(() => {
    // Don't auto-advance during reverse navigation
    if (isReverseNavigating) return;

    if (!isScrolling && currentSlide < slides.length - 1) {
      const nextSlide = currentSlide + 1;
      updateSlide(nextSlide);
    }
  }, 8000);

  // Reset interval on user interaction
  function resetInterval() {
    clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      // Don't auto-advance during reverse navigation
      if (isReverseNavigating) return;

      if (!isScrolling && currentSlide < slides.length - 1) {
        const nextSlide = currentSlide + 1;
        updateSlide(nextSlide);
      }
    }, 8000);
  }

  window.addEventListener("wheel", resetInterval);
  window.addEventListener("touchstart", resetInterval);
  dots.forEach((dot) => dot.addEventListener("click", resetInterval));
});
