// A snowy footer: flakes fall slowly through a strip of night at the very bottom of the page
// and settle into a drift that grows higher the longer you stay. Poke the drift to scoop a burrow.
(function () {
  var wrap = document.createElement('section');
  wrap.id = 'snowDrift';
  wrap.setAttribute('aria-label', 'A snowdrift that slowly grows at the bottom of the page');
  wrap.innerHTML =
    '<div class="drift-ctl"><p class="drift-msg" id="driftMsg" role="status">Just a dusting so far.</p>' +
    '<span class="drift-btns"><button type="button" id="driftAdd">Shake the sky</button>' +
    '<button type="button" id="driftScoop">Scoop a burrow</button>' +
    '<button type="button" id="driftSweep">Sweep it flat</button></span></div>' +
    '<canvas id="driftCanvas" height="170" role="img" aria-label="Snowdrift. Press it to scoop a burrow."></canvas>' +
    '<p class="drift-hint">Poke the drift to scoop a hamster burrow in it.</p>';
  document.body.appendChild(wrap);

  var cv = document.getElementById('driftCanvas');
  var ctx = cv.getContext('2d');
  var msg = document.getElementById('driftMsg');
  var STEP = 4, H = 170, CAP = 105;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var W = 800, n = 200, heights = [], flakes = [], dpr = 1;
  var KEY = 'pepperDriftV1';
  var clock = 0; // seconds of snowfall so far, steers the breeze

  function load() {
    try {
      var s = JSON.parse(localStorage.getItem(KEY));
      if (s && s.length) return s;
    } catch (e) {}
    return null;
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(heights.map(function (v) { return Math.round(v * 10) / 10; }))); } catch (e) {}
  }

  function resize() {
    var w = Math.max(280, Math.floor(wrap.clientWidth));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = Math.floor(w * dpr);
    cv.height = Math.floor(H * dpr);
    cv.style.height = H + 'px';
    var old = heights.slice(), oldN = n;
    W = w;
    n = Math.ceil(W / STEP) + 1;
    heights = [];
    for (var i = 0; i < n; i++) {
      if (old.length) {
        var j = Math.min(oldN - 1, Math.round(i * (oldN - 1) / (n - 1)));
        heights.push(old[j]);
      } else heights.push(6 + Math.random() * 2);
    }
  }

  var stored = load();
  resize();
  if (stored) {
    for (var i = 0; i < n; i++) heights[i] = stored[Math.min(stored.length - 1, Math.round(i * (stored.length - 1) / (n - 1)))];
  }
  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { resize(); draw(); }, 120);
  });

  function rnd(a, b) { return a + Math.random() * (b - a); }

  function spawn(initialY) {
    flakes.push({
      x: rnd(0, W), y: initialY === undefined ? -8 : initialY,
      r: rnd(1.2, 3.4), vy: rnd(14, 30), ph: rnd(0, 6.28), sw: rnd(.6, 1.6), amp: rnd(6, 16)
    });
  }

  function land(f) {
    var c = Math.max(1, Math.min(n - 2, Math.round(f.x / STEP)));
    // bump the landing spot and its neighbours: a flake is a small handful of snow
    var room = Math.max(0.05, 1 - heights[c] / CAP);
    var amt = (1.8 + f.r) * room;
    heights[c] += amt * .5;
    heights[c - 1] += amt * .25;
    heights[c + 1] += amt * .25;
  }

  // snow slumps sideways wherever it is too steep
  function settle(passes) {
    for (var p = 0; p < passes; p++) {
      for (var i = 1; i < n - 1; i++) {
        var d = heights[i] - heights[i - 1];
        if (d > 3) { var m = (d - 3) * .25; heights[i] -= m; heights[i - 1] += m; }
        d = heights[i] - heights[i + 1];
        if (d > 3) { var m2 = (d - 3) * .25; heights[i] -= m2; heights[i + 1] += m2; }
      }
    }
  }

  function groundY(x) {
    var c = Math.max(0, Math.min(n - 1, Math.round(x / STEP)));
    return H - heights[c];
  }

  function drawStar(x, y, r, a) {
    ctx.beginPath();
    for (var k = 0; k < 3; k++) {
      var t = a + k * Math.PI / 3;
      ctx.moveTo(x - Math.cos(t) * r * 1.8, y - Math.sin(t) * r * 1.8);
      ctx.lineTo(x + Math.cos(t) * r * 1.8, y + Math.sin(t) * r * 1.8);
    }
    ctx.stroke();
  }

  function pilePath(offsetY, yShift) {
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (var i = 0; i < n; i++) {
      var h = heights[i] * offsetY + yShift;
      ctx.lineTo(i * STEP, H - h);
    }
    ctx.lineTo(W + STEP, H);
    ctx.closePath();
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1f2a3d'); g.addColorStop(1, '#3a4d75');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // back drift (cooler blue) peeks out behind the front one
    ctx.fillStyle = '#b7c8e2';
    pilePath(1, 9);
    ctx.fill();
    // falling flakes
    ctx.strokeStyle = 'rgba(255,255,255,.85)';
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255,255,255,.9)';
    for (var i = 0; i < flakes.length; i++) {
      var f = flakes[i];
      var sx = f.x + Math.sin(f.ph) * f.amp;
      if (f.r > 2.6) drawStar(sx, f.y, f.r * .8, f.ph * .5);
      else { ctx.beginPath(); ctx.arc(sx, f.y, f.r * .8, 0, 6.283); ctx.fill(); }
    }
    // front drift
    ctx.fillStyle = '#f4f8ff';
    pilePath(1, 0);
    ctx.fill();
    // soft shine along the top of the drift
    ctx.strokeStyle = 'rgba(255,255,255,.95)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (var j = 0; j < n; j++) {
      var y = H - heights[j] - 1;
      if (j === 0) ctx.moveTo(0, y); else ctx.lineTo(j * STEP, y);
    }
    ctx.stroke();
  }

  var lastWord = '';
  function words() {
    var s = 0;
    for (var i = 0; i < n; i++) s += heights[i];
    var avg = s / n;
    var w;
    if (avg < 14) w = 'Just a dusting so far.';
    else if (avg < 30) w = 'A soft blanket is gathering.';
    else if (avg < 50) w = 'Deep enough to hide a hamster.';
    else if (avg < 72) w = 'A proper drift. Fit for a tiny queen.';
    else w = 'The drift is so tall the sky is nearly full. Sweep it, or keep it!';
    if (w !== lastWord) { msg.textContent = w; lastWord = w; }
  }

  var last = 0, spawnTimer = 0, saveTimer = 0, running = true, visible = true;
  function frame(t) {
    if (!running) return;
    var dt = Math.min(.05, (t - last) / 1000 || 0);
    last = t;
    if (visible && !document.hidden) {
      clock += dt;
      spawnTimer += dt;
      // a slow, lazy breeze that swells and fades, so the whole sky leans together now and then
      var breeze = Math.sin(clock * .21) * 7 + Math.sin(clock * .53 + 1) * 3;
      // a lazy snowfall: only a few flakes a second
      while (spawnTimer > .28) { spawnTimer -= .28; spawn(); }
      for (var i = flakes.length - 1; i >= 0; i--) {
        var f = flakes[i];
        f.y += f.vy * dt;
        f.x += breeze * (f.r / 3) * dt;
        f.ph += f.sw * dt;
        var sx = f.x + Math.sin(f.ph) * f.amp;
        if (f.y >= groundY(sx) - 1) {
          f.x = Math.max(0, Math.min(W, sx)); land(f); flakes.splice(i, 1);
        }
      }
      settle(1);
      draw(); words();
      saveTimer += dt;
      if (saveTimer > 5) { saveTimer = 0; save(); }
    }
    requestAnimationFrame(frame);
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { visible = e[0].isIntersecting; if (visible) { last = performance.now(); } }).observe(wrap);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) save(); else last = performance.now();
  });

  // shake the sky: a quick handful of snow
  function handful() {
    if (reduce) {
      for (var k = 0; k < 40; k++) { land({ x: rnd(0, W), r: rnd(1.2, 3.4) }); }
      settle(30);
      draw(); words(); save();
    } else {
      for (var i = 0; i < 40; i++) spawn(-rnd(0, 120));
    }
  }

  // scoop a burrow (centered on column c) and heap a little snow beside it
  function scoop(c) {
    var rad = 7, dug = 0;
    for (var i = -rad; i <= rad; i++) {
      var k = c + i;
      if (k < 0 || k >= n) continue;
      var take = Math.min(heights[k] - 3, 9 * (.5 + .5 * Math.cos(i / rad * Math.PI)));
      if (take > 0) { heights[k] -= take; dug += take; }
    }
    var lft = Math.max(0, c - rad - 1), rgt = Math.min(n - 1, c + rad + 1);
    heights[lft] += dug * .2; heights[rgt] += dug * .2;
    settle(8);
    draw(); words(); save();
  }

  document.getElementById('driftAdd').addEventListener('click', handful);
  document.getElementById('driftSweep').addEventListener('click', function () {
    for (var i = 0; i < n; i++) heights[i] = 6 + Math.random() * 2;
    flakes = [];
    draw(); words(); save();
  });
  // a button for anyone who would rather not poke the canvas: scoops somewhere along the drift
  document.getElementById('driftScoop').addEventListener('click', function () {
    scoop(Math.round(rnd(.1, .9) * (n - 1)));
  });
  cv.addEventListener('pointerdown', function (e) {
    var rect = cv.getBoundingClientRect();
    var x = (e.clientX - rect.left) * (W / rect.width);
    scoop(Math.round(x / STEP));
  });

  draw(); words();
  if (!reduce) requestAnimationFrame(frame);
})();
