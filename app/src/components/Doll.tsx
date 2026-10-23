import type { ReactNode } from 'react'
import { THEMES } from '../data/config'
import { ITEM_BY_ID } from '../data/items'
import type { Item, Outfit, Pattern, Slot, ThemeId } from '../types'

/**
 * Chibi-style placeholder vector art. Each item renders as z-ordered layers in a shared
 * coordinate space, so real PNG layers could replace these without changing the Doll API.
 */
type Layer = [z: number, node: ReactNode]

/* ---------- colour helpers ---------- */
function rgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '')
  const f = h.length === 3 ? h.replace(/./g, '$&$&') : h
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)]
}
const mix = (hex: string, to: number, t: number) => {
  const [r, g, b] = rgb(hex)
  const m = (v: number) => Math.round(v + (to - v) * t)
  return `rgb(${m(r)},${m(g)},${m(b)})`
}
const lighten = (hex: string, t = 0.3) => mix(hex, 255, t)
const darken = (hex: string, t = 0.3) => mix(hex, 0, t)

function Grad({ id, c }: { id: string; c: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={lighten(c, 0.35)} />
        <stop offset="0.55" stopColor={c} />
        <stop offset="1" stopColor={darken(c, 0.14)} />
      </linearGradient>
    </defs>
  )
}

const sparkle = (x: number, y: number, s = 6) =>
  `M${x} ${y - s} L${x + s / 3} ${y - s / 3} L${x + s} ${y} L${x + s / 3} ${y + s / 3} L${x} ${y + s} L${x - s / 3} ${y + s / 3} L${x - s} ${y} L${x - s / 3} ${y - s / 3} Z`

/** Scalloped (wavy) edge from (x0,y) to (x1,y), bumps hang downwards. */
function scallop(x0: number, x1: number, y: number, n: number, depth: number) {
  let d = ''
  for (let k = 0; k < n; k++) {
    const a = x0 + ((x1 - x0) * k) / n
    const b = x0 + ((x1 - x0) * (k + 1)) / n
    d += ` Q${(a + b) / 2} ${y + depth} ${b} ${y}`
  }
  return d
}

const heartPath = (x: number, y: number, s = 1) =>
  `M${x} ${y - 3 * s} C${x - 3 * s} ${y - 10 * s} ${x - 12 * s} ${y - 7 * s} ${x - 10 * s} ${y} C${x - 8 * s} ${y + 6 * s} ${x} ${y + 10 * s} ${x} ${y + 10 * s} C${x} ${y + 10 * s} ${x + 8 * s} ${y + 6 * s} ${x + 10 * s} ${y} C${x + 12 * s} ${y - 7 * s} ${x + 3 * s} ${y - 10 * s} ${x} ${y - 3 * s} Z`

const starPath = (cx: number, cy: number, r: number) => {
  let d = ''
  for (let k = 0; k < 10; k++) {
    const rad = k % 2 ? r * 0.45 : r
    const a = -Math.PI / 2 + (k * Math.PI) / 5
    d += `${k ? 'L' : 'M'}${(cx + rad * Math.cos(a)).toFixed(1)} ${(cy + rad * Math.sin(a)).toFixed(1)} `
  }
  return d + 'Z'
}

/** Staggered points covering the skirt area; patterns are clipped to the dress outline. */
const PATTERN_POINTS: [number, number][] = []
for (let row = 0; row < 6; row++) {
  for (let x = 30 + (row % 2) * 11; x <= 172; x += 22) PATTERN_POINTS.push([x, 160 + row * 18])
}

