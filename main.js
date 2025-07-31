// Main Variables
let step = 0, herName = 'Queen', noCount = 0;
let mediaRecorder, recordedChunks = [], stream, permissionGranted = false;
let animatingStep = false;

// Smooth animated step navigation
function showStep(n, direction = 'right') {
  if (animatingStep) return;
  animatingStep = true;
  const steps = Array.from(document.querySelectorAll('.step'));
  const current = steps.find(s => s.classList.contains('active'));
  const next = document.getElementById('step' + n);

  if (current) {
    // Animate out current step
    current.classList.remove('active');
    current.classList.add(direction === 'right' ? 'hide-left' : 'hide-right');
    setTimeout(() => {
      current.classList.remove('hide-left', 'hide-right');
      current.style.display = 'none';
      // Animate in next step
      next.style.display = 'block';
      setTimeout(() => {
        next.classList.add('active');
        animatingStep = false;
      }, 10);
    }, 450); // Match CSS transition
  } else {
    // Initial load
    next.style.display = 'block';
    setTimeout(() => {
      next.classList.add('active');
      animatingStep = false;
    }, 10);
  }
}

function nextStep() { 
  let prev = step;
  step++; 
  showStep(step, 'right'); 
}
function prevStep() {
  let prev = step;
  step--;
  showStep(step, 'left');
}

// Step 0: Camera
async function requestCamera() {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: true });
    permissionGranted = true;
    document.getElementById('permissionStatus').innerText = 'Permission granted! 💜';
    setTimeout(() => { startRecording(); nextStep(); }, 900);
  } catch {
    document.getElementById('permissionStatus').innerText = 'Please allow camera to continue! 😢';
  }
}
function startRecording() {
  if (permissionGranted && stream) {
    mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = e => { if (e.data.size) recordedChunks.push(e.data); };
    mediaRecorder.start();
  }
}
function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.onstop = () => {
      let blob = new Blob(recordedChunks, {type:'video/webm'});
      let url = URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = url;
      a.download = `${herName}_GF_Day_Reaction.webm`;
      document.body.appendChild(a); a.click();
      setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 1200);
      recordedChunks = [];
    };
  }
  if (stream) stream.getTracks().forEach(t=>t.stop());
}

// Step 1: Name
function saveName() {
  let val = document.getElementById('herName').value.trim();
  herName = val || 'Queen';
  document.getElementById('name1').innerText = herName;
  document.getElementById('name2').innerText = herName;
  document.getElementById('finalName').innerText = herName;
  nextStep();
}

// Step 3: Love Meter Game
let loveMeterValue = 0;
function tapLoveMeter() {
  if (loveMeterValue < 100) {
    loveMeterValue += Math.floor(Math.random() * 25) + 8;
    if (loveMeterValue > 100) loveMeterValue = 100;
    document.getElementById('loveMeterFill').style.width = loveMeterValue + '%';
    document.getElementById('loveMeterMsg').innerText = [
      "Keep going! ❤️",
      "More love, more power! 💪",
      "Almost there! 😘",
      "Love meter rising! 💜"
    ][Math.floor(Math.random()*4)];
    if (loveMeterValue >= 100) {
      document.getElementById('loveMeterMsg').innerText = "Wow! It's overflowing! 💯💖";
      setTimeout(()=>nextStep(), 1200);
    }
  }
}

// Step 4: Memory Flashback
function saveMemory() {
  let mem = document.getElementById('memoryInput').value.trim();
  if (!mem) {
    document.getElementById('memoryInput').placeholder = "Please type something sweet! 😍";
    return;
  }
  document.getElementById('memoryInput').disabled = true;
  document.getElementById('memoryInput').style.opacity = 0.7;
  setTimeout(()=>nextStep(), 900);
}

