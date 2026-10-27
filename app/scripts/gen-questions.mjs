// Regenerates src/data/questions.json:  node scripts/gen-questions.mjs
import fs from 'node:fs'
const q = []
const add = (subject, prefix) => (n, stage, emoji, prompt, ans, d, hint, explanation) =>
  q.push({
    id: `${prefix}_${String(n).padStart(3, '0')}`,
    subject,
    stage,
    type: 'multiple_choice',
    emoji,
    prompt,
    choices: [ans, ...d],
    answer: ans,
    hint,
    explanation,
  })
const M = add('math', 'math')
const s5 = 'number_range_5', s10 = 'number_range_10', s20 = 'number_range_20'

M(1, s5, '⭐', '1 + 1 = ?', '2', ['1', '3'], 'Có một ngôi sao, thêm một ngôi sao nữa.', 'Một cộng một bằng hai.')
M(2, s5, '🍎', '2 + 1 = ?', '3', ['2', '4'], 'Có 2 quả táo, thêm 1 quả nữa. Đếm xem nào!', 'Hai cộng một bằng ba.')
M(3, s5, '🎈', '2 + 2 = ?', '4', ['3', '5'], 'Giơ 2 ngón tay, giơ thêm 2 ngón nữa rồi đếm.', 'Hai cộng hai bằng bốn.')
M(4, s5, '🐟', '3 + 1 = ?', '4', ['2', '5'], 'Đếm tiếp từ 3: ba, bốn.', 'Ba cộng một bằng bốn.')
M(5, s5, '🍪', '4 - 1 = ?', '3', ['5', '4'], 'Có 4 cái bánh, bé ăn mất 1 cái. Còn mấy cái?', 'Bốn trừ một bằng ba.')
M(6, s5, '🌸', '5 - 2 = ?', '3', ['2', '4'], 'Đếm lùi từ 5: bốn, ba.', 'Năm trừ hai bằng ba.')
M(7, s5, '⭐⭐⭐', 'Có mấy ngôi sao?', '3', ['2', '4'], 'Chỉ tay vào từng ngôi sao và đếm.', 'Có ba ngôi sao.')
M(8, s5, '🍎🍎🍎🍎', 'Có mấy quả táo?', '4', ['3', '5'], 'Chỉ tay vào từng quả táo và đếm.', 'Có bốn quả táo.')
M(9, s5, '🧸', '3 + 2 = ?', '5', ['4', '6'], 'Giơ 3 ngón tay, thêm 2 ngón nữa.', 'Ba cộng hai bằng năm.')
M(10, s5, '🍬', '5 - 5 = ?', '0', ['1', '5'], 'Có 5 viên kẹo, bé ăn hết cả 5 viên. Còn mấy viên?', 'Năm trừ năm bằng không.')
M(11, s10, '🍓', '5 + 3 = ?', '8', ['7', '9'], 'Bắt đầu từ 5, đếm tiếp thêm 3 số: sáu, bảy, tám.', 'Năm cộng ba bằng tám.')
M(12, s10, '🦋', '7 + 2 = ?', '9', ['8', '10'], 'Từ 7 đếm tiếp 2 số: tám, chín.', 'Bảy cộng hai bằng chín.')
M(13, s10, '🐥', '6 + 2 = ?', '8', ['7', '9'], 'Từ 6 đếm tiếp 2 số: bảy, tám.', 'Sáu cộng hai bằng tám.')
M(14, s10, '🍩', '9 - 4 = ?', '5', ['4', '6'], 'Từ 9 đếm lùi 4 số: tám, bảy, sáu, năm.', 'Chín trừ bốn bằng năm.')
M(15, s10, '🎀', '10 - 6 = ?', '4', ['3', '5'], 'Từ 10 đếm lùi 6 số.', 'Mười trừ sáu bằng bốn.')
M(16, s10, '🔢', 'Số liền sau của 7 là số nào?', '8', ['6', '9'], 'Số liền sau là số đếm tiếp ngay sau số đó.', 'Sau bảy là tám.')
M(17, s10, '🔢', 'Số liền trước của 6 là số nào?', '5', ['7', '4'], 'Số liền trước là số đứng ngay trước số đó khi đếm.', 'Trước sáu là năm.')
M(18, s10, '🏆', 'Số nào lớn nhất: 3, 9, 6?', '9', ['3', '6'], 'Số nào đếm được xa nhất thì lớn nhất.', 'Chín lớn hơn ba và sáu.')
M(19, s10, '🐣', 'Số nào bé nhất: 4, 2, 8?', '2', ['4', '8'], 'Số nào đếm ra sớm nhất thì bé nhất.', 'Hai bé hơn bốn và tám.')
M(20, s10, '🧩', '6 + ? = 10', '4', ['3', '5'], 'Từ 6 đếm tiếp đến 10 cần thêm mấy số?', 'Sáu cộng bốn bằng mười.')
M(21, s20, '🌟', '10 + 5 = ?', '15', ['14', '16'], 'Mười và năm là mười lăm.', 'Mười cộng năm bằng mười lăm.')
M(22, s20, '🌷', '12 + 4 = ?', '16', ['15', '17'], 'Từ 12 đếm tiếp 4 số: 13, 14, 15, 16.', 'Mười hai cộng bốn bằng mười sáu.')
M(23, s20, '🍭', '14 - 2 = ?', '12', ['11', '13'], 'Từ 14 đếm lùi 2 số: 13, 12.', 'Mười bốn trừ hai bằng mười hai.')
M(24, s20, '🎁', '15 - 5 = ?', '10', ['9', '11'], 'Bớt 5 đơn vị của 15 thì còn đúng một chục.', 'Mười lăm trừ năm bằng mười.')
M(25, s20, '🎯', '10 + 8 = ?', '18', ['17', '19'], 'Mười và tám là mười tám.', 'Mười cộng tám bằng mười tám.')
M(26, s20, '🔢', 'Số liền sau của 19 là số nào?', '20', ['18', '21'], 'Đếm tiếp sau 19.', 'Sau mười chín là hai mươi.')
M(27, s20, '⚖️', '15 ... 12. Điền dấu thích hợp.', '>', ['<', '='], '15 và 12, số nào đếm được xa hơn?', 'Mười lăm lớn hơn mười hai nên dùng dấu >.')
M(28, s20, '⚖️', '13 ... 18. Điền dấu thích hợp.', '<', ['>', '='], '13 và 18, số nào đếm được xa hơn?', 'Mười ba bé hơn mười tám nên dùng dấu <.')
M(29, s20, '🧩', '11 + 9 = ?', '20', ['19', '21'], 'Từ 11 đếm tiếp 9 số, hoặc nhớ 1 + 9 = 10.', 'Mười một cộng chín bằng hai mươi.')
M(30, s20, '🔢', '2, 4, 6, ... Số tiếp theo là?', '8', ['7', '9'], 'Các số tăng thêm 2 mỗi lần.', 'Sáu cộng hai bằng tám.')

