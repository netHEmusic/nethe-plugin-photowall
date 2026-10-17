// 由 tools/bundle-photowall.mjs 从 FoliaExtract/photowall/src 生成，请勿手改
(function () {
'use strict';

// ---------------------------------------------------------------------------
// 内联资源：styles/wall.css 原文，作为 JS 字符串字面量（无外部引用，只有一处 data: URI）
// ---------------------------------------------------------------------------
var __assets = {};
__assets['styles/wall.css'] = "/* Language: CSS */\n/* Ported from: src/components/wall/wall.css (lines 1-362) */\n/* Fidelity: verbatim-port */\n/* Module: photowall / styles */\n\n/* src/components/wall/wall.css — content-agnostic wall and poster styling shared by Lattice and (from B6) the bravais library\n   suite. Class names and tokens keep the `lattice-` prefix on purpose: Lattice's DOM, tests and\n   probes address them, and moving them here changed none of that. Lattice-only rules (chrome, lights-out,\n   back button, empty state) stay in components/app/lattice/Lattice.css. No veil or transparency code here.\n   实测反馈 1 起熄灯规则移到本文件末尾，返回按钮与工具面板在同目录的 WallBackButton.css / WallToolsButton.css（两边共用）。 */\n\n.lattice-root {\n    --lattice-poster-ink: var(--text-primary, #f7f4ee);\n    --lattice-shade-rgb: 0 0 0;\n    --lattice-poster-background: color-mix(in srgb, var(--bg-color, #070707) 88%, var(--lattice-poster-ink));\n    --lattice-expanded-shadow: rgb(0 0 0 / 74%);\n    --lattice-focus-lift: 0 12px 32px rgb(0 0 0 / 45%);\n    --lattice-poster-tint-intensity: 0.5;\n    --lattice-poster-tint-effective-opacity: var(--lattice-poster-tint-intensity);\n    --lattice-poster-tint-color: #161419;\n    position: absolute;\n    inset: 0;\n    overflow: hidden;\n    user-select: none;\n    -webkit-user-select: none;\n    color: var(--text-primary, #f7f4ee);\n    /* The two glows are the theme's own accent and secondary, so the wall reads as part of the app\n       rather than a surface with its own palette. --bg-color already follows the daylight switch. */\n    background:\n        radial-gradient(circle at 14% 12%, color-mix(in srgb, var(--text-accent, #fd5c47) 16%, transparent), transparent 29%),\n        radial-gradient(circle at 86% 82%, color-mix(in srgb, var(--text-secondary, #6a48ff) 20%, transparent), transparent 32%),\n        var(--bg-color, #070707);\n    isolation: isolate;\n}\n\n.lattice-root.is-daylight {\n    --lattice-poster-ink: var(--text-primary, #1c1917);\n    --lattice-shade-rgb: 255 255 255;\n    --lattice-poster-background: color-mix(in srgb, var(--bg-color, #fafaf9) 94%, var(--lattice-poster-ink));\n    --lattice-expanded-shadow: rgb(0 0 0 / 25%);\n    --lattice-focus-lift: 0 12px 32px rgb(0 0 0 / 25%);\n    --lattice-poster-tint-effective-opacity: calc(var(--lattice-poster-tint-intensity) * 0.72);\n}\n\n.lattice-root::after {\n    content: '';\n    position: absolute;\n    inset: 0;\n    z-index: 2;\n    pointer-events: none;\n    opacity: 0.13;\n    background-image: url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.92' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E\");\n    mix-blend-mode: soft-light;\n}\n\n.lattice-root.is-daylight::after { opacity: 0.07; }\n\n/* Edge falloff over the posters. Sits under the header, the hint and the panel button (z-index 4\n   and 5) so chrome never dims, and stays deliberately shallow: the wall is a browsing surface, and\n   a heavy vignette would fight the artwork it is there to show. */\n.lattice-root.has-vignette::before {\n    content: '';\n    position: absolute;\n    inset: 0;\n    z-index: 3;\n    pointer-events: none;\n    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 78%, rgba(0, 0, 0, 0.52) 100%);\n}\n\n.lattice-root.is-daylight.has-vignette::before {\n    background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0) 78%, rgba(0, 0, 0, 0.16) 100%);\n}\n\n.lattice-field {\n    position: absolute;\n    inset: 0;\n    /* Camera transforms own the viewport; native focus scrolling must not add an offset. */\n    overflow: clip;\n    cursor: grab;\n    touch-action: none;\n    overscroll-behavior: none;\n}\n\n.lattice-field:active { cursor: grabbing; }\n\n/* No `will-change: transform` here, and do NOT reintroduce it as an optimization (LatticePoster.tsx\n   carries the same warning for posters). The camera always writes translate3d(...) scale(...), which\n   already gives the world its own compositor layer, and the scale only moves on a resize. What the hint\n   cost: Chromium clamps the raster scale of a will-change subtree to at least the native scale, while\n   the wall is always zoomed out (0.52–0.76), so every poster, plate and tile was rasterized at 1x and\n   drawn at half size, ~3.7x the tile memory. On Android Chromium that pushed the wall past the tile\n   budget, and every overlay opened over it (settings, release notes, other modals) showed missing\n   tiles, i.e. the wall flashing through, for a frame or two.\n   The one thing the hint did buy is that sub-pixel camera motion never re-rasters the wall. Without it\n   that now comes from formatWorldTransform (wallView.ts) snapping the translation to device pixels;\n   the two belong together, so do not drop the snapping either. */\n.lattice-world {\n    position: absolute;\n    inset: 0;\n    transform-origin: 0 0;\n}\n\n.lattice-poster {\n    position: absolute;\n    overflow: hidden;\n    padding: 0;\n    border: 0;\n    color: var(--lattice-poster-ink);\n    text-align: left;\n    background-color: var(--lattice-poster-background);\n    background-position: center;\n    background-size: cover;\n    box-shadow:\n        0 0 0 1px transparent,\n        0 0 0 4px transparent,\n        0 0 0 5px transparent,\n        var(--lattice-poster-elevation, 0 12px 32px transparent);\n    transition: box-shadow 600ms ease, filter 600ms ease;\n    cursor: pointer;\n    contain: layout paint;\n}\n\n/* An overlay border stays visible above artwork without changing layout or the focus ring. The\n   card clips its own children, so this mark has to be built inward: the accent stroke, a shade\n   hairline behind it so the accent still reads over a bright sleeve, and a soft inward glow that\n   makes the card look lit rather than stickered. The third slot is a placeholder that keeps this\n   list the same length as the focused one below, so the two interpolate. */\n.lattice-poster.is-current::before {\n    content: '';\n    position: absolute;\n    inset: 0;\n    z-index: 4;\n    border: 2px solid var(--text-accent, var(--text-primary, #fff));\n    box-shadow:\n        inset 0 0 0 1px rgb(var(--lattice-shade-rgb) / 52%),\n        inset 0 0 0 3px transparent,\n        inset 0 0 15px -7px color-mix(in srgb, var(--text-accent, var(--text-primary, #fff)) 46%, transparent);\n    pointer-events: none;\n    transition: box-shadow 300ms ease;\n}\n\n.lattice-poster:hover {\n    z-index: 3;\n    filter: saturate(1.08) brightness(1.05);\n}\n\n/* Keyboard focus. The ring is drawn with box-shadow rather than outline so it follows the\n   poster's rounded corners, and the native outline is dropped only once ours is showing.\n   This rule carries the lift only; the ring is split out below, because the playing card already\n   owns a stroke and a second one in another colour on top of it reads as two stacked borders. */\n.lattice-poster.is-focused,\n.lattice-poster:focus-visible {\n    z-index: 4;\n    outline: none;\n    box-shadow:\n        0 0 0 1px transparent,\n        0 0 0 4px transparent,\n        0 0 0 5px transparent,\n        var(--lattice-poster-elevation, var(--lattice-focus-lift));\n}\n\n/* Cards with no mark of their own get one: a hairline, the ring, then a second hairline, so the\n   ring stays crisp against both the artwork inside it and the wall outside. */\n.lattice-poster.is-focused:not(.is-current),\n.lattice-poster:focus-visible:not(.is-current) {\n    box-shadow:\n        0 0 0 1px rgb(0 0 0 / 62%),\n        0 0 0 4px var(--text-primary, #fff),\n        0 0 0 5px rgb(0 0 0 / 38%),\n        var(--lattice-poster-elevation, var(--lattice-focus-lift));\n}\n\n/* Focusing the playing card strengthens its glow without drawing a second accent stroke. */\n.lattice-poster.is-current.is-focused::before,\n.lattice-poster.is-current:focus-visible::before {\n    box-shadow:\n        inset 0 0 0 1px rgb(var(--lattice-shade-rgb) / 62%),\n        inset 0 0 0 3px transparent,\n        inset 0 0 26px -6px color-mix(in srgb, var(--text-accent, var(--text-primary, #fff)) 62%, transparent);\n}\n\n.lattice-poster::after {\n    content: '';\n    position: absolute;\n    inset: 0;\n    pointer-events: none;\n    background: linear-gradient(180deg, rgb(255 255 255 / 10%), transparent 60%);\n    opacity: 0;\n    transition: opacity 200ms ease;\n}\n\n.lattice-poster.is-focused::after { opacity: 1; }\n\n.lattice-root.is-daylight .lattice-poster.is-focused:not(.is-current),\n.lattice-root.is-daylight .lattice-poster:focus-visible:not(.is-current) {\n    box-shadow:\n        0 0 0 1px rgb(255 255 255 / 78%),\n        0 0 0 4px var(--text-primary, #111),\n        0 0 0 5px rgb(255 255 255 / 45%),\n        var(--lattice-poster-elevation, var(--lattice-focus-lift));\n}\n\n.lattice-field:focus,\n.lattice-field:focus-visible {\n    outline: none;\n}\n\n.lattice-poster-shade {\n    position: absolute;\n    inset: 0;\n    background: linear-gradient(180deg, rgb(var(--lattice-shade-rgb) / 5%) 34%, rgb(var(--lattice-shade-rgb) / 24%) 56%, rgb(var(--lattice-shade-rgb) / 92%) 100%);\n}\n\n/* Theme-derived colour quiets the background cards without muting the playing or selected one. */\n.lattice-poster-tint {\n    position: absolute;\n    inset: 0;\n    z-index: 3;\n    pointer-events: none;\n    background: linear-gradient(\n        145deg,\n        color-mix(in srgb, var(--bg-color, #070707) 78%, var(--text-accent, #fd5c47)),\n        color-mix(in srgb, var(--bg-color, #070707) 84%, var(--text-secondary, #6a48ff))\n    );\n    opacity: 0;\n    transition: opacity 260ms ease;\n}\n\n.lattice-root.has-poster-tint .lattice-poster-tint {\n    opacity: var(--lattice-poster-tint-effective-opacity);\n}\n\n.lattice-root.uses-custom-poster-tint .lattice-poster-tint {\n    background: var(--lattice-poster-tint-color);\n}\n\n.lattice-poster.is-current .lattice-poster-tint,\n.lattice-poster.is-focused .lattice-poster-tint,\n.lattice-poster:hover .lattice-poster-tint,\n.lattice-poster:focus-visible .lattice-poster-tint {\n    opacity: 0;\n}\n\n.lattice-poster.is-expanded {\n    --lattice-poster-elevation: 0 42px 110px var(--lattice-expanded-shadow);\n    /* Hover would otherwise hand this card a filter, and the Pixi lyric canvas inside it would be\n       re-composited through that pass every frame. */\n    filter: none;\n}\n\n.lattice-poster.is-expanded .lattice-poster-shade {\n    /* The bottom band is what keeps the background-less playback chrome readable. */\n    background:\n        linear-gradient(0deg, rgb(var(--lattice-shade-rgb) / 86%) 0%, rgb(var(--lattice-shade-rgb) / 62%) 14%, rgb(var(--lattice-shade-rgb) / 26%) 30%, rgb(var(--lattice-shade-rgb) / 0%) 46%),\n        linear-gradient(90deg, rgb(var(--lattice-shade-rgb) / 88%), rgb(var(--lattice-shade-rgb) / 50%) 52%, rgb(var(--lattice-shade-rgb) / 8%));\n}\n\n.lattice-poster.is-expanded .lattice-poster-copy strong {\n    max-width: 76%;\n    font-size: clamp(48px, 6vw, 82px);\n    line-height: 0.95;\n}\n\n.lattice-poster.is-expanded .lattice-poster-copy small {\n    margin-top: 7px;\n    font-size: 17px;\n}\n\n.lattice-poster-badge {\n    position: absolute;\n    top: 14px;\n    left: 14px;\n    padding: 5px 8px;\n    border: 0;\n    font-size: 11px;\n    font-weight: 800;\n    font-variant-numeric: tabular-nums;\n    letter-spacing: 0.12em;\n    /* No backdrop-filter here: one blurred badge per card promoted every poster to its own\n       compositing layer, which is the wall's single largest GPU cost. A denser shade keeps the\n       number legible over bright artwork without the readback. */\n    background: rgb(var(--lattice-shade-rgb) / 62%);\n}\n\n/* The playing poster already wears the accent border; its badge only borrows the colour. */\n.lattice-poster-badge.is-current {\n    color: var(--text-accent, var(--text-primary, #fff));\n    background: rgb(var(--lattice-shade-rgb) / 78%);\n}\n\n.lattice-poster-copy {\n    position: absolute;\n    right: 17px;\n    bottom: 17px;\n    left: 17px;\n    display: flex;\n    flex-direction: column;\n    gap: 5px;\n}\n\n.lattice-poster-copy strong {\n    overflow: hidden;\n    /* Tight display line-heights otherwise crop ascenders and descenders at the clamp boundary.\n       Padding expands the paint area; the matching negative margin keeps the copy anchored. */\n    margin-block: -0.14em;\n    padding-block: 0.14em;\n    font-size: clamp(22px, 2vw, 36px);\n    line-height: 0.96;\n    letter-spacing: -0.045em;\n    text-wrap: balance;\n    display: -webkit-box;\n    -webkit-line-clamp: 3;\n    -webkit-box-orient: vertical;\n}\n\n.lattice-poster-copy small {\n    overflow: hidden;\n    font-size: 13px;\n    font-weight: 650;\n    opacity: 0.78;\n    text-overflow: ellipsis;\n    white-space: nowrap;\n}\n\n/* 降级状态由 useMotionSettingsStore 同步到 <html data-reduce-motion>，不再直接跟随系统偏好；\n   `~=` 匹配空格分隔的词，所以一个属性能同时带多个面。见 stores/useMotionSettingsStore.ts。 */\n:root[data-reduce-motion~='lattice'] .lattice-poster,\n:root[data-reduce-motion~='lattice'] .lattice-poster::after,\n:root[data-reduce-motion~='lattice'] .lattice-poster-tint { transition: none; }\n\n@media (max-width: 640px) {\n    .lattice-poster.is-expanded .lattice-poster-copy strong { font-size: 44px; }\n}\n\n/* Settled previews contain at most three lines, so no hidden fourth line can bleed into padding. */\n.lattice-poster-copy strong[data-title-settled] {\n    display: block;\n    -webkit-line-clamp: unset;\n}\n\n/* 熄灯（实测反馈 1 从 Lattice.css 搬来，Lattice 与 bravais 共用同一份灯光设置）。每张海报里一层，正在播放的那张不熄；\n   熄灯时叠色归零（两层不叠加）。bravais 在 bravais.css 里另有几条豁免（聚焦卡、悬停、键盘焦点、全透明档的窗）。 */\n.lattice-poster-lights-out {\n    position: absolute;\n    inset: 0;\n    /* Lights-out covers the complete poster, including its copy and badge. */\n    z-index: 5;\n    pointer-events: none;\n    background: #000;\n    opacity: 0;\n    transition: opacity 260ms ease;\n}\n\n.lattice-root.is-lights-out .lattice-poster:not(.is-current) .lattice-poster-lights-out {\n    opacity: 0.82;\n}\n\n.lattice-root.is-daylight.is-lights-out .lattice-poster:not(.is-current) .lattice-poster-lights-out {\n    background: #fff;\n}\n\n.lattice-root.is-lights-out .lattice-poster:not(.is-current) .lattice-poster-tint {\n    opacity: 0;\n}\n\n/* 降级状态的来源同 wall.css 里海报的那条规则（useMotionSettingsStore → <html data-reduce-motion>）。 */\n:root[data-reduce-motion~='lattice'] .lattice-poster-lights-out { transition: none; }\n";

// ---------------------------------------------------------------------------
// 模块注册表：__def 登记，__req 求值，__cache 先占位（因此循环依赖不会无限递归）
// ---------------------------------------------------------------------------
var __mods = {}, __cache = {};
function __def(id, fn) { __mods[id] = fn; }
function __req(id) {
    if (Object.prototype.hasOwnProperty.call(__cache, id)) return __cache[id];
    var factory = __mods[id];
    if (!factory) throw new Error('photowall bundle: 没有注册模块 ' + id);
    var m = {};
    __cache[id] = m;   // 先占位再执行，循环依赖拿到的是同一个（可能尚未填满的）命名空间
    factory(m);
    return m;
}

// ---------------------------------------------------------------------------
// 模块正文：共 23 个，按被依赖者优先排列
// ---------------------------------------------------------------------------

// ---- core/blockReflows.js ----------------------------------------------
__def("core/blockReflows.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/blockReflows.ts (lines 11-743)
// Fidelity: verbatim-port
// Module: photowall / core

// Generated data, taken over unchanged from the original: for each of the four base templates,
// one layout per slot that could be expanded. The expanded card takes the 6x6 gear
// (EXPANSION_SPAN, blockTemplates.js) and the other eleven fall back to smaller gears so the
// block stays exactly covered. Indexed by the ORIGINAL slot index, so a card keeps its identity
// through the change; the original solver picked, out of every exact cover, the arrangement that
// moves the existing cards least. Do not hand-edit: regenerate if the templates or gears change.
// Original header comment block: blockReflows.ts:1-9.

const BLOCK_REFLOWS = [
    // 变体 0 的 12 张让位表，下标 = 被展开的槽位
    [
        // 展开槽位 0
        [
            { x: 0, y: 0, cols: 6, rows: 6 },
            { x: 6, y: 0, cols: 4, rows: 4 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 4 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 1
        [
            { x: 0, y: 0, cols: 3, rows: 2 },
            { x: 3, y: 0, cols: 6, rows: 6 },
            { x: 9, y: 0, cols: 3, rows: 2 },
            { x: 0, y: 2, cols: 3, rows: 2 },
            { x: 9, y: 2, cols: 3, rows: 2 },
            { x: 0, y: 4, cols: 3, rows: 2 },
            { x: 3, y: 6, cols: 3, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 3, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 9, y: 4, cols: 3, rows: 2 },
        ],
        // 展开槽位 2
        [
            { x: 0, y: 0, cols: 3, rows: 2 },
            { x: 3, y: 0, cols: 3, rows: 4 },
            { x: 6, y: 0, cols: 6, rows: 6 },
            { x: 0, y: 2, cols: 3, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 4 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
        ],
        // 展开槽位 3
        [
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 6, rows: 2 },
            { x: 8, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 10, y: 0, cols: 2, rows: 6 },
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 4
        [
            { x: 0, y: 0, cols: 3, rows: 2 },
            { x: 3, y: 0, cols: 4, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 7, y: 0, cols: 3, rows: 2 },
            { x: 2, y: 2, cols: 4, rows: 2 },
        ],
        // 展开槽位 5
        [
            { x: 0, y: 0, cols: 3, rows: 2 },
            { x: 5, y: 0, cols: 4, rows: 2 },
            { x: 9, y: 0, cols: 3, rows: 2 },
            { x: 3, y: 0, cols: 2, rows: 2 },
            { x: 8, y: 2, cols: 4, rows: 2 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 4 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
        ],
        // 展开槽位 6
        [
            { x: 0, y: 0, cols: 4, rows: 2 },
            { x: 4, y: 0, cols: 3, rows: 2 },
            { x: 9, y: 0, cols: 3, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 10, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 2, cols: 6, rows: 6 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 7, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 2, rows: 4 },
        ],
        // 展开槽位 7
        [
            { x: 0, y: 0, cols: 4, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 4, rows: 2 },
        ],
        // 展开槽位 8
        [
            { x: 0, y: 0, cols: 4, rows: 2 },
            { x: 4, y: 0, cols: 3, rows: 2 },
            { x: 9, y: 0, cols: 3, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 10, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 2, cols: 2, rows: 4 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 6, rows: 6 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 7, y: 0, cols: 2, rows: 2 },
        ],
        // 展开槽位 9
        [
            { x: 0, y: 0, cols: 4, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 4, rows: 2 },
        ],
        // 展开槽位 10
        [
            { x: 0, y: 0, cols: 4, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 2, y: 2, cols: 4, rows: 2 },
        ],
        // 展开槽位 11
        [
            { x: 0, y: 0, cols: 4, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 4, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
        ],
    ],
    // 变体 1 的 12 张让位表，下标 = 被展开的槽位
    [
        // 展开槽位 0
        [
            { x: 0, y: 0, cols: 6, rows: 6 },
            { x: 6, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 8, y: 0, cols: 4, rows: 4 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 4 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 1
        [
            { x: 0, y: 0, cols: 2, rows: 3 },
            { x: 2, y: 0, cols: 6, rows: 6 },
            { x: 8, y: 2, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 4, rows: 2 },
            { x: 0, y: 3, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 4 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 2
        [
            { x: 0, y: 0, cols: 2, rows: 3 },
            { x: 2, y: 0, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 6, rows: 6 },
            { x: 10, y: 0, cols: 2, rows: 4 },
            { x: 0, y: 3, cols: 4, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 3
        [
            { x: 0, y: 0, cols: 2, rows: 3 },
            { x: 2, y: 0, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 2, rows: 4 },
            { x: 6, y: 0, cols: 6, rows: 6 },
            { x: 0, y: 3, cols: 4, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
        ],
        // 展开槽位 4
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 4, rows: 4 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 5
        [
            { x: 0, y: 0, cols: 2, rows: 4 },
            { x: 2, y: 0, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 3, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 4 },
            { x: 2, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 2, rows: 2 },
        ],
        // 展开槽位 6
        [
            { x: 0, y: 0, cols: 2, rows: 4 },
            { x: 2, y: 0, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 3, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 4 },
            { x: 2, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 2, rows: 2 },
        ],
        // 展开槽位 7
        [
            { x: 0, y: 0, cols: 2, rows: 4 },
            { x: 2, y: 0, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 3, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 0, y: 4, cols: 2, rows: 4 },
            { x: 2, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
        ],
        // 展开槽位 8
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 0, cols: 2, rows: 3 },
            { x: 8, y: 0, cols: 4, rows: 4 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 6, y: 3, cols: 2, rows: 3 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 9
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 4, rows: 4 },
            { x: 0, y: 2, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 6, rows: 6 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 10
        [
            { x: 0, y: 0, cols: 2, rows: 3 },
            { x: 2, y: 0, cols: 2, rows: 4 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 4, rows: 2 },
            { x: 0, y: 3, cols: 2, rows: 3 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 6, rows: 6 },
            { x: 10, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 11
        [
            { x: 0, y: 0, cols: 2, rows: 4 },
            { x: 2, y: 0, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 3, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 4 },
            { x: 2, y: 5, cols: 2, rows: 3 },
            { x: 4, y: 2, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
        ],
    ],
    // 变体 2 的 12 张让位表，下标 = 被展开的槽位
    [
        // 展开槽位 0
        [
            { x: 0, y: 0, cols: 6, rows: 6 },
            { x: 6, y: 0, cols: 6, rows: 2 },
            { x: 8, y: 2, cols: 2, rows: 4 },
            { x: 10, y: 2, cols: 2, rows: 3 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 2, rows: 2 },
        ],
        // 展开槽位 1
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 6, y: 0, cols: 6, rows: 6 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 2, rows: 4 },
        ],
        // 展开槽位 2
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 6, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 2, rows: 4 },
        ],
        // 展开槽位 3
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
        ],
        // 展开槽位 4
        [
            { x: 2, y: 0, cols: 4, rows: 2 },
            { x: 6, y: 0, cols: 6, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 2, cols: 4, rows: 2 },
        ],
        // 展开槽位 5
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 6, rows: 6 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
        ],
        // 展开槽位 6
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
        ],
        // 展开槽位 7
        [
            { x: 0, y: 0, cols: 4, rows: 2 },
            { x: 6, y: 0, cols: 6, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 5, cols: 2, rows: 3 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 2, cols: 2, rows: 2 },
        ],
        // 展开槽位 8
        [
            { x: 0, y: 0, cols: 6, rows: 2 },
            { x: 6, y: 0, cols: 6, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 6, rows: 6 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
        ],
        // 展开槽位 9
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 6, rows: 6 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
        ],
        // 展开槽位 10
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 4, y: 0, cols: 2, rows: 4 },
        ],
        // 展开槽位 11
        [
            { x: 0, y: 0, cols: 4, rows: 4 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 4, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
        ],
    ],
    // 变体 3 的 12 张让位表，下标 = 被展开的槽位
    [
        // 展开槽位 0
        [
            { x: 0, y: 0, cols: 6, rows: 6 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 6, y: 0, cols: 2, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 6 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 6 },
            { x: 2, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 1
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 6, rows: 6 },
            { x: 8, y: 0, cols: 2, rows: 3 },
            { x: 8, y: 3, cols: 2, rows: 3 },
            { x: 10, y: 0, cols: 2, rows: 4 },
            { x: 0, y: 2, cols: 2, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 4, cols: 2, rows: 4 },
            { x: 0, y: 4, cols: 2, rows: 4 },
            { x: 2, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 2
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 2, rows: 3 },
            { x: 4, y: 0, cols: 6, rows: 6 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 10, y: 2, cols: 2, rows: 3 },
            { x: 0, y: 2, cols: 2, rows: 2 },
            { x: 2, y: 3, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 6, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 5, cols: 2, rows: 3 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 5, cols: 2, rows: 3 },
        ],
        // 展开槽位 3
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 2, rows: 4 },
            { x: 6, y: 0, cols: 6, rows: 6 },
            { x: 7, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 4 },
            { x: 2, y: 2, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 4 },
            { x: 9, y: 6, cols: 3, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 3, rows: 2 },
        ],
        // 展开槽位 4
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 2, rows: 4 },
            { x: 7, y: 6, cols: 2, rows: 2 },
            { x: 6, y: 0, cols: 6, rows: 6 },
            { x: 0, y: 2, cols: 2, rows: 4 },
            { x: 2, y: 2, cols: 2, rows: 2 },
            { x: 4, y: 4, cols: 2, rows: 2 },
            { x: 2, y: 4, cols: 2, rows: 4 },
            { x: 9, y: 6, cols: 3, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 4, y: 6, cols: 3, rows: 2 },
        ],
        // 展开槽位 5
        [
            { x: 3, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 5, y: 0, cols: 2, rows: 2 },
            { x: 8, y: 2, cols: 2, rows: 3 },
            { x: 9, y: 0, cols: 3, rows: 2 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 7, y: 0, cols: 2, rows: 2 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 5, cols: 2, rows: 3 },
            { x: 10, y: 2, cols: 2, rows: 6 },
            { x: 0, y: 0, cols: 3, rows: 2 },
            { x: 6, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 6
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 6, rows: 2 },
            { x: 8, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 3 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 2, y: 2, cols: 6, rows: 6 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 3, cols: 2, rows: 2 },
            { x: 10, y: 5, cols: 2, rows: 3 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 8, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 7
        [
            { x: 0, y: 0, cols: 2, rows: 3 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 3, rows: 2 },
            { x: 7, y: 0, cols: 3, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 6 },
            { x: 0, y: 3, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 6, rows: 6 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 6, cols: 2, rows: 2 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 8
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 2, rows: 2 },
            { x: 4, y: 0, cols: 6, rows: 2 },
            { x: 8, y: 2, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 3 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 10, y: 3, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 6, rows: 6 },
            { x: 10, y: 5, cols: 2, rows: 3 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 8, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 9
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 3, rows: 2 },
            { x: 5, y: 0, cols: 3, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 2 },
            { x: 10, y: 0, cols: 2, rows: 2 },
            { x: 0, y: 2, cols: 2, rows: 3 },
            { x: 2, y: 2, cols: 2, rows: 2 },
            { x: 4, y: 2, cols: 2, rows: 6 },
            { x: 2, y: 4, cols: 2, rows: 2 },
            { x: 6, y: 2, cols: 6, rows: 6 },
            { x: 0, y: 5, cols: 2, rows: 3 },
            { x: 2, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 10
        [
            { x: 2, y: 0, cols: 3, rows: 2 },
            { x: 6, y: 2, cols: 2, rows: 2 },
            { x: 5, y: 0, cols: 3, rows: 2 },
            { x: 8, y: 0, cols: 4, rows: 3 },
            { x: 10, y: 3, cols: 2, rows: 2 },
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 8, y: 3, cols: 2, rows: 3 },
            { x: 6, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 6, cols: 2, rows: 2 },
            { x: 10, y: 5, cols: 2, rows: 3 },
            { x: 0, y: 2, cols: 6, rows: 6 },
            { x: 6, y: 6, cols: 2, rows: 2 },
        ],
        // 展开槽位 11
        [
            { x: 0, y: 0, cols: 2, rows: 2 },
            { x: 2, y: 0, cols: 4, rows: 2 },
            { x: 6, y: 0, cols: 2, rows: 2 },
            { x: 8, y: 0, cols: 2, rows: 4 },
            { x: 10, y: 0, cols: 2, rows: 3 },
            { x: 0, y: 2, cols: 2, rows: 2 },
            { x: 0, y: 4, cols: 2, rows: 2 },
            { x: 8, y: 4, cols: 2, rows: 2 },
            { x: 10, y: 3, cols: 2, rows: 3 },
            { x: 8, y: 6, cols: 4, rows: 2 },
            { x: 0, y: 6, cols: 2, rows: 2 },
            { x: 2, y: 2, cols: 6, rows: 6 },
        ],
    ],]; __ret.BLOCK_REFLOWS = BLOCK_REFLOWS;

});

// ---- core/blockTemplates.js --------------------------------------------
__def("core/blockTemplates.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/blockTemplates.ts (lines 10-138)
// Fidelity: verbatim-port
// Module: photowall / core

const { BLOCK_REFLOWS } = __req("core/blockReflows.js");

// Slot layouts for one 12x8 block. Each template covers the block exactly - no gaps - because
// expansion makes room by re-gearing the cards rather than by shoving them aside.

/** @typedef {{ x: number, y: number, cols: number, rows: number }} BlockSlot */

// BLOCK_COLS = 12 — blockTemplates.ts:10
const BLOCK_COLS = 12; __ret.BLOCK_COLS = BLOCK_COLS;
// BLOCK_ROWS = 8 — blockTemplates.ts:11
const BLOCK_ROWS = 8; __ret.BLOCK_ROWS = BLOCK_ROWS;
// SLOTS_PER_BLOCK = 12 — blockTemplates.ts:12
const SLOTS_PER_BLOCK = 12; __ret.SLOTS_PER_BLOCK = SLOTS_PER_BLOCK;

/** Gear an expanded card takes. The only size for which every slot has an exact re-cover. */
// EXPANSION_SPAN = { cols: 6, rows: 6 } — blockTemplates.ts:15
const EXPANSION_SPAN = { cols: 6, rows: 6 }; __ret.EXPANSION_SPAN = EXPANSION_SPAN;

/** @type {BlockSlot[][]} */
const TEMPLATES = [
    // 变体 0 — blockTemplates.ts:18-32
    [
        { x: 0, y: 0, cols: 3, rows: 2 },
        { x: 3, y: 0, cols: 6, rows: 4 },
        { x: 9, y: 0, cols: 3, rows: 2 },
        { x: 0, y: 2, cols: 3, rows: 2 },
        { x: 9, y: 2, cols: 3, rows: 4 },
        { x: 0, y: 4, cols: 4, rows: 4 },
        { x: 4, y: 4, cols: 2, rows: 2 },
        { x: 6, y: 4, cols: 3, rows: 2 },
        { x: 4, y: 6, cols: 2, rows: 2 },
        { x: 6, y: 6, cols: 2, rows: 2 },
        { x: 8, y: 6, cols: 2, rows: 2 },
        { x: 10, y: 6, cols: 2, rows: 2 },
    ],
    // 变体 1 — blockTemplates.ts:34-47
    [
        { x: 0, y: 0, cols: 2, rows: 3 },
        { x: 2, y: 0, cols: 2, rows: 3 },
        { x: 4, y: 0, cols: 2, rows: 3 },
        { x: 6, y: 0, cols: 6, rows: 4 },
        { x: 0, y: 3, cols: 6, rows: 2 },
        { x: 6, y: 4, cols: 2, rows: 4 },
        { x: 8, y: 4, cols: 2, rows: 4 },
        { x: 10, y: 4, cols: 2, rows: 2 },
        { x: 0, y: 5, cols: 2, rows: 3 },
        { x: 2, y: 5, cols: 2, rows: 3 },
        { x: 4, y: 5, cols: 2, rows: 3 },
        { x: 10, y: 6, cols: 2, rows: 2 },
    ],
    // 变体 2 — blockTemplates.ts:49-62
    [
        { x: 0, y: 0, cols: 6, rows: 4 },
        { x: 6, y: 0, cols: 6, rows: 3 },
        { x: 6, y: 3, cols: 4, rows: 3 },
        { x: 10, y: 3, cols: 2, rows: 2 },
        { x: 0, y: 4, cols: 4, rows: 2 },
        { x: 4, y: 4, cols: 2, rows: 2 },
        { x: 10, y: 5, cols: 2, rows: 3 },
        { x: 0, y: 6, cols: 2, rows: 2 },
        { x: 2, y: 6, cols: 2, rows: 2 },
        { x: 4, y: 6, cols: 2, rows: 2 },
        { x: 6, y: 6, cols: 2, rows: 2 },
        { x: 8, y: 6, cols: 2, rows: 2 },
    ],
    // 变体 3 — blockTemplates.ts:64-77
    [
        { x: 0, y: 0, cols: 2, rows: 2 },
        { x: 2, y: 0, cols: 2, rows: 2 },
        { x: 4, y: 0, cols: 4, rows: 3 },
        { x: 8, y: 0, cols: 2, rows: 4 },
        { x: 10, y: 0, cols: 2, rows: 4 },
        { x: 0, y: 2, cols: 2, rows: 3 },
        { x: 2, y: 2, cols: 2, rows: 2 },
        { x: 4, y: 3, cols: 4, rows: 3 },
        { x: 2, y: 4, cols: 2, rows: 2 },
        { x: 8, y: 4, cols: 4, rows: 4 },
        { x: 0, y: 5, cols: 2, rows: 3 },
        { x: 2, y: 6, cols: 6, rows: 2 },
    ],
];

// flipX — blockTemplates.ts:79-82
const flipX = slots => slots.map(slot => ({
    ...slot,
    x: BLOCK_COLS - slot.x - slot.cols,
}));

// flipY — blockTemplates.ts:84-87
const flipY = slots => slots.map(slot => ({
    ...slot,
    y: BLOCK_ROWS - slot.y - slot.rows,
}));

// Reflections preserve slot order, so a card keeps its index in every orientation.
// REFLECTIONS — blockTemplates.ts:90-95
const REFLECTIONS = [
    slots => slots,
    flipX,
    flipY,
    slots => flipX(flipY(slots)),
];

// ORIENTED_TEMPLATES — blockTemplates.ts:97-99
const ORIENTED_TEMPLATES = TEMPLATES.flatMap(
    template => REFLECTIONS.map(reflect => reflect(template)),
);

// ORIENTED_REFLOWS — blockTemplates.ts:101-103
const ORIENTED_REFLOWS = BLOCK_REFLOWS.flatMap(
    perSlot => REFLECTIONS.map(reflect => perSlot.map(reflect)),
);

// BLOCK_ORIENTATION_COUNT — blockTemplates.ts:105
const BLOCK_ORIENTATION_COUNT = ORIENTED_TEMPLATES.length; __ret.BLOCK_ORIENTATION_COUNT = BLOCK_ORIENTATION_COUNT;

// Integer hash; picks the reflection so the field never settles into a visible period.
// mixBlockCoords — blockTemplates.ts:108-113 (the magic multipliers are the original's).
const mixBlockCoords = (blockColumn, blockRow) => {
    let value = Math.imul(blockColumn, 0x9e3779b1) ^ Math.imul(blockRow, 0x85ebca6b);
    value = Math.imul(value ^ (value >>> 15), 0x2c1b3c6d);
    value ^= value >>> 12;
    return value >>> 0;
};

/**
 * Resolves a block's orientation from its own coordinates, with no state to thread through.
 * The template steps linearly (+1 across, +2 down) so neighbouring blocks can never share one,
 * while the reflection comes from a hash, which keeps the field from reading as a grid.
 * getBlockOrientation — blockTemplates.ts:120-124
 * @param {number} blockColumn
 * @param {number} blockRow
 * @returns {number}
 */
const getBlockOrientation = (blockColumn, blockRow) => {
    const count = TEMPLATES.length;
    const template = ((blockColumn + blockRow * 2) % count + count) % count;
    return template * REFLECTIONS.length + mixBlockCoords(blockColumn, blockRow) % REFLECTIONS.length;
};

/**
 * getBlockTemplate — blockTemplates.ts:126-128. The returned array is shared, never mutated:
 * callers read rects only.
 * @param {number} blockColumn
 * @param {number} blockRow
 * @returns {BlockSlot[]}
 */
const getBlockTemplate = (blockColumn, blockRow) => (
    ORIENTED_TEMPLATES[getBlockOrientation(blockColumn, blockRow)]
); __ret.getBlockTemplate = getBlockTemplate;

/**
 * Where every card in this block sits while `expandedSlot` is open.
 * getBlockReflow — blockTemplates.ts:131-138. Null when the slot index is out of range.
 * @param {number} blockColumn
 * @param {number} blockRow
 * @param {number} expandedSlot
 * @returns {BlockSlot[] | null}
 */
const getBlockReflow = (
    blockColumn,
    blockRow,
    expandedSlot,
) => {
    if (expandedSlot < 0 || expandedSlot >= SLOTS_PER_BLOCK) return null;
    return ORIENTED_REFLOWS[getBlockOrientation(blockColumn, blockRow)][expandedSlot];
}; __ret.getBlockReflow = getBlockReflow;

});

// ---- core/blockReservedSlots.js ----------------------------------------
__def("core/blockReservedSlots.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/blockReservedSlots.ts (lines 10-66)
// Fidelity: verbatim-port
// Module: photowall / core

const { SLOTS_PER_BLOCK } = __req("core/blockTemplates.js");

// Structural slots held back from content, k per block. Which ones is decided by the block's own
// coordinates: a hash seeds a fixed shuffle of the block's twelve slots and the first k are taken.
// The shuffle does not depend on k, so raising k by one only ever adds one more reserved slot.
// What a reserved slot shows is the caller's business; this module only answers "is it held back".

// MIN_RESERVED_PER_BLOCK = 0 — blockReservedSlots.ts:10
const MIN_RESERVED_PER_BLOCK = 0; __ret.MIN_RESERVED_PER_BLOCK = MIN_RESERVED_PER_BLOCK;
// MAX_RESERVED_PER_BLOCK = 6 — blockReservedSlots.ts:11
const MAX_RESERVED_PER_BLOCK = 6; __ret.MAX_RESERVED_PER_BLOCK = MAX_RESERVED_PER_BLOCK;

/**
 * Integer in [0, 6]; anything unparsable counts as none.
 * clampReservedPerBlock — blockReservedSlots.ts:14-17
 * @param {number} count
 * @returns {number}
 */
const clampReservedPerBlock = (count) => {
    if (!Number.isFinite(count)) return MIN_RESERVED_PER_BLOCK;
    return Math.min(MAX_RESERVED_PER_BLOCK, Math.max(MIN_RESERVED_PER_BLOCK, Math.round(count)));
}; __ret.clampReservedPerBlock = clampReservedPerBlock;

// Seeded apart from the template orientation hash so reserved slots do not correlate with reflections.
// hashBlock — blockReservedSlots.ts:20-25
const hashBlock = (column, row) => {
    let value = Math.imul(column | 0, 0x27d4eb2d) ^ Math.imul(row | 0, 0x165667b1) ^ 0x5bd1e995;
    value = Math.imul(value ^ (value >>> 15), 0x85ebca6b);
    value = Math.imul(value ^ (value >>> 13), 0xc2b2ae35);
    return (value ^ (value >>> 16)) >>> 0;
};

// mulberry32: tiny deterministic PRNG, enough to drive one Fisher-Yates pass.
// createRandom — blockReservedSlots.ts:28-36
const createRandom = (seed) => {
    let state = seed | 0;
    return () => {
        state = (state + 0x6d2b79f5) | 0;
        let t = Math.imul(state ^ (state >>> 15), 1 | state);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

/**
 * The block's fixed slot shuffle; reserved slots are a prefix of it.
 * getBlockSlotShuffle — blockReservedSlots.ts:39-47
 * @param {number} column
 * @param {number} row
 * @returns {number[]}
 */
const getBlockSlotShuffle = (column, row) => {
    const order = Array.from({ length: SLOTS_PER_BLOCK }, (_, index) => index);
    const random = createRandom(hashBlock(column, row));
    for (let index = order.length - 1; index > 0; index -= 1) {
        const swap = Math.floor(random() * (index + 1));
        [order[index], order[swap]] = [order[swap], order[index]];
    }
    return order;
}; __ret.getBlockSlotShuffle = getBlockSlotShuffle;

/**
 * Slot indices held back in this block, in shuffle order.
 * blockReservedSlots — blockReservedSlots.ts:50-52
 * @param {number} column
 * @param {number} row
 * @param {number} count
 * @returns {number[]}
 */
const blockReservedSlots = (column, row, count) => (
    getBlockSlotShuffle(column, row).slice(0, clampReservedPerBlock(count))
); __ret.blockReservedSlots = blockReservedSlots;

/**
 * Per-slot lookup for one block: `mask[slotIndex]` is true when the slot is held back.
 * getBlockReservedMask — blockReservedSlots.ts:55-59
 * @param {number} column
 * @param {number} row
 * @param {number} count
 * @returns {boolean[]}
 */
const getBlockReservedMask = (column, row, count) => {
    const mask = new Array(SLOTS_PER_BLOCK).fill(false);
    for (const slotIndex of blockReservedSlots(column, row, count)) mask[slotIndex] = true;
    return mask;
}; __ret.getBlockReservedMask = getBlockReservedMask;

/**
 * isReservedSlot — blockReservedSlots.ts:61-63
 * @param {number} column
 * @param {number} row
 * @param {number} slotIndex
 * @param {number} count
 * @returns {boolean}
 */
const isReservedSlot = (column, row, slotIndex, count) => (
    blockReservedSlots(column, row, count).includes(slotIndex)
); __ret.isReservedSlot = isReservedSlot;

/**
 * Content capacity of one block once k slots are held back.
 * getBlockCapacity — blockReservedSlots.ts:66
 * @param {number} count
 * @returns {number}
 */
const getBlockCapacity = (count) => SLOTS_PER_BLOCK - clampReservedPerBlock(count); __ret.getBlockCapacity = getBlockCapacity;

});

// ---- core/layout.js ----------------------------------------------------
__def("core/layout.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/layout.ts (lines 1-280)
// Fidelity: verbatim-port
// Module: photowall / core

// Pure geometry for the poster wall: an infinite lattice of repeated cells, plus the
// anchored expansion reflow that pushes neighbours aside.

const { BLOCK_COLS, BLOCK_ROWS, SLOTS_PER_BLOCK, getBlockReflow, getBlockTemplate } = __req("core/blockTemplates.js");

/** @typedef {{ cols: number, rows: number }} TileSpan */
/** @typedef {{ cellSize: number, gap: number }} WallMetrics */
/** @typedef {{ left: number, right: number, top: number, bottom: number }} Bounds */
/** @typedef {{ instanceId: string, x: number, y: number, width: number, height: number }} ReflowTile */

/**
 * One drawn poster. The queue is de-duplicated at the data layer, but the wall repeats, so a
 * song owns many instances: `cellSlot` is its seat inside one lattice cell and `repeatX/Y`
 * says which copy of the cell this is.
 * @typedef {Object} QueueInstance
 * @property {string} instanceId
 * @property {number} queueIndex
 * @property {number} cellSlot
 * @property {number} repeatX
 * @property {number} repeatY
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 */

/**
 * The repeating unit: a rectangle of blocks holding one pass over the queue.
 * @typedef {Object} LatticeGeometry
 * @property {number} blocksPerRow
 * @property {number} blockRows
 * @property {number} cellSlots
 * @property {number} cellWidth
 * @property {number} cellHeight
 * @property {number} blockWidth
 * @property {number} blockHeight
 */

// overlaps — layout.ts:60-65
const overlaps = (first, second) => (
    first.left < second.right
    && first.right > second.left
    && first.top < second.bottom
    && first.bottom > second.top
); __ret.overlaps = overlaps;

// toBounds — layout.ts:67-72
const toBounds = (tile) => ({
    left: tile.x,
    right: tile.x + tile.width,
    top: tile.y,
    bottom: tile.y + tile.height,
}); __ret.toBounds = toBounds;

// Aspect of the repeating cell. Below 1 the queue would recur vertically far sooner than
// horizontally, which reads as stripes; a mild landscape bias keeps the recurrence even.
// FIELD_ASPECT = 2.2 — layout.ts:76
const FIELD_ASPECT = 2.2;

// Ceiling on posters built for one viewport, so an extreme zoom-out cannot stall a frame.
// MAX_RENDERED_INSTANCES = 400 — layout.ts:79
const MAX_RENDERED_INSTANCES = 400; __ret.MAX_RENDERED_INSTANCES = MAX_RENDERED_INSTANCES;

// getPitch — layout.ts:81
const getPitch = (metrics) => metrics.cellSize + metrics.gap; __ret.getPitch = getPitch;

/**
 * getLatticeGeometry — layout.ts:83-102. Landscape cell of whole blocks; `blocksPerRow` is the
 * sqrt solution of FIELD_ASPECT * blocks * BLOCK_ROWS / BLOCK_COLS.
 * @param {number} totalEntries
 * @param {WallMetrics} metrics
 * @returns {LatticeGeometry}
 */
const getLatticeGeometry = (totalEntries, metrics) => {
    const pitch = getPitch(metrics);
    const blockWidth = BLOCK_COLS * pitch;
    const blockHeight = BLOCK_ROWS * pitch;
    const blocks = Math.max(1, Math.ceil(Math.max(0, totalEntries) / SLOTS_PER_BLOCK));
    const blocksPerRow = blocks <= 1
        ? 1
        : Math.max(1, Math.round(Math.sqrt(FIELD_ASPECT * blocks * BLOCK_ROWS / BLOCK_COLS)));
    const blockRows = Math.ceil(blocks / blocksPerRow);

    return {
        blocksPerRow,
        blockRows,
        cellSlots: blocksPerRow * blockRows * SLOTS_PER_BLOCK,
        cellWidth: blocksPerRow * blockWidth,
        cellHeight: blockRows * blockHeight,
        blockWidth,
        blockHeight,
    };
}; __ret.getLatticeGeometry = getLatticeGeometry;

/**
 * Builds the poster sitting in one slot of one block, addressed by unbounded block coordinates.
 * The template is chosen from the block's position **inside** its cell, which is what makes the
 * lattice periodic; the cell index only contributes a translation.
 * buildInstance — layout.ts:109-138
 * @param {LatticeGeometry} geometry
 * @param {number} totalEntries
 * @param {number} absoluteColumn
 * @param {number} absoluteRow
 * @param {number} slotIndex
 * @param {WallMetrics} metrics
 * @returns {QueueInstance}
 */
const buildInstance = (
    geometry,
    totalEntries,
    absoluteColumn,
    absoluteRow,
    slotIndex,
    metrics,
) => {
    const repeatX = Math.floor(absoluteColumn / geometry.blocksPerRow);
    const repeatY = Math.floor(absoluteRow / geometry.blockRows);
    const localColumn = absoluteColumn - repeatX * geometry.blocksPerRow;
    const localRow = absoluteRow - repeatY * geometry.blockRows;
    const cellSlot = (localRow * geometry.blocksPerRow + localColumn) * SLOTS_PER_BLOCK + slotIndex;
    const slot = getBlockTemplate(localColumn, localRow)[slotIndex];
    const pitch = getPitch(metrics);

    return {
        instanceId: `${cellSlot}:${repeatX}:${repeatY}`,
        // Cells hold whole blocks, so they seat more posters than the queue has songs. Wrapping
        // fills the remainder instead of leaving a gap that would recur in every cell.
        queueIndex: cellSlot % totalEntries,
        cellSlot,
        repeatX,
        repeatY,
        x: repeatX * geometry.cellWidth + localColumn * geometry.blockWidth + slot.x * pitch,
        y: repeatY * geometry.cellHeight + localRow * geometry.blockHeight + slot.y * pitch,
        width: slot.cols * pitch - metrics.gap,
        height: slot.rows * pitch - metrics.gap,
    };
};

/**
 * Absolute block coordinates an instance sits in; the unit directional navigation steps over.
 * getInstanceBlock — layout.ts:141-148
 * @param {LatticeGeometry} geometry
 * @param {QueueInstance} instance
 * @returns {{ column: number, row: number, slotIndex: number }}
 */
const getInstanceBlock = (geometry, instance) => {
    const blockInCell = Math.floor(instance.cellSlot / SLOTS_PER_BLOCK);
    return {
        column: instance.repeatX * geometry.blocksPerRow + (blockInCell % geometry.blocksPerRow),
        row: instance.repeatY * geometry.blockRows + Math.floor(blockInCell / geometry.blocksPerRow),
        slotIndex: instance.cellSlot % SLOTS_PER_BLOCK,
    };
}; __ret.getInstanceBlock = getInstanceBlock;

/**
 * Resolves the poster in a given block slot; block coordinates may be negative.
 * locateInstanceAt — layout.ts:151-161
 * @param {LatticeGeometry} geometry
 * @param {number} totalEntries
 * @param {number} absoluteColumn
 * @param {number} absoluteRow
 * @param {number} slotIndex
 * @param {WallMetrics} metrics
 * @returns {QueueInstance | null}
 */
const locateInstanceAt = (
    geometry,
    totalEntries,
    absoluteColumn,
    absoluteRow,
    slotIndex,
    metrics,
) => {
    if (totalEntries <= 0 || slotIndex < 0 || slotIndex >= SLOTS_PER_BLOCK) return null;
    return buildInstance(geometry, totalEntries, absoluteColumn, absoluteRow, slotIndex, metrics);
}; __ret.locateInstanceAt = locateInstanceAt;

/**
 * Copy of one song closest to a world point. A song can seat more than once per cell, so every
 * seat is checked, each snapped to its nearest repeat.
 * locateNearestInstance — layout.ts:167-205
 * @param {LatticeGeometry} geometry
 * @param {number} totalEntries
 * @param {number} queueIndex
 * @param {{ x: number, y: number }} point
 * @param {WallMetrics} metrics
 * @returns {QueueInstance | null}
 */
const locateNearestInstance = (
    geometry,
    totalEntries,
    queueIndex,
    point,
    metrics,
) => {
    if (totalEntries <= 0 || queueIndex < 0 || queueIndex >= totalEntries) return null;

    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (let cellSlot = queueIndex; cellSlot < geometry.cellSlots; cellSlot += totalEntries) {
        const blockInCell = Math.floor(cellSlot / SLOTS_PER_BLOCK);
        const localColumn = blockInCell % geometry.blocksPerRow;
        const localRow = Math.floor(blockInCell / geometry.blocksPerRow);
        const slotIndex = cellSlot % SLOTS_PER_BLOCK;
        const base = buildInstance(geometry, totalEntries, localColumn, localRow, slotIndex, metrics);
        const repeatX = Math.round((point.x - base.x - base.width / 2) / geometry.cellWidth);
        const repeatY = Math.round((point.y - base.y - base.height / 2) / geometry.cellHeight);
        const candidate = buildInstance(
            geometry,
            totalEntries,
            repeatX * geometry.blocksPerRow + localColumn,
            repeatY * geometry.blockRows + localRow,
            slotIndex,
            metrics,
        );
        const dx = candidate.x + candidate.width / 2 - point.x;
        const dy = candidate.y + candidate.height / 2 - point.y;
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
            bestDistance = distance;
            best = candidate;
        }
    }

    return best;
}; __ret.locateNearestInstance = locateNearestInstance;

/**
 * Posters intersecting the viewport. Cost scales with what is on screen, never with queue length.
 * layoutLattice — layout.ts:208-241. `overscan` widens the culled rect on all four sides and the
 * result is capped at MAX_RENDERED_INSTANCES.
 * @param {LatticeGeometry} geometry
 * @param {number} totalEntries
 * @param {Bounds} bounds
 * @param {number} overscan
 * @param {WallMetrics} metrics
 * @returns {QueueInstance[]}
 */
const layoutLattice = (
    geometry,
    totalEntries,
    bounds,
    overscan,
    metrics,
) => {
    if (totalEntries <= 0 || geometry.blockWidth <= 0 || geometry.blockHeight <= 0) return [];

    const view = {
        left: bounds.left - overscan,
        right: bounds.right + overscan,
        top: bounds.top - overscan,
        bottom: bounds.bottom + overscan,
    };
    const fromColumn = Math.floor(view.left / geometry.blockWidth);
    const toColumn = Math.floor(view.right / geometry.blockWidth);
    const fromRow = Math.floor(view.top / geometry.blockHeight);
    const toRow = Math.floor(view.bottom / geometry.blockHeight);
    const result = [];

    for (let row = fromRow; row <= toRow; row += 1) {
        for (let column = fromColumn; column <= toColumn; column += 1) {
            for (let slotIndex = 0; slotIndex < SLOTS_PER_BLOCK; slotIndex += 1) {
                const instance = buildInstance(geometry, totalEntries, column, row, slotIndex, metrics);
                if (!overlaps(toBounds(instance), view)) continue;
                result.push(instance);
                if (result.length >= MAX_RENDERED_INSTANCES) return result;
            }
        }
    }

    return result;
}; __ret.layoutLattice = layoutLattice;

/**
 * Rects for every card in the block holding `active`, while that card is expanded. The block's
 * footprint is unchanged, so nothing outside it moves and no cascade can escape; the cards
 * inside re-gear instead of being shoved aside.
 * layoutExpandedBlock — layout.ts:248-279. Keyed by the same `${cellSlot}:${repeatX}:${repeatY}`
 * instance id the base layout uses, so a caller can look a re-geared rect up per instance.
 * @param {LatticeGeometry} geometry
 * @param {number} totalEntries
 * @param {QueueInstance} active
 * @param {WallMetrics} metrics
 * @returns {Map<string, { x: number, y: number, width: number, height: number }>}
 */
const layoutExpandedBlock = (
    geometry,
    totalEntries,
    active,
    metrics,
) => {
    const result = new Map();
    if (totalEntries <= 0) return result;

    const block = getInstanceBlock(geometry, active);
    const localColumn = block.column - active.repeatX * geometry.blocksPerRow;
    const localRow = block.row - active.repeatY * geometry.blockRows;
    const reflow = getBlockReflow(localColumn, localRow, block.slotIndex);
    if (!reflow) return result;

    const pitch = getPitch(metrics);
    const originX = active.repeatX * geometry.cellWidth + localColumn * geometry.blockWidth;
    const originY = active.repeatY * geometry.cellHeight + localRow * geometry.blockHeight;
    const blockInCell = localRow * geometry.blocksPerRow + localColumn;

    for (let slotIndex = 0; slotIndex < SLOTS_PER_BLOCK; slotIndex += 1) {
        const slot = reflow[slotIndex];
        const cellSlot = blockInCell * SLOTS_PER_BLOCK + slotIndex;
        result.set(`${cellSlot}:${active.repeatX}:${active.repeatY}`, {
            x: originX + slot.x * pitch,
            y: originY + slot.y * pitch,
            width: slot.cols * pitch - metrics.gap,
            height: slot.rows * pitch - metrics.gap,
        });
    }

    return result;
}; __ret.layoutExpandedBlock = layoutExpandedBlock;

});

// ---- core/wallSlots.js -------------------------------------------------
__def("core/wallSlots.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/wallSlots.ts (lines 1-139)
// Fidelity: verbatim-port
// Module: photowall / core

const { BLOCK_COLS, BLOCK_ROWS, SLOTS_PER_BLOCK, getBlockReflow, getBlockTemplate } = __req("core/blockTemplates.js");
const { getPitch, overlaps } = __req("core/layout.js");

// Fixed-world slots: every block is addressed by absolute block coordinates and keeps its template
// no matter what content is on it, so a slot is a stable identity that content flips onto. Unlike
// the Lattice queue wall there is no repeating cell here; the block field itself never wraps.

/**
 * @typedef {Object} WallSlot
 * @property {string} key   `${column},${row},${slotIndex}` - stable across layers, filters and focus reflows.
 * @property {number} column
 * @property {number} row
 * @property {number} slotIndex
 * @property {number} x
 * @property {number} y
 * @property {number} width
 * @property {number} height
 * @property {number} centerX
 * @property {number} centerY
 * @property {number} area   Footprint in grid cells (cols x rows).
 */

/** @typedef {{ from: number, to: number }} BlockRange */

// wallSlotKey — wallSlots.ts:35
const wallSlotKey = (column, row, slotIndex) => `${column},${row},${slotIndex}`; __ret.wallSlotKey = wallSlotKey;

// getBlockSize — wallSlots.ts:37-40
const getBlockSize = (metrics) => {
    const pitch = getPitch(metrics);
    return { width: BLOCK_COLS * pitch, height: BLOCK_ROWS * pitch };
}; __ret.getBlockSize = getBlockSize;

// toWallSlot — wallSlots.ts:42-67
const toWallSlot = (
    column,
    row,
    slotIndex,
    rect,
    metrics,
) => {
    const pitch = getPitch(metrics);
    const x = column * BLOCK_COLS * pitch + rect.x * pitch;
    const y = row * BLOCK_ROWS * pitch + rect.y * pitch;
    const width = rect.cols * pitch - metrics.gap;
    const height = rect.rows * pitch - metrics.gap;
    return {
        key: wallSlotKey(column, row, slotIndex),
        column,
        row,
        slotIndex,
        x,
        y,
        width,
        height,
        centerX: x + width / 2,
        centerY: y + height / 2,
        area: rect.cols * rect.rows,
    };
};

/**
 * getBlockSlots — wallSlots.ts:69-71
 * @param {number} column
 * @param {number} row
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {WallSlot[]}
 */
const getBlockSlots = (column, row, metrics) => (
    getBlockTemplate(column, row).map((rect, slotIndex) => toWallSlot(column, row, slotIndex, rect, metrics))
); __ret.getBlockSlots = getBlockSlots;

/**
 * getWallSlot — wallSlots.ts:73-81. Null for a non-integer or out-of-range slot index.
 * @param {number} column
 * @param {number} row
 * @param {number} slotIndex
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {WallSlot | null}
 */
const getWallSlot = (
    column,
    row,
    slotIndex,
    metrics,
) => {
    if (!Number.isInteger(slotIndex) || slotIndex < 0 || slotIndex >= SLOTS_PER_BLOCK) return null;
    return toWallSlot(column, row, slotIndex, getBlockTemplate(column, row)[slotIndex], metrics);
}; __ret.getWallSlot = getWallSlot;

/**
 * parseWallSlotKey — wallSlots.ts:83-87. Inverse of wallSlotKey; null when the key is malformed.
 * @param {string} key
 * @returns {{ column: number, row: number, slotIndex: number } | null}
 */
const parseWallSlotKey = (key) => {
    const parts = key.split(',').map(Number);
    if (parts.length !== 3 || parts.some(part => !Number.isInteger(part))) return null;
    return { column: parts[0], row: parts[1], slotIndex: parts[2] };
}; __ret.parseWallSlotKey = parseWallSlotKey;

/**
 * Every slot of every block in a block rectangle; `to` is exclusive. Row-major, slot order inside a block.
 * collectBlockRangeSlots — wallSlots.ts:90-102
 * @param {BlockRange} columns
 * @param {BlockRange} rows
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {WallSlot[]}
 */
const collectBlockRangeSlots = (
    columns,
    rows,
    metrics,
) => {
    const result = [];
    for (let row = rows.from; row < rows.to; row += 1) {
        for (let column = columns.from; column < columns.to; column += 1) {
            result.push(...getBlockSlots(column, row, metrics));
        }
    }
    return result;
}; __ret.collectBlockRangeSlots = collectBlockRangeSlots;

/**
 * Slots overlapping a world rect, capped so a zoomed-out view cannot stall a frame.
 * collectWallSlots — wallSlots.ts:105-123. `limit` defaults to Infinity (the original's default).
 * @param {import('./layout.js').Bounds} bounds
 * @param {import('./layout.js').WallMetrics} metrics
 * @param {number} [limit]
 * @returns {WallSlot[]}
 */
const collectWallSlots = (bounds, metrics, limit = Number.POSITIVE_INFINITY) => {
    const block = getBlockSize(metrics);
    const result = [];
    const fromColumn = Math.floor(bounds.left / block.width);
    const toColumn = Math.floor(bounds.right / block.width);
    const fromRow = Math.floor(bounds.top / block.height);
    const toRow = Math.floor(bounds.bottom / block.height);
    for (let row = fromRow; row <= toRow; row += 1) {
        for (let column = fromColumn; column <= toColumn; column += 1) {
            for (const slot of getBlockSlots(column, row, metrics)) {
                const slotBounds = { left: slot.x, right: slot.x + slot.width, top: slot.y, bottom: slot.y + slot.height };
                if (!overlaps(slotBounds, bounds)) continue;
                result.push(slot);
                if (result.length >= limit) return result;
            }
        }
    }
    return result;
}; __ret.collectWallSlots = collectWallSlots;

/**
 * The twelve slots of one block while `focusedSlot` is expanded to the 6x6 gear. Keys and slot
 * indices are unchanged - only rects move - so anything keyed by slot identity (content, reserved
 * slots) rides along with the reflow, and nothing outside the block moves.
 * layoutFocusedBlock — wallSlots.ts:130-139. Null when the slot index has no reflow table entry.
 * @param {number} column
 * @param {number} row
 * @param {number} focusedSlot
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {WallSlot[] | null}
 */
const layoutFocusedBlock = (
    column,
    row,
    focusedSlot,
    metrics,
) => {
    const reflow = getBlockReflow(column, row, focusedSlot);
    if (!reflow) return null;
    return reflow.map((rect, slotIndex) => toWallSlot(column, row, slotIndex, rect, metrics));
}; __ret.layoutFocusedBlock = layoutFocusedBlock;

});

// ---- core/rankSlots.js -------------------------------------------------
__def("core/rankSlots.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/rankSlots.ts (lines 1-75)
// Fidelity: verbatim-port
// Module: photowall / core

const { getBlockReservedMask } = __req("core/blockReservedSlots.js");
const { getPitch } = __req("core/layout.js");

// Rank -> slot: every slot gets a priority score and receives ranks 0, 1, 2... in score order, so the
// best results always sit next to the rank origin and rank spirals outward. Strict rank only: rank i
// is always the i-th slot of the order (the prototype's "sticky" variant is not carried over).

/** @typedef {{ x: number, y: number }} WallPoint */
/** @typedef {import('./wallSlots.js').WallSlot} WallSlot */

/**
 * @typedef {Object} RankSlotsOptions
 * @property {WallPoint} origin   Seam point (seam-centred layers) or the start tile's centre.
 * @property {import('./layout.js').WallMetrics} metrics
 * @property {number} [reservedPerBlock]  k reserved slots per block; ranks skip them.
 * @property {string | null} [startSlotKey]  Pinned to rank 0 when present and not reserved.
 */

// Prototype weights: vertical distance counts a little less than horizontal (the field is landscape),
// and bigger slots are pulled forward by sqrt(area) pitches so headline ranks land on big posters.
// RANK_VERTICAL_WEIGHT = 0.9 — rankSlots.ts:25
const RANK_VERTICAL_WEIGHT = 0.9; __ret.RANK_VERTICAL_WEIGHT = RANK_VERTICAL_WEIGHT;
// RANK_AREA_WEIGHT = 0.35 — rankSlots.ts:26
const RANK_AREA_WEIGHT = 0.35; __ret.RANK_AREA_WEIGHT = RANK_AREA_WEIGHT;

/**
 * Lower is better: distance to the origin minus a size bonus.
 * scoreWallSlot — rankSlots.ts:29-33
 * @param {WallSlot} slot
 * @param {WallPoint} origin
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {number}
 */
const scoreWallSlot = (slot, origin, metrics) => (
    Math.abs(slot.centerX - origin.x)
    + Math.abs(slot.centerY - origin.y) * RANK_VERTICAL_WEIGHT
    - Math.sqrt(slot.area) * getPitch(metrics) * RANK_AREA_WEIGHT
); __ret.scoreWallSlot = scoreWallSlot;

// Ties break on world position, never on input order, so the same slot set always ranks the same.
// compareSlots — rankSlots.ts:36-40
const compareSlots = (first, second) => (
    first.row - second.row
    || first.column - second.column
    || first.slotIndex - second.slotIndex
);

/**
 * Drops reserved slots, looking each block's mask up once.
 * withoutReservedSlots — rankSlots.ts:43-55. The copy is deliberate: the caller keeps its array.
 * @param {readonly WallSlot[]} slots
 * @param {number} reservedPerBlock
 * @returns {WallSlot[]}
 */
const withoutReservedSlots = (slots, reservedPerBlock) => {
    if (!reservedPerBlock) return [...slots];
    const masks = new Map();
    return slots.filter(slot => {
        const blockKey = `${slot.column},${slot.row}`;
        let mask = masks.get(blockKey);
        if (!mask) {
            mask = getBlockReservedMask(slot.column, slot.row, reservedPerBlock);
            masks.set(blockKey, mask);
        }
        return !mask[slot.slotIndex];
    });
}; __ret.withoutReservedSlots = withoutReservedSlots;

/**
 * Orders the candidate slots for strict rank. Reserved slots never appear in the result; the start
 * slot, if given, is rank 0 and everything else spreads out from `origin` by score.
 * rankSlots — rankSlots.ts:61-70
 * @param {readonly WallSlot[]} candidates
 * @param {RankSlotsOptions} options
 * @returns {WallSlot[]}
 */
const rankSlots = (candidates, options) => {
    const open = withoutReservedSlots(candidates, options.reservedPerBlock ?? 0);
    const scored = open.map(slot => ({ slot, score: scoreWallSlot(slot, options.origin, options.metrics) }));
    scored.sort((first, second) => first.score - second.score || compareSlots(first.slot, second.slot));
    const order = scored.map(entry => entry.slot);

    const startIndex = options.startSlotKey ? order.findIndex(slot => slot.key === options.startSlotKey) : -1;
    if (startIndex > 0) order.unshift(...order.splice(startIndex, 1));
    return order;
}; __ret.rankSlots = rankSlots;

/**
 * Strict rank: slot key -> rank for every ordered slot; ranks below `itemCount` carry content.
 * indexRanks — rankSlots.ts:73-75
 * @param {readonly WallSlot[]} order
 * @returns {Map<string, number>}
 */
const indexRanks = (order) => (
    new Map(order.map((slot, rank) => [slot.key, rank]))
); __ret.indexRanks = indexRanks;

});

// ---- core/startTile.js -------------------------------------------------
__def("core/startTile.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/startTile.ts (lines 1-70)
// Fidelity: verbatim-port
// Module: photowall / core

const { getBlockCapacity, getBlockReservedMask } = __req("core/blockReservedSlots.js");
const { SLOTS_PER_BLOCK } = __req("core/blockTemplates.js");
const { getLatticeGeometry } = __req("core/layout.js");

// The infinite wall and its start tile. Content repeats over a landscape period of whole blocks
// (same FIELD_ASPECT rule as the Lattice cell); inside a block, content takes the non-reserved
// slots in slot order. A wrap offset rotates the sequence so the tile the user clicked - the start
// tile - shows item 0. The offset belongs to the layer, so flipping to a finite mode and back
// restores exactly the same wall.

/**
 * @typedef {Object} WrapPeriod
 * @property {number} blocksPerRow
 * @property {number} blockRows
 * @property {number} perBlock   Content slots per block after reserved ones.
 */

/** @typedef {{ column: number, row: number, slotIndex: number }} SlotAddress */

// getLatticeGeometry is used for its block counts only; pixel sizes do not matter here.
// UNIT_METRICS — startTile.ts:23
const UNIT_METRICS = { cellSize: 1, gap: 0 };

// mod — startTile.ts:25
const mod = (value, size) => ((value % size) + size) % size;

/**
 * getWrapPeriod — startTile.ts:27-32
 * @param {number} itemCount
 * @param {number} [reservedPerBlock]
 * @returns {WrapPeriod}
 */
const getWrapPeriod = (itemCount, reservedPerBlock = 0) => {
    const perBlock = getBlockCapacity(reservedPerBlock);
    const blocks = Math.max(1, Math.ceil(Math.max(0, itemCount) / perBlock));
    const geometry = getLatticeGeometry(blocks * SLOTS_PER_BLOCK, UNIT_METRICS);
    return { blocksPerRow: geometry.blocksPerRow, blockRows: geometry.blockRows, perBlock };
}; __ret.getWrapPeriod = getWrapPeriod;

/**
 * Position of a slot in the repeating sequence before the wrap offset, or null for a reserved slot
 * (and for an empty layer). Every period holds every item at least once.
 * getWrapIndex — startTile.ts:38-48
 * @param {SlotAddress} slot
 * @param {number} itemCount
 * @param {number} [reservedPerBlock]
 * @returns {number | null}
 */
const getWrapIndex = (slot, itemCount, reservedPerBlock = 0) => {
    if (itemCount <= 0) return null;
    const mask = getBlockReservedMask(slot.column, slot.row, reservedPerBlock);
    if (mask[slot.slotIndex]) return null;
    let within = 0;
    for (let index = 0; index < slot.slotIndex; index += 1) if (!mask[index]) within += 1;

    const period = getWrapPeriod(itemCount, reservedPerBlock);
    const blockInPeriod = mod(slot.row, period.blockRows) * period.blocksPerRow + mod(slot.column, period.blocksPerRow);
    return (blockInPeriod * period.perBlock + within) % itemCount;
}; __ret.getWrapIndex = getWrapIndex;

/**
 * Offset that makes `startSlot` show item 0; 0 when there is no usable start slot.
 * getStartWrapOffset — startTile.ts:51-59
 * @param {SlotAddress | null | undefined} startSlot
 * @param {number} itemCount
 * @param {number} [reservedPerBlock]
 * @returns {number}
 */
const getStartWrapOffset = (
    startSlot,
    itemCount,
    reservedPerBlock = 0,
) => {
    if (!startSlot) return 0;
    const index = getWrapIndex(startSlot, itemCount, reservedPerBlock);
    return index === null ? 0 : mod(-index, itemCount);
}; __ret.getStartWrapOffset = getStartWrapOffset;

/**
 * Item index an infinite-mode slot shows, or null when it is reserved / the layer is empty.
 * getInfiniteSlotItem — startTile.ts:62-70
 * @param {SlotAddress} slot
 * @param {number} itemCount
 * @param {number} wrapOffset
 * @param {number} [reservedPerBlock]
 * @returns {number | null}
 */
const getInfiniteSlotItem = (
    slot,
    itemCount,
    wrapOffset,
    reservedPerBlock = 0,
) => {
    const index = getWrapIndex(slot, itemCount, reservedPerBlock);
    return index === null ? null : mod(index + wrapOffset, itemCount);
}; __ret.getInfiniteSlotItem = getInfiniteSlotItem;

});

// ---- core/wallView.js --------------------------------------------------
__def("core/wallView.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/wallView.ts (lines 1-64)
// Fidelity: adapted-port (one deviation, marked below)
// Module: photowall / core

// Viewport <-> world conversions for the fixed-world wall. The pure geometry here talks about the
// world point under the seam line (the "view centre"); the DOM camera is a translation plus scale.

/**
 * @typedef {Object} WallView
 * @property {number} width    Viewport size in screen px.
 * @property {number} height
 * @property {number} scale
 * @property {number} [lineX]  Screen x of the seam's base line; the viewport's horizontal middle when omitted.
 */

/** @typedef {{ x: number, y: number }} WallViewCenter */

/** Same shape as the wall's DOM camera: `screen = camera + world * scale`. @typedef {{ x: number, y: number, scale: number }} WallViewCamera */

// getViewLineX — wallView.ts:22
const getViewLineX = (view) => view.lineX ?? view.width / 2; __ret.getViewLineX = getViewLineX;

/**
 * The world layer's CSS transform for a camera, with the translation snapped to whole device pixels.
 * The world is deliberately not `will-change: transform` (see styles/wall.css), and without that hint
 * Chromium aligns the layer's raster to the pixel grid: every change in the fractional part of the
 * translation throws the tiles away and rasterizes the whole visible wall again, i.e. on every frame
 * of a wheel glide, a drag or a camera tween. Moving in whole device pixels keeps that fraction
 * fixed, so panning only moves tiles, the same way the browser snaps its own scroll offsets.
 * formatWorldTransform — wallView.ts:32-35.
 * DEVIATION (adapted-port): the original defaults `devicePixelRatio` to `window.devicePixelRatio`
 * and therefore reads a DOM global. This core module must stay importable in plain Node with no DOM,
 * so the parameter defaults to 1. The DOM layer (dom/camera.js, dom/createWall.js) passes the live
 * `window.devicePixelRatio` explicitly, which reproduces the original value in a browser.
 * @param {number} x
 * @param {number} y
 * @param {number} scale
 * @param {number} [devicePixelRatio]
 * @returns {string}
 */
const formatWorldTransform = (x, y, scale, devicePixelRatio = 1) => {
    const snap = (value) => Math.round(value * devicePixelRatio) / devicePixelRatio;
    return `translate3d(${snap(x)}px, ${snap(y)}px, 0) scale(${scale})`;
}; __ret.formatWorldTransform = formatWorldTransform;

// viewCenterFromCamera — wallView.ts:37-40
const viewCenterFromCamera = (camera, view) => ({
    x: (getViewLineX(view) - camera.x) / camera.scale,
    y: (view.height / 2 - camera.y) / camera.scale,
}); __ret.viewCenterFromCamera = viewCenterFromCamera;

// cameraFromViewCenter — wallView.ts:42-46
const cameraFromViewCenter = (center, view) => ({
    x: getViewLineX(view) - center.x * view.scale,
    y: view.height / 2 - center.y * view.scale,
    scale: view.scale,
}); __ret.cameraFromViewCenter = cameraFromViewCenter;

/**
 * World rect on screen around a view centre. An open seam pushes the two halves apart, so the
 * horizontal span is widened by the seam width on both sides (as the prototype's culling does).
 * getViewWorldBounds — wallView.ts:52-64
 * @param {WallViewCenter} center
 * @param {WallView} view
 * @param {{ seamWidth?: number, overscan?: number }} [options]
 * @returns {import('./layout.js').Bounds}
 */
const getViewWorldBounds = (
    center,
    view,
    { seamWidth = 0, overscan = 0 } = {},
) => {
    const lineX = getViewLineX(view);
    return {
        left: center.x - (lineX + seamWidth) / view.scale - overscan,
        right: center.x + (view.width - lineX + seamWidth) / view.scale + overscan,
        top: center.y - view.height / 2 / view.scale - overscan,
        bottom: center.y + view.height / 2 / view.scale + overscan,
    };
}; __ret.getViewWorldBounds = getViewWorldBounds;

});

// ---- core/seamPlan.js --------------------------------------------------
__def("core/seamPlan.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/seamPlan.ts (lines 1-141)
// Fidelity: verbatim-port
// Module: photowall / core

const { getViewLineX } = __req("core/wallView.js");
const { getBlockSize } = __req("core/wallSlots.js");

// Where a vertical split may open and how it reacts to the camera. The split only ever opens on a
// block boundary: no slot crosses the gap between two 12x8 blocks, so nothing is squeezed or cut.
// When the chosen boundary cannot hold the whole opening on screen, the camera yields the minimum
// distance instead. The split belongs to the world (it rides with the camera) and narrows as it
// nears a viewport edge, closing completely once it leaves. Opening widths are the caller's.

/** Screen-px margin kept between an open split and the viewport edge. SEAM_EDGE_MARGIN = 14 — seamPlan.ts:14 */
const SEAM_EDGE_MARGIN = 14; __ret.SEAM_EDGE_MARGIN = SEAM_EDGE_MARGIN;
/** Weight of "distance from the base line" against "camera shift" when choosing a boundary. SEAM_LINE_DISTANCE_WEIGHT = 0.15 — seamPlan.ts:16 */
const SEAM_LINE_DISTANCE_WEIGHT = 0.15; __ret.SEAM_LINE_DISTANCE_WEIGHT = SEAM_LINE_DISTANCE_WEIGHT;

/**
 * World x of the gap midline on the left edge of block `column`.
 * getSeamBoundaryX — seamPlan.ts:19-21
 * @param {number} column
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {number}
 */
const getSeamBoundaryX = (column, metrics) => (
    column * getBlockSize(metrics).width - metrics.gap / 2
); __ret.getSeamBoundaryX = getSeamBoundaryX;

// nearestSeamBoundaryX — seamPlan.ts:23-25
const nearestSeamBoundaryX = (x, metrics) => (
    getSeamBoundaryX(Math.round((x + metrics.gap / 2) / getBlockSize(metrics).width), metrics)
); __ret.nearestSeamBoundaryX = nearestSeamBoundaryX;

// isSeamBoundaryX — seamPlan.ts:27-29
const isSeamBoundaryX = (x, metrics) => (
    Math.abs(nearestSeamBoundaryX(x, metrics) - x) < 1e-6
); __ret.isSeamBoundaryX = isSeamBoundaryX;

/**
 * @typedef {Object} SeamPlan
 * @property {number} x          World x of the split (a block boundary unless `preferX` said otherwise).
 * @property {number} cameraX    View centre x after yielding; equals the input when the split already fits.
 * @property {number} shift      Camera shift in screen px.
 */

/**
 * @typedef {Object} BlockSeamPlanInput
 * @property {number} cameraX    Current view centre x (world point under the base line).
 * @property {number} openWidth  Width the split is about to open to, in screen px.
 * @property {import('./wallView.js').WallView} view
 * @property {import('./layout.js').WallMetrics} metrics
 * @property {number} [preferX]  Keep this boundary (the split is visible and stays put); only the camera may yield.
 * @property {number} [edge]
 */

/**
 * Picks the boundary for a split: the nearest few around the camera (or `preferX`), each moved
 * on screen by the smallest camera shift that fits the whole opening, scored by
 * shift + weight x distance from the base line.
 * blockSeamPlan — seamPlan.ts:57-87
 * @param {BlockSeamPlanInput} input
 * @returns {SeamPlan}
 */
const blockSeamPlan = ({
    cameraX,
    openWidth,
    view,
    metrics,
    preferX,
    edge = SEAM_EDGE_MARGIN,
}) => {
    const lineX = getViewLineX(view);
    const need = openWidth / 2 + edge;
    const blockWidth = getBlockSize(metrics).width;
    const base = Math.round((cameraX + metrics.gap / 2) / blockWidth);
    const candidates = preferX !== undefined
        ? [preferX]
        : [base - 1, base, base + 1].map(column => getSeamBoundaryX(column, metrics));

    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;
    for (const x of candidates) {
        const screenX = lineX + (x - cameraX) * view.scale;
        const fitX = Math.max(need, Math.min(view.width - need, screenX));
        const nextCameraX = x - (fitX - lineX) / view.scale;
        const shift = Math.abs(nextCameraX - cameraX) * view.scale;
        const score = shift + Math.abs(fitX - lineX) * SEAM_LINE_DISTANCE_WEIGHT;
        if (!best || score < bestScore) {
            best = { x, cameraX: nextCameraX, shift };
            bestScore = score;
        }
    }
    return best;
}; __ret.blockSeamPlan = blockSeamPlan;

/**
 * @typedef {Object} SeamGeometry
 * @property {number} screenX    Screen x of the split's centre.
 * @property {number} width      Rendered opening: squeezed to twice the room left before the edge margin, 0 off screen.
 * @property {boolean} collapsed Meant to be open but squeezed shut - show the edge tab on `side`.
 * @property {'left' | 'right'} side
 */

/**
 * Follow coupling: the split sits on its world anchor and narrows near the viewport edges.
 * getSeamGeometry — seamPlan.ts:100-112
 * @param {{ anchorX: number, cameraX: number, openWidth: number, view: import('./wallView.js').WallView, edge?: number }} input
 * @returns {SeamGeometry}
 */
const getSeamGeometry = ({
    anchorX,
    cameraX,
    openWidth,
    view,
    edge = SEAM_EDGE_MARGIN,
}) => {
    const lineX = getViewLineX(view);
    const screenX = lineX + (anchorX - cameraX) * view.scale;
    const room = Math.min(screenX, view.width - screenX) - edge;
    const width = Math.max(0, Math.min(openWidth, room * 2));
    return { screenX, width, collapsed: openWidth > 1 && width < 2, side: screenX < lineX ? 'left' : 'right' };
}; __ret.getSeamGeometry = getSeamGeometry;

/**
 * Camera x range that keeps the whole opening on screen. Camera clamps are widened to include it,
 * otherwise the yield from `blockSeamPlan` would be rubber-banded straight back.
 * getSeamCameraSpan — seamPlan.ts:118-132
 * @param {{ anchorX: number, openWidth: number, view: import('./wallView.js').WallView, edge?: number }} input
 * @returns {{ min: number, max: number }}
 */
const getSeamCameraSpan = ({
    anchorX,
    openWidth,
    view,
    edge = SEAM_EDGE_MARGIN,
}) => {
    const lineX = getViewLineX(view);
    const need = openWidth / 2 + edge;
    const min = anchorX - (view.width - need - lineX) / view.scale;
    const max = anchorX + (lineX - need) / view.scale;
    if (min <= max) return { min, max };
    // Wider than the viewport: the only sensible spot is centred.
    const centred = anchorX - (view.width / 2 - lineX) / view.scale;
    return { min: centred, max: centred };
}; __ret.getSeamCameraSpan = getSeamCameraSpan;

/**
 * Split mode moves each half away by half the opening plus half a gap (scaled), so the paper strip
 * sits one gap from the posters on both sides. Returns screen-px offsets for the two halves.
 * getSeamSplitOffsets — seamPlan.ts:138-141
 * @param {number} width
 * @param {number} scale
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {{ left: number, right: number }}
 */
const getSeamSplitOffsets = (width, scale, metrics) => {
    const pad = (metrics.gap / 2) * scale * Math.min(1, width / 16);
    return { left: -width / 2 - pad, right: width / 2 + pad };
}; __ret.getSeamSplitOffsets = getSeamSplitOffsets;

});

// ---- core/finiteWall.js ------------------------------------------------
__def("core/finiteWall.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/finiteWall.ts (lines 1-168)
// Fidelity: verbatim-port
// Module: photowall / core

const { getBlockCapacity } = __req("core/blockReservedSlots.js");
const { SLOTS_PER_BLOCK } = __req("core/blockTemplates.js");
const { getLatticeGeometry } = __req("core/layout.js");
const { indexRanks, rankSlots } = __req("core/rankSlots.js");
const { getSeamCameraSpan } = __req("core/seamPlan.js");
const { getViewLineX, getViewWorldBounds } = __req("core/wallView.js");
const { collectBlockRangeSlots, getBlockSize } = __req("core/wallSlots.js");

// The finite wall: no wrapping, every item at most once, unused slots stay bare wall. Its world is
// the fewest whole blocks that hold the items (after reserved slots), laid out landscape like the
// Lattice cell (FIELD_ASPECT via getLatticeGeometry) and never smaller than the viewport. Ranks are
// assigned inside that world; the camera is clamped to the occupied part and locks when it fits.

/**
 * @typedef {Object} FiniteWallInput
 * @property {number} itemCount               Plan with the layer's full count: filtering only changes how many ranks carry content.
 * @property {number} [reservedPerBlock]
 * @property {import('./layout.js').WallMetrics} metrics
 * @property {import('./wallView.js').WallView} view
 * @property {import('./rankSlots.js').WallPoint} origin  Rank origin: the seam point, or the start tile's centre.
 * @property {string | null} [startSlotKey]
 * @property {import('./wallView.js').WallViewCenter} [viewCenter]  Where the camera is looking now; the world always covers this screen. Defaults to `origin`.
 */

/**
 * @typedef {Object} FiniteWallPlan
 * @property {import('./wallSlots.js').BlockRange} columns
 * @property {import('./wallSlots.js').BlockRange} rows
 * @property {import('./layout.js').Bounds} bounds  World rect of the whole finite wall, bare slots included.
 * @property {number} capacity                     Non-reserved slots in the world; always >= itemCount.
 * @property {import('./wallSlots.js').WallSlot[]} order  Strict rank order over the world's non-reserved slots.
 * @property {Map<string, number>} rankOfSlot
 */

// centredRange — finiteWall.ts:41-44
const centredRange = (center, count) => {
    const from = Math.round(center - count / 2);
    return { from, to: from + count };
};

// unionRange — finiteWall.ts:46-49
const unionRange = (first, second) => ({
    from: Math.min(first.from, second.from),
    to: Math.max(first.to, second.to),
});

/**
 * Block rectangle of the finite world: content-sized around the origin, grown to cover the screen.
 * getFiniteWallBlocks — finiteWall.ts:52-75
 * @param {FiniteWallInput} input
 * @returns {{ columns: import('./wallSlots.js').BlockRange, rows: import('./wallSlots.js').BlockRange, bounds: import('./layout.js').Bounds, capacity: number }}
 */
const getFiniteWallBlocks = (input) => {
    const perBlock = getBlockCapacity(input.reservedPerBlock ?? 0);
    const blocks = Math.max(1, Math.ceil(Math.max(0, input.itemCount) / perBlock));
    const geometry = getLatticeGeometry(blocks * SLOTS_PER_BLOCK, input.metrics);
    const block = getBlockSize(input.metrics);

    const screen = getViewWorldBounds(input.viewCenter ?? input.origin, input.view);
    const screenColumns = { from: Math.floor(screen.left / block.width), to: Math.floor(screen.right / block.width) + 1 };
    const screenRows = { from: Math.floor(screen.top / block.height), to: Math.floor(screen.bottom / block.height) + 1 };
    const columns = unionRange(centredRange(input.origin.x / block.width, geometry.blocksPerRow), screenColumns);
    const rows = unionRange(centredRange(input.origin.y / block.height, geometry.blockRows), screenRows);

    return {
        columns,
        rows,
        bounds: {
            left: columns.from * block.width,
            right: columns.to * block.width - input.metrics.gap,
            top: rows.from * block.height,
            bottom: rows.to * block.height - input.metrics.gap,
        },
        capacity: (columns.to - columns.from) * (rows.to - rows.from) * perBlock,
    };
}; __ret.getFiniteWallBlocks = getFiniteWallBlocks;

/**
 * planFiniteWall — finiteWall.ts:77-86
 * @param {FiniteWallInput} input
 * @returns {FiniteWallPlan}
 */
const planFiniteWall = (input) => {
    const world = getFiniteWallBlocks(input);
    const order = rankSlots(collectBlockRangeSlots(world.columns, world.rows, input.metrics), {
        origin: input.origin,
        metrics: input.metrics,
        reservedPerBlock: input.reservedPerBlock,
        startSlotKey: input.startSlotKey,
    });
    return { ...world, order, rankOfSlot: indexRanks(order) };
}; __ret.planFiniteWall = planFiniteWall;

/**
 * Bounding rect of the first `count` ranks - the part of the world that has content.
 * getRankedContentBounds — finiteWall.ts:89-98
 * @param {readonly import('./wallSlots.js').WallSlot[]} order
 * @param {number} count
 * @returns {import('./layout.js').Bounds | null}
 */
const getRankedContentBounds = (order, count) => {
    const used = order.slice(0, Math.max(0, count));
    if (!used.length) return null;
    return {
        left: Math.min(...used.map(slot => slot.x)),
        right: Math.max(...used.map(slot => slot.x + slot.width)),
        top: Math.min(...used.map(slot => slot.y)),
        bottom: Math.max(...used.map(slot => slot.y + slot.height)),
    };
}; __ret.getRankedContentBounds = getRankedContentBounds;

/**
 * @typedef {Object} WallCameraRange
 * @property {number} minX
 * @property {number} maxX
 * @property {number} minY
 * @property {number} maxY
 * @property {boolean} lockedX  Content fits across / down the screen: the content clamp collapsed onto the anchor.
 * @property {boolean} lockedY
 */

/** FINITE_CAMERA_PAD = 60 — finiteWall.ts:110 */
const FINITE_CAMERA_PAD = 60; __ret.FINITE_CAMERA_PAD = FINITE_CAMERA_PAD;

/**
 * Clamp for a finite layer's view centre: the content rect (plus a small pad) minus the screen on
 * either side of the split, locked onto the anchor when the content fits; then widened so the anchor
 * itself may sit anywhere the whole opening fits, and so the anchor point is always reachable.
 * getFiniteCameraRange — finiteWall.ts:117-156
 * @param {{ contentBounds: import('./layout.js').Bounds | null, anchor: import('./rankSlots.js').WallPoint, view: import('./wallView.js').WallView, seamWidth: number, pad?: number }} input
 * @returns {WallCameraRange}
 */
const getFiniteCameraRange = ({
    contentBounds,
    anchor,
    view,
    seamWidth,
    pad = FINITE_CAMERA_PAD,
}) => {
    const { scale } = view;
    const lineX = getViewLineX(view);
    const leftSpan = (lineX - seamWidth / 2) / scale;
    const rightSpan = (view.width - lineX - seamWidth / 2) / scale;
    const halfHeight = view.height / 2 / scale;
    const content = contentBounds ?? { left: anchor.x, right: anchor.x, top: anchor.y, bottom: anchor.y };

    let minX = content.left + leftSpan - pad;
    let maxX = content.right - rightSpan + pad;
    let minY = content.top + halfHeight - pad;
    let maxY = content.bottom - halfHeight + pad;
    const lockedX = minX > maxX;
    const lockedY = minY > maxY;
    if (lockedX) minX = maxX = anchor.x;
    if (lockedY) minY = maxY = anchor.y;

    const seam = getSeamCameraSpan({ anchorX: anchor.x, openWidth: seamWidth, view });
    return {
        minX: Math.min(minX, seam.min),
        maxX: Math.max(maxX, seam.max),
        minY: Math.min(minY, anchor.y),
        maxY: Math.max(maxY, anchor.y),
        lockedX,
        lockedY,
    };
}; __ret.getFiniteCameraRange = getFiniteCameraRange;

/**
 * Where a released camera settles: the nearest point inside the range.
 * clampToCameraRange — finiteWall.ts:159-162
 * @param {import('./wallView.js').WallViewCenter} center
 * @param {WallCameraRange} range
 * @returns {import('./wallView.js').WallViewCenter}
 */
const clampToCameraRange = (center, range) => ({
    x: Math.min(range.maxX, Math.max(range.minX, center.x)),
    y: Math.min(range.maxY, Math.max(range.minY, center.y)),
}); __ret.clampToCameraRange = clampToCameraRange;

/**
 * One drag step on one axis: full speed inside the range, resisted outside it (rubber band).
 * stepCameraAxis — finiteWall.ts:165-168
 * @param {number} value
 * @param {number} delta
 * @param {number} min
 * @param {number} max
 * @param {number} [resistance]  resistance = 0.35 — finiteWall.ts:165
 * @returns {number}
 */
const stepCameraAxis = (value, delta, min, max, resistance = 0.35) => {
    const next = value + delta;
    return next < min || next > max ? value + delta * resistance : next;
}; __ret.stepCameraAxis = stepCameraAxis;

});

