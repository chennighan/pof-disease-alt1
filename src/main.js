const DISEASES = [
  {
    name: "Foot-in-mouth",
    symptoms: [
      "The animal keeps making noises at embarrassing moments, making it difficult to investigate.",
      "The animal's breath smells oddly like socks.",
      "The gums appear to be a little sore",
      "There are some nasty looking marks along the gum line.",
      "You can't seem to spot anything immediately obvious.",
      "The animal's eyes seem normal",
      "You can't seem to spot anything immediately obvious.",
      "The animal's feet are a little soggy for some reason.",
      "The animal's feet are faintly chewed on.",
      "The animal's feet seem a little scuffed.",
      "The animal's feet seem fine.",
      "You can't seem to spot anything immediately obvious.",
      "The animal doesn't appear to be in gastronomic distress.",
      "The animal has a bit of gas, but nothing too concerning.",
      "The animal's emissions smell strangely of shoes.",
      "The animal's stomach appears to be a little bloated.",
      "You can't seem to spot anything immediately obvious."
    ]
  },
  {
    name: "Flu",
    symptoms: [
      "The animal appears to be suffering from a small fever",
      "The animal coughs in your face",
      "The animal sneezes in your face.",
      "The animal's breath smells deeply unpleasant.",
      "You can't seem to spot anything immediately obvious.",
      "The eyes are a little bloodshot",
      "You can't seem to spot anything immediately obvious.",
      "The animal's feet are clammy",
      "The animal's feet are very sweaty.",
      "The animal's feet are very warm to the touch.",
      "The animal's feet seem fine.",
      "You can't seem to spot anything immediately obvious.",
      "The animal appears to be suffering from nausea.",
      "The animal doesn't appear to be in gastronomic distress.",
      "The animal has a bit of gas, but nothing too concerning.",
      "The animal seems off its food.",
      "You can't seem to spot anything immediately obvious."
    ]
  },
  {
    name: "Curse",
    symptoms: [
      "The animal occasionally mumbles something in a language it can't possibly speak",
      "The animal's breath smells faintly of sulphur.",
      "The animal's breath smells faintly of sulfur.",
      "The animal's nose is lumpy, like it's grown warts.",
      "There is a faint light deep within the animal's throat.",
      "You can't seem to spot anything immediately obvious.",
      "The animal's eyes are a little bloodshot.",
      "The animal's eyes are faintly glowing.",
      "The animal's eyes are filled with uncharacteristic malice.",
      "The animal's eyes seem a little glazed over.",
      "You can't seem to spot anything immediately obvious",
      "The animal's feet are faintly chewed on.",
      "The animal's feet are tapping to a strange rhythm. It's unsettling.",
      "The animal's feet seem a little scuffed.",
      "The animal's feet seem fine.",
      "You can't seem to spot anything immediately obvious.",
      "The animal doesn't appear to be in gastronomic distress.",
      "The animal has a bit of gas, but nothing too concerning.",
      "The animal seems off its food.",
      "The animal's stomach is making strange noises, like there's something singing inside there.",
      "You can't seem to spot anything immediately obvious."
    ]
  },
  {
    name: "Dry nose",
    symptoms: [
      "The animal's nose is very dry.",
      "The animal refuses to let you see its nose, it seems like the nose is quite sore.",
      "The animal's eyes seem fine.",
      "You can't seem to spot anything immediately obvious.",
      "The animal's feet seem fine.",
      "You can't seem to spot anything immediately obvious.",
      "The animal doesn't appear to be in gastronomic distress.",
      "The animal has a bit of gas, but nothing too concerning.",
      "You can't seem to spot anything immediately obvious."
    ]
  },
  {
    name: "Bone rattle",
    symptoms: [
      "The animal's nose seems fine.",
      "The animal's breath smells normal, which is to say horrible.",
      "The animal's teeth click in a sinister manner.",
      "The gums appear to be healthy.",
      "You can't seem to spot anything immediately obvious.",
      "The animal's eyes seem fine.",
      "You can't seem to spot anything immediately obvious.",
      "The animal's legs click as it walks.",
      "The animal's legs seem a little stiff.",
      "The animal appears to be shivering, but has no temperature.",
      "The animal doesn't appear to be in gastronomic distress.",
      "The animal has a bit of gas, but nothing too concerning.",
      "The animal's body is making a weird clicking noise.",
      "You can't seem to spot anything immediately obvious."
    ]
  },
  {
    name: "Wooting cough",
    symptoms: [
      "The animal coughs as you try and examine it.",
      "The animal coughs loudly in a 'hu hu huuu' style.",
      "The animal's breath smells normal.",
      "The animal's nose seems fine.",
      "You can't seem to spot anything immediately obvious.",
      "The animal's eyes are a little bloodshot.",
      "The animal's eyes are filled with mirth, more mirth than normal.",
      "The animal's eyes keep darting around the place with a sense of wonder.",
      "The animal is a little unsteady on its feet.",
      "The animal's legs seem fine.",
      "The animal coughs regularly.",
      "The animal doesn't appear to be in gastronomic distress.",
      "The animal has a bit of gas, but nothing too concerning.",
      "The animal's body is slightly swollen.",
      "You can't seem to spot anything immediately obvious."
    ]
  }
];

