# 歌单照片墙 · netHEmusic 插件

把 netHEmusic 的**歌单页 / 歌曲列表页**换成一面可拖拽、可缩放的 3D 照片墙：
封面像照片一样贴在墙上，悬浮就能播放 / 加入播放列表 / 下载，缩放平移像在看一面真实的照片墙。

```
照片墙：滚轮缩放 · 拖拽平移 · 方向键移动焦点 · Enter/Space 播放 · 点卡片播放
```

---

## 安装

插件就是「一个文件夹 + manifest.json」，放进宿主插件目录即可：

```
%APPDATA%\netHEmusic\plugins\photowall-playlist\
├─ manifest.json
├─ ui.js                      样式 + DOM 小工具
├─ main.js                    插件主逻辑
└─ vendor\photowall.bundle.js 照片墙引擎（由 tools 脚本打包生成）
```

```powershell
# 从本仓库安装/更新（会自动装到上面那个目录，并清掉从工作区带过来的 Low 完整性标签）
powershell -ExecutionPolicy Bypass -File dev\install.ps1
```

装完在「插件」页里点一次**重新加载全部**（或重启客户端）就会生效；插件页里能看到
`photowall-playlist` 已启用，权限为 `ui, events, settings, filesystem`。

## 使用

| 场景 | 操作 |
| --- | --- |
| 进入**歌单类**页面（我的歌单 / 某个歌单 / 排行榜） | 默认**自动**变成照片墙（设置里可关） |
| 照片墙的版面 | 挂墙时舞台**铺满整个主区域**（连搜索框那条顶栏一起盖住），播放条仍浮在最上层 |
| 首页「每日推荐」、搜索结果 | 默认保持宿主原样（打开设置里的 `rec` 才一起切换） |
| 切回宿主列表 | 顶栏右侧 **「列表」** 按钮，或右下角悬浮按钮 |
| 手动进入照片墙 | 右下角悬浮按钮（「照片墙」，任何有列表的页面都能点） |
| 播放某一首 | 点卡片，或卡片悬浮后点 ▶ |
| 加入播放列表 / 下载 | 卡片悬浮后点 ＋ / ↓ |
| 打开某个歌单（歌单卡片页） | 点卡片 |
| 卡片悬浮反馈 | 鼠标移到照片上：白色描边 + 照片轻微上浮并缓慢呼吸（移开即消失）；**拖拽期间自动关掉**，松手后恢复 |
| 缩放 | **滚轮**（以光标为锚点，**线性动画**推进：一格约 135ms、每帧最多约 8%，不再是「一格跳 42%」那种卡顿）；顶栏 ＋ / − 同一套动画；调好之后**不会被后台补全/工具条文字变化打回基准**（只有窗口宽度真的变了才按断点重算） |
| 平移 | 在墙上按住拖拽，墙跟着指针 1:1 移动（引擎越过 6px 阈值后 `setPointerCapture`，指针跑出墙体/窗口也不断线）；松手后有惯性滑行（插件接管，只有一套惯性在跑：松手速度 ≥120px/s 才滑，约 0.36s 指数衰减，最远 420px；按下或滚轮立即停）。可选 `lock` 设置：按住时额外申请浏览器的 Pointer Lock（本机 WebView2 拒绝，自动回退） |
| 移动焦点 | 方向键（照片墙自带），Enter / Space 选中 |
| 回到画面中心 | 顶栏「归位」 |
| 定位正在播放的那首 | 顶栏「正在播放」（播放中的卡片会亮起描边） |
| 加载更多歌曲 | **自动**：挂墙后每 0.8s 自动再放 150 首，直到整页加载完（`autoLoad`，可关）；也可以点顶栏「更多」手动一批 |

## 设置

