// prettier-ignore
const RAGAS_BY_PRAHAR = [
  ["Ahir Lalita", "Bangala", "Basanta", "Bhankara", "Bhatiyara", "Hindol",
  "Lalita"],
  ["Ahir Bhairava", "Bhairava", "Bhairavi", "Desakara", "Gunakri", "Jogiya", "Ramakali", "Vibhasa"],
  ["Alankarapriya", "Asavari", "Bairagi", "Bhupala Todi", "Bilas-Khani Todi", "Bilavala", "Desi", "Gujari Todi", "Jaunpuri", "Malgunji", "Nata Bhairava", "Todi"],
  ["Dhani", "Gaura Saranga", "Madhuvanti", "Madhyamad Saranga", "Misra Gara", "Patdipa", "Suddha Saranga"],
  ["Bhimphalasi", "Carukesi", "Maru Bihaga", "Marwa", "Multani", "Namo Narayani", "Puriya", "Puriya Dhanasri", "Purvi", "Sohini", "Sri"],
  ["Abhogi", "Bhupali", "Bihag", "Des", "Hamsadhwani", "Hemanta", "Jaya Jayanti", "Kafi", "Khammaja", "Mand", "Sankara", "Suddha Kalyana", "Syama Kalyana", "Tilaka Kamod", "Tilanga", "Yaman", "Yaman Kalyana"],
  ["Basanta Mukhari", "Candani Kedar", "Candrakauns", "Chaya Nat", "Darbari Kanhada", "Durga", "Gaurakha Kalyana", "Hamir", "Jhinjhoti", "Kalavati", "Katyayani", "Kaushikdhwani", "Kedar", "Kirvani", "Malkauns", "Nanda", "Ragesri", "Sivaranjani", "Subha Kalyana"],
  ["Adana", "Bagesri", "Bahar", "Megha", "Puriya Kalyan", "Vrndavani Saranga"],
]

var fetchCoordinates = function() {
  return new Promise(function(resolve, reject) {
    console.debug("Fetching coordinates");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    } else {
      reject(Error("Geolocation is not supported by this browser"));
    }
  }).then(currentPosition => {
    return {
      lat: currentPosition.coords.latitude,
      lng: currentPosition.coords.longitude
    };
  });
};

var fetchTwilights = function(date, lat, lng) {
  console.debug("Fetching twilights for", { date, lat, lng });
  const params = { date, lat, lng, formatted: "0" };
  const urlParams = new URLSearchParams(Object.entries(params));
  return fetch("https://api.sunrise-sunset.org/json?" + urlParams).then(
    response => {
      return response.json();
    }
  );
};

const calculatePrahar = async function() {
  const { lat, lng } = await fetchCoordinates();

  const now = new Date();
  console.debug("Current time:", now);

  const tdyResponse = await fetchTwilights("today", lat, lng);
  const tdySunrise = new Date(tdyResponse.results.sunrise);
  const tdySunset = new Date(tdyResponse.results.sunset);

  if (now < tdySunrise) {
    console.debug("Current time is before today's sunrise.");
    const ydaResponse = await fetchTwilights("yesterday", lat, lng);
    var prevTwilight = new Date(ydaResponse.results.sunset);
    var nextTwilight = tdySunrise;
    var daytime = false;
  } else if (tdySunset <= now) {
    console.debug("Current time is after today's sunset.");
    const tmwResponse = await fetchTwilights("tomorrow", lat, lng);
    var prevTwilight = new Date(tmwResponse.results.sunrise);
    var nextTwilight = tmwSunrise;
    var daytime = false;
  } else {
    console.debug("Current time is during today's daytime.");
    var prevTwilight = tdySunrise;
    var nextTwilight = tdySunset;
    var daytime = true;
  }

  const prahar =
    (daytime ? 1 : 5) +
    Math.floor((4 * (now - prevTwilight)) / (nextTwilight - prevTwilight));
  console.debug(`Current time has prahar ${prahar}`);
  return prahar;
};

function sample(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function promisedScriptLoad(src, callbackName) {
  return new Promise(function(resolve, reject) {
    const script = document.createElement("script");
    script.src = src;
    document.querySelector("head").prepend(script);
    window[callbackName] = resolve;
  });
}

const setupPlayer = async function() {
  // Loads the IFrame Player API code asynchronously.
  // Will call `onYouTubeIframeAPIReady` when done.
  await promisedScriptLoad(
    "https://www.youtube.com/iframe_api",
    "onYouTubeIframeAPIReady"
  );
  return new Promise(function(resolve, reject) {
    new YT.Player("player", {
      events: { onReady: event => resolve(event.target) }
    });
  });
};

const setupGAPI = async function() {
  // Loads the Google API Client code asynchronously.
  // Will call `onClientLoad` when done.
  await promisedScriptLoad(
    "https://apis.google.com/js/client.js?onload=onClientLoad",
    "onClientLoad"
  );
  console.debug("Google API Client loaded.");
  await gapi.client.load("youtube", "v3");
  // See http://goo.gl/PdPA1 to get a key for your own applications.
  gapi.client.setApiKey("AIzaSyAE3mhfMe9P05kMxbv_6ysVzFMsSLyMsC0");
};

const main = async function() {
  const [prahar, player] = await Promise.all([
    calculatePrahar(),
    setupPlayer(),
    setupGAPI()
  ]);

  let ragaName = undefined
  let randomMatch = undefined;

  do {
    ragaName = sample(RAGAS_BY_PRAHAR[prahar - 1]);
    var request = gapi.client.youtube.search.list({
      part: "snippet",
      q: "raga " + ragaName,
      order: "rating",
      maxResults: 5,
      type: "video"
    });
    var response = await request.getPromise();
    randomMatch = sample(response.result.items);
  } while (!randomMatch);

  console.debug("Chosen raga is", ragaName);

  document.getElementById("prahar").textContent = prahar;
  document.getElementById("raga").textContent = ragaName;
  player.loadVideoById(randomMatch.id.videoId);
};

main();
