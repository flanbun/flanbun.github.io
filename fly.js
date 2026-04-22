/* ════════════════════════════════
   EDITABLE VARIABLES
════════════════════════════════ */
const IMAGES = ["/img/fly-transparent.gif", "/img/roach-transparent.gif", "/img/spider-transparent.gif"];
const AUDIO_URL = "/wav/buzz.wav";
const LIMIT = 15;
const IMG_SIZE = 48;
const MIN_SEC = 1;
const MAX_SEC = 10;
const NAMES = [
    "Googlebot",
    "Bingbot",
    "Google Analytics",
    "Meta Pixel",
    "Google Ads",
    "DoubleClick",
    "Google Tag Manager",
    "HubSpot Tracking",
    "Hotjar",
    "FullStory",
    "Mixpanel",
    "Amplitude",
    "Segment",
    "Criteo",
    "AdRoll",
    "Outbrain",
    "Taboola",
    "LinkedIn Insight Tag",
    "Twitter Pixel",
    "TikTok Pixel",
    "Snapchat Pixel",
    "Reddit Pixel",
    "Pinterest Tag",
    "Adobe Analytics",
    "Adobe Launch",
    "Optimizely",
    "VWO",
    "Crazy Egg",
    "Mouseflow",
    "LogRocket",
    "Heap",
    "Intercom",
    "Drift",
    "Zendesk",
    "Marketo Munchkin",
    "Salesforce Beacon",
    "Pardot",
    "Klaviyo",
    "ActiveCampaign",
    "Quantcast",
    "Lotame",
    "LiveRamp",
    "Trade Desk",
    "AppNexus",
    "OpenX",
    "PubMatic",
    "Rubicon Project",
    "Xandr",
    "Index Exchange",
    "Magnite",
    "Comscore",
    "Nielsen",
    "Chartbeat",
    "Parse.ly",
    "Similarweb",
    "StatCounter",
    "Clicky",
    "Woopra",
    "Kissmetrics",
    "Piwik",
    "Tealium",
    "Ensighten",
    "mParticle",
    "Cloudflare Bot Management",
    "PerimeterX",
    "DataDome",
    "HUMAN Security",
    "Arkose Labs",
    "reCAPTCHA",
    "hCaptcha",
    "Akamai Bot Manager",
    "Imperva",
    "New Relic",
    "Datadog",
    "Dynatrace",
    "Pingdom",
    "SpeedCurve",
    "Boomerang",
    "Yandexbot",
    "Baiduspider",
    "DuckDuckBot",
    "Applebot",
    "Amazonbot",
    "GPTBot",
    "ClaudeBot",
    "CCBot",
    "ia_archiver",
    "facebookexternalhit",
    "Twitterbot",
    "AddThis",
    "ShareThis",
    "Disqus",
    "OneTrust",
    "TrustArc",
    "Sourcepoint",
    "Dynamic Yield",
    "Monetate",
    "AB Tasty",
    "Kameleoon",
    "Contentsquare",
    "Glassbox",
    "Quantum Metric"
];
/* ════════════════════════════════ */

const SPAWN_ZONE = document.getElementById("drop-zone");
let count = 0,
    running = false,
    timer = null,
    popup = null;
let usedNames = [];

document.getElementById("denomEl").textContent = LIMIT;

function randImage() {
    return IMAGES[Math.floor(Math.random() * IMAGES.length)];
}
function randDelay() {
    return (Math.random() * (MAX_SEC - MIN_SEC) + MIN_SEC) * 1000;
}
function randRotation() {
    return Math.floor(Math.random() * 360);
}

function playSound() {
    if (!AUDIO_URL) return;
    const audio = new Audio(AUDIO_URL);
    audio.play().catch(() => {});
}

function pickName() {
    if (usedNames.length >= NAMES.length) usedNames = [];
    const remaining = NAMES.filter((n) => !usedNames.includes(n));
    const name = remaining[Math.floor(Math.random() * remaining.length)];
    usedNames.push(name);
    return name;
}

function setButtons(state) {
    document.getElementById("startBtn").disabled = state === "running" || state === "done";
    document.getElementById("stopBtn").disabled = state !== "running";
}

function removePopup() {
    if (popup) {
        popup.remove();
        popup = null;
    }
}

function showPopup(img, name) {
    removePopup();
    popup = document.createElement("div");
    popup.className = "popup";
    popup.innerHTML = '<p class="popup-name">' + name + "</p>";
    SPAWN_ZONE.appendChild(popup);

    const zW = SPAWN_ZONE.offsetWidth;
    const imgL = parseInt(img.style.left);
    const imgT = parseInt(img.style.top);
    let left = imgL + IMG_SIZE + 8;
    if (left + 180 > zW) left = imgL - 180 - 8;
    let top = imgT + IMG_SIZE / 2 - 24;
    if (top < 0) top = 0;
    popup.style.left = left + "px";
    popup.style.top = top + "px";
}

function spawnOne() {
    const zW = SPAWN_ZONE.offsetWidth,
        zH = SPAWN_ZONE.offsetHeight;
    const x = Math.floor(Math.random() * (zW - IMG_SIZE));
    const y = Math.floor(Math.random() * (zH - IMG_SIZE));
    const rot = randRotation();
    const name = pickName();

    const img = document.createElement("img");
    img.src = randImage();
    img.className = "spawned-img";
    img.style.width = IMG_SIZE + "px";
    img.style.height = IMG_SIZE + "px";
    img.style.left = x + "px";
    img.style.top = y + "px";
    img.style.transform = "rotate(" + rot + "deg)";

    img.addEventListener("mouseenter", () => showPopup(img, name));
    img.addEventListener("mouseleave", removePopup);

    SPAWN_ZONE.appendChild(img);
    requestAnimationFrame(() => requestAnimationFrame(() => img.classList.add("visible")));

    playSound();
    count++;
    document.getElementById("countEl").textContent = count;
}

function scheduleNext() {
    if (!running) return;
    if (count >= LIMIT) {
        finish();
        return;
    }
    const delay = randDelay();
    document.getElementById("nextLbl").textContent = "next in " + (delay / 1000).toFixed(1) + "s";
    timer = setTimeout(() => {
        if (!running) return;
        spawnOne();
        if (count >= LIMIT) {
            finish();
            return;
        }
        scheduleNext();
    }, delay);
}

function finish() {
    running = false;
    clearTimeout(timer);
    document.getElementById("nextLbl").textContent = "done";
    setButtons("done");
}

function startSpawner() {
    if (running || count >= LIMIT) return;
    running = true;
    setButtons("running");
    scheduleNext();
}

function stopSpawner() {
    running = false;
    clearTimeout(timer);
    document.getElementById("nextLbl").textContent = "paused";
    setButtons("stopped");
}

function restartSpawner() {
    running = false;
    clearTimeout(timer);
    removePopup();
    count = 0;
    usedNames = [];
    SPAWN_ZONE.innerHTML = "";
    document.getElementById("countEl").textContent = "0";
    document.getElementById("nextLbl").textContent = "";
    setButtons("stopped");
    running = true;
    setButtons("running");
    scheduleNext();
}
