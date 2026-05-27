/* ==========================================================================
   ZHILMIL's Sorry - Interactive & Procedural Magic Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const slides = document.querySelectorAll('.slide');
  const btnBack = document.getElementById('btn-back');
  const btnNext = document.getElementById('btn-next');
  const progressBar = document.getElementById('progress-bar');
  const slideCounter = document.getElementById('slide-counter');
  const magicBell = document.getElementById('magic-bell');
  const audioContainer = document.getElementById('audio-container');
  const soundWave = document.getElementById('sound-wave');
  const bgAudio = document.getElementById('bg-audio');
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');

  let currentSlide = 1;
  const totalSlides = slides.length;
  let audioContext = null;

  // Set Canvas Dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ==========================================================================
  // Web Audio API Procedural Synthesizers (Magic Chimes & Bells)
  // ==========================================================================
  function initAudioContext() {
    if (!audioContext) {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
  }

  // Play a single pristine magic chime procedurally
  function playMagicChime(pitchFactor = 1.0, duration = 1.8) {
    initAudioContext();
    if (!audioContext) return;

    const now = audioContext.currentTime;

    // Create Oscillators
    const osc1 = audioContext.createOscillator();
    const osc2 = audioContext.createOscillator();
    
    // Create gain envelope
    const gainNode = audioContext.createGain();
    
    // Create filter for warmth
    const filter = audioContext.createBiquadFilter();

    // Define pitch (G6 note ~ 1568Hz baseline)
    const baselineFreq = 1568 * pitchFactor;

    // Oscillator 1: High crystalline shine
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(baselineFreq, now);

    // Oscillator 2: Harmonics & chorus detuning
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(baselineFreq * 1.5, now); // Fifth harmonic
    osc2.detune.setValueAtTime(6, now); // 6 cents detune

    // Gain Envelope (Fairy Dust Fade)
    gainNode.gain.setValueAtTime(0.0, now);
    gainNode.gain.linearRampToValueAtTime(0.12, now + 0.015); // Rapid sparkle attack
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + duration); // Nostalgic long ring

    // Warm Lowpass Filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2600, now);

    // Connections
    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(audioContext.destination);

    // Play & Release
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
  }

  // Play an ascending magical arpeggio (Tinkerbell's Pixie Burst)
  function playMagicalArpeggio() {
    const pitches = [1.0, 1.2, 1.5, 1.8]; // Crystalline chord
    pitches.forEach((p, idx) => {
      setTimeout(() => {
        playMagicChime(p, 1.5);
      }, idx * 110);
    });
  }

  // Play a soft windchime ripple
  function playWindchimeEffect() {
    const notes = [1.0, 1.125, 1.25, 1.5, 1.68, 1.875, 2.0];
    const shuffle = notes.sort(() => 0.5 - Math.random()).slice(0, 4);
    shuffle.forEach((p, idx) => {
      setTimeout(() => {
        playMagicChime(p, 1.2);
      }, idx * 70);
    });
  }

  // ==========================================================================
  // Custom Background Canvas Particles (Sakura, Fireflies & Snowflake Flow)
  // ==========================================================================
  const particles = [];
  let snowTransition = 0.0; // Dynamic weather transition factor (0.0 = Ghibli Spring/Summer, 1.0 = Magical Winter)

  class SakuraPetal {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Stagger starting positions
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -20;
      this.size = Math.random() * 8 + 6;
      this.speedY = Math.random() * 1 + 0.8;
      this.speedX = Math.random() * 0.8 + 0.2;
      this.angle = Math.random() * Math.PI * 2;
      this.spin = Math.random() * 0.02 - 0.01;
      this.opacity = Math.random() * 0.4 + 0.3;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y / 30) * 0.4; // Swaying motion
      this.angle += this.spin;

      if (this.y > canvas.height + 20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      const activeOpacity = this.opacity * (1.0 - snowTransition);
      if (activeOpacity <= 0.01) return;

      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(this.angle);
      ctx.beginPath();
      // Draw a perfect Ghibli sakura petal
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(-this.size, -this.size/2, -this.size, this.size, 0, this.size*1.3);
      ctx.bezierCurveTo(this.size, this.size, this.size, -this.size/2, 0, 0);
      ctx.fillStyle = `rgba(255, 183, 197, ${activeOpacity})`;
      ctx.fill();
      ctx.restore();
    }
  }

  class Firefly {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height;
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 20;
      this.size = Math.random() * 3 + 2;
      this.speedY = -(Math.random() * 0.5 + 0.3);
      this.speedX = Math.random() * 0.6 - 0.3;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.pulseSpeed = Math.random() * 0.02 + 0.01;
      this.pulseDir = 1;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      
      // Gentle glow oscillation
      this.opacity += this.pulseSpeed * this.pulseDir;
      if (this.opacity > 0.8) this.pulseDir = -1;
      if (this.opacity < 0.1) this.pulseDir = 1;

      if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
        this.reset();
      }
    }

    draw() {
      const activeOpacity = this.opacity * (1.0 - snowTransition);
      if (activeOpacity <= 0.01) return;

      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      // Create radial glow profile
      const glow = ctx.createRadialGradient(this.x, this.y, 1, this.x, this.y, this.size * 3);
      glow.addColorStop(0, `rgba(254, 202, 87, ${activeOpacity})`);
      glow.addColorStop(0.3, `rgba(254, 202, 87, ${activeOpacity * 0.4})`);
      glow.addColorStop(1, 'rgba(254, 202, 87, 0)');
      ctx.fillStyle = glow;
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  class Snowflake {
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // Stagger starting positions
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = -15;
      this.size = Math.random() * 3 + 1.2;
      this.speedY = Math.random() * 1.1 + 0.7; // Snow falls gently
      this.speedX = Math.random() * 0.5 - 0.25; // Drifts slightly sideways
      this.opacity = Math.random() * 0.55 + 0.35;
    }

    update() {
      this.y += this.speedY;
      this.x += this.speedX + Math.sin(this.y / 40) * 0.3; // Elegant sway

      if (this.y > canvas.height + 15) {
        this.reset();
      }
    }

    draw() {
      const activeOpacity = this.opacity * snowTransition;
      if (activeOpacity <= 0.01) return;

      ctx.save();
      ctx.beginPath();
      // Draw standard glowing white snowflake circle
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      const glow = ctx.createRadialGradient(this.x, this.y, 0.5, this.x, this.y, this.size * 2);
      glow.addColorStop(0, `rgba(255, 255, 255, ${activeOpacity})`);
      glow.addColorStop(0.4, `rgba(255, 255, 255, ${activeOpacity * 0.6})`);
      glow.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = glow;
      ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Initialize Particles (Dual setup: Spring/Summer Ghibli vs. Winter snowfall Ghibli)
  for (let i = 0; i < 25; i++) {
    particles.push(new SakuraPetal());
    particles.push(new Firefly());
  }
  for (let i = 0; i < 40; i++) {
    particles.push(new Snowflake());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Smooth transition weather factor
    if (currentSlide === 7) {
      if (snowTransition < 1.0) snowTransition += 0.018;
    } else {
      if (snowTransition > 0.0) snowTransition -= 0.018;
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ==========================================================================
  // Mouse Cursor Fairy Dust Trail (Tinkerbell's Magic)
  // ==========================================================================
  window.addEventListener('mousemove', (e) => {
    // 15% chance to spawn a sparkle to avoid clutter
    if (Math.random() > 0.22) return;
    spawnSparkle(e.clientX, e.clientY);
  });

  window.addEventListener('click', (e) => {
    // Generate a beautiful splash of sparkles on clicks
    for (let i = 0; i < 12; i++) {
      spawnSparkle(e.clientX, e.clientY, true);
    }
  });

  function spawnSparkle(x, y, isClickSplash = false) {
    const sparkle = document.createElement('div');
    sparkle.className = 'magic-sparkle';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    // Randomize colors for a Ghibli star gradient
    const colors = ['#ffffff', '#feca57', '#ff9ff3', '#54a0ff', '#1dd1a1'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.background = `radial-gradient(circle, #fff 0%, ${randomColor} 70%, rgba(255,255,255,0) 100%)`;
    sparkle.style.boxShadow = `0 0 6px ${randomColor}, 0 0 12px ${randomColor}`;

    // Custom animation values passed to CSS variables
    const angle = Math.random() * Math.PI * 2;
    const distance = isClickSplash ? Math.random() * 70 + 30 : Math.random() * 30 + 10;
    const mx = Math.cos(angle) * distance;
    const my = Math.sin(angle) * distance;
    sparkle.style.setProperty('--mx', `${mx}px`);
    sparkle.style.setProperty('--my', `${my}px`);

    // Click splash size variance
    if (isClickSplash) {
      const size = Math.random() * 8 + 6;
      sparkle.style.width = `${size}px`;
      sparkle.style.height = `${size}px`;
    }

    document.body.appendChild(sparkle);

    // Remove element after animation finishes
    setTimeout(() => {
      sparkle.remove();
    }, 800);
  }

  // ==========================================================================
  // Slides Navigation & Progression System
  // ==========================================================================
  function updateSlides() {
    // Handle slides visibility
    slides.forEach(slide => {
      slide.classList.remove('active');
      if (parseInt(slide.getAttribute('data-slide')) === currentSlide) {
        slide.classList.add('active');
      }
    });

    // Update Progress bar width
    const progressPercent = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Update Slide Counter
    slideCounter.innerText = `Slide ${currentSlide} of ${totalSlides}`;

    // Update Back button disabled state
    if (currentSlide === 1) {
      btnBack.classList.add('disabled');
    } else {
      btnBack.classList.remove('disabled');
    }

    // Adapt Next button for final slide
    if (currentSlide === totalSlides) {
      btnNext.innerHTML = `Finish <i class="fa-solid fa-wand-magic-sparkles"></i>`;
      btnNext.style.background = 'linear-gradient(135deg, #feca57 0%, #ff9f43 100%)';
    } else {
      btnNext.innerHTML = `Next <i class="fa-solid fa-arrow-right"></i>`;
      btnNext.style.background = '';
    }

    // Play a gentle, unique pitch chime for transitions
    playMagicChime(0.9 + (currentSlide * 0.05), 1.6);
  }

  btnNext.addEventListener('click', () => {
    initAudioContext();
    if (currentSlide < totalSlides) {
      currentSlide++;
      updateSlides();
    } else {
      // Trigger magical arpeggio splash at the very end
      playMagicalArpeggio();
      // Shake together frame elegantly
      const togetherFrame = document.querySelector('.together-frame-container');
      if (togetherFrame) {
        togetherFrame.style.animation = 'none';
        setTimeout(() => {
          togetherFrame.style.animation = 'kenBurns 20s infinite alternate ease-in-out';
        }, 10);
      }
    }
  });

  btnBack.addEventListener('click', () => {
    initAudioContext();
    if (currentSlide > 1) {
      currentSlide--;
      updateSlides();
    }
  });

  // Hover sound effect on buttons
  const buttons = document.querySelectorAll('.nav-btn, .audio-container');
  buttons.forEach(btn => {
    btn.addEventListener('mouseenter', () => {
      playMagicChime(1.4, 0.8);
    });
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      btnNext.click();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      btnBack.click();
    }
  });

  // ==========================================================================
  // Magical Widget Triggers (Magic Bell & Audio Toggles)
  // ==========================================================================

  // Magic Bell Chime Arpeggio Trigger
  magicBell.addEventListener('click', () => {
    initAudioContext();
    
    // Chime procedural sounds
    playMagicalArpeggio();
    
    // Spawn massive cloud of floating stars on the bell
    const rect = magicBell.getBoundingClientRect();
    const bx = rect.left + rect.width / 2;
    const by = rect.top + rect.height / 2;
    for (let i = 0; i < 28; i++) {
      spawnSparkle(bx, by, true);
    }

    // Soft wobble animation trigger
    magicBell.classList.add('ringing');
    setTimeout(() => {
      magicBell.classList.remove('ringing');
    }, 800);
  });

  // Ambient Ghibli Music Player Toggle
  audioContainer.addEventListener('click', () => {
    initAudioContext();
    
    if (bgAudio.paused) {
      bgAudio.play().then(() => {
        soundWave.classList.add('playing');
        playWindchimeEffect();
      }).catch(err => {
        console.warn("Auto-play blocked by browser policy. Interaction needed first: ", err);
      });
    } else {
      bgAudio.pause();
      soundWave.classList.remove('playing');
      playMagicChime(0.7, 1.0); // low tone chime for pause
    }
  });

  // Attempt auto-play when user clicks anywhere on page first time
  document.body.addEventListener('click', () => {
    initAudioContext();
    if (bgAudio.paused && !soundWave.classList.contains('playing')) {
      // Gentle auto-play attempt on first interaction
      bgAudio.play().then(() => {
        soundWave.classList.add('playing');
      }).catch(() => {});
    }
  }, { once: true });
});
