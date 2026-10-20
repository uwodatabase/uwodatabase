// ============================================================
//  SIDEBAR MENU - edit the lists below and EVERY page updates.
//  Each word links to its own page: pages/<box-name>/<word-in-lowercase>.html
//  Example: Trade Goods > "Precious Metals"  ->  pages/trade-goods/precious-metals.html
//  Add  folder: 'name'  to a box to use a different folder name.
// ============================================================
var MENU = [
  {
    id: 'event-box', title: 'Event', img: 'images/event-bar.png',
    link: 'pages/event.html',        // direct link: no box, goes straight to this page
    items: []
  },
  {
    id: 'world-box', title: 'World', img: 'images/world-bar.png',
    items: ['Ports', 'Lands', 'Seas', 'Port Permit']
  },
  {
    id: 'quests-box', title: 'Quests', img: 'images/quests-bar.png',
    items: ['Adventure', 'Trade', 'Battle']
  },
  {
    id: 'skills-box', title: 'Skills', img: 'images/skills.png',
    items: [
      'Adventure', 'Trade', 'Battle', 'Languages',
      'University', 'Academic Association', 'Optional Ship', 'Original Ship', 'Aide'
    ]
  },
  {
    id: 'trade-box', title: 'Trade Goods', img: 'images/trade-goods-bar.png',
    items: [
      'Foodstuffs', 'Seasonings', 'Livestock', 'Medicine', 'Sundries',
      'Alcohol', 'Dyes', 'Ores', 'Wares', 'Luxury Goods',
      'Fibres', 'Fabrics', 'Arms', 'Firearms', 'Crafts', 'Artwork',
      'Spices', 'Precious Metals', 'Fragrances', 'Precious Stones'
    ]
  },
  {
    id: 'nanban-box', title: 'Nanban', img: 'images/nanban-bar.png',
    items: []
  },
  {
    id: 'rtg-box', title: 'RTG', img: 'images/rtg-bar.png',
    link: 'pages/rtg.html',          // direct link: no box, goes straight to this page
    items: []
  },
  {
    id: 'jobs-box', title: 'Jobs', img: 'images/jobs-bar.png',
    items: ['Adventure', 'Trade', 'Battle']
  },
  {
    id: 'aides-box', title: 'Aides', img: 'images/aides-bar.png',
    link: 'pages/aides.html',        // direct link: no box, goes straight to this page
    items: []
  },
  {
    id: 'equipments-box', title: 'Equipments', img: 'images/equipments-bar.png',
    items: []
  },
  {
    id: 'items-box', title: 'Items', img: 'images/items-bar.png',
    items: []
  },
  {
    id: 'ships-box', title: 'Ships', img: 'images/ships-bar.png',
    items: ['Adventure', 'Trade', 'Battle', 'Ship Parts', 'SF Parts', 'Decorations']
  }
];

