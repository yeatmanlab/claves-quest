// Writer's Desk -- the 3-day writing cycle: Plan (graphic organizer) ->
// Draft (scaffolded writing + self-checklist) -> Publish (cover + shareable page).
// Draft reads the Plan's saved answers, and Publish reads the Draft's saved
// text, by looking up sibling activities of the same land at render time.
window.Claves = window.Claves || {};
Claves.games = Claves.games || {};

(function (Claves) {
  "use strict";

  const { h } = Claves;

  function siblingActivityId(activity, type) {
    const land = Claves.DATA.lands.find((l) => l.activities.some((x) => x.id === activity.id));
    const sib = land && land.activities.find((x) => x.type === type);
    return sib ? sib.id : null;
  }

  function fillTemplate(template, answers) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => (answers[key] || "").trim() || "___");
  }

  function mountPlan(container, activity, { onComplete }) {
    const data = activity.data;
    const saved = Claves.store.getActivityState(activity.id) || { answers: {} };
    const answers = Object.assign({}, saved.answers);

    const grid = h("div", { class: "plan-web" });
    data.bubbles.forEach((b) => {
      const ta = h("textarea", {
        rows: "3",
        placeholder: b.placeholder || "",
        onInput: (e) => {
          answers[b.key] = e.target.value;
          Claves.store.setActivityState(activity.id, { answers });
          updateBtn();
        },
      });
      ta.value = answers[b.key] || "";
      grid.appendChild(h("div", { class: "plan-bubble" }, h("label", {}, b.label), ta));
    });

    const continueBtn = h(
      "button",
      { class: "btn green block", disabled: true, onClick: onContinue },
      "Save My Plan ➜"
    );

    function updateBtn() {
      continueBtn.disabled = !data.bubbles.every((b) => (answers[b.key] || "").trim().length > 0);
    }
    updateBtn();

    function onContinue() {
      Claves.store.setActivityState(activity.id, { answers });
      Claves.sound.playCorrect();
      onComplete(3);
    }

    Claves.mount(
      container,
      h(
        "div",
        { class: "activity-body" },
        h("div", { class: "wb-clue-card" }, data.promptTitle),
        grid,
        continueBtn
      )
    );
  }

  function mountDraft(container, activity, { onComplete }) {
    const data = activity.data;
    const planId = siblingActivityId(activity, "plan");
    const planState = (planId && Claves.store.getActivityState(planId)) || { answers: {} };
    const starter = fillTemplate(data.template, planState.answers);
    const saved = Claves.store.getActivityState(activity.id);
    const checks = saved && saved.checks ? saved.checks.slice() : data.checklist.map(() => false);

    const textarea = h("textarea", { class: "draft-box", rows: "7", onInput: update });
    textarea.value = saved && saved.text ? saved.text : starter;

    const checklistWrap = h("div", { class: "checklist" });
    data.checklist.forEach((label, i) => {
      const cb = h("input", {
        type: "checkbox",
        onChange: (e) => {
          checks[i] = e.target.checked;
          update();
        },
      });
      cb.checked = !!checks[i];
      checklistWrap.appendChild(h("label", {}, cb, label));
    });

    const continueBtn = h(
      "button",
      { class: "btn green block", disabled: true, onClick: onContinue },
      "Continue to Publishing ➜"
    );

    function update() {
      Claves.store.setActivityState(activity.id, { text: textarea.value, checks });
      const allChecked = checks.every(Boolean);
      continueBtn.disabled = !(allChecked && textarea.value.trim().length > 15);
    }
    update();

    function onContinue() {
      Claves.sound.playCorrect();
      onComplete(3);
    }

    Claves.mount(
      container,
      h(
        "div",
        { class: "activity-body" },
        h("p", { class: "wb-status" }, "Here is a story starter built from your plan. Make it your own!"),
        textarea,
        h("p", { class: "wb-status" }, "Before you publish, check your writing:"),
        checklistWrap,
        continueBtn
      )
    );
  }

  function mountPublish(container, activity, { onComplete }) {
    const data = activity.data;
    const draftId = siblingActivityId(activity, "draft");
    const draftState = (draftId && Claves.store.getActivityState(draftId)) || { text: "" };
    const saved = Claves.store.getActivityState(activity.id) || {};
    let title = saved.title || "";
    let icon = saved.icon || data.coverIcons[0];
    let color = saved.color || data.coverColors[0];

    const titleInput = h("input", {
      class: "name-input",
      style: "width:100%; max-width:320px;",
      placeholder: "Name your story...",
      onInput: (e) => {
        title = e.target.value;
        updateBtn();
      },
    });
    titleInput.value = title;

    const iconRow = h("div", { class: "cover-icon-row" });
    function renderIcons() {
      iconRow.innerHTML = "";
      data.coverIcons.forEach((ic) => {
        iconRow.appendChild(
          h(
            "button",
            {
              class: "cover-icon-btn" + (ic === icon ? " selected" : ""),
              onClick: () => {
                icon = ic;
                renderIcons();
              },
            },
            ic
          )
        );
      });
    }
    renderIcons();

    const colorRow = h("div", { class: "cover-color-row" });
    function renderColors() {
      colorRow.innerHTML = "";
      data.coverColors.forEach((c) => {
        colorRow.appendChild(
          h("button", {
            class: "cover-swatch" + (c === color ? " selected" : ""),
            style: `background:${c}`,
            "aria-label": "Cover color",
            onClick: () => {
              color = c;
              renderColors();
            },
          })
        );
      });
    }
    renderColors();

    const publishBtn = h(
      "button",
      { class: "btn gold block", disabled: true, onClick: onPublish },
      "Publish My Story 🎉"
    );
    function updateBtn() {
      publishBtn.disabled = title.trim().length === 0;
    }
    updateBtn();

    function onPublish() {
      Claves.store.setActivityState(activity.id, { title, icon, color, published: true });
      Claves.sound.playCelebrate();
      Claves.confettiBurst();
      renderPublished();
    }

    function renderPublished() {
      const name = Claves.store.getName() || "Anonymous Author";
      Claves.mount(
        container,
        h(
          "div",
          { class: "activity-body" },
          h(
            "div",
            { class: "published-page", style: `border-top:10px solid ${color}` },
            h("div", { class: "cover-icon" }, icon),
            h("h2", {}, title),
            h("p", { class: "by-line" }, `by ${name}`),
            h("div", { class: "story-text" }, draftState.text)
          ),
          h(
            "div",
            { style: "display:flex; gap:10px; max-width:460px; margin:14px auto 0;" },
            h("button", { class: "btn outline block", onClick: () => window.print() }, "🖨️ Print"),
            h("button", { class: "btn green block", onClick: () => onComplete(3) }, "Finish ➜")
          )
        )
      );
    }

    Claves.mount(
      container,
      h(
        "div",
        { class: "activity-body" },
        h("p", { class: "wb-status" }, "Give your story a title and pick a cover:"),
        titleInput,
        h("p", { class: "wb-status" }, "Cover picture:"),
        iconRow,
        h("p", { class: "wb-status" }, "Cover color:"),
        colorRow,
        publishBtn
      )
    );
  }

  Claves.games.plan = { mount: mountPlan };
  Claves.games.draft = { mount: mountDraft };
  Claves.games.publish = { mount: mountPublish };
})(window.Claves);