function patternFor(pattern: Pattern): ReactNode {
  switch (pattern) {
    case 'stars':
      return PATTERN_POINTS.map(([x, y]) => <path key={`${x}-${y}`} d={sparkle(x, y, 6)} fill="#fff" fillOpacity=".95" />)
    case 'dots':
      return PATTERN_POINTS.map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#fff" fillOpacity=".85" />)
    case 'hearts':
      return PATTERN_POINTS.map(([x, y]) => <path key={`${x}-${y}`} d={heartPath(x, y, 0.5)} fill="#fff" fillOpacity=".9" />)
    case 'flowers':
      return PATTERN_POINTS.map(([x, y]) => (
        <g key={`${x}-${y}`}>
          {[0, 72, 144, 216, 288].map((a) => (
            <circle key={a} cx={x + 4 * Math.cos((a * Math.PI) / 180)} cy={y + 4 * Math.sin((a * Math.PI) / 180)} r="3" fill="#fff" fillOpacity=".9" />
          ))}
          <circle cx={x} cy={y} r="2.2" fill="#ffd447" />
        </g>
      ))
    case 'stripes':
      return Array.from({ length: 14 }, (_, k) => <rect key={k} x="0" y={150 + k * 9} width="200" height="4" fill="#fff" fillOpacity=".55" />)
  }
}

interface DressParts {
  /** Outline used to clip the pattern. */
  clip: string
  body: ReactNode
}