// ---- core/panMotion.js -------------------------------------------------
__def("core/panMotion.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/wallPanMotion.ts (lines 1-99)
// Fidelity: verbatim-port
// Module: photowall / core

// 墙面平移的运动参数与滚轮输入的判别，Lattice 队列墙与 bravais 墙共用一份（useWallPointerPan 读它）。
// - 拖动松手的惯性：framer `inertia`（指数衰减，时间常数 WALL_PAN_INERTIA.timeConstant）。
// - 鼠标滚轮：一格一格的离散大步长，累加进「待走的位移」，相机每帧按同一类指数曲线追上去（时间常数更短，一格在
//   约 0.25s 内基本走完）；连续滚动时位移叠加，速度与剩余距离成正比，所以不会越积越慢。
// - 触控板：自带连续的小增量与系统惯性，每个增量照旧当帧直接写进相机（再平滑一次只会发飘、拖后）。

/** 拖动松手后的惯性（framer `inertia`）。速度上限、投射系数与时间常数。 */
// WALL_PAN_INERTIA — wallPanMotion.ts:9-18
const WALL_PAN_INERTIA = {
    /** 松手速度（px/s）低于它不滑行。 */
    minSpeed: 40,
    maxSpeed: 4000,
    power: 0.3,
    timeConstant: 280,
    restDelta: 0.5,
    /** 最后一次移动距松手超过这么久（ms）算停住了再松手，不滑行。 */
    staleReleaseMs: 80,
}; __ret.WALL_PAN_INERTIA = WALL_PAN_INERTIA;

/** 鼠标滚轮的平滑与判别参数。 */
// WALL_WHEEL_SMOOTHING — wallPanMotion.ts:21-37
const WALL_WHEEL_SMOOTHING = {
    /** 追目标的指数时间常数（ms）：每过一个时间常数剩余位移缩到 1/e；一格 100px 约 240ms 走完 95%。 */
    timeConstantMs: 80,
    /** 剩余位移（px）小于它就直接落到目标并停下。 */
    restDistancePx: 0.5,
    /** 单帧时长上限（ms）：标签页切回来等长间隔不让相机一帧跳完。 */
    maxFrameMs: 50,
    /** deltaMode = 1（按行）时一行的像素数。 */
    lineHeightPx: 16,
    /**
     * 像素模式下单轴增量不小于它才可能是滚轮的一格。Chromium 一格约 100px（Windows / macOS 非连续滚轮）、
     * 约 53px（Linux）；触控板每个事件多是个位数到几十像素。
     */
    minNotchPx: 50,
    /** 两个滚轮事件间隔超过它（ms）算新的一次手势，重新判别。触控板（含系统惯性）事件间隔约一帧。 */
    gestureGapMs: 120,
}; __ret.WALL_WHEEL_SMOOTHING = WALL_WHEEL_SMOOTHING;

/** @typedef {'wheel' | 'trackpad'} WallWheelSource */

/**
 * 滚轮来源的判别器（每面墙一个，带一次手势的记忆）：
 * 1. deltaMode 为行 / 页：鼠标滚轮（Firefox 等按行报告的滚轮）。
 * 2. 像素模式下两轴同时有增量，或单轴增量小于 minNotchPx：触控板（滚轮的一格只沿一个轴，且步长大）。
 * 3. 同一次手势（相邻事件间隔不超过 gestureGapMs）里一旦出现过触控板式的事件，整次手势都按触控板算：
 *    触控板快速一划、系统惯性的峰值也会有单轴大增量，不能半路改成平滑。
 * 4. 其余（单轴、步长不小于 minNotchPx）：鼠标滚轮。
 * 高分辨率滚轮（无级滚轮、Windows 上每格小于 120 单位）报的是小增量，按触控板直接跟手，本身就是细分的。
 * createWallWheelClassifier — wallPanMotion.ts:52-73。The argument is any object with the four
 * fields below; a real WheelEvent satisfies it, and so does a plain literal (used by tests).
 * @returns {(event: { deltaMode: number, deltaX: number, deltaY: number, timeStamp: number }) => WallWheelSource}
 */
const createWallWheelClassifier = () => {
    let lastTime = Number.NEGATIVE_INFINITY;
    let gesture = null;
    return (event) => {
        const sameGesture = event.timeStamp - lastTime <= WALL_WHEEL_SMOOTHING.gestureGapMs;
        lastTime = event.timeStamp;
        if (!sameGesture) gesture = null;
        if (event.deltaMode !== 0) {
            gesture = 'wheel';
            return gesture;
        }
        const x = Math.abs(event.deltaX);
        const y = Math.abs(event.deltaY);
        const singleAxis = (x === 0) !== (y === 0);
        if (!singleAxis || Math.max(x, y) < WALL_WHEEL_SMOOTHING.minNotchPx || gesture === 'trackpad') {
            gesture = 'trackpad';
            return gesture;
        }
        gesture = 'wheel';
        return gesture;
    };
}; __ret.createWallWheelClassifier = createWallWheelClassifier;

/**
 * 把一次滚轮事件换成相机要走的屏幕位移（px）：按行 / 页换算；Shift + 竖向滚轮改走横向。
 * wallWheelDelta — wallPanMotion.ts:76-83
 * @param {{ deltaMode: number, deltaX: number, deltaY: number, shiftKey: boolean }} event
 * @param {number} viewportHeight
 * @returns {{ dx: number, dy: number }}
 */
const wallWheelDelta = (event, viewportHeight) => {
    const unit = event.deltaMode === 1 ? WALL_WHEEL_SMOOTHING.lineHeightPx : event.deltaMode === 2 ? viewportHeight : 1;
    const horizontalFromShift = event.shiftKey && !event.deltaX;
    return {
        dx: (horizontalFromShift ? event.deltaY : event.deltaX) * unit,
        dy: (horizontalFromShift ? 0 : event.deltaY) * unit,
    };
}; __ret.wallWheelDelta = wallWheelDelta;

/**
 * 平滑滚轮的一帧：剩余位移 pending 经过 dtMs 后这一帧该走多少（指数趋近，剩余不到 restDistancePx 时一次走完）。
 * 返回这一帧的位移与之后的剩余；剩余为 0 时动画结束。
 * stepWallWheel — wallPanMotion.ts:89-99
 * @param {{ x: number, y: number }} pending
 * @param {number} dtMs
 * @returns {{ step: { x: number, y: number }, pending: { x: number, y: number } }}
 */
const stepWallWheel = (pending, dtMs) => {
    const dt = Math.min(Math.max(dtMs, 0), WALL_WHEEL_SMOOTHING.maxFrameMs);
    const factor = 1 - Math.exp(-dt / WALL_WHEEL_SMOOTHING.timeConstantMs);
    let step = { x: pending.x * factor, y: pending.y * factor };
    const after = { x: pending.x - step.x, y: pending.y - step.y };
    if (Math.hypot(after.x, after.y) < WALL_WHEEL_SMOOTHING.restDistancePx) {
        step = { ...pending };
        return { step, pending: { x: 0, y: 0 } };
    }
    return { step, pending: after };
}; __ret.stepWallWheel = stepWallWheel;

});

