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
const V = add('viet', 'viet')
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

V(1, 'letters', '🐟', 'Chữ cái đầu của từ "cá" là gì?', 'c', ['b', 'd'], 'Đọc chậm: cờ - á.', 'Từ "cá" bắt đầu bằng chữ c.')
V(2, 'letters', '🐱', 'Chữ cái đầu của từ "mèo" là gì?', 'm', ['n', 't'], 'Đọc chậm: mờ - èo.', 'Từ "mèo" bắt đầu bằng chữ m.')
V(3, 'letters', '🐔', 'Chữ cái đầu của từ "gà" là gì?', 'g', ['d', 'q'], 'Đọc chậm: gờ - à.', 'Từ "gà" bắt đầu bằng chữ g.')
V(4, 'letters', '🏠', 'Từ "nhà" bắt đầu bằng chữ ghép nào?', 'nh', ['ng', 'ch'], 'Đọc chậm: nhờ - à.', 'Từ "nhà" bắt đầu bằng nh.')
V(5, 'letters', '🌙', 'Từ "trăng" bắt đầu bằng chữ ghép nào?', 'tr', ['ch', 'th'], 'Đọc chậm: trờ - ăng.', 'Từ "trăng" bắt đầu bằng tr.')
V(6, 'letters', '🐘', 'Chữ cái đầu của từ "voi" là gì?', 'v', ['r', 'x'], 'Đọc chậm: vờ - oi.', 'Từ "voi" bắt đầu bằng chữ v.')
V(7, 'letters', '🐶', 'Từ "chó" bắt đầu bằng chữ ghép nào?', 'ch', ['tr', 'kh'], 'Đọc chậm: chờ - ó.', 'Từ "chó" bắt đầu bằng ch.')
V(8, 'letters', '🍎', 'Chữ cái đầu của từ "táo" là gì?', 't', ['đ', 'd'], 'Đọc chậm: tờ - áo.', 'Từ "táo" bắt đầu bằng chữ t.')
V(9, 'letters', '🐰', 'Từ "thỏ" bắt đầu bằng chữ ghép nào?', 'th', ['tr', 'kh'], 'Đọc chậm: thờ - ỏ.', 'Từ "thỏ" bắt đầu bằng th.')
V(10, 'letters', '⭐', 'Chữ cái đầu của từ "sao" là gì?', 's', ['x', 'c'], 'Đọc chậm: sờ - ao.', 'Từ "sao" bắt đầu bằng chữ s.')
V(11, 'rhymes', '🪑', 'Tiếng nào có vần "an"?', 'bàn', ['bố', 'cá'], 'Đọc to: b-àn. Nghe thấy "an" ở cuối.', 'Tiếng "bàn" có vần an.')
V(12, 'rhymes', '🐶', 'Tiếng nào có vần "on"?', 'con', ['bà', 'cô'], 'Đọc to: c-on. Nghe thấy "on" ở cuối.', 'Tiếng "con" có vần on.')
V(13, 'rhymes', '⭐', 'Tiếng nào có vần "ao"?', 'sao', ['bé', 'đi'], 'Đọc to: s-ao. Nghe thấy "ao" ở cuối.', 'Tiếng "sao" có vần ao.')
V(14, 'rhymes', '🎋', 'Tiếng nào có vần "ia"?', 'mía', ['mẹ', 'mũ'], 'Đọc to: m-ía. Nghe thấy "ia" ở cuối.', 'Tiếng "mía" có vần ia.')
V(15, 'rhymes', '🌸', 'Tiếng nào có vần "oa"?', 'hoa', ['hồ', 'hè'], 'Đọc to: h-oa. Nghe thấy "oa" ở cuối.', 'Tiếng "hoa" có vần oa.')
V(16, 'rhymes', '✌️', 'Tiếng nào có vần "ai"?', 'hai', ['hồ', 'hè'], 'Đọc to: h-ai. Nghe thấy "ai" ở cuối.', 'Tiếng "hai" có vần ai.')
V(17, 'rhymes', '✋', 'Tiếng nào có vần "ay"?', 'tay', ['tơ', 'tư'], 'Đọc to: t-ay. Nghe thấy "ay" ở cuối.', 'Tiếng "tay" có vần ay.')
V(18, 'rhymes', '🐱', 'Tiếng nào có vần "eo"?', 'mèo', ['bà', 'cá'], 'Đọc to: m-èo. Nghe thấy "eo" ở cuối.', 'Tiếng "mèo" có vần eo.')
V(19, 'rhymes', '🍚', 'Tiếng nào có vần "ôi"?', 'xôi', ['bàn', 'sao'], 'Đọc to: x-ôi. Nghe thấy "ôi" ở cuối.', 'Tiếng "xôi" có vần ôi.')
V(20, 'rhymes', '🐮', 'Tiếng nào có vần "ê"?', 'bê', ['bò', 'bà'], 'Đọc to: b-ê. Nghe thấy "ê" ở cuối.', 'Tiếng "bê" có vần ê.')
V(21, 'words', '🐶', 'Từ nào chỉ con vật?', 'chó', ['bàn', 'ghế'], 'Con vật biết chạy, bay hoặc bơi.', '"Chó" là một con vật.')
V(22, 'words', '🪑', 'Từ nào chỉ đồ vật?', 'ghế', ['mèo', 'gà'], 'Đồ vật là thứ ta dùng, không phải con vật.', '"Ghế" là đồ vật.')
V(23, 'words', '🍎', 'Từ nào chỉ một loại quả?', 'táo', ['bàn', 'cá'], 'Quả là thứ ta ăn được, mọc trên cây.', '"Táo" là một loại quả.')
V(24, 'words', '👴', 'Từ nào chỉ người thân trong gia đình?', 'ông', ['bút', 'vở'], 'Người thân là những người như bà, mẹ, bố...', '"Ông" là người thân.')
V(25, 'words', '🎨', 'Từ nào chỉ màu sắc?', 'đỏ', ['mẹ', 'bé'], 'Màu sắc như xanh, vàng...', '"Đỏ" là màu sắc.')
V(26, 'words', '📚', 'Bé ... bài. Chọn từ điền vào chỗ trống.', 'học', ['ngủ', 'ăn'], 'Bé làm gì với bài ở lớp?', '"Bé học bài" là câu đúng.')
V(27, 'words', '🐱', 'Có mấy tiếng trong "con mèo"?', '2', ['1', '3'], 'Vỗ tay theo từng tiếng: con - mèo.', '"Con mèo" có hai tiếng.')
V(28, 'words', '📖', 'Có mấy tiếng trong "bé học bài"?', '3', ['2', '4'], 'Vỗ tay theo từng tiếng: bé - học - bài.', '"Bé học bài" có ba tiếng.')
V(29, 'words', '🔤', 'Ghép b + à. Ta được tiếng nào?', 'bà', ['bê', 'bú'], 'Đọc nối: bờ - à = bà.', 'b ghép với à được "bà".')
V(30, 'words', '🔠', 'Chữ in hoa của chữ "b" là gì?', 'B', ['D', 'P'], 'Chữ B có hai cái bụng.', 'Chữ in hoa của b là B.')

fs.writeFileSync(new URL('../src/data/questions.json', import.meta.url), JSON.stringify(q, null, 1))
console.log(q.length)