(function () {
  // Pages inside the "pages" folder set data-root="../" so images and links are found
  var root = document.body.getAttribute('data-root') || '';

  // ----- Blinking caret: alternates your two images (chat-bar.png / chat-bar2.png) while a search box is focused -----
  function attachCaret(inp) {
    var host = inp.parentNode;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    var c = document.createElement('div'); c.className = 'caret-blink'; c.style.display = 'none';
    host.appendChild(c);
    var cv = document.createElement('canvas').getContext('2d'), timer = null, on = 0;
    function place() {
      var cs = getComputedStyle(inp);
      cv.font = cs.fontWeight + ' ' + cs.fontSize + ' ' + cs.fontFamily;
      var pos = inp.selectionStart == null ? inp.value.length : inp.selectionStart;
      var x = parseFloat(cs.paddingLeft) + cv.measureText(inp.value.substring(0, pos)).width - inp.scrollLeft;
      x = Math.max(parseFloat(cs.paddingLeft), Math.min(x, inp.clientWidth - 4));
      c.style.left = (inp.offsetLeft + x) + 'px';
      c.style.top = (inp.offsetTop + Math.round((inp.offsetHeight - 16) / 2)) + 'px';
    }
    function frame() { c.style.backgroundImage = 'url("' + root + 'images/' + (on ? 'chat-bar2.png' : 'chat-bar.png') + '")'; }
    function start() { place(); on = 0; frame(); c.style.display = 'block'; clearInterval(timer); timer = setInterval(function () { on = 1 - on; frame(); }, 500); }
    function stop() { clearInterval(timer); c.style.display = 'none'; }
    function move() { if (document.activeElement === inp) { place(); on = 0; frame(); } }
    inp.addEventListener('focus', start); inp.addEventListener('blur', stop);
    ['input', 'keyup', 'keydown', 'click', 'select', 'scroll'].forEach(function (ev) { inp.addEventListener(ev, function () { setTimeout(move, 0); }); });
    if (document.activeElement === inp) start();
  }
  window.attachCaret = attachCaret;                           // also used by the SF Parts > Panels search box

  function slug(word) {
    return word.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  // ----- build the sidebar -----
  var html = '<div class="search-wrap">\n' +
             '<input type="text" id="search-input" aria-label="Search" autocomplete="off">\n' +
             '<div class="search-msg" id="search-msg" role="alert"></div>\n' +
             '<button type="button" id="search-btn">Begin Search</button>\n' +
             '<div class="search-results" id="search-results"></div>\n' +
             '</div>\n';
  MENU.forEach(function (group) {
    var img = '<img src="' + root + group.img + '" alt="' + group.title + '">';
    if (group.link) {
      // direct-link button: no box, opens the page right away
      html += '<a class="menu-img" href="' + root + group.link + '">' + img + '</a>\n';
      return;
    }
    html += '<a class="menu-img" href="#" data-toggle="' + group.id + '" aria-expanded="false">' + img + '</a>\n';
    html += '<div class="menu-box" id="' + group.id + '"><div class="menu-box-inner"><div class="menu-box-content">\n';
    group.items.forEach(function (word) {
      html += '<a href="' + root + 'pages/' + slug(group.folder || group.title) + '/' + slug(word) + '.html">' + word + '</a>\n';
    });
    html += '</div></div></div>\n';
  });
  document.getElementById('sidebar').innerHTML = html;

  // ----- SEARCH: needs at least 3 characters, shows only pages -----
  var MIN_CHARS = 3;                       // <-- change this number to require more/less characters
  var input   = document.getElementById('search-input');
  var btn     = document.getElementById('search-btn');
  var msg     = document.getElementById('search-msg');
  var results = document.getElementById('search-results');
  var wrap    = input.parentNode;
  attachCaret(input);

  // every page in the menu (name + link)
  var PAGES = [];
  MENU.forEach(function (group) {
    var f = slug(group.folder || group.title);
    group.items.forEach(function (word) { PAGES.push({ title: word, group: group.title, path: f + '/' + slug(word) }); });
  });

  // lower case + no accents, so "Café" matches "cafe"
  function norm(s) { return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''); }

  // the item names inside each page live in search-index.js (loaded the first time you search)
  function loadIndex(done) {
    if (window.SEARCH_INDEX) { done(); return; }
    var sc = document.createElement('script');
    sc.src = root + 'search-index.js';
    sc.onload = done;
    sc.onerror = function () { window.SEARCH_INDEX = {}; done(); };   // no index: still finds page names
    document.head.appendChild(sc);
  }

  function showError(text) {
    msg.textContent = text;
    msg.classList.add('show');
    input.classList.remove('shake');
    void input.offsetWidth;                // restarts the shake animation
    input.classList.add('error', 'shake');
    hideResults();
  }
  function clearError() {
    msg.classList.remove('show');
    input.classList.remove('error', 'shake');
  }
  function hideResults() {
    results.classList.remove('open');
    results.innerHTML = '';
    wrap.style.paddingBottom = '0px';          // menu slides back up
  }

  // Place the result list under the button. The menu below only moves down
  // if the list would cover it, and only by the amount that is needed.
  function placeResults() {
    var gap = parseFloat(getComputedStyle(btn).marginBottom) || 0;   // free space between the button and the menu
    var top = btn.offsetTop + btn.offsetHeight + 6;
    results.style.top = top + 'px';
    var overlap = top + results.offsetHeight + 6 - (btn.offsetTop + btn.offsetHeight + gap);
    wrap.style.paddingBottom = Math.max(0, Math.ceil(overlap)) + 'px';
  }

  function runSearch() {
    var query = input.value.trim();
    if (query.replace(/\s+/g, '').length < MIN_CHARS) {
      showError('Write at least ' + MIN_CHARS + ' characters to search.');
      return;
    }
    clearError();
    loadIndex(function () {
      var words = norm(query).split(/\s+/).filter(Boolean);
      function hasAll(text) {
        text = norm(text);
        return words.every(function (w) { return text.indexOf(w) !== -1; });
      }
      var byName = [], byItem = [];
      PAGES.forEach(function (page) {
        if (hasAll(page.title)) { byName.push(page); return; }
        var items = window.SEARCH_INDEX[page.path] || [];
        if (items.some(hasAll)) byItem.push(page);
      });
      var found = byName.concat(byItem);        // pages whose name matches come first

      results.innerHTML = '';
      if (!found.length) {
        var none = document.createElement('div');
        none.className = 'search-none';
        none.textContent = 'No pages found.';
        results.appendChild(none);
      } else {
        found.forEach(function (page) {
          var a = document.createElement('a');
          a.href = root + 'pages/' + page.path + '.html';
          a.textContent = page.title + ' (' + page.group + ')';
          results.appendChild(a);
        });
      }
      results.classList.add('open');
      placeResults();
    });
  }

  btn.addEventListener('click', runSearch);
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); runSearch(); }
    if (e.key === 'Escape') { hideResults(); clearError(); }
  });
  input.addEventListener('input', function () {
    if (input.value.replace(/\s+/g, '').length >= MIN_CHARS) clearError();   // red warning disappears once it is long enough
    if (!input.value.trim()) { hideResults(); clearError(); }
  });
  // click anywhere else closes the result list
  document.addEventListener('click', function (e) {
    if (!e.target.closest || !e.target.closest('.search-wrap')) hideResults();
  });

  // ----- open/close animation -----
  document.querySelectorAll('[data-toggle]').forEach(function (link) {
    var box = document.getElementById(link.dataset.toggle);

    // After opening, let the height adjust by itself (so it fits any text you add)
    box.addEventListener('transitionend', function (e) {
      if (e.target === box && e.propertyName === 'height' && box.classList.contains('open')) {
        box.style.height = 'auto';
      }
    });

    link.addEventListener('click', function (e) {
      e.preventDefault();
      // Same visual speed for every box: taller boxes take a little longer (0.6 px per ms, between 350 and 800 ms)
      var ms = Math.min(800, Math.max(350, box.scrollHeight / 0.6));
      box.style.setProperty('--dur', ms + 'ms');
      if (!box.classList.contains('open')) {
        // OPEN: slide from 0 to the real height
        box.classList.add('open');
        box.style.height = box.scrollHeight + 'px';
        link.setAttribute('aria-expanded', 'true');
      } else {
        // CLOSE: start from the real height, then slide to 0
        box.style.height = box.scrollHeight + 'px';
        box.offsetHeight;               // forces the browser to register the start height
        box.classList.remove('open');
        box.style.height = '0px';
        link.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // ----- on an information page, keep the box that contains it already open -----
  var current = document.body.getAttribute('data-page') || decodeURIComponent(location.pathname).split('/pages/').pop();   // a skill page counts as part of its category
  document.querySelectorAll('.menu-box').forEach(function (box) {
    var here = Array.prototype.some.call(box.querySelectorAll('a'), function (a) {
      return current !== '' && a.getAttribute('href').split('pages/').pop() === current;
    });
    if (here) {
      box.style.setProperty('--dur', '0s');
      box.classList.add('open');
      box.style.height = 'auto';
      document.querySelector('[data-toggle="' + box.id + '"]').setAttribute('aria-expanded', 'true');
    }
  });

  // ----- clicking spam-proof: a page link only works once, and the page you are on does nothing -----
  var navigating = false;
  document.addEventListener('click', function (e) {
    var a = e.target.closest ? e.target.closest('a[href]') : null;
    if (!a || a.hasAttribute('data-toggle') || a.getAttribute('href') === '#') return;
    var sameFile = new URL(a.href).pathname === location.pathname;
    if (navigating || sameFile) { e.preventDefault(); return; }
    navigating = true;
  });
  // coming back with the browser's Back button: allow clicking again
  window.addEventListener('pageshow', function () { navigating = false; });

  // ----- Location button on skill pages: press to show the panel on the right, press again to hide it -----
  var locBtn = document.querySelector('.rq-location');
  var locPanel = document.getElementById('loc-panel');
  if (locBtn && locPanel) {
    locBtn.setAttribute('aria-expanded', 'false');
    locBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var isOpen = locPanel.classList.toggle('open');
      locBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ----- Ships pages: Ship Parts button and round ship button each open their own panel; opening one hides the other -----
  var shPairs = [['.sh-parts-btn', 'loc-panel'], ['.sh-ship-btn', 'ship-panel']];
  var SH_DELAY = 450;                    // <-- ms to wait for the first panel to close (same as the .45s animation in style.css)
  var shBusy = false;
  function shSet(pair, open) {
    document.getElementById(pair[1]).classList.toggle('open', open);
    document.querySelector(pair[0]).setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  shPairs.forEach(function (pair) {
    var b = document.querySelector(pair[0]);
    if (!b) return;
    b.setAttribute('aria-expanded', 'false');
    b.addEventListener('click', function (e) {
      e.preventDefault();
      if (shBusy) return;
      var isOpen = document.getElementById(pair[1]).classList.contains('open');
      if (isOpen) { shSet(pair, false); return; }
      var other = shPairs.filter(function (o) { return o !== pair && document.getElementById(o[1]).classList.contains('open'); })[0];
      if (!other) { shSet(pair, true); return; }
      shBusy = true;                       // close the other panel first, then open this one
      shSet(other, false);
      setTimeout(function () { shSet(pair, true); shBusy = false; }, SH_DELAY);
    });
  });

  // ----- Ship Parts page: each option opens its own panel on the right; one at a time (same 450 ms wipe as the Ships pages) -----
  var spLinks = document.querySelectorAll('a[data-sp]');
  if (spLinks.length) {
    var spBusy = false;
    var spSet = function (key, open) {
      document.getElementById('sp-' + key).classList.toggle('open', open);
      var l = document.querySelector('a[data-sp="' + key + '"]');
      l.classList.toggle('sel', open); l.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    Array.prototype.forEach.call(spLinks, function (l) {
      l.setAttribute('aria-expanded', 'false');
      l.addEventListener('click', function (e) {
        e.preventDefault();
        if (spBusy) return;
        var key = l.getAttribute('data-sp');
        var cur = document.querySelector('.pnl-sp.open');
        var curKey = cur ? cur.id.slice(3) : null;
        if (curKey === key) { spSet(key, false); return; }
        if (!curKey) { spSet(key, true); return; }
        spBusy = true; spSet(curKey, false);
        setTimeout(function () { spSet(key, true); spBusy = false; }, SH_DELAY);
      });
    });
  }

  // ----- Ships list: in-game scroll bar (fixed-size thumb, arrow buttons, smooth wheel) -----
  var shList = document.querySelector('.sh-items');
  if (shList) {
    var SMOOTH = 0.18;                 // wheel easing: 0.1 = very soft, 0.3 = quick
    var ROW = 56;                      // pixels moved by one arrow click (one ship row)
    var wrapEl = document.createElement('div');
    wrapEl.className = 'sh-scroll';
    shList.parentNode.insertBefore(wrapEl, shList);
    wrapEl.appendChild(shList);
    var bar = document.createElement('div');
    bar.className = 'sh-sb';
    bar.innerHTML = '<div class="sb-btn sb-up"></div><div class="sb-track"><div class="sb-thumb"></div></div><div class="sb-btn sb-down"></div>';
    wrapEl.appendChild(bar);
    var track = bar.querySelector('.sb-track'), thumb = bar.querySelector('.sb-thumb');
    var btnUp = bar.querySelector('.sb-up'), btnDown = bar.querySelector('.sb-down');

    var maxScroll = function () { return Math.max(0, shList.scrollHeight - shList.clientHeight); };
    var travel = function () { return Math.max(0, track.clientHeight - thumb.offsetHeight); };
    var sync = function () {
      var max = maxScroll(), top = shList.scrollTop;
      thumb.style.display = max > 0 ? 'block' : 'none';
      thumb.style.top = (max ? top / max * travel() : 0) + 'px';
      thumb.classList.toggle('sb-top', top <= 0);
      thumb.classList.toggle('sb-bottom', max > 0 && top >= max - 1 && top > 0);
    };
    shList.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    sync();

    // smooth movement towards a target position
    var target = null, raf = 0;
    var step = function () {
      var diff = target - shList.scrollTop;
      if (Math.abs(diff) < 1) { shList.scrollTop = target; target = null; raf = 0; return; }
      var move = diff * SMOOTH;
      if (Math.abs(move) < 1) move = diff > 0 ? 1 : -1;
      shList.scrollTop += move;
      raf = requestAnimationFrame(step);
    };
    var goBy = function (d) {
      if (target === null) target = shList.scrollTop;
      target = Math.max(0, Math.min(maxScroll(), target + d));
      if (!raf) raf = requestAnimationFrame(step);
    };
    var stopEase = function () { target = null; };

    shList.addEventListener('wheel', function (e) {
      if (!maxScroll()) return;
      e.preventDefault();
      goBy(e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY);
    }, { passive: false });

    // arrow buttons: click = one row, hold = keeps going
    function hold(btn, dir) {
      var timer = 0, rep = 0;
      var stop = function () { clearTimeout(timer); clearInterval(rep); };
      btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        goBy(dir * ROW);
        timer = setTimeout(function () { rep = setInterval(function () { goBy(dir * ROW / 3); }, 50); }, 400);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (n) { btn.addEventListener(n, stop); });
    }
    hold(btnUp, -1); hold(btnDown, 1);

    // drag the thumb
    thumb.addEventListener('pointerdown', function (e) {
      e.preventDefault(); e.stopPropagation(); stopEase();
      thumb.setPointerCapture(e.pointerId);
      var startY = e.clientY, startTop = parseFloat(thumb.style.top) || 0;
      var move = function (ev) {
        var t = Math.max(0, Math.min(travel(), startTop + ev.clientY - startY));
        shList.scrollTop = travel() ? t / travel() * maxScroll() : 0;
      };
      var up = function () { thumb.removeEventListener('pointermove', move); thumb.removeEventListener('pointerup', up); thumb.removeEventListener('pointercancel', up); };
      thumb.addEventListener('pointermove', move);
      thumb.addEventListener('pointerup', up);
      thumb.addEventListener('pointercancel', up);
    });

    // click on the empty track: jump one page up / down
    track.addEventListener('pointerdown', function (e) {
      if (e.target !== track) return;
      var y = e.clientY - track.getBoundingClientRect().top;
      goBy((y < (parseFloat(thumb.style.top) || 0) ? -1 : 1) * shList.clientHeight * 0.9);
    });
  }

  // ----- Ship Parts lists: same in-game scroll bar as the Ships list (own copy, so the Ships pages are untouched) -----
  document.querySelectorAll('.sp-list').forEach(function (list) {
    var SMOOTH = 0.18, ROW = 52;       // wheel easing; pixels moved by one arrow click (one row)
    var wrap = document.createElement('div'); wrap.className = 'sp-scroll';
    list.parentNode.insertBefore(wrap, list); wrap.appendChild(list);
    var bar = document.createElement('div'); bar.className = 'sh-sb';
    bar.innerHTML = '<div class="sb-btn sb-up"></div><div class="sb-track"><div class="sb-thumb"></div></div><div class="sb-btn sb-down"></div>';
    wrap.appendChild(bar);
    var track = bar.querySelector('.sb-track'), thumb = bar.querySelector('.sb-thumb');
    var maxScroll = function () { return Math.max(0, list.scrollHeight - list.clientHeight); };
    var travel = function () { return Math.max(0, track.clientHeight - thumb.offsetHeight); };
    var sync = function () {
      var max = maxScroll(), top = list.scrollTop;
      thumb.style.display = max > 0 ? 'block' : 'none';
      thumb.style.top = (max ? top / max * travel() : 0) + 'px';
      thumb.classList.toggle('sb-top', top <= 0);
      thumb.classList.toggle('sb-bottom', max > 0 && top >= max - 1 && top > 0);
    };
    list.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    window.addEventListener('load', sync);
    if (window.ResizeObserver) new ResizeObserver(sync).observe(list);
    sync();
    var target = null, raf = 0;
    var step = function () {
      var diff = target - list.scrollTop;
      if (Math.abs(diff) < 1) { list.scrollTop = target; target = null; raf = 0; return; }
      var move = diff * SMOOTH;
      if (Math.abs(move) < 1) move = diff > 0 ? 1 : -1;
      list.scrollTop += move;
      raf = requestAnimationFrame(step);
    };
    var goBy = function (d) {
      if (target === null) target = list.scrollTop;
      target = Math.max(0, Math.min(maxScroll(), target + d));
      if (!raf) raf = requestAnimationFrame(step);
    };
    list.addEventListener('wheel', function (e) {
      if (!maxScroll()) return;
      e.preventDefault();
      goBy(e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY);
    }, { passive: false });
    function hold(btn, dir) {
      var timer = 0, rep = 0;
      var stop = function () { clearTimeout(timer); clearInterval(rep); };
      btn.addEventListener('pointerdown', function (e) {
        e.preventDefault();
        goBy(dir * ROW);
        timer = setTimeout(function () { rep = setInterval(function () { goBy(dir * ROW / 3); }, 50); }, 400);
      });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(function (n) { btn.addEventListener(n, stop); });
    }
    hold(bar.querySelector('.sb-up'), -1); hold(bar.querySelector('.sb-down'), 1);
    thumb.addEventListener('pointerdown', function (e) {
      e.preventDefault(); e.stopPropagation(); target = null;
      thumb.setPointerCapture(e.pointerId);
      var startY = e.clientY, startTop = parseFloat(thumb.style.top) || 0;
      var move = function (ev) {
        var t = Math.max(0, Math.min(travel(), startTop + ev.clientY - startY));
        list.scrollTop = travel() ? t / travel() * maxScroll() : 0;
      };
      var up = function () { thumb.removeEventListener('pointermove', move); thumb.removeEventListener('pointerup', up); thumb.removeEventListener('pointercancel', up); };
      thumb.addEventListener('pointermove', move);
      thumb.addEventListener('pointerup', up);
      thumb.addEventListener('pointercancel', up);
    });
    track.addEventListener('pointerdown', function (e) {
      if (e.target !== track) return;
      var y = e.clientY - track.getBoundingClientRect().top;
      goBy((y < (parseFloat(thumb.style.top) || 0) ? -1 : 1) * list.clientHeight * 0.9);
    });
  });

  // ----- Ship Parts panel: create the boxes of each option (data-boxes="1" to "5") -----
  function buildSlots(cat) {
    Array.prototype.slice.call(cat.querySelectorAll('.pn-slot')).forEach(function (b) { b.remove(); });
    var n = Math.max(0, Math.min(5, parseInt(cat.getAttribute('data-boxes'), 10) || 0));
    for (var i = 0; i < n; i++) {
      var box = document.createElement('img');
      box.className = 'pn-slot';
      box.src = root + 'images/ships/slot-empty.png';
      box.alt = '';
      cat.appendChild(box);
    }
  }
  document.querySelectorAll('.pn-cat[data-boxes]').forEach(buildSlots);

  // ----- Ships list data: a page that defines  var SHIPS = [ {...}, ... ]  gets one list row per ship; clicking a ship fills the page -----
  if (window.SHIPS && shList) {
    var detail = document.querySelector('.sh-detail');
    // which field goes where: icon file name -> field name
    var BY_ICON = { 'ico-sail': 'vsail', 'ico-mast': 'hsail', 'ico-oar': 'row', 'ico-turn': 'turn', 'ico-wave': 'wave', 'ico-cargo': 'arm',
                    'ico-dur': 'dura', 'ico-crew': 'cabin', 'ico-cannon': 'cc', 'ico-load': 'hold', 'lv-adv': 'adv', 'lv-trade': 'trd', 'lv-battle': 'btl' };
    var PANEL_ORDER = ['dura', 'vsail', 'hsail', 'row', 'turn', 'wave', 'arm', 'cabin', 'cc', 'hold'];   // order of the numbers in the improvements panel
    // hover tip under each stat row of the Improvements panel (text below; change it when you have real limits)
    var TIP_TEXT = '(Limit: 0)';
    (function () {
      var pa = document.querySelector('#ship-panel .pn-a'); if (!pa) return;
      var tip = document.createElement('div'); tip.className = 'pn-tip'; tip.textContent = TIP_TEXT; pa.appendChild(tip);
      Array.prototype.forEach.call(pa.querySelectorAll('.pn-row'), function (row) {
        row.addEventListener('mouseenter', function () {
          tip.style.left = (parseFloat(row.style.left) + 4) + 'px';
          tip.style.top = (parseFloat(row.style.top) + 27) + 'px';
          tip.style.display = 'block';
        });
        row.addEventListener('mouseleave', function () { tip.style.display = 'none'; });
      });
    })();
    var fmt = function (v) { return (v === undefined || v === null || v === '') ? '-' : v; };
    function showShip(s) {
      var SIZES = { Hvy: 'Heavy', Std: 'Standard', Lgt: 'Light' };       // size column of the table
      detail.querySelector('.sh-name span').textContent = s.name + (SIZES[s.size] ? ' (' + SIZES[s.size] + ')' : '');
      var nm = detail.querySelector('.sh-name span'); if (s.cash === 'O') { var u2 = document.createElement('img'); u2.src = root + 'images/ships/uwc.png'; u2.alt = ''; u2.className = 'sh-uwc'; nm.appendChild(u2); }
      Object.keys(BY_ICON).forEach(function (icon) {
        var img = detail.querySelector('img[src$="/' + icon + '.png"]');
        if (!img) return;
        var out = img.parentNode.querySelector('.sh-v, span');
        if (out) out.textContent = fmt(s[BY_ICON[icon]]);
      });
      var nums = document.querySelectorAll('#ship-panel .pn-v');
      PANEL_ORDER.forEach(function (f, i) { if (nums[i]) nums[i].textContent = fmt(s[f]); });
      var sails = document.querySelector('.pn-cat');          // first option = sails: one box per mast
      if (sails) { sails.setAttribute('data-boxes', s.mast || 0); buildSlots(sails); }
      // slots by size: [broadside cannons (cat-4), armour plates (cat-7), special equipment (cat-8)]
      var SLOTS = { Lgt: [3, 2, 1], Std: [4, 2, 1], Hvy: [5, 3, 2] }[s.size];
      if (SLOTS) ['cat-4', 'cat-7', 'cat-8'].forEach(function (c, k) {
        var ic = document.querySelector('.pn-cat img[src$="/' + c + '.png"]');
        if (ic) { ic.parentNode.setAttribute('data-boxes', SLOTS[k]); buildSlots(ic.parentNode); }
      });
    }
    shList.innerHTML = '';
    window.SHIPS.forEach(function (s, i) {
      var row = document.createElement('div');
      row.className = 'sh-item' + (i === 0 ? ' sel' : '');
      row.innerHTML = '<img src="' + root + 'images/ships/' + (s.thumb || 'thumb-3.png') + '" alt=""><span class="sh-iname"></span>';
      var nmEl = row.querySelector('.sh-iname'); var tx = document.createElement('span'); tx.className = 'sh-t'; tx.textContent = s.name; nmEl.appendChild(tx);
      if (s.cash === 'O') { var u = document.createElement('img'); u.src = root + 'images/ships/uwc.png'; u.alt = ''; u.className = 'sh-uwc'; row.querySelector('.sh-iname').appendChild(u); }
      row.addEventListener('click', function () {
        Array.prototype.forEach.call(shList.children, function (o) { o.classList.remove('sel'); });
        row.classList.add('sel');
        showShip(s);
      });
      shList.appendChild(row);
    });
    function fitNames() {                                     // long names: one line, shrink the font until it fits
      Array.prototype.forEach.call(shList.querySelectorAll('.sh-iname'), function (n) {
        var t = n.querySelector('.sh-t'), fs = 14; n.style.fontSize = fs + 'px';
        while (fs > 9 && n.scrollWidth > n.clientWidth) { fs -= 0.5; n.style.fontSize = fs + 'px'; }
      });
    }
    // ----- Ship search: type 3+ letters; every word you type must be the START of a word in the ship name (no typo matching) -----
    var SEARCH_MIN = 3;                                       // minimum characters before the list is filtered
    var scrollBox = shList.parentNode;
    var sInput = document.createElement('input');
    sInput.type = 'text'; sInput.className = 'sh-search';
    sInput.setAttribute('aria-label', 'Search ship'); sInput.autocomplete = 'off'; sInput.spellcheck = false;
    scrollBox.parentNode.insertBefore(sInput, scrollBox);
    attachCaret(sInput);
    var sEmpty = document.createElement('div'); sEmpty.className = 'sh-empty'; sEmpty.textContent = 'No ships found'; sEmpty.style.display = 'none';
    shList.appendChild(sEmpty);
    function startsWord(name, tok) {                          // tok must begin at the start of a word (words split by space or hyphen)
      for (var i = 0; i < name.length; i++) {
        if ((i === 0 || name[i - 1] === ' ' || name[i - 1] === '-') && name.substr(i, tok.length) === tok) return true;
      }
      return false;
    }
    function filterShips() {
      var q = sInput.value.trim().toLowerCase().replace(/\s+/g, ' ');
      var toks = q.length >= SEARCH_MIN ? q.split(' ') : [];
      var shown = 0;
      window.SHIPS.forEach(function (s, i) {
        var name = s.name.toLowerCase(), ok = true;
        for (var k = 0; k < toks.length; k++) { if (!startsWord(name, toks[k])) { ok = false; break; } }
        shList.children[i].classList.toggle('sh-hide', !ok);
        if (ok) shown++;
      });
      sEmpty.style.display = shown ? 'none' : 'block';
      shList.scrollTop = 0;
      window.dispatchEvent(new Event('resize'));              // refresh the scroll bar
    }
    sInput.addEventListener('input', filterShips);
    sInput.addEventListener('keydown', function (e) { if (e.key === 'Escape') { sInput.value = ''; filterShips(); } });
        if (window.SHIPS.length) showShip(window.SHIPS[0]);
    window.dispatchEvent(new Event('resize'));                // refresh the scroll bar
  }

  // ----- top bar: only the "UWO DATABASE" button part of the image goes to the home page -----
  var topbar = document.querySelector('.topbar');
  if (topbar) {
    var HOME_LEFT = 14, HOME_WIDTH = 200;     // <-- position and width (in px) of the clickable part; adjust if needed
    topbar.style.position = 'relative';
    var home = document.createElement('a');
    home.href = root + 'index.html';
    home.setAttribute('aria-label', 'Home');
    home.style.cssText = 'position:absolute;top:0;height:100%;display:block;left:' + HOME_LEFT + 'px;width:' + HOME_WIDTH + 'px;';
    topbar.appendChild(home);
  }

  // ----- smooth load: show the page only when images are ready (or after 1.2 s at most) -----
  var revealed = false;
  function reveal() {
    if (revealed) return;
    revealed = true;
    document.body.classList.remove('loading');
  }
  if (document.readyState === 'complete') { reveal(); }
  else { window.addEventListener('load', reveal); setTimeout(reveal, 1200); }
})();
