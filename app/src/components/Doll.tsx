import type { ReactNode } from 'react'
import { THEMES } from '../data/config'
import { ITEM_BY_ID } from '../data/items'
import type { Item, Outfit, Slot, ThemeId } from '../types'

/**
 * Placeholder vector art. Each item renders as one or more z-ordered layers in a
 * shared 200x400 coordinate space, so real PNG layers can replace these later
 * without changing the Doll API.
 */
type Layer = [z: number, node: ReactNode]

const STROKE = 'rgba(80,40,60,.28)'

const P = ({ d, c, extra }: { d: string; c: string; extra?: object }) => (
  <path d={d} fill={c} stroke={STROKE} strokeWidth={1.5} strokeLinejoin="round" {...extra} />
)

function layersFor(item: Item): Layer[] {
  const c = item.color
  switch (item.slot) {
    case 'hair': {
      const back: Record<string, string> = {
        long: 'M58 70 Q58 20 100 20 Q142 20 142 70 L150 235 Q100 255 50 235 Z',
        bob: 'M58 70 Q58 20 100 20 Q142 20 142 70 L146 118 Q100 132 54 118 Z',
        ponytail: 'M126 40 Q168 60 160 140 Q150 100 128 78 Z',
        pigtails: 'M60 60 Q20 80 36 150 Q56 120 66 86 Z M140 60 Q180 80 164 150 Q144 120 134 86 Z',
        bun: '',
      }
      const front: Record<string, string> = {
        long: 'M60 72 Q64 24 100 24 Q136 24 140 72 Q122 48 100 48 Q78 48 60 72 Z',
        bob: 'M60 72 Q64 24 100 24 Q136 24 140 72 Q122 46 100 46 Q78 46 60 72 Z',
        ponytail: 'M60 72 Q64 24 100 24 Q136 24 140 72 Q120 48 100 48 Q80 48 60 72 Z',
        pigtails: 'M60 72 Q64 24 100 24 Q136 24 140 72 Q120 48 100 48 Q80 48 60 72 Z',
        bun: 'M60 72 Q64 24 100 24 Q136 24 140 72 Q120 48 100 48 Q80 48 60 72 Z',
      }
      return [
        [1, <P key="b" d={back[item.shape] ?? ''} c={c} />],
        [
          8,
          <g key="f">
            <P d={front[item.shape] ?? front.long} c={c} />
            {/* side locks framing the face */}
            <P d="M60 72 Q56 96 64 112 Q68 92 70 70 Z M140 72 Q144 96 136 112 Q132 92 130 70 Z" c={c} />
            {/* shine */}
            <path d="M76 38 Q92 30 110 32" stroke="#fff" strokeOpacity=".55" strokeWidth="4" fill="none" strokeLinecap="round" />
          </g>,
        ],
        ...(item.shape === 'bun' ? ([[8, <circle key="u" cx="100" cy="18" r="16" fill={c} stroke={STROKE} />]] as Layer[]) : []),
        ...(item.shape === 'pigtails'
          ? ([
              [
                8,
                <g key="ties">
                  <circle cx="64" cy="64" r="5" fill="#ff7fb0" stroke={STROKE} />
                  <circle cx="136" cy="64" r="5" fill="#ff7fb0" stroke={STROKE} />
                </g>,
              ],
            ] as Layer[])
          : []),
      ]
    }
    case 'top': {
      const d: Record<string, string> = {
        tee: 'M72 108 L128 108 L142 152 L124 158 L124 205 L76 205 L76 158 L58 152 Z',
        tank: 'M82 108 L118 108 L126 205 L74 205 Z',
        jacket: 'M70 108 L130 108 L146 170 L126 176 L126 208 L74 208 L74 176 L54 170 Z',
      }
      return [
        [
          5,
          <g key="t">
            <P d={d[item.shape] ?? d.tee} c={c} />
            {item.shape === 'jacket' && <line x1="100" y1="108" x2="100" y2="208" stroke={STROKE} strokeWidth="2" />}
          </g>,
        ],
      ]
    }
    case 'bottom': {
      const d: Record<string, string> = {
        skirt: 'M74 198 L126 198 L152 276 L48 276 Z',
        shorts: 'M74 198 L126 198 L129 252 L102 252 L100 232 L98 252 L71 252 Z',
        pants: 'M74 198 L126 198 L124 348 L103 348 L100 235 L97 348 L76 348 Z',
      }
      return [[4, <P key="b" d={d[item.shape] ?? d.skirt} c={c} />]]
    }
    case 'dress': {
      const d: Record<string, string> = {
        princess: 'M72 108 L128 108 L124 160 L178 335 L22 335 L76 160 Z',
        aline: 'M74 108 L126 108 L122 170 L160 305 L40 305 L78 170 Z',
        sundress: 'M82 108 L90 108 L100 124 L110 108 L118 108 L124 170 L152 292 L48 292 L76 170 Z',
      }
      return [
        [
          6,
          <g key="d">
            <P d={d[item.shape] ?? d.aline} c={c} />
            {/* waist ribbon */}
            <path d="M78 162 Q100 172 122 162 L122 170 Q100 180 78 170 Z" fill="#fff" fillOpacity=".65" />
            {/* skirt folds */}
            <path d="M88 180 L76 290 M100 182 L100 295 M112 180 L124 290" stroke="rgba(80,40,60,.12)" strokeWidth="2" fill="none" />
            {item.shape === 'princess' && (
              <g fill="#fff" fillOpacity=".9">
                {[
                  [60, 300],
                  [92, 250],
                  [130, 280],
                  [150, 318],
                  [110, 316],
                  [72, 214],
                  [124, 222],
                ].map(([x, y]) => (
                  <path key={`${x}-${y}`} d={`M${x} ${y - 6} L${x + 2} ${y - 2} L${x + 6} ${y} L${x + 2} ${y + 2} L${x} ${y + 6} L${x - 2} ${y + 2} L${x - 6} ${y} L${x - 2} ${y - 2} Z`} />
                ))}
              </g>
            )}
            {item.shape === 'sundress' &&
              [
                [70, 270],
                [100, 250],
                [130, 272],
                [86, 220],
                [116, 214],
              ].map(([x, y]) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5" fill="#fff" fillOpacity=".75" />)}
          </g>,
        ],
      ]
    }
    case 'shoes': {
      const body =
        item.shape === 'sneakers' ? (
          <>
            <ellipse cx="88" cy="372" rx="17" ry="9" fill={c} stroke={STROKE} />
            <ellipse cx="112" cy="372" rx="17" ry="9" fill={c} stroke={STROKE} />
            <rect x="72" y="376" width="32" height="4" rx="2" fill="#fff" stroke={STROKE} />
            <rect x="96" y="376" width="32" height="4" rx="2" fill="#fff" stroke={STROKE} />
          </>
        ) : item.shape === 'boots' ? (
          <>
            <path d="M78 322 L98 322 L100 372 L72 376 L72 366 L78 366 Z" fill={c} stroke={STROKE} />
            <path d="M122 322 L102 322 L100 372 L128 376 L128 366 L122 366 Z" fill={c} stroke={STROKE} />
          </>
        ) : (
          <>
            <path d="M80 360 L98 360 L98 374 L72 376 Z" fill={c} stroke={STROKE} />
            <path d="M120 360 L102 360 L102 374 L128 376 Z" fill={c} stroke={STROKE} />
            <rect x="76" y="374" width="4" height="8" fill={c} />
            <rect x="120" y="374" width="4" height="8" fill={c} />
          </>
        )
      return [[3, <g key="s">{body}</g>]]
    }
    case 'head': {
      const m: Record<string, ReactNode> = {
        crown: <P d="M68 40 L74 12 L88 30 L100 6 L112 30 L126 12 L132 40 Z" c={c} />,
        bow: (
          <g>
            <P d="M128 34 L156 20 L156 48 Z" c={c} />
            <P d="M128 34 L100 20 L100 48 Z" c={c} />
            <circle cx="128" cy="34" r="6" fill={c} stroke={STROKE} />
          </g>
        ),
        flower: (
          <g>
            {[0, 72, 144, 216, 288].map((a) => (
              <ellipse key={a} cx="72" cy="30" rx="6" ry="10" fill={c} stroke={STROKE} transform={`rotate(${a} 72 40)`} />
            ))}
            <circle cx="72" cy="40" r="5" fill="#ffd447" />
          </g>
        ),
        catears: (
          <g>
            <P d="M62 44 L66 6 L92 28 Z" c={c} />
            <P d="M138 44 L134 6 L108 28 Z" c={c} />
            <path d="M68 30 L70 16 L82 28 Z M132 30 L130 16 L118 28 Z" fill="#ffb3c8" />
          </g>
        ),
        bunnyears: (
          <g>
            <ellipse cx="80" cy="-6" rx="11" ry="34" fill={c} stroke={STROKE} transform="rotate(-8 80 30)" />
            <ellipse cx="120" cy="-6" rx="11" ry="34" fill={c} stroke={STROKE} transform="rotate(8 120 30)" />
            <ellipse cx="80" cy="-4" rx="5" ry="24" fill="#ffb3c8" transform="rotate(-8 80 30)" />
            <ellipse cx="120" cy="-4" rx="5" ry="24" fill="#ffb3c8" transform="rotate(8 120 30)" />
          </g>
        ),
        hat: (
          <g>
            <ellipse cx="100" cy="40" rx="56" ry="10" fill={c} stroke={STROKE} />
            <path d="M68 40 Q70 8 100 8 Q130 8 132 40 Z" fill={c} stroke={STROKE} />
            <rect x="68" y="30" width="64" height="7" fill="#e86a8c" />
          </g>
        ),
      }
      return [[9, <g key="h">{m[item.shape] ?? m.bow}</g>]]
    }
    case 'face': {
      const heart = (x: number) => (
        <path
          key={x}
          transform={`translate(${x} 72)`}
          d="M0 -5 C-4 -13 -16 -9 -14 0 C-12 8 0 14 0 14 C0 14 12 8 14 0 C16 -9 4 -13 0 -5 Z"
          fill={c}
          fillOpacity=".45"
          stroke={c}
          strokeWidth="3"
        />
      )
      return [
        [
          9,
          <g key="g">
            {item.shape === 'heartglasses' ? (
              <>
                {heart(86)}
                {heart(114)}
              </>
            ) : (
              <>
                <circle cx="86" cy="72" r="12" fill="#fff" fillOpacity=".3" stroke={c} strokeWidth="3" />
                <circle cx="114" cy="72" r="12" fill="#fff" fillOpacity=".3" stroke={c} strokeWidth="3" />
              </>
            )}
            <line x1="98" y1="72" x2="102" y2="72" stroke={c} strokeWidth="3" />
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
              <ellipse cx="42" cy="150" rx="34" ry="62" fill={c} fillOpacity=".85" stroke={STROKE} transform="rotate(-25 42 150)" />
              <ellipse cx="158" cy="150" rx="34" ry="62" fill={c} fillOpacity=".85" stroke={STROKE} transform="rotate(25 158 150)" />
            </g>,
          ],
        ]
      if (item.shape === 'tail')
        return [[0, <path key="t" d="M120 215 Q190 200 175 140 Q165 190 125 195 Z" fill={c} stroke={STROKE} />]]
      return [
        [0, <rect key="bp" x="66" y="112" width="68" height="84" rx="14" fill={c} stroke={STROKE} />],
        [
          7,
          <g key="st">
            <rect x="76" y="108" width="8" height="70" rx="3" fill={c} stroke={STROKE} />
            <rect x="116" y="108" width="8" height="70" rx="3" fill={c} stroke={STROKE} />
          </g>,
        ],
      ]
    }
  }
}

function BodyLayers({ skin }: { skin: string }): Layer[] {
  return [
    [-1, <ellipse key="shadow" cx="100" cy="384" rx="62" ry="9" fill="rgba(90,50,110,.15)" />],
    [
      2,
      <g key="body">
        <circle cx="51" cy="207" r="8" fill={skin} stroke={STROKE} />
        <circle cx="149" cy="207" r="8" fill={skin} stroke={STROKE} />
        <rect x="92" y="100" width="16" height="20" fill={skin} />
        <path d="M74 108 L126 108 L130 205 L70 205 Z" fill={skin} stroke={STROKE} />
        <line x1="68" y1="118" x2="52" y2="205" stroke={skin} strokeWidth="13" strokeLinecap="round" />
        <line x1="132" y1="118" x2="148" y2="205" stroke={skin} strokeWidth="13" strokeLinecap="round" />
        <rect x="76" y="200" width="20" height="162" rx="9" fill={skin} stroke={STROKE} />
        <rect x="104" y="200" width="20" height="162" rx="9" fill={skin} stroke={STROKE} />
        <circle cx="100" cy="70" r="38" fill={skin} stroke={STROKE} />
      </g>,
    ],
    [
      7,
      <g key="face">
        {/* brows */}
        <path d="M78 58 Q85 54 92 57 M108 57 Q115 54 122 58" stroke="#7a4a3a" strokeWidth="2" fill="none" strokeLinecap="round" />
        {[86, 114].map((x) => (
          <g key={x}>
            <ellipse cx={x} cy="73" rx="8" ry="10" fill="#fff" />
            <ellipse cx={x} cy="74" rx="6.5" ry="8.5" fill="#6b3f8f" />
            <ellipse cx={x} cy="75" rx="3.5" ry="5" fill="#2b1838" />
            <circle cx={x + 2.5} cy="70" r="2.6" fill="#fff" />
            <circle cx={x - 2.5} cy="78" r="1.3" fill="#fff" />
            {/* lashes */}
            <path
              d={`M${x - 9} 68 Q${x} 60 ${x + 9} 68 M${x + (x < 100 ? -9 : 9)} 68 l${x < 100 ? -4 : 4} -3`}
              stroke="#2b1838"
              strokeWidth="2.4"
              fill="none"
              strokeLinecap="round"
            />
          </g>
        ))}
        <path d="M99 84 Q100 86 101 84" stroke="#d98a7a" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <ellipse cx="74" cy="88" rx="7" ry="4" fill="#ff8fa3" opacity=".5" />
        <ellipse cx="126" cy="88" rx="7" ry="4" fill="#ff8fa3" opacity=".5" />
        <path d="M93 92 Q100 99 107 92 Q100 95 93 92 Z" fill="#e0607a" stroke="#c4506a" strokeWidth="1.5" strokeLinejoin="round" />
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
  const layers: Layer[] = [...BodyLayers({ skin })]
  for (const id of Object.values(outfit)) {
    const item = id ? ITEM_BY_ID[id] : undefined
    if (item) layers.push(...layersFor(item))
  }
  layers.sort((a, b) => a[0] - b[0])
  return (
    <svg viewBox="-10 -20 220 420" className={className} role="img" aria-label="Búp bê">
      {layers.map(([z, node], i) => (
        <g key={`${z}-${i}`}>{node}</g>
      ))}
    </svg>
  )
}

const CROP: Record<Slot, string> = {
  hair: '30 0 140 140',
  head: '30 -40 140 120',
  face: '60 40 80 60',
  top: '40 100 120 120',
  bottom: '30 190 140 170',
  dress: '10 100 180 250',
  shoes: '50 310 100 80',
  back: '10 90 180 140',
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