设置项出现在宿主**设置页**最下面的「插件」分组里（`settings` 权限），
值由宿主统一保存在 `%APPDATA%\netHEmusic\plugin-data\photowall-playlist\settings\` 下：

| 键 | 说明 | 默认 |
| --- | --- | --- |
| `auto` | 歌单类页面自动切成照片墙 | 开 |
| `rec` | 首页「每日推荐」/ 搜索结果也自动切换 | 关 |
| `cell` | 卡片尺寸（px，72–260） | 128 |
| `gap` | 卡片间距（px，2–28） | 8 |
| `reserved` | 每块留空位（0–6）；**0 = 把版面铺满**，越大留白越多 | 0 |
| `acts` | 卡片悬浮按钮（播放/加入列表/下载） | 开 |
| `grow` | 每次往后加载多少首（50–2000）；自动补全 /「更多」每轮加这么多 | 300 |
| `autoLoad` | 照片墙模式下自动补全后面的歌曲（等价于连点「更多」） | 开 |
| `lock` | 拖拽时把光标锁在按下的位置（Pointer Lock，消除拖拽位移）。顺序按交付文档 §3：先让引擎自己的指针捕获（它才是真正的「鼠标锁定」）做成，**捕获成功之后**才申请 Pointer Lock，绝不反过来（反过来会让引擎的 `setPointerCapture` 抛 `InvalidStateError` ⇒ 拖完莫名位移）。宿主拒绝（未聚焦 / 无瞬时激活 / 视觉托管）就自动回退普通拖拽，只记数 + 一条日志 | 开 |
> 宿主把 `type:'number'` 渲染成 `min=0 max=100` 的滑块（`app.js:2833`），
> 所以范围超过 0–100 的 `cell` / `grow` 用 `type:'text'` 让用户直接填数字，
> `gap` / `reserved` 用滑块。

## 工作原理（为什么这样做）

- **只读宿主 DOM**：插件不碰播放器内部状态，所有操作都通过点击宿主已有的元素完成
  （歌曲行上的 `[data-do=play|add|dl]`、歌单卡片自己的 `onclick`）。宿主改版时最多退化成
  「照片墙里点不动」，不会把播放器搞坏。
- **长列表要“逼”宿主渲染**：`renderSongs()` 每批只渲染 50 行，剩下的靠底部哨兵
  `.list-more` 进视口再追加；而挂墙后宿主页面是 `display:none`，哨兵没有布局、滚不动。
  所以插件在挂墙/点「更多」时会**先把宿主页面放出来**（舞台临时 `display:none`），
  逐批把行渲出来（上限 `grow`，「更多」每次再 +`grow`，封顶 2000），再从已经渲染好的行里读数据。
  **自动补全**（`autoLoad`）就是这么循环：挂墙成功后每 0.8s 补一批（150 首），
  直到 `.list-more` 消失或到 2000 首；补的时候用的是「把宿主页面放出来」的
  `growBehind()`——舞台是不透明的 `pw-full`，盖在宿主页面上方，所以看不见闪烁。
- **拖拽时不给卡片任何位移**：卡片悬浮是 CSS `:hover` 的上浮动画，
  而拖拽时指针会扫过一张张卡片，每扫过一张就抬起再落下 ⇒ 看起来像「界面自己乱动」。
  所以 `pointerdown` 时给舞台加 `.pw-dragging`，其 `:hover` 位移/动画全部 `!important` 关掉；
  抑制期**把 `translate` 的过渡去掉**（按下那一瞬就停），非抑制期再挂回来（松手是滑回去而不是弹回来）。
  这个类会一直留到**滑行结束**（`!S.drag && !S.glide && !camera.isMoving()` 才移除），
  否则松手后卡片会在相机还在滑的时候突然上浮并开始呼吸。
- **鼠标锁定：先跟引擎对齐，再谈浏览器的 Pointer Lock**（按交付文档 `FoliaExtract\docs\DRAG_AND_POINTER_CAPTURE.md`
  §3「"鼠标锁定"就是 Pointer Capture」重做）。真正让「指针跑出墙体/窗口也不断线」的是引擎自己的
  `container.setPointerCapture(event.pointerId)`（越过 6px 阈值才捕获，我们和它一致），我们的职责是
  **别把它弄坏**：`guardPointerCapture()` 包住容器上的 `setPointerCapture`（失败只记数不抛），
  并且**等引擎这次捕获做成之后再申请** Pointer Lock——顺序反了就会让引擎的 `setPointerCapture` 抛
  `InvalidStateError`（宿主日志刷屏那条），而且引擎的 `onPointerMove` 没有 try/catch，异常会打断它后面的
  `pan.last = …` 与 `camera.panBy(step)` ⇒ 下一条 move 按「按下点到当前点」的整段距离平移 = 用户说的
  「莫名整体位移」。所以现在：
  ① `pointermove` 过阈值只置标志 + 兜底（60ms 后万一引擎没捕获再自己申请），主路径由 `guardPointerCapture`
     在引擎捕获**之后**调 `lockPointer()`（`requestPointerLock({unadjustedMovement:true})`，老引擎不认就退成无参）；
  ② 锁上之后浏览器只更新 `movementX/movementY`、`clientX/clientY` 冻在锁定位，而引擎按 client 差值平移
     ⇒ 这时由插件按 movement 接管平移（`cam.panBy(mx,my)`，换算/方向与引擎一致，`lock-pan.js` 实测
     `(0,-40)(0,-40)(-20,0)` ⇒ 相机 `+26/+105` = `mov/scale` 1:1）；但若宿主锁了却仍在更新 client
     （WebView2 的残缺支持），说明引擎自己在平移，我们就**不插第二只手**（靠 client 是否还在变判断）；
  ③ 退出路径按文档 §3.2/§3.3 铺全：`pointerup`/`pointercancel`（舞台 + window 兜底）/`blur`/
     `lostpointercapture`/`Esc`/退出墙，全部 `unlockPointer()`；`unadjustedMovement` 拿原始位移；
     **全局监听只绑一次**（`bindGlobalsOnce()` + `S.gbound`，文档 §7 的教训：插件每次导航都重新 mount，
     每次往 window/document 上叠一遍就会像引擎 `destroy()` 摘不掉匿名闭包一样越积越多）。
  ④ 拿不到锁（`document.hasFocus()===false`、无瞬时激活、策略拦）就静默回退普通拖拽，只记数 + 一条日志
     （锁上 `指针锁：已锁住光标，拖拽改由相对位移平移`，被拒 `指针锁：宿主拒绝（窗口未聚焦或被策略拦），本次回退普通拖拽`）。
  **本机（WinUI3 + WebView2 视觉托管）实测拿不到 Pointer Lock**：`locked:false`、每次手势
  `lockFails:1`/`lockErrs:1`，上游 issue `MicrosoftEdge/WebView2Feedback#4968` 记录的现象正是
  「光标还在、页面收不到 pointermove 之后的事件、Esc 之后也起不来」。所以锁在本机是「申请了、被拒、零报错、
  回退」；而在支持的环境里自动生效。设置项 `lock` 默认**开**（用户要求尝试锁定），不想看到光标被隐藏
  或不想多那一条日志可以关掉。
