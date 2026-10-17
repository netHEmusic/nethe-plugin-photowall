/* ui.js —— 歌单照片墙：样式 + DOM 小工具（注入顺序：photowall.bundle.js → ui.js → main.js）
 * 三个文件被宿主拼进同一个函数体，所以这里的顶层 var / function 对 main.js 可见。
 * 样式全部挂在 .pw-* 前缀下，并用宿主的 --md-accent-color-* 变量，跟随主题/配色切换。
 */

/* 照片墙自带样式（wall.css，由 FoliaWall 打包时内联）在 ui.js 里单独注入，
   这样即使 CSS 注入失败也不影响逻辑。 */
var PW_CSS = `
/* ===== 舞台 ===== */
.pw-stage{position:sticky;top:0;z-index:5;display:flex;flex-direction:column;gap:8px;
  padding:8px;box-sizing:border-box;border-radius:16px;overflow:hidden;
  user-select:none;-webkit-user-select:none;overscroll-behavior:none;
  background:linear-gradient(165deg,rgba(var(--md-accent-color-grey-base-rgb),.07),rgba(0,0,0,.22));
  border:1px solid rgba(var(--md-accent-color-grey-base-rgb),.10);
  box-shadow:0 12px 34px rgba(0,0,0,.28);}
/* 正在逼宿主演染完整列表时先藏起来，否则会看到列表一路滚到底 */
.pw-stage.pw-loading{display:none;}
/* 铺满模式：舞台直接挂在 #main 里（宿主 #main 是 position:relative + overflow:clip），
   absolute 铺满整个主区域，把搜索框那条顶栏也盖住；右上角留 152px 避开系统按钮
  （宿主自己也是这么给 #topbar 留的：css/effects.css:758）。 */
.pw-stage.pw-full{position:absolute;inset:0;z-index:10;gap:0;padding:0;
  border:none;border-radius:0;box-shadow:none;background:var(--card-bg);}
/* 满屏模式下工具栏必须定高 + 不换行：条一换行（或字数变化把它挤到换行边界），
   .pw-wall 的高度就变，引擎的 ResizeObserver 会 resize(..., autoScale=true) →
   camera.setScale(断点基准 0.52/0.64/0.76)，把用户滚轮调好的缩放悄悄打回基准
   ⇒ 整面墙“整体位移”。定高后墙体尺寸在纯文字变化下恒定，RO 不会再误触发。 */
.pw-stage.pw-full .pw-bar{padding:0 152px 0 20px;height:47px;max-height:47px;overflow:hidden;
  flex-wrap:nowrap;border-bottom:1px solid rgba(var(--md-accent-color-grey-base-rgb),.06);}
.pw-stage.pw-full .pw-bar .pw-meta{flex:1 1 auto;min-width:0;overflow:hidden;text-overflow:ellipsis;}
.pw-stage.pw-full .pw-wall{border-radius:0;}
.pw-bar{flex:0 0 auto;display:flex;align-items:center;gap:10px;padding:6px 8px 2px;flex-wrap:wrap;}
.pw-title{font-size:15px;font-weight:700;color:var(--md-accent-color-secondary);max-width:34vw;
  overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.pw-meta{font-size:12px;opacity:.55;white-space:nowrap;}
.pw-spacer{flex:1 1 auto;}
.pw-btn{display:inline-flex;align-items:center;gap:6px;height:28px;padding:0 12px;border-radius:9px;
  border:1px solid rgba(var(--md-accent-color-grey-base-rgb),.16);
  background:rgba(var(--md-accent-color-grey-base-rgb),.08);color:var(--md-accent-color-secondary);
  font-size:12px;cursor:pointer;transition:background .15s,transform .12s,border-color .15s;white-space:nowrap;}
.pw-btn:hover{background:rgba(var(--md-accent-color-grey-base-rgb),.16);border-color:rgba(var(--md-accent-color-grey-base-rgb),.28);}
.pw-btn:active{transform:scale(.96);}
.pw-btn.on{background:var(--md-accent-color);border-color:transparent;color:#111;font-weight:600;}
.pw-btn.icon{width:28px;padding:0;justify-content:center;font-size:15px;font-weight:700;}
.pw-btn[disabled]{opacity:.4;cursor:default;}
.pw-sep{width:1px;height:18px;background:rgba(var(--md-accent-color-grey-base-rgb),.16);}

/* ===== 墙体容器 ===== */
/* touch-action/overscroll/user-select 是交付文档 §3 的前提：不让浏览器把拖拽当成滚动手势拿走。 */
.pw-wall{position:relative;flex:1 1 auto;min-height:0;border-radius:12px;overflow:hidden;touch-action:none;
  overscroll-behavior:none;cursor:grab;
  background:radial-gradient(120% 90% at 20% 0%,rgba(var(--md-accent-color-grey-base-rgb),.10),rgba(0,0,0,.30) 70%);}
.pw-stage.pw-dragging .pw-wall{cursor:grabbing;}
.pw-wall canvas,.pw-wall>*{outline:none;}

/* ===== 状态层（加载 / 空 / 提示） ===== */
.pw-hint{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:10px;color:var(--md-accent-color-secondary);font-size:13px;text-align:center;pointer-events:none;}
.pw-hint b{font-size:15px;}
.pw-hint .pw-muted{opacity:.6;font-size:12px;max-width:60%;}
.pw-hint button{pointer-events:auto;}
.pw-spin{width:26px;height:26px;border-radius:50%;border:2px solid rgba(var(--md-accent-color-grey-base-rgb),.25);
  border-top-color:var(--md-accent-color);animation:pw-spin .9s linear infinite;}
@keyframes pw-spin{to{transform:rotate(360deg);}}

/* ===== 照片墙卡片上的插件加成 ===== */
.lattice-poster .pw-acts{position:absolute;left:0;right:0;bottom:0;display:flex;gap:4px;padding:6px;
  background:linear-gradient(transparent,rgba(0,0,0,.62));opacity:0;transform:translateY(6px);
  transition:opacity .16s,transform .16s;pointer-events:none;z-index:3;}
.lattice-poster:hover .pw-acts,.lattice-poster:focus-within .pw-acts{opacity:1;transform:none;}
.pw-act{width:26px;height:26px;border-radius:8px;border:1px solid rgba(255,255,255,.18);
  background:rgba(20,20,20,.62);color:#f2f2f2;cursor:pointer;display:inline-flex;align-items:center;
  justify-content:center;font-size:12px;padding:0;pointer-events:auto;transition:background .14s,transform .12s;}
.pw-act:hover{background:var(--md-accent-color);color:#111;border-color:transparent;}
.pw-act:active{transform:scale(.92);}
.pw-act svg{width:13px;height:13px;display:block;fill:none;stroke:currentColor;stroke-width:2;
  stroke-linecap:round;stroke-linejoin:round;}
.lattice-poster.pw-live{box-shadow:0 0 0 2px var(--md-accent-color),0 10px 30px rgba(0,0,0,.45);}
/* 序号用引擎自带的 .lattice-poster-badge；这里原来还有自制的 .pw-pill（#001），和它摞成两个框，已删除 */
.lattice-poster.pw-live .lattice-poster-badge{background:var(--md-accent-color);color:#111;font-weight:700;}
.pw-eq{position:absolute;top:6px;right:6px;z-index:3;display:none;gap:2px;align-items:flex-end;height:12px;}
.lattice-poster.pw-live .pw-eq{display:flex;}
.pw-eq i{width:3px;background:var(--md-accent-color);border-radius:1px;animation:pw-eq .9s ease-in-out infinite;}
.pw-eq i:nth-child(1){height:5px;animation-delay:0s;}
.pw-eq i:nth-child(2){height:11px;animation-delay:.18s;}
.pw-eq i:nth-child(3){height:7px;animation-delay:.36s;}
@keyframes pw-eq{0%,100%{transform:scaleY(.5);}50%{transform:scaleY(1);}}

/* ===== 白边：从「选中」改成「鼠标悬浮才出现」 ===== */
/* 1) 收掉引擎给「选中/键盘焦点」卡片画的常驻白边（正在播放的强调描边保留）。 */
.pw-wall .lattice-poster.is-focused:not(:hover):not(.pw-live),
.pw-wall .lattice-poster:focus-visible:not(:hover):not(.pw-live){box-shadow:none!important;}
/* 2) 悬浮：白边 + 上浮 + 轻微呼吸（用独立的 translate 属性写动画，
      因为引擎把卡片位置写在行内 style 的 transform 上，动 transform 会被覆盖）。 */
.pw-wall .lattice-poster{transition:box-shadow .22s ease,filter .22s ease,translate .26s cubic-bezier(.2,.8,.3,1);}
.pw-wall .lattice-poster:hover{z-index:5;translate:0 -7px;
  box-shadow:0 0 0 1px rgba(0,0,0,.60),0 0 0 4px var(--text-primary,#fff),0 0 0 5px rgba(0,0,0,.34),
    0 20px 36px rgba(0,0,0,.46)!important;
  animation:pw-hover-float 3.2s ease-in-out .16s infinite;}
@keyframes pw-hover-float{0%,100%{translate:0 -7px;}50%{translate:0 -13px;}}
/* 3) 拖拽/平移期间不要上浮：平移时指针会在相邻卡片间来回掠过，每次掠过都抬 7px 再落下，
      看上去像“画面莫名位移”（斜置/镜像的卡片尤其明显）。白边保留 —— 它不改几何。
      抑制要「进场瞬时、退场缓慢」：拖拽期间连 translate 过渡一起去掉，按下的瞬间就停；
      松手（且滑行结束）后过渡回来，卡片是渐变上浮而不是一下跳上去。 */
.pw-stage.pw-dragging .lattice-poster{transition:box-shadow .22s ease,filter .22s ease;}
.pw-stage.pw-dragging .lattice-poster:hover{translate:none!important;animation:none!important;}

/* ===== 悬浮入口按钮（手动切换） ===== */
.pw-fab{position:fixed;right:26px;bottom:104px;z-index:19;display:inline-flex;align-items:center;gap:7px;
  height:34px;padding:0 14px;border-radius:19px;cursor:pointer;font-size:12px;font-weight:600;
  border:1px solid rgba(var(--md-accent-color-grey-base-rgb),.18);
  background:var(--md-accent-color-bg-darken);color:var(--md-accent-color-secondary);
  box-shadow:0 8px 24px rgba(0,0,0,.35);backdrop-filter:blur(6px);transition:transform .14s,background .16s;}
.pw-fab:hover{transform:translateY(-2px);}
.pw-fab.on{background:var(--md-accent-color);color:#111;border-color:transparent;}
.pw-fab svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round;}

/* 照片墙打开时隐藏宿主列表（保留布局高度，滚动条照旧） */
/* 挂墙时把宿主列表整块收起来：用 display:none 而不是 visibility:hidden —— 后者仍占
   版面高度，会把 sticky 的舞台顶到几百行之外（表现为「墙是空的」）。 */
#view.pw-on .page{display:none;}
`;

