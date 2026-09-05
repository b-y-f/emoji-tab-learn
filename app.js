/*
 * Tap & Read
 *
 * The two JSON files in /data are static Emojibase compact datasets.
 * The app merges them by Unicode hexcode so labels and tags stay in sync
 * while the page remains fully usable on GitHub Pages without a backend.
 */

const LANGUAGES = {
  zh: { label: "中文", voice: "zh-CN" },
  en: { label: "English", voice: "en-US" },
};

const GROUPS = {
  people: new Set([1]),
  animals: new Set([3]),
  food: new Set([4]),
  travel: new Set([5]),
  activities: new Set([6]),
  objects: new Set([7]),
  symbols: new Set([8]),
  flags: new Set([9]),
};

const SKIN_TONE_CODES = new Set(["1F3FB", "1F3FC", "1F3FD", "1F3FE", "1F3FF"]);

const VOICE_PREFERENCES = {
  en: [
    /natural/i,
    /google.*english/i,
    /aria|jenny|ava|sara|samantha|zira/i,
    /online/i,
  ],
  zh: [
    /xiaoxiao|xiaoyi|yunxi|yunyang|yaoyao/i,
    /natural/i,
    /google.*(中文|普通话|chinese|mandarin)/i,
    /ting-ting|sin-ji|mei-jia/i,
    /online/i,
  ],
};

const FEATURED_HEXCODES = [
  "1F34E", // red apple
  "1F436", // dog face
  "1F431", // cat face
  "1F43B", // bear
  "1F98B", // butterfly
  "1F33C", // blossom
  "1F349", // watermelon
  "1F34C", // banana
  "1F353", // strawberry
  "1F95B", // glass of milk
  "1F964", // cup with straw
  "1F355", // pizza
  "1F354", // hamburger
  "1F36A", // cookie
  "1F4A7", // droplet
  "2600",   // sun
  "1F319",  // crescent moon
  "1F697",  // automobile
  "1F68C",  // bus
  "1F3E0",  // house
  "1F3C0",  // basketball
  "26BD",    // soccer ball
  "1F381",  // wrapped gift
  "1F9F8",  // teddy bear
];

// Short, familiar game names are independent of the browsing dictionary.
const GAME_WORDS = [
  ["1F436", "animals", "小狗", "dog"],
  ["1F431", "animals", "小猫", "cat"],
  ["1F430", "animals", "兔子", "rabbit"],
  ["1F42E", "animals", "奶牛", "cow"],
  ["1F437", "animals", "小猪", "pig"],
  ["1F98B", "animals", "蝴蝶", "butterfly"],
  ["1F34E", "food", "苹果", "apple"],
  ["1F34C", "food", "香蕉", "banana"],
  ["1F349", "food", "西瓜", "watermelon"],
  ["1F353", "food", "草莓", "strawberry"],
  ["1F95B", "food", "牛奶", "milk"],
  ["1F355", "food", "披萨", "pizza"],
  ["1F354", "food", "汉堡", "burger"],
  ["1F36A", "food", "饼干", "cookie"],
  ["1F33C", "everyday", "花", "flower"],
  ["1F4A7", "everyday", "水滴", "water drop"],
  ["2600", "everyday", "太阳", "sun"],
  ["1F319", "everyday", "月亮", "moon"],
  ["1F697", "everyday", "汽车", "car"],
  ["1F68C", "everyday", "公交车", "bus"],
  ["1F3E0", "everyday", "房子", "house"],
  ["26BD", "everyday", "球", "ball"],
  ["1F381", "everyday", "礼物", "gift"],
  ["1F9F8", "everyday", "玩具熊", "teddy bear"],
].map(([hexcode, theme, zh, en]) => ({ hexcode, theme, labels: { zh, en } }));

const GAME_PRAISE = [
  { zh: "找到了！", en: "You found it!" },
  { zh: "答对啦！", en: "That's right!" },
  { zh: "真棒！", en: "Great job!" },
];

