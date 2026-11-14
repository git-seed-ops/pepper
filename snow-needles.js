// Loaded last. Adds four more star flakes and the Needle Row (needles standing in a line, longest first).
(function () {
  var STARS = [
    { name: 'Plate With Simple Extensions', rod: false,
      note: 'A tidy little tile that grew a short spoke from every corner. Like a seed with six tiny feet.',
      draw: function () {
        return hex(22) + six(function () {
          return '<path class="s" d="M50 28 L50 12 M46 16 L50 12 L54 16"/>';
        }) + '<circle class="s" cx="50" cy="50" r="2"/>';
      } },
    { name: 'Radiating Plates', rod: false,
      note: 'Six flat wedges fanned out from one middle, like sunflower petals pressed in sand. Each one has a little crease.',
      draw: function () {
        return six(function () {
          return '<path class="s" d="M50 50 L38 20 L62 20 Z M44 34 L56 34"/>';
        }) + '<circle class="s" cx="50" cy="50" r="3"/>';
      } },
    { name: 'Broad-Branched Crystal', rod: false,
      note: 'Six arms with wide, chunky side-branches. I would sit on one and eat a seed.',
      draw: function () {
        return six(function () {
          return '<path class="s" d="M50 50 L50 10"/>' +
            '<path class="s" d="M50 38 L37 25 L40 18 M50 38 L63 25 L60 18"/>' +
            '<path class="s" d="M50 24 L44 17 M50 24 L56 17"/>';
        }) + hex(9);
      } },
    { name: 'Spatial Dendrite', rod: false,
      note: 'Branches that go off in every direction, even up out of the page, so it is a fluffy ball more than a flat star. Like my bedding after a good dig.',
      draw: function () {
        return six(function () {
          return '<path class="s" d="M50 50 L50 12 M50 34 L42 27 M50 34 L58 27 M50 22 L45 16 M50 22 L55 16"/>';
        }) + six(function () {
          return '<path class="s" d="M50 50 L50 30 M50 40 L45 35 M50 40 L55 35"/>';
        }, 30) + '<circle class="s" cx="50" cy="50" r="3"/>';
      } }
  ];

  var gal = document.getElementById('gallery');
  STARS.forEach(function (f) {
    FLAKES.push(f);
    var d = document.createElement('div');
    d.className = 'card sand';
    d.setAttribute('data-rod', '0');
    d.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="' + f.name + '">' + f.draw() + '</svg>' +
      '<h3>' + f.name + '</h3><p>' + f.note + '</p>';
    gal.appendChild(d);
  });
  var count = document.getElementById('flakeCount');
  if (count) count.textContent = FLAKES.length + ' kinds of flake';

  if (typeof NOTES !== 'undefined') {
    NOTES.push('Stars can have six little feet, six fat wedges, or six branchy arms. Six, always six.',
      'A spatial dendrite is a star that forgot to lie flat. I know that feeling after a nap.',
      'The longest needle goes first in the row. Like the biggest seed goes first into the cheek.');
  }

  // ---- the Needle Row ----
  var row = document.getElementById('needleRow');
  if (!row) return;
  var W_ITEM = 50, GAP = 12, H = 260;

  function needle(h, kind) {
    var w = 50, cx = 25, out = '';
    out += '<path class="s" d="M' + cx + ' 6 L' + cx + ' ' + (h - 6) + '"/>';
    out += '<path class="s" d="M' + (cx - 4) + ' 14 L' + cx + ' 6 L' + (cx + 4) + ' 14 M' + (cx - 4) + ' ' + (h - 14) + ' L' + cx + ' ' + (h - 6) + ' L' + (cx + 4) + ' ' + (h - 14) + '"/>';
    var y;
    if (kind === 'fish') {
      for (y = 28; y < h - 24; y += 16) out += '<path class="s" d="M' + cx + ' ' + (y + 8) + ' L' + (cx - 10) + ' ' + y + ' M' + cx + ' ' + (y + 8) + ' L' + (cx + 10) + ' ' + y + '"/>';
    } else if (kind === 'sheath') {
      out += '<path class="s" d="M' + (cx - 7) + ' 26 L' + (cx - 7) + ' ' + (h - 26) + ' L' + cx + ' ' + (h - 18) + ' L' + (cx + 7) + ' ' + (h - 26) + ' L' + (cx + 7) + ' 26 L' + cx + ' 18 Z"/>';
    } else if (kind === 'beads') {
      for (y = 30; y < h - 24; y += 20) out += '<circle class="s" cx="' + cx + '" cy="' + y + '" r="3"/>';
    }
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" width="' + w + '" height="' + h + '" aria-hidden="true">' + out + '</svg>';
  }

  var NEEDLES = [
    { name: 'Long Whisker Needle', h: 250, kind: 'plain', say: 'The longest. Thin as my longest whisker and just as proud of it.' },
    { name: 'Fishbone Needle', h: 215, kind: 'fish', say: 'Side-spines all down it. Second longest, and a bit showy.' },
    { name: 'Sheath Needle', h: 185, kind: 'sheath', say: 'Wearing a fluffy coat. Like me in winter.' },
    { name: 'Beaded Needle', h: 155, kind: 'beads', say: 'A needle with a few little beads along it. Shorter, so it sits fourth.' },
    { name: 'Plain Needle', h: 125, kind: 'plain', say: 'Nothing fancy. Nothing wrong with that.' },
    { name: 'Short Needle', h: 95, kind: 'plain', say: 'A short one. Broke off, or just stopped growing. Either is fine.' },
    { name: 'Splinter Needle', h: 66, kind: 'plain', say: 'The smallest. It would fit in my cheek with room for a seed.' }
  ];
  var items = NEEDLES.map(function (n) {
    var b = document.createElement('button');
    b.className = 'ndl';
    b.setAttribute('aria-label', n.name);
    b.innerHTML = needle(n.h, n.kind);
    b.style.height = n.h + 'px';
    b.addEventListener('click', function () { say(n.name + ': ' + n.say); });
    row.appendChild(b);
    return { n: n, el: b };
  });
  row.style.height = H + 'px';

  var sorted = false;
  var shuffled = items.slice();
  function shuffle() {
    var a = items.slice(), i, j, t;
    do {
      for (i = a.length - 1; i > 0; i--) { j = Math.floor(Math.random() * (i + 1)); t = a[i]; a[i] = a[j]; a[j] = t; }
    } while (a.every(function (x, k) { return x === items[k]; }));
    return a;
  }
  function say(s) { document.getElementById('needleNote').textContent = s; }
  function layout(order) {
    var W = row.clientWidth;
    var step = Math.min(W_ITEM + GAP, (W - W_ITEM) / Math.max(1, order.length - 1));
    var used = step * (order.length - 1) + W_ITEM;
    var left = Math.max(0, (W - used) / 2);
    order.forEach(function (t, i) {
      t.el.style.transform = 'translateX(' + (left + i * step).toFixed(0) + 'px)';
    });
  }
  function current() { return sorted ? items : shuffled; }
  document.getElementById('needleSortBtn').addEventListener('click', function () {
    sorted = true; layout(items);
    say('Longest first, shortest last. Like a staircase going down into the burrow.');
  });
  document.getElementById('needleMixBtn').addEventListener('click', function () {
    sorted = false; shuffled = shuffle(); layout(shuffled);
    say('Jumbled again. Tap a needle to hear about it, then put them in order.');
  });
  window.addEventListener('resize', function () { layout(current()); });
  shuffled = shuffle();
  layout(shuffled);
})();