function dressParts(shape: string, c: string, fill: string, line: string): DressParts {
  const stroke = { stroke: line, strokeWidth: 2.2, strokeLinejoin: 'round' as const }
  const bodice = 'M76 144 L124 144 L120 188 L80 188 Z'
  const puffSleeves = (
    <>
      <ellipse cx="70" cy="154" rx="14" ry="12" fill={fill} {...stroke} />
      <ellipse cx="130" cy="154" rx="14" ry="12" fill={fill} {...stroke} />
    </>
  )
  const ribbon = (y: number) => (
    <>
      <path d={`M78 ${y} Q100 ${y + 10} 122 ${y} L122 ${y + 8} Q100 ${y + 18} 78 ${y + 8} Z`} fill="#fff" fillOpacity=".75" />
      <path d={heartPath(100, y + 6, 0.55)} fill={lighten(c, 0.5)} stroke={line} strokeWidth="1.5" />
    </>
  )
  switch (shape) {
    case 'ballgown': {
      const skirt = `M80 184 L120 184 Q170 206 172 252${scallop(172, 28, 252, 8, 9)} Q30 206 80 184 Z`
      return {
        clip: skirt,
        body: (
          <>
            <path d={skirt} fill={fill} {...stroke} />
            <path d="M86 192 L114 192 Q148 214 150 246 L50 246 Q52 214 86 192 Z" fill="#fff" fillOpacity=".22" />
            <path d={bodice} fill={fill} {...stroke} />
            {puffSleeves}
            {ribbon(182)}
          </>
        ),
      }
    }
    case 'tiered': {
      const t1 = `M78 184 L122 184 L132 208${scallop(132, 68, 208, 5, 7)} Z`
      const t2 = `M70 204 L130 204 L144 230${scallop(144, 56, 230, 6, 7)} Z`
      const t3 = `M58 226 L142 226 L158 254${scallop(158, 42, 254, 7, 8)} Z`
      return {
        clip: 'M76 144 L124 144 L122 184 L160 262 L40 262 L78 184 Z',
        body: (
          <>
            <path d={t3} fill={lighten(c, 0.25)} {...stroke} />
            <path d={t2} fill={fill} {...stroke} />
            <path d={t1} fill={lighten(c, 0.25)} {...stroke} />
            <path d={bodice} fill={fill} {...stroke} />
            {ribbon(180)}
          </>
        ),
      }
    }
    case 'tutu': {
      let zig = 'M74 188 L126 188 L162 204'
      for (let x = 162, k = 0; x >= 38; x -= 8, k++) zig += ` L${x} ${k % 2 ? 206 : 218}`
      zig += ' Z'
      return {
        clip: zig,
        body: (
          <>
            <path d={zig} transform="translate(0 -5)" fill={lighten(c, 0.45)} {...stroke} />
            <path d={zig} fill={fill} {...stroke} />
            <path d="M78 144 L122 144 L124 196 L76 196 Z" fill={fill} {...stroke} />
            {ribbon(184)}
          </>
        ),
      }
    }
    case 'puff': {
      const d = 'M78 144 L122 144 L122 186 L146 246 L54 246 L78 186 Z'
      return {
        clip: d,
        body: (
          <>
            <path d={d} fill={fill} {...stroke} />
            {puffSleeves}
            <ellipse cx="91" cy="149" rx="11" ry="7" fill="#fff" {...stroke} strokeWidth={1.6} />
            <ellipse cx="109" cy="149" rx="11" ry="7" fill="#fff" {...stroke} strokeWidth={1.6} />
            <path d="M56 240 L144 240" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          </>
        ),
      }
    }
    case 'overall': {
      const d = 'M84 158 L116 158 L116 186 L122 186 L140 242 L60 242 L78 186 L84 186 Z'
      return {
        clip: d,
        body: (
          <>
            <path d="M74 144 L126 144 L140 176 L126 182 L126 196 L74 196 L74 182 L60 176 Z" fill="#fff" stroke="#c9b6e0" strokeWidth="2" strokeLinejoin="round" />
            <path d={d} fill={fill} {...stroke} />
            <path d="M86 158 L82 144 M114 158 L118 144" stroke={line} strokeWidth="8" strokeLinecap="round" />
            <path d="M86 158 L82 144 M114 158 L118 144" stroke={c} strokeWidth="5" strokeLinecap="round" />
            <circle cx="88" cy="163" r="3" fill="#ffd447" stroke={line} />
            <circle cx="112" cy="163" r="3" fill="#ffd447" stroke={line} />
            <rect x="92" y="168" width="16" height="12" rx="3" fill={lighten(c, 0.3)} stroke={line} strokeWidth="1.5" />
          </>
        ),
      }
    }
    case 'aodai': {
      const front = 'M78 144 L122 144 L124 198 L126 262 L74 262 L76 198 Z'
      return {
        clip: front,
        body: (
          <>
            {/* white trousers */}
            <path d="M80 204 L120 204 L121 262 L102 262 L100 232 L98 262 L79 262 Z" fill="#fff" stroke="#c9b6e0" strokeWidth="2" />
            {/* back panels peeking out at the side slits */}
            <path d="M76 198 L80 198 L72 262 L60 262 Z M124 198 L120 198 L128 262 L140 262 Z" fill={darken(c, 0.12)} {...stroke} />
            {/* long sleeves */}
            <line x1="76" y1="152" x2="60" y2="204" stroke={line} strokeWidth="15" strokeLinecap="round" />
            <line x1="124" y1="152" x2="140" y2="204" stroke={line} strokeWidth="15" strokeLinecap="round" />
            <line x1="76" y1="152" x2="60" y2="204" stroke={c} strokeWidth="11" strokeLinecap="round" />
            <line x1="124" y1="152" x2="140" y2="204" stroke={c} strokeWidth="11" strokeLinecap="round" />
            <path d={front} fill={fill} {...stroke} />
            <rect x="90" y="144" width="20" height="9" rx="4" fill={fill} {...stroke} />
            <path d="M100 144 Q112 150 124 148" stroke={line} strokeWidth="1.6" fill="none" />
          </>
        ),
      }
    }
    default: {
      const d: Record<string, string> = {
        princess: 'M74 144 L126 144 L122 186 L166 258 L34 258 L78 186 Z',
        aline: 'M74 144 L126 144 L122 192 L154 254 L46 254 L78 192 Z',
        sundress: 'M82 144 L90 144 L100 158 L110 144 L118 144 L124 192 L150 250 L50 250 L76 192 Z',
      }
      const path = d[shape] ?? d.aline
      return {
        clip: path,
        body: (
          <>
            <path d={path} fill={fill} {...stroke} />
            <path d="M86 204 L68 252 M100 206 L100 254 M114 204 L132 252" stroke={line} strokeOpacity=".22" strokeWidth="2" fill="none" />
            {ribbon(188)}
          </>
        ),
      }
    }
  }
}