// ---- core/queueDragGeometry.js -----------------------------------------
__def("core/queueDragGeometry.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/queueDragGeometry.ts (lines 1-127)
// Fidelity: verbatim-port
// Module: photowall / core

// 墙面工具队列浮岛（WallToolsQueueIsland）拖拽排序的纯几何：指针位置 → 落点下标、落点两侧的行该让开多少、
// 指针贴近上下边缘时的自动滚动速度（以及「从边缘区里开始拖时，离开那一区之后才启用那一侧」的抑制）。
// 不 import React，useQueueDragReorder 每一帧调它们，单测直接测。
// 行高是固定的（虚拟列表的每一行一样高），所以「落点」就是被拖那一行的中线落在第几个槽里：
// 其余行按 queueRowShift 让开之后，被拖的那首正好占住这个槽，它也就是 moveQueueSong 的 to（移动完成后的下标）。

/** 浮岛里一行的高度（px）。QUEUE_ISLAND_ROW_HEIGHT = 40 — queueDragGeometry.ts:9 */
const QUEUE_ISLAND_ROW_HEIGHT = 40; __ret.QUEUE_ISLAND_ROW_HEIGHT = QUEUE_ISLAND_ROW_HEIGHT;
/** 指针在手柄上按下后要移动超过这么多才算开始拖（px），免得手抖把一次点击当成拖拽。QUEUE_DRAG_THRESHOLD_PX = 4 — queueDragGeometry.ts:11 */
const QUEUE_DRAG_THRESHOLD_PX = 4; __ret.QUEUE_DRAG_THRESHOLD_PX = QUEUE_DRAG_THRESHOLD_PX;
/** 指针离列表上下边缘这么近时开始自动滚动（px）。QUEUE_AUTOSCROLL_EDGE_PX = 32 — queueDragGeometry.ts:13 */
const QUEUE_AUTOSCROLL_EDGE_PX = 32; __ret.QUEUE_AUTOSCROLL_EDGE_PX = QUEUE_AUTOSCROLL_EDGE_PX;
/** 自动滚动最快每帧这么多（px），贴到边缘或越出边缘时达到。QUEUE_AUTOSCROLL_MAX_SPEED = 14 — queueDragGeometry.ts:15 */
const QUEUE_AUTOSCROLL_MAX_SPEED = 14; __ret.QUEUE_AUTOSCROLL_MAX_SPEED = QUEUE_AUTOSCROLL_MAX_SPEED;

// clamp — queueDragGeometry.ts:17
const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

/**
 * 落点下标：被拖那一行的中线在列表内容坐标里的位置（clientY − 列表顶 + scrollTop − 抓取点偏移 + 半行高）
 * 落在第几个槽。夹在 [0, rowCount − 1]；没有行时返回 0。
 * resolveDropIndex — queueDragGeometry.ts:23-34
 * @param {{ centerY: number, rowHeight?: number, rowCount: number }} input
 * @returns {number}
 */
const resolveDropIndex = ({
    centerY,
    rowHeight = QUEUE_ISLAND_ROW_HEIGHT,
    rowCount,
}) => {
    if (rowCount <= 0 || !Number.isFinite(centerY)) return 0;
    return clamp(Math.floor(centerY / rowHeight), 0, rowCount - 1);
}; __ret.resolveDropIndex = resolveDropIndex;

/**
 * 拖拽中第 index 行该让开多少（px）：被拖的那首从 from 去 to，中间的行朝 from 的方向挪一行。
 * 往下拖（from < to）时 (from, to] 上移一行；往上拖时 [to, from) 下移一行；其余与被拖的那行本身不动。
 * 行组件按 rowProps 里的 from / to 自己算，所以拖拽中途才挂载的行（自动滚动带进视口的）也对得上。
 * queueRowShift — queueDragGeometry.ts:41-46
 * @param {number} index
 * @param {number} from
 * @param {number} to
 * @param {number} [rowHeight]
 * @returns {number}
 */
const queueRowShift = (index, from, to, rowHeight = QUEUE_ISLAND_ROW_HEIGHT) => {
    if (index === from || from === to) return 0;
    if (from < to && index > from && index <= to) return -rowHeight;
    if (to < from && index >= to && index < from) return rowHeight;
    return 0;
}; __ret.queueRowShift = queueRowShift;

/** 列表上下边缘感应区的宽度：缺省 edge，列表放不下 edge 两倍高时按一半高收窄，免得上下两区重叠。autoScrollZone — queueDragGeometry.ts:49 */
const autoScrollZone = (top, bottom, edge) => Math.min(edge, Math.max(0, (bottom - top) / 2));

/** 自动滚动的一侧：上边缘区或下边缘区。@typedef {'top' | 'bottom'} QueueAutoScrollEdge */

/**
 * 指针此刻落在哪一侧的边缘感应区里（越出列表也算那一侧），都不在时 null。
 * autoScrollEdgeAt — queueDragGeometry.ts:55-71
 * @param {{ pointerY: number, top: number, bottom: number, edge?: number }} input
 * @returns {QueueAutoScrollEdge | null}
 */
const autoScrollEdgeAt = ({
    pointerY,
    top,
    bottom,
    edge = QUEUE_AUTOSCROLL_EDGE_PX,
}) => {
    const zone = autoScrollZone(top, bottom, edge);
    if (zone <= 0) return null;
    if (pointerY < top + zone) return 'top';
    if (pointerY > bottom - zone) return 'bottom';
    return null;
}; __ret.autoScrollEdgeAt = autoScrollEdgeAt;

/**
 * 自动滚动速度（px / 帧，负数往上）：指针进入上 / 下边缘 edge 以内时按深入程度线性加速，贴边或越出时最快。
 * 列表放不下 edge 两倍高时边缘区按一半高收窄，免得上下两区重叠。
 * autoScrollVelocity — queueDragGeometry.ts:77-101
 * @param {{ pointerY: number, top: number, bottom: number, edge?: number, maxSpeed?: number }} input
 * @returns {number}
 */
const autoScrollVelocity = ({
    pointerY,
    top,
    bottom,
    edge = QUEUE_AUTOSCROLL_EDGE_PX,
    maxSpeed = QUEUE_AUTOSCROLL_MAX_SPEED,
}) => {
    const zone = autoScrollZone(top, bottom, edge);
    if (zone <= 0) return 0;
    if (pointerY < top + zone) {
        const depth = clamp((top + zone - pointerY) / zone, 0, 1);
        return -maxSpeed * depth;
    }
    if (pointerY > bottom - zone) {
        const depth = clamp((pointerY - (bottom - zone)) / zone, 0, 1);
        return maxSpeed * depth;
    }
    return 0;
}; __ret.autoScrollVelocity = autoScrollVelocity;

/**
 * 带「起点抑制」的自动滚动：拖拽是在某一侧的边缘感应区里开始的（按住最上 / 最下一行的手柄），那一侧先不滚——
 * 否则刚越过拖拽阈值列表就自己滚走；指针离开那一区之后抑制解除，再回到那一侧边缘才照常滚。另一侧不受影响。
 * suppressedEdge 是此刻被抑制的一侧（开始时取 autoScrollEdgeAt(起点)），返回这一帧的速度与更新后的抑制侧。
 * resolveAutoScroll — queueDragGeometry.ts:108-127
 * @param {{ pointerY: number, top: number, bottom: number, suppressedEdge: QueueAutoScrollEdge | null, edge?: number, maxSpeed?: number }} input
 * @returns {{ velocity: number, suppressedEdge: QueueAutoScrollEdge | null }}
 */
const resolveAutoScroll = ({
    pointerY,
    top,
    bottom,
    suppressedEdge,
    edge = QUEUE_AUTOSCROLL_EDGE_PX,
    maxSpeed = QUEUE_AUTOSCROLL_MAX_SPEED,
}) => {
    if (suppressedEdge !== null && autoScrollEdgeAt({ pointerY, top, bottom, edge }) === suppressedEdge) {
        return { velocity: 0, suppressedEdge };
    }
    return { velocity: autoScrollVelocity({ pointerY, top, bottom, edge, maxSpeed }), suppressedEdge: null };
}; __ret.resolveAutoScroll = resolveAutoScroll;

});

