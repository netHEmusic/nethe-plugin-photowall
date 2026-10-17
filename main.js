/* main.js —— 歌单照片墙（netHEmusic 插件）
 *
 * 做什么：歌单页 / 歌曲列表页渲染完成后，把宿主的列表换成一面 3D 照片墙
 *         （照片墙引擎来自 FoliaExtract/photowall，见 vendor/photowall.bundle.js）。
 * 玩法：  滚轮缩放、拖拽平移、方向键移动焦点、Enter/Space 播放、点卡片播放、
 *         卡片悬浮出现 播放 / 加入播放列表 / 下载 三个按钮。
 * 退出：  顶栏「列表」按钮，或右下角悬浮按钮。
 *
 * 与宿主的关系：只读宿主 DOM、只通过点击宿主已有的按钮（[data-do=play|add|dl]）来操作，
 *              不碰播放器内部状态，宿主改版时最多退化成「照片墙里点不动」。
 */
(function () {
  var FW = window.FoliaWall;
  if (!FW || typeof FW.buildWallLayout !== 'function') {
    try { nethe.log('照片墙插件：没找到 window.FoliaWall —— vendor/photowall.bundle.js 可能没注入成功'); } catch (e) { }
    return;
  }

  // ---------------- 配置 ----------------
  // lock（指针锁）默认开：按交付文档 docs/DRAG_AND_POINTER_CAPTURE.md §3 的顺序重做过——
  // 引擎捕获（它自己的“鼠标锁定”）成功之后才申请 Pointer Lock，绝不反过来，所以不再让引擎的
  // setPointerCapture 抛 InvalidStateError；申请被拒只记数 + 打一条日志，拖拽行为与以前一致。
  // 注意宿主限制：WinUI3 的 WebView2 走“视觉托管(visual hosting)”，Chromium 在这种宿主里通常
  // 不授予 Pointer Lock（MicrosoftEdge/WebView2Feedback#4968）。拿不到就自动回退普通拖拽，
  // 想要光标一直可见可在设置里把这个开关关掉。
  var CFG = { auto: true, rec: false, cell: 128, gap: 8, reserved: 0, acts: true, grow: 300, autoLoad: true, lock: true };
  var CFG_KEYS = ['auto', 'rec', 'acts', 'autoLoad', 'lock', 'cell', 'gap', 'reserved', 'grow'];
  var LIM = { cell: [72, 260], gap: [2, 28], reserved: [0, 6], grow: [50, 2000] };

  // 宿主日志（设置页 / 日志文件里能看到，方便排查“插件到底有没有生效”）
  function log(msg) { try { nethe.log('[照片墙] ' + msg); } catch (e) { } }

  // ---------------- 运行时状态 ----------------
  var S = {
    view: null, stage: null, wallBox: null, hint: null, wall: null,
    mo: null, timer: 0, busy: false, swallow: false,
    host: null, node: null, kind: '', items: [], layout: null, override: null,
    sid: '', sidTitle: '', fab: null, cssNode: null, bar: null,
    drag: null, glide: 0, autoTimer: 0,
    zoomTouched: false, wallVpW: 0   // 用户是否自己缩放过 / 上次 resize 用到的视口宽度
  };

  function clamp(v, key, def) {
    var r = LIM[key]; var n = Number(v);
    if (!isFinite(n)) return def;
    if (!r) return n;
    return Math.max(r[0], Math.min(r[1], Math.round(n)));
  }

  function loadCfg() {
    // 宿主把插件设置值同步暴露在 nethe.settings.value(key) 里，这里只读它。
    // 不要用 nethe.data.read：当前宿主版本 plugin_data 回复里没带 rid（PluginBridgeHandlers.cs
    // 的 PostToWeb 少了 rid 字段），Promise 永远不会 settle，会让整个启动链卡死。
    for (var i = 0; i < CFG_KEYS.length; i++) {
      var k = CFG_KEYS[i], v = null;
      try { v = nethe.settings.value(k); } catch (e) { v = null; }
      if (v === null || v === undefined || v === '') continue;
      if (k === 'auto' || k === 'rec' || k === 'acts' || k === 'autoLoad' || k === 'lock') CFG[k] = (v === true || v === 'true');
      else CFG[k] = clamp(v, k, CFG[k]);
    }
  }
  function saveCfg(key, val) { try { nethe.settings.set(key, val); } catch (e) { } }

  function regSettings() {
    try {
      nethe.settings.add({
        key: 'auto', label: '歌单页自动切成照片墙', type: 'switch', value: CFG.auto,
        onChange: function (v) { CFG.auto = !!v; saveCfg('auto', CFG.auto); schedule(60); }
      });
      nethe.settings.add({
        key: 'rec', label: '首页「每日推荐」/搜索结果也自动切换', type: 'switch', value: CFG.rec,
        onChange: function (v) { CFG.rec = !!v; saveCfg('rec', CFG.rec); schedule(60); }
      });
      // 注意：宿主把 type:'number' 渲染成 min=0 max=100 的滑块（app.js:2833），
      // 所以范围超过 0–100 的值（卡片尺寸、加载上限）必须用 text，让用户直接填数字。
      nethe.settings.add({
        key: 'cell', label: '卡片尺寸（像素，72–260）', type: 'text', value: String(CFG.cell),
        onChange: function (v) { CFG.cell = clamp(v, 'cell', 128); saveCfg('cell', CFG.cell); restyle(); }
      });
      nethe.settings.add({
        key: 'gap', label: '卡片间距（像素）', type: 'number', value: CFG.gap,
        onChange: function (v) { CFG.gap = clamp(v, 'gap', 8); saveCfg('gap', CFG.gap); restyle(); }
      });
      nethe.settings.add({
        key: 'reserved', label: '每块留空位（0–6，0 = 铺满）', type: 'number', value: CFG.reserved,
        onChange: function (v) { CFG.reserved = clamp(v, 'reserved', 0); saveCfg('reserved', CFG.reserved); restyle(); }
      });
      nethe.settings.add({
        key: 'grow', label: '照片墙最多加载多少首（50–2000）', type: 'text', value: String(CFG.grow),
        onChange: function (v) { CFG.grow = clamp(v, 'grow', 300); saveCfg('grow', CFG.grow); refresh(true); }
      });
      nethe.settings.add({
        key: 'autoLoad', label: '照片墙模式下自动补全后面的歌曲', type: 'switch', value: CFG.autoLoad,
        onChange: function (v) { CFG.autoLoad = !!v; saveCfg('autoLoad', CFG.autoLoad); schedule(60); if (CFG.autoLoad) autoGrowStart(); else autoGrowStop(); }
      });
      nethe.settings.add({
        key: 'acts', label: '卡片悬浮按钮（播放/加入列表/下载）', type: 'switch', value: CFG.acts,
        onChange: function (v) { CFG.acts = !!v; saveCfg('acts', CFG.acts); restyle(); }
      });
      // 拖拽平移时把指针锁在原地（Pointer Lock）：光标不再扫过卡片，配合界面不动的做法消除“莫名位移”。
      // 顺序按交付文档 §3：先让引擎自己的指针捕获做成，再申请 Pointer Lock；申请被拒只是回退普通拖拽，
      // 宿主日志里会各打一条「已锁住光标」/「宿主拒绝…回退」。
      nethe.settings.add({
        key: 'lock', label: '拖拽时把光标锁在按下的位置（拿不到锁时自动回退）', type: 'switch', value: CFG.lock,
        onChange: function (v) {
          CFG.lock = !!v; saveCfg('lock', CFG.lock);
          if (CFG.lock) { S.lockWarned = false; S.lockLogged = false; log('指针锁：已打开，下次拖拽时申请'); }
          else { unlockPointer(); log('指针锁：已关闭，光标保持可见'); }
        }
      });
    } catch (e) { }
  }

  // ---------------- 宿主页面探测 ----------------
  function viewEl() { return document.getElementById('view'); }

  function detectHost() {
    var v = viewEl(); if (!v) return null;
    var page = v.querySelector('.page'); if (!page) return null;
    var list = page.querySelector('.song-list');
    if (list && list.querySelector('.song-row')) return { page: page, node: list, kind: 'songs' };
    var grid = page.querySelector('.pl-grid');
    if (grid && grid.querySelector('.pl-card')) return { page: page, node: grid, kind: 'playlists' };
    return null;
  }

  function pageTitle(h) {
    if (!h) return '照片墙';
    var t = pwText(h.page.querySelector('.page-title'));
    if (t) return t;
    if (h.kind === 'playlists') return '歌单';
    var nav = document.querySelector('#sidebar a[data-nav].on');
    return pwText(nav) || '照片墙';
  }

  // 默认只在「歌单类」页面自动切换：我的歌单 / 歌单 / 排行榜 / 歌单详情（页面标题=歌单名）。
  // 首页每日推荐、搜索结果默认保持宿主原样（要一起切换就打开设置里的那个开关）。
  function isAutoPage(h) {
    if (!h) return false;
    if (CFG.rec) return true;
    // 侧边栏当前项是最稳的判据：首页加载过程中 .page-title 会时有时无，
    // 只看标题会在「首页刚渲染完那一瞬间」误判成歌单页（实测踩过）。
    var nav = document.querySelector('#sidebar a[data-nav].on');
    var navName = nav ? String(nav.getAttribute('data-nav') || '') : '';
    if (navName === 'home') return false;
    var t = pwText(h.page.querySelector('.page-title'));
    if (t.indexOf('每日推荐') === 0) return false;
    if (t.indexOf('搜索') === 0) return false;
    if (h.kind === 'playlists') return true;   // 歌单网格（我的歌单 / 排行榜…）本身就是歌单类
    // 歌曲列表：必须有页面标题。首页没有 .page-title（用的是 .greet-title）⇒ 不自动切换
    return !!t;
  }

  function readItems(h) {
    var out = [];
    if (h.kind === 'songs') {
      pwAll(h.node, '.song-row').forEach(function (row) {
        var img = pwSlot(row, '.sr-cover');
        out.push({
          id: 'S:' + (row.getAttribute('data-sid') || ''),
          sid: String(row.getAttribute('data-sid') || ''),
          title: pwText(pwSlot(row, '.sr-title')) || '未知歌曲',
          subtitle: pwText(pwSlot(row, '.sr-artist')),
          meta: pwText(pwSlot(row, '.sr-album')),
          coverUrl: pwCover(img && img.getAttribute('src'), 320),
          el: row
        });
      });
    } else {
      pwAll(h.node, '.pl-card').forEach(function (card, i) {
        var img = card.querySelector('img');
        out.push({
          id: 'P:' + i + ':' + pwText(pwSlot(card, '.plc-name')),
          sid: '',
          title: pwText(pwSlot(card, '.plc-name')) || '未命名歌单',
          subtitle: pwText(pwSlot(card, '.plc-count')),
          coverUrl: pwCover(img && img.getAttribute('src'), 360),
          el: card
        });
      });
    }
    return out;
  }

  // 宿主歌单/列表是分批渲染的（每批 50）：把哨兵滚进视口，逼它把剩下的行渲出来
  function growAll(limit) {
    var v = viewEl(); if (!v) return Promise.resolve();
    var cap = clamp(limit, 'grow', 300);
    var guard = 0;
    return new Promise(function (resolve) {
      function step() {
        var sentinel = v.querySelector('.list-more');
        var rows = v.querySelectorAll('.song-row').length;
        if (!sentinel || rows >= cap || guard++ > 120) { resolve(); return; }
        try { sentinel.scrollIntoView({ block: 'end' }); } catch (e) { try { v.scrollTop = v.scrollHeight; } catch (e2) { } }
        setTimeout(step, 55);
      }
      step();
    });
  }

  // 宿主的分批渲染靠哨兵 `.list-more` 进视口触发，而挂墙后宿主页面是 display:none，
  // 哨兵没有布局、滚不动 ⇒ 必须先把宿主页面放出来，逼它渲完，再重新挂墙。
  function growVisible(limit) {
    var v = viewEl();
    var wasHidden = !!(v && v.classList.contains('pw-on'));
    if (wasHidden) v.classList.remove('pw-on');
    if (S.stage) S.stage.classList.add('pw-loading');
    return growAll(limit).then(function () {
      if (S.stage) S.stage.classList.remove('pw-loading');
      if (wasHidden && v) v.classList.add('pw-on');
    });
  }

  // 墙已经盖住整个主区域时的“后台补全”：把宿主页面恢复布局好让哨兵能滚（页面在不透明的舞台后面，
  // 看不见 ⇒ 没有闪烁），拉完再隐藏回去。
  function growBehind(limit) {
    var v = viewEl();
    if (!S.stage || !S.stage.classList.contains('pw-full')) return Promise.resolve(false);
    var wasOn = !!(v && v.classList.contains('pw-on'));
    if (wasOn) v.classList.remove('pw-on');
    return growAll(limit).then(function () {
      if (wasOn && v) v.classList.add('pw-on');
      return true;
    });
  }

  // 注入样式：不依赖宿主的 nethe.css API（早期宿主版本没有它，静默失败会让整个墙裸奔）
  function injectCss() {
    try {
      var id = (nethe && nethe.id) || 'photowall-playlist';
      var old = document.getElementById('pw-style');
      if (old && old.parentNode) old.parentNode.removeChild(old);
      var s = document.createElement('style');
      s.id = 'pw-style';
      s.setAttribute('data-plugin', id);
      s.textContent = PW_CSS + '\n' + (window.FOLIA_WALL_CSS || '');
      document.head.appendChild(s);
      S.cssNode = s;
      var hostApi = (nethe && nethe.css && typeof nethe.css.add === 'function') ? '有' : '无';
      log('样式已注入（' + s.textContent.length + ' 字符）· 宿主 nethe.css=' + hostApi);
    } catch (e) {
      log('样式注入失败：' + (e && e.message));
    }
  }

  // ---------------- 悬浮入口按钮 ----------------
  function ensureFab() {
    if (S.fab && S.fab.isConnected) return S.fab;
    var b = pwEl('button', 'pw-fab', PW_ICON.wall + '<span>照片墙</span>');
    b.type = 'button';
    b.title = '把当前页面切成照片墙 / 切回列表';
    b.addEventListener('click', function () {
      S.override = (S.stage ? 'list' : 'wall');
      schedule(10);
    });
    document.body.appendChild(b);
    S.fab = b;
    return b;
  }
  function syncFab(want) {
    var b = document.body.querySelector('.pw-fab');
    if (b) S.fab = b;
    var show = !!want;
    if (S.fab) {
      S.fab.style.display = show ? '' : 'none';
      S.fab.classList.toggle('on', !!(S.stage && S.stage.isConnected));
      var sp = S.fab.querySelector('span');
      if (sp) sp.textContent = S.stage ? '返回列表' : '照片墙';
    }
  }

  // ---------------- 挂载 / 卸载 ----------------
  // 宿主主区域（#main，右侧整块，含顶栏与播放条）。能拿到就整块铺满。
  function mainEl() {
    var m = document.getElementById('main');
    return (m && m.clientHeight > 60) ? m : null;
  }

  function sizeStage() {
    var v = viewEl();
    if (!S.stage || !v) return;
    if (S.stage.classList.contains('pw-full')) { S.stage.style.height = ''; return; } // inset:0 自己撑满
    var h = Math.max(300, v.clientHeight - 24);
    S.stage.style.height = h + 'px';
  }

  function mount(h) {
    var v = viewEl(); if (!v || !h) return;
    teardown();
    S.host = h; S.kind = h.kind;
    S.busy = true;

    var stage = pwEl('div', 'pw-stage');
    var bar = pwEl('div', 'pw-bar');
    var title = pwEl('div', 'pw-title', '照片墙');
    var meta = pwEl('div', 'pw-meta', '正在整理…');
    var sp = pwEl('div', 'pw-spacer');

    var bList = pwBtn('pw-btn', PW_ICON.list + '<span>列表</span>', '切回宿主列表');
    var bPlay = pwBtn('pw-btn on', '播放全部', '播放这一页的全部歌曲');
    var bMore = pwBtn('pw-btn', '更多', '继续加载后面的歌曲');
    var bNow = pwBtn('pw-btn', '正在播放', '定位到正在播放的那首');
    var bZoomOut = pwBtn('pw-btn icon', '−', '缩小');
    var bZoomIn = pwBtn('pw-btn icon', '＋', '放大');
    var bFit = pwBtn('pw-btn', '归位', '回到画面中心');

    bList.addEventListener('click', function () { S.override = 'list'; schedule(10); });
    bPlay.addEventListener('click', function () { playAll(); });
    bMore.addEventListener('click', function () { refresh(true); });
    bNow.addEventListener('click', function () { focusCurrent(true); });
    bZoomOut.addEventListener('click', function () { zoom(0.86); });
    bZoomIn.addEventListener('click', function () { zoom(1.16); });
    bFit.addEventListener('click', function () { resetCamera(); });

    bar.appendChild(title); bar.appendChild(meta); bar.appendChild(sp);
    if (h.kind === 'songs') bar.appendChild(bPlay);
    bar.appendChild(bNow);
    bar.appendChild(pwEl('div', 'pw-sep'));
    bar.appendChild(bZoomOut); bar.appendChild(bZoomIn); bar.appendChild(bFit);
    bar.appendChild(bMore);
    bar.appendChild(pwEl('div', 'pw-sep'));
    bar.appendChild(bList);
    stage.appendChild(bar);

    var wallBox = pwEl('div', 'pw-wall');
    var hint = pwEl('div', 'pw-hint', '<div class="pw-spin"></div><b>正在布置照片墙…</b>');
    wallBox.appendChild(hint);
    stage.appendChild(wallBox);
    bindWheelZoom(stage);
    bindDragInertia(stage);

    var fullHost = mainEl();
    if (fullHost) { fullHost.appendChild(stage); stage.classList.add('pw-full'); }
    else { v.appendChild(stage); }
    stage.classList.add('pw-loading'); // 先把宿主列表放出来逼它分批渲染，渲完再挂墙
    S.stage = stage; S.wallBox = wallBox; S.hint = hint; S.bar = bar; S.title = title; S.meta = meta;
    S.bMore = bMore; S.bPlay = bPlay;
    S.grow = CFG.grow; // 「更多」每次再往后放一批，上限 2000

    sizeStage();
    syncFab(true);

    growVisible(CFG.grow).then(function () {
      if (!S.stage) { S.busy = false; return; }
      stage.classList.remove('pw-loading');
      v.classList.add('pw-on');
      try { v.scrollTop = 0; } catch (e) { }
      S.items = readItems(S.host);
      title.textContent = pageTitle(S.host);
      if (!S.items.length) {
        hint.innerHTML = '<b>这里暂时没有可展示的内容</b><div class="pw-muted">等页面加载出来，或者切回列表看看。</div>';
        log('页面没有可展示的内容，保持列表');
        S.busy = false; updateMeta(); return;
      }
      log('挂载照片墙：' + h.kind + ' · ' + title.textContent + ' · ' + S.items.length + ' 项');
      buildWall();
      S.busy = false;
      autoGrowStart();          // 墙上去以后，后台继续把后面的歌一批批补进来
    });
  }

  function buildWall() {
    if (!S.stage || !S.wallBox) return;
    zoomSmoothStop();          // 重建墙 = 换相机对象，动画必须停（否则会去写已经销毁的相机）
    var vp = wallViewport();
    var layout;
    try {
      layout = FW.buildWallLayout({
        items: S.items, viewport: vp,
        metrics: { cellSize: CFG.cell, gap: CFG.gap },
        reservedPerBlock: CFG.reserved,
        maxInstances: FW.MAX_RENDERED_INSTANCES
      });
    } catch (e) {
      if (S.hint) S.hint.innerHTML = '<b>照片墙布局失败</b><div class="pw-muted">' + String(e && e.message || e) + '</div>';
      log('布局失败：' + String(e && e.message || e));
      return;
    }
    S.layout = layout;
    if (S.hint && S.hint.parentNode) S.hint.parentNode.removeChild(S.hint);
    S.hint = null;
    try {
      S.wall = FW.createWall(S.wallBox, {
        layout: layout, items: S.items, renderCard: renderCard, keyboard: true,
        onSelect: function (card, item) {
          if (S.swallow) return;
          activate(item);
        }
      });
    } catch (e2) {
      S.wallBox.appendChild(pwEl('div', 'pw-hint', '<b>照片墙初始化失败</b><div class="pw-muted">' + String(e2 && e2.message || e2) + '</div>'));
      log('初始化失败：' + String(e2 && e2.message || e2));
      return;
    }
    updateMeta();
    S.zoomTouched = false;     // 新墙 = 断点基准缩放，用户还没自己缩放过
    // 引擎自带 ResizeObserver（FoliaExtract/photowall/src/dom/createWall.js:526-532）一发现容器
    // 尺寸变化就调 resize(next, autoScale=true) → camera.setScale(getScale(viewport.width))。
    // 那是给“窗口尺寸变化”用的断点缩放，可容器高度也会被我们自己改（工具栏换行/字数变化、
    // 自动补全时 meta 文本变长），于是用户刚用滚轮调好的缩放被悄悄打回基准值 0.52/0.64/0.76，
    // 看起来就是“拖动后整面墙莫名整体位移”。断点只看宽度 ⇒ 宽度没变的缩放变化一律还原。
    guardAutoRescale(S.wall);
    guardLayoutCamera(S.wall);
    guardPointerCapture();
    if (AUDIT.on) { auditHook(); auditWall(); }
    if (EVT.on) evtHook(S.stage);
    log('照片墙就绪：' + layout.cards.length + ' 张卡片，已挂载 ' + (S.wall.getMountedCount ? S.wall.getMountedCount() : '?'));
    // 挂载后按容器实际尺寸再量一次（sticky 元素第一帧可能还没算好高度）
    setTimeout(function () { try { S.wall.resize({ width: S.wallBox.clientWidth, height: S.wallBox.clientHeight }, true); } catch (e) { } }, 60);
    focusCurrent(false);
  }

  function wallViewport() {
    var w = 1280, h = 720;
    if (S.wallBox) { w = S.wallBox.clientWidth || w; h = S.wallBox.clientHeight || h; }
    return { width: Math.max(320, w), height: Math.max(240, h) };
  }

  /* 包一层 wall.resize：只有“视口宽度真的变了”（=窗口尺寸变化）才让引擎按断点重置缩放；
     宽度没变的重排（高度被工具栏文字挤动）不许动用户已经调好的缩放。 */
  function guardAutoRescale(wall) {
    if (!wall || wall.__rescaleGuarded || typeof wall.resize !== 'function') return;
    var orig = wall.resize;
    wall.__rescaleGuarded = true;
    wall.resize = function (next, auto) {
      var cam = wall.getCamera ? wall.getCamera() : null;
      var before = cam && cam.getState ? cam.getState() : null;
      var widthBefore = S.wallVpW || 0;
      var widthNext = next && next.width ? next.width : widthBefore;
      var out = orig.apply(wall, arguments);
      var widthChanged = Math.abs(widthNext - widthBefore) >= 1;
      S.wallVpW = widthNext;
      if (widthChanged) { S.zoomTouched = false; return out; }   // 真·窗口尺寸变化：接受断点缩放
      if (!auto || !before || !cam || !cam.getState) return out;
      // 宽度没变 ⇒ 只是高度被工具栏文字挤动：位置和缩放都不该动。高度变化会顺手 setBounds /
      // setViewport 把相机 clamp 一下，用户看到的就是“整面墙莫名位移”，所以这里把写入前的
      // 相机状态还原回去（setCenter 自己会按新 bounds 再 clamp，不会把相机推到非法位置）。
      var after = cam.getState();
      var moved = Math.abs(after.x - before.x) > 0.5 || Math.abs(after.y - before.y) > 0.5;
      var rescaled = Math.abs(after.scale - before.scale) > 1e-6;
      if (moved && cam.setCenter) cam.setCenter(before.x, before.y);
      // 断点缩放只跟宽度有关，宽度没变时只有“用户自己调过缩放”才需要还原
      if (rescaled && S.zoomTouched && cam.setScale) cam.setScale(before.scale);
      if ((moved || rescaled) && AUDIT.on) auditPush({ fn: 'guardAutoRescale', args: [moved ? 'center' : '', rescaled ? 'scale' : ''], before: [before.x, before.y, before.scale], after: camSnap(cam) });
      return out;
    };
  }

  /* 后台自动补全走的是 wall.setLayout()（refresh() 只换布局和条目，不重建墙），引擎在里面
     setBounds(layout.bounds) → applyCenter(state, true) 会把相机 clamp 到新边界。实测：挂墙后
     自动补全 300→365 首那一下，相机 x 从 746 被推到 812（撞到新边界），用户看到的就是“墙自己
     横移了一下”。补全只是多贴几张封面，不该动用户的视口 ⇒ setLayout 前后相机状态不同就还原
     （setCenter 会按新 bounds 自己 clamp，不会把相机推到非法位置）。 */
  function guardLayoutCamera(wall) {
    if (!wall || wall.__layoutGuarded || typeof wall.setLayout !== 'function') return;
    var orig = wall.setLayout;
    wall.__layoutGuarded = true;
    wall.setLayout = function (next) {
      var cam = wall.getCamera ? wall.getCamera() : null;
      var before = cam && cam.getState ? cam.getState() : null;
      var out = orig.apply(wall, arguments);
      if (!before || !cam || !cam.getState || !cam.setCenter) return out;
      var after = cam.getState();
      var moved = Math.abs(after.x - before.x) > 0.5 || Math.abs(after.y - before.y) > 0.5;
      var rescaled = Math.abs(after.scale - before.scale) > 1e-6;
      if (!moved && !rescaled) return out;
      var d = ['d=' + Math.round(after.x - before.x) + ',' + Math.round(after.y - before.y) + ',' + (Math.round(after.scale * 1000) / 1000)];
      if (rescaled && cam.setScale) cam.setScale(before.scale);
      cam.setCenter(before.x, before.y);
      if (AUDIT.on) auditPush({ fn: 'guardLayoutCamera', args: ['cards=' + (next && next.cards ? next.cards.length : '?')].concat(d), before: [before.x, before.y, before.scale], after: camSnap(cam) });
      return out;
    };
  }

  /* 引擎在 dom/pointer.js 里直接 container.setPointerCapture(event.pointerId)，没有 try/catch：
     只要那一刻指针不是 active（WebView2 里申请指针锁、事件重复投递、拖拽中窗口失焦都可能触发），
     就抛 InvalidStateError，一路冒到宿主日志刷屏（[jserr] Uncaught InvalidStateError ... main.js:3634）。
     更糟的是这个异常会打断引擎 onPointerMove 后面的 `pan.last = …` 与 `camera.panBy(step)`，
     于是下一次移动算出的步长是「按下点到当前点的整段距离」⇒ 墙会跳一大段（用户说的“莫名整体位移”）。
     这里包一层：失败只记数 + 审计，不抛异常，拖拽本身不受影响（代价只是少一次指针捕获）。 */
  function guardPointerCapture() {
    var box = S.wallBox;
    if (!box || box.__capGuarded) return;
    box.__capGuarded = true;
    var orig = box.setPointerCapture;
    if (typeof orig !== 'function') return;
    box.setPointerCapture = function (id) {
      var out;
      try { out = orig.call(this, id); }
      catch (e) {
        S.capFail = (S.capFail || 0) + 1;
        auditPush({ fn: 'setPointerCapture', args: ['fail:' + String(e && e.name || '')], stack: '' });
      }
      // 按交付文档 docs/DRAG_AND_POINTER_CAPTURE.md §3：引擎的「鼠标锁定」就是 Pointer Capture，
      // 而且刻意等到越过阈值才捕获。我们申请的 Pointer Lock 放在**引擎那次捕获做完之后**——
      // 反了（先锁再捕获）会扰动 pointer 的 active 状态、让引擎的 setPointerCapture 抛
      // InvalidStateError（宿主日志里那条就是这么来的）。捕获做完再申请，两边互不打扰。
      if (S.drag && !pointerLocked()) { try { lockPointer(); } catch (e2) { } }
      return out;
    };
  }

  function teardown() {
    var was = !!S.stage;
    stopGlide(); S.drag = null; unlockPointer(); autoGrowStop(); zoomSmoothStop();
    S.finishDrag = null;    // 全局兜底监听是常驻的，卸掉墙后让它空转（别留闭包指向这面墙）
    try { if (S.wall && S.wall.destroy) S.wall.destroy(); } catch (e) { }
    S.wall = null; S.layout = null;
    if (S.stage && S.stage.parentNode) S.stage.parentNode.removeChild(S.stage);
    if (was) log('退出照片墙，恢复宿主列表');
    S.stage = null; S.wallBox = null; S.hint = null; S.bar = null; S.items = [];
    var v = viewEl(); if (v) v.classList.remove('pw-on');
    S.host = null; S.kind = '';
  }

  // ---------------- 卡片渲染（在引擎默认外观上加料） ----------------
  function renderCard(card, item) {
    var el = FW.createPosterElement(card, item);
    try {
      el.setAttribute('data-pw-id', item.id);
      if (item.sid) el.setAttribute('data-sid', item.sid);
      // 序号只用引擎自带的 `.lattice-poster-badge`（`card.itemIndex + 1`，两位数）。
      // 插件以前还叠了一个自己的 `.pw-pill`（`#001`），两个框摞在左上角——去掉自制的那个。
      el.appendChild(pwEl('div', 'pw-eq', '<i></i><i></i><i></i>'));
      if (CFG.acts && item.el) {
        var acts = pwEl('div', 'pw-acts');
        if (item.sid) {
          acts.appendChild(actionBtn('play', '播放', item));
          acts.appendChild(actionBtn('add', '加入播放列表', item));
          acts.appendChild(actionBtn('dl', '下载', item));
        } else {
          acts.appendChild(actionBtn('open', '打开歌单', item));
        }
        el.appendChild(acts);
      }
      if (item.sid && S.sid && item.sid === S.sid) el.classList.add('pw-live');
    } catch (e) { }
    return el;
  }

  function actionBtn(kind, title, item) {
    var ico = kind === 'open' ? PW_ICON.wall : PW_ICON[kind];
    var b = pwEl('button', 'pw-act', ico);
    b.type = 'button'; b.title = title;
    b.addEventListener('click', function (ev) {
      // 引擎是在容器上做事件委托（closest('[data-wall-card]')），所以这里既 stopPropagation
      // 又立一个 swallow 标记，双保险地阻止「点按钮 = 播放」之外的副作用。
      ev.stopPropagation(); ev.preventDefault();
      S.swallow = true;
      setTimeout(function () { S.swallow = false; }, 0);
      if (kind === 'open') { try { item.el.click(); } catch (e) { } return; }
      var sel = kind === 'play' ? '[data-do=play]' : kind === 'add' ? '[data-do=add]' : '[data-do=dl]';
      var t = item.el.querySelector(sel);
      if (t) { try { t.click(); } catch (e2) { } }
      else { try { item.el.click(); } catch (e3) { } }
    });
    return b;
  }

  // ---------------- 交互 ----------------
  function itemBySid(sid) {
    if (!sid) return null;
    for (var i = 0; i < S.items.length; i++) if (S.items[i].sid === sid) return S.items[i];
    return null;
  }

  function activate(item) {
    if (!item || !item.el) return;
    try {
      if (item.sid) {
        var t = item.el.querySelector('[data-do=play]');
        if (t) { t.click(); return; }
      }
      item.el.click();
    } catch (e) { }
  }

  function playAll() {
    // 宿主页头部的「播放全部」按钮（把整页作为队列追加播放）
    var page = S.host && S.host.page;
    var btn = null;
    if (page) {
      var cands = pwAll(page, 'button');
      for (var i = 0; i < cands.length; i++) {
        if (String(cands[i].textContent || '').indexOf('播放全部') >= 0) { btn = cands[i]; break; }
      }
    }
    if (btn) { try { btn.click(); nethe.toast('已把这一页加入播放队列'); return; } catch (e) { } }
    if (S.items.length) activate(S.items[0]);
  }

  // ---------------- 滚轮 = 缩放 ----------------
  // 引擎默认把滚轮当平移（core/panMotion.js 会判别「滚轮一格」还是「触控板」再走平滑平移），
  // 这里在捕获阶段先拦：鼠标滚轮换成以指针为锚点的缩放，触控板的小增量照旧放行给引擎平移。
  function isWheelNotch(e) {
    if (e.deltaMode === 1 || e.deltaMode === 2) return true;      // 按行/按页：一定是滚轮
    if (Math.abs(e.deltaY) < Math.abs(e.deltaX)) return false;    // 横向为主（Shift+滚轮）交给引擎
    var ax = Math.abs(e.deltaX), ay = Math.abs(e.deltaY);
    if (ax > 0 && ay > 0) return false;                           // 双轴小增量：触控板
    return ay >= 30;                                              // 单轴大步长：滚轮一格
  }

  function bindWheelZoom(stage) {
    stage.addEventListener('wheel', function (e) {
      if (!S.wall || !isWheelNotch(e)) return;
      e.preventDefault();
      e.stopPropagation();
      stopGlide();
      S.zoomTouched = true;      // 用户自己定的缩放，之后的重排不许把它打回断点基准
      var step = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      var pt = localPoint(e.clientX, e.clientY);
      if (!ZOOM_SMOOTH) { zoomStep(pt.x, pt.y, step); return; }
      zoomSmooth(pt.x, pt.y, step);
    }, { passive: false, capture: true });
  }

  // 引擎的 zoomAt(clientX, clientY) 名字叫 client，内部却是 `clientX - (lineX ?? size.width/2)`，
  // 而 lineX / height 都是**视图局部**坐标（core/wallView.js 的 getViewLineX、view.height/2）。
  // 所以这里必须换成相对墙体左上角的局部坐标，否则锚点整整偏掉「墙左边距」那么多
  // （满屏模式下左边距 59px），缩放时光标底下的画面会横向漂 ~20+ 世界像素。
  function localPoint(clientX, clientY) {
    if (!S.wallBox) return { x: clientX, y: clientY };
    var r = S.wallBox.getBoundingClientRect();
    return { x: clientX - r.left, y: clientY - r.top };
  }

  // 一格的倍率（原来的瞬时路径也用它，A/B 时才比得出差别）
  function zoomFactor(step) {
    var k = Math.pow(1.0015, -step);
    return Math.max(0.72, Math.min(1.42, k));   // 一次一格别跳过头
  }
  function zoomStep(cx, cy, step) {
    var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
    try {
      if (cam && cam.zoomAt) cam.zoomAt(cx, cy, zoomFactor(step));
      else zoomInstant(zoomFactor(step));
    } catch (err) { }
  }

  // 引擎的 zoomAt 是**瞬时**的：一格滚轮直接把 scale 乘 1.42（超过四成的跳变），
  // 连续滚动就是一格一格地跳，看着卡顿。这里改成按恒定速度推进的线性动画：
  // 每毫秒推进 ZOOM_RATE 的 log 倍率（log 线性 = 视觉上速度恒定、不忽快忽慢），
  // 时长与「要走的 log 距离」成正比并夹在 70–260ms，连续滚轮就在同一个目标上累加。
  // 锚点还是光标位置：每帧按 zoomAt 的倍率叠加，锚点下的世界坐标全程不动。
  function zoomSmooth(cx, cy, step) {
    var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
    if (!cam || !cam.zoomAt || !cam.getState) { zoomStep(cx, cy, step); return; }
    var cur = cam.getState().scale;
    if (!(cur > 0)) { zoomStep(cx, cy, step); return; }
    var base = S.zoom && S.zoom.goal ? S.zoom.goal : cur;   // 连续滚轮：在上一目标上继续累加
    var goal = base * zoomFactor(step);
    var dist = Math.abs(Math.log(goal / cur));
    var dur = Math.max(ZOOM_MIN_MS, Math.min(ZOOM_MAX_MS, dist / ZOOM_RATE));
    var running = !!(S.zoom && S.zoom.on);
    S.zoom = { ax: cx, ay: cy, from: cur, goal: goal, t0: nowMs(), dur: dur, on: true };
    if (!running) requestAnimationFrame(zoomFrame);
  }

  function zoomFrame() {
    var z = S.zoom;
    if (!z || !z.on) return;
    var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
    if (!cam || !cam.zoomAt || !cam.getState) { S.zoom = null; return; }
    var cur = cam.getState().scale;
    var frac = z.dur > 0 ? Math.min(1, (nowMs() - z.t0) / z.dur) : 1;
    var want = z.from * Math.pow(z.goal / z.from, frac);   // log 空间线性插值
    var factor = cur > 0 ? want / cur : 1;
    var settled = frac >= 1 || Math.abs(cam.getState().scale - z.goal) < 1e-4;
    try { cam.zoomAt(z.ax, z.ay, settled ? (z.goal / cur) : factor); } catch (err) { }
    if (settled) { S.zoom = null; return; }   // 到位就停，不加尾帧
    requestAnimationFrame(zoomFrame);
  }

  // 动画被打断（拖拽 / 归位 / 重建墙 / 卸载）时立刻停手，别和别的相机写入抢
  function zoomSmoothStop() {
    if (S.zoom) { S.zoom.on = false; S.zoom = null; }
  }

  // ── 拖拽：抑制悬浮位移 + 松手惯性 ──────────────────────────────────────────
  // 引擎自己在 pointerup 里就会 camera.startInertia(vx, vy)（dom/pointer.js 的 endPan），
  // 所以插件这层滑行必须先把引擎的惯性 stop() 掉：两段 rAF 每帧各写一次相机中心的话，
  // 位移会互相覆盖（glide 写绝对值 → 引擎在它上面再叠一帧增量 → 下一帧又被拉回来），
  // 表现出来就是高频抖动 + 收尾距离不对，也就是“拖拽时界面莫名位移”。
  // 顺序也关键：pointerup 必须用**冒泡**而不是捕获——引擎的处理器挂在 .pw-wall 上（先跑，
  // 起 inertia），舞台上的 glide() 随后才跑得到 cam.stop()；用捕获的话会被引擎随后再拉起来。
  var GLIDE_TOKEN = 0;
  var dragWatch = 0;
  var GLIDE_ON = true;         // 调试口可关，用来 A/B 对比「只有引擎惯性」时的表现
  var MIN_GLIDE_SPEED = 120;   // 世界像素/秒：低于此速交给引擎自己的惯性（minSpeed 40px/s）
  var GLIDE_TAU = 0.36;        // 速度衰减时间常数（秒）
  var GLIDE_MAX = 420;         // 滑行总距离上限（世界像素）
  var GLIDE_MAX_MS = 1400;
  var DRAG_LINGER_MS = 140;    // 没滑行时，松手后多久恢复悬浮上浮
  var LOCK_ON = true;          // 拖拽时把指针锁在原地（调试口可关，用来 A/B 对比）
  var LOCK_SIM = false;        // 仅调试：把 pointerLocked() 当成 true（CDP 拿真锁不稳定）
  var DRAG_LOCK_PX = 6;        // 和引擎的 DRAG_THRESHOLD_PX 对齐：挪过这个距离才算拖拽、才去申请锁
  var ZOOM_SMOOTH = true;      // 滚轮缩放走线性动画（调试口可关，用来 A/B 对比瞬时跳变）
  var ZOOM_RATE = 0.0026;      // 线性动画速度：每毫秒推进的 log 倍率（一格 -240 ≈ 135ms）
  var ZOOM_MIN_MS = 90;        // 单格最快也要 90ms，免得小步长时又变成“瞬时”
  var ZOOM_MAX_MS = 340;       // 一次滚轮最多 340ms，连续滚不拖沓

  function nowMs() { return (window.performance && performance.now) ? performance.now() : Date.now(); }

  function setDragging(on) {
    if (!S.stage) return;
    if (on) S.stage.classList.add('pw-dragging');
    else S.stage.classList.remove('pw-dragging');
  }

  function engineMoving() {
    var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
    try { return !!(cam && cam.isMoving && cam.isMoving()); } catch (e) { return false; }
  }

  // 用户思路（m02634）：按住左键拖拽时把指针锁在原地，光标不再扫过卡片、也不会飘出窗口/飘到宿主 UI 上，
  // 手感变成“抓着整面墙在动”，同时把「指针位置驱动的位移」这一类问题从根上去掉。
  // 依据交付文档 docs/DRAG_AND_POINTER_CAPTURE.md：
  //   §3「指针锁定就是 Pointer Capture，而且在越过阈值之后才捕获」⇒ 申请 Pointer Lock 的时机与
  //      引擎捕获同一帧、且在捕获成功之后（见 guardPointerCapture 的 hook），绝不反过来；
  //   §3.2「释放要走每一条退出路径」⇒ unlock 挂在 pointerup / pointercancel / window 兜底 / blur /
  //      失去捕获 / Esc / 退出墙（finishDrag、bindGlobalsOnce、teardown）；
  //   §3 前提 CSS（touch-action/overscroll/user-select）见 ui.js 的 PW_CSS，避免浏览器先把手势拿走。
  // 约束：宿主（WinUI3 + WebView2 visual hosting）里 requestPointerLock 要求文档处于激活状态，而且
  // 该宿主模式下 Chromium 对指针锁的支持本身有残缺（MS Edge WebView2Feedback #4968）⇒ 拿不到锁就
  // 静默回退成普通拖拽，行为不变；每次手势只申请一次（S.lockTried）。
  function pointerLocked() {
    if (LOCK_SIM) return true;   // 仅调试：CDP 里没法稳定拿到真锁，用它验证 movement 平移那条路
    try { return !!document.pointerLockElement; } catch (e) { return false; }
  }

  function lockPointer() {
    if (!LOCK_ON || !CFG.lock || S.lockTried || pointerLocked()) return false;
    var el = S.wallBox || S.stage;
    if (!el || !el.requestPointerLock) return false;
    S.lockTried = true;
    var focus = true;
    try { focus = !!document.hasFocus(); } catch (e) { }
    S.lockFocus = focus;
    try {
      // unadjustedMovement：要原始位移，别让系统加速把 movementX/Y 缩放（拿不到就算了，见 catch）
      var p = el.requestPointerLock({ unadjustedMovement: true });
      if (p && p.catch) p.catch(function () { S.lockFail = (S.lockFail || 0) + 1; });
      auditPush({ fn: 'lock', args: ['request', el === S.wallBox ? 'wall' : 'stage', focus ? 'focus' : 'nofocus'], stack: '' });
      return true;
    } catch (err) {
      try {   // 老引擎不认 options 对象：退成无参调用
        el.requestPointerLock();
        auditPush({ fn: 'lock', args: ['request-plain'], stack: '' });
        return true;
      } catch (e3) { }
      S.lockFail = (S.lockFail || 0) + 1;
      auditPush({ fn: 'lock', args: ['throw:' + String(err && err.name || '')], stack: '' });
      return false;
    }
  }

  function unlockPointer() {
    S.lockTried = false;
    if (!pointerLocked()) return;
    try { document.exitPointerLock(); } catch (e) { }
    auditPush({ fn: 'lock', args: ['exit'], stack: '' });
  }

  // 只在“拖拽真的结束、而且相机也不动了”之后才恢复悬浮；滑行（插件的或引擎自己的）还在跑的话
  // 一直按住——否则松手 140ms 后卡片就开始上浮呼吸，而相机还在滑，看起来又是一次跳变。
  function releaseDragClass() {
    var tries = 0;
    (function wait() {
      setTimeout(function () {
        if ((S.drag || S.glide || engineMoving()) && ++tries < 24) { wait(); return; }
        if (!S.drag && !S.glide) setDragging(false);
      }, DRAG_LINGER_MS);
    })();
  }

  function stopGlide() {
    S.glide = 0;
    if (!S.drag) setDragging(false);
  }

  function bindDragInertia(stage) {
    // 捕获阶段先按下去：悬浮位移必须在这一帧就停，不能等冒泡
    stage.addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      if (!S.wallBox || !S.wallBox.contains(e.target)) return;   // 工具条上的按钮不参与
      stopGlide();
      zoomSmoothStop();   // 手一按墙就停下滚轮缩放动画，别和拖拽抢相机
      // 拖拽期间关掉悬浮的上浮/呼吸动画：平移时指针会在相邻卡片之间来回掠过，
      // 每掠过一次卡片就抬 7px 再落下，看上去就是“画面莫名位移”（尤其是斜置/镜像那些卡片）。
      setDragging(true);
      var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
      if (!cam || !cam.getState) return;
      S.lockTried = false;      // 新的一次手势：允许再申请一次指针锁
      S.drag = { samples: [], ox: e.clientX, oy: e.clientY, lock: false, lastCX: e.clientX, lastCY: e.clientY };
      sampleDrag();
    }, true);
    // 挪过阈值（引擎也是这个距离才算拖拽）就去申请指针锁：太早会在“点选卡片”时也锁，手感很怪。
    // 锁住之后 clientX/clientY 会冻在锁定位（引擎按 client 差值平移 ⇒ 永远是 0，墙会不动），
    // 所以这时改由我们按 movementX/movementY 接管平移——和普通拖拽一样是「位移量」，手感一致。
    stage.addEventListener('pointermove', function (e) {
      var d = S.drag;
      if (!d) return;
      if (!d.lock) {
        var dx = e.clientX - d.ox, dy = e.clientY - d.oy;
        if (dx * dx + dy * dy < DRAG_LOCK_PX * DRAG_LOCK_PX) return;
        d.lock = true;
        d.lockSkip = true;      // 锁刚生效的第一个事件是「锁定位 - 按下位」，已经由引擎平移过，跳过避免双倍
        // 按文档 §3：申请时机与引擎捕获同一帧、且在引擎捕获**之后**。引擎的 setPointerCapture 就发生
        // 在同一个 pointermove 里（它是容器上的处理器，晚于我们这层捕获阶段），所以正常路径由
        // guardPointerCapture 的 hook 去申请；这里只放一个兜底——万一引擎那次捕获没发生
        // （容器没有 setPointerCapture、事件被别处吞了），60ms 后自己申请一次。
        setTimeout(function () { if (S.drag === d && !pointerLocked()) lockPointer(); }, 60);
        return;
      }
      if (!pointerLocked()) return;
      if (d.lockSkip) { d.lockSkip = false; d.lastCX = e.clientX; d.lastCY = e.clientY; return; }
      // 锁住之后 clientX/clientY 一般冻在锁定位（引擎按 client 差值平移 ⇒ 恒为 0），这时由我们按
      // movementX/Y 接管平移——和普通拖拽一样是「位移量」，换算与方向跟引擎一致。
      // 但宿主若锁了却仍在更新 client（WebView2 visual hosting 的残缺支持，见 MS #4968），
      // 说明引擎自己在平移，我们就别插第二只手，否则双份。
      var frozen = (e.clientX === d.lastCX && e.clientY === d.lastCY);
      d.lastCX = e.clientX; d.lastCY = e.clientY;
      if (!frozen) return;
      var mx = e.movementX || 0, my = e.movementY || 0;
      if (!mx && !my) return;
      var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
      if (cam && cam.panBy) { try { cam.panBy(mx, my); } catch (err) { } }
    }, true);
    // 冒泡阶段收尾：引擎的 endPan→startInertia 已经跑完，这里再决定是接自己的滑行还是放开悬浮。
    // 判定只看 S.drag（本次拖拽是否由我们记过），不看 e.target——指针可能在工具条上松手。
    // 收尾：触发点可能有多个（舞台冒泡 pointerup / window 冒泡 pointerup / 失去指针捕获），
    // 先到的那个生效，其余因为 S.drag 已被清掉而自动变成空操作。
    // 关键：把决策丢到 setTimeout(0)，等引擎这一轮的 endPan→startInertia→releasePointerCapture
    // 全部跑完再动手；glide() 第一件事就是 camera.stop()，这样场上只剩我们一套惯性。
    function finishDrag(why) {
      var d = S.drag;
      if (!d) { releaseDragClass(); return; }
      S.drag = null;
      unlockPointer();
      var v = velocityFrom(d.samples);
      var sp = v ? Math.round(Math.sqrt(v.vx * v.vx + v.vy * v.vy)) : 0;
      auditPush({ fn: 'release', args: [why, d.samples.length, sp, GLIDE_ON ? 1 : 0], stack: '' });
      setTimeout(function () {
        if (GLIDE_ON && v) glide(v.vx, v.vy);
        else releaseDragClass();
      }, 0);
    }
    stage.addEventListener('pointerup', function () { finishDrag('stage'); });
    stage.addEventListener('pointercancel', function () { finishDrag('cancel'); });
    // 捕获丢了（引擎在 clearPan 里 releasePointerCapture、或系统抢走）：把没结完的手势结掉，
    // 并把残留的 pw-dragging 清掉——否则悬浮上浮动画会被永久按住（文档 §3.2 的退出路径之一）。
    stage.addEventListener('lostpointercapture', function () {
      if (S.drag) finishDrag('lostcap'); else releaseDragClass();
    }, true);
    S.finishDrag = finishDrag;      // 全局兜底监听（只绑一次）转发到这里
    bindGlobalsOnce();
  }

  /* 文档 §3.3 / §7 的两条教训搬过来：
     §3.3 退出路径要跟引擎一样全（container pointerup/pointercancel、window 兜底 pointerup/pointercancel、
          window blur）——少一条就会留下 op 没释放的手势记录；
     §7  监听要**只绑一次**：插件每次导航都会重新 mount，若每次都往 window/document 上加一遍，就与
          「引擎 destroy() 摘不掉匿名闭包」同型——处理器越积越多、旧闭包（含整面墙）不可回收。
     所以这里用 S.gbound 只绑一次，处理器统一转发到 S.finishDrag / S.drag，卸载后自动空转。 */
  function bindGlobalsOnce() {
    if (S.gbound) return;
    S.gbound = true;
    window.addEventListener('pointerup', function () { if (S.finishDrag) S.finishDrag('window'); else releaseDragClass(); });
    window.addEventListener('pointercancel', function () { if (S.finishDrag) S.finishDrag('wincancel'); else releaseDragClass(); });
    // 兜底：窗口失焦 / 指针捕获丢失 / 事件丢失时别让 pw-dragging 卡住（卡住会让悬浮动画永久失效）
    window.addEventListener('blur', function () { S.drag = null; unlockPointer(); releaseDragClass(); }, true);
    // 拿不到锁时不弹错、只记数（宿主未聚焦是常见情况），拖拽照常工作。
    // 记数只认 requestPointerLock 的 promise 拒绝：pointerlockerror 事件在 WebView2 里
    // 会和 promise 拒绝一起到（一次失败两条），两边都加会把 lockFails 记成两倍。
    document.addEventListener('pointerlockerror', function () {
      S.lockErr = (S.lockErr || 0) + 1;
      if (!S.lockWarned) { S.lockWarned = true; log('指针锁：宿主拒绝（窗口未聚焦或被策略拦），本次回退普通拖拽'); }
    });
    document.addEventListener('pointerlockchange', function () {
      var on = pointerLocked();
      if (on && !S.lockLogged) { S.lockLogged = true; log('指针锁：已锁住光标，拖拽改由相对位移平移'); }
      if (!on) {
        S.lockLogged = false; S.lockWarned = false;
        // 锁在拖拽中途被系统收回（Esc / 切窗口）：手势还在就把焦点交回引擎那条 client 差值的路
        if (S.drag) { S.drag.lockSkip = true; S.drag.lastCX = -1; S.drag.lastCY = -1; }
      }
    });
    // Esc 在部分宿主里不再自动解锁，自己收一下，免得光标一直是隐藏/锁死的状态
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && pointerLocked()) unlockPointer();
    }, true);
    if (!dragWatch) dragWatch = setInterval(function () {
      if (S.stage && S.stage.classList.contains('pw-dragging') && !S.drag && !S.glide) {
        S.stage.classList.remove('pw-dragging');
      }
    }, 1000);
  }

  function sampleDrag() {
    if (!S.drag) return;
    var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
    if (cam && cam.getState) {
      var st = cam.getState();
      S.drag.samples.push({ x: st.x, y: st.y, t: nowMs() });
      if (S.drag.samples.length > 14) S.drag.samples.shift();
    }
    setTimeout(sampleDrag, 16);
  }

  function velocityFrom(a) {
    if (!a || a.length < 3) return null;
    var last = a[a.length - 1], first = a[0];
    for (var i = a.length - 2; i >= 0; i--) { if (last.t - a[i].t >= 60) { first = a[i]; break; } }
    var dt = (last.t - first.t) / 1000;
    if (dt < 0.03) return null;
    var vx = (last.x - first.x) / dt, vy = (last.y - first.y) / dt;
    if (Math.sqrt(vx * vx + vy * vy) < MIN_GLIDE_SPEED) return null;  // 慢拖不滑行
    return { vx: vx, vy: vy };
  }

  // 松手滑行：先把引擎自己的惯性停掉（它已经在 pointerup 里 startInertia 过了），再按指数衰减
  // 一帧一帧**增量**推进相机——用增量而不是绝对值，即使别处动过相机也不会被我们覆盖回旧坐标。
  function glide(vx, vy) {
    var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
    if (!cam || !cam.setCenter || !cam.getState) { releaseDragClass(); return; }
    try { if (cam.stop) cam.stop(); } catch (err) { }
    var token = ++GLIDE_TOKEN, dist = 0, frames = 0;
    var t0 = nowMs(), last = t0;
    S.glide = token;
    S.lastGlide = { v0: Math.round(Math.sqrt(vx * vx + vy * vy)), frames: 0, dist: 0, stop: 'run', trace: [] };
    function finish(why) {
      if (S.glide === token) S.glide = 0;
      if (S.lastGlide) { S.lastGlide.frames = frames; S.lastGlide.dist = Math.round(dist); S.lastGlide.stop = why; }
      releaseDragClass();
    }
    function frame() {
      if (S.glide !== token) return;                 // 被打断（新拖拽/滚轮/拆墙）
      var now = nowMs(), dt = Math.min(48, now - last) / 1000; last = now;
      var dx = vx * dt, dy = vy * dt;
      var st = cam.getState();
      var nx = st.x + dx, ny = st.y + dy;
      try { cam.setCenter(nx, ny); } catch (err) { finish('error'); return; }
      frames++;
      var after = cam.getState();
      if (S.lastGlide && S.lastGlide.trace.length < 40) {
        S.lastGlide.trace.push({ req: Math.round(dy * 100) / 100, got: Math.round((after.y - st.y) * 100) / 100,
          engine: engineMoving() ? 1 : 0, dt: Math.round(dt * 1000) });
      }
      // 撞到世界边缘时 setCenter 会被 clamp：这时就停下，不要继续在 glide 里累加坐标
      if (Math.abs(after.x - nx) > 0.5 || Math.abs(after.y - ny) > 0.5) { finish('edge'); return; }
      dist += Math.sqrt(dx * dx + dy * dy);
      var k = Math.exp(-dt / GLIDE_TAU);
      vx *= k; vy *= k;
      if (Math.sqrt(vx * vx + vy * vy) < 24 || dist > GLIDE_MAX || now - t0 > GLIDE_MAX_MS) { finish('done'); return; }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  function zoomInstant(k) {
    if (!S.wall || !S.wallBox) return;
    var cam = S.wall.getCamera();
    if (!cam) return;
    S.zoomTouched = true;      // 用户自己定的缩放，之后的重排不许把它打回断点基准
    try {
      var r = S.wallBox.getBoundingClientRect();
      if (cam.zoomAt) { cam.zoomAt(r.width / 2, r.height / 2, k); return; }   // 局部坐标：锚点=墙中心
      if (cam.getState && cam.setScale) cam.setScale(cam.getState().scale * k);
    } catch (e) { }
  }

  // 顶栏 ＋ / −：和滚轮走同一套线性动画（锚点是墙体中心），关掉动画时退回瞬时缩放
  function zoom(k) {
    if (!S.wall || !S.wallBox) return;
    if (!ZOOM_SMOOTH) { zoomInstant(k); return; }
    var r = S.wallBox.getBoundingClientRect();
    zoomSmooth(r.width / 2, r.height / 2, -Math.log(k) / Math.log(1.0015));
  }

  // ---------------- 相机写入审计（排查“莫名的整体位移”） ----------------
  // 每次相机写入 / 布局替换都记一条：谁调的（函数名+栈）、参数、前后相机状态、布局首卡坐标。
  // 命中“用户没操作相机却在动”的现场时打开 __pwWall.audit(true) 再复现。
  var AUDIT = { on: false, buf: [] };

  function camSnap(cam) {
    try {
      var st = cam.getState();
      return [Math.round(st.x * 10) / 10, Math.round(st.y * 10) / 10, Math.round(st.scale * 1000) / 1000];
    } catch (e) { return null; }
  }

  function auditPush(rec) {
    if (!AUDIT.on) return;
    rec.t = Math.round(nowMs());
    try { rec.stack = String((new Error()).stack || '').split('\n').slice(2, 6).join(' | ').replace(/\s+/g, ' ').slice(0, 320); } catch (e) { }
    AUDIT.buf.push(rec);
    if (AUDIT.buf.length > 500) AUDIT.buf.shift();
  }

  // 指针事件审计：把舞台收到的真实事件按时间记下来，用来对照相机的 panBy 记录。
  // CDP 与 WebView2 都可能把同一个物理移动投递多次/以不同坐标投递，事件表是唯一能证伪的来源。
  var EVT = { on: false, buf: [] };

  function evtPush(msg) {
    if (!EVT.on) return;
    EVT.buf.push(msg);
    if (EVT.buf.length > 400) EVT.buf.shift();
  }

  function evtHook(stage) {
    if (!stage || stage.__evtAudited) return false;
    stage.__evtAudited = true;
    ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture', 'click'].forEach(function (type) {
      stage.addEventListener(type, function (e) {
        evtPush({
          t: Math.round(nowMs()), ev: type, id: e.pointerId,
          x: Math.round(e.clientX * 10) / 10, y: Math.round(e.clientY * 10) / 10,
          btn: e.buttons, tgt: (e.target && e.target.className) ? String(e.target.className).slice(0, 28) : '',
          tr: e.isTrusted === true ? 1 : 0, pd: e.defaultPrevented ? 1 : 0
        });
      }, true);
    });
    return true;
  }

  function auditHook() {
    var cam = S.wall && S.wall.getCamera && S.wall.getCamera();
    if (!cam || cam.__audited) return false;
    cam.__audited = true;
    ['setCenter', 'setScale', 'panBy', 'zoomAt', 'setBounds', 'setViewport', 'startInertia', 'stop'].forEach(function (name) {
      var orig = cam[name];
      if (typeof orig !== 'function') return;
      cam[name] = function () {
        var before = camSnap(cam);
        var args = Array.prototype.slice.call(arguments).map(function (a) {
          return (a && typeof a === 'object') ? JSON.stringify(a) : a;
        });
        var out = orig.apply(cam, arguments);
        auditPush({ fn: name, args: args, before: before, after: camSnap(cam) });
        return out;
      };
    });
    return true;
  }

  function auditWall() {
    if (!S.wall || S.wall.__audited) return false;
    S.wall.__audited = true;
    var origLayout = S.wall.setLayout, origResize = S.wall.resize;
    if (typeof origLayout === 'function') {
      S.wall.setLayout = function (next) {
        var prev = S.layout && S.layout.cards && S.layout.cards[0];
        var out = origLayout.apply(S.wall, arguments);
        var first = next && next.cards && next.cards[0];
        auditPush({
          fn: 'setLayout', args: ['cards=' + (next && next.cards ? next.cards.length : '?')],
          before: prev ? [prev.x, prev.y] : null, after: first ? [first.x, first.y] : null,
          cam: camSnap(S.wall.getCamera())
        });
        return out;
      };
    }
    if (typeof origResize === 'function') {
      S.wall.resize = function (next, auto) {
        auditPush({ fn: 'resize', args: [JSON.stringify(next), !!auto], cam: camSnap(S.wall.getCamera()) });
        return origResize.apply(S.wall, arguments);
      };
    }
    return true;
  }

  function resetCamera() {
    if (!S.wall) return;
    zoomSmoothStop();
    try {
      var cam = S.wall.getCamera();
      if (!cam) return;
      S.zoomTouched = false;   // 归位 = 回到断点基准缩放
      if (cam.setScale && FW.getScale) cam.setScale(FW.getScale(wallViewport().width));
      if (cam.setCenter) cam.setCenter(FW.INITIAL_CAMERA.x, FW.INITIAL_CAMERA.y);
    } catch (e) { }
  }

  function focusCurrent(animate) {
    if (!S.wall || !S.layout || !S.sid) { if (animate) nethe.toast('现在没有正在播放的歌曲'); return; }
    var idx = -1;
    for (var i = 0; i < S.items.length; i++) if (S.items[i].sid === S.sid) { idx = i; break; }
    if (idx < 0) { if (animate) nethe.toast('这首不在当前页面里'); return; }
    var card = null;
    for (var k = 0; k < S.layout.cards.length; k++) if (S.layout.cards[k].itemIndex === idx) { card = S.layout.cards[k]; break; }
    if (!card) return;
    try {
      var cam = S.wall.getCamera();
      if (cam && cam.setCenter) cam.setCenter(card.x + card.width / 2, card.y + card.height / 2);
    } catch (e) { }
  }

  // ---------------- 后台自动补全 ----------------
  // 宿主每批只渲 50 行，必须把哨兵滚进视口才会继续。墙挂着的时候我们在舞台后面悄悄做这件事，
  // 让“能看到的歌”越来越多（和用户手点「更多」一个效果，只是自动的）。
  var AUTO_STEP = 150;      // 每步多拉多少首
  var AUTO_GAP = 800;       // 每步间隔（ms）

  function autoGrowStart() {
    if (!CFG.autoLoad || S.autoTimer) return;
    S.autoTimer = setTimeout(autoGrowStep, 700);
  }
  function autoGrowStop() {
    if (S.autoTimer) { clearTimeout(S.autoTimer); S.autoTimer = 0; }
  }
  function autoGrowStep() {
    S.autoTimer = 0;
    if (!S.stage || !CFG.autoLoad) return;
    var v = viewEl();
    if (!v) return;
    // 手正在墙上（拖拽/滑行）时绝不换版面：布局一换 setBounds 会重新夹相机，
    // 表现就是「拖完/拖到一半整面墙莫名位移」。等手松开、滑行停了再补。
    // 滚轮缩放的线性动画期间也让路：换版面要重挂几百张卡，会把动画的帧吃掉（看着就是掉帧）。
    if (S.drag || S.glide || S.busy || S.zoom) { S.autoTimer = setTimeout(autoGrowStep, 400); return; }
    if (!v.querySelector('.list-more')) { updateMeta(); return; }   // 已经到底
    if (S.items.length >= LIM.grow[1]) return;                      // 到硬上限
    S.busy = true;
    var target = Math.min(LIM.grow[1], S.items.length + AUTO_STEP);
    growBehind(target).then(function (ok) {
      S.busy = false;
      if (!ok || !S.stage) return;
      refresh(false);
      var more = !!(viewEl() && viewEl().querySelector('.list-more'));
      log('自动补全：已加载 ' + S.items.length + (S.kind === 'playlists' ? ' 个歌单' : ' 首') + (more ? '，继续' : '（已全部加载）'));
      if (more) S.autoTimer = setTimeout(autoGrowStep, AUTO_GAP);
    });
  }

  function updateMeta() {
    if (!S.meta) return;
    var parts = [S.items.length + (S.kind === 'playlists' ? ' 个歌单' : ' 首')];
    if (S.wall && S.wall.getMountedCount) { try { parts.push('已挂载 ' + S.wall.getMountedCount()); } catch (e) { } }
    parts.push('滚轮缩放 · 拖动平移 · 方向键移动');
    S.meta.textContent = parts.join(' · ');
    if (S.bMore) {
      var hasMore = !!(viewEl() && viewEl().querySelector('.list-more'));
      S.bMore.style.display = hasMore ? '' : 'none';
    }
  }

  function restyle() {
    if (!S.stage) return;
    refresh(true);
  }

  function refresh(more) {
    if (!S.stage || !S.host) return;
    var next = function () {
      if (!S.stage || !S.host) return;
      S.items = readItems(S.host);
      if (!S.items.length) return;
      var layout;
      try {
        layout = FW.buildWallLayout({
          items: S.items, viewport: wallViewport(),
          metrics: { cellSize: CFG.cell, gap: CFG.gap },
          reservedPerBlock: CFG.reserved, maxInstances: FW.MAX_RENDERED_INSTANCES
        });
      } catch (e) { return; }
      S.layout = layout;
      if (!S.wall) { buildWall(); return; }
      try { S.wall.setLayout(layout); S.wall.setItems(S.items); } catch (e2) { }
      updateMeta();
    };
    if (more) {
      S.busy = true;
      S.grow = Math.min(2000, Math.max(CFG.grow, (S.grow || CFG.grow) + CFG.grow));
      growVisible(S.grow).then(function () {
        S.busy = false;
        var n = viewEl() ? viewEl().querySelectorAll('.song-row').length : 0;
        log('加载更多：目标 ' + S.grow + ' 首，已渲 ' + n + ' 行');
        next();
      });
    }
    else next();
  }

  // ---------------- 播放状态 ----------------
  function markLive() {
    if (!S.stage) return;
    pwAll(S.stage, '.lattice-poster.pw-live').forEach(function (el) { el.classList.remove('pw-live'); });
    if (!S.sid) return;
    var t = S.stage.querySelector('.lattice-poster[data-sid="' + S.sid + '"]');
    if (t) t.classList.add('pw-live');
  }

  // ---------------- 主循环 ----------------
  function schedule(delay) {
    clearTimeout(S.timer);
    S.timer = setTimeout(tick, delay == null ? 120 : delay);
  }

  function tick() {
    var v = viewEl();
    if (!v) { setTimeout(start, 300); return; }
    var h = detectHost();

    // 换页时（宿主重建了列表节点）清掉「强制列表 / 强制照片墙」的手动状态，
    // 否则用户在某一页点过“返回列表”之后，之后所有页面都不会再自动切换。
    if (!h || h.node !== S.node) { if (S.override) S.override = null; }
    S.node = h ? h.node : null;

    if (S.stage && (!S.stage.isConnected || !h || h.node !== S.host.node)) teardown();
    if (!h) { syncFab(false); return; }

    var want = S.override || ((CFG.auto && isAutoPage(h)) ? 'wall' : 'list');
    if (want === 'wall') {
      if (!S.stage) mount(h);
      else if (S.host.node === h.node && !S.busy) {
        var n = h.node.querySelectorAll(h.kind === 'songs' ? '.song-row' : '.pl-card').length;
        if (n !== S.items.length) refresh(false);
      }
      syncFab(true);
      markLive();
    } else {
      if (S.stage) teardown();
      syncFab(true);
    }
  }

  function start() {
    var v = viewEl();
    if (!v) { setTimeout(start, 300); return; }
    S.view = v;
    if (S.mo) { try { S.mo.disconnect(); } catch (e) { } }
    S.mo = new MutationObserver(function () { if (!S.busy) schedule(140); });
    try { S.mo.observe(v, { childList: true, subtree: true }); } catch (e) { }
    window.addEventListener('resize', function () { sizeStage(); schedule(80); }, false);
    ensureFab();

    // 下面全部同步执行：绝不能挂在 nethe.data 的 Promise 后面 —— 当前宿主版本
    // 的 plugin_data 回复缺 rid，data.read/write 的 Promise 永远不会 settle，
    // 一旦 await 它，样式注入 / 设置项注册 / 事件订阅就全都静默丢失。
    injectCss();
    loadCfg();
    regSettings();
    try {
      nethe.on('track', function (ns) {
        S.sid = String(ns && (ns.Id || ns.id) || '');
        S.sidTitle = String(ns && (ns.Title || ns.name) || '');
        markLive();
      });
    } catch (e2) { }
    schedule(200);
    // 调试口：给 dev/e2e.ps1 和手工排查用（只读 + 少两个动作），不参与业务逻辑
    try {
      window.__pwWall = {
        S: S,
        cam: function () { return (S.wall && S.wall.getCamera) ? S.wall.getCamera() : null; },
        zoom: zoom, reset: resetCamera, mount: function () { S.override = 'wall'; schedule(10); },
        list: function () { S.override = 'list'; schedule(10); },
        gliding: function () { return S.glide > 0; },
        lastGlide: function () { return S.lastGlide || null; },
        dragging: function () { return !!(S.stage && S.stage.classList.contains('pw-dragging')); },
        setGlide: function (on) { GLIDE_ON = !!on; if (!GLIDE_ON) stopGlide(); return GLIDE_ON; },
        zoomAnim: function () { return S.zoom ? { ax: S.zoom.ax, ay: S.zoom.ay, from: S.zoom.from, goal: S.zoom.goal, dur: S.zoom.dur, t: Math.round(nowMs() - S.zoom.t0) } : null; },
        setZoomSmooth: function (on) { ZOOM_SMOOTH = !!on; if (!ZOOM_SMOOTH) zoomSmoothStop(); return ZOOM_SMOOTH; },
        lockOn: function (on) { LOCK_ON = !!on; if (!LOCK_ON) unlockPointer(); return LOCK_ON; },
        lockSim: function (on) { LOCK_SIM = !!on; return LOCK_SIM; },
        locked: function () { return pointerLocked(); },
        lockFails: function () { return S.lockFail || 0; },
        lockErrs: function () { return S.lockErr || 0; },
        lockTried: function () { return !!S.lockTried; },
        lockFocus: function () { return !!S.lockFocus; },
        docFocus: function () { try { return !!document.hasFocus(); } catch (e) { return false; } },
        capFails: function () { return S.capFail || 0; },
        stopGlide: stopGlide,
        audit: function (on) {
          AUDIT.on = !!on; AUDIT.buf = [];
          if (AUDIT.on) { auditHook(); auditWall(); evtHook(S.stage); }
          return { on: AUDIT.on, camHooked: !!(S.wall && S.wall.getCamera && S.wall.getCamera().__audited), wallHooked: !!(S.wall && S.wall.__audited), evtHooked: !!(S.stage && S.stage.__evtAudited) };
        },
        auditDump: function () { return AUDIT.buf.slice(); },
        auditClear: function () { AUDIT.buf = []; return true; },
        evt: function (on) { EVT.on = !!on; EVT.buf = []; if (EVT.on) evtHook(S.stage); return { on: EVT.on, hooked: !!(S.stage && S.stage.__evtAudited) }; },
        evtDump: function () { return EVT.buf.slice(); },
        evtClear: function () { EVT.buf = []; return true; }
      };
    } catch (e3) { }
    log('插件就绪 · 自动切换范围=' + (CFG.rec ? '所有列表页' : '仅歌单类页面') + ' · cell=' + CFG.cell + ' gap=' + CFG.gap + ' reserved=' + CFG.reserved + ' grow=' + CFG.grow);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