// ---------------------------------------------------------------------------
// Vietnamese questions are voice-first: first graders cannot read yet, so the
// prompt is spoken aloud (`speech`) and the choices are pictures (`visuals`).
// `prompt` stays as small fallback text for parents / devices with no voice.
// ---------------------------------------------------------------------------
const PIC = {
  cá: '🐟', mèo: '🐱', gà: '🐔', nhà: '🏠', trăng: '🌙', voi: '🐘', chó: '🐶', táo: '🍎', thỏ: '🐰',
  sao: '⭐', bò: '🐮', hoa: '🌸', tay: '✋', tai: '👂', mũi: '👃', mắt: '👁️', ngựa: '🐴', chim: '🐦',
  chuối: '🍌', nho: '🍇', dâu: '🍓', cam: '🍊', bút: '✏️', bóng: '⚽', kem: '🍦', xe: '🚗', heo: '🐷', vịt: '🦆',
  miệng: '👄',
}
const pics = (words) => Object.fromEntries(words.map((w) => [w, PIC[w]]))

const V = (n, stage, emoji, prompt, speech, ans, d, hint, explanation) => {
  const choices = [ans, ...d]
  const isWord = choices.every((c) => PIC[c])
  q.push({
    id: `viet_${String(n).padStart(3, '0')}`,
    subject: 'viet',
    stage,
    type: 'multiple_choice',
    emoji,
    prompt,
    speech,
    choices,
    ...(isWord ? { visuals: pics(choices) } : {}),
    answer: ans,
    hint,
    explanation,
  })
}