const FALLBACK_DATA = {
  en: [
    { hexcode: "1F34E", label: "red apple", tags: ["apple", "fruit"], group: 4, unicode: "🍎" },
    { hexcode: "1F436", label: "dog face", tags: ["pet"], group: 3, unicode: "🐶" },
    { hexcode: "1F431", label: "cat face", tags: ["pet"], group: 3, unicode: "🐱" },
    { hexcode: "1F43B", label: "bear", tags: ["teddy"], group: 3, unicode: "🐻" },
    { hexcode: "1F98B", label: "butterfly", tags: ["insect"], group: 3, unicode: "🦋" },
    { hexcode: "1F33C", label: "blossom", tags: ["flower"], group: 3, unicode: "🌼" },
    { hexcode: "1F349", label: "watermelon", tags: ["fruit", "food"], group: 4, unicode: "🍉" },
    { hexcode: "1F34C", label: "banana", tags: ["fruit", "food"], group: 4, unicode: "🍌" },
    { hexcode: "1F353", label: "strawberry", tags: ["fruit", "food"], group: 4, unicode: "🍓" },
    { hexcode: "1F95B", label: "glass of milk", tags: ["drink", "dairy"], group: 4, unicode: "🥛" },
    { hexcode: "1F964", label: "cup with straw", tags: ["cup", "drink", "water"], group: 4, unicode: "🥤" },
    { hexcode: "1F355", label: "pizza", tags: ["food"], group: 4, unicode: "🍕" },
    { hexcode: "1F354", label: "hamburger", tags: ["food"], group: 4, unicode: "🍔" },
    { hexcode: "1F36A", label: "cookie", tags: ["food", "snack"], group: 4, unicode: "🍪" },
    { hexcode: "1F4A7", label: "droplet", tags: ["water"], group: 3, unicode: "💧" },
    { hexcode: "2600", label: "sun", tags: ["weather"], group: 3, unicode: "☀️" },
    { hexcode: "1F319", label: "crescent moon", tags: ["night", "space"], group: 3, unicode: "🌙" },
    { hexcode: "1F697", label: "automobile", tags: ["car", "vehicle"], group: 5, unicode: "🚗" },
    { hexcode: "1F68C", label: "bus", tags: ["vehicle"], group: 5, unicode: "🚌" },
    { hexcode: "1F3E0", label: "house", tags: ["home"], group: 5, unicode: "🏠" },
    { hexcode: "1F3C0", label: "basketball", tags: ["ball", "sport"], group: 6, unicode: "🏀" },
    { hexcode: "26BD", label: "soccer ball", tags: ["football", "sport"], group: 6, unicode: "⚽" },
    { hexcode: "1F381", label: "wrapped gift", tags: ["present"], group: 7, unicode: "🎁" },
    { hexcode: "1F9F8", label: "teddy bear", tags: ["toy"], group: 7, unicode: "🧸" },
  ],
  zh: [
    { hexcode: "1F34E", label: "红苹果", tags: ["苹果", "水果"], group: 4, unicode: "🍎" },
    { hexcode: "1F436", label: "狗脸", tags: ["宠物", "狗"], group: 3, unicode: "🐶" },
    { hexcode: "1F431", label: "猫脸", tags: ["宠物", "猫"], group: 3, unicode: "🐱" },
    { hexcode: "1F43B", label: "熊", tags: ["玩具熊"], group: 3, unicode: "🐻" },
    { hexcode: "1F98B", label: "蝴蝶", tags: ["昆虫"], group: 3, unicode: "🦋" },
    { hexcode: "1F33C", label: "开花", tags: ["花"], group: 3, unicode: "🌼" },
    { hexcode: "1F349", label: "西瓜", tags: ["水果", "食物"], group: 4, unicode: "🍉" },
    { hexcode: "1F34C", label: "香蕉", tags: ["水果", "食物"], group: 4, unicode: "🍌" },
    { hexcode: "1F353", label: "草莓", tags: ["水果", "食物"], group: 4, unicode: "🍓" },
    { hexcode: "1F95B", label: "一杯奶", tags: ["喝", "牛奶", "饮料"], group: 4, unicode: "🥛" },
    { hexcode: "1F964", label: "带吸管杯", tags: ["杯", "水", "饮料"], group: 4, unicode: "🥤" },
    { hexcode: "1F355", label: "披萨", tags: ["食物"], group: 4, unicode: "🍕" },
    { hexcode: "1F354", label: "汉堡", tags: ["食物"], group: 4, unicode: "🍔" },
    { hexcode: "1F36A", label: "饼干", tags: ["食物", "零食"], group: 4, unicode: "🍪" },
    { hexcode: "1F4A7", label: "水滴", tags: ["水"], group: 3, unicode: "💧" },
    { hexcode: "2600", label: "太阳", tags: ["天气"], group: 3, unicode: "☀️" },
    { hexcode: "1F319", label: "弯月", tags: ["夜晚", "月亮"], group: 3, unicode: "🌙" },
    { hexcode: "1F697", label: "汽车", tags: ["车", "交通工具"], group: 5, unicode: "🚗" },
    { hexcode: "1F68C", label: "公交车", tags: ["车", "交通工具"], group: 5, unicode: "🚌" },
    { hexcode: "1F3E0", label: "房子", tags: ["家"], group: 5, unicode: "🏠" },
    { hexcode: "1F3C0", label: "篮球", tags: ["球", "运动"], group: 6, unicode: "🏀" },
    { hexcode: "26BD", label: "足球", tags: ["球", "运动"], group: 6, unicode: "⚽" },
    { hexcode: "1F381", label: "礼物", tags: ["生日", "包装"], group: 7, unicode: "🎁" },
    { hexcode: "1F9F8", label: "泰迪熊", tags: ["玩具", "熊"], group: 7, unicode: "🧸" },
  ],
};