- **引擎的 `setPointerCapture` 兜底**：`dom/pointer.js` 里 `container.setPointerCapture(event.pointerId)`
  没有 try/catch，只要那一刻指针不是 active（申请指针锁、事件被重复投递、拖拽中窗口失焦都可能）
  就抛 `InvalidStateError` 并冒到宿主日志。`guardPointerCapture()` 在墙体容器上包一层同名方法：
  `try` 里照常调原方法、失败只 `S.capFail++` + 审计，并把返回值透出去（引擎不读返回值）。
  正常情况 `capFails()` 恒为 0，并且事件表里能看到一条 `lostpointercapture` —— 那就是「捕获拿到了、
  后来按规矩释放了」的证据（`dev\gesture.ps1` + `__pwWall.evtDump()` 实测：`events:11 / up:1 / lostcap:1 / errs:0`）。
- **惯性只允许一套在跑**：引擎自己也有一套松手惯性
  （`dom/pointer.js` 的 `endPan → camera.startInertia(vx, vy)`，`WALL_PAN_INERTIA.timeConstant=280ms`），
  插件又补了一套，两套各起一个 `requestAnimationFrame` 抢同一个相机 ⇒ 每帧互相覆盖，
  表现出来就是「拖完莫名位移 + 抖动」。现在：
  ① `pointerup` 监听从捕获改成**冒泡**，让引擎先 `endPan/startInertia`；
  ② 插件的 `glide()` 第一件事就是 `camera.stop()` 把引擎惯性停掉，全程只有插件这一套在动
  （实测滑行期间逐帧 `engine:0`、`req === got`）；
  ③ 推进改成**增量**（每帧读当前 `getState()` 再加 `v·dt`），即使有别的东西动过相机也不会被覆盖；
  ④ 撞到世界边界（`|实际-请求| > 0.5`）立刻结束滑行，不再空转累加。
  插件这套的常数：松手速度 ≥120 世界像素/秒才滑，`τ=0.36s` 指数衰减，最远 420px / 最长 1400ms。