// ---- core/wallNavigation.js --------------------------------------------
__def("core/wallNavigation.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/wallNavigation.ts (lines 1-154)
// Fidelity: verbatim-port
// Module: photowall / core

const { SLOTS_PER_BLOCK } = __req("core/blockTemplates.js");
const { getInstanceBlock, locateInstanceAt } = __req("core/layout.js");

// Directional focus movement. The lattice has no edge, so a step always lands somewhere; the
// search runs on geometry rather than the rendered set, and freely crosses into the next cell.

/** @typedef {'up' | 'down' | 'left' | 'right'} WallDirection */

/**
 * @typedef {Object} Axis
 * @property {'x' | 'y'} along
 * @property {'y' | 'x'} cross
 * @property {'width' | 'height'} alongSize
 * @property {'height' | 'width'} crossSize
 * @property {1 | -1} sign
 */

// AXES — wallNavigation.ts:25-30
const AXES = {
    right: { along: 'x', cross: 'y', alongSize: 'width', crossSize: 'height', sign: 1 },
    left: { along: 'x', cross: 'y', alongSize: 'width', crossSize: 'height', sign: -1 },
    down: { along: 'y', cross: 'x', alongSize: 'height', crossSize: 'width', sign: 1 },
    up: { along: 'y', cross: 'x', alongSize: 'height', crossSize: 'width', sign: -1 },
};

/** Anything with a drawn rect: Lattice instances and bravais slots both qualify. @typedef {{ x: number, y: number, width: number, height: number }} WallRect */

// centerOf — wallNavigation.ts:35-37
const centerOf = (rect, axis, size) => (
    rect[axis] + rect[size] / 2
);

// Positive when the two spans truly share a band, zero when they merely touch, negative by the
// size of the gap when they miss entirely.
// crossOverlap — wallNavigation.ts:41-45
const crossOverlap = (a, b, axis) => {
    const aStart = a[axis.cross];
    const bStart = b[axis.cross];
    return Math.min(aStart + a[axis.crossSize], bStart + b[axis.crossSize]) - Math.max(aStart, bStart);
};

// Gap between the trailing edge of `from` and the leading edge of `candidate` along the travel
// axis; negative whenever the candidate is not wholly ahead, which disqualifies it.
// alongGap — wallNavigation.ts:49-53
const alongGap = (from, candidate, axis) => (
    axis.sign === 1
        ? candidate[axis.along] - (from[axis.along] + from[axis.alongSize])
        : from[axis.along] - (candidate[axis.along] + candidate[axis.alongSize])
);

/**
 * The scoring behind every directional step, over already-drawn rects. A candidate has to sit
 * wholly ahead on the travel axis; the score prefers a short step and penalises both sideways drift
 * and failing to share a band with the rect being left. On a full tie the earlier candidate wins,
 * so callers control tie order through the order they list candidates in.
 * pickAdjacentRect — wallNavigation.ts:61-91
 * @template T
 * @param {WallRect} source
 * @param {Iterable<{ value: T, rect: WallRect }>} candidates
 * @param {WallDirection} direction
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {T | null}
 */
const pickAdjacentRect = (
    source,
    candidates,
    direction,
    metrics,
) => {
    const axis = AXES[direction];
    const missPenalty = metrics.cellSize + metrics.gap;
    let best = null;
    let bestScore = Number.POSITIVE_INFINITY;
    let bestCross = Number.POSITIVE_INFINITY;

    for (const { value, rect } of candidates) {
        const step = alongGap(source, rect, axis);
        if (step < 0) continue;

        const overlap = crossOverlap(source, rect, axis);
        const score = step + (overlap > 0 ? 0 : -overlap * 2 + missPenalty);
        const crossDelta = Math.abs(
            centerOf(rect, axis.cross, axis.crossSize)
            - centerOf(source, axis.cross, axis.crossSize),
        );
        if (score < bestScore || (score === bestScore && crossDelta < bestCross)) {
            bestScore = score;
            bestCross = crossDelta;
            best = value;
        }
    }

    return best;
}; __ret.pickAdjacentRect = pickAdjacentRect;

/**
 * Picks the poster a directional key should move to, scanning the blocks around the current one.
 * A candidate has to sit wholly ahead on the travel axis; the score then prefers a short step and
 * penalises both sideways drift and failing to share a band with the poster being left, so arrows
 * walk a row instead of cutting corners.
 * findAdjacentInstance — wallNavigation.ts:99-133
 * @param {import('./layout.js').QueueInstance} from
 * @param {WallDirection} direction
 * @param {import('./layout.js').LatticeGeometry} geometry
 * @param {number} totalEntries
 * @param {import('./layout.js').WallMetrics} metrics
 * @param {Map<string, WallRect>} [rendered]  re-geared rects of the block holding an expanded card
 * @returns {import('./layout.js').QueueInstance | null}
 */
const findAdjacentInstance = (
    from,
    direction,
    geometry,
    totalEntries,
    metrics,
    rendered,
) => {
    if (totalEntries <= 0) return null;

    // Inside the block holding an expanded card every poster has been re-geared, so navigate by
    // where things are actually drawn; otherwise the ring lands somewhere the arrow did not point.
    const drawn = (instance) => {
        const override = rendered?.get(instance.instanceId);
        return override ? { ...instance, ...override } : instance;
    };

    const source = drawn(from);
    const origin = getInstanceBlock(geometry, from);

    // Row, column, slot order: the same order the scan always used, so ties resolve as before.
    // The original is a generator; collected into an array here so the scan stays plain ESM with
    // identical iteration order and identical tie-breaking.
    const candidates = [];
    for (let row = origin.row - 1; row <= origin.row + 1; row += 1) {
        for (let column = origin.column - 1; column <= origin.column + 1; column += 1) {
            for (let slotIndex = 0; slotIndex < SLOTS_PER_BLOCK; slotIndex += 1) {
                const base = locateInstanceAt(geometry, totalEntries, column, row, slotIndex, metrics);
                if (!base || base.instanceId === from.instanceId) continue;
                candidates.push({ value: base, rect: drawn(base) });
            }
        }
    }

    return pickAdjacentRect(source, candidates, direction, metrics);
}; __ret.findAdjacentInstance = findAdjacentInstance;

/**
 * Seeds keyboard focus from whatever is already on screen when nothing is focused yet.
 * findNearestInstance — wallNavigation.ts:136-154
 * @template {WallRect} T
 * @param {readonly T[]} instances
 * @param {{ x: number, y: number }} point
 * @returns {T | null}
 */
const findNearestInstance = (
    instances,
    point,
) => {
    let best = null;
    let bestDistance = Number.POSITIVE_INFINITY;

    for (const instance of instances) {
        const dx = instance.x + instance.width / 2 - point.x;
        const dy = instance.y + instance.height / 2 - point.y;
        const distance = dx * dx + dy * dy;
        if (distance < bestDistance) {
            bestDistance = distance;
            best = instance;
        }
    }

    return best;
}; __ret.findNearestInstance = findNearestInstance;

});

