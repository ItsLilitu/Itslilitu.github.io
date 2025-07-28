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
  if (!url) return '';
  
  // Remove any query parameters
  const cleanUrl = url.split('?')[0];
  
  // If it's already an ImgBB URL, return the clean URL
  if (cleanUrl.includes('i.ibb.co')) {
    return cleanUrl;
  }
  
  // For non-ImgBB URLs, return the clean URL
  return cleanUrl;
}

// Function to preload a single image and return a promise
function preloadImage(url) {
  return new Promise((resolve) => {
    const cleanUrl = getHighQualityUrl(url);
    const img = new Image();
    
    img.onload = () => resolve(img);
    img.onerror = () => {
      console.log(`Trying fallback for: ${cleanUrl}`);
      // If high quality fails, try the original URL (if different)
      if (url !== cleanUrl) {
        const fallbackImg = new Image();
        fallbackImg.onload = () => resolve(fallbackImg);
        fallbackImg.onerror = () => {
          console.error(`Failed to load fallback image: ${url}`);
          resolve(null); // Continue slideshow even if image fails
        };
        fallbackImg.src = url;
      } else {
        console.error(`Failed to load image: ${cleanUrl}`);
        resolve(null); // Continue slideshow even if image fails
      }
    };
    
    // Start loading the image
    console.log(`Loading image: ${cleanUrl}`);
    img.src = cleanUrl;
  });
}

