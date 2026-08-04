// "Word Builder" -- shared engine for two activity modes:
//   mode: "morphology" -- snap prefix/root/suffix pieces together to build a word
//   mode: "syntax"     -- arrange shuffled word tiles into a correct sentence
// Both are the same "tap a piece, it fills the next empty slot" interaction,
// checked as an ordered sequence, so one engine serves both.
window.Claves = window.Claves || {};
Claves.games = Claves.games || {};

(function (Claves) {
  "use strict";

  const { h, shuffle, announce } = Claves;

  function mount(container, activity, { onComplete }) {
    const rounds = activity.data.rounds;
    const isSyntax = activity.mode === "syntax";
    let roundIdx = 0;
    let totalMistakes = 0;

    const root = h("div", { class: "activity-body" });
    Claves.mount(container, root);
    renderRound();

    function renderRound() {
      const round = rounds[roundIdx];
      const answerParts = round.answerParts;
      const bank = shuffle(
        answerParts
          .map((t, i) => ({ text: t, key: "a" + i }))
          .concat((round.distractors || []).map((t, i) => ({ text: t, key: "d" + i })))
      );
      let slots = new Array(answerParts.length).fill(null);
      const usedKeys = new Set();

      const progress = h(
        "div",
        { class: "progress-bar" },
        h("div", { style: `width:${(roundIdx / rounds.length) * 100}%` })
      );
      const clueCard = h(
        "div",
        { class: "wb-clue-card" },
        h("div", { class: "wb-emoji" }, round.emoji || ""),
        h(
          "div",
          { class: "wb-clue-text" },
          isSyntax ? "Put the words in order to build a sentence:" : `Build a word that means: “${round.clue}”`
        )
      );
      const slotsWrap = h("div", { class: "wb-slots" });
      const bankWrap = h("div", { class: "wb-bank" });
      const feedback = h("p", { class: "wb-status" }, "");
      const checkBtn = h("button", { class: "btn green block", disabled: true, onClick: onCheck }, "Check");

      function pieceByKey(key) {
        return bank.find((p) => p.key === key);
      }

      function renderSlots() {
        slotsWrap.innerHTML = "";
        slots.forEach((key, i) => {
          const piece = key ? pieceByKey(key) : null;
          slotsWrap.appendChild(
            h(
              "div",
              {
                class: "wb-slot" + (piece ? " filled" : ""),
                role: piece ? "button" : null,
                tabindex: piece ? "0" : null,
                onClick: piece ? () => removeFromSlot(i) : null,
                onKeydown: piece
                  ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        removeFromSlot(i);
                      }
                    }
                  : null,
              },
              piece ? piece.text : ""
            )
          );
        });
        checkBtn.disabled = slots.some((s) => s === null);
      }

      function renderBank() {
        bankWrap.innerHTML = "";
        bank.forEach((p) => {
          const used = usedKeys.has(p.key);
          bankWrap.appendChild(
            h(
              "button",
              { class: "wb-piece" + (used ? " used" : ""), disabled: used, onClick: () => placeInSlot(p.key) },
              p.text
            )
          );
        });
      }

      function placeInSlot(key) {
        const emptyIdx = slots.findIndex((s) => s === null);
        if (emptyIdx === -1) return;
        slots[emptyIdx] = key;
        usedKeys.add(key);
        Claves.sound.playClick();
        renderSlots();
        renderBank();
      }

      function removeFromSlot(i) {
        usedKeys.delete(slots[i]);
        slots[i] = null;
        Claves.sound.playClick();
        renderSlots();
        renderBank();
      }

      function onCheck() {
        const chosen = slots.map((key) => pieceByKey(key).text);
        const correct =
          chosen.length === answerParts.length && chosen.every((t, i) => t === answerParts[i]);
        if (correct) {
          Claves.sound.playCorrect();
          feedback.textContent = isSyntax ? "Great sentence!" : `Nice! “${chosen.join("")}” is a real word.`;
          announce(feedback.textContent);
          setTimeout(() => {
            roundIdx++;
            if (roundIdx >= rounds.length) finish();
            else renderRound();
          }, 900);
        } else {
          totalMistakes++;
          Claves.sound.playWrong();
          slotsWrap.classList.add("shake");
          setTimeout(() => slotsWrap.classList.remove("shake"), 400);
          feedback.textContent = "Not quite -- try rearranging the pieces!";
          announce(feedback.textContent);
        }
      }

      renderSlots();
      renderBank();
      root.innerHTML = "";
      root.append(progress, clueCard, slotsWrap, bankWrap, checkBtn, feedback);
    }

    function finish() {
      const stars = totalMistakes <= 1 ? 3 : totalMistakes <= 4 ? 2 : 1;
      setTimeout(() => onComplete(stars), 300);
    }
  }

  Claves.games.wordbuilder = { mount };
})(window.Claves);