const dom = {
  heroTapArea: document.querySelector("#heroTapArea"),
  heroEmoji: document.querySelector("#heroEmoji"),
  heroYoutubeLink: document.querySelector("#heroYoutubeLink"),
  heroWordings: document.querySelector("#heroWordings"),
  appCard: document.querySelector(".app-card"),
  settingsButton: document.querySelector("#settingsButton"),
  settingsBackdrop: document.querySelector("#settingsBackdrop"),
  settingsCloseButton: document.querySelector("#settingsCloseButton"),
  topbarLanguageLabel: document.querySelector("#topbarLanguageLabel"),
  speechNote: document.querySelector("#speechNote"),
  activeLanguageSummary: document.querySelector("#activeLanguageSummary"),
  languagePicker: document.querySelector(".language-picker"),
  searchInput: document.querySelector("#searchInput"),
  clearSearchButton: document.querySelector("#clearSearchButton"),
  categoryRow: document.querySelector("#categoryRow"),
  emojiGrid: document.querySelector("#emojiGrid"),
  gridLoading: document.querySelector("#gridLoading"),
  learnPanel: document.querySelector(".learn-panel"),
  explorePanel: document.querySelector(".explore-panel"),
  startGameButton: document.querySelector("#startGameButton"),
  gamePanel: document.querySelector("#gamePanel"),
  gameBackButton: document.querySelector("#gameBackButton"),
  gameLanguagePicker: document.querySelector("#gameLanguagePicker"),
  gameThemes: document.querySelector("#gameThemes"),
  gameQuestion: document.querySelector("#gameQuestion"),
  gameReplayButton: document.querySelector("#gameReplayButton"),
  gameOptions: document.querySelector("#gameOptions"),
  gameFeedback: document.querySelector("#gameFeedback"),
  gameSpeechNote: document.querySelector("#gameSpeechNote"),
};

const state = {
  datasets: { en: [], zh: [] },
  byHexcode: { en: new Map(), zh: new Map() },
  records: [],
  activeLanguages: ["zh", "en"],
  selectedHexcode: "1F34E",
  category: "all",
  query: "",
  speechRun: 0,
  speechTimer: null,
  utterance: null,
  voices: [],
  isSpeaking: false,
  usingFallback: false,
};