- **用户的缩放不能被后台重排打回基准**：引擎给墙体容器挂了 `ResizeObserver`
  （`dom/createWall.js` 的 `observer.observe(container)`），容器尺寸一变就
  `resize(next, autoScale=true)` → `camera.setScale(getScale(viewport.width))`——
  那是**窗口尺寸变化**用的断点缩放（0.52 / 0.64 / 0.76）。
  可是容器**高度**会被插件自己改（满屏模式的工具条里，`updateMeta()` 每次重排都重写
  「365 首 · 已挂载 N」，条子一换行墙体就矮一截），于是用户刚用滚轮调好的缩放被悄悄打回基准，
  看起来就是「拖完之后整面墙莫名整体位移」。两道防线：
  ① 满屏模式的工具条**定高 + 不换行**（`.pw-stage.pw-full .pw-bar{height:47px;flex-wrap:nowrap;overflow:hidden}`，
  标题/副标题都省略号），纯文字变化不再改变墙体尺寸，`ResizeObserver` 根本不触发；
  ② `guardAutoRescale()` 包一层 `wall.resize`：只有视口**宽度**真的变了才接受断点缩放，
  宽度没变时把缩放还原成用户当前值（`S.zoomTouched` 由滚轮/± 按钮置位，`归位`/新墙清零），
  **相机位置也一样还原**（高度变化会顺手 `setBounds`/`setViewport` 把相机 clamp 一下，
  同样表现为「莫名整体位移」；`setCenter` 会按新 bounds 再 clamp，不会推到非法位置）。
- **滚轮缩放走线性动画，而且锚点必须换成局部坐标**：
  引擎的 `camera.zoomAt(cx, cy, factor)` 是**瞬时**的——一格滚轮直接把 `scale` 乘到 1.42（
  超过四成的跳变），连续滚动就是一格一格地跳，看着卡顿。插件改成按**恒定速度**推进的线性动画：
  每毫秒推进 `ZOOM_RATE`（log 倍率，log 线性 = 视觉速度恒定），时长与被推进的 log 距离成正比
  并夹在 `90–340ms`（一格 -240 ≈ 135ms），连续滚轮在同一个目标上累加、锚点跟着最新光标位置；
  每帧用 `zoomAt(局部锚点, 想要的 scale / 当前 scale)` 叠加，锚点下的世界坐标全程不动。
  另外发现引擎的 `zoomAt` 参数虽叫 `clientX/clientY`，内部却是
  `clientX - (lineX ?? size.width/2)`，而 `lineX`/`height` 都是**视图局部**量
  （`core/wallView.js` 的 `getViewLineX`、`view.height/2`）⇒ 传屏幕坐标会让锚点整整偏掉一个
  左边距（满屏模式 59px），缩放时光标底下的画面横向漂 ~23 世界像素；插件统一传
  相对墙体左上角的局部坐标后，实测漂移只有 **0.3 世界像素**（`dev\zoom-trace.ps1` 的 `worldX`）。
  动画被打断（按下拖拽/归位/重建墙/退出）会立刻停手，不与别的相机写入抢。
- **手在墙上时不换版面**：自动补全在拖拽 / 滑行期间让路（每 400ms 再看一眼，
  `S.drag || S.glide` 就继续等），避免 `refresh()` 换布局时 `setBounds` 在手的下面重新夹相机。
- **页面切换用 MutationObserver 兜底**：宿主每次导航都会 `view.innerHTML = ''`，
  插件监听 `#view` 的子树变化，重新探页 / 重挂载，不依赖宿主的内部路由函数。
- **挂墙时舞台铺满整个主区域**：舞台不放进 `#view`，而是直接挂到宿主 `#main` 上
  （`#main` 本身是 `position:relative`），用 `position:absolute;inset:0` 铺满，
  连搜索框那条顶栏一起盖住，顶栏位置换成插件自己的工具条（工具条右侧留 152px
  给系统的 最小化/最大化/关闭 按钮，和宿主 `#topbar` 的做法一致）。
  宿主 `#view` 里的页面同时 `display:none` 收起——只设 `visibility:hidden` 的话，
  几百行列表仍然占着版面高度。播放条 `#player` 是 `z-index:20`，依旧浮在墙面上。
