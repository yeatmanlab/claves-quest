// "Discussion Circle" -- a dialogic-teaching activity. There is no single
// right answer: the child picks a viewpoint they relate to, picks a sentence
// starter, and writes a short reflection which is saved to their journal.
// Always awards full stars -- this activity is about engagement, not correctness.
window.Claves = window.Claves || {};
Claves.games = Claves.games || {};

(function (Claves) {
  "use strict";

  const { h, announce } = Claves;

  function mount(container, activity, { onComplete }) {
    const data = activity.data;
    let selectedVoice = null;
    let selectedStarter = null;

    const voicesWrap = h("div", { class: "discuss-voices" });
    data.voices.forEach((v) => {
      const bubble = h(
        "div",
        {
          class: "voice-bubble",
          role: "button",
          tabindex: "0",
          onClick: () => selectVoice(v, bubble),
          onKeydown: (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              selectVoice(v, bubble);
            }
          },
        },
        h("div", { class: "voice-avatar" }, v.emoji),
        h(
          "div",
          {},
          h("span", { class: "voice-name" }, v.name),
          h("span", { class: "voice-quote" }, `“${v.quote}”`)
        )
      );
      voicesWrap.appendChild(bubble);
    });

    const startersWrap = h("div", { class: "reflect-starters" });
    data.starters.forEach((s) => {
      const chip = h("button", { class: "starter-chip", onClick: () => selectStarter(s, chip) }, s);
      startersWrap.appendChild(chip);
    });

    const textarea = h("textarea", {
      class: "reflect-box",
      placeholder: "Finish your thought here...",
      rows: "4",
      onInput: updateShareEnabled,
    });
    const shareBtn = h(
      "button",
      { class: "btn green block", disabled: true, onClick: onShare },
      "Share to the Circle 💬"
    );
    const feedback = h("p", { class: "wb-status" }, "");

    function selectVoice(voice, bubbleEl) {
      selectedVoice = voice;
      [...voicesWrap.children].forEach((c) => c.classList.remove("selected"));
      bubbleEl.classList.add("selected");
      Claves.sound.playClick();
      updateShareEnabled();
    }

    function selectStarter(text, chipEl) {
      selectedStarter = text;
      [...startersWrap.children].forEach((c) => c.classList.remove("selected"));
      chipEl.classList.add("selected");
      if (!textarea.value.trim()) {
        textarea.value = text.replace("___", "").trim() + " ";
      }
      textarea.focus();
      Claves.sound.playClick();
      updateShareEnabled();
    }

    function updateShareEnabled() {
      shareBtn.disabled = !(selectedVoice && selectedStarter && textarea.value.trim().length > 4);
    }

    function onShare() {
      Claves.store.addJournalEntry({
        question: data.question,
        voice: selectedVoice.name,
        text: textarea.value.trim(),
      });
      Claves.sound.playCorrect();
      feedback.textContent = "Thanks for sharing your thinking! Saved to My Journal.";
      announce(feedback.textContent);
      voicesWrap.querySelectorAll(".voice-bubble").forEach((b) => (b.style.pointerEvents = "none"));
      startersWrap.querySelectorAll(".starter-chip").forEach((b) => (b.disabled = true));
      textarea.disabled = true;
      shareBtn.disabled = true;
      setTimeout(() => onComplete(3), 900);
    }

    Claves.mount(
      container,
      h(
        "div",
        { class: "activity-body" },
        h(
          "div",
          { class: "discuss-scene" },
          h("div", { class: "discuss-question" }, data.question),
          h("p", { class: "wb-status" }, "Who do you agree with most?"),
          voicesWrap,
          h("p", { class: "wb-status" }, "Pick a sentence starter, then finish your thought:"),
          startersWrap,
          textarea,
          shareBtn,
          feedback
        )
      )
    );
  }

  Claves.games.discussion = { mount };
})(window.Claves);
