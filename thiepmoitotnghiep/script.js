// Initialize Confetti Effect for Envelope Opening
function initializeConfetti() {
  try {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) {
      console.error('Confetti canvas not found');
      return () => {};
    }
    const ctx = canvas.getContext('2d');
    let particles = [];
    const isMobile = window.innerWidth <= 768;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Confetti {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * (isMobile ? 8 : 12) + 4;
        this.vx = (Math.random() - 0.5) * (isMobile ? 6 : 8);
        this.vy = (Math.random() - 0.5) * (isMobile ? 6 : 8);
        this.alpha = 1;
        this.life = isMobile ? 80 : 120;
        this.maxLife = this.life;
        this.rotation = Math.random() * Math.PI * 2;
        this.shape = Math.random() > 0.5 ? 'square' : 'circle';
        this.color = `hsl(${Math.random() * 360}, 80%, 60%)`;
        this.spin = (Math.random() - 0.5) * 0.1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.rotation += this.spin;
        this.alpha = this.life / this.maxLife;
        this.life--;
        return this.life > 0;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        if (this.shape === 'square') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = particles.filter(p => p.update());
      particles.forEach(p => p.draw());
      if (particles.length > 0) requestAnimationFrame(animate);
    }

    function createConfetti(x, y, count) {
      for (let i = 0; i < count; i++) {
        particles.push(new Confetti(x, y));
      }
      if (particles.length > 0) animate();
    }

    return createConfetti;
  } catch (error) {
    console.error('Error initializing confetti:', error);
    return () => {};
  }
}

const createConfetti = initializeConfetti();

// Function to open the invitation
function openInvitation() {
  try {
    const envelopeContainer = document.getElementById('envelope-container');
    const envelopeFlap = document.querySelector('.envelope-flap');
    const envelopeFront = document.querySelector('.envelope-front');
    const envelopeBack = document.querySelector('.envelope-back');
    const envelopeContent = document.querySelector('.envelope-content');
    const audio1 = document.getElementById('backgroundMusic1');

    if (!envelopeContainer || !envelopeFlap || !envelopeFront || !envelopeBack || !envelopeContent || !audio1) {
      console.error('Missing DOM elements');
      return;
    }

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        envelopeContainer.classList.add('hidden');
        animateSections();
      }
    });

    tl.to('.envelope', { scale: 1.1, duration: 0.4, ease: 'power2.inOut' });
    tl.to(envelopeFlap, {
      rotateX: 180,
      duration: 1.2,
      ease: 'back.out(1.8)',
      onStart: () => envelopeFlap.classList.add('glow'),
      onComplete: () => envelopeFlap.classList.remove('glow'),
    }, '-=0.2');
    tl.to(envelopeContent, {
      opacity: 1,
      translateY: -60,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      onStart: () => {
        const envelopeRect = document.querySelector('.envelope').getBoundingClientRect();
        createConfetti(
          envelopeRect.left + envelopeRect.width / 2,
          envelopeRect.top + envelopeRect.height / 3,
          window.innerWidth <= 768 ? 50 : 100
        );
      }
    }, '-=0.8');
    tl.to([envelopeFront, envelopeBack], { opacity: 0.5, duration: 0.6 }, '-=0.6');
    tl.to('.envelope', { scale: 0.7, rotate: 10, y: -300, opacity: 0, duration: 0.8, ease: 'power2.in' });
    tl.to(envelopeContainer, { opacity: 0, duration: 0.4 }, '-=0.4');

    setTimeout(() => {
      audio1.play().catch(error => {
        console.error('Audio playback for music1 failed:', error);
        document.addEventListener('click', function playAudio1() {
          audio1.play().catch(err => console.error('Retry audio playback for music1 failed:', err));
          document.removeEventListener('click', playAudio1);
        }, { once: true });
      });
    }, 3000);
  } catch (error) {
    console.error('Error in openInvitation:', error);
  }
}