function layersFor(item: Item): Layer[] {
  const c = item.color
  const gid = `g-${item.id}`
  const line = darken(c, 0.42)
  const fill = `url(#${gid})`
  const P = ({ d, extra }: { d: string; extra?: object }) => (
    <path d={d} fill={fill} stroke={line} strokeWidth={2.2} strokeLinejoin="round" strokeLinecap="round" {...extra} />
  )
  const defs = <Grad key="defs" id={gid} c={c} />

  switch (item.slot) {
    case 'hair': {
      const back: Record<string, string> = {
        long: 'M38 92 Q32 34 100 30 Q168 34 162 92 L172 238 Q100 266 28 238 Z',
        bob: 'M38 92 Q32 34 100 30 Q168 34 162 92 L168 152 Q100 176 32 152 Z',
        ponytail: 'M40 90 Q36 36 100 32 Q164 36 160 90 Q150 60 100 58 Q50 60 40 90 Z M140 62 Q204 66 190 176 Q176 118 134 98 Z',
        pigtails:
          'M42 76 Q-2 98 22 196 Q52 164 58 108 Z M158 76 Q202 98 178 196 Q148 164 142 108 Z M40 90 Q36 36 100 32 Q164 36 160 90 Z',
        bun: 'M40 90 Q36 36 100 32 Q164 36 160 90 Z',
      }
      const front =
        'M40 98 Q34 34 100 32 Q166 34 160 98 Q152 62 122 68 Q100 48 78 68 Q48 62 40 98 Z M40 98 Q34 124 44 146 Q56 124 58 96 Z M160 98 Q166 124 156 146 Q144 124 142 96 Z'
      return [
        [1, <g key="b">{defs}<P d={back[item.shape] ?? back.long} /></g>],
        [
          8,
          <g key="f">
            <P d={front} />
            <path d="M66 46 Q88 34 116 38" stroke="#fff" strokeOpacity=".6" strokeWidth="5" fill="none" strokeLinecap="round" />
          </g>,
        ],
        ...(item.shape === 'bun'
          ? ([[8, <g key="u"><circle cx="100" cy="26" r="21" fill={fill} stroke={line} strokeWidth="2.2" /><path d="M88 18 Q98 10 110 14" stroke="#fff" strokeOpacity=".6" strokeWidth="4" fill="none" strokeLinecap="round" /></g>]] as Layer[])
          : []),
        ...(item.shape === 'pigtails'
          ? ([[8, <g key="ties"><circle cx="48" cy="82" r="7" fill="#ff7fb0" stroke={line} /><circle cx="152" cy="82" r="7" fill="#ff7fb0" stroke={line} /></g>]] as Layer[])
          : []),
      ]
    }
    case 'top': {
      const d: Record<string, string> = {
        tee: 'M74 144 L126 144 L144 182 L126 188 L126 214 L74 214 L74 188 L56 182 Z',
        tank: 'M80 144 L120 144 L128 214 L72 214 Z',
        jacket: 'M72 144 L128 144 L148 196 L128 202 L128 216 L72 216 L72 202 L52 196 Z',
      }
      return [
        [
          5,
          <g key="t">
            {defs}
            <P d={d[item.shape] ?? d.tee} />
            {item.shape === 'jacket' && <path d="M100 146 L100 216" stroke={line} strokeWidth="2.4" />}
            <path d="M86 156 Q100 164 114 156" stroke="#fff" strokeOpacity=".5" strokeWidth="3" fill="none" strokeLinecap="round" />
          </g>,
        ],
      ]
    }
    case 'bottom': {
      const d: Record<string, string> = {
        skirt: 'M74 208 L126 208 L152 260 L48 260 Z',
        shorts: 'M74 208 L126 208 L128 244 L102 244 L100 230 L98 244 L72 244 Z',
        pants: 'M74 208 L126 208 L124 268 L103 268 L100 232 L97 268 L76 268 Z',
      }
      return [[4, <g key="b">{defs}<P d={d[item.shape] ?? d.skirt} /></g>]]
    }
    case 'dress': {
      const parts = dressParts(item.shape, c, fill, line)
      const clipId = `c-${gid}`
      return [
        [
          6,
          <g key="d">
            {defs}
            <defs>
              <clipPath id={clipId}>
                <path d={parts.clip} />
              </clipPath>
            </defs>
            {parts.body}
            {item.pattern && <g clipPath={`url(#${clipId})`}>{patternFor(item.pattern)}</g>}
          </g>,
        ],
      ]
    }
    case 'shoes': {
      const body =
        item.shape === 'sneakers' ? (
          <>
            <ellipse cx="88" cy="270" rx="19" ry="10" fill={fill} stroke={line} strokeWidth="2.2" />
            <ellipse cx="112" cy="270" rx="19" ry="10" fill={fill} stroke={line} strokeWidth="2.2" />
            <path d="M70 274 H106 M94 274 H130" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : item.shape === 'boots' ? (
          <>
            <path d="M78 238 L97 238 L99 272 L72 276 L72 262 L78 262 Z" fill={fill} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M122 238 L103 238 L101 272 L128 276 L128 262 L122 262 Z" fill={fill} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
          </>
        ) : (
          <>
            <path d="M78 262 L98 262 L98 274 L70 276 Z" fill={fill} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M122 262 L102 262 L102 274 L130 276 Z" fill={fill} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
          </>
        )
      return [[3, <g key="s">{defs}{body}</g>]]
    }
    case 'head': {
      const m: Record<string, ReactNode> = {
        crown: (
          <g>
            <P d="M62 52 L68 16 L86 38 L100 8 L114 38 L132 16 L138 52 Z" />
            <rect x="62" y="46" width="76" height="9" rx="4" fill="#ffd447" stroke={line} strokeWidth="2" />
            <circle cx="100" cy="24" r="4.5" fill="#ff5f9d" />
            <circle cx="72" cy="38" r="3.5" fill="#6cc8f5" />
            <circle cx="128" cy="38" r="3.5" fill="#6cc8f5" />
          </g>
        ),
        bow: (
          <g>
            <P d="M142 54 L116 40 L116 68 Z" />
            <P d="M142 54 L172 38 L172 70 Z" />
            <circle cx="142" cy="54" r="8" fill={fill} stroke={line} strokeWidth="2.2" />
          </g>
        ),
        flower: (
          <g>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="64" cy="44" rx="8" ry="12" fill={fill} stroke={line} strokeWidth="1.8" transform={`rotate(${a} 64 56)`} />
            ))}
            <circle cx="64" cy="56" r="7" fill="#ffd447" stroke={line} strokeWidth="1.8" />
          </g>
        ),
        catears: (
          <g>
            <P d="M48 66 L52 14 L96 44 Z" />
            <P d="M152 66 L148 14 L104 44 Z" />
            <path d="M58 46 L60 28 L78 42 Z M142 46 L140 28 L122 42 Z" fill="#ffb3c8" />
          </g>
        ),
        bunnyears: (
          <g>
            <ellipse cx="74" cy="-2" rx="15" ry="44" fill={fill} stroke={line} strokeWidth="2.2" transform="rotate(-10 74 40)" />
            <ellipse cx="126" cy="-2" rx="15" ry="44" fill={fill} stroke={line} strokeWidth="2.2" transform="rotate(10 126 40)" />
            <ellipse cx="74" cy="0" rx="7" ry="30" fill="#ffb3c8" transform="rotate(-10 74 40)" />
            <ellipse cx="126" cy="0" rx="7" ry="30" fill="#ffb3c8" transform="rotate(10 126 40)" />
          </g>
        ),
        hat: (
          <g>
            <ellipse cx="100" cy="58" rx="76" ry="15" fill={fill} stroke={line} strokeWidth="2.2" />
            <path d="M62 58 Q62 8 100 8 Q138 8 138 58 Z" fill={fill} stroke={line} strokeWidth="2.2" strokeLinejoin="round" />
            <rect x="62" y="44" width="76" height="9" fill="#e86a8c" />
          </g>
        ),
      }
      return [[9, <g key="h">{defs}{m[item.shape] ?? m.bow}</g>]]
    }
    case 'face': {
      const heart = (x: number) => (
        <path
          key={x}
          transform={`translate(${x} 100) scale(1.5)`}
          d="M0 -5 C-4 -13 -16 -9 -14 0 C-12 8 0 14 0 14 C0 14 12 8 14 0 C16 -9 4 -13 0 -5 Z"
          fill={c}
          fillOpacity=".4"
          stroke={darken(c, 0.2)}
          strokeWidth="2.4"
        />
      )
      return [
        [
          9,
          <g key="g">
            {item.shape === 'heartglasses' ? (
              <>
                {heart(76)}
                {heart(124)}
              </>
            ) : (
              <>
                <circle cx="76" cy="100" r="19" fill="#fff" fillOpacity=".25" stroke={c} strokeWidth="4" />
                <circle cx="124" cy="100" r="19" fill="#fff" fillOpacity=".25" stroke={c} strokeWidth="4" />
              </>
            )}
            <path d="M95 100 H105" stroke={c} strokeWidth="4" />
          </g>,
        ],
      ]
    }
    case 'lips': {
      const lips =
        item.shape === 'heart' ? (
          <path d={heartPath(100, 121, 0.55)} fill={c} stroke={darken(c, 0.3)} strokeWidth="1.5" />
        ) : (
          <>
            <path d="M90 124 Q100 138 110 124 Q105 128 100 126 Q95 128 90 124 Z" fill={c} stroke={darken(c, 0.3)} strokeWidth="1.5" strokeLinejoin="round" />
            <ellipse cx="104" cy="130" rx="3" ry="1.6" fill="#fff" fillOpacity=".85" />
          </>
        )
      return [[7.5, <g key="l">{lips}</g>]]
    }
    case 'blush': {
      const cheeks =
        item.shape === 'hearts'
          ? [60, 140].map((x) => <path key={x} d={heartPath(x, 114, 0.85)} fill={c} fillOpacity=".75" />)
          : [60, 140].map((x) => <ellipse key={x} cx={x} cy="116" rx="14" ry="8.5" fill={c} fillOpacity=".55" />)
      return [[7.5, <g key="bl">{cheeks}</g>]]
    }
    case 'eyeshadow':
      // A lid crescent sitting just above the lash line (face is z7).
      return [
        [
          7.2,
          <g key="es">
            {[76, 124].map((x) => (
              <g key={x}>
                <path d={`M${x - 13} 94 Q${x} 74 ${x + 13} 94 L${x + 10} 95 Q${x} 82 ${x - 10} 95 Z`} fill={c} fillOpacity={item.shape === 'soft' ? 0.6 : 0.8} />
                {item.shape === 'shimmer' && (
                  <>
                    <path d={sparkle(x - 8, 82, 3.5)} fill="#fff" />
                    <path d={sparkle(x + 9, 86, 2.5)} fill="#fff" />
                  </>
                )}
              </g>
            ))}
          </g>,
        ],
      ]
    case 'sticker': {
      const edge = darken(c, 0.35)
      const m: Record<string, ReactNode> = {
        star: <path d={starPath(146, 134, 9)} fill={c} stroke={edge} strokeWidth="1.5" strokeLinejoin="round" />,
        heart: <path d={heartPath(58, 132, 0.7)} fill={c} stroke={edge} strokeWidth="1.2" />,
        crown: <path d="M136 140 L137 128 L142 133 L146 125 L150 133 L155 128 L156 140 Z" fill={c} stroke={edge} strokeWidth="1.5" strokeLinejoin="round" />,
        rainbow: (
          <g fill="none" strokeWidth="3.2" strokeLinecap="round">
            <path d="M44 140 Q58 120 72 140" stroke="#ff6b6b" />
            <path d="M48 140 Q58 126 68 140" stroke="#ffd447" />
            <path d="M52 140 Q58 132 64 140" stroke="#6cc8f5" />
          </g>
        ),
        butterfly: (
          <g>
            <ellipse cx="139" cy="130" rx="7" ry="9" fill={c} fillOpacity=".85" transform="rotate(-25 139 130)" />
            <ellipse cx="153" cy="130" rx="7" ry="9" fill={c} fillOpacity=".85" transform="rotate(25 153 130)" />
            <ellipse cx="146" cy="132" rx="2" ry="7" fill={edge} />
          </g>
        ),
      }
      return [[7.6, <g key="st">{m[item.shape] ?? m.star}</g>]]
    }
    case 'back': {
      if (item.shape === 'wings')
        return [
          [
            0,
            <g key="w">
              {defs}
              <ellipse cx="32" cy="168" rx="36" ry="66" fill={fill} fillOpacity=".9" stroke={line} strokeWidth="2" transform="rotate(-24 32 168)" />
              <ellipse cx="168" cy="168" rx="36" ry="66" fill={fill} fillOpacity=".9" stroke={line} strokeWidth="2" transform="rotate(24 168 168)" />
              <ellipse cx="38" cy="176" rx="18" ry="38" fill="#fff" fillOpacity=".35" transform="rotate(-24 38 176)" />
              <ellipse cx="162" cy="176" rx="18" ry="38" fill="#fff" fillOpacity=".35" transform="rotate(24 162 176)" />
            </g>,
          ],
        ]
      if (item.shape === 'tail')
        return [[0, <g key="t">{defs}<P d="M122 206 Q200 204 190 140 Q180 192 124 194 Z" /></g>]]
      return [
        [0, <g key="bp">{defs}<rect x="66" y="142" width="68" height="78" rx="16" fill={fill} stroke={line} strokeWidth="2.2" /></g>],
        [
          7,
          <g key="st">
            <rect x="78" y="140" width="8" height="46" rx="3" fill={fill} stroke={line} strokeWidth="1.8" />
            <rect x="114" y="140" width="8" height="46" rx="3" fill={fill} stroke={line} strokeWidth="1.8" />
          </g>,
        ],
      ]
    }
  }
}

