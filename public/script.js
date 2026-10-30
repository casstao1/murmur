const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  const closeMenu = () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    mobileNav.hidden = true;
  };

  menuToggle.addEventListener('click', () => {
    const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(opening));
    menuToggle.setAttribute('aria-label', opening ? 'Close menu' : 'Open menu');
    mobileNav.hidden = !opening;
  });

  mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMenu();
  });
}

// A changing ten-second contour. Browsers can only switch the motor on and off,
// so this approximates Sensate's described feel rather than its actual waveform.
const samplePattern = [650, 350, 1600, 250, 2500, 900, 2350, 350, 1050];
const sampleDuration = samplePattern.reduce((total, interval) => total + interval, 0);
const binauralBeatHz = 10;
const leftToneHz = 220;

const playButton = document.querySelector('#play-demo');
const playLabel = document.querySelector('.play-label');
const playIcon = document.querySelector('.play-icon');
const demoFeedback = document.querySelector('#demo-feedback');
const demoVisual = document.querySelector('.demo-visual');
let stopTimer = null;
let playing = false;
let vibrationStarted = false;
let audioRequested = false;
let audioReady = false;
let audioState = null;

function renderPlaybackStatus() {
  if (!playing) return;
  if (audioReady && vibrationStarted) {
    demoFeedback.textContent = 'Sound playing. Vibration may be felt on supported phones.';
  } else if (audioReady) {
    demoFeedback.textContent = 'Sound playing. Vibration unavailable here.';
  } else if (audioRequested) {
    demoFeedback.textContent = 'Starting sound…';
  } else if (vibrationStarted) {
    demoFeedback.textContent = 'Vibration playing. Sound unavailable here.';
  } else {
    demoFeedback.textContent = 'Visual sample only. Sound and vibration unavailable here.';
  }
}

function stopAudio() {
  const state = audioState;
  audioState = null;
  audioReady = false;
  if (!state) return;

  const { context, output, oscillators } = state;
  const now = context.currentTime;
  try {
    output.gain.cancelScheduledValues(now);
    output.gain.setValueAtTime(output.gain.value, now);
    output.gain.linearRampToValueAtTime(0, now + 0.12);
    oscillators.forEach((oscillator) => {
      try { oscillator.stop(now + 0.13); } catch (_) { /* Already stopped. */ }
    });
    window.setTimeout(() => context.close().catch(() => {}), 160);
  } catch (_) {
    context.close().catch(() => {});
  }
}

function startAudio() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return false;

  let context;
  try {
    context = new AudioContextClass();
    const now = context.currentTime;
    const durationSeconds = sampleDuration / 1000;
    const output = context.createGain();
    output.gain.setValueAtTime(0, now);
    output.gain.linearRampToValueAtTime(0.04, now + 0.65);
    output.gain.setValueAtTime(0.04, now + durationSeconds - 0.85);
    output.gain.linearRampToValueAtTime(0, now + durationSeconds - 0.05);
    output.connect(context.destination);

    // Separate tones go to each ear; their 10 Hz difference creates the beat.
    const oscillators = [leftToneHz, leftToneHz + binauralBeatHz].map((frequency, index) => {
      const oscillator = context.createOscillator();
      const panner = context.createStereoPanner();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, now);
      panner.pan.setValueAtTime(index === 0 ? -1 : 1, now);
      oscillator.connect(panner).connect(output);
      oscillator.start(now);
      oscillator.stop(now + durationSeconds);
      return oscillator;
    });

    audioState = { context, output, oscillators };
    const resume = context.state === 'running' ? Promise.resolve() : context.resume();
    Promise.resolve(resume).then(() => {
      if (audioState?.context !== context || !playing) return;
      audioReady = context.state === 'running';
      if (!audioReady) {
        stopAudio();
        audioRequested = false;
      }
      renderPlaybackStatus();
    }).catch(() => {
      if (audioState?.context !== context || !playing) return;
      stopAudio();
      audioRequested = false;
      renderPlaybackStatus();
    });
    return true;
  } catch (_) {
    if (context) context.close().catch(() => {});
    return false;
  }
}

function stopDemo(completed = false) {
  if (stopTimer) window.clearTimeout(stopTimer);
  stopTimer = null;
  if (typeof navigator.vibrate === 'function') {
    try { navigator.vibrate(0); } catch (_) { /* Vibration may be unavailable. */ }
  }
  stopAudio();
  playing = false;
  vibrationStarted = false;
  audioRequested = false;
  playButton.classList.remove('is-playing');
  demoVisual.classList.remove('is-playing');
  playButton.setAttribute('aria-pressed', 'false');
  playLabel.textContent = 'Play touch + sound';
  playIcon.textContent = '▶';
  demoFeedback.textContent = completed ? 'Finished. Play again.' : 'Stopped. Play again.';
}

function playDemo() {
  if (playing) {
    stopDemo();
    return;
  }

  vibrationStarted = false;
  if (typeof navigator.vibrate === 'function') {
    try { vibrationStarted = navigator.vibrate(samplePattern); } catch (_) { vibrationStarted = false; }
  }

  playing = true;
  playButton.classList.add('is-playing');
  demoVisual.classList.add('is-playing');
  playButton.setAttribute('aria-pressed', 'true');
  playLabel.textContent = 'Stop touch + sound';
  playIcon.textContent = '■';
  audioRequested = startAudio();
  renderPlaybackStatus();
  stopTimer = window.setTimeout(() => stopDemo(true), sampleDuration);
}

playButton?.addEventListener('click', playDemo);
document.addEventListener('visibilitychange', () => {
  if (document.hidden && playing) stopDemo();
});

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