// Function to populate a slider with images
async function populateSlider(slider, images, initialSlide = 0) {
  if (!slider || !images || !images.length) return;
  
  // Create empty slides with loading placeholders
  slider.innerHTML = images.map((img, idx) => `
    <div class="slide ${idx === initialSlide ? 'active' : ''}" data-loaded="${idx === initialSlide ? 'true' : 'false'}" style="display:${idx === initialSlide ? 'block' : 'none'};">
      ${idx === initialSlide ? 
        `<img 
          src="${getHighQualityUrl(img.url)}" 
          data-src="${getHighQualityUrl(img.url)}" 
          alt="${img.alt}" 
          loading="eager"
          onerror="this.onerror=null; this.src='${img.url}'; this.dataset.fallbackUsed='true'"
        >` : 
        '<div class="slide-loading">Loading...</div>'
      }
    </div>
  `).join('');
  
  // Preload the next image in the background
  if (images.length > 1) {
    preloadImage(images[1].url);
  }
  
  return slider.querySelectorAll('.slide');
}

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize sliders with their respective data
  const slider1 = document.getElementById('slider1');
  const slider2 = document.getElementById('slider2');
  
  // Create a sliderData object that matches the expected structure
  const sliderData = {
    slider1: slider1Images,
    slider2: slider2Images
  };
  
  // Populate sliders with images and get slide elements
  const slider1Slides = await populateSlider(slider1, sliderData.slider1, Math.floor(Math.random() * sliderData.slider1.length));
  const slider2Slides = await populateSlider(slider2, sliderData.slider2, Math.floor(Math.random() * sliderData.slider2.length));
  
  // Initialize all sliders
  document.querySelectorAll('.slider-container').forEach((container, index) => {
    const slider = container.querySelector('.slider');
    const slides = container.querySelectorAll('.slide');
    const prevBtn = container.querySelector('.prev');
    const nextBtn = container.querySelector('.next');
    // Choose a random starting slide for this slider
    let currentSlide = Math.floor(Math.random() * slides.length);
    let slideInterval;

    // Ensure the randomly chosen slide is loaded and marked as active
    const currentSlideEl = slides[currentSlide];
    if (currentSlideEl.getAttribute('data-loaded') === 'false') {
      const imgData = sliderData[`slider${index + 1}`][currentSlide];
      currentSlideEl.innerHTML = `
        <img 
          src="${getHighQualityUrl(imgData.url)}" 
          data-src="${getHighQualityUrl(imgData.url)}" 
          alt="${imgData.alt}" 
          loading="eager"
          onerror="this.onerror=null; this.src='${imgData.url}'; this.dataset.fallbackUsed='true'"
        >`;
      currentSlideEl.setAttribute('data-loaded', 'true');
    }

    // Update slide visibility and active classes
    slides.forEach((slide, idx) => {
      slide.style.display = idx === currentSlide ? 'block' : 'none';
      slide.classList.toggle('active', idx === currentSlide);
    });

    // Display the randomly chosen slide
    showSlide(currentSlide);
    
    // Preload the next slide for smoother transition
    const preloadIndex = (currentSlide + 1) % slides.length;
    if (slides[preloadIndex].getAttribute('data-loaded') === 'false') {
      preloadImage(sliderData[`slider${index + 1}`][preloadIndex].url);
    }

    // Start auto-sliding
    startSlider();
    
    // Pause on hover
    container.addEventListener('mouseenter', pauseSlider);
    container.addEventListener('mouseleave', startSlider);
    
    // Navigation buttons
    if (nextBtn) {
      nextBtn.addEventListener('click', async () => {
        pauseSlider();
        await nextSlide();
        startSlider();
      });
    }
    
    if (prevBtn) {
      prevBtn.addEventListener('click', async () => {
        pauseSlider();
        await prevSlide();
        startSlider();
      });
    }
    
    // Touch support for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    
    slider.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      pauseSlider();
    }, false);
    
    slider.addEventListener('touchend', async (e) => {
      touchEndX = e.changedTouches[0].screenX;
      const swipeThreshold = 50; // Minimum distance to trigger slide change
      
      if (touchEndX < touchStartX - swipeThreshold) {
        await nextSlide(); // Swipe left
      }
      
      if (touchEndX > touchStartX + swipeThreshold) {
        await prevSlide(); // Swipe right
      }
      
      startSlider();
    }, false);
    
    function showSlide(index) {
      console.log(`Showing slide ${index}`);
      
      // Get current active slide
      const currentActive = slider.querySelector('.slide.active');
      const nextSlide = slides[index];
      
      // If already showing this slide, do nothing
      if (currentActive === nextSlide) {
        console.log('Already showing this slide');
        return;
      }
      
      // Add transition class for smooth animation
      slider.classList.add('sliding');
      
      // Fade out current slide
      if (currentActive) {
        currentActive.classList.remove('active');
        console.log(`Hiding slide ${Array.from(slides).indexOf(currentActive)}`);
      }
      
      // Fade in next slide
      nextSlide.style.display = 'block';
      // Force reflow to ensure display:block is applied before adding active class
      void nextSlide.offsetHeight;
      nextSlide.classList.add('active');
      console.log(`Showing slide ${index}`, nextSlide);
      
      // Clean up after animation
      const onTransitionEnd = () => {
        // Hide all non-active slides
        slides.forEach(slide => {
          if (!slide.classList.contains('active')) {
            slide.style.display = 'none';
          }
        });
        slider.classList.remove('sliding');
        slider.removeEventListener('transitionend', onTransitionEnd);
      };
      
      // Use transitionend event to clean up
      nextSlide.addEventListener('transitionend', onTransitionEnd, { once: true });
      
      // Fallback in case transitionend doesn't fire
      setTimeout(() => {
        if (slider.classList.contains('sliding')) {
          onTransitionEnd();
        }
      }, 1000);
    }
    
    async function nextSlide() {
      console.log('nextSlide called');
      const nextSlideIndex = (currentSlide + 1) % slides.length;
      console.log(`Current slide: ${currentSlide}, Next slide: ${nextSlideIndex}`);
      const nextSlide = slides[nextSlideIndex];
      
      // Only proceed if not currently in a transition
      if (slider.classList.contains('sliding')) {
        console.log('Currently sliding, ignoring nextSlide');
        return;
      }
      
      // If next slide isn't loaded yet, load it first
      if (nextSlide.getAttribute('data-loaded') === 'false') {
        nextSlide.innerHTML = '<div class="slide-loading">Loading...</div>';
        try {
          const img = await preloadImage(sliderData[`slider${index + 1}`][nextSlideIndex].url);
          if (img) {
            nextSlide.innerHTML = `
              <img 
                src="${img.src}" 
                data-src="${img.src}" 
                alt="${sliderData[`slider${index + 1}`][nextSlideIndex].alt}" 
                loading="lazy"
              >`;
          }
          nextSlide.setAttribute('data-loaded', 'true');
        } catch (error) {
          console.error('Error loading slide:', error);
          return; // Don't proceed if image fails to load
        }
      }
      
      currentSlide = nextSlideIndex;
      showSlide(currentSlide);
      
      // Preload the slide after next
      const nextNextIndex = (nextSlideIndex + 1) % slides.length;
      if (slides[nextNextIndex].getAttribute('data-loaded') === 'false') {
        preloadImage(sliderData[`slider${index + 1}`][nextNextIndex].url);
      }
    }
    
    async function prevSlide() {
      const prevSlideIndex = (currentSlide - 1 + slides.length) % slides.length;
      const prevSlide = slides[prevSlideIndex];
      
      // Only proceed if not currently in a transition
      if (slider.classList.contains('sliding')) return;
      
      // If previous slide isn't loaded yet, load it first
      if (prevSlide.getAttribute('data-loaded') === 'false') {
        prevSlide.innerHTML = '<div class="slide-loading">Loading...</div>';
        try {
          const img = await preloadImage(sliderData[`slider${index + 1}`][prevSlideIndex].url);
          if (img) {
            prevSlide.innerHTML = `
              <img 
                src="${img.src}" 
                data-src="${img.src}" 
                alt="${sliderData[`slider${index + 1}`][prevSlideIndex].alt}" 
                loading="lazy"
              >`;
          }
          prevSlide.setAttribute('data-loaded', 'true');
        } catch (error) {
          console.error('Error loading slide:', error);
          return; // Don't proceed if image fails to load
        }
      }
      
      currentSlide = prevSlideIndex;
      showSlide(currentSlide);
    }
    
    async function autoAdvance() {
      if (!slider.classList.contains('sliding')) {
        await nextSlide();
      }
    }
    
    function startSlider() {
      // Clear any existing interval to prevent multiple intervals running
      if (slideInterval) clearInterval(slideInterval);
      
      // Start a new interval
      slideInterval = setInterval(autoAdvance, 5000); // Change slide every 5 seconds
    }
    
    function pauseSlider() {
      clearInterval(slideInterval);
    }
  });
});