const SYMPTOM_DISEASE_COUNTS = buildSymptomDiseaseCounts();
const FUZZY_STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "but",
  "by",
  "for",
  "has",
  "have",
  "in",
  "inside",
  "is",
  "it",
  "it's",
  "its",
  "of",
  "on",
  "or",
  "seem",
  "seems",
  "the",
  "there",
  "to",
  "with",
  "you",
  "animal",
  "animal's",
  "body",
  "breath",
  "eyes",
  "feet",
  "gums",
  "head",
  "legs",
  "nose",
  "stomach"
]);
const OPTION_ANCHORS = [
  "Check the head",
  "Check the eyes",
  "Check the legs and feet",
  "Check the stomach",
  "Administer treatment"
];

const symptomInput = document.getElementById("symptoms");
const diagnoseBtn = document.getElementById("diagnoseBtn");
const clearBtn = document.getElementById("clearBtn");
const clipboardBtn = document.getElementById("clipboardBtn");
const resultCard = document.getElementById("resultCard");
const scanStatus = document.getElementById("scanStatus");
const lookup = document.getElementById("lookup");
const filter = document.getElementById("filter");
const alt1Status = document.getElementById("alt1Status");
const scanX = document.getElementById("scanX");
const scanY = document.getElementById("scanY");
const scanW = document.getElementById("scanW");
const scanH = document.getElementById("scanH");

const STREAM_FPS = 2;
const FALLBACK_SCAN_INTERVAL_MS = 1000;
let scanTimer = null;
let streamState = null;
let frameScanBusy = false;
let lastFrameStatus = 0;
let lastOcrAt = 0;
let lastScanText = "";

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\bsulphur\b/g, "sulfur")
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSymptomDiseaseCounts() {
  const map = new Map();
  for (const disease of DISEASES) {
    const seenForDisease = new Set();
    for (const symptom of disease.symptoms) {
      const normalized = normalize(symptom);
      if (!normalized || seenForDisease.has(normalized)) continue;
      seenForDisease.add(normalized);
      map.set(normalized, (map.get(normalized) || 0) + 1);
    }
  }
  return map;
}

function tokenSet(value) {
  return new Set(normalize(value).split(" ").filter(token => token && !FUZZY_STOP_WORDS.has(token)));
}

function jaccard(a, b) {
  const A = tokenSet(a);
  const B = tokenSet(b);
  if (!A.size || !B.size) return 0;
  let intersection = 0;
  for (const item of A) if (B.has(item)) intersection++;
  return intersection / new Set([...A, ...B]).size;
}

