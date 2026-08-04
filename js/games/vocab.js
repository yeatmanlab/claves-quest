// "Word Den" -- a memory-match game pairing each vocabulary word with its
// kid-friendly definition. Contract: mount(container, activity, { onComplete }).
window.Claves = window.Claves || {};
Claves.games = Claves.games || {};

(function (Claves) {
  "use strict";

  const MAX_PAIRS = 6;
  const { h, shuffle, sample, announce } = Claves;

  function mount(container, activity, { onComplete }) {
    const allPairs = activity.data.pairs;
    const pairs = allPairs.length > MAX_PAIRS ? sample(allPairs, MAX_PAIRS) : shuffle(allPairs);

    let cards = [];
    pairs.forEach((pair, i) => {
      const pairId = "p" + i;
      cards.push({ id: pairId + "-w", pairId, side: "word", label: pair.word });
      cards.push({ id: pairId + "-c", pairId, side: "clue", label: pair.clue, emoji: pair.emoji });
    });
    cards = shuffle(cards);

    let flipped = [];
    let matched = new Set();
    let mistakes = 0;
    let locked = false;

    const status = h("p", { class: "wb-status" }, `Pairs found: 0 / ${pairs.length}`);
    const grid = h("div", { class: "vocab-grid" });

    function cardNode(card) {
      const el = h(
        "div",
        {
          class: "vocab-card",
          role: "button",
          tabindex: "0",
          "aria-label": "Mystery card",
          onClick: () => handleFlip(card.id, el),
          onKeydown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleFlip(card.id, el);
            }
          },
        },
        h(
          "div",
          { class: "vocab-card-inner" },
          h("div", { class: "vocab-face front" }, "🗝️"),
          h(
            "div",
            { class: "vocab-face back" },
            card.side === "clue" && card.emoji ? h("div", {}, card.emoji) : null,
            h("div", {}, card.label)
          )
        )
      );
      el.dataset.cardId = card.id;
      return el;
    }

    cards.forEach((c) => grid.appendChild(cardNode(c)));

    function findCardEl(id) {
      return grid.querySelector(`[data-card-id="${id}"]`);
    }

    function handleFlip(id, el) {
      if (locked) return;
      if (matched.has(id) || flipped.some((f) => f.id === id)) return;
      el.classList.add("flipped");
      flipped.push({ id, el, ...cards.find((c) => c.id === id) });
      if (flipped.length < 2) return;

      locked = true;
      const [a, b] = flipped;
      if (a.pairId === b.pairId) {
        Claves.sound.playCorrect();
        setTimeout(() => {
          matched.add(a.id);
          matched.add(b.id);
          a.el.classList.add("matched");
          b.el.classList.add("matched");
          flipped = [];
          locked = false;
          status.textContent = `Pairs found: ${matched.size / 2} / ${pairs.length}`;
          announce(`Match! ${a.label} means ${b.side === "clue" ? b.label : a.label}.`);
          if (matched.size === cards.length) {
            finish();
          }
        }, 500);
      } else {
        mistakes++;
        Claves.sound.playWrong();
        a.el.classList.add("wrong");
        b.el.classList.add("wrong");
        announce("Not a match, try again.");
        setTimeout(() => {
          a.el.classList.remove("flipped", "wrong");
          b.el.classList.remove("flipped", "wrong");
          flipped = [];
          locked = false;
        }, 900);
      }
    }

    function finish() {
      const stars = mistakes <= 2 ? 3 : mistakes <= 5 ? 2 : 1;
      status.textContent = "All matched!";
      setTimeout(() => onComplete(stars), 700);
    }

    Claves.mount(
      container,
      h(
        "div",
        { class: "activity-body" },
        h("div", { class: "wb-clue-card" }, "Tap two cards to find a matching word and meaning.", status),
        grid
      )
    );
  }

  Claves.games.vocab = { mount };
})(window.Claves);