// Stage "letters": first sound of a word (listen, then pick the picture).
V(1, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "c"?', 'Con nghe nhé. Cờ, cờ, cờ. Tranh nào có tên bắt đầu bằng âm cờ?', 'cá', ['mèo', 'gà'], 'Nghe thật kỹ nhé. Cờ, cờ, cá.', 'Cá. Cờ, cá. Con cá bắt đầu bằng âm cờ.')
V(2, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "m"?', 'Con nghe nhé. Mờ, mờ, mờ. Tranh nào có tên bắt đầu bằng âm mờ?', 'mèo', ['cá', 'voi'], 'Nghe thật kỹ nhé. Mờ, mờ, mèo.', 'Mèo. Mờ, mèo. Con mèo bắt đầu bằng âm mờ.')
V(3, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "g"?', 'Con nghe nhé. Gờ, gờ, gờ. Tranh nào có tên bắt đầu bằng âm gờ?', 'gà', ['mèo', 'thỏ'], 'Nghe thật kỹ nhé. Gờ, gờ, gà.', 'Gà. Gờ, gà. Con gà bắt đầu bằng âm gờ.')
V(4, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "nh"?', 'Con nghe nhé. Nhờ, nhờ, nhờ. Tranh nào có tên bắt đầu bằng âm nhờ?', 'nhà', ['cá', 'bò'], 'Nghe thật kỹ nhé. Nhờ, nhờ, nhà.', 'Nhà. Nhờ, nhà. Ngôi nhà bắt đầu bằng âm nhờ.')
V(5, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "tr"?', 'Con nghe nhé. Trờ, trờ, trờ. Tranh nào có tên bắt đầu bằng âm trờ?', 'trăng', ['cam', 'nho'], 'Nghe thật kỹ nhé. Trờ, trờ, trăng.', 'Trăng. Trờ, trăng. Mặt trăng bắt đầu bằng âm trờ.')
V(6, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "v"?', 'Con nghe nhé. Vờ, vờ, vờ. Tranh nào có tên bắt đầu bằng âm vờ?', 'voi', ['cá', 'táo'], 'Nghe thật kỹ nhé. Vờ, vờ, voi.', 'Voi. Vờ, voi. Con voi bắt đầu bằng âm vờ.')
V(7, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "ch"?', 'Con nghe nhé. Chờ, chờ, chờ. Tranh nào có tên bắt đầu bằng âm chờ?', 'chó', ['gà', 'cá'], 'Nghe thật kỹ nhé. Chờ, chờ, chó.', 'Chó. Chờ, chó. Con chó bắt đầu bằng âm chờ.')
V(8, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "t"?', 'Con nghe nhé. Tờ, tờ, tờ. Tranh nào có tên bắt đầu bằng âm tờ?', 'táo', ['mèo', 'nhà'], 'Nghe thật kỹ nhé. Tờ, tờ, táo.', 'Táo. Tờ, táo. Quả táo bắt đầu bằng âm tờ.')
V(9, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "th"?', 'Con nghe nhé. Thờ, thờ, thờ. Tranh nào có tên bắt đầu bằng âm thờ?', 'thỏ', ['voi', 'gà'], 'Nghe thật kỹ nhé. Thờ, thờ, thỏ.', 'Thỏ. Thờ, thỏ. Con thỏ bắt đầu bằng âm thờ.')
V(10, 'letters', '👂', 'Tranh nào có tên bắt đầu bằng âm "s"?', 'Con nghe nhé. Sờ, sờ, sờ. Tranh nào có tên bắt đầu bằng âm sờ?', 'sao', ['mèo', 'nhà'], 'Nghe thật kỹ nhé. Sờ, sờ, sao.', 'Sao. Sờ, sao. Ngôi sao bắt đầu bằng âm sờ.')

// Stage "rhymes": which word has the same ending sound (vần).
V(11, 'rhymes', '🎵', 'Tranh nào có vần "ao"?', 'Con nghe nhé. Vần ao. Tranh nào có vần ao?', 'sao', ['cá', 'nhà'], 'Nghe thật kỹ phần cuối nhé. S, ao. Sao.', 'Sao. Sao có vần ao.')
V(12, 'rhymes', '🎵', 'Tranh nào có vần "eo"?', 'Con nghe nhé. Vần eo. Tranh nào có vần eo?', 'mèo', ['sao', 'cá'], 'Nghe thật kỹ phần cuối nhé. M, eo. Mèo.', 'Mèo. Mèo có vần eo.')
V(13, 'rhymes', '🎵', 'Tranh nào có vần "oa"?', 'Con nghe nhé. Vần oa. Tranh nào có vần oa?', 'hoa', ['cá', 'sao'], 'Nghe thật kỹ phần cuối nhé. H, oa. Hoa.', 'Hoa. Hoa có vần oa.')
V(14, 'rhymes', '🎵', 'Tranh nào có vần "ay"?', 'Con nghe nhé. Vần ay. Tranh nào có vần ay?', 'tay', ['mèo', 'sao'], 'Nghe thật kỹ phần cuối nhé. T, ay. Tay.', 'Tay. Tay có vần ay.')
V(15, 'rhymes', '🎵', 'Tranh nào có vần "ai"?', 'Con nghe nhé. Vần ai. Tranh nào có vần ai?', 'tai', ['sao', 'cá'], 'Nghe thật kỹ phần cuối nhé. T, ai. Tai.', 'Tai. Tai có vần ai.')
V(16, 'rhymes', '🎵', 'Tranh nào có vần "ui"?', 'Con nghe nhé. Vần ui. Tranh nào có vần ui?', 'mũi', ['mèo', 'sao'], 'Nghe thật kỹ phần cuối nhé. M, ui. Mũi.', 'Mũi. Mũi có vần ui.')
V(17, 'rhymes', '🎵', 'Tranh nào có vần "ưa"?', 'Con nghe nhé. Vần ưa. Tranh nào có vần ưa?', 'ngựa', ['cá', 'mèo'], 'Nghe thật kỹ phần cuối nhé. Ng, ưa. Ngựa.', 'Ngựa. Ngựa có vần ưa.')
V(18, 'rhymes', '🎵', 'Tranh nào có vần "oi"?', 'Con nghe nhé. Vần oi. Tranh nào có vần oi?', 'voi', ['mèo', 'sao'], 'Nghe thật kỹ phần cuối nhé. V, oi. Voi.', 'Voi. Voi có vần oi.')
V(19, 'rhymes', '🎵', 'Tranh nào có vần "im"?', 'Con nghe nhé. Vần im. Tranh nào có vần im?', 'chim', ['cá', 'sao'], 'Nghe thật kỹ phần cuối nhé. Ch, im. Chim.', 'Chim. Chim có vần im.')
V(20, 'rhymes', '🎵', 'Tranh nào có vần "a"?', 'Con nghe nhé. Vần a. Tranh nào có vần a?', 'cá', ['sao', 'mèo'], 'Nghe thật kỹ phần cuối nhé. C, a. Cá.', 'Cá. Cá có vần a.')

// Stage "words": meaning of words and everyday things (listen, pick a picture).
V(21, 'words', '❓', 'Con vật nào biết bay?', 'Con nghe câu hỏi nhé. Con vật nào biết bay?', 'chim', ['chó', 'cá'], 'Con vật nào có cánh để bay trên trời?', 'Chim biết bay trên trời.')
V(22, 'words', '❓', 'Con vật nào sống dưới nước?', 'Con nghe câu hỏi nhé. Con vật nào sống ở dưới nước?', 'cá', ['gà', 'mèo'], 'Con vật nào biết bơi trong nước?', 'Cá sống dưới nước.')
V(23, 'words', '❓', 'Quả nào có màu vàng?', 'Con nghe câu hỏi nhé. Quả nào có màu vàng?', 'chuối', ['dâu', 'nho'], 'Quả chuối chín có màu gì nhỉ?', 'Quả chuối chín có màu vàng.')
V(24, 'words', '❓', 'Đâu là quả có màu đỏ?', 'Con nghe câu hỏi nhé. Quả nào có màu đỏ?', 'dâu', ['chuối', 'nho'], 'Quả dâu tây chín có màu gì nhỉ?', 'Quả dâu chín có màu đỏ.')
V(25, 'words', '❓', 'Bé dùng gì để viết?', 'Con nghe câu hỏi nhé. Bé dùng gì để viết chữ?', 'bút', ['bóng', 'kem'], 'Bé cầm vật gì để viết chữ?', 'Bé dùng cây bút để viết.')
V(26, 'words', '❓', 'Bé dùng gì để nghe?', 'Con nghe câu hỏi nhé. Bé dùng gì để nghe âm thanh?', 'tai', ['mắt', 'mũi'], 'Bé nghe được là nhờ bộ phận nào?', 'Bé nghe bằng đôi tai.')
V(27, 'words', '❓', 'Bé dùng gì để nhìn?', 'Con nghe câu hỏi nhé. Bé dùng gì để nhìn?', 'mắt', ['tai', 'miệng'], 'Bé nhìn thấy mọi thứ nhờ bộ phận nào?', 'Bé nhìn bằng đôi mắt.')
V(28, 'words', '❓', 'Bé dùng gì để ngửi hoa?', 'Con nghe câu hỏi nhé. Bé dùng gì để ngửi hoa?', 'mũi', ['tai', 'mắt'], 'Bé ngửi thấy mùi thơm nhờ bộ phận nào?', 'Bé ngửi bằng cái mũi.')
V(29, 'words', '🐾', 'Meo meo là tiếng kêu của con gì?', 'Con nghe nhé. Meo meo, meo meo. Đó là tiếng kêu của con gì?', 'mèo', ['chó', 'gà'], 'Con vật nào kêu meo meo?', 'Meo meo là tiếng kêu của con mèo.')
V(30, 'words', '👏', 'Con mèo có mấy tiếng?', 'Con vỗ tay theo cô nhé. Con, mèo. Con mèo có mấy tiếng? Con chọn số nhé.', '2', ['1', '3'], 'Vỗ tay theo nào. Con, mèo. Một, hai.', 'Con, mèo. Con mèo có hai tiếng.')

fs.writeFileSync(new URL('../src/data/questions.json', import.meta.url), JSON.stringify(q, null, 1))
console.log(q.length)