function scoreDisease(input, disease) {
  const normalizedInput = normalize(input);
  let score = 0;
  const matches = [];
  const seenSymptoms = new Set();

  for (const symptom of disease.symptoms) {
    const normalizedSymptom = normalize(symptom);
    if (!normalizedSymptom || seenSymptoms.has(normalizedSymptom)) continue;
    seenSymptoms.add(normalizedSymptom);

    const exact = normalizedInput.includes(normalizedSymptom) || normalizedSymptom.includes(normalizedInput);
    const fuzzy = jaccard(input, symptom);
    const diseaseCount = SYMPTOM_DISEASE_COUNTS.get(normalizedSymptom) || 1;
    const rarityWeight = 1 / diseaseCount;

    if (exact) {
      score += 4 * rarityWeight;
      matches.push({ symptom, reason: diseaseCount === 1 ? "exact" : "shared" });
    } else if (fuzzy >= 0.56) {
      score += 2.5 * rarityWeight;
      matches.push({ symptom, reason: "close" });
    } else if (fuzzy >= 0.35) {
      score += 1 * rarityWeight;
      matches.push({ symptom, reason: "weak" });
    }
  }

  return { disease: disease.name, score, matches };
}

function rankDiseases(text) {
  return DISEASES
    .map(disease => scoreDisease(text, disease))
    .sort((a, b) => b.score - a.score);
}

function diagnose(source = "manual") {
  const text = symptomInput.value.trim();
  if (!text) {
    resultCard.innerHTML = '<div class="muted">No symptoms entered yet.</div>';
    return null;
  }

  const ranked = rankDiseases(text);
  const best = ranked[0];
  const second = ranked[1] || { score: 0 };
  if (!best || best.score < 2) {
    resultCard.innerHTML = `
      <div class="resultDisease">No confident match</div>
      <div class="muted">Try entering a more specific symptom line from the animal inspection text.</div>
    `;
    return null;
  }
  if (second.score > 0 && best.score < second.score + 0.5) {
    const alternatives = ranked
      .slice(0, 4)
      .filter(item => item.score > 0)
      .map(item => `<li>${escapeHtml(item.disease)} - score ${item.score.toFixed(1)}</li>`)
      .join("");
    resultCard.innerHTML = `
      <div class="resultDisease">Ambiguous symptoms</div>
      <div class="muted">These symptoms are shared. Check another body part or re-check the animal for a clearer line.</div>
      <ul class="matchList">${alternatives}</ul>
    `;
    return null;
  }

  const confidence = best.score >= 4 && best.score >= second.score + 2
    ? "High confidence"
    : best.score >= 2
      ? "Medium confidence"
      : "Low confidence";

  const topMatches = best.matches
    .slice(0, 6)
    .map(match => `<li>${escapeHtml(match.symptom)} <span class="pill">${match.reason}</span></li>`)
    .join("");

  const alternatives = ranked
    .slice(1, 4)
    .filter(item => item.score > 0)
    .map(item => `<li>${escapeHtml(item.disease)} - score ${item.score.toFixed(1)}</li>`)
    .join("");

  resultCard.innerHTML = `
    <div class="resultDisease">${escapeHtml(best.disease)}</div>
    <div class="confidence">${confidence} - score ${best.score.toFixed(1)} - ${escapeHtml(source)}</div>
    <ul class="matchList">${topMatches}</ul>
    ${alternatives ? `<p class="muted">Other possible matches:</p><ul class="matchList">${alternatives}</ul>` : ""}
  `;
  return best;
}

