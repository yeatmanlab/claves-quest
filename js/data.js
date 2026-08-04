// All game content lives here as plain data. Original material inspired by the
// public CLAVES curriculum structure (metalinguistic awareness, dialogic
// discussion, morphology/syntax, a 6-day text cycle + 3-day writing cycle) --
// no text from copyrighted mentor texts or the published CLAVES materials.
//
// To add Unit 2 / Unit 3 later: append new entries to `Claves.DATA.lands`
// following the same shape. Nothing in the game engine is unit-specific.
window.Claves = window.Claves || {};

(function (Claves) {
  "use strict";

  const DATA = {
    mascot: { name: "Kip", emoji: "🦊" },

    lands: [
      // ---------------- Unit 0: Intro ----------------
      {
        id: "cove",
        unit: "Unit 0",
        theme: "a",
        emoji: "🗝️",
        bigEmoji: "🏝️",
        title: "Key Cove",
        subtitle: "Welcome to CLAVES Quest",
        description: "Meet Kip the fox and discover how words carry meaning.",
        badge: { emoji: "🗝️", name: "Key Finder" },
        activities: [
          {
            id: "cove-vocab",
            type: "vocab",
            icon: "🃏",
            title: "Word Den",
            blurb: "Match each word to its meaning.",
            data: {
              pairs: [
                { word: "curious", clue: "Wanting to learn or find out about something", emoji: "🔍" },
                { word: "community", clue: "A group who live in, or share, the same place", emoji: "🏘️" },
                { word: "protect", clue: "To keep someone or something safe from harm", emoji: "🛡️" },
                { word: "opinion", clue: "What you think or believe about something", emoji: "💭" },
                { word: "discuss", clue: "To talk about ideas together with others", emoji: "🗣️" },
                { word: "connect", clue: "To join two things, or people, together", emoji: "🔗" },
              ],
            },
          },
          {
            id: "cove-words",
            type: "wordbuilder",
            mode: "morphology",
            icon: "🧩",
            title: "Word Builder",
            blurb: "Snap word parts together to build new words.",
            data: {
              rounds: [
                { emoji: "🔁", clue: "to look at something again", answerParts: ["re", "view"], distractors: ["ful"] },
                { emoji: "😨", clue: "without any fear", answerParts: ["fear", "less"], distractors: ["ful"] },
                { emoji: "👩‍🏫", clue: "a person who teaches", answerParts: ["teach", "er"], distractors: ["ing"] },
                { emoji: "🙁", clue: "not happy", answerParts: ["un", "happy"], distractors: ["re"] },
              ],
            },
          },
          {
            id: "cove-discuss",
            type: "discussion",
            icon: "💬",
            title: "Discussion Circle",
            blurb: "Share what you think with the group.",
            data: {
              question: "Kip found a shiny key but doesn't know what it opens. What should Kip do?",
              voices: [
                { name: "Mia", emoji: "🦉", quote: "I'd ask my friends if they've seen a matching lock!" },
                { name: "Theo", emoji: "🐢", quote: "I'd keep the key safe until I figure out where it belongs." },
                { name: "Zuri", emoji: "🐿️", quote: "I'd explore around and look for doors or chests it might open." },
              ],
              starters: [
                "I agree with ___ because...",
                "I would also try...",
                "A different idea I have is...",
              ],
            },
          },
        ],
      },

      // ---------------- Unit 1, Cycle 1 ----------------
      {
        id: "wolfwoods",
        unit: "Unit 1",
        theme: "b",
        emoji: "🐺",
        bigEmoji: "🌲",
        title: "Wolf Woods",
        subtitle: "Humans & Nature · Cycle 1",
        description: "Explore how wolves shape the forest around them.",
        badge: { emoji: "🐺", name: "Wolf Whisperer" },
        activities: [
          {
            id: "ww-vocab",
            type: "vocab",
            icon: "🃏",
            title: "Word Den",
            blurb: "Match each nature word to its meaning.",
            data: {
              pairs: [
                { word: "ecosystem", clue: "All the living things in a place, working together", emoji: "🌲" },
                { word: "predator", clue: "An animal that hunts other animals for food", emoji: "🐺" },
                { word: "prey", clue: "An animal that is hunted by another animal", emoji: "🦌" },
                { word: "habitat", clue: "The natural home of a plant or animal", emoji: "🏞️" },
                { word: "balance", clue: "When all the parts of something work well together", emoji: "🌗" },
                { word: "reintroduce", clue: "To bring something back to a place it used to live", emoji: "↩️" },
                { word: "den", clue: "A wild animal's home, often a cave or hollow", emoji: "🕳️" },
                { word: "pack", clue: "A group of wolves that live and hunt together", emoji: "🐾" },
              ],
            },
          },
          {
            id: "ww-words",
            type: "wordbuilder",
            mode: "morphology",
            icon: "🧩",
            title: "Word Builder",
            blurb: "Build words about the forest.",
            data: {
              rounds: [
                { emoji: "🐺↩️", clue: "to bring wolves back to a place they used to live", answerParts: ["re", "introduce"], distractors: ["pre"] },
                { emoji: "🛡️", clue: "full of care", answerParts: ["care", "ful"], distractors: ["less"] },
                { emoji: "💪", clue: "without any fear", answerParts: ["fear", "less"], distractors: ["ful"] },
                { emoji: "🤝", clue: "a person who helps", answerParts: ["help", "er"], distractors: ["ing"] },
              ],
            },
          },
          {
            id: "ww-sentence",
            type: "wordbuilder",
            mode: "syntax",
            icon: "📝",
            title: "Sentence Builder",
            blurb: "Put the words in order to build a sentence.",
            data: {
              rounds: [
                { emoji: "🐺🌲", clue: "Put the words in order", answerParts: ["The", "wolves", "live", "in", "the", "forest."] },
                { emoji: "🦌🐺", clue: "Put the words in order", answerParts: ["Wolves", "hunt", "deer", "for", "food."] },
                { emoji: "⚖️🌿", clue: "Put the words in order", answerParts: ["Every", "animal", "helps", "keep", "nature", "in", "balance."] },
                { emoji: "🐾👪", clue: "Put the words in order", answerParts: ["A", "pack", "of", "wolves", "works", "together."] },
              ],
            },
          },
          {
            id: "ww-discuss",
            type: "discussion",
            icon: "💬",
            title: "Discussion Circle",
            blurb: "Share what you think about wolves coming back.",
            data: {
              question: "Scientists brought wolves back to a forest where they used to live. Some people were excited, and some were worried. What do you think?",
              voices: [
                { name: "Ranger Alex", emoji: "🧑‍🌾", quote: "I think it's great -- wolves help keep deer numbers balanced so plants can grow." },
                { name: "Farmer Sam", emoji: "🐑", quote: "I'm a little worried the wolves might wander close to farms and animals." },
                { name: "Dr. Lin", emoji: "🔬", quote: "I think we should watch closely and make a plan so people and wolves can both do well." },
              ],
              starters: [
                "I agree with ___ because...",
                "I feel ___ about wolves coming back because...",
                "One question I still have is...",
              ],
            },
          },
        ],
      },

      // ---------------- Unit 1, Cycle 2 ----------------
      {
        id: "riverrise",
        unit: "Unit 1",
        theme: "c",
        emoji: "💧",
        bigEmoji: "🏞️",
        title: "River Rise",
        subtitle: "Humans & Nature · Cycle 2",
        description: "Learn how communities work together to protect water.",
        badge: { emoji: "💧", name: "Water Guardian" },
        activities: [
          {
            id: "rr-vocab",
            type: "vocab",
            icon: "🃏",
            title: "Word Den",
            blurb: "Match each word about water and community.",
            data: {
              pairs: [
                { word: "protector", clue: "Someone who keeps something or someone safe", emoji: "🛡️" },
                { word: "pollution", clue: "Dirty or harmful stuff that gets into nature", emoji: "🏭" },
                { word: "source", clue: "The place where something begins, like a river's start", emoji: "💧" },
                { word: "community", clue: "People who live near each other and support one another", emoji: "🤝" },
                { word: "sacred", clue: "Very special and deserving great respect", emoji: "🙏" },
                { word: "resource", clue: "Something useful that people and nature need", emoji: "🌊" },
                { word: "downstream", clue: "Further along the direction that water flows", emoji: "⬇️" },
                { word: "steward", clue: "A person who takes care of something for the future", emoji: "🌍" },
              ],
            },
          },
          {
            id: "rr-words",
            type: "wordbuilder",
            mode: "morphology",
            icon: "🧩",
            title: "Word Builder",
            blurb: "Build words about protecting water.",
            data: {
              rounds: [
                { emoji: "🛡️💧", clue: "someone who keeps the river safe", answerParts: ["protect", "or"], distractors: ["er"] },
                { emoji: "🤲", clue: "full of help", answerParts: ["help", "ful"], distractors: ["less"] },
                { emoji: "😕", clue: "without care -- the opposite of careful", answerParts: ["care", "less"], distractors: ["ful"] },
                { emoji: "🧽", clue: "a person or thing that cleans", answerParts: ["clean", "er"], distractors: ["or"] },
              ],
            },
          },
          {
            id: "rr-sentence",
            type: "wordbuilder",
            mode: "syntax",
            icon: "📝",
            title: "Sentence Builder",
            blurb: "Put the words in order to build a sentence.",
            data: {
              rounds: [
                { emoji: "💧🏞️", clue: "Put the words in order", answerParts: ["Rivers", "give", "water", "to", "people", "and", "animals."] },
                { emoji: "🚯🌊", clue: "Put the words in order", answerParts: ["Keeping", "water", "clean", "helps", "everyone."] },
                { emoji: "🤝🌍", clue: "Put the words in order", answerParts: ["A", "community", "can", "work", "together", "to", "protect", "nature."] },
                { emoji: "🙏💧", clue: "Put the words in order", answerParts: ["Many", "people", "believe", "water", "is", "sacred."] },
              ],
            },
          },
          {
            id: "rr-discuss",
            type: "discussion",
            icon: "💬",
            title: "Discussion Circle",
            blurb: "Share what you think a community should do.",
            data: {
              question: "A community learns that a new factory nearby might pollute their river. What should they do?",
              voices: [
                { name: "Mayor Rivas", emoji: "🏛️", quote: "I think we should hold a meeting so everyone can share their ideas." },
                { name: "Student Group", emoji: "🎒", quote: "We want to write letters and ask leaders to help protect the river." },
                { name: "Elder Nokomis", emoji: "🌿", quote: "I believe we should remember that water is sacred and think of future generations." },
              ],
              starters: [
                "I think the best first step is ___ because...",
                "I would want to ask ___ ...",
                "If it were my river, I would...",
              ],
            },
          },
        ],
      },

      // ---------------- Unit 1, Cycle 3: Writing ----------------
      {
        id: "authorsisle",
        unit: "Unit 1",
        theme: "d",
        emoji: "✍️",
        bigEmoji: "🏖️",
        title: "Author's Isle",
        subtitle: "Humans & Nature · Writing Cycle",
        description: "Plan, draft, and publish your own nature story.",
        badge: { emoji: "✍️", name: "Published Author" },
        activities: [
          {
            id: "ai-plan",
            type: "plan",
            icon: "🗺️",
            title: "Plan It",
            blurb: "Fill in your idea web before you write.",
            data: {
              promptTitle: "My Nature Helper Story",
              bubbles: [
                { key: "what", label: "What part of nature do you want to help? (forest, river, animals...)", placeholder: "the forest near my house" },
                { key: "why", label: "Why does this matter to you?", placeholder: "animals need a safe home" },
                { key: "action", label: "What is one action you (or a character) could take?", placeholder: "plant new trees" },
                { key: "after", label: "How would things be better afterward?", placeholder: "the animals would have more shelter and food" },
              ],
            },
          },
          {
            id: "ai-draft",
            type: "draft",
            icon: "✏️",
            title: "Draft It",
            blurb: "Turn your plan into a story.",
            data: {
              template: "I want to help {{what}}. This matters to me because {{why}}. One thing I could do is {{action}}. Afterward, {{after}}.",
              checklist: [
                "My writing tells what I want to help.",
                "I explained why it matters to me.",
                "I described an action someone could take.",
                "I used a word from Word Den or Word Builder.",
                "I read my writing out loud to check it makes sense.",
              ],
            },
          },
          {
            id: "ai-publish",
            type: "publish",
            icon: "📖",
            title: "Publish It",
            blurb: "Give your story a cover and share it.",
            data: {
              coverIcons: ["🌲", "🐺", "💧", "🌍", "🦉", "🌊"],
              coverColors: ["#8258ff", "#2f9e5c", "#1f9bb0", "#ff7a59", "#ffb703", "#ff5d5d"],
            },
          },
        ],
      },
    ],
  };

  Claves.DATA = DATA;
})(window.Claves);