// Realistic Clustered Firework Effect
function initializeFireworks() {
  try {
    const canvas = document.getElementById('firework-canvas');
    if (!canvas) {
      console.error('Firework canvas not found');
      return () => {};
    }
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth <= 768;
    let bursts = [];

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Streak {
      constructor(x, y, angle, velocity, length, color, life) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(angle) * velocity;
        this.vy = Math.sin(angle) * velocity;
        this.length = length;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.gravity = 0.02;
        this.drift = (Math.random() - 0.5) * 0.1;
      }

      update() {
        this.vy += this.gravity;
        this.x += this.vx + this.drift;
        this.y += this.vy;
        this.life -= 1;
        this.vx *= 0.99;
        this.vy *= 0.99;
        return this.life > 0;
      }

      draw() {
        const alpha = this.life / this.maxLife;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        const endX = this.x - this.vx * this.length;
        const endY = this.y - this.vy * this.length;
        ctx.lineTo(endX, endY);
        ctx.strokeStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${alpha})`;
        ctx.stroke();
      }
    }

    class Burst {
      constructor(x, y, streakCount, color) {
        this.x = x;
        this.y = y;
        this.streaks = [];
        for (let i = 0; i < streakCount; i++) {
          const angle = (i / streakCount) * Math.PI * 2 + (Math.random() - 0.5) * 0.1;
          const velocity = 3 + Math.random() * 2;
          const length = isMobile ? 5 + Math.random() * 5 : 8 + Math.random() * 8;
          const life = isMobile ? 60 + Math.random() * 20 : 80 + Math.random() * 30;
          this.streaks.push(new Streak(x, y, angle, velocity, length, color, life));
        }
      }

      update() {
        this.streaks = this.streaks.filter(streak => streak.update());
        return this.streaks.length > 0;
      }

      draw() {
        this.streaks.forEach(streak => streak.draw());
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      bursts = bursts.filter(burst => burst.update());
      bursts.forEach(burst => burst.draw());
      requestAnimationFrame(animate);
    }
    animate();

    function createFireworks() {
      const colors = [
        { r: 255, g: 51, b: 51 },   // Red
        { r: 255, g: 215, b: 0 },   // Gold
        { r: 51, g: 255, b: 51 },   // Green
        { r: 51, g: 51, b: 255 },   // Blue
        { r: 255, g: 51, b: 255 },  // Purple
        { r: 255, g: 255, b: 255 }, // White
        { r: 255, g: 153, b: 51 },  // Orange
      ];
      const burstCount = isMobile ? 3 : 5;
      const streakCount = isMobile ? 20 : 30;

      for (let i = 0; i < burstCount; i++) {
        setTimeout(() => {
          const x = canvas.width * (0.3 + Math.random() * 0.4);
          const y = canvas.height * (0.2 + Math.random() * 0.3);
          const color = colors[Math.floor(Math.random() * colors.length)];
          bursts.push(new Burst(x, y, streakCount, color));
        }, i * 300);
      }

      for (let i = 0; i < (isMobile ? 2 : 3); i++) {
        setTimeout(() => {
          const x = canvas.width * (0.3 + Math.random() * 0.4);
          const y = canvas.height * (0.2 + Math.random() * 0.3);
          bursts.push(new Burst(x, y, Math.floor(streakCount / 2), { r: 255, g: 255, b: 255 }));
        }, i * 400 + 200);
      }
    }

    return createFireworks;
  } catch (error) {
    console.error('Error initializing fireworks:', error);
    return () => {};
  }
}

const createFireworks = initializeFireworks();

// Initialize Emoji Effect for Double-Click
function initializeEmojiEffect() {
  try {
    const canvas = document.getElementById('emoji-canvas');
    if (!canvas) {
      console.error('Emoji canvas not found');
      return () => {};
    }
    const ctx = canvas.getContext('2d');
    let emojis = [];
    const isMobile = window.innerWidth <= 768;

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Emoji {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = isMobile ? 24 : 36;
        this.vx = (Math.random() - 0.5) * (isMobile ? 8 : 12);
        this.vy = -(Math.random() * (isMobile ? 10 : 15) + 5);
        this.alpha = 1;
        this.life = isMobile ? 80 : 100;
        this.maxLife = this.life;
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.15;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.rotation += this.spin;
        this.alpha = this.life / this.maxLife;
        this.life--;
        return this.life > 0;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.globalAlpha = this.alpha;
        ctx.font = `${this.size}px Arial`;
        ctx.fillText('🖕', 0, 0);
        ctx.restore();
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      emojis = emojis.filter(p => p.update());
      emojis.forEach(p => p.draw());
      if (emojis.length > 0) requestAnimationFrame(animate);
    }

    function createEmojis(count) {
      for (let i = 0; i < count; i++) {
        const x = Math.random() * canvas.width;
        const y = canvas.height;
        emojis.push(new Emoji(x, y));
      }
      if (emojis.length > 0) animate();
    }

    return createEmojis;
  } catch (error) {
    console.error('Error initializing emoji effect:', error);
    return () => {};
  }
}

const createEmojis = initializeEmojiEffect();

// Countdown Timer with Flip Effect
function startCountdown() {
  try {
    const eventDate = new Date('2025-08-16T08:00:00').getTime();
    let prevValues = { days: null, hours: null, minutes: null, seconds: null };

    const x = setInterval(function() {
      const now = new Date().getTime();
      const distance = eventDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      updateFlip('days', days, prevValues.days);
      updateFlip('hours', hours, prevValues.hours);
      updateFlip('minutes', minutes, prevValues.minutes);
      updateFlip('seconds', seconds, prevValues.seconds);

      prevValues = { days, hours, minutes, seconds };

      if (distance < 0) {
        clearInterval(x);
        const countdown = document.getElementById('countdown');
        if (countdown) {
          countdown.innerHTML = '<span class="text-2xl neon-3d">Sự kiện đã bắt đầu!</span>';
        }
      }
    }, 1000);

    function updateFlip(elementId, newValue, prevValue) {
      const flipCard = document.getElementById(`flip-${elementId}`);
      if (!flipCard) return;
      const formattedValue = newValue < 10 ? `0${newValue}` : newValue;
      if (prevValue !== null && newValue !== prevValue) {
        const front = flipCard.querySelector('.flip-card-front');
        const back = flipCard.querySelector('.flip-card-back');
        if (front && back) {
          back.textContent = formattedValue;
          flipCard.classList.add('flip');
          setTimeout(() => {
            front.textContent = formattedValue;
            flipCard.classList.remove('flip');
            const box = document.getElementById(elementId);
            if (box) {
              box.classList.add('flash');
              setTimeout(() => box.classList.remove('flash'), 500);
            }
          }, 600);
        }
      } else {
        const front = flipCard.querySelector('.flip-card-front');
        const back = flipCard.querySelector('.flip-card-back');
        if (front && back) {
          front.textContent = formattedValue;
          back.textContent = formattedValue;
        }
      }
    }
  } catch (error) {
    console.error('Error in startCountdown:', error);
  }
}

// Lightbox for Gallery
function openLightbox(src) {
  try {
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightboxImg) {
      lightboxImg.src = src;
      $('#lightbox').fadeIn(500);
      gsap.from('#lightbox-img', {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: 'power3.out'
      });
    }
  } catch (error) {
    console.error('Error in openLightbox:', error);
  }
}

function closeLightbox() {
  try {
    $('#lightbox').fadeOut(500);
  } catch (error) {
    console.error('Error in closeLightbox:', error);
  }
}

// Animate sections on scroll
function animateSections() {
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    gsap.from(section.querySelectorAll('h1, h2, p, img, .content-box, .countdown-box'), {
      opacity: 0,
      y: 50,
      scale: 0.9,
      duration: 1.5,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    });
  });
  createFireworks();
}

// Hiển thị icon trái tim và dòng chữ chạy nếu là mobile
function showMobileMusicNotice() {
  if (window.innerWidth > 768) return;
  var notice = document.getElementById('mobile-music-notice');
  var heart = document.getElementById('heart-music-btn');
  if (notice) notice.style.display = 'block';
  if (heart) {
    heart.style.display = 'flex';
    heart.onclick = function(e) {
      e.stopPropagation();
      var audio1 = document.getElementById('backgroundMusic1');
      if (audio1) {
        audio1.play().catch(err => console.error('Play music on heart click failed:', err));
      }
      heart.style.transform = 'scale(1.2)';
      setTimeout(() => heart.style.transform = '', 200);
    };
  }
}

// Hiệu ứng mũ tốt nghiệp mờ mờ bay quanh màn hình
(function initializeHearts() {
  const canvas = document.getElementById('heart-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = window.innerWidth;
  let height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }
  window.addEventListener('resize', resize);

  // Tạo mũ tốt nghiệp bằng path
  function drawGraduationCap(x, y, size, alpha, rotate = 0) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(rotate);
    ctx.scale(size / 40, size / 40);
    
    // Vẽ mũ tốt nghiệp
    ctx.beginPath();
    ctx.moveTo(-20, 0);
    ctx.lineTo(0, -10);
    ctx.lineTo(20, 0);
    ctx.lineTo(0, 10);
    ctx.closePath();
    ctx.fillStyle = 'rgba(191, 165, 138, 0.3)';
    ctx.shadowColor = 'rgba(191, 165, 138, 0.2)';
    ctx.shadowBlur = 8;
    ctx.fill();
    
    // Vẽ viền mũ
    ctx.strokeStyle = 'rgba(34, 34, 34, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Vẽ dây tua
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, 20);
    ctx.strokeStyle = 'rgba(34, 34, 34, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Vẽ đầu tua
    ctx.beginPath();
    ctx.arc(0, 20, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(191, 165, 138, 0.3)';
    ctx.fill();
    
    ctx.restore();
  }

  // Tạo mảng mũ tốt nghiệp
  const capCount = Math.max(18, Math.floor(width / 60));
  const caps = Array.from({length: capCount}, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    size: 18 + Math.random() * 22,
    alpha: 0.15 + Math.random() * 0.25,
    speed: 0.3 + Math.random() * 0.5,
    drift: (Math.random() - 0.5) * 0.3,
    rotate: Math.random() * Math.PI * 2,
    rotateSpeed: (Math.random() - 0.5) * 0.003
  }));

  function animateCaps() {
    ctx.clearRect(0, 0, width, height);
    for (const c of caps) {
      c.y -= c.speed;
      c.x += c.drift;
      c.rotate += c.rotateSpeed;
      if (c.y < -c.size) {
        c.y = height + c.size;
        c.x = Math.random() * width;
      }
      if (c.x < -c.size) c.x = width + c.size;
      if (c.x > width + c.size) c.x = -c.size;
      drawGraduationCap(c.x, c.y, c.size, c.alpha, c.rotate);
    }
    requestAnimationFrame(animateCaps);
  }
  animateCaps();
})();

// Book Flip Logic
(function() {
  function isMobile() {
    return window.innerWidth <= 768;
  }
  let currentSpread = 0;
  let totalSpreads = 0;
  let spreads = [];
  function updateBookView() {
    spreads.forEach((spread, idx) => {
      if (idx === currentSpread) {
        spread.style.display = 'flex';
        spread.classList.add('active');
        // Mobile: chỉ hiện 1 trang (left nếu có, nếu không thì right)
        if (isMobile()) {
          let pages = spread.querySelectorAll('.book-page');
          pages.forEach((page, i) => {
            if (i === 0) {
              page.style.display = 'flex';
            } else {
              page.style.display = 'none';
            }
          });
        } else {
          let pages = spread.querySelectorAll('.book-page');
          pages.forEach(page => page.style.display = 'flex');
        }
      } else {
        spread.style.display = 'none';
        spread.classList.remove('active');
        // Ẩn toàn bộ trang trong spread không active
        let pages = spread.querySelectorAll('.book-page');
        pages.forEach(page => page.style.display = 'none');
      }
    });
    document.getElementById('prev-page').style.display = currentSpread === 0 ? 'none' : 'block';
    document.getElementById('next-page').style.display = currentSpread === totalSpreads - 1 ? 'none' : 'block';
  }
  function goToSpread(idx) {
    if (idx < 0 || idx >= totalSpreads) return;
    const direction = idx > currentSpread ? 1 : -1;
    const current = spreads[currentSpread];
    const next = spreads[idx];
    if (current && next) {
      current.classList.add('flipping');
      current.style.transform = `rotateY(${direction * -70}deg)`;
      current.style.opacity = '0.2';
      setTimeout(() => {
        current.classList.remove('flipping');
        current.style.transform = '';
        current.style.opacity = '';
        current.style.display = 'none';
        next.style.display = 'flex';
        next.classList.add('flipping');
        next.style.transform = `rotateY(${direction * 70}deg)`;
        next.style.opacity = '0.2';
        setTimeout(() => {
          next.style.transform = '';
          next.style.opacity = '';
          next.classList.remove('flipping');
          currentSpread = idx;
          updateBookView();
        }, 350);
      }, 350);
    } else {
      currentSpread = idx;
      updateBookView();
    }
  }
  window.addEventListener('DOMContentLoaded', function() {
    spreads = Array.from(document.querySelectorAll('.book-spread'));
    totalSpreads = spreads.length;
    document.getElementById('prev-page').onclick = function() { goToSpread(currentSpread - 1); };
    document.getElementById('next-page').onclick = function() { goToSpread(currentSpread + 1); };
    updateBookView();
    window.addEventListener('resize', updateBookView);
  });
})();

// Initialize
window.onload = function() {
  try {
    startCountdown();
    const audio1 = document.getElementById('backgroundMusic1');

    if (!audio1) {
      console.error('Audio element missing:', { audio1 });
    } else {
      audio1.volume = 0.3;
    }

    // Initialize ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);
    // Thêm dòng chữ chạy và icon trái tim cho mobile
    showMobileMusicNotice();
  } catch (error) {
    console.error('Error in window.onload:', error);
  }
  // Xử lý gửi lời nhắn từ form (chỉ báo thành công, không lưu database)
  const form = document.getElementById('messageForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const message = document.getElementById('message').value.trim();
      const status = document.getElementById('formStatus');
      if (!name || !message) {
        status.textContent = 'Vui lòng nhập đầy đủ tên và lời nhắn.';
        return;
      }
      status.textContent = 'Gửi lời nhắn thành công!';
      form.reset();
      // Hiệu ứng trái tim bay ra
      showHeartEffect();
    });
  }

  // Hiệu ứng trái tim bay ra khi gửi thành công
  function showHeartEffect() {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.style.position = 'fixed';
    heart.style.left = '50%';
    heart.style.top = '60%';
    heart.style.fontSize = '3rem';
    heart.style.zIndex = '9999';
    heart.style.transform = 'translate(-50%, -50%) scale(1)';
    heart.style.transition = 'all 1.2s cubic-bezier(0.4,0,0.2,1)';
    document.body.appendChild(heart);
    setTimeout(() => {
      heart.style.top = '30%';
      heart.style.opacity = '0';
      heart.style.transform = 'translate(-50%, -50%) scale(2)';
    }, 100);
    setTimeout(() => {
      heart.remove();
    }, 1300);
  }
};