function renderLookup() {
  const q = normalize(filter.value);
  const rows = [];
  for (const disease of DISEASES) {
    for (const symptom of disease.symptoms) {
      const haystack = normalize(`${disease.name} ${symptom}`);
      if (!q || haystack.includes(q)) {
        rows.push({ disease: disease.name, symptom });
      }
    }
  }
  lookup.innerHTML = rows.slice(0, 80).map(row => `
    <div class="lookupItem">
      <div class="lookupDisease">${escapeHtml(row.disease)}</div>
      <div class="symptom">${escapeHtml(row.symptom)}</div>
    </div>
  `).join("") || '<p class="muted">No lookup matches.</p>';
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

async function pasteClipboard() {
  try {
    const text = await navigator.clipboard.readText();
    symptomInput.value = text;
    diagnose("clipboard");
  } catch (error) {
    resultCard.innerHTML = '<div class="muted">Clipboard access was blocked. Paste manually with Ctrl+V.</div>';
  }
}

function identifyAlt1App() {
  if (window.alt1?.identifyAppUrl) {
    window.alt1.identifyAppUrl(new URL("./appconfig.json", window.location.href).href);
  }
}

function detectAlt1() {
  if (!window.alt1) {
    alt1Status.textContent = "Alt1 not detected. Open this page inside Alt1 to use screen scan.";
    return;
  }

  const perms = [];
  if (window.alt1.permissionPixel) perms.push("pixel");
  if (window.alt1.permissionGameState) perms.push("gamestate");
  if (window.alt1.permissionOverlay) perms.push("overlay");
  alt1Status.textContent = `Alt1 detected. Permissions: ${perms.length ? perms.join(", ") : "not installed / not granted yet"}.`;
  setDefaultScanBox();
}

function setDefaultScanBox() {
  if (!window.alt1?.rsLinked) return;
  const width = Number(window.alt1.rsWidth || 0);
  const height = Number(window.alt1.rsHeight || 0);
  if (!width || !height) return;

  // Default to the beige animal inspection dialogue near the lower center/right
  // of the RuneScape client. These stay editable because interface scaling varies.
  const dialogueW = Math.min(560, Math.max(420, Math.round(width * 0.42)));
  const dialogueH = Math.min(190, Math.max(130, Math.round(height * 0.22)));
  const dialogueX = width >= 1600 ? Math.round(width * 0.4) : Math.round(width * 0.56);
  const dialogueY = height >= 900 ? Math.round(height * 0.56) : Math.round(height * 0.74);
  scanX.value = scanX.value || Math.max(0, dialogueX);
  scanY.value = scanY.value || Math.max(0, dialogueY);
  scanW.value = scanW.value || Math.min(dialogueW, width - Number(scanX.value) - 20);
  scanH.value = scanH.value || dialogueH;
}

function getScanBox() {
  setDefaultScanBox();
  return {
    x: clamp(parseInt(scanX.value || "10", 10), 0, 10000),
    y: clamp(parseInt(scanY.value || "0", 10), 0, 10000),
    w: clamp(parseInt(scanW.value || "760", 10), 50, 2000),
    h: clamp(parseInt(scanH.value || "240", 10), 50, 1200)
  };
}

function getSearchRegion() {
  const width = Number(window.alt1?.rsWidth || 0);
  const height = Number(window.alt1?.rsHeight || 0);
  const y = Math.max(0, Math.round(height * 0.4));
  return {
    x: 0,
    y,
    w: width,
    h: Math.max(1, height - y)
  };
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function canScan() {
  if (!window.alt1) {
    scanStatus.textContent = "Waiting for Alt1. Open this page inside Alt1 to enable screen scanning.";
    return false;
  }
  if (!window.alt1.permissionPixel) {
    scanStatus.textContent = "Install the app and grant pixel permission before scanning.";
    return false;
  }
  if (!window.alt1.rsLinked) {
    scanStatus.textContent = "Waiting for RuneScape. Focus the game window so Alt1 can read it.";
    return false;
  }
  return true;
}

function flattenAlt1Read(value) {
  if (value == null) return "";

  // Alt1 normally returns a plain string, but some builds/configs can return
  // a JSON-ish fragment payload. If we dump that raw into the textarea, the
  // disease matcher never sees the real symptom sentence.
  if (typeof value !== "string") {
    try {
      return collectTextFragments(value).join(" ").trim();
    } catch {
      return "";
    }
  }

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed);
      const flattened = collectTextFragments(parsed).join(" ").trim();
      return flattened || trimmed;
    } catch {
      return trimmed;
    }
  }

  return trimmed;
}

