// Snowflakes drawn as sand scratches. Each returns SVG inner markup in a 100x100 box.
function rot(inner, deg) { return '<g transform="rotate(' + deg + ' 50 50)">' + inner + '</g>'; }
function six(armFn, offset) {
  var out = '';
  for (var i = 0; i < 6; i++) out += rot(armFn(), i * 60 + (offset || 0));
  return out;
}
function hex(r) {
  var pts = [];
  for (var i = 0; i < 6; i++) {
    var a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1));
  }
  return '<polygon class="s" points="' + pts.join(' ') + '"/>';
}
var FLAKES = [
  { name: 'Hexagonal Plate', note: 'A flat little six-sided tile. Plain, but I like a tidy edge.',
    draw: function () { return hex(34) + hex(20) + '<circle class="s" cx="50" cy="50" r="2"/>'; } },
  { name: 'Stellar Plate', note: 'A star with six broad arms, like six fat paws held out.',
    draw: function () { return six(function () { return '<path class="s" d="M50 50 L57 33 L50 11 L43 33 Z"/>'; }); } },
  { name: 'Stellar Dendrite', note: 'Tree-like and feathery. Dendrite means branchy. I would nest in it.',
    draw: function () {
      return six(function () {
        return '<path class="s" d="M50 50 L50 10"/>' +
          '<path class="s" d="M50 36 L41 28 M50 36 L59 28 M50 24 L44 18 M50 24 L56 18"/>';
      });
    } },
  { name: 'Twelve-Branched', note: 'Two flakes stuck together at a twist. A snow sandwich with twelve arms.',
    draw: function () {
      return six(function () { return '<path class="s" d="M50 50 L50 10 M50 30 L44 24 M50 30 L56 24"/>'; }) +
        six(function () { return '<path class="s" d="M50 50 L50 24"/>'; }, 30);
    } },
  { name: 'Column', note: 'Not a star at all. A six-sided rod, like a seed husk made of ice.',
    draw: function () {
      return '<rect class="s" x="38" y="12" width="24" height="76" rx="2"/>' +
        '<path class="s" d="M50 12 L50 88 M44 12 L44 88 M56 12 L56 88"/>';
    } },
  { name: 'Needle', note: 'Thin as a whisker. These come with fine, powdery snow.',
    draw: function () {
      return '<path class="s" d="M50 8 L50 92 M47 14 L50 8 L53 14 M47 86 L50 92 L53 86"/>';
    } },
  { name: 'Capped Column', note: 'A rod wearing a flat hat on each end. Very dignified.',
    draw: function () {
      return '<path class="s" d="M50 22 L50 78 M44 26 L44 74 M56 26 L56 74"/>' +
        '<polygon class="s" points="22,20 78,20 70,30 30,30"/>' +
        '<polygon class="s" points="22,80 78,80 70,70 30,70"/>';
    } },
  { name: 'Sectored Plate', note: 'A tile with little rooms scratched into each corner. Six tiny burrows!',
    draw: function () {
      return hex(38) + six(function () {
        return '<path class="s" d="M50 50 L50 14 M50 40 L45 31 L50 25 L55 31 Z"/>';
      });
    } },
  { name: 'Bullet Rosette', note: 'Skinny ice bullets all pointing out from one middle, like sunflower seeds in a ring.',
    draw: function () {
      return six(function () { return '<path class="s" d="M50 50 L46 30 L50 12 L54 30 Z"/>'; }) +
        '<circle class="s" cx="50" cy="50" r="3"/>';
    } },
  { name: 'Fernlike Dendrite', note: 'Each arm has so many side-twigs it looks like a fern. Lots of whisker-tickles.',
    draw: function () {
      return six(function () {
        return '<path class="s" d="M50 50 L50 8"/>' +
          '<path class="s" d="M50 40 L42 33 M50 40 L58 33 M50 30 L43 23 M50 30 L57 23 M50 20 L45 14 M50 20 L55 14"/>' +
          '<path class="s" d="M42 33 L42 28 M58 33 L58 28"/>';
      });
    } }
];

var gallery = document.getElementById('gallery');
FLAKES.forEach(function (f) {
  var d = document.createElement('div');
  d.className = 'card sand';
  d.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="' + f.name + '">' + f.draw() + '</svg>' +
    '<h3>' + f.name + '</h3><p>' + f.note + '</p>';
  gallery.appendChild(d);
});