const game = {
  active: false,
  language: "zh",
  theme: "mixed",
  pools: { mixed: [], animals: [], food: [], everyday: [] },
  deck: [],
  question: null,
  options: [],
  mistakes: 0,
  locked: false,
  feedback: null,
  run: 0,
  timers: [],
  praiseIndex: 0,
  homeScrollY: 0,
};

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .toLocaleLowerCase()
    .replace(/[’']/g, "")
    .replace(/[\s·,，、/()（）_\-]+/g, " ")
    .trim();
}

function collapseRepeats(value) {
  const chars = Array.from(value);
  return chars.reduce((result, char) => {
    const isCjkCharacter = /[\u3400-\u9fff]/u.test(char);
    return isCjkCharacter && result.endsWith(char) ? result : result + char;
  }, "");
}

function compactText(value) {
  return normalizeText(value).replace(/\s+/g, "");
}

function isCjk(value) {
  return /[\u3400-\u9fff]/u.test(value);
}

function getAllSearchText(item) {
  return [
    item.labels.zh,
    item.labels.en,
    ...item.tags.zh,
    ...item.tags.en,
  ].filter(Boolean).map(normalizeText).join(" ");
}

function isSkinToneRelated(item) {
  return String(item.hexcode).split("-").some((part) => SKIN_TONE_CODES.has(part.toUpperCase()));
}

function prepareDataset(dataset) {
  return dataset.flatMap((item) => {
    const { skins, ...base } = item;
    return [base, ...(Array.isArray(skins) ? skins : [])];
  }).filter((item) => !isSkinToneRelated(item));
}

function mergeDatasets() {
  const englishDataset = prepareDataset(state.datasets.en);
  const chineseDataset = prepareDataset(state.datasets.zh);
  state.byHexcode.en = new Map(englishDataset.map((item) => [item.hexcode, item]));
  state.byHexcode.zh = new Map(chineseDataset.map((item) => [item.hexcode, item]));

  const hexcodes = new Set([...state.byHexcode.en.keys(), ...state.byHexcode.zh.keys()]);
  state.records = [...hexcodes]
    .map((hexcode) => {
      const en = state.byHexcode.en.get(hexcode);
      const zh = state.byHexcode.zh.get(hexcode);
      const source = en || zh;
      const item = {
        hexcode,
        emoji: source?.unicode || source?.emoji || "❔",
        group: source?.group ?? zh?.group ?? 8,
        order: source?.order ?? zh?.order ?? Number.MAX_SAFE_INTEGER,
        labels: {
          en: en?.label || zh?.label || "emoji",
          zh: zh?.label || en?.label || "Emoji",
        },
        tags: {
          en: en?.tags || [],
          zh: zh?.tags || [],
        },
      };
      item.searchText = getAllSearchText(item);
      item.compactSearchText = compactText(item.searchText);
      return item;
    })
    .filter((item) => item.emoji);

  if (!state.records.some((item) => item.hexcode === state.selectedHexcode)) {
    state.selectedHexcode = state.records[0]?.hexcode || "1F34E";
  }
}

function featuredScore(item) {
  const index = FEATURED_HEXCODES.indexOf(item.hexcode);
  return index === -1 ? FEATURED_HEXCODES.length + 1 : index;
}

function sortForDisplay(items) {
  return [...items].sort((a, b) => {
    const featuredDifference = featuredScore(a) - featuredScore(b);
    if (featuredDifference !== 0) return featuredDifference;
    return (a.order || Number.MAX_SAFE_INTEGER) - (b.order || Number.MAX_SAFE_INTEGER);
  });
}

function categoryMatches(item) {
  if (state.category === "all") return true;
  return GROUPS[state.category]?.has(item.group) || false;
}

function fuzzyScore(item, rawQuery) {
  const query = normalizeText(rawQuery);
  if (!query) return 0;

  const queryWithoutRepeats = collapseRepeats(query);
  const queryCompact = queryWithoutRepeats.replace(/\s+/g, "");
  const search = item.searchText;
  const searchCompact = item.compactSearchText;
  const fields = [item.labels.zh, item.labels.en, ...item.tags.zh, ...item.tags.en].map(compactText);
  const labels = [item.labels.zh, item.labels.en].map(compactText);
  let score = 0;

  if (search.includes(query)) score = Math.max(score, 54);
  if (searchCompact.includes(queryCompact)) score = Math.max(score, 67);
  if (fields.includes(queryCompact)) score = Math.max(score, 122);
  if (fields.some((field) => field.startsWith(queryCompact))) score = Math.max(score, 105);
  if (labels.includes(queryCompact)) score = Math.max(score, 125);
  if (labels.some((label) => label.startsWith(queryCompact))) score = Math.max(score, 108);

  const tokens = query.split(" ").filter(Boolean);
  if (tokens.length > 1) {
    const tokenHits = tokens.filter((token) => search.includes(token)).length;
    score = Math.max(score, 62 + (tokenHits / tokens.length) * 35);
  }

  if (queryCompact.length > 0 && isCjk(queryCompact)) {
    const uniqueQueryChars = [...new Set(Array.from(queryCompact))];
    const hitCount = uniqueQueryChars.filter((char) => searchCompact.includes(char)).length;
    if (hitCount === uniqueQueryChars.length) score = Math.max(score, 81 + Math.min(queryCompact.length, 8));
    else if (hitCount > 0) score = Math.max(score, 42 + (hitCount / uniqueQueryChars.length) * 20);
  }

  if (score === 0 && queryCompact.length >= 3) {
    let cursor = 0;
    for (const char of queryCompact) {
      const foundAt = searchCompact.indexOf(char, cursor);
      if (foundAt === -1) break;
      cursor = foundAt + 1;
      score += 5;
    }
    if (score < queryCompact.length * 5) score = 0;
  }

  return score;
}

function getVisibleRecords() {
  let records = state.records.filter(categoryMatches);
  const query = state.query.trim();

  if (!query) {
    return sortForDisplay(records);
  }

  const scoredRecords = records
    .map((item) => ({ item, score: fuzzyScore(item, query) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || featuredScore(a.item) - featuredScore(b.item) || a.item.order - b.item.order);
  const strongMatches = scoredRecords.some(({ score }) => score >= 80)
    ? scoredRecords.filter(({ score }) => score >= 80)
    : scoredRecords;

  return strongMatches
    .slice(0, 5)
    .map(({ item }) => item);
}

function getCurrentRecord() {
  return state.records.find((item) => item.hexcode === state.selectedHexcode) || state.records[0];
}

function activeLanguageText() {
  return state.activeLanguages.map((language) => LANGUAGES[language].label).join(" · ");
}

function activeLanguageShortText() {
  return state.activeLanguages.map((language) => language === "zh" ? "中" : "EN").join(" / ");
}

function selectedLabels(item) {
  return state.activeLanguages.map((language) => item?.labels[language]).filter(Boolean);
}

function renderHero() {
  const item = getCurrentRecord();
  if (!item) return;

  dom.heroEmoji.textContent = item.emoji;
  dom.heroTapArea.setAttribute("aria-label", `点击朗读 ${selectedLabels(item).join(" / ")}`);
  dom.heroYoutubeLink.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(item.labels.en)}`;
  dom.heroYoutubeLink.setAttribute("aria-label", `在 YouTube 搜索 ${item.labels.en}`);
  dom.heroWordings.innerHTML = state.activeLanguages.map((language) => {
    const label = item.labels[language];
    return `<span class="hero-word" lang="${language === "zh" ? "zh-CN" : "en-US"}">${escapeHtml(label)} <small>${escapeHtml(LANGUAGES[language].label)}</small></span>`;
  }).join("");
  dom.activeLanguageSummary.textContent = activeLanguageText();
  dom.topbarLanguageLabel.textContent = activeLanguageShortText();
}

function renderLanguagePicker() {
  dom.languagePicker.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = state.activeLanguages.includes(button.dataset.language);
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderCategories() {
  dom.categoryRow.querySelectorAll("[data-category]").forEach((button) => {
    const isActive = state.category === button.dataset.category;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function cardLabelMarkup(item) {
  return state.activeLanguages.map((language) => {
    const labelClass = language === "en" ? "card-label card-label-en" : "card-label";
    return `<span class="${labelClass}" lang="${language === "zh" ? "zh-CN" : "en-US"}">${escapeHtml(item.labels[language])}</span>`;
  }).join("");
}

function renderGrid() {
  const records = getVisibleRecords();
  dom.clearSearchButton.hidden = !dom.searchInput.value;
  dom.emojiGrid.setAttribute("aria-busy", "false");

  if (!records.length) {
    dom.emojiGrid.innerHTML = "";
    return;
  }

  dom.emojiGrid.innerHTML = records.map((item) => {
    const selected = item.hexcode === state.selectedHexcode ? " is-selected" : "";
    const ariaLabel = selectedLabels(item).join(" / ");
    return `<button class="emoji-card${selected}" type="button" data-hexcode="${escapeHtml(item.hexcode)}" aria-label="点击朗读 ${escapeHtml(ariaLabel)}">
      <span class="card-emoji" aria-hidden="true">${escapeHtml(item.emoji)}</span>
      <span class="card-labels">${cardLabelMarkup(item)}</span>
    </button>`;
  }).join("");
}

function setNotice(message) {
  dom.speechNote.textContent = message;
}

function setSettingsOpen(isOpen) {
  dom.settingsBackdrop.hidden = !isOpen;
  dom.settingsButton.setAttribute("aria-expanded", String(isOpen));
}

function updateSelectedCard(previousHexcode, selectedHexcode) {
  if (previousHexcode) {
    dom.emojiGrid.querySelector(`[data-hexcode="${previousHexcode}"]`)?.classList.remove("is-selected");
  }
  dom.emojiGrid.querySelector(`[data-hexcode="${selectedHexcode}"]`)?.classList.add("is-selected");
}

function selectEmoji(hexcode, shouldSpeak = true) {
  const item = state.records.find((record) => record.hexcode === hexcode);
  if (!item) return;
  const previousHexcode = state.selectedHexcode;
  state.selectedHexcode = hexcode;
  renderHero();
  updateSelectedCard(previousHexcode, hexcode);
  if (shouldSpeak) speakCurrent();
}

function getVoice(language) {
  const locale = LANGUAGES[language].voice.toLowerCase();
  const languageCode = locale.split("-")[0];
  const matchingVoices = state.voices.filter((voice) => {
    const voiceLanguage = voice.lang?.toLowerCase() || "";
    return voiceLanguage === locale || voiceLanguage.startsWith(languageCode);
  });

  if (!matchingVoices.length) return null;

  return [...matchingVoices].sort((first, second) => {
    const score = (voice) => {
      const name = `${voice.name} ${voice.lang}`;
      const normalizedName = name.toLowerCase();
      let value = voice.lang?.toLowerCase() === locale ? 80 : 0;
      VOICE_PREFERENCES[language].forEach((pattern, index) => {
        if (pattern.test(name)) value += 30 - index * 4;
      });
      if (voice.localService === false) value += 18;
      if (/desktop|compact/i.test(normalizedName)) value -= 10;
      if (language === "zh" && /中国大陆|mainland|simplified/i.test(normalizedName)) value += 12;
      return value;
    };
    return score(second) - score(first);
  })[0];
}

function refreshVoices() {
  try {
    state.voices = window.speechSynthesis?.getVoices() || [];
  } catch {
    state.voices = [];
  }
}

function cancelSpeech() {
  // Invalidate callbacks before cancel(), which can emit events synchronously.
  state.speechRun += 1;
  window.clearTimeout(state.speechTimer);
  state.speechTimer = null;
  state.utterance = null;
  state.isSpeaking = false;
  try {
    window.speechSynthesis?.cancel();
  } catch {
    // Reading and playing remain available when the speech service fails.
  }
}

function speakLabels(labels, { languages = state.activeLanguages, onStart = () => {}, onComplete = () => {}, onError = () => {} } = {}) {
  cancelSpeech();
  const run = state.speechRun;
  const languagesToSpeak = languages.filter((language) => labels[language]);
  let currentIndex = 0;
  let finished = false;

  const finish = (error) => {
    if (run !== state.speechRun || finished) return;
    finished = true;
    window.clearTimeout(state.speechTimer);
    state.speechTimer = null;
    state.isSpeaking = false;
    state.utterance = null;
    if (error) {
      cancelSpeech();
      onError(error);
    } else {
      onComplete();
    }
  };

  const speakNext = () => {
    if (run !== state.speechRun || finished) return;
    if (currentIndex >= languagesToSpeak.length) {
      finish();
      return;
    }

    const language = languagesToSpeak[currentIndex++];
    try {
      const utterance = new window.SpeechSynthesisUtterance(labels[language]);
      utterance.lang = LANGUAGES[language].voice;
      utterance.rate = language === "zh" ? 0.92 : 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      const voice = getVoice(language);
      if (voice) utterance.voice = voice;
      let settled = false;
      utterance.onend = () => {
        if (settled || run !== state.speechRun || finished) return;
        settled = true;
        speakNext();
      };
      utterance.onerror = (event) => {
        if (settled || run !== state.speechRun || finished) return;
        settled = true;
        finish(event.error || "failed");
      };
      state.utterance = utterance;
      onStart(labels[language]);
      window.speechSynthesis.speak(utterance);
    } catch {
      finish("failed");
    }
  };

  if (!window.speechSynthesis || !("SpeechSynthesisUtterance" in window)) {
    finish("unavailable");
    return;
  }
  refreshVoices();
  state.isSpeaking = true;
  state.speechTimer = window.setTimeout(() => finish("timeout"), 10000);
  try {
    window.speechSynthesis.resume();
    speakNext();
  } catch {
    finish("failed");
  }
}

function speakCurrent() {
  const item = getCurrentRecord();
  if (!item || game.active) return;
  speakLabels(item.labels, {
    onStart: (label) => setNotice(`正在读：${label}`),
    onComplete: () => setNotice("再点一下，就会再读一遍。 "),
    onError: (error) => setNotice(error === "unavailable"
      ? "这个浏览器暂时不支持朗读，可以换 Safari 或 Chrome 试试。 "
      : "朗读没有成功，再点一下试试。 "),
  });
}

function prepareGamePools() {
  const available = new Map(state.records.map((item) => [item.hexcode, item]));
  const words = GAME_WORDS.filter((word) => {
    const item = available.get(word.hexcode);
    return item?.emoji && item.emoji !== "❔";
  }).map((word) => ({ ...word, emoji: available.get(word.hexcode).emoji }));
  Object.keys(game.pools).forEach((theme) => {
    game.pools[theme] = words.filter((word) => theme === "mixed" || word.theme === theme);
  });
  dom.startGameButton.disabled = game.pools.mixed.length < 3;
  renderGameThemes();
}

function shuffled(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [result[index], result[other]] = [result[other], result[index]];
  }
  return result;
}

function gameLanguageMarkup(labels, className) {
  return `<span class="${className}" lang="${LANGUAGES[game.language].voice}">${escapeHtml(labels[game.language])}</span>`;
}

function renderGameFeedback() {
  dom.gameFeedback.innerHTML = game.feedback ? gameLanguageMarkup(game.feedback, "game-feedback-line") : "";
  dom.gameFeedback.classList.toggle("is-success", game.locked);
}

function renderGameText() {
  dom.gameLanguagePicker.querySelectorAll('input[name="game-language"]').forEach((input) => {
    input.checked = input.value === game.language;
  });
  dom.gameQuestion.innerHTML = gameLanguageMarkup(gameQuestionLabels(), "game-question-line");
  dom.gameOptions.querySelectorAll("[data-game-hexcode]").forEach((button) => {
    const word = game.options.find((option) => option.hexcode === button.dataset.gameHexcode);
    button.setAttribute("aria-label", word.labels[game.language]);
    button.lang = LANGUAGES[game.language].voice;
  });
  renderGameFeedback();
}

function renderGameThemes() {
  dom.gameThemes.querySelectorAll("[data-game-theme]").forEach((button) => {
    const theme = button.dataset.gameTheme;
    const active = theme === game.theme;
    button.disabled = game.pools[theme].length < 3;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
}

function cancelGameActivity() {
  game.run += 1;
  game.timers.forEach((timer) => window.clearTimeout(timer));
  game.timers = [];
  cancelSpeech();
}

function speakGame(labels, onComplete = () => {}) {
  const run = game.run;
  dom.gameSpeechNote.hidden = true;
  speakLabels(labels, {
    languages: [game.language],
    onComplete: () => {
      if (game.active && run === game.run) onComplete();
    },
    onError: () => {
      if (!game.active || run !== game.run) return;
      dom.gameSpeechNote.textContent = {
        zh: "暂时没有声音，家长可以读题，继续点选哦。",
        en: "No sound right now. A grown-up can read the question.",
      }[game.language];
      dom.gameSpeechNote.lang = LANGUAGES[game.language].voice;
      dom.gameSpeechNote.hidden = false;
      onComplete();
    },
  });
}

function gameQuestionLabels() {
  return {
    zh: `${game.question.labels.zh}在哪里？`,
    en: `Find the ${game.question.labels.en}!`,
  };
}

function nextGameQuestion() {
  const pool = game.pools[game.theme];
  if (!game.active || pool.length < 3) return;
  cancelGameActivity();
  if (!game.deck.length) {
    game.deck = shuffled(pool);
    // Keep every word in the new round, while avoiding a repeated boundary.
    if (game.deck[0].hexcode === game.question?.hexcode) {
      const other = 1 + Math.floor(Math.random() * (game.deck.length - 1));
      [game.deck[0], game.deck[other]] = [game.deck[other], game.deck[0]];
    }
  }
  game.question = game.deck.shift();
  const distractors = shuffled(pool.filter((word) => word.hexcode !== game.question.hexcode)).slice(0, 2);
  game.options = shuffled([game.question, ...distractors]);
  game.mistakes = 0;
  game.locked = false;
  game.feedback = null;
  dom.gameOptions.innerHTML = game.options.map((word) =>
    `<button class="game-option" type="button" data-game-hexcode="${word.hexcode}">
      <span class="game-option-emoji" aria-hidden="true">${escapeHtml(word.emoji)}</span>
    </button>`
  ).join("");
  renderGameText();
  speakGame(gameQuestionLabels());
}

function enterGame() {
  if (game.active || game.pools.mixed.length < 3) return;
  game.homeScrollY = window.scrollY;
  game.active = true;
  game.theme = "mixed";
  game.deck = [];
  game.question = null;
  setSettingsOpen(false);
  dom.learnPanel.hidden = true;
  dom.explorePanel.hidden = true;
  dom.gamePanel.hidden = false;
  renderGameThemes();
  nextGameQuestion();
  window.scrollTo(0, 0);
  dom.gameReplayButton.focus({ preventScroll: true });
}

function exitGame() {
  if (!game.active) return;
  game.active = false;
  cancelGameActivity();
  dom.gamePanel.hidden = true;
  dom.learnPanel.hidden = false;
  dom.explorePanel.hidden = false;
  setNotice("点这里听发音");
  dom.startGameButton.focus({ preventScroll: true });
  window.scrollTo(0, game.homeScrollY);
}

function changeGameTheme(theme) {
  if (!game.active || theme === game.theme || !game.pools[theme] || game.pools[theme].length < 3) return;
  game.theme = theme;
  game.deck = [];
  renderGameThemes();
  nextGameQuestion();
}

function changeGameLanguage(language) {
  if (!game.active || language === game.language || !["zh", "en"].includes(language)) return;
  cancelGameActivity();
  game.language = language;
  renderGameText();
  if (game.locked) {
    continueGameAfterSpeech((done) => speakGame(game.feedback, done));
  } else {
    speakGame(gameQuestionLabels());
  }
}

function continueGameAfterSpeech(speak) {
  const run = game.run;
  let minimumElapsed = false;
  let speechFinished = false;
  const advance = () => {
    if (game.active && game.locked && run === game.run) nextGameQuestion();
  };
  // Set both timers before speaking: missing speech can finish synchronously.
  game.timers = [
    window.setTimeout(() => {
      minimumElapsed = true;
      if (speechFinished) advance();
    }, 1200),
    window.setTimeout(advance, 4000),
  ];
  speak(() => {
    speechFinished = true;
    if (minimumElapsed) advance();
  });
}

function replayGameQuestion() {
  if (!game.active || !game.question) return;
  cancelGameActivity();
  if (game.locked) {
    // Replaying during praise keeps the answer locked and replaces its timers.
    continueGameAfterSpeech((done) => speakGame(gameQuestionLabels(), done));
  } else {
    speakGame(gameQuestionLabels());
  }
}

function answerGame(hexcode) {
  if (!game.active || game.locked || !game.options.some((word) => word.hexcode === hexcode)) return;
  if (hexcode !== game.question.hexcode) {
    game.mistakes += 1;
    const retry = { zh: "再找找", en: "Try again!" };
    game.feedback = retry;
    renderGameFeedback();
    if (game.mistakes === 2) {
      dom.gameOptions.querySelector(`[data-game-hexcode="${game.question.hexcode}"]`).classList.add("is-hint");
    }
    speakGame(retry);
    return;
  }

  // Lock before any speech or animation can dispatch another event.
  game.locked = true;
  cancelGameActivity();
  dom.gameOptions.querySelectorAll(".game-option").forEach((button) => {
    button.disabled = true;
    button.classList.remove("is-hint");
  });
  const selected = dom.gameOptions.querySelector(`[data-game-hexcode="${hexcode}"]`);
  selected.classList.add("is-correct");
  selected.insertAdjacentHTML("beforeend", '<span class="game-stars" aria-hidden="true"><span>✦</span><span>✦</span><span>✦</span></span>');
  const praise = GAME_PRAISE[game.praiseIndex++ % GAME_PRAISE.length];
  game.feedback = praise;
  renderGameFeedback();
  continueGameAfterSpeech((done) => speakGame(praise, done));
}

async function loadDatasets() {
  if (window.EMOJI_DATA?.en?.length && window.EMOJI_DATA?.zh?.length) {
    state.datasets.en = window.EMOJI_DATA.en;
    state.datasets.zh = window.EMOJI_DATA.zh;
    mergeDatasets();
    return;
  }

  try {
    const [enResponse, zhResponse] = await Promise.all([
      fetch("data/en.json"),
      fetch("data/zh.json"),
    ]);
    if (!enResponse.ok || !zhResponse.ok) throw new Error("Emoji data was not found");
    state.datasets.en = await enResponse.json();
    state.datasets.zh = await zhResponse.json();
  } catch (error) {
    state.datasets = FALLBACK_DATA;
    state.usingFallback = true;
    console.warn("Full Emoji data could not be loaded; using the built-in starter set.", error);
  }
  mergeDatasets();
}

function bindEvents() {
  dom.startGameButton.addEventListener("click", enterGame);
  dom.gameBackButton.addEventListener("click", exitGame);
  dom.gameReplayButton.addEventListener("click", replayGameQuestion);
  dom.gameLanguagePicker.addEventListener("change", (event) => {
    const input = event.target.closest('input[name="game-language"]');
    if (input?.checked) changeGameLanguage(input.value);
  });
  dom.gameThemes.addEventListener("click", (event) => {
    const button = event.target.closest("[data-game-theme]");
    if (button && !button.disabled) changeGameTheme(button.dataset.gameTheme);
  });
  dom.gameOptions.addEventListener("click", (event) => {
    const button = event.target.closest("[data-game-hexcode]");
    if (button && !button.disabled) answerGame(button.dataset.gameHexcode);
  });

  dom.heroTapArea.addEventListener("click", () => speakCurrent());
  dom.heroTapArea.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    speakCurrent();
  });

  dom.settingsButton.addEventListener("click", () => {
    setSettingsOpen(dom.settingsBackdrop.hidden);
  });

  dom.settingsCloseButton.addEventListener("click", () => setSettingsOpen(false));
  dom.settingsBackdrop.addEventListener("click", (event) => {
    if (event.target === dom.settingsBackdrop) setSettingsOpen(false);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    if (game.active) exitGame();
    setSettingsOpen(false);
  });

  dom.languagePicker.addEventListener("click", (event) => {
    const button = event.target.closest("[data-language]");
    if (!button) return;
    const language = button.dataset.language;
    if (state.activeLanguages.includes(language)) {
      if (state.activeLanguages.length === 1) {
        setNotice("至少保留一种朗读语言哦。 ");
        return;
      }
      state.activeLanguages = state.activeLanguages.filter((item) => item !== language);
    } else {
      state.activeLanguages.push(language);
    }
    cancelSpeech();
    renderLanguagePicker();
    renderHero();
    renderGrid();
    setNotice(`已选择：${activeLanguageText()}。点上方听发音。 `);
  });

  dom.categoryRow.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    state.category = button.dataset.category;
    renderCategories();
    renderGrid();
  });

  dom.searchInput.addEventListener("input", (event) => {
    state.query = event.target.value;
    renderGrid();
  });

  dom.clearSearchButton.addEventListener("click", () => {
    state.query = "";
    dom.searchInput.value = "";
    dom.searchInput.focus();
    renderGrid();
  });

  dom.emojiGrid.addEventListener("click", (event) => {
    const card = event.target.closest("[data-hexcode]");
    if (!card) return;
    selectEmoji(card.dataset.hexcode);
  });
}

function bindInteractionGuards() {
  const preventDefault = (event) => event.preventDefault();
  const preventZoomShortcut = (event) => {
    if (!event.ctrlKey && !event.metaKey) return;
    const isZoomKey = ["+", "=", "-", "_", "0"].includes(event.key)
      || ["NumpadAdd", "NumpadSubtract"].includes(event.code);
    if (isZoomKey) event.preventDefault();
  };

  dom.appCard.addEventListener("contextmenu", preventDefault);
  dom.appCard.addEventListener("dragstart", preventDefault);
  dom.appCard.addEventListener("selectstart", preventDefault);
  dom.appCard.addEventListener("dblclick", preventDefault);

  document.addEventListener("keydown", preventZoomShortcut);
  document.addEventListener("wheel", (event) => {
    if (event.ctrlKey || event.metaKey) event.preventDefault();
  }, { passive: false });
  document.addEventListener("touchmove", (event) => {
    if (event.touches.length > 1) event.preventDefault();
  }, { passive: false });
  ["gesturestart", "gesturechange", "gestureend"].forEach((eventName) => {
    document.addEventListener(eventName, preventDefault, { passive: false });
  });
}

async function init() {
  bindInteractionGuards();
  bindEvents();
  if ("speechSynthesis" in window) {
    refreshVoices();
    window.speechSynthesis.addEventListener("voiceschanged", refreshVoices);
  }
  await loadDatasets();
  dom.gridLoading?.remove();
  renderLanguagePicker();
  renderCategories();
  renderHero();
  renderGrid();
  prepareGamePools();
  if (state.usingFallback) {
    setNotice("完整词库加载失败，当前使用内置词汇；请检查 data 文件是否完整。 ");
  }
}

init();
