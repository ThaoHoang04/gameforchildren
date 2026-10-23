import type { Item, Slot, ThemeId } from '../types'

type Row = [slot: Slot, shape: string, name: string, color: string, starter?: boolean]

const ROWS: Record<ThemeId, Row[]> = {
  princess: [
    ['hair', 'long', 'Tóc dài nâu', '#8a5a3c', true],
    ['hair', 'pigtails', 'Tóc hai bím', '#f5c76b'],
    ['hair', 'bun', 'Tóc búi tím', '#b57edc'],
    ['dress', 'princess', 'Váy công chúa hồng', '#ffb3d1'],
    ['dress', 'princess', 'Váy lavender', '#c7a8ff'],
    ['dress', 'aline', 'Váy xanh băng giá', '#a8dcff'],
    ['dress', 'sundress', 'Váy hoa vàng', '#ffe08a'],
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
  ],
  fashion: [
    ['hair', 'bob', 'Tóc bob đen', '#2f2a35', true],
    ['hair', 'long', 'Tóc dài hạt dẻ', '#a0623a'],
    ['hair', 'ponytail', 'Tóc đuôi ngựa', '#d98a4a'],
    ['top', 'tee', 'Áo phông trắng', '#ffffff'],
    ['top', 'tee', 'Áo phông mint', '#9fe6cc'],
    ['top', 'jacket', 'Áo khoác hồng đào', '#ffb59a'],
    ['top', 'tank', 'Áo ba lỗ kem', '#fff0c9'],
    ['bottom', 'skirt', 'Chân váy kem', '#f7e1b8'],
    ['bottom', 'pants', 'Quần jean', '#6f9bd6'],
    ['bottom', 'shorts', 'Quần short đào', '#ffa98c'],
    ['dress', 'sundress', 'Đầm mint', '#98e0c6'],
    ['dress', 'aline', 'Đầm đỏ cam', '#ff7f66'],
    ['shoes', 'sneakers', 'Sneaker trắng', '#ffffff'],
    ['shoes', 'sneakers', 'Sneaker hồng', '#ff9fb2'],
    ['shoes', 'boots', 'Bốt nâu', '#8a5a44'],
    ['head', 'hat', 'Mũ cói', '#f2d49b'],
    ['head', 'bow', 'Kẹp tóc nơ', '#ffcfa6'],
    ['face', 'glasses', 'Kính tròn', '#444444'],
    ['back', 'backpack', 'Balo mint', '#7ed9b8'],
  ],
  chibi: [
    ['hair', 'pigtails', 'Hai bím hồng', '#ff8fc0', true],
    ['hair', 'bun', 'Búi tóc xanh', '#68c8f2'],
    ['hair', 'bob', 'Tóc bob vàng', '#ffd35c'],
    ['top', 'tee', 'Áo phông kẹo', '#ffd1e6'],
    ['top', 'jacket', 'Áo khoác xanh', '#8fd8ff'],
    ['bottom', 'shorts', 'Quần short tím', '#c4a4ff'],
    ['bottom', 'skirt', 'Váy bông vàng', '#ffe58a'],
    ['dress', 'princess', 'Váy kẹo hồng', '#ff9ccc'],
    ['dress', 'sundress', 'Váy dâu', '#ff8080'],
    ['shoes', 'sneakers', 'Giày xanh', '#6cc8f5'],
    ['shoes', 'boots', 'Bốt vàng', '#ffd35c'],
    ['head', 'catears', 'Tai mèo', '#ffffff'],
    ['head', 'bunnyears', 'Tai thỏ', '#ffd6ea'],
    ['head', 'flower', 'Cặp hoa', '#ff7fb0'],
    ['face', 'heartglasses', 'Kính ngôi sao', '#ffb300'],
    ['back', 'backpack', 'Balo thú cưng', '#ffb7d5'],
    ['back', 'tail', 'Đuôi mèo', '#ffffff'],
  ],
}

export const ITEMS: Item[] = (Object.keys(ROWS) as ThemeId[]).flatMap((theme) =>
  ROWS[theme].map(([slot, shape, name, color, starter], i) => ({
    id: `${theme}_${slot}_${shape}_${i + 1}`,
    theme,
    slot,
    shape,
    color,
    name,
    starter,
  })),
)

export const ITEM_BY_ID: Record<string, Item> = Object.fromEntries(ITEMS.map((i) => [i.id, i]))

export const STARTER_IDS = ITEMS.filter((i) => i.starter).map((i) => i.id)

export const itemsFor = (theme: ThemeId, slot?: Slot) =>
  ITEMS.filter((i) => i.theme === theme && (!slot || i.slot === slot))
