import type { ReactNode } from 'react'
import { THEMES } from '../data/config'
import { ITEM_BY_ID } from '../data/items'
import type { Item, Outfit, Slot, ThemeId } from '../types'

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
      const d: Record<string, string> = {
        princess: 'M74 144 L126 144 L122 186 L166 258 L34 258 L78 186 Z',
        aline: 'M74 144 L126 144 L122 192 L154 254 L46 254 L78 192 Z',
        sundress: 'M82 144 L90 144 L100 158 L110 144 L118 144 L124 192 L150 250 L50 250 L76 192 Z',
      }
      return [
        [
          6,
          <g key="d">
            {defs}
            <P d={d[item.shape] ?? d.aline} />
            <path d="M78 188 Q100 200 122 188 L122 196 Q100 208 78 196 Z" fill="#fff" fillOpacity=".7" />
            <path d="M86 204 L68 252 M100 206 L100 254 M114 204 L132 252" stroke={line} strokeOpacity=".22" strokeWidth="2" fill="none" />
            {item.shape === 'princess' && (
              <g fill="#fff" fillOpacity=".95">
                {[[58, 248], [92, 228], [140, 244], [148, 252], [114, 250], [74, 218], [128, 220]].map(([x, y]) => (
                  <path key={`${x}-${y}`} d={sparkle(x, y, 7)} />
                ))}
              </g>
            )}
            {item.shape === 'sundress' &&
              [[72, 240], [100, 226], [130, 240], [88, 210], [116, 210]].map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#fff" fillOpacity=".8" />
              ))}
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
  const edge = darken(skin.startsWith('#') ? skin : '#f6cfb0', 0.3)
  return [
    [-1, <ellipse key="shadow" cx="100" cy="284" rx="66" ry="10" fill="rgba(90,50,110,.18)" />],
    [
      2,
      <g key="body">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={lighten(skin, 0.25)} />
            <stop offset="1" stopColor={skin} />
          </linearGradient>
        </defs>
        {/* legs */}
        <rect x="82" y="206" width="16" height="62" rx="8" fill={`url(#${gid})`} stroke={edge} strokeWidth="2" />
        <rect x="102" y="206" width="16" height="62" rx="8" fill={`url(#${gid})`} stroke={edge} strokeWidth="2" />
        {/* arms and hands */}
        <line x1="76" y1="152" x2="60" y2="204" stroke={edge} strokeWidth="15" strokeLinecap="round" />
        <line x1="124" y1="152" x2="140" y2="204" stroke={edge} strokeWidth="15" strokeLinecap="round" />
        <line x1="76" y1="152" x2="60" y2="204" stroke={`url(#${gid})`} strokeWidth="11" strokeLinecap="round" />
        <line x1="124" y1="152" x2="140" y2="204" stroke={`url(#${gid})`} strokeWidth="11" strokeLinecap="round" />
        {/* torso + neck */}
        <rect x="90" y="132" width="20" height="22" fill={skin} />
        <path d="M76 144 Q100 138 124 144 L126 214 L74 214 Z" fill={`url(#${gid})`} stroke={edge} strokeWidth="2" strokeLinejoin="round" />
        {/* head */}
        <ellipse cx="100" cy="92" rx="58" ry="54" fill={`url(#${gid})`} stroke={edge} strokeWidth="2.2" />
        <ellipse cx="44" cy="100" rx="5" ry="8" fill={skin} stroke={edge} strokeWidth="1.5" />
        <ellipse cx="156" cy="100" rx="5" ry="8" fill={skin} stroke={edge} strokeWidth="1.5" />
      </g>,
    ],
    [
      7,
      <g key="face">
        <path d="M60 80 Q70 74 90 78 M110 78 Q130 74 140 80" stroke="#7a4a3a" strokeWidth="3" fill="none" strokeLinecap="round" />
        {[76, 124].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="102" rx="13" ry="16" fill="#3a2250" />
            <ellipse cx={x} cy="106" rx="11" ry="12" fill="#7c4fb5" />
            <ellipse cx={x} cy="108" rx="7" ry="8" fill="#2b1838" />
            <circle cx={x + 4} cy="96" r="5" fill="#fff" />
            <circle cx={x - 4} cy="110" r="2.4" fill="#fff" />
            <path
              d={`M${x - 14} 96 Q${x} 82 ${x + 14} 96`}
              stroke="#2b1838"
              strokeWidth="3.4"
              fill="none"
              strokeLinecap="round"
            />
            <path d={x < 100 ? `M${x - 13} 94 l-6 -4` : `M${x + 13} 94 l6 -4`} stroke="#2b1838" strokeWidth="3" strokeLinecap="round" />
          </g>
        ))}
        <path d="M98 118 Q100 121 102 118" stroke="#d98a7a" strokeWidth="2" fill="none" strokeLinecap="round" />
        <ellipse cx="58" cy="120" rx="10" ry="6" fill="#ff7f9a" opacity=".5" />
        <ellipse cx="142" cy="120" rx="10" ry="6" fill="#ff7f9a" opacity=".5" />
        <path d="M91 128 Q100 138 109 128 Q100 132 91 128 Z" fill="#e0607a" stroke="#c4506a" strokeWidth="2" strokeLinejoin="round" />
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
}

export function ItemThumb({ item, locked }: { item: Item; locked?: boolean }) {
  const layers = layersFor(item).sort((a, b) => a[0] - b[0])
  return (
    <svg viewBox={CROP[item.slot]} className={locked ? 'thumb thumb-locked' : 'thumb'} aria-hidden="true">
      {layers.map(([z, node], i) => (
        <g key={`${z}-${i}`}>{node}</g>
      ))}
    </svg>
  )
}