function collectTextFragments(node, out = []) {
  if (node == null) return out;
  if (typeof node === "string") {
    out.push(node);
    return out;
  }
  if (Array.isArray(node)) {
    for (const item of node) collectTextFragments(item, out);
    return out;
  }
  if (typeof node === "object") {
    if (typeof node.text === "string") out.push(node.text);
    if (Array.isArray(node.fragments)) {
      for (const fragment of node.fragments) collectTextFragments(fragment, out);
    }
  }
  return out;
}

function readLineFromBoundRegion(boundId, x, y) {
  const fontNames = ["chat", "chatmono"];

  for (const fontname of fontNames) {
    const args = JSON.stringify({
      fontname,
      allowgap: true
    });

    try {
      const raw = window.alt1.bindReadStringEx(boundId, x, y, args);
      const text = flattenAlt1Read(raw);
      if (looksReadable(text)) return text;
    } catch (error) {
      // Try the next Alt1 font profile.
    }
  }

  return "";
}

function looksReadable(text) {
  const normalized = normalize(text);
  if (normalized.length < 3) return false;
  const letters = normalized.replace(/[^a-z]/g, "").length;
  return letters >= 3 && letters / Math.max(normalized.length, 1) >= 0.45;
}

function isDialogueBeigePixel(data, index) {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  return r >= 145 && r <= 245
    && g >= 125 && g <= 225
    && b >= 75 && b <= 190
    && r > g + 4
    && g > b + 12
    && r - b > 35;
}

function isDarkFramePixel(data, index) {
  const r = data[index];
  const g = data[index + 1];
  const b = data[index + 2];
  return r < 80 && g < 75 && b < 70;
}

function rowDarkRatio(img, y, x1, x2) {
  if (y < 0 || y >= img.height) return 0;
  let dark = 0;
  let total = 0;
  const start = clamp(x1, 0, img.width - 1);
  const end = clamp(x2, 0, img.width - 1);
  for (let x = start; x <= end; x += 4) {
    const index = (x + y * img.width) * 4;
    if (isDarkFramePixel(img.data, index)) dark++;
    total++;
  }
  return total ? dark / total : 0;
}

function findDialogueBoxInImage(img, region) {
  const rowHits = [];
  const step = 4;

  for (let y = 0; y < img.height; y += step) {
    let currentStart = -1;
    let bestStart = -1;
    let bestEnd = -1;

    for (let x = 0; x < img.width; x += step) {
      const index = (x + y * img.width) * 4;
      if (isDialogueBeigePixel(img.data, index)) {
        if (currentStart === -1) currentStart = x;
      } else if (currentStart !== -1) {
        if (x - currentStart > bestEnd - bestStart) {
          bestStart = currentStart;
          bestEnd = x;
        }
        currentStart = -1;
      }
    }

    if (currentStart !== -1 && img.width - currentStart > bestEnd - bestStart) {
      bestStart = currentStart;
      bestEnd = img.width;
    }

    if (bestEnd - bestStart >= 320) {
      rowHits.push({ y, x1: bestStart, x2: bestEnd });
    }
  }

  const candidates = [];
  let current = null;
  for (const hit of rowHits) {
    if (!current || hit.y > current.y2 + 40 || hit.x2 < current.x1 || hit.x1 > current.x2) {
      if (current) candidates.push(current);
      current = { x1: hit.x1, x2: hit.x2, y1: hit.y, y2: hit.y };
    } else {
      current.x1 = Math.min(current.x1, hit.x1);
      current.x2 = Math.max(current.x2, hit.x2);
      current.y2 = hit.y;
    }
  }
  if (current) candidates.push(current);

  let best = null;
  let bestScore = 0;
  for (const candidate of candidates) {
    const width = candidate.x2 - candidate.x1;
    const height = candidate.y2 - candidate.y1;
    if (width < 320 || height < 35) continue;

    const topFrame = rowDarkRatio(img, candidate.y1 - 28, candidate.x1, candidate.x2);
    const bottomFrame = rowDarkRatio(img, candidate.y2 + 10, candidate.x1, candidate.x2);
    const frameScore = Math.max(topFrame, bottomFrame);
    if (frameScore < 0.12) continue;

    const score = width * height * (1 + frameScore);
    if (score > bestScore) {
      best = candidate;
      bestScore = score;
    }
  }

  if (!best) return null;

  const x = clamp(region.x + best.x1 - 24, 0, window.alt1.rsWidth - 1);
  const y = clamp(region.y + best.y1 - 42, 0, window.alt1.rsHeight - 1);
  const w = clamp((best.x2 - best.x1) + 48, 120, window.alt1.rsWidth - x);
  const h = clamp((best.y2 - best.y1) + 72, 80, window.alt1.rsHeight - y);
  return { x, y, w, h };
}