- **照片墙引擎必须是经典脚本**：宿主执行插件代码的方式是
  `new Function('nethe','console', '"use strict";' + 注入代码)`（见 `Web/js/plugins.js`），
  所以 ESM 的 `import` / `export` 都不能用。`tools/bundle-photowall.mjs` 把
  `FoliaExtract/photowall/src` 里的 ESM 模块打成一个 IIFE 经典脚本，
  暴露 `window.FoliaWall`（引擎 API）与 `window.FOLIA_WALL_CSS`（样式）。

## 踩到的宿主坑（插件侧都绕开了，宿主侧可修）

1. **`nethe.data.read / write` 的 Promise 永远不会 settle。**
   `Web/js/plugins.js:203` 用 `HOST.data[d.rid]` 回调，而宿主
   `Hosting/Handlers/PluginBridgeHandlers.cs:82-92` 的 `PostToWeb` **没有把 `rid` 带回去**，
   于是回调查不到挂起项、Promise 永久 pending。插件如果 `await` 它，后面的
   「样式注入 / 设置项注册 / 事件订阅」会全部静默消失（这正是本插件第 1 版的表现）。
   → 插件现在只用同步的 `nethe.settings.value/set`，不碰 `nethe.data`。
   修法：`PostToWeb(new { type="plugin_data", id, name, rid, ok, error })`（把 `rid` 带上）。
2. **`nethe.css.add()` 依赖宿主版本**。当前版本的 `plugins.js:85-95` 是有的，
   但为了稳（老版本没有这个 API 时会静默失败、整个墙裸奔），插件自己往 `document.head`
   插 `<style id="pw-style" data-plugin="photowall-playlist">`，注入结果写日志。

## 验收（已跑通）

`powershell -File dev\e2e.ps1 -Steps`（关宿主 → 装插件 → 带 CDP 启动 → 固定流程 + 截图）：

