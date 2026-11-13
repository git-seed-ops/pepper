// More flakes: needles and columns. Loaded after snow.js, adds to FLAKES and the gallery.
var STAR_NAMES = ['Hexagonal Plate', 'Stellar Plate', 'Stellar Dendrite', 'Twelve-Branched', 'Sectored Plate', 'Fernlike Dendrite'];
var MORE_FLAKES = [
  { name: 'Hollow Column', rod: true,
    note: 'A six-sided rod with a cone scooped out of each end, like a seed husk with the seed gone. Never fully hollow, though. There is always a solid bit in the middle.',
    draw: function () {
      return '<rect class="s" x="36" y="10" width="28" height="80" rx="2"/>' +
        '<path class="s" d="M42 10 L50 38 L58 10 M42 90 L50 62 L58 90"/>';
    } },
  { name: 'Crossed Needles', rod: true,
    note: 'Two needles that bumped in the air and stuck. Thin as whiskers, crossed like whiskers when I sniff something big.',
    draw: function () {
      var n = '<path class="s" d="M50 6 L50 94 M47.5 12 L50 6 L52.5 12 M47.5 88 L50 94 L52.5 88"/>';
      return rot(n, 0) + rot(n, 62);
    } },
  { name: 'Needle Bundle', rod: true,
    note: 'A little cluster of needles, like a pinch of straw. Needles are the longest of the rod kinds, a few mouse-whisker lengths.',
    draw: function () {
      var xs = [18, 30, 42, 50, 58, 70, 82], out = '';
      xs.forEach(function (x, i) {
        var top = 8 + Math.abs(x - 50) * 0.35 + (i % 2) * 6;
        out += '<path class="s" d="M50 92 L' + x + ' ' + top.toFixed(1) + '"/>';
      });
      return out;
    } },
  { name: 'Double Plate', rod: true,
    note: 'A capped column so short it is nearly all hats. Two tiles on a stub, like a seed sandwich.',
    draw: function () {
      return '<polygon class="s" points="18,24 82,24 72,38 28,38"/>' +
        '<polygon class="s" points="28,62 72,62 82,76 18,76"/>' +
        '<path class="s" d="M44 38 L44 62 M56 38 L56 62"/>';
    } },
  { name: 'Column With Needle Whiskers', rod: true,
    note: 'It started as a hollow column, then whisker-needles sprouted from its corners. I know the feeling. My whiskers grew in like that.',
    draw: function () {
      return '<rect class="s" x="39" y="32" width="22" height="36" rx="2"/>' +
        '<path class="s" d="M44 32 L50 46 L56 32 M44 68 L50 54 L56 68"/>' +
        '<path class="s" d="M39 32 L22 10 M61 32 L78 10 M39 68 L22 90 M61 68 L78 90 M50 32 L50 8 M50 68 L50 92"/>';
    } },
  { name: 'Fishbone Needle', rod: true,
    note: 'A needle that grew tiny side-spines, a fishbone made of snow. Fish would not be an unwelcome thing in my bowl.',
    draw: function () {
      var out = '<path class="s" d="M50 6 L50 94"/>';
      for (var y = 22; y <= 74; y += 13) {
        out += '<path class="s" d="M50 ' + y + ' L38 ' + (y - 10) + ' M50 ' + y + ' L62 ' + (y - 10) + '"/>';
      }
      return out;
    } },
  { name: 'Stout Column Cluster', rod: true,
    note: 'Short fat columns clumped together like cheeks full of seeds. Stout ones like to travel in groups.',
    draw: function () {
      var col = '<rect class="s" x="43" y="14" width="14" height="38" rx="2"/><path class="s" d="M50 14 L50 52"/>';
      return rot(col, 0) + rot(col, 120) + rot(col, 240) + '<circle class="s" cx="50" cy="50" r="3"/>';
    } }
];

(function () {
  FLAKES.forEach(function (f) { f.rod = STAR_NAMES.indexOf(f.name) === -1; });
  // Capped Column, Column, Needle and Bullet Rosette are rods; the stars above are not.
  var gal = document.getElementById('gallery');
  function card(f) {
    var d = document.createElement('div');
    d.className = 'card sand';
    d.setAttribute('data-rod', f.rod ? '1' : '0');
    d.innerHTML = '<svg viewBox="0 0 100 100" role="img" aria-label="' + f.name + '">' + f.draw() + '</svg>' +
      '<h3>' + f.name + '</h3><p>' + f.note + '</p>';
    return d;
  }
  MORE_FLAKES.forEach(function (f) { FLAKES.push(f); gal.appendChild(card(f)); });

  // tag the existing cards
  var cards = gal.children;
  for (var i = 0; i < cards.length; i++) {
    var nm = cards[i].querySelector('h3').textContent;
    if (!cards[i].hasAttribute('data-rod')) cards[i].setAttribute('data-rod', STAR_NAMES.indexOf(nm) === -1 ? '1' : '0');
  }

  var count = document.getElementById('flakeCount');
  if (count) count.textContent = FLAKES.length + ' kinds of flake';

  // filter buttons
  var bar = document.getElementById('filters');
  if (bar) {
    [['all', 'All of them'], ['star', 'Stars'], ['rod', 'Needles and columns']].forEach(function (p) {
      var b = document.createElement('button');
      b.textContent = p[1];
      b.addEventListener('click', function () {
        for (var j = 0; j < cards.length; j++) {
          var rod = cards[j].getAttribute('data-rod') === '1';
          cards[j].style.display = (p[0] === 'all' || (p[0] === 'rod') === rod) ? '' : 'none';
        }
        var msg = document.getElementById('filterMsg');
        if (msg) msg.textContent = p[0] === 'rod' ? 'Not every flake is a star. These are the rods, the sneaky ones.' :
          p[0] === 'star' ? 'Six arms, always six. I counted again.' : '';
      });
      bar.appendChild(b);
      bar.appendChild(document.createTextNode(' '));
    });
  }

  // extra pebble notes
  if (typeof NOTES !== 'undefined') {
    NOTES.push('A column is just a flake that grew long instead of wide.',
      'Hollow columns are never hollow all the way through. There is always a little solid middle, like a seed.',
      'Crossed needles are two needles that bumped in the sky. I understand. I bump into my wheel.');
  }
})();
