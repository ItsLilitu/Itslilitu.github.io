// Create floating shapes with radial animation
let animationInterval;
let activeShapes = 0;
const MAX_ACTIVE_SHAPES = 10; // Increased number of circles

function createFloatingShape() {
  if (activeShapes >= MAX_ACTIVE_SHAPES) return;
  
  const shape = document.createElement('div');
  shape.className = 'floating-shape';
  
  // Position in the center
  shape.style.left = '50%';
  shape.style.top = '50%';
  
  // Random angle for direction with more variation
  const angle = Math.random() * Math.PI * 2;
  // Increased distance range significantly
  const distance = 100 + Math.random() * 150;
  
  // Calculate end position
  const randomX = Math.cos(angle) * distance + 'vmin';
  const randomY = Math.sin(angle) * distance + 'vmin';
  
  // Set custom properties for the animation
  shape.style.setProperty('--random-x', randomX);
  shape.style.setProperty('--random-y', randomY);
  
  // Size and animation duration
  const size = 6 + Math.random() * 10; // Larger size range
  shape.style.width = `${size}px`;
  shape.style.height = `${size}px`;
  const duration = 5 + Math.random() * 8; // Longer duration for better visibility
  shape.style.animationDuration = `${duration}s`;
  
  // Color with more saturation and opacity
  const hue = 330 + Math.random() * 30;
  shape.style.background = `hsla(${hue}, 90%, 75%, ${0.6 + Math.random() * 0.3})`;
  
  // Add to DOM
  document.body.appendChild(shape);
  activeShapes++;
  
  // Remove after animation completes
  setTimeout(() => {
    shape.remove();
    activeShapes--;
  }, duration * 1000);
}

// Start animation when page loads
function initAnimation() {
  // Clear any existing intervals
  if (animationInterval) {
    clearInterval(animationInterval);
    animationInterval = null;
  }
  
  // Only start animation if we want shapes
  if (MAX_ACTIVE_SHAPES > 0) {
    // Create initial burst of shapes (limited to MAX_ACTIVE_SHAPES)
    const initialShapes = Math.min(MAX_ACTIVE_SHAPES, 10);
    for (let i = 0; i < initialShapes; i++) {
      setTimeout(createFloatingShape, i * 100);
    }
    
    // Create new shapes at a steady rate
    animationInterval = setInterval(() => {
      if (activeShapes < MAX_ACTIVE_SHAPES) {
        createFloatingShape();
      }
    }, 300); // Reduced frequency of shape creation
  }
}

// Start the animation when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimation);
} else {
  initAnimation();
}

// Crypto addresses
const cryptoAddresses = {
  bitcoin: '3HiiNzVRBTgFGseeJeFHmP6egpRGPMpbTX',
  ethereum: '0x8221694415802DD0302FC773d3a40E0B7ff138BE'
};

// Crypto popup functionality
document.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('crypto-popup');
  const cryptoLinks = document.querySelectorAll('.crypto-link');
  const closeBtn = document.querySelector('.close-btn');
  const cryptoName = document.getElementById('popup-crypto-name');
  const cryptoAddress = document.getElementById('popup-crypto-address');
  const copyBtn = document.querySelector('.copy-btn');
  
  // Show popup when clicking a crypto link
  cryptoLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const cryptoType = link.getAttribute('data-crypto');
      cryptoName.textContent = `${cryptoType.charAt(0).toUpperCase() + cryptoType.slice(1)} Address`;
      cryptoAddress.textContent = cryptoAddresses[cryptoType];
      popup.classList.add('show');
      document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    });
  });
  
  // Close popup when clicking the close button
  closeBtn.addEventListener('click', () => {
    popup.classList.remove('show');
    document.body.style.overflow = '';
  });
  
  // Close popup when clicking outside the content
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
  
  // Copy address to clipboard
  copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(cryptoAddress.textContent)
      .then(() => {
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = 'Copy Address';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
  });
  
    // Close popup with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && popup.classList.contains('show')) {
      popup.classList.remove('show');
      document.body.style.overflow = '';
    }
  });
});