function BodyLayers({ skin, id }: { skin: string; id: string }): Layer[] {
  const gid = `skin-${id}`
  const g = `url(#${gid})`
  const edge = darken(skin.startsWith('#') ? skin : '#f6cfb0', 0.32)
  const shade = darken(skin.startsWith('#') ? skin : '#f6cfb0', 0.1)
  const arm = (side: 1 | -1) => {
    // Slightly bent arm: shoulder -> elbow -> wrist, with a small hand.
    const x = (v: number) => 100 + side * v
    const d = `M${x(24)} 150 Q${x(38)} 172 ${x(36)} 200`
    return (
      <g key={side}>
        <path d={d} stroke={edge} strokeWidth="15" strokeLinecap="round" fill="none" />
        <path d={d} stroke={g} strokeWidth="11" strokeLinecap="round" fill="none" />
        {/* hand + thumb */}
        <ellipse cx={x(36)} cy="208" rx="7.5" ry="8.5" fill={g} stroke={edge} strokeWidth="2" />
        <ellipse cx={x(30)} cy="206" rx="3" ry="4.5" fill={g} stroke={edge} strokeWidth="1.6" transform={`rotate(${side * 20} ${x(30)} 206)`} />
        <path d={`M${x(34)} 213 L${x(34)} 216 M${x(38)} 213 L${x(38.5)} 216`} stroke={edge} strokeWidth="1.2" strokeLinecap="round" />
      </g>
    )
  }
  const leg = (side: 1 | -1) => {
    const x = (v: number) => 100 + side * v
    // Tapered leg: thigh -> knee -> calf -> ankle, plus a bare foot (shoes cover it).
    const d = `M${x(3)} 206 L${x(19)} 206 Q${x(20)} 232 ${x(17)} 262 L${x(5)} 262 Q${x(2)} 232 ${x(3)} 206 Z`
    return (
      <g key={side}>
        <path d={d} fill={g} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
        <ellipse cx={x(11)} cy="236" rx="5" ry="3" fill={shade} opacity=".5" />
        <path d={`M${x(3)} 266 Q${x(10)} 258 ${x(18)} 264 Q${x(24)} 270 ${x(20)} 274 L${x(4)} 274 Q${x(1)} 270 ${x(3)} 266 Z`} fill={g} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
      </g>
    )
  }
  return [
    [-1, <ellipse key="shadow" cx="100" cy="284" rx="66" ry="10" fill="rgba(90,50,110,.18)" />],
    [
      2,
      <g key="body">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={lighten(skin, 0.22)} />
            <stop offset="1" stopColor={skin} />
          </linearGradient>
        </defs>
        {leg(-1)}
        {leg(1)}
        {arm(-1)}
        {arm(1)}
        {/* neck + torso with a gentle waist */}
        <path d="M91 128 L109 128 L110 152 L90 152 Z" fill={g} stroke={edge} strokeWidth="1.8" />
        <path d="M78 146 Q100 139 122 146 Q127 180 121 214 Q100 220 79 214 Q73 180 78 146 Z" fill={g} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
        {/* head */}
        <ellipse cx="100" cy="92" rx="58" ry="54" fill={g} stroke={edge} strokeWidth="2.2" />
      </g>,
    ],
    [
      7,
      <g key="face">
        {/* brows: thin, soft arches */}
        <path d="M65 83 Q76 76 88 80 M112 80 Q124 76 135 83" stroke="#8a5a44" strokeWidth="2.6" fill="none" strokeLinecap="round" />
        {[76, 124].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="101" rx="9.5" ry="11.5" fill="#4a2f3f" />
            <ellipse cx={x} cy="104" rx="7" ry="8" fill="#7a4a5a" opacity=".55" />
            <circle cx={x + 3.5} cy="96" r="4" fill="#fff" />
            <circle cx={x - 3} cy="107" r="1.8" fill="#fff" />
            {/* single soft lash line with a small flick on the outer corner */}
            <path
              d={x < 100 ? `M${x - 11} 97 Q${x - 5} 88 ${x + 4} 89 M${x - 11} 97 l-3 -3` : `M${x + 11} 97 Q${x + 5} 88 ${x - 4} 89 M${x + 11} 97 l3 -3`}
              stroke="#3a2030"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
        {/* tiny nose + soft cheeks */}
        <path d="M98 114 Q100 117 102 114" stroke="#d98a7a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="60" cy="116" rx="10" ry="6" fill="#ff8fa3" opacity=".32" />
        <ellipse cx="140" cy="116" rx="10" ry="6" fill="#ff8fa3" opacity=".32" />
        {/* small friendly smile */}
        <path d="M91 124 Q100 133 109 124" stroke="#c4506a" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        <path d="M95 128 Q100 132 105 128" fill="#e8798f" opacity=".7" />
      </g>,
    ],
  ]
}

interface DollProps {
  theme: ThemeId
  outfit: Outfit
  className?: string
}

export function Doll({ theme, outfit, className }: DollProps) {
  const skin = THEMES.find((t) => t.id === theme)!.skin
  const layers: Layer[] = [...BodyLayers({ skin, id: theme })]
  for (const id of Object.values(outfit)) {
    const item = id ? ITEM_BY_ID[id] : undefined
    if (item) layers.push(...layersFor(item))
  }
  layers.sort((a, b) => a[0] - b[0])
  return (
    <svg viewBox="-12 -30 224 330" className={className} role="img" aria-label="Búp bê">
      {layers.map(([z, node], i) => (
        <g key={`${z}-${i}`}>{node}</g>
      ))}
    </svg>
  )
}

const CROP: Record<Slot, string> = {
  hair: '20 14 160 150',
  head: '20 -30 160 110',
  face: '40 70 120 60',
  top: '40 130 120 100',
  bottom: '30 196 140 90',
  dress: '20 134 160 150',
  shoes: '50 232 100 60',
  back: '0 110 200 130',
  lips: '40 46 120 110',
  blush: '40 46 120 110',
  eyeshadow: '40 46 120 110',
  sticker: '40 46 120 110',
}

const MAKEUP: Slot[] = ['lips', 'blush', 'eyeshadow', 'sticker']

export function ItemThumb({ item, locked }: { item: Item; locked?: boolean }) {
  const layers = layersFor(item)
  // Makeup only makes sense on a face, so show it on the doll's head.
  if (MAKEUP.includes(item.slot)) {
    const skin = THEMES.find((t) => t.id === item.theme)!.skin
    layers.push(...BodyLayers({ skin, id: `thumb-${item.theme}` }).filter(([z]) => z >= 0))
  }
  layers.sort((a, b) => a[0] - b[0])
  return (
    <svg viewBox={CROP[item.slot]} className={locked ? 'thumb thumb-locked' : 'thumb'} aria-hidden="true">
      {layers.map(([z, node], i) => (
        <g key={`${z}-${i}`}>{node}</g>
      ))}
    </svg>
  )
}