// ---- core/flipPlan.js --------------------------------------------------
__def("core/flipPlan.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/flipPlan.ts (lines 1-102)
// Fidelity: verbatim-port
// Module: photowall / core

const { MAX_RENDERED_INSTANCES, getPitch, overlaps } = __req("core/layout.js");

// Split-flap plan for one content change: diff what each slot shows before and after, flip only the
// slots whose content changed, stagger them outward from the transition's origin, and swap anything
// off screen (or past the tile budget) instantly. Timing lives here; animating it is the caller's.

/** One tile's full turn (out to 90 degrees, swap, back). FLIP_DURATION_MS = 360 — flipPlan.ts:11 */
const FLIP_DURATION_MS = 360; __ret.FLIP_DURATION_MS = FLIP_DURATION_MS;
/** FLIP_STAGGER_MS_PER_CELL = 18 — flipPlan.ts:12 */
const FLIP_STAGGER_MS_PER_CELL = 18; __ret.FLIP_STAGGER_MS_PER_CELL = FLIP_STAGGER_MS_PER_CELL;
/** FLIP_MAX_DELAY_MS = 420 — flipPlan.ts:13 */
const FLIP_MAX_DELAY_MS = 420; __ret.FLIP_MAX_DELAY_MS = FLIP_MAX_DELAY_MS;
/** At most this many tiles animate in one flip - the same budget as one rendered viewport. FLIP_MAX_TILES — flipPlan.ts:15 */
const FLIP_MAX_TILES = MAX_RENDERED_INSTANCES; __ret.FLIP_MAX_TILES = FLIP_MAX_TILES;

/**
 * Where the wave starts: a point (the clicked start tile, or the split for back), or both edges of
 * the split (filter results), where distance is measured horizontally from the split line.
 * @typedef {{ kind: 'point', x: number, y: number } | { kind: 'seam-edges', x: number }} FlipOrigin
 */

/**
 * Content key a slot shows before and after; null is bare wall (or a reserved slot).
 * @typedef {{ slot: import('./wallSlots.js').WallSlot, from: string | null, to: string | null }} FlipSlotChange
 */

/**
 * @typedef {Object} FlipStep
 * @property {string} key
 * @property {string | null} to
 * @property {number} delay
 * @property {-1 | 1} direction  Turn away from the origin: -1 for tiles left of it, 1 otherwise.
 */

/**
 * @typedef {Object} FlipPlan
 * @property {FlipStep[]} flips
 * @property {Array<{ key: string, to: string | null }>} swaps  Changed slots replaced without animation.
 * @property {number} unchanged
 * @property {number} durationMs  Until the last flip lands; 0 when nothing flips.
 */

// distanceFromOrigin — flipPlan.ts:45-49
const distanceFromOrigin = (slot, origin) => (
    origin.kind === 'point'
        ? Math.hypot(slot.centerX - origin.x, slot.centerY - origin.y)
        : Math.abs(slot.centerX - origin.x)
);

/**
 * getFlipDelay — flipPlan.ts:51-53. One stagger step per pitch of distance, capped at 420ms.
 * @param {number} distance
 * @param {import('./layout.js').WallMetrics} metrics
 * @returns {number}
 */
const getFlipDelay = (distance, metrics) => (
    Math.min(FLIP_MAX_DELAY_MS, (distance / getPitch(metrics)) * FLIP_STAGGER_MS_PER_CELL)
); __ret.getFlipDelay = getFlipDelay;

/**
 * Builds the flip schedule. `visible` is the world rect that may animate - the viewport plus
 * whatever overscan the caller renders. Within it the nearest changed slots flip first and the
 * budget keeps the nearest `maxTiles`; everything else that changed is swapped in place.
 * planFlip — flipPlan.ts:60-102
 * @param {{ changes: readonly FlipSlotChange[], origin: FlipOrigin, visible: import('./layout.js').Bounds, metrics: import('./layout.js').WallMetrics, maxTiles?: number }} input
 * @returns {FlipPlan}
 */
const planFlip = ({
    changes,
    origin,
    visible,
    metrics,
    maxTiles = FLIP_MAX_TILES,
}) => {
    const candidates = [];
    const swaps = [];
    let unchanged = 0;

    for (const change of changes) {
        if (change.from === change.to) {
            unchanged += 1;
            continue;
        }
        const { slot } = change;
        const slotBounds = { left: slot.x, right: slot.x + slot.width, top: slot.y, bottom: slot.y + slot.height };
        if (overlaps(slotBounds, visible)) candidates.push({ change, distance: distanceFromOrigin(slot, origin) });
        else swaps.push({ key: slot.key, to: change.to });
    }

    candidates.sort((first, second) => first.distance - second.distance);
    const flips = [];
    let maxDelay = 0;
    candidates.forEach(({ change, distance }, index) => {
        if (index >= maxTiles) {
            swaps.push({ key: change.slot.key, to: change.to });
            return;
        }
        const delay = getFlipDelay(distance, metrics);
        maxDelay = Math.max(maxDelay, delay);
        flips.push({ key: change.slot.key, to: change.to, delay, direction: change.slot.centerX < origin.x ? -1 : 1 });
    });

    return { flips, swaps, unchanged, durationMs: flips.length ? maxDelay + FLIP_DURATION_MS : 0 };
}; __ret.planFlip = planFlip;

});

// ---- core/revealRect.js ------------------------------------------------
__def("core/revealRect.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/revealRect.ts (lines 1-69)
// Fidelity: verbatim-port
// Module: photowall / core

const { SEAM_EDGE_MARGIN, getSeamSplitOffsets } = __req("core/seamPlan.js");
const { getViewLineX } = __req("core/wallView.js");

// Smallest camera move that brings a world rect fully on screen, while keeping an open split on
// screen when both fit (the prototype's `revealRect`). The split rides with the world, so a move
// that pushed it off an edge would also squeeze it shut; between "rect visible" and "split stays",
// the rect wins. Vertically the rect clears `bottomInset` - the player bar's safe area.

/** @typedef {{ x: number, y: number, width: number, height: number }} RevealRect */

/**
 * @typedef {Object} RevealInput
 * @property {RevealRect} rect
 * @property {import('./wallView.js').WallViewCenter} center  Current view centre (world point under the split's base line).
 * @property {import('./wallView.js').WallView} view
 * @property {import('./layout.js').WallMetrics} metrics
 * @property {number | null} anchorX  World x of the split; null when the layer has none.
 * @property {number} seamWidth       Opening the split is drawn at right now, in screen px (0 when shut).
 * @property {number} [pad]           Screen-px margin kept around the rect.
 * @property {number} [bottomInset]   Screen px the rect's bottom edge must stay above (player bar safe area); defaults to pad.
 */

// clamp — revealRect.ts:30
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/**
 * View centre after the minimal move; equal to `center` when the rect already shows.
 * resolveRevealCenter — revealRect.ts:33-69
 * @param {RevealInput} input
 * @returns {import('./wallView.js').WallViewCenter}
 */
const resolveRevealCenter = ({
    rect,
    center,
    view,
    metrics,
    anchorX,
    seamWidth,
    pad = 24,
    bottomInset = pad,
}) => {
    const lineX = getViewLineX(view);
    const scale = view.scale;
    const hasSeam = anchorX !== null && seamWidth > 1;
    // The half the rect sits in is pushed away from the split; screen x = line + offset + (x - cx) * s.
    const offsets = hasSeam ? getSeamSplitOffsets(seamWidth, scale, metrics) : { left: 0, right: 0 };
    const rectCenterX = rect.x + rect.width / 2;
    const offset = anchorX !== null && rectCenterX < anchorX ? offsets.left : offsets.right;

    const fitLow = rect.x + rect.width - (view.width - pad - lineX - offset) / scale;
    const fitHigh = rect.x - (pad - lineX - offset) / scale;
    let x;
    if (hasSeam) {
        const need = seamWidth / 2 + SEAM_EDGE_MARGIN;
        const seamLow = anchorX - (view.width - need - lineX) / scale;
        const seamHigh = anchorX + (lineX - need) / scale;
        const low = Math.max(fitLow, seamLow);
        const high = Math.min(fitHigh, seamHigh);
        x = low <= high ? clamp(center.x, low, high) : clamp(center.x, Math.min(fitLow, fitHigh), Math.max(fitLow, fitHigh));
    } else {
        x = clamp(center.x, Math.min(fitLow, fitHigh), Math.max(fitLow, fitHigh));
    }

    const yLow = rect.y + rect.height - (view.height / 2 - bottomInset) / scale;
    const yHigh = rect.y - (pad - view.height / 2) / scale;
    const y = yLow <= yHigh ? clamp(center.y, yLow, yHigh) : rect.y + rect.height / 2;
    return { x, y };
}; __ret.resolveRevealCenter = resolveRevealCenter;

});

// ---- core/wallHandoff.js -----------------------------------------------
__def("core/wallHandoff.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/wallHandoff.ts (lines 1-117)
// Fidelity: verbatim-port
// Module: photowall / core

const { FLIP_MAX_DELAY_MS, FLIP_STAGGER_MS_PER_CELL } = __req("core/flipPlan.js");
const { getPitch } = __req("core/layout.js");

// 两面墙的「翻牌交接」（资料库墙 bravais ↔ Lattice，设计稿 §7「进入队列」）的时间表与对齐几何，纯计算、两边共用。
// 交接期间两面墙同时挂着、叠在同一个视口里：每个视口位置上先是离开的那面墙翻出半圈（0 → 90°），再是进来的那面墙
// 翻进半圈（−90° → 0），像同一面墙换了内容。两面墙的格子不一定对齐（各自的相机），所以错开按「到起点的屏幕距离」算，
// 而不是按 slot：同一个屏幕位置在两面墙上拿到同一个延迟，翻出与翻进首尾相接。
// 半圈的时长与缓动与 bravais 磁贴的翻牌相同（bravaisConstants 的 150 / 210ms），错开沿用 flipPlan（18ms/格，上限 420ms）。

/** 离开的那面墙翻出半圈（0 → 90°）。WALL_HANDOFF_FLIP_OUT_MS = 150 — wallHandoff.ts:12 */
const WALL_HANDOFF_FLIP_OUT_MS = 150; __ret.WALL_HANDOFF_FLIP_OUT_MS = WALL_HANDOFF_FLIP_OUT_MS;
/** 进来的那面墙翻进半圈（−90° → 0）。WALL_HANDOFF_FLIP_IN_MS = 210 — wallHandoff.ts:14 */
const WALL_HANDOFF_FLIP_IN_MS = 210; __ret.WALL_HANDOFF_FLIP_IN_MS = WALL_HANDOFF_FLIP_IN_MS;
/** WALL_HANDOFF_STAGGER_MS_PER_CELL = FLIP_STAGGER_MS_PER_CELL (18) — wallHandoff.ts:15 */
const WALL_HANDOFF_STAGGER_MS_PER_CELL = FLIP_STAGGER_MS_PER_CELL; __ret.WALL_HANDOFF_STAGGER_MS_PER_CELL = WALL_HANDOFF_STAGGER_MS_PER_CELL;
/** WALL_HANDOFF_MAX_DELAY_MS = FLIP_MAX_DELAY_MS (420) — wallHandoff.ts:16 */
const WALL_HANDOFF_MAX_DELAY_MS = FLIP_MAX_DELAY_MS; __ret.WALL_HANDOFF_MAX_DELAY_MS = WALL_HANDOFF_MAX_DELAY_MS;
/** 一整波：最远的位置开始翻出，到它翻进落定。WALL_HANDOFF_WAVE_MS = 780 — wallHandoff.ts:18 */
const WALL_HANDOFF_WAVE_MS = WALL_HANDOFF_MAX_DELAY_MS + WALL_HANDOFF_FLIP_OUT_MS + WALL_HANDOFF_FLIP_IN_MS; __ret.WALL_HANDOFF_WAVE_MS = WALL_HANDOFF_WAVE_MS;
/** 降低动态效果：整面短淡入淡出交叉，不翻牌。WALL_HANDOFF_FADE_MS = 180 — wallHandoff.ts:20 */
const WALL_HANDOFF_FADE_MS = 180; __ret.WALL_HANDOFF_FADE_MS = WALL_HANDOFF_FADE_MS;
/** 回到资料库墙时翻完之后，缝张开、窗打开的那一段。WALL_HANDOFF_OPEN_MS = 400 — wallHandoff.ts:22 */
const WALL_HANDOFF_OPEN_MS = 400; __ret.WALL_HANDOFF_OPEN_MS = WALL_HANDOFF_OPEN_MS;
/** 进 Lattice：等两边都准备好最多这么久，到点照样开翻。WALL_HANDOFF_CLOSE_TIMEOUT_MS = 1200 — wallHandoff.ts:24 */
const WALL_HANDOFF_CLOSE_TIMEOUT_MS = 1200; __ret.WALL_HANDOFF_CLOSE_TIMEOUT_MS = WALL_HANDOFF_CLOSE_TIMEOUT_MS;
/** 回资料库墙：等它挂上并画好最多这么久，到点放弃交接。WALL_HANDOFF_WAIT_TIMEOUT_MS = 1600 — wallHandoff.ts:26 */
const WALL_HANDOFF_WAIT_TIMEOUT_MS = 1600; __ret.WALL_HANDOFF_WAIT_TIMEOUT_MS = WALL_HANDOFF_WAIT_TIMEOUT_MS;
/** 半圈翻牌的透视（与 bravais 磁贴的 rotation() 相同）。WALL_HANDOFF_PERSPECTIVE_PX = 1400 — wallHandoff.ts:28 */
const WALL_HANDOFF_PERSPECTIVE_PX = 1400; __ret.WALL_HANDOFF_PERSPECTIVE_PX = WALL_HANDOFF_PERSPECTIVE_PX;
/** @typedef {readonly [number, number, number, number]} WallHandoffEase */
/** 翻出 / 翻进的缓动（与 BravaisTile 的翻牌相同）。WALL_HANDOFF_OUT_EASE — wallHandoff.ts:31 */
const WALL_HANDOFF_OUT_EASE = [0.55, 0, 0.9, 0.45]; __ret.WALL_HANDOFF_OUT_EASE = WALL_HANDOFF_OUT_EASE;
/** WALL_HANDOFF_IN_EASE — wallHandoff.ts:32 */
const WALL_HANDOFF_IN_EASE = [0.2, 0.7, 0.25, 1]; __ret.WALL_HANDOFF_IN_EASE = WALL_HANDOFF_IN_EASE;

/**
 * cubicBezierCss — wallHandoff.ts:34-36
 * @param {WallHandoffEase} ease
 * @returns {string}
 */
const cubicBezierCss = (ease) => (
    `cubic-bezier(${ease.join(',')})`
); __ret.cubicBezierCss = cubicBezierCss;

/** @typedef {{ x: number, y: number }} WallHandoffPoint */
/** @typedef {{ x: number, y: number, width: number, height: number }} WallHandoffRect */

/**
 * 格距在屏幕上的长度（世界单位的格距 × 相机缩放）：错开按「隔了几格」算。
 * getWallHandoffPitchPx — wallHandoff.ts:42
 * @param {import('./layout.js').WallMetrics} metrics
 * @param {number} scale
 * @returns {number}
 */
const getWallHandoffPitchPx = (metrics, scale) => getPitch(metrics) * scale; __ret.getWallHandoffPitchPx = getWallHandoffPitchPx;

/**
 * 某个屏幕位置（客户区坐标）从开翻起要等多久才翻出（毫秒）。翻进 = 这个值 + 翻出半圈。
 * getWallHandoffDelay — wallHandoff.ts:45-48
 * @param {WallHandoffPoint} point
 * @param {WallHandoffPoint} origin
 * @param {number} pitchPx
 * @returns {number}
 */
const getWallHandoffDelay = (point, origin, pitchPx) => {
    const distance = Math.hypot(point.x - origin.x, point.y - origin.y);
    return Math.min(WALL_HANDOFF_MAX_DELAY_MS, (distance / Math.max(pitchPx, 1)) * WALL_HANDOFF_STAGGER_MS_PER_CELL);
}; __ret.getWallHandoffDelay = getWallHandoffDelay;

/**
 * 往哪边转：起点左边的往左翻（−1），其余往右（与 flipPlan 的 direction 相同）。
 * getWallHandoffDirection — wallHandoff.ts:51-53
 * @param {WallHandoffPoint} point
 * @param {WallHandoffPoint} origin
 * @returns {-1 | 1}
 */
const getWallHandoffDirection = (point, origin) => (
    point.x < origin.x ? -1 : 1
); __ret.getWallHandoffDirection = getWallHandoffDirection;

/**
 * rectCenter — wallHandoff.ts:55-58
 * @param {WallHandoffRect} rect
 * @returns {WallHandoffPoint}
 */
const rectCenter = (rect) => ({
    x: rect.x + rect.width / 2,
    y: rect.y + rect.height / 2,
}); __ret.rectCenter = rectCenter;

/**
 * 一个位置的排期：翻出在 outAt 开始，翻进在 inAt 开始（都相对开翻时刻，毫秒）。
 * getWallHandoffSpot — wallHandoff.ts:61-65
 * @param {WallHandoffRect} rect
 * @param {WallHandoffPoint} origin
 * @param {number} pitchPx
 * @returns {{ outAt: number, inAt: number, direction: -1 | 1 }}
 */
const getWallHandoffSpot = (rect, origin, pitchPx) => {
    const center = rectCenter(rect);
    const outAt = getWallHandoffDelay(center, origin, pitchPx);
    return { outAt, inAt: outAt + WALL_HANDOFF_FLIP_OUT_MS, direction: getWallHandoffDirection(center, origin) };
}; __ret.getWallHandoffSpot = getWallHandoffSpot;

/**
 * 两个矩形在客户区里相交（只翻视口里看得见的那些）。
 * rectsIntersect — wallHandoff.ts:68-70
 * @param {WallHandoffRect} a
 * @param {WallHandoffRect} b
 * @returns {boolean}
 */
const rectsIntersect = (a, b) => (
    a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y
); __ret.rectsIntersect = rectsIntersect;

/**
 * 把 `from` 挪到与 `to` 同一套间距为 `pitch` 的网格线上要挪多少：结果在 [−pitch/2, pitch/2) 里，取最小的那一步。
 * alignToPitch — wallHandoff.ts:76-82
 * @param {number} from
 * @param {number} to
 * @param {number} pitch
 * @returns {number}
 */
const alignToPitch = (from, to, pitch) => {
    if (!(pitch > 0)) return 0;
    let delta = (to - from) % pitch;
    if (delta >= pitch / 2) delta -= pitch;
    if (delta < -pitch / 2) delta += pitch;
    return delta;
}; __ret.alignToPitch = alignToPitch;

/**
 * 两面墙的相机对齐：两边都有展开的聚焦卡时让两张卡重合，否则只对齐格线（挪动不超过半个格距）。
 * resolveWallHandoffAlignment — wallHandoff.ts:88-108
 * @param {{ homeCard: WallHandoffRect | null, latticeCard: WallHandoffRect | null, homeGridPoint: WallHandoffPoint, latticeGridPoint: WallHandoffPoint, pitchPx: number }} input
 * @returns {WallHandoffPoint}
 */
const resolveWallHandoffAlignment = ({
    homeCard,
    latticeCard,
    homeGridPoint,
    latticeGridPoint,
    pitchPx,
}) => {
    if (homeCard && latticeCard) {
        return { x: homeCard.x - latticeCard.x, y: homeCard.y - latticeCard.y };
    }
    return {
        x: alignToPitch(latticeGridPoint.x, homeGridPoint.x, pitchPx),
        y: alignToPitch(latticeGridPoint.y, homeGridPoint.y, pitchPx),
    };
}; __ret.resolveWallHandoffAlignment = resolveWallHandoffAlignment;

/** 交接各段的时长（director 交给 store）。WALL_HANDOFF_TIMING — wallHandoff.ts:111-117 */
const WALL_HANDOFF_TIMING = {
    waveMs: WALL_HANDOFF_WAVE_MS,
    fadeMs: WALL_HANDOFF_FADE_MS,
    openMs: WALL_HANDOFF_OPEN_MS,
    closeTimeoutMs: WALL_HANDOFF_CLOSE_TIMEOUT_MS,
    waitTimeoutMs: WALL_HANDOFF_WAIT_TIMEOUT_MS,
}; __ret.WALL_HANDOFF_TIMING = WALL_HANDOFF_TIMING;

});

// ---- core/buildWallLayout.js -------------------------------------------
__def("core/buildWallLayout.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/layout.ts (lines 1-77), finiteWall.ts, rankSlots.ts, wallSlots.ts
// Fidelity: adapted-port
// Module: photowall / core

const { getPitch } = __req("core/layout.js");
const { getFiniteWallBlocks, getRankedContentBounds } = __req("core/finiteWall.js");
const { indexRanks, rankSlots } = __req("core/rankSlots.js");
const { collectBlockRangeSlots } = __req("core/wallSlots.js");

// Plan the finite wall from a list of items. This is authored glue around the ported planning code
// (`finiteWall.ts` + `rankSlots.ts` + `wallSlots.ts` + `layout.ts`): the originals plan the wall
// from the layer's own state, so the standalone version derives the same inputs from `options` and
// keeps the resulting card order and geometry identical.
//
// The world is centred on the viewport: the rank origin is world (0, 0) and the caller's camera
// starts at the view centre (0, 0) — `getFiniteWallBlocks` then grows the world until it covers the
// whole viewport, exactly as it does for a live layer whose camera sits at the seam.

/** @typedef {{ id: string, title: string, subtitle?: string, coverUrl?: string, badge?: string }} WallItem */

/**
 * @typedef {Object} WallCard
 * @property {string} key        stable slot identity, wallSlotKey(column,row,slotIndex) (wallSlots.ts:35)
 * @property {number} instanceId
 * @property {number} itemIndex  index into options.items
 * @property {number} x          world px, top-left
 * @property {number} y
 * @property {number} width      world px
 * @property {number} height
 * @property {WallItem} item
 */

/**
 * @typedef {Object} WallLayout
 * @property {WallCard[]} cards
 * @property {{minX:number,minY:number,maxX:number,maxY:number}} bounds  world space
 * @property {import('./layout.js').WallMetrics} metrics
 * @property {number} pitch        getPitch(metrics) (layout.ts:81)
 * @property {import('./wallSlots.js').WallSlot[]} order  ranked slot order:
 *           rankSlots (rankSlots.ts:61) gives the order, indexRanks (rankSlots.ts:73) the lookup
 * @property {Map<string, number>} rankOfSlot
 */

/**
 * buildWallLayout — authored wrapper over the ported plan (see the module comment).
 * @param {Object} options
 * @param {WallItem[]} options.items               [{ id, title, subtitle?, coverUrl?, badge? }]
 * @param {{ width: number, height: number }} options.viewport
 * @param {{ cellSize: number, gap: number }} options.metrics
 * @param {number} [options.reservedPerBlock]      0..6 — MIN_RESERVED_PER_BLOCK (blockReservedSlots.ts:10) / MAX_RESERVED_PER_BLOCK (blockReservedSlots.ts:11)
 * @param {number} [options.maxInstances]          default MAX_RENDERED_INSTANCES = 400 (layout.ts:79)
 * @param {{ x: number, y: number }} [options.origin]  rank origin; defaults to world (0, 0)
 * @param {string | null} [options.startSlotKey]   pinned to rank 0 (rankSlots.ts:67-68)
 * @returns {WallLayout}
 */
const buildWallLayout = ({
    items,
    viewport,
    metrics,
    reservedPerBlock = 0,
    maxInstances = 400,
    origin = { x: 0, y: 0 },
    startSlotKey = null,
}) => {
    const itemCount = items.length;
    const view = { width: viewport.width, height: viewport.height, scale: 1 };
    const world = getFiniteWallBlocks({
        itemCount,
        reservedPerBlock,
        metrics,
        view,
        origin,
        startSlotKey,
        viewCenter: origin,
    });

    const slots = collectBlockRangeSlots(world.columns, world.rows, metrics);
    const order = rankSlots(slots, { origin, metrics, reservedPerBlock, startSlotKey });
    const rankOfSlot = indexRanks(order);

    // `maxInstances` is the card budget, the same role MAX_RENDERED_INSTANCES plays for a rendered
    // viewport: a very large wall plans more slots than any one screen can draw.
    const limit = Math.min(order.length, Math.max(0, maxInstances));
    const cards = [];
    for (let rank = 0; rank < limit; rank += 1) {
        const slot = order[rank];
        const itemIndex = itemCount > 0 ? rank % itemCount : -1;
        if (itemIndex < 0) break;
        cards.push({
            key: slot.key,
            instanceId: rank,
            itemIndex,
            x: slot.x,
            y: slot.y,
            width: slot.width,
            height: slot.height,
            item: items[itemIndex],
        });
    }

    const content = getRankedContentBounds(order, cards.length) ?? {
        left: world.bounds.left,
        right: world.bounds.right,
        top: world.bounds.top,
        bottom: world.bounds.bottom,
    };

    return {
        cards,
        bounds: { minX: content.left, minY: content.top, maxX: content.right, maxY: content.bottom },
        metrics,
        pitch: getPitch(metrics),
        order,
        rankOfSlot,
        world,
    };
}; __ret.buildWallLayout = buildWallLayout;

});