function readTextFromBox(box) {
  let boundId;
  try {
    boundId = window.alt1.bindRegion(box.x, box.y, box.w, box.h);
  } catch (error) {
    return {
      box,
      error: error.message || String(error),
      lines: [],
      text: ""
    };
  }

  const lines = [];
  const xStarts = [12, 24, 40, 56, 72, 96, 128, 160];

  // Dialogue text is usually centered in the beige box, but the exact baseline
  // shifts with interface scaling. Scan densely and dedupe the successful reads.
  for (let y = 18; y < box.h - 12; y += 4) {
    for (const x of xStarts) {
      const line = readLineFromBoundRegion(boundId, x, y);
      if (line && line.length >= 3) lines.push(line);
    }
  }

  const text = uniqueLines(lines).join("\n");
  return {
    box,
    lines: uniqueLines(lines),
    text
  };
}

function scoreCapture(capture) {
  if (!capture.text) return 0;
  const normalized = normalize(capture.text);
  const optionScore = OPTION_ANCHORS
    .filter(anchor => normalized.includes(normalize(anchor)))
    .length * 3;
  const bestDiseaseScore = rankDiseases(extractMostRelevantDiseaseText(capture.text))[0]?.score || 0;
  return optionScore + bestDiseaseScore;
}

function getDynamicScanBoxes() {
  const width = Number(window.alt1.rsWidth || 0);
  const height = Number(window.alt1.rsHeight || 0);
  if (!width || !height) return [];

  const boxW = Math.min(560, Math.max(420, Math.round(width * 0.42)));
  const boxH = Math.min(190, Math.max(130, Math.round(height * 0.22)));
  const xRatios = width >= 1600 ? [0.36, 0.4, 0.44, 0.48] : [0.5, 0.56, 0.62];
  const yRatios = height >= 900 ? [0.52, 0.56, 0.6, 0.64] : [0.68, 0.72, 0.76, 0.8];
  const boxes = [];
  const seen = new Set();

  for (const xRatio of xRatios) {
    for (const yRatio of yRatios) {
      const x = clamp(Math.round(width * xRatio), 0, Math.max(0, width - boxW));
      const y = clamp(Math.round(height * yRatio), 0, Math.max(0, height - boxH));
      const key = `${x}:${y}:${boxW}:${boxH}`;
      if (seen.has(key)) continue;
      seen.add(key);
      boxes.push({ x, y, w: boxW, h: boxH });
    }
  }

  return boxes;
}

function findBestCapture(initialBox) {
  const captures = [readTextFromBox(initialBox)];
  let best = captures[0];
  let bestScore = scoreCapture(best);

  if (bestScore >= 4) return best;

  for (const box of getDynamicScanBoxes()) {
    const capture = readTextFromBox(box);
    const score = scoreCapture(capture);
    if (score > bestScore) {
      best = capture;
      bestScore = score;
    }
    if (score >= 4) break;
  }

  return best;
}

function findBestCaptureFromImage(img, region) {
  const box = findDialogueBoxInImage(img, region);
  if (!box) return null;
  return readTextFromBox(box);
}