| 步骤 | 结果 |
| --- | --- |
| 启动后插件加载 | `ok:true`；日志 `样式已注入（19469 字符）· 宿主 nethe.css=有`、`插件就绪 · 自动切换范围=仅歌单类页面` |
| 首页（每日推荐） | 不切换：`stage:false`（宿主列表 33 行）✅ |
| 我的歌单 | `stage:true`，29 张卡片（8 个歌单 + 反射/斜置副本）✅ |
| 点歌单卡 → 歌单详情 | 自动切墙：`songs:40`，工具条 `300 首 · 已挂载 40`（插件把宿主 50 行/批逼到 300 行再挂）✅ |
| 顶栏「更多」 | 300 → **365 行**（整张歌单），工具条同步 `365 首`，加载完后「更多」自动隐藏 ✅ |
| 点歌曲卡 | 开始播放：该卡片 `pw-live` 描边亮起、播放条出现暂停键、进度走到 00:53 ✅ |
| 右下悬浮按钮 | 列表 ⇄ 照片墙切换正常 ✅ |
| 顶栏「列表」 | 恢复宿主列表：`stage:false`、`page-title` 与行数不变 ✅ |
| 卡片悬浮（真实鼠标） | 白边出现：`box-shadow … rgb(255,255,255) 0 0 0 4px`，`translate:-7.5px`、`animation:pw-hover-float`；移开后复原 ✅ |
| 封面左上角只有一个序号框 | 每张海报的子元素只有引擎的 `.lattice-poster-badge`（`01`）；插件自制的 `.pw-pill`（`#001`）已删除：`badges:56 / pills:0`（`dev/shots/badge-fix.png`）✅ |
| 拖拽时不上浮（真实鼠标） | 拖拽 + 滑行期间舞台带 `pw-dragging`，悬浮卡片 `translate → none`、`animation → none`；滑行结束后类自动移除，悬浮恢复 `translate:-7.5px` + `pw-hover-float` + 白边 ✅ |
| 滚轮（真实鼠标） | 以光标为锚点缩放：`scale 0.76 → 1.079 → 1.532`，页面**不滚动** ✅ |
| 缩放不被后台重排打回（真实鼠标） | 滚轮到 `scale 2.4` 后让工具条文字变长（修复前会把墙体挤矮 `650→581px`）：工具条 `47→47`、墙体 `650→650`、**0 次相机写入**，`scale` 仍 `2.4` ✅ |
| 断点缩放只在窗口宽度变化时生效 | 同宽度只改高度：引擎先 `setScale 0.76`，守卫立刻还原 `2.4`（审计里有 `guardAutoRescale` 一条）；宽度 `1202→900` 时接受断点 `0.64` 并清掉「用户缩放过」标记 ✅ |
| 拖拽惯性（真实鼠标） | 松手后滑行：`lastGlide = {frames:146, dist:316, stop:'done'}`；逐帧 `req === got`、`engine:0`（引擎惯性被停掉，只有一套在跑）✅ |
| 引擎的「鼠标锁定」（Pointer Capture）真的成立 | 真鼠标拖拽时开事件表 `__pwWall.evt(true)`：一条拖拽 `events:11 / pointerup:1 / lostpointercapture:1`、`capFails():0` ⇒ 引擎越阈值捕获成功、按规矩释放（捕获期间指针跑出墙体也断不了线）✅ |
| 指针锁（`lockSim` + 合成 movement） | 锁定期间按 relative 平移：喂 `(0,-40)(0,-40)(-20,0)` ⇒ 相机 `(200,132) → (226,237)`，`dx/dy = +26/+105`＝`mov(-20,-80)/scale0.76`，方向和引擎的 `panBy` 完全一致；同一轮 `lockSim(false)` 时相机 `moved:false`（不会和引擎抢着平移）✅ |
| 申请顺序不再打断引擎捕获 | 锁开着做真鼠标拖拽：`__NE_ERR` 零新增、`capFails():0`（修复前同一个动作每次都拖着一条 `[jserr] Uncaught InvalidStateError … setPointerCapture`，而且异常打断 `onPointerMove` ⇒ 下一条 move 按整段距离平移）✅ |
| 拿不到锁必须回退（本机就是这条路） | 聚焦拖拽：`locked:false`、`lockFails:1`、`lockErrs:1`（一次申请记 1，事件不会记成两倍），拖拽照旧 1:1（8×26px ⇒ `y +274` 世界像素、`x` 不变）且松手滑行正常；宿主日志各出现一条 `指针锁：宿主拒绝…` ✅ |
| 设置项 `lock` 真的生效 | 从宿主设置里把 `lock` 关掉后拖拽：审计里**没有任何** `requestPointerLock` 记录（`lock:[]`）、`lockFails` 不涨，引擎 `panBy` 照常 6 次；打开后同一拖拽恰好 1 次申请 ✅ |
| 拖拽 1:1、无外部输入 | 窗口级计数一次 30 步拖拽：`pointermove` 共 31 条、其中按住键 30 条、`x` 全是 660（纯垂直）⇒ 相机 `x` 不变、`y +153`＝30×4/0.76 世界像素 ✅（审计里若出现 x 方向位移或位移偏大，先数一遍是不是有**别的指针事件**混进来：真实鼠标同时在动、上一次命令残留的事件都会让「按事件增量平移」的引擎多走一段） |
| 滚轮缩放是线性动画 | `dev\zoom-trace.ps1` 逐帧采 `scale`：一格 -240 用时 135ms、出现 7 个中间帧（0.76→0.792→0.845→0.871→0.952→1.043→1.079）、**最大单帧倍率 1.096**，单调递增；同一脚本用 `setZoomSmooth(false)` 做对照：1 帧到位、单帧倍率 **1.42**（跳变）✅ |
| 缩放锚点不漂 | 同上脚本按 `x + (cx - 墙中心)/scale` 算光标下的世界坐标：动画全程只漂 **0.3 世界像素**（修局部坐标之前漂 ~23）✅ |
| 顶栏 ＋ / − 同动画 | 两个按钮走同一条 `zoomSmooth` 路径（锚点=墙体中心），`zoom-guard.ps1` 里两格滚轮到 `2.4`、改写工具条文字后仍是 `2.4` ✅ |
| 只有一套惯性（A/B） | 关掉插件滑行只留引擎惯性：`engineMovingFrames:4`、`netDy:66.8px` ⇒ 引擎惯性确实存在（之前两套互相覆盖＝「莫名位移」的根源）✅ |
| 拖拽不再刷 `InvalidStateError` | `dev\locktest.ps1`：锁开/关各 3 轮 40 步慢拖，`__NE_ERR` 零新增、`capFails` 只增不抛；修复前同一动作每轮拖着一条 `[jserr] Uncaught InvalidStateError … setPointerCapture` ✅ |
| 悬浮位移不在拖拽中抖动 | 拖拽期间 `.pw-dragging` 顶掉 `translate` 与上浮动画；指针捕获期间 `:hover` 本就不再匹配，真正可见的位移发生在按下瞬间/慢拖扫过卡片时 ✅ |
| 自动补全（挂墙后） | 1 秒后日志 `自动补全：已加载 365 首（已全部加载）`，工具条 `365 首`，「更多」自动隐藏 ✅ |
| 墙面铺满（`reserved:0`） | 版面不再留空洞（`dev/shots/fill-check.png`），`reserved:2` 时可见规律性空位 ✅ |
| 设置页 | 9 个设置项全部出现（`auto`/`rec`/`cell`/`gap`/`reserved`/`acts`/`grow`/`autoLoad`/`lock`）✅ |
| `window.__NE_ERR` | 空（无未捕获异常）✅ |