var PW_ICON = {
  wall: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.4"/><rect x="14" y="3" width="7" height="7" rx="1.4"/><rect x="3" y="14" width="7" height="7" rx="1.4"/><rect x="14" y="14" width="7" height="7" rx="1.4"/></svg>',
  play: '<svg viewBox="0 0 24 24"><path d="M7 4.5l12 7.5-12 7.5z"/></svg>',
  add: '<svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>',
  dl: '<svg viewBox="0 0 24 24"><path d="M12 4v11"/><polyline points="7 11 12 16 17 11"/><path d="M5 20h14"/></svg>',
  list: '<svg viewBox="0 0 24 24"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/></svg>'
};

function pwEl(tag, cls, html) {
  var e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined && html !== null) e.innerHTML = html;
  return e;
}

function pwBtn(cls, html, title) {
  var b = pwEl('button', cls || 'pw-btn', html);
  b.type = 'button';
  if (title) b.title = title;
  return b;
}

/* 歌曲 / 歌单封面 URL：把宿主缩略图地址换成照片墙要的大图（尺寸够大才不糊） */
function pwCover(url, size) {
  var u = String(url == null ? '' : url).trim();
  if (!u) return '';
  var n = size || 320;
  if (/\?param=\d+y\d+$/.test(u)) return u.replace(/\?param=\d+y\d+$/, '?param=' + n + 'y' + n);
  if (u.indexOf('?') >= 0) return u + '&param=' + n + 'y' + n;
  return u + '?param=' + n + 'y' + n;
}

function pwSlot(host, sel) { try { return host ? host.querySelector(sel) : null; } catch (e) { return null; } }
function pwText(el) { return el ? String(el.textContent || '').replace(/\s+/g, ' ').trim() : ''; }
function pwAll(host, sel) { try { return Array.prototype.slice.call((host || document).querySelectorAll(sel)); } catch (e) { return []; } }
function pwSleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
