
const today = new Date();
const gregorian = today.toLocaleDateString('en-GB');
document.getElementById('gregorian-date').textContent = gregorian;

const hijri = new Intl.DateTimeFormat('ar-SA-u-ca-islamic-nu-latn', {
  day: 'numeric', month: 'long', year: 'numeric'
}).format(today);
document.getElementById('hijri-date').textContent = hijri;

function GetAthantimes() {
  axios.get('https://api.aladhan.com/v1/timingsByCity',{  
  params:{
  city: 'Algiers',
  country: 'Algeria',
  method: 3
  }
})
  .then(response => {
    const timings = response.data.data.timings;
    
    document.getElementById('Athan-1-time').textContent = timings.Fajr;
    document.getElementById('Athan-2-time').textContent = timings.Sunrise;
    document.getElementById('Athan-3-time').textContent = timings.Dhuhr;
    document.getElementById('Athan-4-time').textContent = timings.Asr;
    document.getElementById('Athan-5-time').textContent = timings.Maghrib;
    document.getElementById('Athan-6-time').textContent = timings.Isha;
    
    updateNextPrayer(timings);
  })  .catch(error => {
    console.error('حدث خطأ في جلب الأوقات:', error);
  });
}
function updateNextPrayer(timings) {
  const prayers = [
    { name: "الفجر", time: timings.Fajr },
    { name: "الشروق", time: timings.Sunrise },
    { name: "الظهر", time: timings.Dhuhr },
    { name: "العصر", time: timings.Asr },
    { name: "المغرب", time: timings.Maghrib },
    { name: "العشاء", time: timings.Isha }
  ];
  const now = new Date();
const currentMinutes = now.getHours() * 60 + now.getMinutes();

let nextPrayer = prayers[0];

for (const prayer of prayers) {
  const [h, m] = prayer.time.split(':').map(Number);
  const prayerMinutes = h * 60 + m;
  if (prayerMinutes > currentMinutes) {
    nextPrayer = prayer;
    break;
  }
}
document.querySelector('#Next-Athan h3:first-child').textContent = nextPrayer.name;
document.getElementById('Next-Athan-Time').textContent = nextPrayer.time;
startCountdown(nextPrayer.time);
}
let countdownInterval = null;

function startCountdown(nextPrayerTime) {
  const [h, m] = nextPrayerTime.split(':').map(Number);
  
  if (countdownInterval) {
    clearInterval(countdownInterval);
  }
  
  function update() {
    const now = new Date();
    let target = new Date();
    target.setHours(h, m, 0, 0);
    
    if (target <= now) {
      target.setDate(target.getDate() + 1);
    }
    
    const diff = target - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    const pad = (num) => String(num).padStart(2, '0');
    
    document.getElementById('countdown').textContent = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  }
  
  update();
  countdownInterval = setInterval(update, 1000);
}
GetAthantimes();