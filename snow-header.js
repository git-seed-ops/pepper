// A snowy header: a night window, soft hills, and a few flakes that drift down inside it.
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
    '<div class="banner-title" aria-hidden="true"><span class="kicker">outside my window</span><strong>Snow is falling</strong></div>';

  var layer = host.querySelector('.banner-flakes');
  var count = 16;
  for (var i = 0; i < count; i++) {
    var wrap = document.createElement('span');
    wrap.className = 'bflake';
    var size = 10 + Math.random() * 16;
    wrap.style.left = (3 + Math.random() * 94) + '%';
    wrap.style.width = wrap.style.height = size.toFixed(0) + 'px';
    wrap.style.animationDuration = (7 + Math.random() * 7).toFixed(1) + 's';
    wrap.style.animationDelay = (-Math.random() * 14).toFixed(1) + 's';
    wrap.style.opacity = (0.55 + Math.random() * 0.4).toFixed(2);
    var inner = document.createElement('span');
    inner.className = 'bsway';
    inner.style.animationDuration = (2.5 + Math.random() * 3).toFixed(1) + 's';
    inner.style.animationDelay = (-Math.random() * 4).toFixed(1) + 's';
    var svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 100');
    var pool = (typeof FLAKES !== 'undefined' && FLAKES.length) ? FLAKES : null;
    if (pool) {
      var f = pool[Math.floor(Math.random() * pool.length)];
      svg.innerHTML = f.draw();
    } else {
      svg.innerHTML = '<circle cx="50" cy="50" r="12" fill="#fff"/>';
    }
    inner.appendChild(svg);
    wrap.appendChild(inner);
    layer.appendChild(wrap);
  }
})();