截图在 `dev/shots/`：`2-liked.png`（歌单墙）、`3-playlist.png`、`final-wall.png`（铺满整主区域）、
`hover-ring.png`（悬浮白边）、`fill-check.png`（`reserved:0` 铺满后的整墙）、`7-song-play.png`（播放中 + 高亮）、
`8-plugin-settings.png`（设置项）、`1-home.png`（首页保持原样）。

## 开发

> `tools/`（打包/校验）与 `dev/`（安装、CDP 驱动的端到端与真鼠标验证脚本、截图）只在本机保留，
> 不随插件仓库发布；下面这些命令是开发时用的，仓库里只有插件运行时需要的
> `manifest.json` / `ui.js` / `main.js` / `vendor/photowall.bundle.js`。

```powershell
node tools/bundle-photowall.mjs     # 源 ESM → vendor/photowall.bundle.js
node tools/verify-bundle.mjs        # 语法关 + 加载关 + 完整性关 + 与原 ESM 的逐点差分关
powershell -File dev\install.ps1    # 装到 %APPDATA%\netHEmusic\plugins\photowall-playlist
powershell -File dev\e2e.ps1 -Steps # 关宿主 → 装插件 → 带 CDP 启动 → 固定流程截图
powershell -File dev\e2e.ps1 -Probe "document.querySelectorAll('.lattice-poster').length"
powershell -File dev\e2e.ps1 -Shot dev\shots\my-shot.png
```

交互类改动用真实鼠标事件验（`Runtime.evaluate` 里合成的 PointerEvent 墙的控制器不认）：

```powershell
powershell -File dev\gesture.ps1 -Action wheel                  # 滚轮＝缩放？打印 scale 前后
powershell -File dev\gesture.ps1 -Action drag -Steps 8 -StepPx 30 # 拖拽后打印相机轨迹（看惯性）
powershell -File dev\gesture.ps1 -Action hover -Shot dev\shots\hover-ring.png
powershell -File dev\gesture.ps1 -Action hover -Keep            # 鼠标停在照片上（接着用 cdp.ps1 探状态）
powershell -File dev\gesture.ps1 -Action walk -Steps 4          # 依次划过多张卡片
powershell -File dev\gesture.ps1 -Action drag -Focus            # 开焦点仿真，再试一次指针锁（本机仍被拒）
powershell -File dev\gesture.ps1 -Action lock -StepPx 26        # 指针锁实验：锁住后 client/movement 还动不动
powershell -File dev\cdp.ps1 -Js (Get-Content -Raw dev\lock-pan.js)  # 锁定期间的 movement 平移 + 「没锁就不动手」两个断言
powershell -File dev\locktest.ps1 -Rounds 3 -Steps 40 -StepPx 4  # 慢拖回归：报错/捕获失败/锁申请计数
powershell -File dev\zoom-trace.ps1 -DeltaY -240                # 滚轮缩放逐帧采样：动画版 vs setZoomSmooth(false)
```

