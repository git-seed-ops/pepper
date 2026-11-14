// A snowy header: a night window, soft hills, and flakes that drift down inside it.
// Each flake is two nested spans: the outer one falls (and is nudged along by a wind),
// the inner one sways. Every flake gets its own sway width, twist and wind-share.
(function () {
  var host = document.getElementById('snowBanner');
  if (!host) return;
  var NS = 'http://www.w3.org/2000/svg';
  host.innerHTML =
    '<svg class="banner-art" viewBox="0 0 800 220" preserveAspectRatio="xMidYMid slice" role="img" aria-label="A night window with snowy hills and snow drifting down">' +
    '<defs><linearGradient id="nightSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16203a"/><stop offset="1" stop-color="#3a4d75"/></linearGradient></defs>' +
    '<rect width="800" height="220" fill="url(#nightSky)"/>' +
    '<circle cx="660" cy="52" r="20" fill="#fff6dc" opacity=".92"/><circle cx="668" cy="47" r="18" fill="#243558"/>' +
    '<g fill="#fff" opacity=".7"><circle cx="90" cy="30" r="1.5"/><circle cx="210" cy="60" r="1.2"/><circle cx="330" cy="24" r="1.6"/><circle cx="470" cy="48" r="1.2"/><circle cx="560" cy="22" r="1.4"/><circle cx="740" cy="100" r="1.2"/></g>' +
    '<path d="M0 170 Q120 120 260 160 T520 150 T800 160 L800 220 L0 220Z" fill="#c9d7ea"/>' +
    '<path d="M0 195 Q160 150 320 188 T620 180 T800 190 L800 220 L0 220Z" fill="#f4f8ff"/>' +
    '</svg><div class="banner-flakes" aria-hidden="true"></div>' +
    '<div class="banner-title" aria-hidden="true"><span class="kicker">outside my window</span><strong>Snow is falling</strong></div>' +
    '<div class="banner-ctl"><button type="button" id="bPause" aria-pressed="false">Hush the snow</button>' +
    '<button type="button" id="bHard" aria-pressed="false">More snow</button></div>';

  var layer = host.querySelector('.banner-flakes');
  var pool = (typeof FLAKES !== 'undefined' && FLAKES.length) ? FLAKES : null;

  function rnd(a, b) { return a + Math.random() * (b - a); }

  // one breeze per sky: it picks a side, and near flakes are pushed further than far ones
  var wind = 0;

  function makeFlake(depth, fast) {
    // depth: 'far' (small, slow, dim), 'mid', or 'near' (big, quick, bright)
    var cfg = {
      far:  { size: [8, 13],  dur: [11, 16], op: [.35, .5],  amp: [4, 9],   tilt: [10, 30], push: .5 },
      mid:  { size: [13, 20], dur: [8, 12],  op: [.55, .75], amp: [8, 15],  tilt: [15, 35], push: 1 },
      near: { size: [20, 30], dur: [6, 9],   op: [.8, .95],  amp: [12, 22], tilt: [20, 45], push: 1.6 }
    }[depth];
    var k = fast ? 0.6 : 1;
    var wrap = document.createElement('span');
    wrap.className = 'bflake ' + depth;
    var size = rnd(cfg.size[0], cfg.size[1]);
    wrap.style.left = rnd(3, 94).toFixed(1) + '%';
    wrap.style.width = wrap.style.height = size.toFixed(0) + 'px';
    wrap.style.animationDuration = (rnd(cfg.dur[0], cfg.dur[1]) * k).toFixed(1) + 's';
    wrap.style.animationDelay = (-rnd(0, 14)).toFixed(1) + 's';
    wrap.style.setProperty('--o', rnd(cfg.op[0], cfg.op[1]).toFixed(2));
    wrap.style.setProperty('--wind', (wind * cfg.push * rnd(.6, 1.2)).toFixed(0) + 'px');
    var inner = document.createElement('span');
    inner.className = 'bsway';
    // sway width and twist are all different, and bigger flakes swing slower
    inner.style.setProperty('--amp', rnd(cfg.amp[0], cfg.amp[1]).toFixed(0) + 'px');
    inner.style.setProperty('--tilt', rnd(cfg.tilt[0], cfg.tilt[1]).toFixed(0) + 'deg');
    inner.style.animationDuration = rnd(2.5, 5.5).toFixed(1) + 's';
    inner.style.animationDelay = (-rnd(0, 4)).toFixed(1) + 's';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    if (pool) {
      svg.innerHTML = pool[Math.floor(Math.random() * pool.length)].draw();
    } else {
      svg.innerHTML = '<circle cx="50" cy="50" r="12" fill="#fff"/>';
    }
    inner.appendChild(svg);
    wrap.appendChild(inner);
    return wrap;
  }

  function build(heavy) {
    layer.innerHTML = '';
    wind = (Math.random() < .5 ? -1 : 1) * rnd(18, 40);
    var mix = heavy ? { far: 16, mid: 14, near: 8 } : { far: 6, mid: 7, near: 3 };
    ['far', 'mid', 'near'].forEach(function (d) {
      for (var i = 0; i < mix[d]; i++) layer.appendChild(makeFlake(d, heavy));
    });
  }

  var heavy = false;
  build(heavy);

  var pause = document.getElementById('bPause');
  var hard = document.getElementById('bHard');
  pause.addEventListener('click', function () {
    var on = !host.classList.contains('paused');
    host.classList.toggle('paused', on);
    pause.setAttribute('aria-pressed', on ? 'true' : 'false');
    pause.textContent = on ? 'Let it fall' : 'Hush the snow';
  });
  hard.addEventListener('click', function () {
    heavy = !heavy;
    build(heavy);
    hard.setAttribute('aria-pressed', heavy ? 'true' : 'false');
    hard.textContent = heavy ? 'Gentler snow' : 'More snow';
  });
})();