// Image Slider Functionality
// Import slider data from slider-data.js
import { slider1Images, slider2Images } from './slider-data.js';

// Function to get high quality image URL from ImgBB
function getHighQualityUrl(url) {
  // For ImgBB, we can force the original image by adding a cache-busting parameter
  // and ensuring we get the PNG version if available
  if (url.includes('i.ibb.co')) {
    // Remove any existing query parameters
    const cleanUrl = url.split('?')[0];
    // Add a cache-busting parameter to ensure we get a fresh copy
    return `${cleanUrl}?${Date.now()}`;
  }
  return url;
}

// Function to preload images
function preloadImages(images) {
  images.forEach(img => {
    const image = new Image();
    // Use the high quality URL for preloading
    image.src = getHighQualityUrl(img.url);
  });
}

// Function to populate a slider with images
function populateSlider(slider, images) {
  if (!slider || !images) return;
  
  // Preload all images for this slider
  preloadImages(images);
  
  // Create slides with high quality images
  slider.innerHTML = images.map((img, idx) => `
    <div class="slide ${idx === 0 ? 'active' : ''}">
      <img 
        src="${getHighQualityUrl(img.url)}" 
        data-src="${getHighQualityUrl(img.url)}" 
        loading="lazy" 
        alt="${img.alt}"
        onerror="this.onerror=null; this.src='${img.url}'; this.dataset.fallbackUsed='true'"
      >
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize sliders with their respective data
  const slider1 = document.getElementById('slider1');
  const slider2 = document.getElementById('slider2');
  
  // Create a sliderData object that matches the expected structure
  const sliderData = {
    slider1: slider1Images,
    slider2: slider2Images
  };
  
  // Populate sliders with images
  populateSlider(slider1, sliderData.slider1);
  populateSlider(slider2, sliderData.slider2);
  
  // Initialize all sliders
  document.querySelectorAll('.slider-container').forEach((container, index) => {
    const slider = container.querySelector('.slider');
    const slides = container.querySelectorAll('.slide');
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    let currentSlide = 0;
    let slideInterval;
    
    // Show first slide
    showSlide(currentSlide);
    
    // Start auto-sliding
    startSlider();
    
    // Pause on hover
    container.addEventListener('mouseenter', pauseSlider);
    container.addEventListener('mouseleave', startSlider);
    
    // Navigation buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        pauseSlider();
        nextSlide();
        startSlider();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        pauseSlider();
        prevSlide();
        startSlider();
      });
    }
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseSlider();
    }, false);
    
    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startSlider();
    }, false);
    
    function handleSwipe() {
      const swipeThreshold = 50; // Minimum distance to trigger slide change
      
      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide(); // Swipe left
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide(); // Swipe right
      }
    }
    
    function showSlide(index) {
      // Add transition class for smooth animation
      slider.classList.add('sliding');
      
      // Hide all slides
      slides.forEach(slide => slide.classList.remove('active'));
      
      // Show current slide
      slides[index].classList.add('active');
      
      // Remove transition class after animation
      setTimeout(() => {
        slider.classList.remove('sliding');
      }, 800);
    }
    
    function nextSlide() {
      currentSlide = (currentSlide + 1) % slides.length;
      showSlide(currentSlide);
    }
    
    function prevSlide() {
      currentSlide = (currentSlide - 1 + slides.length) % slides.length;
      showSlide(currentSlide);
    }
    
    function startSlider() {
      // Clear any existing interval to prevent multiple intervals running
      if (slideInterval) clearInterval(slideInterval);
      
      // Start a new interval
      slideInterval = setInterval(() => {
        // Only proceed if not currently in a transition
        if (!slider.classList.contains('sliding')) {
          nextSlide();
        }
      }, 5000); // Change slide every 5 seconds
    }
    
    function pauseSlider() {
      clearInterval(slideInterval);
    }
  });
});