`drag` 会打印 `atRelease / duringDrag / afterRelease`（含 `gliding`、`engine`、`locked`、`lockFails`）和相机轨迹；
看「引擎的鼠标锁定有没有真的拿到」用事件表：`__pwWall.evt(true)` → 拖一次 → `__pwWall.evtDump()` 里
应当有且只有一条 `lostpointercapture`（拿到了、随后按规矩释放），同时 `capFails()` 为 0。
`dev\zoom-guard.ps1` 是一条回归：挂墙 → 滚轮放大到 `2.4` → 把工具条文字撑长（模拟
`updateMeta()` 的字数变化）→ 断言工具条/墙体高度不变、相机**零写入**、`scale` 仍是 `2.4`。
怀疑「拖拽后整体位移」时先数指针事件（能区分插件的问题和混进来的真实鼠标）：

```powershell
powershell -File dev\cdp.ps1 -Js "(function(){window.__e0=[];window.addEventListener('pointermove',function(e){window.__e0.push([Math.round(performance.now()),e.clientX,e.clientY,e.buttons])},true);return 1})()"
powershell -File dev\gesture.ps1 -Action drag -Steps 30 -StepPx 4
powershell -File dev\cdp.ps1 -Js "(function(){var a=window.__e0;return JSON.stringify({total:a.length,withBtn:a.filter(function(x){return x[3]===1}).length,xs:Array.from(new Set(a.map(function(x){return x[1]})))})})()"
```

按住键的那一段应该正好等于 `-Steps` 条、`xs` 只有一个值（纯垂直拖拽）——多出来就是外部输入。
页面里另有调试口 `window.__pwWall`（`cam()` / `gliding()` / `dragging()` / `lastGlide()` /
`setGlide(false)` 用来 A/B 关掉插件滑行 / `setZoomSmooth(false)` 关掉滚轮缩放的线性动画（A/B 用）/
`zoomAnim()`（当前动画的锚点、起点、目标、已跑毫秒）/ `lockOn(false)` 关掉指针锁 / `locked()` / `lockFails()`（被拒次数）/
`lockErrs()`（`pointerlockerror` 事件次数）/ `lockTried()`（本次手势申请过没有）/ `lockFocus()`、`docFocus()`（申请时/现在文档有没有焦点）/
`capFails()`（被兜住的 `setPointerCapture` 失败次数，正常应为 0）/
`lockSim(true)` 在 CDP 里假装已锁定（真锁要靠焦点+瞬时激活，命令行不稳定）/ `list()` / `reset()` /
`audit(true)`+`auditDump()` 列出每一次相机写入及其调用栈 / `stopGlide()`）。
`lastGlide()` 的 `trace` 是逐帧 `{req, got, engine, dt}`——`req === got` 且 `engine:0`
就说明滑行期间只有插件这一套在改相机（这正是「两套惯性打架」的验收指标）。

`dev/e2e.ps1` 需要宿主是 **Debug** 构建（`Hosting/WebViewHost.cs:51-55` 里
`NETHE_DEV_CDP=1` 才会开 `--remote-debugging-port=9222`），截图落在 `dev/shots/`。

> 宿主启动后会异步**恢复上次打开的页面**（有时连跳两次：先回到歌单页、再进具体的歌单），
> 所以脚本必须等它安静下来（`WaitStable`：导航+标题+行数连续 4s 不变）再开始点导航，
> 否则刚点的导航会被恢复过程覆盖，表现为「点了首页却还在别的页面」。
调试细节见 `tools/README.md`（打包器契约）与 `dev/cdp.ps1`（CDP 客户端）。

## 已知限制

- 只有**歌曲列表**里的卡片能播放/加入播放列表/下载；歌单卡片页里点卡片＝打开那个歌单。
- 宿主一次渲染 50 首，插件按 `grow` 上限加载；`autoLoad` 开着会自动补到整页（封顶 2000），
  也可以点顶栏「更多」手动一批；补全期间宿主页面在舞台后面偷偷滚动，看不见。
- 搜索页、下载页等没有列表的页面不会出现悬浮按钮。
- 照片墙挂载后宿主列表是 `display:none`，宿主自己的滚动/分页逻辑随之暂停（退出即恢复）。
- 宿主 DOM 结构变了就可能失效（选择器集中在 `main.js` 的 `detectHost()/readItems()` 两处，好改）。

## 致谢

- 照片墙引擎：`FoliaExtract/photowall`（folia-major 抽取版，见该目录 `CONTRACT.md` 与 `COVERAGE.md`）。
- 宿主插件体系：netHEmusic `plugins/README.md`。
