// Tiny synthesized sound effects via Web Audio API -- no audio asset files needed.
window.Claves = window.Claves || {};

(function (Claves) {
  "use strict";

  let ctx = null;
  function getCtx() {
    if (!ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) ctx = new AudioCtx();
    }
    if (ctx && ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function isMuted() {
    return localStorage.getItem("claves-muted") === "1";
  }
  function setMuted(val) {
    localStorage.setItem("claves-muted", val ? "1" : "0");
  }

  function tone(freq, start, duration, type, gainPeak) {
    const audio = getCtx();
    if (!audio || isMuted()) return;
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, audio.currentTime + start);
    gain.gain.linearRampToValueAtTime(gainPeak || 0.18, audio.currentTime + start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + start + duration);
    osc.connect(gain).connect(audio.destination);
    osc.start(audio.currentTime + start);
    osc.stop(audio.currentTime + start + duration + 0.02);
  }

  function playCorrect() {
    tone(523.25, 0, 0.12, "triangle");
    tone(783.99, 0.09, 0.16, "triangle");
  }

  function playWrong() {
    tone(180, 0, 0.18, "sawtooth", 0.12);
  }

  function playClick() {
    tone(440, 0, 0.05, "square", 0.06);
  }

  function playCelebrate() {
    [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.1, 0.22, "triangle"));
  }

  function playUnlock() {
    tone(392, 0, 0.1, "sine");
    tone(523.25, 0.1, 0.1, "sine");
    tone(659.25, 0.2, 0.22, "sine");
  }

  Claves.sound = {
    isMuted,
    setMuted,
    playCorrect,
    playWrong,
    playClick,
    playCelebrate,
    playUnlock,
  };
})(window.Claves);
