/* ==========================================================================
   LOVE OF LIFE • INTERACTIVE APOLOGY APPLICATION
   Teja & Zainab Nawan Teja
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const entranceGate = document.getElementById('entrance-gate');
  const btnUnlock = document.getElementById('btn-unlock');
  const bgAudio = document.getElementById('bg-audio');
  const musicPlayerBar = document.getElementById('music-player-bar');
  const vinylDisc = document.getElementById('vinyl-disc');
  const vinylArtImg = document.getElementById('vinyl-art-img');
  const playerTrackBadge = document.getElementById('player-track-badge');
  const playerTrackTitle = document.getElementById('player-track-title');
  const btnPlayPause = document.getElementById('btn-play-pause');
  const btnNextTrack = document.getElementById('btn-next-track');
  const playIcon = document.getElementById('play-icon');
  const audioProgressFill = document.getElementById('audio-progress-fill');
  const audioProgressContainer = document.getElementById('audio-progress-container');
  const playerLyricSnippet = document.getElementById('player-lyric-snippet');
  const btnHeartsShower = document.getElementById('btn-hearts-shower');
  const songToast = document.getElementById('song-toast');
  const songToastText = document.getElementById('song-toast-text');

  // Slider & Decision
  const forgiveSlider = document.getElementById('forgive-slider');
  const sliderPercentage = document.getElementById('slider-percentage');
  const feedbackEmoji = document.getElementById('feedback-emoji');
  const feedbackText = document.getElementById('feedback-text');
  const btnForgiveYes = document.getElementById('btn-forgive-yes');
  const btnForgiveNo = document.getElementById('btn-forgive-no');
  const runawayHint = document.getElementById('runaway-hint');
  const btnKissShower = document.getElementById('btn-kiss-shower');

  // Modal Dialog
  const forgiveModal = document.getElementById('forgive-modal');
  const btnCloseModal = document.getElementById('btn-close-modal');
  const btnModalCelebrate = document.getElementById('btn-modal-celebrate');

  // Counter
  const countDays = document.getElementById('count-days');
  const countHours = document.getElementById('count-hours');
  const countMins = document.getElementById('count-mins');
  const countSecs = document.getElementById('count-secs');

  // --- Playlist Configuration (Automatic 2-Song Sequence) ---
  const playlist = [
    {
      title: "Khaab • Akhil",
      badge: "SONG 1 OF 2 • PUNJABI ROMANCE 🎧",
      src: "audio/khaab-punjabi-love.mp3",
      cover: "assets/images/forehead-kiss.png",
      lyrics: [
        '"Main jadon tere vall takkeya..."',
        '"Tu hass ke sir jhukaya..."',
        '"Bas ohdon da hi sajna..."',
        '"Main dil tere naam laya..."',
        '"Tu chann te main taara ban jaavan..."',
        '"Zainab, tu hi meri jaan ae..."',
        '"Tere bina jeena vi koi jeena hai?"',
        '"You are my girlfriend, my love, my forever ❤️"'
      ]
    },
    {
      title: "Main Tumhara • Dil Bechara",
      badge: "SONG 2 OF 2 • FOR MY AMMA 🕊️",
      src: "audio/Main_Tumhara_-_Dil_Bechara_Full_Song_Sushant-Sanjana_A._R._Rahman_Jonita-Hriday.mp3",
      cover: "assets/images/zainab-speech-hijab.jpg",
      lyrics: [
        '"Tum na hue mere toh kya..."',
        '"Main tumhara, main tumhara, main tumhara raha..."',
        '"Mere chanda, main tumhara sitaara raha..."',
        '"Khatam yeh zindagani hogi..."',
        '"Par yeh ishq na kabhi kam hoga..."',
        '"Amma... you are my all, my whole world 🥺"',
        '"Until God takes my soul, I am yours ❤️"'
      ]
    }
  ];

  let currentTrackIndex = 0;
  let lyricIdx = 0;
  let lyricInterval = null;

  function showSongToast(message) {
    if (!songToast || !songToastText) return;
    songToastText.textContent = message;
    songToast.classList.add('visible');
    setTimeout(() => {
      songToast.classList.remove('visible');
    }, 4500);
  }

  function startLyricRotation() {
    if (lyricInterval) clearInterval(lyricInterval);
    lyricIdx = 0;
    const currentTrack = playlist[currentTrackIndex];
    if (playerLyricSnippet && currentTrack.lyrics.length > 0) {
      playerLyricSnippet.textContent = currentTrack.lyrics[0];
    }

    lyricInterval = setInterval(() => {
      if (!bgAudio.paused && playerLyricSnippet) {
        const track = playlist[currentTrackIndex];
        lyricIdx = (lyricIdx + 1) % track.lyrics.length;
        playerLyricSnippet.style.opacity = '0';
        setTimeout(() => {
          playerLyricSnippet.textContent = track.lyrics[lyricIdx];
          playerLyricSnippet.style.opacity = '1';
        }, 300);
      }
    }, 4200);
  }

  function loadTrack(index, autoPlay = true) {
    currentTrackIndex = index % playlist.length;
    const track = playlist[currentTrackIndex];

    bgAudio.src = track.src;
    bgAudio.load();

    if (playerTrackBadge) playerTrackBadge.textContent = track.badge;
    if (playerTrackTitle) playerTrackTitle.textContent = track.title;
    if (vinylArtImg) vinylArtImg.src = track.cover;
    if (audioProgressFill) audioProgressFill.style.width = '0%';

    startLyricRotation();
    showSongToast(`Now Playing: ${track.title}`);

    if (autoPlay) {
      bgAudio.play().then(() => {
        vinylDisc.classList.add('spinning');
        playIcon.textContent = '⏸️';
      }).catch(err => {
        console.log('Autoplay handled:', err);
      });
    }
  }

  // When current song finishes, AUTOMATICALLY play next song!
  bgAudio.addEventListener('ended', () => {
    const nextIdx = (currentTrackIndex + 1) % playlist.length;
    createFloatingBursts(20, '🎵');
    createFloatingBursts(15, '💖');
    loadTrack(nextIdx, true);
  });

  // Next Track Button
  if (btnNextTrack) {
    btnNextTrack.addEventListener('click', () => {
      playPopSound();
      const nextIdx = (currentTrackIndex + 1) % playlist.length;
      loadTrack(nextIdx, true);
      createFloatingBursts(15, '✨');
    });
  }

  // --- Web Audio Synth for Interactive SFX ---
  let audioCtx = null;
  function getAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSweetChime() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.08);
        gain.gain.setValueAtTime(0, ctx.currentTime + index * 0.08);
        gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + index * 0.08 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.08 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.08);
        osc.stop(ctx.currentTime + index * 0.08 + 0.55);
      });
    } catch (e) {
      // AudioContext fallback
    }
  }

  function playPopSound() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.09);
    } catch (e) {}
  }

  // --- Unlock Website & Play Audio ---
  btnUnlock.addEventListener('click', () => {
    playSweetChime();
    getAudioContext();

    // Start background music with Track 1 (Khaab)
    bgAudio.volume = 0.8;
    loadTrack(0, true);

    // Animate gate removal
    entranceGate.classList.add('unlocked');
    musicPlayerBar.classList.remove('hidden');

    // Trigger celebration hearts
    createFloatingBursts(25, '🌸');
    createFloatingBursts(20, '💖');
  });
  });

  // --- Audio Player Controls ---
  btnPlayPause.addEventListener('click', () => {
    playPopSound();
    if (bgAudio.paused) {
      bgAudio.play();
      vinylDisc.classList.add('spinning');
      playIcon.textContent = '⏸️';
    } else {
      bgAudio.pause();
      vinylDisc.classList.remove('spinning');
      playIcon.textContent = '▶️';
    }
  });

  // Track progress
  bgAudio.addEventListener('timeupdate', () => {
    if (bgAudio.duration) {
      const pct = (bgAudio.currentTime / bgAudio.duration) * 100;
      audioProgressFill.style.width = `${pct}%`;
    }
  });

  // Seek on click
  audioProgressContainer.addEventListener('click', (e) => {
    const rect = audioProgressContainer.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    if (bgAudio.duration && width > 0) {
      bgAudio.currentTime = (clickX / width) * bgAudio.duration;
    }
  });

  // --- Relationship Time Counter ---
  // Approximate start date of their sweet journey (October 2019 based on earliest memory in folder)
  const loveStartDate = new Date('2019-10-04T00:00:00');
  function updateLoveTimer() {
    const now = new Date();
    const diffMs = now - loveStartDate;
    if (diffMs > 0) {
      const totalSecs = Math.floor(diffMs / 1000);
      const days = Math.floor(totalSecs / (3600 * 24));
      const hours = Math.floor((totalSecs % (3600 * 24)) / 3600);
      const mins = Math.floor((totalSecs % 3600) / 60);
      const secs = totalSecs % 60;

      if (countDays) countDays.textContent = days.toLocaleString();
      if (countHours) countHours.textContent = hours;
      if (countMins) countMins.textContent = mins;
      if (countSecs) countSecs.textContent = secs;
    }
  }
  updateLoveTimer();
  setInterval(updateLoveTimer, 1000);

  // --- Forgiveness Slider Logic ---
  const sliderMoods = [
    { max: 15, emoji: '🔪', text: '"Still planning your murder for saying sister! Beg harder!"' },
    { max: 35, emoji: '🩴', text: '"Virtual flying chappal incoming! How dare you, Teja?!"' },
    { max: 55, emoji: '🍕', text: '"Bring me chocolates, pizza, and 100 cuddles first!"' },
    { max: 75, emoji: '🥺', text: '"Okay, you are looking a little cute... but still mad!"' },
    { max: 95, emoji: '☕', text: '"Only if you promise to make elaichi tea every morning!"' },
    { max: 100, emoji: '💖', text: '"I FORGIVE YOU, MY SILLY HERO! I LOVE YOU SO MUCH! ❤️"' }
  ];

  forgiveSlider.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    sliderPercentage.textContent = `${val}%`;

    const matchedMood = sliderMoods.find(m => val <= m.max) || sliderMoods[sliderMoods.length - 1];
    feedbackEmoji.textContent = matchedMood.emoji;
    feedbackText.textContent = matchedMood.text;

    if (val === 100) {
      triggerForgivenessSuccess();
    }
  });

  // --- Runaway "No" Button (Playful interaction) ---
  const noButtonTexts = [
    'Are you sure? 🥺',
    'Try again! 😜',
    'Button broken! 💥',
    'Teja is too cute! 🥰',
    'Access Denied! 🚫',
    'You love me too much! ❤️',
    'Nice try, Madam Ji! 😂'
  ];
  let noClicks = 0;

  function dodgeNoButton(e) {
    if (e) e.preventDefault();
    playPopSound();
    noClicks++;

    // Random displacement within reasonable bounds
    const randomX = (Math.random() - 0.5) * 160;
    const randomY = (Math.random() - 0.5) * 80;

    btnForgiveNo.style.transform = `translate(${randomX}px, ${randomY}px) scale(0.9)`;
    btnForgiveNo.textContent = noButtonTexts[noClicks % noButtonTexts.length];
    
    // Make the YES button bigger and more enticing
    const currentScale = 1 + Math.min(noClicks * 0.08, 0.4);
    btnForgiveYes.style.transform = `scale(${currentScale})`;

    if (runawayHint) {
      runawayHint.textContent = "See? Even the universe won't let you say No! 😘";
    }
  }

  btnForgiveNo.addEventListener('mouseover', dodgeNoButton);
  btnForgiveNo.addEventListener('touchstart', (e) => {
    dodgeNoButton(e);
  }, { passive: false });
  btnForgiveNo.addEventListener('click', (e) => {
    dodgeNoButton(e);
  });

  // --- "YES, I Forgive You" Action ---
  function triggerForgivenessSuccess() {
    playSweetChime();
    forgiveSlider.value = 100;
    sliderPercentage.textContent = '100%';
    feedbackEmoji.textContent = '💖';
    feedbackText.textContent = '"I FORGIVE YOU, MY SILLY HERO! I LOVE YOU SO MUCH! ❤️"';

    // Open Native Dialog
    if (forgiveModal && typeof forgiveModal.showModal === 'function') {
      forgiveModal.showModal();
    }

    // Huge Confetti and Heart Storm
    createFloatingBursts(40, '💖');
    createFloatingBursts(30, '🎉');
    createFloatingBursts(30, '💋');
    createFloatingBursts(25, '🌸');
  }

  btnForgiveYes.addEventListener('click', () => {
    triggerForgivenessSuccess();
  });

  // Modal Close
  btnCloseModal.addEventListener('click', () => {
    playPopSound();
    forgiveModal.close();
  });

  btnModalCelebrate.addEventListener('click', () => {
    playSweetChime();
    forgiveModal.close();
    createFloatingBursts(35, '🫂');
    createFloatingBursts(35, '❤️');
  });

  // --- Kisses & Hearts Floating Shower ---
  btnKissShower.addEventListener('click', () => {
    playPopSound();
    createFloatingBursts(30, '💋');
    createFloatingBursts(15, '❤️');
  });

  btnHeartsShower.addEventListener('click', () => {
    playPopSound();
    createFloatingBursts(25, '💖');
    createFloatingBursts(15, '✨');
  });

  // --- Floating Emoji Particle Bursts ---
  function createFloatingBursts(count, emoji) {
    for (let i = 0; i < count; i++) {
      const span = document.createElement('span');
      span.textContent = emoji;
      span.style.position = 'fixed';
      span.style.zIndex = '99999';
      span.style.left = `${Math.random() * 95}vw`;
      span.style.top = `${85 + Math.random() * 15}vh`;
      span.style.fontSize = `${clampVal(18, 38)}px`;
      span.style.pointerEvents = 'none';
      span.style.transition = `all ${1.8 + Math.random() * 1.5}s cubic-bezier(0.12, 0.8, 0.32, 1)`;
      span.style.transform = `translateY(0) scale(0.6) rotate(${Math.random() * 60 - 30}deg)`;
      span.style.opacity = '1';
      document.body.appendChild(span);

      requestAnimationFrame(() => {
        const destY = -100 - Math.random() * 80;
        const destX = (Math.random() - 0.5) * 80;
        span.style.transform = `translate(${destX}px, ${destY}vh) scale(${0.8 + Math.random() * 0.6}) rotate(${Math.random() * 180 - 90}deg)`;
        span.style.opacity = '0';
      });

      setTimeout(() => {
        if (span.parentNode) span.parentNode.removeChild(span);
      }, 3500);
    }
  }

  function clampVal(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // --- Canvas Ambient Physics (Petals & Starlight) ---
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const maxParticles = 38;

    class RomanticParticle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = -20 - Math.random() * 50;
        this.size = 4 + Math.random() * 7;
        this.speedY = 0.6 + Math.random() * 1.4;
        this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
        this.angle = Math.random() * 360;
        this.spin = (Math.random() - 0.5) * 1.5;
        this.opacity = 0.25 + Math.random() * 0.55;
        this.type = Math.random() > 0.45 ? 'petal' : 'star';
        // Palette: rose petal pink, crimson, warm gold
        const colors = [
          'rgba(255, 117, 140, ',
          'rgba(255, 77, 121, ',
          'rgba(252, 211, 77, ',
          'rgba(255, 182, 193, '
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.015) * 0.8 + this.speedX * 0.3;
        this.angle += this.spin;

        if (this.y > height + 30) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.angle * Math.PI) / 180);
        ctx.fillStyle = this.colorBase + this.opacity + ')';

        if (this.type === 'petal') {
          // Draw curved rose petal
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(this.size * 1.3, -this.size * 0.4, this.size * 0.8, this.size);
          ctx.quadraticCurveTo(0, this.size * 1.3, -this.size * 0.8, this.size);
          ctx.quadraticCurveTo(-this.size * 1.3, -this.size * 0.4, 0, -this.size);
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw soft glowing starlight particle
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      const p = new RomanticParticle();
      p.y = Math.random() * height; // scatter initially
      particles.push(p);
    }

    function renderLoop() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
      }
      requestAnimationFrame(renderLoop);
    }
    renderLoop();
  }
});

