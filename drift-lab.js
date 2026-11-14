// The Slump Tray: a row of snow heights. Each grain of snow is a little square.
// Wherever a column stands too much taller than its neighbour, one grain slides sideways.
(function () {
  var COLS = 30, ROWS = 16, CW = 20, CH = 20;
  var cv = document.getElementById('slumpCanvas');
  var ctx = cv.getContext('2d');
  var msg = document.getElementById('slumpMsg');
  var slider = document.getElementById('slipSlider');
  var slipWord = document.getElementById('slipWord');
  var autoBox = document.getElementById('autoBox');
  var viewBtn = document.getElementById('viewBtn');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = COLS * CW * dpr; cv.height = ROWS * CH * dpr;
  var heights = [], moved = [], cursor = Math.floor(COLS / 2), soft = false, timer = 0, quiet = 0;
  var WORDS = ['', 'slippery powder: it will hardly stand up at all', 'light fluffy snow: gentle slopes only', 'ordinary snow: a fair little hill', 'sticky wet snow: it clings to steep sides'];
  var DESC = ['', 'Slippery', 'Fluffy', 'Ordinary', 'Sticky'];
  var SKY = 'rgba(0,0,0,0)';

  function limit() { return +slider.value; }
  function flat() { for (var i = 0; i < COLS; i++) { heights[i] = 1; moved[i] = 0; } }
  flat();
  // a starting heap in the middle, already a bit tall
  heights[15] = 9; heights[14] = 5; heights[16] = 5;

  function say(t) { if (msg.textContent !== t) msg.textContent = t; }

  function addGrain(c) {
    // if the column is full, the grain rolls off to a neighbour
    for (var d = 0; d < COLS; d++) {
      var tries = [c - d, c + d];
      for (var k = 0; k < 2; k++) {
        var j = tries[k];
        if (j >= 0 && j < COLS && heights[j] < ROWS) { heights[j]++; moved[j] = 1; return; }
      }
    }
  }

  // one sweep across the row, in a random order. returns how many grains slid.
  function step() {
    var order = [], i, slid = 0, L = limit();
    for (i = 0; i < COLS; i++) { order.push(i); moved[i] = Math.max(0, moved[i] - 1); }
    for (i = COLS - 1; i > 0; i--) { var r = Math.floor(Math.random() * (i + 1)); var t = order[i]; order[i] = order[r]; order[r] = t; }
    for (var q = 0; q < COLS; q++) {
      i = order[q];
      var sides = Math.random() < .5 ? [-1, 1] : [1, -1];
      for (var s = 0; s < 2; s++) {
        var j = i + sides[s];
        if (j < 0 || j >= COLS) continue;
        if (heights[i] - heights[j] > L && heights[j] < ROWS) {
          heights[i]--; heights[j]++; moved[i] = 3; moved[j] = 3; slid++;
        }
      }
    }
    return slid;
  }

  function mood(slid) {
    var peak = 0, i;
    for (i = 0; i < COLS; i++) if (heights[i] > peak) peak = heights[i];
    if (slid > 0) say('Slump, slump. Grains are sliding sideways off the steep bits.');
    else if (peak <= 2) say('Flat as a sand bath. Tap the tray to drop snow.');
    else say('Settled. Every slope is gentle enough to stay put. Drop some more!');
  }

  function settleNow() {
    var n = 0, s;
    do { s = step(); n++; } while (s > 0 && n < 400);
    for (var i = 0; i < COLS; i++) moved[i] = 0;
  }

  function loop() {
    timer = 0;
    var s = step();
    draw(); mood(s);
    if (s > 0 || hasGlow()) timer = setTimeout(loop, 90);
  }
  function hasGlow() { for (var i = 0; i < COLS; i++) if (moved[i] > 0) return true; return false; }
  function kick() {
    if (reduce) { settleNow(); draw(); mood(0); return; }
    if (!timer) timer = setTimeout(loop, 90);
  }

  function colour(i, r) {
    // grains that just slid glow a warm cream so you can see where the snow went
    if (moved[i] > 0 && r === heights[i] - 1) return '#ffe2a1';
    return r === heights[i] - 1 ? '#ffffff' : (r % 2 ? '#e8f0fb' : '#dde8f7');
  }

  function draw() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var g = ctx.createLinearGradient(0, 0, 0, ROWS * CH);
    g.addColorStop(0, '#1f2a3d'); g.addColorStop(1, '#3a4d75');
    ctx.fillStyle = g; ctx.fillRect(0, 0, COLS * CW, ROWS * CH);
    var i, r;
    if (soft) {
      ctx.beginPath();
      ctx.moveTo(0, ROWS * CH);
      var px = 0, py = ROWS * CH - heights[0] * CH;
      ctx.lineTo(px, py);
      for (i = 1; i < COLS; i++) {
        var x = i * CW + CW / 2, y = ROWS * CH - heights[i] * CH;
        var mx = (px + x) / 2, my = (py + y) / 2;
        ctx.quadraticCurveTo(px, py, mx, my);
        px = x; py = y;
      }
      ctx.lineTo(COLS * CW, py); ctx.lineTo(COLS * CW, ROWS * CH); ctx.closePath();
      ctx.fillStyle = '#f4f8ff'; ctx.fill();
      ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 3; ctx.stroke();
    } else {
      for (i = 0; i < COLS; i++) {
        for (r = 0; r < heights[i]; r++) {
          ctx.fillStyle = colour(i, r);
          var gx = i * CW + 1, gy = (ROWS - 1 - r) * CH + 1;
          ctx.beginPath();
          if (ctx.roundRect) ctx.roundRect(gx, gy, CW - 2, CH - 2, 5); else ctx.rect(gx, gy, CW - 2, CH - 2);
          ctx.fill();
        }
      }
    }
    // little paw marker showing where the next snow lands
    ctx.fillStyle = 'rgba(255,226,161,.9)';
    ctx.beginPath();
    var cx = cursor * CW + CW / 2;
    ctx.moveTo(cx, 12); ctx.lineTo(cx - 7, 2); ctx.lineTo(cx + 7, 2); ctx.closePath(); ctx.fill();
  }

  function drop(c, n) {
    for (var k = 0; k < n; k++) addGrain(c);
    draw(); say('Snow dropped. Let me see if it stays.');
    kick();
  }
  function colAt(e) {
    var rect = cv.getBoundingClientRect();
    return Math.max(0, Math.min(COLS - 1, Math.floor((e.clientX - rect.left) / rect.width * COLS)));
  }

  cv.addEventListener('pointerdown', function (e) { cursor = colAt(e); drop(cursor, 6); });
  cv.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { cursor = Math.max(0, cursor - 1); draw(); e.preventDefault(); }
    else if (e.key === 'ArrowRight') { cursor = Math.min(COLS - 1, cursor + 1); draw(); e.preventDefault(); }
    else if (e.key === 'Enter' || e.key === ' ') { drop(cursor, 6); e.preventDefault(); }
  });

  function setSlip() {
    var v = limit();
    slipWord.textContent = WORDS[v];
    kick();
  }
  slider.addEventListener('input', setSlip);

  document.getElementById('heapBtn').addEventListener('click', function () {
    cursor = Math.floor(COLS / 2) + Math.floor(Math.random() * 7) - 3;
    // a big shovelful all on one spot, without waiting for it to slump between grains
    for (var k = 0; k < 40; k++) addGrain(cursor);
    draw(); say('Whump! A whole shovelful in one spot.');
    kick();
  });
  document.getElementById('stepBtn').addEventListener('click', function () {
    var s = step(); draw(); mood(s);
  });
  document.getElementById('flatBtn').addEventListener('click', function () {
    clearTimeout(timer); timer = 0; flat(); draw(); mood(0);
  });
  autoBox.addEventListener('change', function () {
    if (autoBox.checked) kick(); else { clearTimeout(timer); timer = 0; }
  });
  viewBtn.addEventListener('click', function () {
    soft = !soft;
    viewBtn.textContent = soft ? 'Show the grains' : 'Show it soft';
    draw();
  });

  // the manual/auto distinction: with "slump by itself" off, grains wait until you press the step button
  var origKick = kick;
  kick = function () { if (autoBox.checked) origKick(); };

  slipWord.textContent = WORDS[limit()];
  draw(); say('A little heap is standing there. Watch it slump.');
  kick();
})();