// Initialize popup functionality for all popups
document.addEventListener('DOMContentLoaded', () => {
  // Get all popup elements
  const popupButtons = document.querySelectorAll('.popup-btn, .crypto-link');
  const popups = document.querySelectorAll('.popup');
  const closeButtons = document.querySelectorAll('.close-btn');

  // Show popup when button is clicked
  popupButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      // For crypto links, let the existing handler handle it
      if (button.classList.contains('crypto-link')) {
        return; // Let the crypto handler take over
      }
      
      e.preventDefault();
      const popupId = button.getAttribute('data-popup');
      const popup = document.getElementById(`${popupId}-popup`);
      
      if (popup) {
        popup.classList.add('show');
        document.body.classList.add('popup-open');
      }
    });
  });

  // Close popup when close button is clicked
  closeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.stopPropagation();
      const popup = button.closest('.popup');
      if (popup) {
        popup.classList.remove('show');
        document.body.classList.remove('popup-open');
      }
    });
  });

  // Close popup when clicking outside the content
  popups.forEach(popup => {
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove('show');
        document.body.classList.remove('popup-open');
      }
    });
  });

  // Close popup with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      popups.forEach(popup => {
        if (popup.classList.contains('show')) {
          popup.classList.remove('show');
          document.body.classList.remove('popup-open');
        }
      });
    }
  });
});

// Delegated click handling for popup buttons
document.addEventListener('click', (event) => {
  const target = event.target.closest('.popup-btn');
  if (!target) return; // Click was not on a popup button
  if (target.classList.contains('crypto-link')) return; // Let crypto handler manage this

  event.preventDefault();
  const popupId = target.getAttribute('data-popup');
  if (!popupId) return;

  const popup = document.getElementById(`${popupId}-popup`);
  if (popup) {
    popup.classList.add('show');
    document.body.classList.add('popup-open');
  }
});