function applyScanBox(box) {
  scanX.value = box.x;
  scanY.value = box.y;
  scanW.value = box.w;
  scanH.value = box.h;
}

function captureSearchRegion() {
  if (!window.alt1?.capture) return null;
  const region = getSearchRegion();
  if (!region.w || !region.h) return null;

  try {
    return {
      region,
      image: new ImageData(window.alt1.capture(region.x, region.y, region.w, region.h), region.w, region.h)
    };
  } catch (error) {
    return null;
  }
}

function handleCapture(capture, quiet = true) {
  if (!capture) return false;
  applyScanBox(capture.box);
  lastScanText = capture.text;

  if (!capture.text) {
    if (!quiet) {
      const box = capture.box;
      scanStatus.innerHTML = `Found the dialogue box, but could not read text yet. Current box: ${box.x}, ${box.y}, ${box.w}, ${box.h}`;
    }
    return false;
  }

  const bestText = extractMostRelevantDiseaseText(capture.text);
  symptomInput.value = bestText || capture.text;
  const best = diagnose("screen scan");
  scanStatus.innerHTML = `Auto-read ${capture.lines.length} text line(s) from ${capture.box.x}, ${capture.box.y}, ${capture.box.w}, ${capture.box.h}.${best ? ` Best match: <strong>${escapeHtml(best.disease)}</strong>.` : " No disease match yet."}`;

  if (window.alt1.permissionOverlay && best) {
    const overlayX = (window.alt1.rsX || 0) + capture.box.x;
    const overlayY = (window.alt1.rsY || 0) + Math.max(0, capture.box.y - 34);
    window.alt1.overLayText(`PoF: ${best.disease}`, 0xFFFFFFFF, 18, overlayX, overlayY, 2500);
  }

  return Boolean(best);
}

function scanScreenOnce({ quiet = false } = {}) {
  if (!canScan()) return;

  const visualCapture = captureSearchRegion();
  const capture = visualCapture
    ? findBestCaptureFromImage(visualCapture.image, visualCapture.region) || findBestCapture(getScanBox())
    : findBestCapture(getScanBox());
  if (capture.error) {
    scanStatus.textContent = `Could not bind the scan region: ${capture.error}`;
    return;
  }

  applyScanBox(capture.box);
  lastScanText = capture.text;

  if (!capture.text) {
    const box = capture.box;
    scanStatus.innerHTML = quiet
      ? `Waiting for animal dialogue. Last search box: ${box.x}, ${box.y}, ${box.w}, ${box.h}`
      : `No readable text found. Try opening the animal dialogue or expanding/moving the scan box. Current box: ${box.x}, ${box.y}, ${box.w}, ${box.h}`;
    return;
  }
  handleCapture(capture, quiet);
}

function uniqueLines(lines) {
  const seen = new Set();
  const out = [];
  for (const line of lines.map(x => x.trim()).filter(Boolean)) {
    const key = normalize(line);
    if (!key || seen.has(key)) continue;
    seen.add(key);
    out.push(line);
  }
  return out;
}

function extractMostRelevantDiseaseText(text) {
  const lines = uniqueLines(text.split(/\n+/));
  const scored = lines.map(line => {
    const best = rankDiseases(line)[0];
    return { line, score: best?.score || 0 };
  }).sort((a, b) => b.score - a.score);

  const good = scored.filter(item => item.score > 0).map(item => item.line);
  return good.length ? good.slice(0, 4).join("\n") : text;
}

function supportsCaptureStream() {
  return Boolean(window.ReadableStream && window.fetch && window.alt1?.versionint >= 1004006);
}

class RawFrameReader {
  constructor(reader, image) {
    this.reader = reader;
    this.image = image;
    this.frameOffset = 0;
    this.chunk = null;
    this.chunkOffset = 0;
  }

