// Import the necessary function for preloading images
import { preloadImages, getGrid } from "./utils.js";

// Define a variable that will store the Lenis smooth scrolling object
let lenis;

// Function to initialize Lenis for smooth scrolling
const initSmoothScrolling = () => {
  // Instantiate the Lenis object with specified properties
  lenis = new Lenis({
    lerp: 0.1, // Lower values create a smoother scroll effect
    smoothWheel: true, // Enables smooth scrolling for mouse wheel events
  });

  // Update ScrollTrigger each time the user scrolls
  lenis.on("scroll", () => ScrollTrigger.update());

  // Define a function to run at each animation frame
  const scrollFn = (time) => {
    lenis.raf(time); // Run Lenis' requestAnimationFrame method
    requestAnimationFrame(scrollFn); // Recursively call scrollFn on each frame
  };
  // Start the animation frame loop
  requestAnimationFrame(scrollFn);
};

// All elements with class .grid
const grids = document.querySelectorAll(".grid");

// Function to apply scroll-triggered animations to a given gallery
const applyAnimation = (grid, animationType) => {
  // Child elements of grid
  const gridWrap = grid.querySelector(".grid-wrap");
  const gridItems = grid.querySelectorAll(".grid__item");
  const gridItemsInner = [...gridItems].map((item) =>
    item.querySelector(".grid__item-inner")
  );

  // Define GSAP timeline with ScrollTrigger
  const timeline = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: gridWrap,
      start: "top bottom+=5%",
      end: "bottom top-=5%",
      scrub: true,
    },
  });

  grid.style.setProperty("--grid-width", "105%");
  grid.style.setProperty("--grid-columns", "8");
  grid.style.setProperty("--perspective", "1500px");
  grid.style.setProperty("--grid-inner-scale", "0.5");

  timeline
    .set(gridItems, {
      transformOrigin: "50% 0%",
      z: () => gsap.utils.random(-5000, -2000),
      rotationX: () => gsap.utils.random(-65, -25),
      filter: "brightness(0%)",
    })
    .to(
      gridItems,
      {
        xPercent: () => gsap.utils.random(-150, 150),
        yPercent: () => gsap.utils.random(-300, 300),
        rotationX: 0,
        filter: "brightness(200%)",
      },
      0
    )
    .to(
      gridWrap,
      {
        z: 6500,
      },
      0
    )
    .fromTo(
      gridItemsInner,
      {
        scale: 2,
      },
      {
        scale: 0.5,
      },
      0
    );
};

// Apply animations to each grid
const scroll = () => {
  grids.forEach((grid, i) => {
    applyAnimation(grid, "type3");
  });
};

// Preload images, initialize smooth scrolling, apply scroll-triggered animations, and remove loading class from body
preloadImages(".grid__item-inner").then(() => {
  initSmoothScrolling();
  scroll();
  document.body.classList.remove("loading");
});
