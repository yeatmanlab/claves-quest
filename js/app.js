// Main app controller: a tiny hand-rolled screen router (home -> map -> land ->
// activity), plus the shared topbar and reward-overlay flow that every mini-game
// funnels through via its onComplete(stars) callback.
window.Claves = window.Claves || {};

(function (Claves) {
  "use strict";

  const { h, mount, starsToEmoji } = Claves;
  const root = document.getElementById("app");

  let nav = { screen: "home" };

  function go(screen, params) {
    nav = Object.assign({ screen }, params || {});
    document.querySelectorAll(".confetti-canvas").forEach((c) => c.remove());
    render();
    window.scrollTo(0, 0);
  }

  function topbar(opts) {
    opts = opts || {};
    return h(
      "div",
      { class: "topbar" },
      h(
        "button",
        { class: "icon-btn", "aria-label": opts.onBack ? "Back" : "Map", onClick: opts.onBack || (() => go("map")) },
        opts.onBack ? "⬅️" : "🗝️"
      ),
      h(
        "div",
        { class: "key-pill" },
        h("span", { class: "key-icon" }, "🔑"),
        `${Claves.store.totalKeys()} / ${Claves.store.totalPossibleKeys()}`
      ),
      h("div", { class: "spacer" }),
      h("button", { class: "icon-btn", "aria-label": "My badges", onClick: () => go("badges") }, "🏅"),
      h("button", { class: "icon-btn", "aria-label": "My journal", onClick: () => go("journal") }, "📔"),
      h(
        "button",
        {
          class: "icon-btn",
          "aria-label": Claves.sound.isMuted() ? "Unmute sound" : "Mute sound",
          onClick: () => {
            Claves.sound.setMuted(!Claves.sound.isMuted());
            render();
          },
        },
        Claves.sound.isMuted() ? "🔇" : "🔊"
      )
    );
  }

  function renderHome() {
    const savedName = Claves.store.getName();
    const input = h("input", {
      class: "name-input",
      placeholder: "Type your name",
      maxlength: "24",
      onKeydown: (e) => {
        if (e.key === "Enter") start();
      },
    });
    input.value = savedName;

    function start() {
      Claves.store.setName(input.value.trim() || "Explorer");
      Claves.sound.playUnlock();
      go("map");
    }

    mount(
      root,
      h(
        "div",
        { class: "screen home-screen" },
        h("div", { class: "home-mascot" }, Claves.DATA.mascot.emoji),
        h("h1", { class: "logo-title" }, "CLAVES Quest"),
        h(
          "p",
          { class: "logo-sub" },
          `Collect keys, build words, and share your ideas with ${Claves.DATA.mascot.name} the fox!`
        ),
        input,
        h(
          "button",
          { class: "btn big gold", onClick: start },
          savedName ? "Continue Adventure ➜" : "Start Adventure 🚀"
        )
      )
    );
    input.focus();
  }

  function renderMap() {
    const lands = Claves.DATA.lands;
    const pathWrap = h("div", { class: "map-path" });

    lands.forEach((land, i) => {
      const unlocked = Claves.store.isLandUnlocked(land.id);
      const complete = Claves.store.isLandComplete(land.id);
      const keys = Claves.store.keysCollectedInLand(land.id);

      pathWrap.appendChild(
        h(
          "button",
          {
            class: `land-node land-${land.theme}`,
            "data-locked": unlocked ? "false" : "true",
            disabled: !unlocked,
            onClick: () => unlocked && go("land", { landId: land.id }),
          },
          h("div", { class: "land-emoji" }, land.emoji),
          h(
            "div",
            { class: "land-info" },
            h("h3", {}, land.title),
            h("p", {}, land.subtitle),
            h("div", { class: "land-stars" }, `🔑 ${keys} / ${land.activities.length}`)
          ),
          h("div", { class: "lock-badge" }, unlocked ? (complete ? "✅" : "▶️") : "🔒")
        )
      );
      if (i < lands.length - 1) pathWrap.appendChild(h("div", { class: "map-connector" }));
    });

    mount(
      root,
      h(
        "div",
        { class: "screen" },
        topbar(),
        h(
          "div",
          { class: "map-header" },
          h("h1", {}, `Hi ${Claves.store.getName() || "friend"}! 👋`),
          h("p", {}, "Pick a land to explore.")
        ),
        pathWrap
      )
    );
  }

  function renderLand(landId) {
    const land = Claves.DATA.lands.find((l) => l.id === landId);
    const list = h("div", { class: "activity-list" });

    land.activities.forEach((act, i) => {
      const result = Claves.store.getActivityResult(act.id);
      const unlocked = i === 0 || !!Claves.store.getActivityResult(land.activities[i - 1].id);

      list.appendChild(
        h(
          "button",
          {
            class: "activity-node",
            "data-locked": unlocked ? "false" : "true",
            disabled: !unlocked,
            onClick: () => unlocked && go("activity", { landId, activityId: act.id }),
          },
          h("div", { class: "a-icon" }, act.icon),
          h("div", { class: "a-info" }, h("strong", {}, act.title), h("span", {}, act.blurb)),
          h("div", { class: "a-status" }, !unlocked ? "🔒" : result ? starsToEmoji(result.stars) : "▶️")
        )
      );
    });

    mount(
      root,
      h(
        "div",
        { class: `screen land-screen-body land-${land.theme}-theme` },
        topbar({ onBack: () => go("map") }),
        h(
          "div",
          { class: "land-title-row" },
          h("span", { class: "land-big-emoji" }, land.bigEmoji),
          h("h1", {}, land.title),
          h("p", {}, land.description)
        ),
        Claves.store.isLandComplete(land.id)
          ? h("p", { class: "wb-status" }, "🎉 All done here! Replay any activity for extra practice.")
          : null,
        list
      )
    );
  }

  function renderActivity(landId, activityId) {
    const land = Claves.DATA.lands.find((l) => l.id === landId);
    const activity = land.activities.find((a) => a.id === activityId);
    const bodyMount = h("div", {});

    mount(
      root,
      h(
        "div",
        { class: `screen land-screen-body land-${land.theme}-theme` },
        topbar({ onBack: () => go("land", { landId }) }),
        h(
          "div",
          { class: "activity-header" },
          h("span", { class: "a-tag" }, `${land.title} · ${activity.title}`),
          h("h2", {}, activity.blurb)
        ),
        bodyMount
      )
    );

    const engine = Claves.games[activity.type];
    engine.mount(bodyMount, activity, {
      onComplete: (stars) => handleActivityComplete(land, activity, stars),
    });
  }

  function handleActivityComplete(land, activity, stars) {
    const wasLandComplete = Claves.store.isLandComplete(land.id);
    const wasGameComplete = Claves.store.isGameComplete();
    const result = Claves.store.recordActivityResult(activity.id, stars);
    const justCompletedLand = !wasLandComplete && Claves.store.isLandComplete(land.id);
    const justCompletedGame = !wasGameComplete && Claves.store.isGameComplete();
    showReward(land, result, justCompletedLand, justCompletedGame);
  }

  function showReward(land, result, justCompletedLand, justCompletedGame) {
    const overlay = h(
      "div",
      { class: "reward-overlay" },
      h(
        "div",
        { class: "reward-card" },
        h("div", { class: "reward-emoji" }, justCompletedGame ? "🏆" : result.isFirstCompletion ? "🔑" : "🎉"),
        h("h2", {}, justCompletedGame ? "CLAVES Champion!" : result.isFirstCompletion ? "Key Collected!" : "Nice replay!"),
        h("div", { class: "reward-stars" }, starsToEmoji(result.stars)),
        result.isFirstCompletion ? h("div", { class: "reward-keys" }, "+1 Key 🔑") : null,
        justCompletedLand
          ? h("p", {}, `🎊 You finished ${land.title} and earned the ${land.badge.name} badge!`)
          : null,
        justCompletedGame ? h("p", {}, "You explored every land in CLAVES Quest so far. Amazing work!") : null,
        h("button", { class: "btn big green block", onClick: onNext }, "Continue")
      )
    );
    document.body.appendChild(overlay);

    if (justCompletedGame) Claves.sound.playCelebrate();
    else if (justCompletedLand) Claves.sound.playUnlock();
    else if (result.isFirstCompletion) Claves.sound.playCelebrate();
    else Claves.sound.playCorrect();

    if (result.stars === 3 || justCompletedLand || justCompletedGame) Claves.confettiBurst();

    function onNext() {
      overlay.remove();
      go("land", { landId: land.id });
    }
  }

  function renderBadges() {
    const grid = h("div", { class: "badge-grid" });
    Claves.store.getBadges().forEach((b) => {
      grid.appendChild(
        h(
          "div",
          { class: "badge-item" + (b.earned ? "" : " locked") },
          h("span", { class: "badge-emoji" }, b.emoji),
          h("div", { class: "badge-name" }, b.name)
        )
      );
    });

    mount(
      root,
      h(
        "div",
        { class: "screen" },
        topbar({ onBack: () => go("map") }),
        h("div", { class: "map-header" }, h("h1", {}, "My Badges 🏅")),
        grid,
        h(
          "div",
          { style: "text-align:center; margin-top:28px;" },
          h("button", { class: "btn outline sm", onClick: onReset }, "Reset Progress")
        )
      )
    );

    function onReset() {
      if (window.confirm("Reset all progress? This cannot be undone.")) {
        Claves.store.reset();
        go("home");
      }
    }
  }

  function renderJournal() {
    const entries = Claves.store.getJournal();
    const body = entries.length
      ? entries.map((e) =>
          h(
            "div",
            { class: "journal-entry" },
            h("div", { class: "j-meta" }, `${new Date(e.date).toLocaleDateString()} · agreed with ${e.voice}`),
            h("div", { class: "j-text" }, e.text)
          )
        )
      : [h("div", { class: "empty-state" }, "Your journal is empty so far. Finish a Discussion Circle to add your first reflection! 💭")];

    mount(
      root,
      h(
        "div",
        { class: "screen" },
        topbar({ onBack: () => go("map") }),
        h("div", { class: "map-header" }, h("h1", {}, "My Journal 📔")),
        ...body
      )
    );
  }

  function render() {
    if (nav.screen === "map") return renderMap();
    if (nav.screen === "land") return renderLand(nav.landId);
    if (nav.screen === "activity") return renderActivity(nav.landId, nav.activityId);
    if (nav.screen === "badges") return renderBadges();
    if (nav.screen === "journal") return renderJournal();
    return renderHome();
  }

  document.addEventListener("DOMContentLoaded", () => go("home"));
})(window.Claves);
