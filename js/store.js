// Progress persistence: everything lives in localStorage so the game can be
// closed and reopened without losing progress. One player profile per browser.
window.Claves = window.Claves || {};

(function (Claves) {
  "use strict";

  const SAVE_KEY = "claves-quest-save-v1";

  function blank() {
    return {
      name: "",
      results: {}, // activityId -> { stars, completions }
      activityState: {}, // activityId -> arbitrary saved payload (plan/draft/publish)
      journal: [], // discussion reflections
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return blank();
      const parsed = JSON.parse(raw);
      return Object.assign(blank(), parsed);
    } catch (e) {
      return blank();
    }
  }

  function save() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  }

  function getName() {
    return state.name || "";
  }
  function setName(name) {
    state.name = (name || "").trim().slice(0, 24);
    save();
  }

  function getActivityResult(activityId) {
    return state.results[activityId];
  }

  // Returns { stars, isFirstCompletion, keyAwarded, improved }
  function recordActivityResult(activityId, stars) {
    const prev = state.results[activityId];
    const isFirstCompletion = !prev;
    const improved = !prev || stars > prev.stars;
    state.results[activityId] = {
      stars: Math.max(stars, prev ? prev.stars : 0),
      completions: (prev ? prev.completions : 0) + 1,
    };
    save();
    return { stars, isFirstCompletion, keyAwarded: isFirstCompletion, improved };
  }

  function getActivityState(activityId) {
    return state.activityState[activityId];
  }
  function setActivityState(activityId, payload) {
    state.activityState[activityId] = payload;
    save();
  }

  function findLand(landId) {
    return Claves.DATA.lands.find((l) => l.id === landId);
  }

  function keysCollectedInLand(landId) {
    const land = findLand(landId);
    if (!land) return 0;
    return land.activities.filter((a) => !!state.results[a.id]).length;
  }

  function isLandComplete(landId) {
    const land = findLand(landId);
    if (!land) return false;
    return keysCollectedInLand(landId) >= land.activities.length;
  }

  function isLandUnlocked(landId) {
    const lands = Claves.DATA.lands;
    const idx = lands.findIndex((l) => l.id === landId);
    if (idx <= 0) return true;
    return isLandComplete(lands[idx - 1].id);
  }

  function totalKeys() {
    return Object.keys(state.results).length;
  }

  function totalPossibleKeys() {
    return Claves.DATA.lands.reduce((sum, l) => sum + l.activities.length, 0);
  }

  function isGameComplete() {
    return Claves.DATA.lands.every((l) => isLandComplete(l.id));
  }

  function getBadges() {
    const landBadges = Claves.DATA.lands.map((land) => ({
      landId: land.id,
      emoji: land.badge.emoji,
      name: land.badge.name,
      earned: isLandComplete(land.id),
    }));
    landBadges.push({
      landId: "champion",
      emoji: "🏆",
      name: "CLAVES Champion",
      earned: isGameComplete(),
    });
    return landBadges;
  }

  function addJournalEntry(entry) {
    state.journal.unshift(Object.assign({ date: new Date().toISOString() }, entry));
    save();
  }
  function getJournal() {
    return state.journal;
  }

  function reset() {
    state = blank();
    save();
  }

  Claves.store = {
    getName,
    setName,
    getActivityResult,
    recordActivityResult,
    getActivityState,
    setActivityState,
    keysCollectedInLand,
    isLandComplete,
    isLandUnlocked,
    totalKeys,
    totalPossibleKeys,
    getBadges,
    isGameComplete,
    addJournalEntry,
    getJournal,
    reset,
  };
})(window.Claves);