  async readFrame() {
    const frame = this.image.data;
    const frameLength = frame.length;

    while (this.frameOffset < frameLength) {
      if (!this.chunk || this.chunkOffset >= this.chunk.length) {
        const result = await this.reader.read();
        if (result.done) return null;
        this.chunk = result.value;
        this.chunkOffset = 0;
      }

      const available = this.chunk.length - this.chunkOffset;
      const needed = frameLength - this.frameOffset;
      const count = Math.min(available, needed);

      for (let i = 0; i < count; i++) {
        const rawOffset = this.frameOffset + i;
        const channel = rawOffset % 4;
        const frameIndex = channel === 0
          ? rawOffset + 2
          : channel === 2
            ? rawOffset - 2
            : rawOffset;
        frame[frameIndex] = this.chunk[this.chunkOffset + i];
      }

      this.frameOffset += count;
      this.chunkOffset += count;
    }

    this.frameOffset = 0;
    return this.image;
  }
}

async function startCaptureStream() {
  const region = getSearchRegion();
  if (!region.w || !region.h) return false;

  const abort = new AbortController();
  streamState = { abort };

  try {
    const payload = encodeURIComponent(JSON.stringify({
      x: region.x,
      y: region.y,
      width: region.w,
      height: region.h,
      fps: STREAM_FPS,
      format: "raw"
    }));
    const response = await fetch(`https://alt1api/pixel/streamregion/${payload}`, {
      signal: abort.signal
    });
    if (!response.ok || !response.body) throw new Error(`capture stream failed (${response.status})`);

    scanStatus.textContent = "Watching for the animal dialogue.";
    const reader = new RawFrameReader(response.body.getReader(), new ImageData(region.w, region.h));

    while (streamState?.abort === abort) {
      const image = await reader.readFrame();
      if (!image) break;
      handleStreamFrame(image, region);
    }
  } catch (error) {
    if (streamState?.abort === abort) {
      streamState = null;
      startFallbackAutoScan("Capture stream unavailable; using live fallback scan.");
    }
    return false;
  }

  return true;
}

function handleStreamFrame(image, region) {
  if (frameScanBusy) return;

  const box = findDialogueBoxInImage(image, region);
  const now = Date.now();
  if (!box) {
    if (now - lastFrameStatus > 2000) {
      scanStatus.textContent = "Watching for the animal dialogue.";
      lastFrameStatus = now;
    }
    return;
  }

  if (now - lastOcrAt < 700) return;
  lastOcrAt = now;
  frameScanBusy = true;

  try {
    handleCapture(readTextFromBox(box), true);
  } finally {
    frameScanBusy = false;
  }
}

function startFallbackAutoScan(message = "Watching for the animal dialogue.") {
  stopFallbackAutoScan();
  scanStatus.textContent = message;
  scanScreenOnce({ quiet: true });
  scanTimer = window.setInterval(() => {
    scanScreenOnce({ quiet: true });
  }, FALLBACK_SCAN_INTERVAL_MS);
}

function stopFallbackAutoScan() {
  if (scanTimer) {
    window.clearInterval(scanTimer);
    scanTimer = null;
  }
}

function startAutoScan() {
  stopAutoScan();
  if (!canScan()) {
    startFallbackAutoScan();
    return;
  }

  if (supportsCaptureStream()) {
    startCaptureStream();
  } else {
    startFallbackAutoScan("Watching for the animal dialogue.");
  }
}

function stopAutoScan() {
  stopFallbackAutoScan();
  if (streamState?.abort) {
    streamState.abort.abort();
    streamState = null;
  }
}

window.addEventListener("beforeunload", stopAutoScan);
diagnoseBtn.addEventListener("click", () => diagnose("manual"));
clearBtn.addEventListener("click", () => {
  symptomInput.value = "";
  diagnose();
});
clipboardBtn.addEventListener("click", pasteClipboard);
symptomInput.addEventListener("input", () => diagnose("manual"));
filter.addEventListener("input", renderLookup);

identifyAlt1App();
detectAlt1();
renderLookup();
startAutoScan();
