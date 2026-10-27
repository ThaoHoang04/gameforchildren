import type { Item, Pattern, Slot, ThemeId } from '../types'

type Row = [slot: Slot, shape: string, name: string, color: string, opts?: { starter?: boolean; pattern?: Pattern }]

const ROWS: Record<ThemeId, Row[]> = {
  princess: [
    ['hair', 'long', 'Tóc dài nâu', '#8a5a3c', { starter: true }],
    ['hair', 'pigtails', 'Tóc hai bím', '#f5c76b'],
    ['hair', 'bun', 'Tóc búi tím', '#b57edc'],
    ['dress', 'princess', 'Váy công chúa hồng', '#ffb3d1', { pattern: 'stars' }],
    ['dress', 'princess', 'Váy lavender', '#c7a8ff', { pattern: 'stars' }],
    ['dress', 'aline', 'Váy xanh băng giá', '#a8dcff'],
    ['dress', 'sundress', 'Váy hoa vàng', '#ffe08a', { pattern: 'flowers' }],
    ['top', 'tank', 'Áo hồng phấn', '#ffc2dc'],
    ['bottom', 'skirt', 'Chân váy tím', '#d3b5ff'],
    ['shoes', 'heels', 'Giày thủy tinh', '#bfe9ff'],
    ['shoes', 'heels', 'Giày hồng', '#ff9fc4'],
    ['head', 'crown', 'Vương miện vàng', '#ffd447'],
    ['head', 'bow', 'Nơ hồng', '#ff7fb0'],
    ['head', 'flower', 'Kẹp hoa', '#ffffff'],
    ['face', 'heartglasses', 'Kính trái tim', '#ff6fa5'],
    ['back', 'wings', 'Cánh tiên', '#d8f0ff'],
    ['back', 'wings', 'Cánh bướm tím', '#d9b8ff'],
    // v2: more dresses + makeup
    ['dress', 'ballgown', 'Đầm dạ hội hồng', '#ff9fcf', { pattern: 'stars' }],
    ['dress', 'ballgown', 'Đầm dạ hội xanh', '#9fd4ff', { pattern: 'stars' }],
    ['dress', 'tiered', 'Váy bèo ba tầng', '#d9b8ff', { pattern: 'hearts' }],
    ['dress', 'puff', 'Váy tay phồng', '#ffc7a8', { pattern: 'flowers' }],
    ['dress', 'aodai', 'Áo dài hồng', '#ff8fb8', { pattern: 'flowers' }],
    ['lips', 'gloss', 'Son bóng hồng', '#ff6fa5'],
    ['blush', 'hearts', 'Má hồng trái tim', '#ff7fa8'],
    ['eyeshadow', 'shimmer', 'Phấn mắt tím lấp lánh', '#b57edc'],
    ['sticker', 'star', 'Hình dán ngôi sao', '#ffd447'],
    ['sticker', 'crown', 'Hình dán vương miện', '#ffcf3f'],
    ['shoes', 'ballet', 'Giày búp bê ruy băng', '#ffc2dc'],
  ],
  fashion: [
    ['hair', 'bob', 'Tóc bob đen', '#2f2a35', { starter: true }],
    ['hair', 'long', 'Tóc dài hạt dẻ', '#a0623a'],
    ['hair', 'ponytail', 'Tóc đuôi ngựa', '#d98a4a'],
    ['top', 'tee', 'Áo phông trắng', '#ffffff'],
    ['top', 'tee', 'Áo phông mint', '#9fe6cc'],
    ['top', 'jacket', 'Áo khoác hồng đào', '#ffb59a'],
    ['top', 'tank', 'Áo ba lỗ kem', '#fff0c9'],
    ['bottom', 'skirt', 'Chân váy kem', '#f7e1b8'],
    ['bottom', 'pants', 'Quần jean', '#6f9bd6'],
    ['bottom', 'shorts', 'Quần short đào', '#ffa98c'],
    ['dress', 'sundress', 'Đầm mint', '#98e0c6', { pattern: 'dots' }],
    ['dress', 'aline', 'Đầm đỏ cam', '#ff7f66'],
    ['shoes', 'sneakers', 'Sneaker trắng', '#ffffff'],
    ['shoes', 'sneakers', 'Sneaker hồng', '#ff9fb2'],
    ['shoes', 'boots', 'Bốt nâu', '#8a5a44'],
    ['head', 'hat', 'Mũ cói', '#f2d49b'],
    ['head', 'bow', 'Kẹp tóc nơ', '#ffcfa6'],
    ['face', 'glasses', 'Kính tròn', '#444444'],
    ['back', 'backpack', 'Balo mint', '#7ed9b8'],
    // v2: more dresses + makeup
    ['dress', 'overall', 'Váy yếm jean', '#6f9bd6'],
    ['dress', 'puff', 'Váy tay phồng kẻ sọc', '#ff9a8a', { pattern: 'stripes' }],
    ['dress', 'tiered', 'Váy bèo kem', '#f7e1b8', { pattern: 'dots' }],
    ['dress', 'aodai', 'Áo dài xanh ngọc', '#5ccfb4', { pattern: 'flowers' }],
    ['lips', 'gloss', 'Son đỏ dâu', '#e0455f'],
    ['lips', 'gloss', 'Son cam đào', '#ff8a6b'],
    ['blush', 'round', 'Má hồng đào', '#ff9a7a'],
    ['eyeshadow', 'soft', 'Phấn mắt nâu', '#c48a6a'],
    ['sticker', 'heart', 'Hình dán trái tim', '#ff5f9d'],
    ['shoes', 'maryjane', 'Giày búp bê quai đen', '#3a3340'],
  ],
  chibi: [
    ['hair', 'pigtails', 'Hai bím hồng', '#ff8fc0', { starter: true }],
    ['hair', 'bun', 'Búi tóc xanh', '#68c8f2'],
    ['hair', 'bob', 'Tóc bob vàng', '#ffd35c'],
    ['top', 'tee', 'Áo phông kẹo', '#ffd1e6'],
    ['top', 'jacket', 'Áo khoác xanh', '#8fd8ff'],
    ['bottom', 'shorts', 'Quần short tím', '#c4a4ff'],
    ['bottom', 'skirt', 'Váy bông vàng', '#ffe58a'],
    ['dress', 'princess', 'Váy kẹo hồng', '#ff9ccc', { pattern: 'hearts' }],
    ['dress', 'sundress', 'Váy dâu', '#ff8080', { pattern: 'dots' }],
    ['shoes', 'sneakers', 'Giày xanh', '#6cc8f5'],
    ['shoes', 'boots', 'Bốt vàng', '#ffd35c'],
    ['head', 'catears', 'Tai mèo', '#ffffff'],
    ['head', 'bunnyears', 'Tai thỏ', '#ffd6ea'],
    ['head', 'flower', 'Cặp hoa', '#ff7fb0'],
    ['face', 'heartglasses', 'Kính ngôi sao', '#ffb300'],
    ['back', 'backpack', 'Balo thú cưng', '#ffb7d5'],
    ['back', 'tail', 'Đuôi mèo', '#ffffff'],
    // v2: more dresses + makeup
    ['dress', 'tutu', 'Váy tutu ba lê', '#ffb3d9', { pattern: 'stars' }],
    ['dress', 'overall', 'Váy yếm vàng', '#ffd35c', { pattern: 'hearts' }],
    ['dress', 'ballgown', 'Đầm kẹo bông', '#c4a4ff', { pattern: 'hearts' }],
    ['dress', 'puff', 'Váy tay phồng xanh', '#8fd8ff', { pattern: 'dots' }],
    ['dress', 'tiered', 'Váy cầu vồng', '#ffb27f', { pattern: 'stripes' }],
    ['blush', 'round', 'Má hồng kẹo', '#ff8fc0'],
    ['blush', 'hearts', 'Má trái tim xanh', '#6cc8f5'],
    ['eyeshadow', 'shimmer', 'Phấn mắt xanh lấp lánh', '#6cc8f5'],
    ['lips', 'gloss', 'Son bóng tím', '#b06ae0'],
    ['shoes', 'maryjane', 'Giày quai kẹo', '#ff8fc0'],
  ],
}

export const ITEMS: Item[] = (Object.keys(ROWS) as ThemeId[]).flatMap((theme) =>
  ROWS[theme].map(([slot, shape, name, color, opts], i) => ({
    id: `${theme}_${slot}_${shape}_${i + 1}`,
    theme,
    slot,
    shape,
    color,
    name,
    starter: opts?.starter,
    pattern: opts?.pattern,
  })),
)

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]))

export const STARTER_IDS = ITEMS.filter((i) => i.starter).map((i) => i.id)

export const itemsFor = (theme: ThemeId, slots?: Slot | Slot[]) => {
  const want = slots === undefined ? null : Array.isArray(slots) ? slots : [slots]
  return ITEMS.filter((i) => i.theme === theme && (!want || want.includes(i.slot)))
}
