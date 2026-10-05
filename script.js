(function(){
  "use strict";

  /* ============================================================
     PERSONALIZE AQUI 👇
     ============================================================ */
  var MENSAGEM_FINAL = "boa noite, minha princesa 💛";
  /* ============================================================ */

  var scene         = document.getElementById('scene');
  var towerWrap      = document.getElementById('towerWrap');
  var hair           = document.getElementById('hair');
  var promptBtn      = document.getElementById('promptBtn');
  var burstText       = document.getElementById('burstText');
  var groundGlow      = document.getElementById('groundGlow');
  var explosionLay    = document.getElementById('explosionLayer');
  var finaleOverlay   = document.getElementById('finaleOverlay');
  var finaleText       = document.getElementById('finaleText');
  var replayBtn        = document.getElementById('replayBtn');
  var ambientRoot       = document.getElementById('ambientHearts');

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var trailInterval = null;
  var running = false;
  var landedTriggered = false;
  var fallbackTimer = null;

  /* ---------------- corações ambiente ---------------- */
  function spawnAmbientHeart(){
    if (reduceMotion) return;
    var h = document.createElement('span');
    h.className = 'ambient-heart';
    h.textContent = '💛';
    h.style.left = (Math.random()*90 + 5) + 'vw';
    h.style.setProperty('--dx', (Math.random()*40 - 20) + 'px');
    h.style.fontSize = (12 + Math.random()*10) + 'px';
    ambientRoot.appendChild(h);
    setTimeout(function(){ h.remove(); }, 9200);
  }
  setInterval(spawnAmbientHeart, 1900);
  if (!reduceMotion) spawnAmbientHeart();

  /* ---------------- rastro de corações dourados ---------------- */
  function startTrail(){
    if (reduceMotion) return;
    stopTrail();
    trailInterval = setInterval(function(){
      var hr = hair.getBoundingClientRect();
      var sr = scene.getBoundingClientRect();
      var h = document.createElement('span');
      h.className = 'trail-heart';
      var left = (hr.left + hr.width/2 - sr.left) + (Math.random()*16 - 8);
      var top  = (hr.bottom - sr.top) - 6 + (Math.random()*8 - 4);
      h.style.left = left + 'px';
      h.style.top  = top + 'px';
      h.style.setProperty('--dx', (Math.random()*30 - 15) + 'px');
      h.style.setProperty('--rot', (Math.random()*30 - 15) + 'deg');
      h.textContent = '💛';
      scene.appendChild(h);
      setTimeout(function(){ h.remove(); }, 1100);
    }, 100);
  }
  function stopTrail(){
    if (trailInterval){ clearInterval(trailInterval); trailInterval = null; }
  }

  /* ---------------- explosão de corações ---------------- */
  function spawnBurst(count){
    for (var i=0;i<count;i++){
      var b = document.createElement('span');
      b.className = 'burst-heart';
      var angle = (360/count)*i + (Math.random()*18-9);
      var dist = 120 + Math.random()*160;
      b.style.setProperty('--rot', angle + 'deg');
      b.style.setProperty('--dist', dist + 'px');
      b.textContent = '💛';
      b.style.animationDelay = (Math.random()*120) + 'ms';
      explosionLay.appendChild(b);
      setTimeout(function(el){ return function(){ el.remove(); }; }(b), 1600);
    }
  }

  /* ---------------- sequência principal ---------------- */
  function calcHairTarget(){
    var sr = scene.getBoundingClientRect();
    var hr = hair.getBoundingClientRect();
    var groundY = sr.bottom - (sr.height * 0.09) - 6; // alinhado com .ground-line
    var target = groundY - hr.top;
    return Math.max(target, 60);
  }

  function onHairLanded(){
    if (landedTriggered) return;
    landedTriggered = true;
    if (fallbackTimer){ clearTimeout(fallbackTimer); fallbackTimer = null; }

    stopTrail();
    hair.classList.add('landed');
    groundGlow.classList.add('show');

    setTimeout(triggerBurst, 250);
  }

  function triggerBurst(){
    burstText.classList.add('show');
    spawnBurst(reduceMotion ? 10 : 30);

    setTimeout(function(){
      finaleText.textContent = MENSAGEM_FINAL;
      finaleOverlay.classList.add('show');
      burstText.classList.add('fade-out');
      running = false;
    }, reduceMotion ? 250 : 1000);
  }

  hair.addEventListener('transitionend', function(e){
    if (e.propertyName === 'height') onHairLanded();
  });

  promptBtn.addEventListener('click', function(){
    if (running) return;
    running = true;
    landedTriggered = false;
    promptBtn.classList.add('hide');

    var target = calcHairTarget();
    startTrail();

    requestAnimationFrame(function(){
      hair.style.height = target + 'px';
    });

    // segurança: caso o evento transitionend não dispare
    fallbackTimer = setTimeout(onHairLanded, reduceMotion ? 400 : 2700);
  });

  /* ---------------- reiniciar ---------------- */
  function resetAll(){
    finaleOverlay.classList.remove('show');
    burstText.classList.remove('show','fade-out');
    explosionLay.innerHTML = '';
    groundGlow.classList.remove('show');
    hair.classList.remove('landed');
    hair.style.transition = 'none';
    hair.style.height = '0px';
    requestAnimationFrame(function(){
      hair.style.transition = '';
    });
    promptBtn.classList.remove('hide');
    stopTrail();
    running = false;
    landedTriggered = false;
  }

  replayBtn.addEventListener('click', resetAll);

})();