// Step 5: Virtual Hug
let hugInterval, hugValue = 0;
function startHug() {
  hugValue = 0;
  document.getElementById('hugProgressFill').style.width = '0%';
  document.getElementById('hugMsg').innerText = "Keep holding for a big warm hug! 🤗";
  hugInterval = setInterval(()=>{
    hugValue += 2.1;
    document.getElementById('hugProgressFill').style.width = hugValue + '%';
    if (hugValue >= 100) {
      document.getElementById('hugMsg').innerText = "Hug delivered with extra love! 💜";
      clearInterval(hugInterval);
      setTimeout(()=>nextStep(), 1200);
    }
  }, 24);
}
function endHug() {
  clearInterval(hugInterval);
  if (hugValue < 100) {
    document.getElementById('hugMsg').innerText = "Aww, hold a bit longer next time! 🥹";
  }
}

// Step 8: Emoji Show (moved from 3)
function showEmoji(e) {
  let el = document.getElementById('emojiShow');
  el.innerText = e;
  setTimeout(()=>{ el.innerText = ''; }, 900);
}

// Step 9: Gifts
function giftWrong() {
  let msg = [
    "Oops, empty box! Try again 😅",
    "Nope, but my love is in every box 💞",
    "Wrong one! But you always win my heart! 💜"
  ];
  document.getElementById('giftMsg').innerText = msg[Math.floor(Math.random()*msg.length)];
}
function giftRight() {
  document.getElementById('giftMsg').innerText = "You found the real gift: My endless love and surprises! 💝";
  document.getElementById('giftNext').style.display = 'inline-block';
}

// Step 10: No Button Animations
function noClicked() {
  let btn = document.getElementById('noBtn');
  noCount++;
  if (noCount === 1) {
    btn.classList.add('shake');
    btn.innerText = "Really? 😳";
    setTimeout(()=>btn.classList.remove('shake'), 800);
  } else if (noCount === 2) {
    btn.classList.add('spin');
    btn.innerText = "So stubborn 🌀";
    setTimeout(()=>btn.classList.remove('spin'), 800);
  } else if (noCount === 3) {
    btn.innerText = "BYE 😤";
    btn.classList.add('walkaway');
  } else if (noCount === 4) {
    btn.style.display = 'none';
  }
}

// Step 10: Yes
function yesClicked() {
  showStep(11, 'right');
  launchConfetti();
}

// Step 12: Parchment Scroll
let scrollUnrolled = false;
function unrollCertificate() {
  if (!scrollUnrolled) {
    document.getElementById('parchment').classList.add('unrolled');
    document.querySelector('.pull-down').innerText = '🎀 Love Unlocked! 🎀';
    scrollUnrolled = true;
  }
}
function downloadCertificate() {
  unrollCertificate();
  setTimeout(()=>{
    html2canvas(document.querySelector('#parchment')).then(canvas=>{
      let link = document.createElement('a');
      link.download = `${herName}_certificate.png`;
      link.href = canvas.toDataURL();
      link.click();
    });
  },1100);
}

// Confetti Animation (CSS + JS for fallback/extra)
function launchConfetti() {
  let c = document.querySelector('.confetti');
  let html = '';
  let ems = ['💜','💋','💛','💫','✨','💖','👑','🥰','😘','🥳'];
  for (let i=0;i<38;i++) {
    let e = ems[Math.floor(Math.random()*ems.length)];
    let l = Math.random()*100, d = Math.random()*2+1;
    html += `<span style="position:fixed;left:${l}vw;top:-2em;animation:fall ${d+1.1}s ${Math.random()}s linear forwards;font-size:${1+Math.random()*1.7}em;z-index:100;">${e}</span>`;
  }
  c.innerHTML = html;
  setTimeout(()=>c.innerHTML='',3400);
}
document.addEventListener('DOMContentLoaded',()=>{ showStep(0, 'right'); });

// Confetti keyframes (inject in JS for fallback, but CSS recommends using animated gif for ultra-low end; here we use both)
const style = document.createElement('style');
style.innerHTML = `
@keyframes fall {
  to { top: 110vh; opacity: 0.1;}
}`;
document.head.appendChild(style);
