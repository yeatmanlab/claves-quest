// Shared namespace for the whole app (loaded via classic <script> tags, no bundler).
window.Claves = window.Claves || {};

(function (Claves) {
  "use strict";

  // Tiny hyperscript-style DOM builder: h('div', {class:'x', onClick:fn}, 'text', childEl)
  function h(tag, attrs, ...children) {
    const node = document.createElement(tag);
    attrs = attrs || {};
    for (const [key, val] of Object.entries(attrs)) {
      if (val === null || val === undefined || val === false) continue;
      if (key === "class") node.className = val;
      else if (key === "html") node.innerHTML = val;
      else if (key.startsWith("on") && typeof val === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), val);
      } else {
        node.setAttribute(key, val);
      }
    }
    for (const child of children.flat(Infinity)) {
      if (child === null || child === undefined || child === false) continue;
      node.appendChild(
        child instanceof Node ? child : document.createTextNode(String(child))
      );
    }
    return node;
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sample(arr, n) {
    return shuffle(arr).slice(0, n);
  }

  function uid(prefix) {
    return (prefix || "id") + "_" + Math.random().toString(36).slice(2, 9);
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function mount(root, node) {
    root.innerHTML = "";
    root.appendChild(node);
  }

  function announce(msg) {
    const live = document.getElementById("sr-announcer");
    if (live) live.textContent = msg;
  }

  function starsToEmoji(count, max) {
    max = max || 3;
    return "⭐".repeat(clamp(count, 0, max)) + "☆".repeat(max - clamp(count, 0, max));
  }

  // Lightweight canvas confetti burst -- no external libraries.
  function confettiBurst() {
    const canvas = document.createElement("canvas");
    canvas.className = "confetti-canvas";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const colors = ["#ffb703", "#8258ff", "#2f9e5c", "#1f9bb0", "#ff7a59", "#ff5d5d"];
    const pieces = Array.from({ length: 90 }, () => ({
      x: canvas.width / 2 + (Math.random() - 0.5) * 120,
      y: canvas.height * 0.35 + (Math.random() - 0.5) * 60,
      vx: (Math.random() - 0.5) * 10,
      vy: Math.random() * -9 - 3,
      size: Math.random() * 7 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rot: Math.random() * Math.PI,
      vrot: (Math.random() - 0.5) * 0.3,
      shape: Math.random() > 0.5 ? "rect" : "circle",
    }));
    const gravity = 0.35;
    let frame = 0;
    const maxFrames = 130;

    function tick() {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of pieces) {
        p.vy += gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rot += p.vrot;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = clamp(1 - frame / maxFrames, 0, 1);
        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      if (frame < maxFrames) {
        requestAnimationFrame(tick);
      } else {
        canvas.remove();
      }
    }
    requestAnimationFrame(tick);
  }

  Claves.h = h;
  Claves.shuffle = shuffle;
  Claves.sample = sample;
  Claves.uid = uid;
  Claves.clamp = clamp;
  Claves.mount = mount;
  Claves.announce = announce;
  Claves.starsToEmoji = starsToEmoji;
  Claves.confettiBurst = confettiBurst;
})(window.Claves);