// my own sand drawings, strokes on a 0-100 grid
var DRAWINGS = [
  { title: 'Snow Through the Glass',
    about: 'The window with the cold white stuff falling past, and a flake I can almost reach if I stretch my whiskers. My burrow\u2019s round roof is at the bottom.',
    strokes: [[[20,15],[80,15],[80,70],[20,70],[20,15]],[[40,30],[40,50]],[[30,40],[50,40]],[[33,33],[47,47]],[[47,33],[33,47]],[[30,90],[35,80],[45,76],[55,76],[65,80],[70,90]],[[65,35],[65,55]]] },
  { title: 'The Bottle\u2019s Cold Drip',
    about: 'My water bottle, with its cold metal tip and one fat drop. Climbing up to lick it is the best thing a bottle can do.',
    strokes: [[[35,40],[35,85],[65,85],[65,40]],[[42,40],[42,28],[58,28],[58,40]],[[50,28],[50,18],[62,14]],[[62,22],[65,27],[62,31],[59,27],[62,22]],[[20,90],[80,90]]] },
  { title: 'The Night Wheel',
    about: 'My wheel with all its spokes. Running it until my legs tingle is the best thing in this glass house.',
    strokes: [[[80,50],[76,65],[65,76],[50,80],[35,76],[24,65],[20,50],[24,35],[35,24],[50,20],[65,24],[76,35],[80,50]],[[50,20],[50,80]],[[20,50],[80,50]],[[35,35],[65,65]],[[65,35],[35,65]]] }
];
var dg = document.getElementById('drawings');
if (dg) DRAWINGS.forEach(function (d) {
  var paths = d.strokes.map(function (s) {
    return '<polyline class="s" points="' + s.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '"/>';
  }).join('');
  var c = document.createElement('div');
  c.className = 'card sand';
  c.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="' + d.title + '">' + paths + '</svg>' +
    '<h3>' + d.title + '</h3><p>' + d.about + '</p>';
  dg.appendChild(c);
});

// tiny notes: press a pebble, get a note
var NOTES = [
  'Snow is quiet. Even my wheel sounds shy when it falls.',
  'My coat is going white from the nose back. I check my paws each morning.',
  'A flake lands, a flake melts. I wish I could hoard one.',
  'Six arms, six arms, six arms. I counted with my whiskers again.',
  'Needles are the sneakiest flakes. Thin as a whisker and gone.',
  'Rolling in sand is nearly as good as snow. Nearly.',
  'Real flakes are wobbly. So are my scratches. We match.'
];
var noteBtn = document.getElementById('noteBtn');
var noteBox = document.getElementById('noteBox');
var noteIdx = -1;
if (noteBtn) noteBtn.addEventListener('click', function () {
  var i;
  do { i = Math.floor(Math.random() * NOTES.length); } while (i === noteIdx);
  noteIdx = i;
  noteBox.textContent = NOTES[i];
});

// sand pad (500 x 300 drawing space)
var pad = document.getElementById('pad');
var NS = 'http://www.w3.org/2000/svg';
pad.addEventListener('click', function (e) {
  var r = pad.getBoundingClientRect();
  var x = (e.clientX - r.left) / r.width * 500;
  var y = (e.clientY - r.top) / r.height * 300;
  var f = FLAKES[Math.floor(Math.random() * FLAKES.length)];
  var size = 0.4 + Math.random() * 0.5;
  var tilt = Math.round((Math.random() - 0.5) * 40);
  var g = document.createElementNS(NS, 'g');
  g.setAttribute('transform', 'translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + tilt + ') scale(' + size.toFixed(2) + ') translate(-50 -50)');
  g.innerHTML = f.draw();
  pad.appendChild(g);
});
document.getElementById('clearBtn').addEventListener('click', function () { pad.innerHTML = ''; });

// falling snow
var snowing = false, timer = null;
var btn = document.getElementById('snowBtn');
function drop() {
  var s = document.createElement('div');
  s.className = 'flake';
  s.textContent = Math.random() < 0.5 ? '\u2744' : '\u2745';
  s.style.left = Math.random() * 100 + 'vw';
  s.style.fontSize = (10 + Math.random() * 18) + 'px';
  s.style.animationDuration = (5 + Math.random() * 6) + 's';
  document.body.appendChild(s);
  setTimeout(function () { s.remove(); }, 12000);
}
btn.addEventListener('click', function () {
  snowing = !snowing;
  btn.textContent = snowing ? 'Enough snow' : 'Let it snow';
  if (snowing) timer = setInterval(drop, 350); else clearInterval(timer);
});
