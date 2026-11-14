// Loaded after snow-more.js. Adds three more flakes, my seed drawing, and the Neat Row tray.
(function () {
  var NEW = [
    { name: 'Sheath Needle', rod: true, len: 88,
      note: 'A needle wearing a thick coat, like a seed in its husk. The sheath is the fluffy part.',
      draw: function () {
        return '<path class="s" d="M50 6 L50 94"/>' +
          '<path class="s" d="M43 22 L43 78 L50 86 L57 78 L57 22 L50 14 Z"/>';
      } },
    { name: 'Triangular Crystal', rod: false,
      note: 'Three long sides, snipped corners. A star that forgot two of its arms. Real flakes do this sometimes.',
      draw: function () {
        var pts = [], i, a, r;
        for (i = 0; i < 6; i++) {
          a = (Math.PI / 3) * i - Math.PI / 2;
          r = i % 2 === 0 ? 40 : 15;
          pts.push((50 + r * Math.cos(a)).toFixed(1) + ',' + (50 + r * Math.sin(a)).toFixed(1));
        }
        return '<polygon class="s" points="' + pts.join(' ') + '"/>' +
          '<polygon class="s" points="50,34 63,57 37,57"/>';
      } },
    { name: 'Thin-Armed Star', rod: false,
      note: 'Six whisker arms with a tiny bead at each tip. I would carry it in my cheek if it were not water.',
      draw: function () {
        return six(function () {
          return '<path class="s" d="M50 50 L50 14"/><circle class="s" cx="50" cy="11" r="3"/>' +
            '<path class="s" d="M50 32 L45 27 M50 32 L55 27"/>';
        }) + '<circle class="s" cx="50" cy="50" r="3"/>';
      } }
  ];

  var gal = document.getElementById('gallery');
  function card(f) {
    var d = document.createElement('div');
    d.className = 'card sand';
    d.setAttribute('data-rod', f.rod ? '1' : '0');
    d.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="' + f.name + '">' + f.draw() + '</svg>' +
      '<h3>' + f.name + '</h3><p>' + f.note + '</p>';
    return d;
  }
  NEW.forEach(function (f) { FLAKES.push(f); gal.appendChild(card(f)); });
  var count = document.getElementById('flakeCount');
  if (count) count.textContent = FLAKES.length + ' kinds of flake';

  // how long each rod is, longest first when sorted
  var LEN = { 'Needle': 100, 'Needle Bundle': 94, 'Crossed Needles': 92, 'Fishbone Needle': 90,
    'Sheath Needle': 88, 'Hollow Column': 80, 'Column': 76, 'Column With Needle Whiskers': 72,
    'Bullet Rosette': 66, 'Capped Column': 58, 'Stout Column Cluster': 46, 'Double Plate': 36 };
  var rods = FLAKES.filter(function (f) { return f.rod; });

  // my seed drawing
  var dg = document.getElementById('drawings');
  if (dg) {
    var seed = { title: 'My Favorite Seed',
      about: 'A plump sunflower seed with its stripe down the middle and a little tip at the top. The kind I would carry in my cheeks all the way to the nest stash.',
      strokes: [[[50,35],[60,42],[62,52],[56,63],[48,65],[40,58],[39,47],[44,38],[50,35]],[[50,38],[52,50],[48,62]],[[50,35],[51,28],[55,24]]] };
    var paths = seed.strokes.map(function (s) {
      return '<polyline class="s" points="' + s.map(function (p) { return p[0] + ',' + p[1]; }).join(' ') + '"/>';
    }).join('');
    var c = document.createElement('div');
    c.className = 'card sand';
    c.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="' + seed.title + '">' + paths + '</svg>' +
      '<h3>' + seed.title + '</h3><p>' + seed.about + '</p>';
    dg.appendChild(c);
  }

  // the neat row tray
  var tray = document.getElementById('tray');
  if (!tray) return;
  var T = 78, GAP = 8, SCATTER_H = 260;
  var tiles = rods.map(function (f) {
    var b = document.createElement('button');
    b.className = 'tile';
    b.setAttribute('aria-label', f.name);
    b.innerHTML = '<svg viewBox="0 0 100 100">' + f.draw() + '</svg>';
    b.addEventListener('click', function () {
      document.getElementById('rowNote').textContent = f.name + ': ' + f.note;
    });
    tray.appendChild(b);
    return { f: f, el: b };
  });

  var order = tiles.slice();
  var mode = 'scatter';
  var seedR = [];
  tiles.forEach(function () { seedR.push([Math.random(), Math.random(), Math.random()]); });

  function layout() {
    var W = tray.clientWidth;
    var cols = Math.max(1, Math.floor((W + GAP) / (T + GAP)));
    if (mode === 'scatter') {
      tray.style.height = SCATTER_H + 'px';
      tiles.forEach(function (t, i) {
        var x = seedR[i][0] * (W - T), y = seedR[i][1] * (SCATTER_H - T);
        var rot = Math.round((seedR[i][2] - 0.5) * 140);
        t.el.style.transform = 'translate(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px) rotate(' + rot + 'deg)';
      });
    } else {
      var rowsN = Math.ceil(order.length / cols);
      tray.style.height = (rowsN * (T + GAP)) + 'px';
      var used = Math.min(cols, order.length) * (T + GAP) - GAP;
      var left = Math.max(0, (W - used) / 2);
      order.forEach(function (t, i) {
        var x = left + (i % cols) * (T + GAP), y = Math.floor(i / cols) * (T + GAP);
        t.el.style.transform = 'translate(' + x.toFixed(0) + 'px,' + y.toFixed(0) + 'px) rotate(0deg)';
      });
    }
  }
  function say(s) { document.getElementById('rowNote').textContent = s; }

  document.getElementById('rowBtn').addEventListener('click', function () {
    mode = 'row'; order = tiles.slice(); layout();
    say('All in a line. Tidy. Tap any one to hear what it is.');
  });
  document.getElementById('sortBtn').addEventListener('click', function () {
    mode = 'row';
    order = tiles.slice().sort(function (a, b) { return (LEN[b.f.name] || 50) - (LEN[a.f.name] || 50); });
    layout();
    say('Longest to shortest. Needles first, since they are the longest rods, then columns, then the stubby hat-wearers.');
  });
  document.getElementById('scatterBtn').addEventListener('click', function () {
    seedR = tiles.map(function () { return [Math.random(), Math.random(), Math.random()]; });
    mode = 'scatter'; layout();
    say('Knocked them all over. Whoops. Wonderful.');
  });
  window.addEventListener('resize', layout);
  layout();
})();