// ---- core/index.js -----------------------------------------------------
__def("core/index.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/* (barrel for the extracted core modules)
// Fidelity: authored-glue
// Module: photowall / core

// Barrel for every core module. `buildWallLayout` is the entry point the frozen public API names;
// the rest are the ported planners and constants, re-exported so a consumer can drive the wall
// without reaching into individual files.

const __ns$core_blockTemplates_js = __req("core/blockTemplates.js"); __ret["BLOCK_COLS"] = __ns$core_blockTemplates_js.BLOCK_COLS; __ret["BLOCK_ROWS"] = __ns$core_blockTemplates_js.BLOCK_ROWS; __ret["SLOTS_PER_BLOCK"] = __ns$core_blockTemplates_js.SLOTS_PER_BLOCK; __ret["EXPANSION_SPAN"] = __ns$core_blockTemplates_js.EXPANSION_SPAN; __ret["BLOCK_ORIENTATION_COUNT"] = __ns$core_blockTemplates_js.BLOCK_ORIENTATION_COUNT; __ret["getBlockTemplate"] = __ns$core_blockTemplates_js.getBlockTemplate; __ret["getBlockReflow"] = __ns$core_blockTemplates_js.getBlockReflow;;
const __ns$core_blockReflows_js = __req("core/blockReflows.js"); __ret["BLOCK_REFLOWS"] = __ns$core_blockReflows_js.BLOCK_REFLOWS;;
const __ns$core_blockReservedSlots_js = __req("core/blockReservedSlots.js"); __ret["MIN_RESERVED_PER_BLOCK"] = __ns$core_blockReservedSlots_js.MIN_RESERVED_PER_BLOCK; __ret["MAX_RESERVED_PER_BLOCK"] = __ns$core_blockReservedSlots_js.MAX_RESERVED_PER_BLOCK; __ret["clampReservedPerBlock"] = __ns$core_blockReservedSlots_js.clampReservedPerBlock; __ret["getBlockSlotShuffle"] = __ns$core_blockReservedSlots_js.getBlockSlotShuffle; __ret["blockReservedSlots"] = __ns$core_blockReservedSlots_js.blockReservedSlots; __ret["getBlockReservedMask"] = __ns$core_blockReservedSlots_js.getBlockReservedMask; __ret["isReservedSlot"] = __ns$core_blockReservedSlots_js.isReservedSlot; __ret["getBlockCapacity"] = __ns$core_blockReservedSlots_js.getBlockCapacity;;
const __ns$core_wallSlots_js = __req("core/wallSlots.js"); __ret["wallSlotKey"] = __ns$core_wallSlots_js.wallSlotKey; __ret["getBlockSize"] = __ns$core_wallSlots_js.getBlockSize; __ret["getBlockSlots"] = __ns$core_wallSlots_js.getBlockSlots; __ret["getWallSlot"] = __ns$core_wallSlots_js.getWallSlot; __ret["parseWallSlotKey"] = __ns$core_wallSlots_js.parseWallSlotKey; __ret["collectBlockRangeSlots"] = __ns$core_wallSlots_js.collectBlockRangeSlots; __ret["collectWallSlots"] = __ns$core_wallSlots_js.collectWallSlots; __ret["layoutFocusedBlock"] = __ns$core_wallSlots_js.layoutFocusedBlock;;
const __ns$core_layout_js = __req("core/layout.js"); __ret["overlaps"] = __ns$core_layout_js.overlaps; __ret["toBounds"] = __ns$core_layout_js.toBounds; __ret["MAX_RENDERED_INSTANCES"] = __ns$core_layout_js.MAX_RENDERED_INSTANCES; __ret["getPitch"] = __ns$core_layout_js.getPitch; __ret["getLatticeGeometry"] = __ns$core_layout_js.getLatticeGeometry; __ret["getInstanceBlock"] = __ns$core_layout_js.getInstanceBlock; __ret["locateInstanceAt"] = __ns$core_layout_js.locateInstanceAt; __ret["locateNearestInstance"] = __ns$core_layout_js.locateNearestInstance; __ret["layoutLattice"] = __ns$core_layout_js.layoutLattice; __ret["layoutExpandedBlock"] = __ns$core_layout_js.layoutExpandedBlock;;
const __ns$core_rankSlots_js = __req("core/rankSlots.js"); __ret["RANK_VERTICAL_WEIGHT"] = __ns$core_rankSlots_js.RANK_VERTICAL_WEIGHT; __ret["RANK_AREA_WEIGHT"] = __ns$core_rankSlots_js.RANK_AREA_WEIGHT; __ret["scoreWallSlot"] = __ns$core_rankSlots_js.scoreWallSlot; __ret["withoutReservedSlots"] = __ns$core_rankSlots_js.withoutReservedSlots; __ret["rankSlots"] = __ns$core_rankSlots_js.rankSlots; __ret["indexRanks"] = __ns$core_rankSlots_js.indexRanks;;
const __ns$core_startTile_js = __req("core/startTile.js"); __ret["getWrapPeriod"] = __ns$core_startTile_js.getWrapPeriod; __ret["getWrapIndex"] = __ns$core_startTile_js.getWrapIndex; __ret["getStartWrapOffset"] = __ns$core_startTile_js.getStartWrapOffset; __ret["getInfiniteSlotItem"] = __ns$core_startTile_js.getInfiniteSlotItem;;
const __ns$core_finiteWall_js = __req("core/finiteWall.js"); __ret["getFiniteWallBlocks"] = __ns$core_finiteWall_js.getFiniteWallBlocks; __ret["planFiniteWall"] = __ns$core_finiteWall_js.planFiniteWall; __ret["getRankedContentBounds"] = __ns$core_finiteWall_js.getRankedContentBounds; __ret["FINITE_CAMERA_PAD"] = __ns$core_finiteWall_js.FINITE_CAMERA_PAD; __ret["getFiniteCameraRange"] = __ns$core_finiteWall_js.getFiniteCameraRange; __ret["clampToCameraRange"] = __ns$core_finiteWall_js.clampToCameraRange; __ret["stepCameraAxis"] = __ns$core_finiteWall_js.stepCameraAxis;;
const __ns$core_wallView_js = __req("core/wallView.js"); __ret["getViewLineX"] = __ns$core_wallView_js.getViewLineX; __ret["formatWorldTransform"] = __ns$core_wallView_js.formatWorldTransform; __ret["viewCenterFromCamera"] = __ns$core_wallView_js.viewCenterFromCamera; __ret["cameraFromViewCenter"] = __ns$core_wallView_js.cameraFromViewCenter; __ret["getViewWorldBounds"] = __ns$core_wallView_js.getViewWorldBounds;;
const __ns$core_panMotion_js = __req("core/panMotion.js"); __ret["WALL_PAN_INERTIA"] = __ns$core_panMotion_js.WALL_PAN_INERTIA; __ret["WALL_WHEEL_SMOOTHING"] = __ns$core_panMotion_js.WALL_WHEEL_SMOOTHING; __ret["createWallWheelClassifier"] = __ns$core_panMotion_js.createWallWheelClassifier; __ret["wallWheelDelta"] = __ns$core_panMotion_js.wallWheelDelta; __ret["stepWallWheel"] = __ns$core_panMotion_js.stepWallWheel;;
const __ns$core_queueDragGeometry_js = __req("core/queueDragGeometry.js"); __ret["QUEUE_ISLAND_ROW_HEIGHT"] = __ns$core_queueDragGeometry_js.QUEUE_ISLAND_ROW_HEIGHT; __ret["QUEUE_DRAG_THRESHOLD_PX"] = __ns$core_queueDragGeometry_js.QUEUE_DRAG_THRESHOLD_PX; __ret["QUEUE_AUTOSCROLL_EDGE_PX"] = __ns$core_queueDragGeometry_js.QUEUE_AUTOSCROLL_EDGE_PX; __ret["QUEUE_AUTOSCROLL_MAX_SPEED"] = __ns$core_queueDragGeometry_js.QUEUE_AUTOSCROLL_MAX_SPEED; __ret["resolveDropIndex"] = __ns$core_queueDragGeometry_js.resolveDropIndex; __ret["queueRowShift"] = __ns$core_queueDragGeometry_js.queueRowShift; __ret["autoScrollEdgeAt"] = __ns$core_queueDragGeometry_js.autoScrollEdgeAt; __ret["autoScrollVelocity"] = __ns$core_queueDragGeometry_js.autoScrollVelocity; __ret["resolveAutoScroll"] = __ns$core_queueDragGeometry_js.resolveAutoScroll;;
const __ns$core_wallNavigation_js = __req("core/wallNavigation.js"); __ret["pickAdjacentRect"] = __ns$core_wallNavigation_js.pickAdjacentRect; __ret["findAdjacentInstance"] = __ns$core_wallNavigation_js.findAdjacentInstance; __ret["findNearestInstance"] = __ns$core_wallNavigation_js.findNearestInstance;;
const __ns$core_seamPlan_js = __req("core/seamPlan.js"); __ret["SEAM_EDGE_MARGIN"] = __ns$core_seamPlan_js.SEAM_EDGE_MARGIN; __ret["SEAM_LINE_DISTANCE_WEIGHT"] = __ns$core_seamPlan_js.SEAM_LINE_DISTANCE_WEIGHT; __ret["getSeamBoundaryX"] = __ns$core_seamPlan_js.getSeamBoundaryX; __ret["nearestSeamBoundaryX"] = __ns$core_seamPlan_js.nearestSeamBoundaryX; __ret["isSeamBoundaryX"] = __ns$core_seamPlan_js.isSeamBoundaryX; __ret["blockSeamPlan"] = __ns$core_seamPlan_js.blockSeamPlan; __ret["getSeamGeometry"] = __ns$core_seamPlan_js.getSeamGeometry; __ret["getSeamCameraSpan"] = __ns$core_seamPlan_js.getSeamCameraSpan; __ret["getSeamSplitOffsets"] = __ns$core_seamPlan_js.getSeamSplitOffsets;;
const __ns$core_flipPlan_js = __req("core/flipPlan.js"); __ret["FLIP_DURATION_MS"] = __ns$core_flipPlan_js.FLIP_DURATION_MS; __ret["FLIP_STAGGER_MS_PER_CELL"] = __ns$core_flipPlan_js.FLIP_STAGGER_MS_PER_CELL; __ret["FLIP_MAX_DELAY_MS"] = __ns$core_flipPlan_js.FLIP_MAX_DELAY_MS; __ret["FLIP_MAX_TILES"] = __ns$core_flipPlan_js.FLIP_MAX_TILES; __ret["getFlipDelay"] = __ns$core_flipPlan_js.getFlipDelay; __ret["planFlip"] = __ns$core_flipPlan_js.planFlip;;
const __ns$core_revealRect_js = __req("core/revealRect.js"); __ret["resolveRevealCenter"] = __ns$core_revealRect_js.resolveRevealCenter;;
const __ns$core_wallHandoff_js = __req("core/wallHandoff.js"); __ret["WALL_HANDOFF_FLIP_OUT_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_FLIP_OUT_MS; __ret["WALL_HANDOFF_FLIP_IN_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_FLIP_IN_MS; __ret["WALL_HANDOFF_STAGGER_MS_PER_CELL"] = __ns$core_wallHandoff_js.WALL_HANDOFF_STAGGER_MS_PER_CELL; __ret["WALL_HANDOFF_MAX_DELAY_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_MAX_DELAY_MS; __ret["WALL_HANDOFF_WAVE_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_WAVE_MS; __ret["WALL_HANDOFF_FADE_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_FADE_MS; __ret["WALL_HANDOFF_OPEN_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_OPEN_MS; __ret["WALL_HANDOFF_CLOSE_TIMEOUT_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_CLOSE_TIMEOUT_MS; __ret["WALL_HANDOFF_WAIT_TIMEOUT_MS"] = __ns$core_wallHandoff_js.WALL_HANDOFF_WAIT_TIMEOUT_MS; __ret["WALL_HANDOFF_PERSPECTIVE_PX"] = __ns$core_wallHandoff_js.WALL_HANDOFF_PERSPECTIVE_PX; __ret["WALL_HANDOFF_OUT_EASE"] = __ns$core_wallHandoff_js.WALL_HANDOFF_OUT_EASE; __ret["WALL_HANDOFF_IN_EASE"] = __ns$core_wallHandoff_js.WALL_HANDOFF_IN_EASE; __ret["WALL_HANDOFF_TIMING"] = __ns$core_wallHandoff_js.WALL_HANDOFF_TIMING; __ret["cubicBezierCss"] = __ns$core_wallHandoff_js.cubicBezierCss; __ret["getWallHandoffPitchPx"] = __ns$core_wallHandoff_js.getWallHandoffPitchPx; __ret["getWallHandoffDelay"] = __ns$core_wallHandoff_js.getWallHandoffDelay; __ret["getWallHandoffDirection"] = __ns$core_wallHandoff_js.getWallHandoffDirection; __ret["rectCenter"] = __ns$core_wallHandoff_js.rectCenter; __ret["getWallHandoffSpot"] = __ns$core_wallHandoff_js.getWallHandoffSpot; __ret["rectsIntersect"] = __ns$core_wallHandoff_js.rectsIntersect; __ret["alignToPitch"] = __ns$core_wallHandoff_js.alignToPitch; __ret["resolveWallHandoffAlignment"] = __ns$core_wallHandoff_js.resolveWallHandoffAlignment;;
const __ns$core_buildWallLayout_js = __req("core/buildWallLayout.js"); __ret["buildWallLayout"] = __ns$core_buildWallLayout_js.buildWallLayout;;

});

// ---- dom/camera.js -----------------------------------------------------
__def("dom/camera.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/finiteWall.ts, src/components/wall/wallPanMotion.ts, src/components/wall/wallView.ts (constants and formulas)
// Fidelity: adapted-port
// Module: photowall / dom

const { FINITE_CAMERA_PAD, WALL_PAN_INERTIA, WALL_WHEEL_SMOOTHING, clampToCameraRange, createWallWheelClassifier, getFiniteCameraRange, stepCameraAxis, stepWallWheel, wallWheelDelta } = __req("core/index.js");

// Animated camera around the ported core. The core owns the maths (range, rubber band, inertia
// parameters, wheel classification and smoothing); this file owns the clock, the pointer/wheel
// plumbing and the change notification, i.e. everything React and framer-motion used to provide in
// `src/components/wall/useWallCameraPan.ts` / `src/components/wall/useWallPointerPan.ts`.
//
// State model is the original DOM camera's: `x`/`y` is the *view centre in world px* (the point that
// must land under the view line, `getViewLineX`), `scale` is px per world unit. The pan delta is
// applied as `viewCentre -= screenDelta / scale`, exactly like `wallPanMotion`'s callers did after
// converting a pointer delta. `bounds` is the world `{minX,minY,maxX,maxY}` from `buildWallLayout`.

/** Reduced motion: stop inertia and wheel smoothing, move in whole steps (`WALL_PAN_INERTIA`, `src/components/wall/wallPanMotion.ts:9`). */
const prefersReducedMotion = () => (
    typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
); __ret.prefersReducedMotion = prefersReducedMotion;

/**
 * createCamera — adapted-port of the camera behaviour around the ported core helpers.
 * @param {Object} options
 * @param {{minX:number,minY:number,maxX:number,maxY:number}} options.bounds
 * @param {{width:number,height:number}} options.viewport
 * @param {{x:number,y:number,scale:number}} [options.initial]
 * @param {number} [options.minScale]
 * @param {number} [options.maxScale]
 * @param {number} [options.anchorX]      world x of the seam; the camera range is widened around it (src/components/wall/finiteWall.ts:147)
 * @param {number} [options.seamWidth]    target opening in screen px (src/components/wall/finiteWall.ts:121)
 * @param {number} [options.pad]          FINITE_CAMERA_PAD = 60 (src/components/wall/finiteWall.ts:110)
 * @param {number} [options.lineX]        screen x of the base line; defaults to viewport.width / 2 (src/components/wall/wallView.ts:22)
 * @returns {Object} WallCamera
 */
const createCamera = ({
    bounds,
    viewport,
    initial,
    minScale = 0.4,
    maxScale = 2.4,
    anchorX = 0,
    seamWidth = 0,
    pad = FINITE_CAMERA_PAD,
    lineX,
} = {}) => {
    let world = { ...bounds };
    let size = { ...viewport };
    let reduced = prefersReducedMotion();

    const clampScale = (value) => Math.min(maxScale, Math.max(minScale, value));
    const state = {
        x: initial?.x ?? 0,
        y: initial?.y ?? 0,
        scale: clampScale(initial?.scale ?? 1),
    };

    const listeners = new Set();
    const emit = () => {
        const snapshot = { x: state.x, y: state.y, scale: state.scale };
        for (const listener of listeners) listener(snapshot);
    };

    // The view the core plans against: same shape as `WallView` (src/components/wall/wallView.ts:8).
    const view = () => ({
        width: size.width,
        height: size.height,
        scale: state.scale,
        lineX: lineX ?? size.width / 2,
    });

    // Content rect of the world, used for the camera clamp (src/components/wall/finiteWall.ts:89 `getRankedContentBounds`
    // reduced to the layout bounds; the layout hands us the content bounds directly).
    // `bounds` 是 layout 的 {minX,minY,maxX,maxY}，而 `getFiniteCameraRange` 要的是 Bounds {left,right,top,bottom}
    // （src/components/wall/layout.ts:17），所以这里必须换一次名字——直接用 minX/maxX 会让 clamp 全是 NaN。
    const contentBounds = () => ({
        left: world.minX,
        right: world.maxX,
        top: world.minY,
        bottom: world.maxY,
    });
    const cameraRange = () => getFiniteCameraRange({
        contentBounds: contentBounds(),
        anchor: { x: anchorX, y: 0 },
        view: view(),
        seamWidth,
        pad,
    });
    const clampCenter = (center) => clampToCameraRange(center, cameraRange());

    /** Screen delta -> world delta: negate and divide by scale, the inverse of the camera model documented at src/components/wall/wallView.ts:19. */
    const centerDelta = (dx, dy) => ({ x: -dx / state.scale, y: -dy / state.scale });

    let frame = null;
    let lastTime = null;

    // --- inertia: exponential decay with the framer-motion `inertia` parameters (src/components/wall/wallPanMotion.ts:9) ---
    // UNCERTAIN: framer-motion's `inertia` generator is not a plain exponential — it integrates a power
    // curve (`power: 0.3`) with `timeConstant: 280` and a velocity cap, and it also applies
    // `modifyTarget`. This port reproduces the observable parameters (cap, power as a release-speed
    // scale, 280 ms time constant, 0.5 px rest delta, 80 ms stale-release window) but not the exact
    // generator, because framer-motion is not available to the extracted module. The glide therefore
    // ends at the same place with a slightly different curve; a host that needs the exact original
    // curve must keep framer-motion's `animate` (see COVERAGE.md, dom/camera.js).
    let inertia = null;

    // --- wheel smoothing: `stepWallWheel` chases the accumulated pending screen delta (src/components/wall/wallPanMotion.ts:89) ---
    let wheel = null;

    const stopFrame = () => {
        if (frame !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(frame);
        frame = null;
        lastTime = null;
    };

    const stop = () => {
        inertia = null;
        wheel = null;
        stopFrame();
    };

    const moving = () => Boolean(inertia || wheel);

    const schedule = () => {
        if (frame !== null || typeof requestAnimationFrame !== 'function') return;
        frame = requestAnimationFrame(tick);
    };

    function tick(now) {
        frame = null;
        const dt = lastTime === null ? 1000 / 60 : now - lastTime;
        lastTime = now;

        if (inertia) {
            // Exponential decay of the release speed: v(t) = v0 * exp(-t / timeConstant),
            // timeConstant = 280 ms (src/components/wall/wallPanMotion.ts:14). `dirX`/`dirY` is the unit release
            // direction, so the screen-space displacement this frame is `v * dt`, converted to a
            // world view-centre delta by `centerDelta` (the same conversion a drag uses).
            const decay = Math.exp(-dt / WALL_PAN_INERTIA.timeConstant);
            const from = { x: state.x, y: state.y };
            inertia.velocity *= decay;
            const step = inertia.velocity * (dt / 1000);
            const delta = centerDelta(step * inertia.dirX, step * inertia.dirY);
            const next = { x: from.x + delta.x, y: from.y + delta.y };
            if (applyCenter(next, true)) emit();
            const requested = step;
            if (Math.abs(state.x - next.x) > 0.5 || Math.abs(state.y - next.y) > 0.5) {
                // Clamped by the world edge: a glide into the edge stops there (framer's restDelta).
                inertia = null;
            } else if (Math.abs(requested) < WALL_PAN_INERTIA.restDelta || inertia.velocity < WALL_PAN_INERTIA.minSpeed) {
                inertia = null;
            }
        } else if (wheel) {
            const { step, pending } = stepWallWheel(wheel.pending, dt);
            const delta = centerDelta(step.x, step.y);
            const requested = { x: state.x + delta.x, y: state.y + delta.y };
            if (applyCenter(requested, true)) emit();
            // The host clamp ate part of the step: drop that axis' remainder so scrolling back does not
            // first have to pay off the distance already stuck against the edge (src/components/wall/useWallPointerPan.ts:170-175).
            wheel.pending = {
                x: Math.abs(state.x - requested.x) > 0.5 ? 0 : pending.x,
                y: Math.abs(state.y - requested.y) > 0.5 ? 0 : pending.y,
            };
            if (wheel.pending.x === 0 && wheel.pending.y === 0) wheel = null;
        }

        if (moving()) schedule();
        else stopFrame();
    }

    /**
     * Write the view centre, clamped in normal motion and rubber-banded while dragging (src/components/wall/finiteWall.ts:165).
     * 不在这里发通知：一次公共调用只应产生一次 onChange，而 setScale/zoomAt/setViewport 除了中心还改了别的状态，
     * 由调用方决定什么时候 emit。返回是否真的动了。
     */
    const applyCenter = (center, clamp) => {
        const next = clamp ? clampCenter(center) : center;
        if (next.x === state.x && next.y === state.y) return false;
        state.x = next.x;
        state.y = next.y;
        return true;
    };

    const api = {
        getState: () => ({ x: state.x, y: state.y, scale: state.scale }),

        setCenter: (x, y) => {
            if (applyCenter({ x, y }, true)) emit();
        },

        setScale: (scale) => {
            const next = clampScale(scale);
            if (next === state.scale) return;
            state.scale = next;
            applyCenter({ x: state.x, y: state.y }, true);
            emit();
        },

        panBy: (dx, dy) => {
            stop();
            const range = cameraRange();
            // One axis at a time, full speed inside the range and resisted outside it (src/components/wall/finiteWall.ts:165).
            const x = stepCameraAxis(state.x, centerDelta(dx, 0).x, range.minX, range.maxX);
            const y = stepCameraAxis(state.y, centerDelta(0, dy).y, range.minY, range.maxY);
            if (applyCenter({ x, y }, false)) emit();
        },

        zoomAt: (clientX, clientY, factor) => {
            stop();
            const next = clampScale(state.scale * factor);
            if (next === state.scale) return;
            // Anchor: keep the world point under (clientX, clientY) fixed while the scale changes.
            const worldX = state.x + (clientX - (lineX ?? size.width / 2)) / state.scale;
            const worldY = state.y + (clientY - size.height / 2) / state.scale;
            state.scale = next;
            applyCenter({
                x: worldX - (clientX - (lineX ?? size.width / 2)) / next,
                y: worldY - (clientY - size.height / 2) / next,
            }, true);
            emit();
        },

        /**
         * One wheel event, classified exactly like `src/components/wall/useWallPointerPan.ts:211-244`: trackpad and
         * reduced-motion deltas land in the same frame, a mouse wheel notch accumulates into the
         * smoothed pending delta.
         */
        applyWheel: (event, classify = createWallWheelClassifier()) => {
            if (event.ctrlKey || event.metaKey) return false;
            const source = classify(event);
            const { dx, dy } = wallWheelDelta(event, size.height);
            if (source === 'trackpad' || reduced) {
                const carry = wheel ? wheel.pending : { x: 0, y: 0 };
                stop();
                const delta = centerDelta(carry.x - dx, carry.y - dy);
                if (applyCenter({ x: state.x + delta.x, y: state.y + delta.y }, false)) emit();
                return true;
            }
            if (!wheel) wheel = { pending: { x: 0, y: 0 } };
            wheel.pending = { x: wheel.pending.x - dx, y: wheel.pending.y - dy };
            schedule();
            return true;
        },

        /** Legacy drag inertia: `velocity` is screen px/s at release (src/components/wall/useWallPointerPan.ts:105-120). */
        startInertia: (vx, vy) => {
            stop();
            const speed = Math.hypot(vx, vy);
            if (reduced || speed < WALL_PAN_INERTIA.minSpeed) return;
            inertia = {
                velocity: Math.min(speed, WALL_PAN_INERTIA.maxSpeed),
                dirX: vx / speed,
                dirY: vy / speed,
            };
            schedule();
        },

        update: (dtMs) => {
            if (!moving()) return false;
            const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
            lastTime = now - dtMs;
            tick(now);
            return moving();
        },

        isMoving: moving,
        stop,

        setViewport: (next) => {
            size = { ...next };
            applyCenter({ x: state.x, y: state.y }, true);
            emit();
        },

        setBounds: (next) => {
            world = { ...next };
            applyCenter({ x: state.x, y: state.y }, true);
            emit();
        },

        setReducedMotion: (value) => {
            reduced = Boolean(value);
            if (reduced) stop();
        },

        onChange: (callback) => {
            listeners.add(callback);
            return () => listeners.delete(callback);
        },

        destroy: () => {
            stop();
            listeners.clear();
        },
    };

    applyCenter({ x: state.x, y: state.y }, true);
    return api;
}; __ret.createCamera = createCamera;

});

// ---- dom/pointer.js ----------------------------------------------------
__def("dom/pointer.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/useWallPointerPan.ts (lines 1-272), src/components/wall/queueDragGeometry.ts
// Fidelity: adapted-port
// Module: photowall / dom

const { QUEUE_DRAG_THRESHOLD_PX, QUEUE_ISLAND_ROW_HEIGHT, WALL_PAN_INERTIA, autoScrollEdgeAt, createWallWheelClassifier, queueRowShift, resolveAutoScroll, resolveDropIndex } = __req("core/index.js");

// Pointer interaction for the wall: drag-to-pan with inertia, wheel / trackpad panning, click
// suppression after a drag, and the queue-island drag-reorder geometry. This is
// `src/components/wall/useWallPointerPan.ts` with React and framer-motion removed: the hook took refs and callbacks, the
// controller takes the container element and a camera and wires its own listeners.

/** DRAG_THRESHOLD_PX = 7 — src/components/wall/useWallPointerPan.ts:13 */
const DRAG_THRESHOLD_PX = 7; __ret.DRAG_THRESHOLD_PX = DRAG_THRESHOLD_PX;
/** CULL_EDGE_MARGIN_PX = 180 — src/components/wall/useWallPointerPan.ts:14 */
const CULL_EDGE_MARGIN_PX = 180; __ret.CULL_EDGE_MARGIN_PX = CULL_EDGE_MARGIN_PX;
/** WHEEL_LATCH_MS = 160 — src/components/wall/useWallPointerPan.ts:16 */
const WHEEL_LATCH_MS = 160; __ret.WHEEL_LATCH_MS = WHEEL_LATCH_MS;
/** LATCH_MOVE_PX = 4 — src/components/wall/useWallPointerPan.ts:18 */
const LATCH_MOVE_PX = 4; __ret.LATCH_MOVE_PX = LATCH_MOVE_PX;
/** Controls that own their own gestures: a drag starting on one of these never pans the wall (src/components/wall/useWallPointerPan.ts:75). */
const INTERACTIVE_SELECTOR = 'button, input, select, textarea, a, [contenteditable="true"], [role="slider"]'; __ret.INTERACTIVE_SELECTOR = INTERACTIVE_SELECTOR;

/**
 * Rows of the queue island. A press on one starts a reorder, never a pan — same selector the queue
 * handler in dom/createWall.js (line 458) uses for `closest()`.
 */
const QUEUE_ROW_SELECTOR = '[data-queue-index]'; __ret.QUEUE_ROW_SELECTOR = QUEUE_ROW_SELECTOR;

/** Modifier-only keydown does not count as keyboard input (src/components/wall/useWallPointerPan.ts:247-250). */
const MODIFIER_KEYS = new Set(['Shift', 'Control', 'Alt', 'Meta']);

/**
 * createPointerController — adapted-port of `useWallPointerPan` + `useQueueDragReorder`'s geometry.
 * @param {Object} options
 * @param {HTMLElement} options.container
 * @param {Object} options.camera                from createCamera
 * @param {(x: number, y: number) => void} [options.onPan]  called after every camera change; x/y are the
 *        frozen camera state — the VIEW CENTRE in world px (CONTRACT §4). A host that writes a CSS
 *        transform must convert first: `cameraFromViewCenter(state, { ...viewport, scale })`
 *        (src/components/wall/wallView.ts:42), because the original wrote `applyCamera`'s value straight
 *        into the world transform `formatWorldTransform` (src/components/wall/wallView.ts:32), which
 *        encodes the model `screen = camera + world * scale` (documented at the top of that file).
 * @param {boolean} [options.keyboard]           true: arrow keys / Home end drive the camera
 * @param {(cell: number) => void} [options.onKeyZoom]  '+' / '-' / '0' zoom steps (authored convenience)
 * @param {(drag: { from: number, to: number }) => void} [options.onReorder]
 * @param {(drag: { from: number, to: number, active: boolean }) => void} [options.onDragGeometry]
 * @param {() => HTMLElement | null} [options.getRowContainer]  scroll container used by drag autoscroll
 * @param {number} [options.rowHeight]           QUEUE_ISLAND_ROW_HEIGHT = 40 (src/components/wall/queueDragGeometry.ts:9)
 * @returns {Object} WallPointerController
 */
const createPointerController = ({
    container,
    camera,
    onPan,
    keyboard = false,
    onKeyZoom,
    onReorder,
    onDragGeometry,
    getRowContainer,
    rowHeight,
}) => {
    const classifyWheel = createWallWheelClassifier();
    const reduced = () => (typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches);

    // --- pan gesture state (src/components/wall/useWallPointerPan.ts:39-49) ---
    let pan = null;
    let didDrag = false;
    let latch = null;
    let rafId = null;

    // --- queue drag-reorder state ---
    let queueDrag = null;

    const notify = () => {
        if (onPan) {
            const { x, y } = camera.getState();
            onPan(x, y);
        }
    };

    // ---------------------------------------------------------------------------------------------
    // Pointer pan
    // ---------------------------------------------------------------------------------------------

    const onPointerDown = (event) => {
        // Button 0, primary pointer, one gesture at a time (src/components/wall/useWallPointerPan.ts:69).
        if (event.button !== 0 || !event.isPrimary || pan) return;
        camera.stop();
        didDrag = false;
        // A drag starting on a real control belongs to that control (src/components/wall/useWallPointerPan.ts:75).
        if (event.target instanceof Element && event.target.closest(INTERACTIVE_SELECTOR)) return;
        // A press on a queue row is a reorder gesture, not a wall pan: the row handler in
        // dom/createWall.js (line 458) hands it to beginQueueDrag. Creating a pan as well would latch
        // a gesture that no pointermove ever feeds, because onPointerMove routes to moveQueueDrag
        // whenever queueDrag exists.
        if (event.target instanceof Element && event.target.closest(QUEUE_ROW_SELECTOR)) return;
        pan = {
            id: event.pointerId,
            start: { x: event.clientX, y: event.clientY },
            camera: { x: camera.getState().x, y: camera.getState().y },
            last: { x: event.clientX, y: event.clientY, time: event.timeStamp },
            vx: 0,
            vy: 0,
            dragged: false,
        };
    };

    const onPointerMove = (event) => {
        if (queueDrag) return moveQueueDrag(event);
        if (!pan || pan.id !== event.pointerId) return;
        const dx = event.clientX - pan.start.x;
        const dy = event.clientY - pan.start.y;
        if (!pan.dragged && Math.hypot(dx, dy) > DRAG_THRESHOLD_PX) {
            pan.dragged = true;
            didDrag = true;
            if (container.setPointerCapture) container.setPointerCapture(event.pointerId);
        }
        // 本帧相对上一帧的位移，必须在覆盖 pan.last 之前取出（src/components/wall/useWallPointerPan.ts:90-102
        // 用指针速度 vx/vy 记录同样的差值）。
        const stepX = event.clientX - pan.last.x;
        const stepY = event.clientY - pan.last.y;
        const elapsed = event.timeStamp - pan.last.time;
        if (elapsed > 0) {
            pan.vx = stepX / elapsed * 1000;
            pan.vy = stepY / elapsed * 1000;
        }
        pan.last = { x: event.clientX, y: event.clientY, time: event.timeStamp };
        if (!pan.dragged) return;
        // The camera follows the total gesture delta from `pan.camera`, exactly like
        // src/components/wall/useWallPointerPan.ts:101 (`updateCamera(pointer.camera.x + dx, ...)`); `panBy` adds one
        // relative step, so the step is the delta since the previous frame.
        camera.panBy(stepX, stepY);
        notify();
    };

    /**
     * Drop the pan gesture of one pointer, releasing its capture. Used by the queue branch below:
     * a reorder and a pan can be created by the SAME press, because the field-level pointerdown that
     * starts the pan runs before the queue-row handler that starts the drag.
     */
    const clearPan = (pointerId) => {
        if (!pan || pan.id !== pointerId) return;
        pan = null;
        if (container.hasPointerCapture && container.hasPointerCapture(pointerId)) {
            container.releasePointerCapture(pointerId);
        }
    };

    const endPan = (event, cancelled) => {
        if (queueDrag) {
            // A live reorder owns the gesture: commit on pointerup, discard on pointercancel
            // (useQueueDragReorder.ts releases with `onDragEnd`).
            if (!queueDrag.active) queueDrag = null;
            else endQueueDrag(!cancelled);
            // The same press also created a field-level pan. It never received a pointermove (they all
            // go to moveQueueDrag while a drag exists), so it must be dropped here: left latched it
            // made the next pointerdown a no-op and made a reused pointerId jump by the stale
            // distance. Found by the stubbed-DOM gate (see COVERAGE.md §6.2 item 5).
            clearPan(event.pointerId);
            return;
        }
        if (!pan || pan.id !== event.pointerId) return;
        const gesture = pan;
        clearPan(event.pointerId);
        // Coast along the release velocity; stale samples and cancelled gestures never coast
        // (src/components/wall/useWallPointerPan.ts:104-113).
        if (cancelled || !gesture.dragged || reduced()) return;
        if (event.timeStamp - gesture.last.time > WALL_PAN_INERTIA.staleReleaseMs) return;
        camera.startInertia(gesture.vx, gesture.vy);
    };

    const onClickCapture = (event) => {
        // Swallow the click that closes a drag so it does not also open the card (src/components/wall/useWallPointerPan.ts:128-133).
        if (!didDrag || event.detail === 0) return;
        didDrag = false;
        event.preventDefault();
        event.stopPropagation();
    };

    // ---------------------------------------------------------------------------------------------
    // Wheel: classifier + one-gesture latch (src/components/wall/useWallPointerPan.ts:182-244)
    // ---------------------------------------------------------------------------------------------

    const startTick = () => {
        if (rafId !== null || typeof requestAnimationFrame !== 'function') return;
        rafId = requestAnimationFrame(function tick(now) {
            rafId = null;
            camera.update(16.7);
            notify();
            if (camera.isMoving()) startTick();
        });
    };

    const onWheel = (event) => {
        if (event.ctrlKey || event.metaKey) return;
        event.preventDefault();
        holdLatch(event);
        if (pan || queueDrag) return;
        camera.applyWheel(event, classifyWheel);
        startTick();
    };

    const onLatchedWheel = (event) => {
        if (event.target instanceof Node && container.contains(event.target)) return;
        event.stopPropagation();
        onWheel(event);
    };

    const onLatchMove = (event) => {
        if (latch && Math.hypot(event.clientX - latch.x, event.clientY - latch.y) > LATCH_MOVE_PX) releaseLatch();
    };

    const holdLatch = (event) => {
        if (!latch) {
            latch = { timer: 0, x: event.clientX, y: event.clientY };
            window.addEventListener('wheel', onLatchedWheel, { passive: false, capture: true });
            window.addEventListener('pointermove', onLatchMove, true);
        }
        window.clearTimeout(latch.timer);
        latch.timer = window.setTimeout(releaseLatch, WHEEL_LATCH_MS);
    };

    const releaseLatch = () => {
        if (!latch) return;
        window.clearTimeout(latch.timer);
        latch = null;
        window.removeEventListener('wheel', onLatchedWheel, { capture: true });
        window.removeEventListener('pointermove', onLatchMove, true);
    };

    // ---------------------------------------------------------------------------------------------
    // Keyboard: any non-modifier key interrupts the glide (src/components/wall/useWallPointerPan.ts:247)
    // ---------------------------------------------------------------------------------------------

    const onKeyDown = (event) => {
        if (MODIFIER_KEYS.has(event.key)) return;
        camera.stop();
        if (!keyboard) return;
        const stepPx = 80;
        switch (event.key) {
            case 'ArrowLeft': camera.panBy(stepPx, 0); break;
            case 'ArrowRight': camera.panBy(-stepPx, 0); break;
            case 'ArrowUp': camera.panBy(0, stepPx); break;
            case 'ArrowDown': camera.panBy(0, -stepPx); break;
            case '+':
            case '=':
                if (onKeyZoom) onKeyZoom(1);
                break;
            case '-':
                if (onKeyZoom) onKeyZoom(-1);
                break;
            default:
                return;
        }
        event.preventDefault();
        notify();
    };

    const cancel = () => {
        pan = null;
        camera.stop();
    };

    // ---------------------------------------------------------------------------------------------
    // Queue drag-reorder (useQueueDragReorder.ts + src/components/wall/queueDragGeometry.ts)
    // ---------------------------------------------------------------------------------------------

    /**
     * Begin a drag-reorder of row `index`. Call from the row handle's pointerdown. The drag only
     * becomes live once the pointer has moved QUEUE_DRAG_THRESHOLD_PX = 4 (src/components/wall/queueDragGeometry.ts:11),
     * so a shaky click never turns into a reorder.
     * @param {Object} input
     * @param {number} input.index
     * @param {number} input.rowCount
     * @param {number} input.pointerY        client y of the press
     * @param {number} input.containerTop    client y of the scroll container's content box top
     * @param {number} input.containerBottom client y of its bottom
     * @param {number} input.scrollTop       the container's current scrollTop
     */
    const beginQueueDrag = ({
        index,
        rowCount,
        pointerY,
        containerTop,
        containerBottom,
        scrollTop,
    }) => {
        const height = rowHeight ?? QUEUE_ISLAND_ROW_HEIGHT;
        const contentY = pointerY - containerTop + scrollTop;
        queueDrag = {
            from: index,
            to: index,
            rowCount,
            startY: pointerY,
            grabOffset: contentY - index * height,
            containerTop,
            containerBottom,
            scrollTop,
            // Starting inside an edge zone suppresses that side until the pointer leaves it, so the
            // list does not scroll away the moment the threshold is crossed (src/components/wall/queueDragGeometry.ts:108).
            suppressedEdge: autoScrollEdgeAt({ pointerY, top: containerTop, bottom: containerBottom }),
            motion: null,
            active: false,
        };
        return queueDrag;
    };

    const moveQueueDrag = (event) => {
        const state = queueDrag;
        if (!state) return;
        state.motion = {
            pointerY: event.clientY,
            top: state.containerTop,
            bottom: state.containerBottom,
            suppressedEdge: state.suppressedEdge,
        };
        if (!state.active) {
            if (Math.abs(event.clientY - state.startY) < QUEUE_DRAG_THRESHOLD_PX) return;
            state.active = true;
            if (onDragGeometry) onDragGeometry({ from: state.from, to: state.to, active: true });
        }
        // The row's midline in content coordinates: clientY - containerTop + scrollTop - grab offset,
        // then half a row down to reach the slot centre (src/components/wall/queueDragGeometry.ts:23).
        const centerY = event.clientY - state.containerTop + state.scrollTop - state.grabOffset + (rowHeight ?? QUEUE_ISLAND_ROW_HEIGHT) / 2;
        const to = resolveDropIndex({ centerY, rowHeight, rowCount: state.rowCount });
        if (to !== state.to) {
            state.to = to;
            if (onDragGeometry) onDragGeometry({ from: state.from, to: state.to, active: true });
        }
        // Autoscroll: this controller only decides the velocity; the scroll container applies it
        // (`resolveAutoScroll`, src/components/wall/queueDragGeometry.ts:108).
        const scroll = resolveAutoScroll({
            pointerY: event.clientY,
            top: state.containerTop,
            bottom: state.containerBottom,
            suppressedEdge: state.suppressedEdge,
        });
        state.suppressedEdge = scroll.suppressedEdge;
        const scrollContainer = getRowContainer ? getRowContainer() : null;
        if (scrollContainer && !reduced() && scroll.velocity !== 0) {
            scrollContainer.scrollTop += scroll.velocity;
        }
    };

    const endQueueDrag = (committed = true) => {
        const state = queueDrag;
        queueDrag = null;
        if (!state) return null;
        if (onDragGeometry) onDragGeometry({ from: state.from, to: state.to, active: false });
        if (committed && state.to !== state.from && onReorder) onReorder({ from: state.from, to: state.to });
        return { from: state.from, to: state.to };
    };

    // ---------------------------------------------------------------------------------------------
    // Wiring
    // ---------------------------------------------------------------------------------------------

    const endOutside = (event) => {
        // Releasing outside the container still ends the gesture -- with coasting, not a cancel
        // (src/components/wall/useWallPointerPan.ts ends on `pointerup` wherever it lands).
        if (queueDrag || (pan && pan.id === event.pointerId)) endPan(event, false);
    };

    const attach = () => {
        container.addEventListener('pointerdown', onPointerDown);
        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerup', event => endPan(event, false));
        container.addEventListener('pointercancel', event => endPan(event, true));
        container.addEventListener('click', onClickCapture, true);
        container.addEventListener('wheel', onWheel, { passive: false });
        container.addEventListener('keydown', onKeyDown, true);
        window.addEventListener('pointerup', endOutside);
        window.addEventListener('pointercancel', endOutside);
        window.addEventListener('blur', cancel);
        return api;
    };

    const destroy = () => {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('click', onClickCapture, true);
        container.removeEventListener('wheel', onWheel);
        container.removeEventListener('keydown', onKeyDown, true);
        window.removeEventListener('pointerup', endOutside);
        window.removeEventListener('pointercancel', endOutside);
        window.removeEventListener('blur', cancel);
        releaseLatch();
        if (rafId !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(rafId);
        queueDrag = null;
        pan = null;
        cancel();
    };

    const api = {
        attach,
        destroy,
        didDrag: () => didDrag,
        isDragging: () => queueDrag !== null,
        beginQueueDrag,
        endQueueDrag,
        cancelQueueDrag: () => endQueueDrag(false),
        /** Screen-px offset for row `index` while the drag is live (src/components/wall/queueDragGeometry.ts:41). */
        rowShift: (index) => (queueDrag ? queueRowShift(index, queueDrag.from, queueDrag.to, rowHeight) : 0),
    };

    return api;
}; __ret.createPointerController = createPointerController;

});

// ---- dom/createWall.js -------------------------------------------------
__def("dom/createWall.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/app/lattice/PosterWall.tsx (lines 49-375)
// Adapted from: src/components/app/lattice/LatticePoster.tsx (lines 122-323) for the default card DOM
// Fidelity: adapted-port
// Module: photowall / dom

// createWall 是把 `buildWallLayout` 的世界坐标卡片列表变成真实 DOM 的那一层：一层 `.lattice-root` 背景、
// 一个可拖拽的 `.lattice-field`、一个只靠 transform 移动的 `.lattice-world`，以及贴在 world 里的海报卡片。
// 原实现里 React 负责重渲染、framer-motion 负责补间；这里两者都没有，所以：
//   - 相机变化不再走 React 重渲染，而是直接写 world 的 transform（原本的 applyCamera 也是直接写，PosterWall.tsx:120-131）；
//   - 卡片的可见性由相机世界的矩形裁剪决定（culling），布局不变时不会重建 DOM；
//   - 补间只剩 createCamera 的惯性/wheel 平滑：布局重排是**瞬时**的（positionCard 直接写 left/top/width/height），
//     src/styles/wall.css 只对 box-shadow/filter/opacity 做 transition，不对位置或尺寸做；core/flipPlan.js、
//     core/seamPlan.js、core/revealRect.js、core/startTile.js、core/wallHandoff.js、motion/wallReflowMotion.js
//     是已移植但**没有接进本文件**的规划模块（COVERAGE.md §2F），所以 setLayout 不会播放 FLIP/回弹动画。
// 冻结事件名：card:click / card:hover / card:leave / camera:change / reorder（CONTRACT.md §4.3）。

const { createCamera, prefersReducedMotion } = __req("dom/camera.js");
const { createPointerController } = __req("dom/pointer.js");
const { formatWorldTransform, getViewWorldBounds, cameraFromViewCenter, viewCenterFromCamera } = __req("core/wallView.js");
const { overlaps, toBounds, MAX_RENDERED_INSTANCES, EXPANSION_SPAN } = __req("core/index.js");
const { pickAdjacentRect } = __req("core/wallNavigation.js");

// ---------------------------------------------------------------------------------------------
// PosterWall.tsx 的布局常量（原样搬运，含行号）
// ---------------------------------------------------------------------------------------------

/** CELL_SIZE = 128 — PosterWall.tsx:49 */
const CELL_SIZE = 128; __ret.CELL_SIZE = CELL_SIZE;
/** GAP = 8 — PosterWall.tsx:50 */
const GAP = 8; __ret.GAP = GAP;
/** OVERSCAN = 500 — PosterWall.tsx:51 */
const OVERSCAN = 500; __ret.OVERSCAN = OVERSCAN;
/** MAX_RESERVED_VIEWPORTS = 3 — PosterWall.tsx:53 */
const MAX_RESERVED_VIEWPORTS = 3; __ret.MAX_RESERVED_VIEWPORTS = MAX_RESERVED_VIEWPORTS;
/** METRICS = { cellSize: 128, gap: 8 } — PosterWall.tsx:58 */
const METRICS = { cellSize: CELL_SIZE, gap: GAP }; __ret.METRICS = METRICS;
/**
 * EXPANDED_SIZE = EXPANSION_SPAN.cols * (CELL_SIZE + GAP) - GAP — PosterWall.tsx:60
 * 展开后一张卡片占的方形边长（世界 px）：6 * 136 - 8 = 808。
 */
const EXPANDED_SIZE = EXPANSION_SPAN.cols * (CELL_SIZE + GAP) - GAP; __ret.EXPANDED_SIZE = EXPANDED_SIZE;
/** 初始相机 { x: 34, y: 80 } — PosterWall.tsx:84 */
const INITIAL_CAMERA = { x: 34, y: 80 }; __ret.INITIAL_CAMERA = INITIAL_CAMERA;
/** 首帧兜底视口 { width: 1280, height: 720 } — PosterWall.tsx:85 */
const INITIAL_VIEWPORT = { width: 1280, height: 720 }; __ret.INITIAL_VIEWPORT = INITIAL_VIEWPORT;

/**
 * getScale(width) — PosterWall.tsx:63
 * 断点式基础缩放：窄屏 0.52 / 中屏 0.64 / 宽屏 0.76。原实现只在 ResizeObserver 里改 scale，
 * 用户滚轮缩放（createCamera.zoomAt）在此之上做倍率叠加。
 * @param {number} width
 * @returns {number}
 */
const getScale = (width) => (width < 640 ? 0.52 : width < 1100 ? 0.64 : 0.76); __ret.getScale = getScale;

/**
 * fallbackBackground(id) — LatticePoster.tsx:122-125
 * 没有封面图时用 id 的字符码和生成一个稳定的色相，保证同一首歌每次都是同一张渐变。
 * @param {string} id
 * @returns {string}
 */
const fallbackBackground = (id) => {
    const hue = [...String(id)].reduce((sum, character) => sum + character.charCodeAt(0), 0) % 360;
    return `linear-gradient(145deg, hsl(${hue} 68% 58%), hsl(${(hue + 52) % 360} 62% 18%))`;
}; __ret.fallbackBackground = fallbackBackground;

/**
 * getWorldBounds(camera, viewport) — PosterWall.tsx:65-70
 * 相机状态下屏幕四边对应的世界坐标矩形（`screen = camera + world * scale` 的逆）。
 * @param {{x:number,y:number,scale:number}} camera
 * @param {{width:number,height:number}} viewport
 * @returns {{left:number,top:number,right:number,bottom:number}}
 */
const getWorldBounds = (camera, viewport) => ({
    left: -camera.x / camera.scale,
    top: -camera.y / camera.scale,
    right: (viewport.width - camera.x) / camera.scale,
    bottom: (viewport.height - camera.y) / camera.scale,
}); __ret.getWorldBounds = getWorldBounds;

/**
 * 默认卡片渲染器的节点结构与 LatticePoster.tsx:286-302 一致：
 *   article.lattice-poster > span.lattice-poster-shade / -lights-out / -tint / -badge / -copy(strong + small)
 * 背景图用 item.coverUrl；没有就用 fallbackBackground。徽章优先用 item.badge，否则是序号（补零两位）。
 * 返回的元素由 createWall 负责定位（position/transform/width/height），渲染器只管内容。
 * @param {{key:string,itemIndex:number}} card
 * @param {{id:string,title:string,subtitle?:string,coverUrl?:string,badge?:string}} item
 * @returns {HTMLElement}
 */
const createPosterElement = (card, item) => {
    const poster = document.createElement('article');
    poster.className = 'lattice-poster';
    poster.setAttribute('role', 'button');
    poster.tabIndex = 0;
    poster.setAttribute('aria-label', item.subtitle ? `${item.title} · ${item.subtitle}` : item.title);
    // 背景：有封面就用 backgroundImage: url(...)，没有封面用哈希渐变（LatticePoster.tsx:274-277）。
    poster.style.backgroundImage = item.coverUrl ? `url("${item.coverUrl}")` : fallbackBackground(item.id);

    // 三层覆盖：底部压暗、熄灯遮罩、色调层（wall.css 里各自有状态选择器）。
    const shade = document.createElement('span');
    shade.className = 'lattice-poster-shade';
    const lightsOut = document.createElement('span');
    lightsOut.className = 'lattice-poster-lights-out';
    const tint = document.createElement('span');
    tint.className = 'lattice-poster-tint';
    const badge = document.createElement('span');
    badge.className = 'lattice-poster-badge';
    // 徽章文案：`String(queueIndex + 1).padStart(2, '0')` — LatticePoster.tsx:291
    badge.textContent = item.badge ?? String(card.itemIndex + 1).padStart(2, '0');
    const copy = document.createElement('span');
    copy.className = 'lattice-poster-copy';
    const title = document.createElement('strong');
    title.textContent = item.title;
    copy.append(title);
    if (item.subtitle) {
        const subtitle = document.createElement('small');
        subtitle.textContent = item.subtitle;
        copy.append(subtitle);
    }
    poster.append(shade, lightsOut, tint, badge, copy);
    return poster;
}; __ret.createPosterElement = createPosterElement;

/**
 * createWall — 照片墙的 DOM 渲染器与交互宿主。
 * @param {HTMLElement} container                        被墙填满的元素（position 由调用方决定，建议 relative）
 * @param {Object} options
 * @param {import('../core/buildWallLayout.js').WallLayout} options.layout   来自 buildWallLayout
 * @param {Object} [options.camera]                      已有相机；省略时内部按 layout.bounds 建一个
 * @param {(card: Object, item: Object) => HTMLElement | null} [options.renderCard]  自定义卡片，返回 null 表示用默认渲染器
 * @param {boolean} [options.keyboard]                   true（默认）：方向键移动卡片焦点，Enter/Space 触发点击
 * @param {(card: Object, item: Object) => void} [options.onSelect] 卡片被点击/回车
 * @param {(drag: { from: number, to: number }) => void} [options.onReorder] 队列拖拽落点
 * @param {Object} [options.queue]                       内部扩展：接上队列岛的拖拽排序
 * @param {() => HTMLElement | null} [options.queue.getRowContainer]
 * @param {() => number} [options.queue.getRowCount]
 * @param {(index: number) => string} [options.queue.keyAt]
 * @param {number} [options.queue.rowHeight]
 * @param {number} [options.minScale]
 * @param {number} [options.maxScale]
 * @returns {Object} Wall
 */
const createWall = (container, options = {}) => {
    if (typeof document === 'undefined') {
        throw new Error('createWall 需要 DOM（window/document）；纯逻辑请直接用 photowall/src/core。');
    }
    if (!container) throw new Error('createWall(container): container 不能为空');
    if (!options.layout) throw new Error('createWall(container, { layout }): layout 不能为空');

    let layout = options.layout;
    let items = options.items ?? [];
    let viewport = { ...INITIAL_VIEWPORT };
    let destroyed = false;

    // ---------------------------------------------------------------------------------------------
    // 骨架取自 PosterWall.tsx:324-375 的 div 结构：field > world > poster（三层，不要多套）。
    // ---------------------------------------------------------------------------------------------
    const root = document.createElement('div');
    // rootClass 选项是内部扩展：React 适配层要把 Lattice 的状态类名放在 wall.css 选择器要求的那一个
    // 元素上，即原本 className 拼装的那个 div（Lattice.tsx:131），而不是再套一层 .lattice-root
    // （套两层会画出两层胶片颗粒）。
    root.className = options.rootClass ?? 'lattice-root';
    const field = document.createElement('div');
    field.className = 'lattice-field';
    field.tabIndex = -1;
    const world = document.createElement('div');
    world.className = 'lattice-world';
    field.append(world);
    root.append(field);
    container.append(root);

    // ---------------------------------------------------------------------------------------------
    // 相机：没有外部相机就按 PosterWall 的初始值建一个（PosterWall.tsx:84-85 + getScale）
    // ---------------------------------------------------------------------------------------------
    const measure = () => {
        const rect = typeof container.getBoundingClientRect === 'function' ? container.getBoundingClientRect() : null;
        const width = Math.round(rect?.width ?? 0);
        const height = Math.round(rect?.height ?? 0);
        // 容器还没被摆进文档（或尺寸为 0）时用 PosterWall 的首帧兜底视口，避免相机范围退化成一个点。
        return {
            width: width >= 1 ? width : INITIAL_VIEWPORT.width,
            height: height >= 1 ? height : INITIAL_VIEWPORT.height,
        };
    };
    viewport = options.viewport ?? measure();

    // 宿主传进来的相机由宿主负责销毁（它的 onchange 订阅者可能还有别人）；只 stop 掉内部循环。
    const ownsCamera = !options.camera;
    const initialScale = getScale(viewport.width);
    // `viewCenterFromCamera` reads the scale off the view (viewCenterFromCamera, wallView.ts:37-40),
    // so the view passed in carries the breakpoint scale and the result is completed with it.
    const initialView = { ...viewport, scale: initialScale };
    const initialCenter = viewCenterFromCamera({ ...INITIAL_CAMERA, scale: initialScale }, initialView);
    const camera = options.camera ?? createCamera({
        bounds: layout.bounds,
        viewport,
        // INITIAL_CAMERA = {x: 34, y: 80} is the original's screen position of the WORLD ORIGIN
        // (PosterWall.tsx:84, applied straight through formatWorldTransform). CONTRACT §4 freezes
        // getState().x/y as the view CENTRE, so it is converted once here; the default view is
        // unchanged (the world still starts at translate3d(34px, 80px, 0)).
        initial: { ...initialCenter, scale: initialScale },
        minScale: options.minScale,
        maxScale: options.maxScale,
    });

    // ---------------------------------------------------------------------------------------------
    // 事件总线：冻结的五个名字，其余一律内部
    // ---------------------------------------------------------------------------------------------
    const handlers = new Map();
    const emit = (name, payload) => {
        const set = handlers.get(name);
        if (!set) return;
        for (const handler of [...set]) handler(payload);
    };
    const on = (name, handler) => {
        if (!handlers.has(name)) handlers.set(name, new Set());
        handlers.get(name).add(handler);
        return () => handlers.get(name)?.delete(handler);
    };

    // ---------------------------------------------------------------------------------------------
    // 相机 -> DOM
    // ---------------------------------------------------------------------------------------------
    const pixelRatio = () => (typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);
    let cullFrame = null;

    /**
     * The frozen `camera.getState()` reports {x,y} as the VIEW CENTRE in world px (CONTRACT §4, and the
     * model `camera.js` clamps in — `finiteWall.ts:113` documents that range as "Clamp for a finite
     * layer's view centre"), while `formatWorldTransform` and `getWorldBounds` take the screen position
     * of the world ORIGIN — the Lattice translation (`screen = camera + world * scale`,
     * src/components/wall/wallView.ts:19; seed at PosterWall.tsx:84; cull bounds at PosterWall.tsx:65-70;
     * written straight out at PosterWall.tsx:123). `cameraFromViewCenter` is the conversion
     * (src/components/wall/wallView.ts:42-46) and reads the scale off the VIEW, so it is completed here.
     */
    const originCamera = () => {
        const state = camera.getState();
        return cameraFromViewCenter(state, { ...viewport, scale: state.scale });
    };

    /** 世界层 transform：整像素吸附避免半像素重栅格化（formatWorldTransform，src/components/wall/wallView.ts:32）。 */
    const applyTransform = () => {
        const { x, y, scale } = originCamera();
        world.style.transform = formatWorldTransform(x, y, scale, pixelRatio());
    };

    /** 可见世界矩形 = 屏幕四角 + OVERSCAN（PosterWall.tsx:51）；角点由 getWorldBounds 取（PosterWall.tsx:65-70）。 */
    const visibleWorldBounds = () => {
        const { scale } = camera.getState();
        const screen = getWorldBounds(originCamera(), viewport);
        return {
            left: screen.left - OVERSCAN / scale,
            top: screen.top - OVERSCAN / scale,
            right: screen.right + OVERSCAN / scale,
            bottom: screen.bottom + OVERSCAN / scale,
        };
    };

    const mounted = new Map(); // card.key -> { el, card, itemIndex }
    // 内容优先取 options.items；没给 items 时退回 buildWallLayout 挂在卡片上的 item（photowall/src/core/buildWallLayout.js:98），
    // 否则 README 的 `createWall(stage, { layout })` 用法会渲染出空白海报。
    const itemFor = (card) => items[card.itemIndex] ?? card.item ?? null;

    const positionCard = (entry) => {
        const { el, card } = entry;
        el.style.position = 'absolute';
        el.style.left = '0';
        el.style.top = '0';
        el.style.width = `${card.width}px`;
        el.style.height = `${card.height}px`;
        el.style.transform = `translate3d(${card.x}px, ${card.y}px, 0)`;
    };

    const createCard = (card) => {
        const item = itemFor(card) ?? { id: card.key, title: '', subtitle: '' };
        const custom = options.renderCard ? options.renderCard(card, item) : null;
        const el = custom ?? createPosterElement(card, item);
        el.dataset.wallCard = card.key;
        el.dataset.itemIndex = String(card.itemIndex);
        const entry = { el, card, itemIndex: card.itemIndex };
        positionCard(entry);
        mounted.set(card.key, entry);
        return entry;
    };

    /**
     * 重新裁剪并同步 DOM。布局不变时只移动/增删可见卡片，不重建已有的元素；
     * 焦点卡片即使落在裁剪框外也保留（PosterWall.tsx:213-220 把 active poster 追加回列表是同一个理由）。
     */
    const render = () => {
        if (destroyed) return;
        const visible = visibleWorldBounds();
        const focusKey = focusedKey;
        let budget = MAX_RENDERED_INSTANCES;
        const wanted = [];
        for (const card of layout.cards) {
            if (wanted.length >= budget) break;
            // toBounds/overlaps 是布局层自己的矩形工具（src/components/wall/layout.ts:60-72），
            // 这里复用它们，而不是再写一遍四则运算。
            if (overlaps(toBounds(card), visible) || card.key === focusKey) wanted.push(card);
        }
        const wantedKeys = new Set(wanted.map(card => card.key));
        for (const [key, entry] of [...mounted]) {
            if (!wantedKeys.has(key)) {
                entry.el.remove();
                mounted.delete(key);
                if (hoverKey === key) hoverKey = null;
            }
        }
        for (const card of wanted) {
            const existing = mounted.get(card.key);
            if (!existing) {
                world.append(createCard(card).el);
                continue;
            }
            // 布局对象换了（setLayout）但 key 相同：位置以新卡片为准。
            existing.card = card;
            existing.el.dataset.itemIndex = String(card.itemIndex);
            if (existing.itemIndex !== card.itemIndex) {
                existing.itemIndex = card.itemIndex;
                const item = itemFor(card);
                if (item) updateCardContent(existing.el, card, item);
            }
            positionCard(existing);
        }
        world.style.width = `${layout.bounds.maxX - layout.bounds.minX}px`;
        world.style.height = `${layout.bounds.maxY - layout.bounds.minY}px`;
    };

    /** 只更新内容，不动位置：元素是自定义渲染器给的时候只改文本节点可能不适用，所以整块替换子节点。 */
    const updateCardContent = (el, card, item) => {
        if (options.renderCard) return; // 自定义渲染器由调用方在 setItems 后自行重画
        const next = createPosterElement(card, item);
        el.replaceChildren(...next.childNodes);
        el.style.backgroundImage = next.style.backgroundImage;
        el.setAttribute('aria-label', next.getAttribute('aria-label') ?? item.title);
    };

    const scheduleCull = () => {
        if (cullFrame !== null) return;
        if (typeof requestAnimationFrame !== 'function') {
            applyTransform();
            render();
            return;
        }
        cullFrame = requestAnimationFrame(() => {
            cullFrame = null;
            applyTransform();
            render();
        });
    };

    // ---------------------------------------------------------------------------------------------
    // 交互：hover / click（事件委托，元素重建后无需重绑）
    // ---------------------------------------------------------------------------------------------
    let hoverKey = null;
    let focusedKey = null;

    const cardKeyFromEvent = (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return null;
        const el = target.closest('[data-wall-card]');
        return el ? el.dataset.wallCard ?? null : null;
    };

    const onPointerOver = (event) => {
        const key = cardKeyFromEvent(event);
        if (!key || key === hoverKey) return;
        hoverKey = key;
        const entry = mounted.get(key);
        if (entry) emit('card:hover', { card: entry.card, item: itemFor(entry.card), element: entry.el });
    };

    const onPointerOut = (event) => {
        const key = cardKeyFromEvent(event);
        if (!key || key !== hoverKey) return;
        // 只有真正离开该卡片（relatedTarget 不在同一张卡内）才算 leave。
        const next = event.relatedTarget;
        if (next instanceof Element && next.closest('[data-wall-card]')?.dataset.wallCard === key) return;
        hoverKey = null;
        const entry = mounted.get(key);
        if (entry) emit('card:leave', { card: entry.card, item: itemFor(entry.card), element: entry.el });
    };

    const selectCard = (key) => {
        const entry = mounted.get(key);
        if (!entry) return;
        const card = layout.cards.find(candidate => candidate.key === key) ?? entry.card;
        const item = itemFor(card);
        if (!item) return;
        emit('card:click', { card, item, element: entry.el });
        if (options.onSelect) options.onSelect(card, item);
    };

    const onClick = (event) => {
        // 拖拽后的那一次 click 由 pointer 的捕获阶段处理器吞掉（photowall/src/dom/pointer.js:149-155 的
        // onClickCapture 与 src/components/wall/useWallPointerPan.ts:128-133 一致）；这里再挡一次，防止宿主
        // 把 pointer 控制器包在别的容器里时漏过来。
        if (pointer.didDrag()) return;
        const key = cardKeyFromEvent(event);
        if (!key) return;
        applyFocusRing(key);
        selectCard(key);
    };

    // ---------------------------------------------------------------------------------------------
    // 键盘导航：方向键在已挂载卡片里找相邻项（pickAdjacentRect，src/components/wall/wallNavigation.ts:61）
    // ---------------------------------------------------------------------------------------------
    const rectOf = (card) => ({ key: card.key, x: card.x, y: card.y, width: card.width, height: card.height });

    // 焦点环（.lattice-poster.is-focused）只跟焦点 key 走，不移动相机；原实现里 isFocused 是宿主状态
    // （LatticePoster.tsx:239 的 className 拼装），handleClick 也从不碰相机（LatticePoster.tsx:201-209）。
    const applyFocusRing = (key) => {
        focusedKey = key;
        for (const [otherKey, other] of mounted) {
            if (otherKey === key) other.el.classList.add('is-focused');
            else other.el.classList.remove('is-focused');
        }
    };

    const focusCard = (key, scroll = true) => {
        applyFocusRing(key);
        const entry = mounted.get(key);
        if (!entry) return;
        if (scroll && typeof entry.el.focus === 'function') entry.el.focus({ preventScroll: true });
        ensureVisible(entry.card);
    };

    /** 焦点卡片被方向键推出视口时把相机跟过去：rect 居中，步进为一次 panTo 的等价物。 */
    const ensureVisible = (card) => {
        // Same centre/origin conversion as the transform above: `bounds` here are screen px.
        const screen = getWorldBounds(originCamera(), viewport);
        const pad = 120;
        if (card.x >= screen.left + pad && card.y >= screen.top + pad
            && card.x + card.width <= screen.right - pad && card.y + card.height <= screen.bottom - pad) return;
        camera.setCenter(card.x + card.width / 2, card.y + card.height / 2);
    };

    const directions = {
        ArrowRight: 'right',
        ArrowLeft: 'left',
        ArrowDown: 'down',
        ArrowUp: 'up',
    };

    const onKeyDown = (event) => {
        if (options.keyboard === false) return;
        const direction = directions[event.key];
        if (!direction) return;
        // pickAdjacentRect 的候选是 `{ value, rect }`（src/components/wall/wallNavigation.ts:61-91 的
        // 泛型参数 T 承载调用方要拿回的东西），这里 value 用卡片 key，rect 用世界坐标矩形。
        const list = [...mounted.values()].map(entry => ({ value: entry.card.key, rect: rectOf(entry.card) }));
        if (!list.length) return;
        const sourceKey = focusedKey ?? hoverKey ?? list[0].value;
        const source = (list.find(card => card.value === sourceKey) ?? list[0]).rect;
        const next = pickAdjacentRect(source, list, direction, layout.metrics ?? { cellSize: CELL_SIZE, gap: GAP });
        if (!next) return;
        event.preventDefault();
        focusCard(next);
    };

    // ---------------------------------------------------------------------------------------------
    // 指针控制器（pan / wheel / 惯性）+ 可选的队列拖拽排序
    // ---------------------------------------------------------------------------------------------
    const pointer = createPointerController({
        container: field,
        camera,
        // 相机键盘（Home/End/方向键平移）交给下面的卡片焦点逻辑，避免两个 keydown 处理器抢键。
        keyboard: false,
        onReorder: (drag) => {
            emit('reorder', drag);
            if (options.onReorder) options.onReorder(drag);
        },
        getRowContainer: options.queue?.getRowContainer,
        rowHeight: options.queue?.rowHeight,
    });
    pointer.attach();

    let queuePointerDown = null;
    if (options.queue) {
        // 队列岛的行在墙内部（root 之下），行上的 pointerdown 交给 queueDrag 几何（queueDragGeometry.ts）。
        queuePointerDown = (event) => {
            const target = event.target;
            if (!(target instanceof Element)) return;
            const row = target.closest('[data-queue-index]');
            if (!row) return;
            const scroll = options.queue.getRowContainer?.();
            const index = Number(row.dataset.queueIndex);
            if (!Number.isFinite(index)) return;
            const box = (scroll ?? row).getBoundingClientRect();
            pointer.beginQueueDrag({
                index,
                rowCount: options.queue.getRowCount?.() ?? 0,
                pointerY: event.clientY,
                containerTop: box.top,
                containerBottom: box.bottom,
                scrollTop: scroll?.scrollTop ?? 0,
            });
        };
        field.addEventListener('pointerdown', queuePointerDown);
    }

    // ---------------------------------------------------------------------------------------------
    // 焦点样式与全局事件
    // ---------------------------------------------------------------------------------------------
    const onFocusIn = (event) => {
        const key = cardKeyFromEvent(event);
        if (key) focusCard(key, false);
    };

    field.addEventListener('pointerover', onPointerOver);
    field.addEventListener('pointerout', onPointerOut);
    field.addEventListener('click', onClick);
    field.addEventListener('keydown', onKeyDown);
    field.addEventListener('focusin', onFocusIn);

    const stopCameraListener = camera.onChange((state) => {
        applyTransform();
        emit('camera:change', { ...state, center: { x: state.x, y: state.y } });
        scheduleCull();
    });

    // 容器尺寸变化：跟随 viewsize，并按断点重设基础 scale（PosterWall.tsx:133-149）。
    let observer = null;
    if (typeof ResizeObserver === 'function') {
        observer = new ResizeObserver((entries) => {
            const box = entries[0]?.contentRect;
            if (!box || box.width < 1 || box.height < 1) return;
            api.resize({ width: Math.round(box.width), height: Math.round(box.height) }, true);
        });
        observer.observe(container);
    }

    // 每帧惯性：createCamera.update 在没有运动时返回 false，这里据此停掉 rAF 循环。
    let motionFrame = null;
    const tickMotion = (last) => {
        if (destroyed) return;
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const dt = Math.min(50, now - last);
        const moving = camera.update(dt);
        if (moving) motionFrame = requestAnimationFrame(() => tickMotion(now));
        else motionFrame = null;
    };
    const startMotion = () => {
        if (motionFrame !== null || typeof requestAnimationFrame !== 'function') return;
        const now = typeof performance !== 'undefined' ? performance.now() : Date.now();
        motionFrame = requestAnimationFrame(() => tickMotion(now));
    };
    const stopCameraListenerWithMotion = camera.onChange(() => startMotion());

    // ---------------------------------------------------------------------------------------------
    // 公共 API（CONTRACT.md §4.3 冻结）
    // ---------------------------------------------------------------------------------------------
    const api = {
        /** setLayout(layout)：换一份布局（队列变化时重建），相机范围随之更新。 */
        setLayout(nextLayout) {
            layout = nextLayout;
            camera.setBounds(layout.bounds);
            // 布局里已经不存在的卡片立即卸掉，避免残留 key 骗过裁剪。
            const known = new Set(layout.cards.map(card => card.key));
            for (const [key, entry] of [...mounted]) {
                if (!known.has(key)) {
                    entry.el.remove();
                    mounted.delete(key);
                }
            }
            applyTransform();
            render();
            return api;
        },
        /** setItems(items)：卡片内容变化；itemIndex 是 layout.cards 里的下标。 */
        setItems(nextItems) {
            items = nextItems ?? [];
            for (const entry of mounted.values()) {
                const item = itemFor(entry.card);
                if (item) updateCardContent(entry.el, entry.card, item);
            }
            return api;
        },
        /**
         * resize({width,height})：更新视口。autoScale 为 true（容器自身尺寸变化）时按
         * getScale(width) 重设基础缩放，用户手动缩放的倍率会保留在 camera 里。
         */
        resize(next, autoScale = false) {
            viewport = { width: Math.max(1, next.width), height: Math.max(1, next.height) };
            camera.setViewport(viewport);
            if (autoScale) camera.setScale(getScale(viewport.width));
            applyTransform();
            render();
            return api;
        },
        /** on(name, handler) -> unsubscribe。name ∈ card:click | card:hover | card:leave | camera:change | reorder。 */
        on,
        /** getCamera()：直接暴露 createCamera 的实例，便于外部做 panTo / setCenter。 */
        getCamera: () => camera,
        /** 焦点卡片的 key（没有卡片获得过焦点时为 null）。 */
        getFocusedKey: () => focusedKey,
        /** 当前已挂载的卡片数，测试用。 */
        getMountedCount: () => mounted.size,
        /** 内部用：React 适配层更新 .lattice-root 上的状态类名（is-daylight / is-lights-out ...）。 */
        setRootClass(value) {
            if (typeof value === 'string' && value) root.className = value;
            return api;
        },
        /** 内部用：把相机推出的惯性循环重新拉起来（宿主调用 camera.panBy 之后）。 */
        kick: startMotion,
        destroy() {
            destroyed = true;
            if (observer) observer.disconnect();
            if (motionFrame !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(motionFrame);
            if (cullFrame !== null && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(cullFrame);
            stopCameraListener();
            stopCameraListenerWithMotion();
            pointer.destroy();
            field.removeEventListener('pointerover', onPointerOver);
            field.removeEventListener('pointerout', onPointerOut);
            field.removeEventListener('click', onClick);
            field.removeEventListener('keydown', onKeyDown);
            field.removeEventListener('focusin', onFocusIn);
            if (queuePointerDown) field.removeEventListener('pointerdown', queuePointerDown);
            mounted.clear();
            handlers.clear();
            if (ownsCamera) camera.destroy();
            else camera.stop();
            root.remove();
        },
    };

    applyTransform();
    render();
    return api;
}; __ret.createWall = createWall;

__ret.default = createWall;

});

// ---- index.js ----------------------------------------------------------
__def("index.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/* + src/components/app/lattice/{PosterWall,Lattice}.tsx (barrel)
// Fidelity: authored-glue
// Module: photowall

// 照片墙模块的公共入口。CONTRACT.md §4（第 105-111 行）把下面这几行冻结成了模块的唯一公共面：
// 调用方只从这里取东西（集成方的宿主页面、各种烟雾/几何探针）。这里刻意不多导出任何名字——多一个导出就是多一个
// 需要长期维持的接口。其余东西（所有 planner、常量、几何）都在 `./core/index.js` 里，
// 需要更宽的面的调用方（自定义渲染器、几何探针、精确覆盖测试）直接从那个文件或各自模块 import。
//
// The wall's own gesture/metrics constants also live on their modules, not here:
//   dom/pointer.js  -> DRAG_THRESHOLD_PX, CULL_EDGE_MARGIN_PX, WHEEL_LATCH_MS, LATCH_MOVE_PX
//   dom/createWall.js -> CELL_SIZE, GAP, OVERSCAN, METRICS, EXPANDED_SIZE, getScale, getWorldBounds
//   dom/camera.js   -> prefersReducedMotion

const __ns$core_index_js = __req("core/index.js"); __ret["buildWallLayout"] = __ns$core_index_js.buildWallLayout; __ret["BLOCK_COLS"] = __ns$core_index_js.BLOCK_COLS; __ret["BLOCK_ROWS"] = __ns$core_index_js.BLOCK_ROWS; __ret["SLOTS_PER_BLOCK"] = __ns$core_index_js.SLOTS_PER_BLOCK; __ret["MAX_RENDERED_INSTANCES"] = __ns$core_index_js.MAX_RENDERED_INSTANCES;;
const __ns$dom_camera_js = __req("dom/camera.js"); __ret["createCamera"] = __ns$dom_camera_js.createCamera;;
const __ns$dom_createWall_js = __req("dom/createWall.js"); __ret["createWall"] = __ns$dom_createWall_js.createWall;;
const __ns$dom_pointer_js = __req("dom/pointer.js"); __ret["createPointerController"] = __ns$dom_pointer_js.createPointerController;;

});

// ---- motion/wallReflowMotion.js ----------------------------------------
__def("motion/wallReflowMotion.js", function (__ret) {
// Language: JavaScript
// Ported from: src/components/wall/wallReflowMotion.ts (lines 1-60)
// Fidelity: adapted-port
// Module: photowall / motion

// 块内让位（点开一张卡、6×6 就地展开，块里其余磁贴换位）的运动参数。原文件与 Lattice、bravais 共用一份，
// 并且 import 了 `framer-motion` 的 `spring` / `calcGeneratorDuration`（wallReflowMotion.ts:1）——那是本模块
// 唯一不能照搬的依赖，所以这里保留全部常量与全部函数签名，只把两个 framer 生成器换成等价的本地实现：
// 弹簧的解析解 + 逐毫秒推进到静止的时刻。之所以要这条曲线：Lattice 的海报是 framer 元素，x / y / 宽高直接
// 走弹簧；bravais 的磁贴外框走 CSS 过渡，所以把同一条弹簧的归一化进度曲线采样成 CSS `linear()` 缓动，
// 时长取整块宽度的位移走到静止的时刻（wallReflowMotion.ts:6）。
//
// 弹簧是线性系统：位移多大，进度曲线都同一条，只是收尾（差 ≤0.5、速度 ≤2/s 时跳到终点，wallReflowMotion.ts:7）
// 的时刻随位移略有先后——块内任何位移都不超过块宽，所以在这个时长内两边每一帧的位置相同。
//
// UNCERTAIN: the snapshot has no node_modules and no network access, so framer-motion's own
// `spring()` generator and `calcGeneratorDuration()` sources could not be read. The settle criterion
// below (restDelta 0.5 world units, restSpeed 2 units/s, 1 ms step) is taken from this file's own
// comment at wallReflowMotion.ts:7 plus the call site `calcGeneratorDuration(gen, 1)` at line 29, and
// the spring solution is the standard analytic damped-spring response for the same
// { stiffness: 300, damping: 34, mass: 1 }. Sampled positions therefore agree with framer to within
// the curve's own 4 ms step; the exact settle millisecond is NOT verified against framer.

/** 让位弹簧（mass 1）：展开的那张与让位的那些同参、同时起步、不错开，收回同参。阻尼比 34 / (2·√300) ≈ 0.98，几乎临界阻尼。WALL_REFLOW_SPRING — wallReflowMotion.ts:14 */
const WALL_REFLOW_SPRING = { type: 'spring', stiffness: 300, damping: 34 }; __ret.WALL_REFLOW_SPRING = WALL_REFLOW_SPRING;

/** 展开卡上控件行的出现：卡片起步后 140ms 起、240ms 内从下方 12px 淡入。WALL_REFLOW_CONTROLS_REVEAL — wallReflowMotion.ts:17 */
const WALL_REFLOW_CONTROLS_REVEAL = { delayMs: 140, durationMs: 240, risePx: 12 }; __ret.WALL_REFLOW_CONTROLS_REVEAL = WALL_REFLOW_CONTROLS_REVEAL;

/** 采样 linear() 缓动的间隔（毫秒）：4ms 时折线与弹簧的差在 816 单位上不到半个单位。CURVE_STEP_MS — wallReflowMotion.ts:20 */
const CURVE_STEP_MS = 4; __ret.CURVE_STEP_MS = CURVE_STEP_MS;

/** 弹簧的默认质量。wallReflowMotion.ts:22-26 只传 stiffness / damping，mass 取 framer 的默认值 1。 */
const SPRING_MASS = 1;
/** 静止判据（wallReflowMotion.ts:7）：与目标差 ≤ 0.5 个世界单位、速度 ≤ 2 单位/秒时算走到静止。 */
const REST_DELTA = 0.5;
/** 静止判据的速度阈值：2 单位/秒。wallReflowMotion.ts:7 */
const REST_SPEED = 2;
/** 逐毫秒推进的上限，防止极端参数下不收敛（正常参数下 300/34 约在 1 秒内静止）。 */
const MAX_SETTLE_MS = 20000;
/** 数值求速度用的差分步长（毫秒）。 */
const VELOCITY_SAMPLE_MS = 1;

/**
 * 归一化弹簧进度 p(t) ∈ [0,1]：从 0 静止起步、目标 1、mass 1 的阻尼弹簧解析解。
 * p(t) = 1 − e^(−ζωₙt) (cos(ω_d t) + ζωₙ/ω_d · sin(ω_d t))，ζ < 1（欠阻尼）；
 * p(t) = 1 − e^(−ζωₙt) (cosh(ω_d t) + ζωₙ/ω_d · sinh(ω_d t))，ζ > 1（过阻尼）；
 * p(t) = 1 − (1 + ωₙt) e^(−ωₙt)，ζ = 1（临界阻尼）。
 * @param {number} elapsedMs
 * @returns {number}
 */
const springProgress = (elapsedMs) => {
    const { stiffness, damping } = WALL_REFLOW_SPRING;
    const omega = Math.sqrt(stiffness / SPRING_MASS);                        // 固有频率（rad/s）
    const zeta = damping / (2 * Math.sqrt(stiffness * SPRING_MASS));         // 阻尼比
    const t = elapsedMs / 1000;
    const decay = Math.exp(-zeta * omega * t);
    if (Math.abs(zeta - 1) < 1e-9) return 1 - (1 + omega * t) * decay;
    if (zeta < 1) {
        const damped = omega * Math.sqrt(1 - zeta * zeta);
        return 1 - decay * (Math.cos(damped * t) + ((zeta * omega) / damped) * Math.sin(damped * t));
    }
    const damped = omega * Math.sqrt(zeta * zeta - 1);
    return 1 - decay * (Math.cosh(damped * t) + ((zeta * omega) / damped) * Math.sinh(damped * t));
};

/** 弹簧在 t 时刻的位移（世界单位）：归一化进度乘距离。对应 framer 的 `generator.next(t).value`。 */
const springValueAt = (elapsedMs, span) => springProgress(elapsedMs) * span;

/** 位移的数值速度（单位/秒），对应 framer 用来判静止的速度。 */
const springSpeedAt = (elapsedMs, span) => Math.abs(springValueAt(elapsedMs + VELOCITY_SAMPLE_MS, span) - springValueAt(elapsedMs, span)) / (VELOCITY_SAMPLE_MS / 1000);

/**
 * 把位移 span 走到静止的毫秒数。原实现是 `calcGeneratorDuration(generator, 1)`（wallReflowMotion.ts:29）：
 * 从 0 起按 1ms 步进，直到生成器报告 done。这里用同一套静止判据逐毫秒找那个时刻。
 * @param {number} span  正数，世界单位
 * @returns {number}
 */
const settleMs = (span) => {
    for (let time = 0; time <= MAX_SETTLE_MS; time += 1) {
        if (span - springValueAt(time, span) <= REST_DELTA && springSpeedAt(time, span) <= REST_SPEED) return time;
    }
    return MAX_SETTLE_MS;
};

/**
 * framer 用这条弹簧把位移 distance（世界单位）走到静止的毫秒数——与 Lattice 上这段动画收尾的时刻相同。
 * 距离取绝对值并至少为 1（wallReflowMotion.ts:29 的 `Math.max(Math.abs(distance), 1)`）。
 * wallReflowSettleMs — wallReflowMotion.ts:29
 * @param {number} distance
 * @returns {number} 毫秒
 */
const wallReflowSettleMs = (distance) => settleMs(Math.max(Math.abs(distance), 1)); __ret.wallReflowSettleMs = wallReflowSettleMs;

/**
 * @typedef {Object} WallReflowCurve
 * @property {number} durationMs
 * @property {string} css                 形如 `linear(0, 0.12, ...)`，末点恰为 1
 * @property {(progress: number) => number} ease  按同一组点线性插值的 JS 缓动
 */

/**
 * 以位移 distance 走到静止的时长为准，把弹簧的归一化进度均匀采样成折线（首点 0、末点 1）。给 CSS 过渡用：
 * `transition: <prop> ${durationMs}ms ${css}`；JS 侧按 `ease` 推算同一条过渡此刻的进度。
 * createWallReflowCurve — wallReflowMotion.ts:42-60
 * @param {number} distance
 * @returns {WallReflowCurve}
 */
const createWallReflowCurve = (distance) => {
    const span = Math.max(Math.abs(distance), 1);
    const durationMs = wallReflowSettleMs(span);
    const count = Math.max(Math.round(durationMs / CURVE_STEP_MS), 2) + 1;
    const points = Array.from({ length: count }, (_, index) => {
        if (index === count - 1) return 1;
        return Math.round((springValueAt((durationMs * index) / (count - 1), span) / span) * 1e5) / 1e5;
    });
    const ease = (progress) => {
        if (progress <= 0) return points[0];
        if (progress >= 1) return 1;
        const position = progress * (count - 1);
        const index = Math.floor(position);
        const from = points[index];
        return from + (points[index + 1] - from) * (position - index);
    };
    return { durationMs, css: `linear(${points.join(', ')})`, ease };
}; __ret.createWallReflowCurve = createWallReflowCurve;

});

// ---------------------------------------------------------------------------
// 公共面：只有这两个赋值会离开 IIFE
// ---------------------------------------------------------------------------
window.FOLIA_WALL_CSS = __assets['styles/wall.css'];
var __api = __req("index.js");
var __extra = __req("dom/createWall.js");
window.FoliaWall = {
    buildWallLayout: __api.buildWallLayout,
    createCamera: __api.createCamera,
    createWall: __api.createWall,
    createPointerController: __api.createPointerController,
    BLOCK_COLS: __api.BLOCK_COLS,
    BLOCK_ROWS: __api.BLOCK_ROWS,
    SLOTS_PER_BLOCK: __api.SLOTS_PER_BLOCK,
    MAX_RENDERED_INSTANCES: __api.MAX_RENDERED_INSTANCES,
    CELL_SIZE: __extra.CELL_SIZE,
    GAP: __extra.GAP,
    METRICS: __extra.METRICS,
    INITIAL_CAMERA: __extra.INITIAL_CAMERA,
    INITIAL_VIEWPORT: __extra.INITIAL_VIEWPORT,
    getScale: __extra.getScale,
    createPosterElement: __extra.createPosterElement,
    fallbackBackground: __extra.fallbackBackground,
};

})();
