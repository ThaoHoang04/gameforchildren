# Kế hoạch triển khai — Bé Diện Xinh

Nguồn: `Be_Dien_Xinh_Game_Design_Plan_Asset_Guide.docx` (v1.0, 22/10/2026)

**Sản phẩm:** Web game 2D mặc đồ cho búp bê, kết hợp Toán + Tiếng Việt lớp 1 (bé 6–7 tuổi).
**Cơ chế cốt lõi:** Chọn đồ chưa mở khóa → câu hỏi ngẫu nhiên → đúng thì mở khóa vĩnh viễn, sai thì giữ khóa + gợi ý + thử lại.
**Nền tảng:** Web responsive (ưu tiên điện thoại/tablet/laptop), Chrome/Edge hiện đại.
**Thời gian:** 3 sprint (~3 tuần) + Sprint 0 (2 ngày). Giả định 1 dev biết React cơ bản.

---

## 1. Phạm vi MVP

| Hạng mục | Trong MVP | Ngoài MVP |
|---|---|---|
| Phong cách | 3 theme: Công chúa pastel, Fashion hiện đại, Chibi | Tự tạo nhân vật từ đầu |
| Nhân vật | 1 búp bê dạng layer, tái dùng cho 3 theme | Nhiều nhân vật / đối thoại |
| Đồ mặc | ~20–30 món/phong cách (váy/áo/quần/tóc/giày/phụ kiện) | Hàng trăm đồ, cửa hàng phức tạp |
| Câu hỏi | 30 Toán + 30 Tiếng Việt | Cá nhân hóa AI, tài khoản giáo viên |
| Tiến trình | localStorage | Đồng bộ cloud |
| Khác | Không thanh toán/quảng cáo, không thu thập dữ liệu cá nhân | App native, multiplayer |

## 2. Luật nghiệp vụ (cần cài đặt đúng)

- Chọn món **đã sở hữu** → mặc/tháo/phối lại, **không hỏi**.
- Chọn món **chưa sở hữu** → lấy 1 câu hỏi, mở modal.
- Môn chọn ngẫu nhiên, mặc định 50/50, **có thể cấu hình**; không có nút chọn môn.
- Không quá 2 lần liên tiếp cùng môn (nếu còn câu môn kia phù hợp).
- Ưu tiên câu chưa xuất hiện gần đây; tránh lặp trong phiên.
- Độ khó theo `stage` đã cấu hình, không vượt nội dung đã học.
- Đúng: phản hồi vui → thêm vào `unlockedItems` → lưu → mặc ngay.
- Sai: không mở khóa, không mặc được; phản hồi dịu dàng + gợi ý + thử lại. Không phạt mất đồ.
- Đổi theme: giữ `unlockedItems` theo item ID, chỉ hiển thị item của theme đang chọn.
- Save data có `version` để nâng cấp cấu trúc sau này.
- Chỉ lưu đúng/sai để điều chỉnh trải nghiệm trong phiên; không thu thập thông tin cá nhân.

## 3. Màn hình & tiêu chí hoàn thành

| Màn hình | Thành phần | Hoàn thành khi |
|---|---|---|
| Home | Logo, minh họa, Chơi ngay, Tiếp tục | Bắt đầu chơi trong 1 thao tác |
| Chọn phong cách | 3 thẻ, preview, xác nhận | Phong cách được lưu |
| Dress-up studio | Búp bê, tủ đồ, danh mục, hoàn tác/tháo | Chọn đồ khóa → mở popup câu hỏi |
| Question modal | Câu hỏi, 2–4 đáp án, phản hồi, gợi ý | Sai không mở khóa; đúng mở khóa + đóng popup |
| Collection | Đồ đã mở, còn khóa, bộ phối gần nhất | Khớp dữ liệu đã lưu |
| Save/continue | Tự lưu, thông báo nhỏ | Reload vẫn giữ đồ đã mở |

## 4. Kiến trúc kỹ thuật

- **Frontend:** React + TypeScript + Vite
- **Style:** CSS Modules hoặc Tailwind
- **Ghép đồ:** PNG layer absolute-positioned (hoặc canvas), theo thứ tự z-index
- **Câu hỏi:** JSON tĩnh có schema (`id, subject, stage, type, prompt, choices, answer, hint, explanation`)
- **Lưu:** localStorage (có `version`)
- **Test:** Vitest (logic) + Playwright (luồng UI)

Module gợi ý: `questionPicker` (random + chống lặp), `unlockStore` (unlock + persist), `themeConfig`, `DollRenderer`, `QuestionModal`, `Wardrobe`.

## 5. Asset

| Ưu tiên | Nguồn | Mục đích | Lưu ý |
|---|---|---|---|
| A | Doll DressUp Assets (MaelleMarylloup) | Base búp bê + layer | CC0; kiểm tra phối với bộ đồ khác |
| A | Doll outfits [80+ items] | Đồ casual/modern | Free; xem điều khoản khi tải |
| A | Outfits Fantasy (250+) | Đồ, phụ kiện fantasy | Free; không bán lại riêng lẻ |
| A | Kenney UI Pack | Nút, panel UI | CC0 |
| B | Fantasy Armor 1/2 — Chibi | Tham khảo theme chibi | Chủ đề giáp, có thể không hợp |
| C | Pixel Dress-Up Kit | Tham khảo cấu trúc | Trả phí, pixel, lệch art |

Quy tắc: cùng tỷ lệ/góc nhìn/điểm neo; PNG trong suốt, mỗi món 1 file; **không** lấy ảnh Pinterest/Google không rõ license; ghi **asset log** (URL, tác giả, ngày tải, license, giới hạn) cho mọi asset.

## 6. Kế hoạch sprint

### Sprint 0 — Chốt art & setup (2 ngày)
- [x] Tải thử 2–3 bộ asset, đọc & lưu file license
- [x] Tạo asset log (URL / tác giả / ngày / license)
- [x] Chọn base doll, thử ghép layer + kiểm tra tỷ lệ/anchor
- [x] Tạo repo (Vite + React + TS), lint/format
- [ ] Wireframe các màn hình
- **DoD:** Búp bê mặc được ≥2 món khác nhau; asset log đủ URL/license.

### Sprint 1 — Luồng game cơ bản (4–5 ngày)
- [x] Home, chọn 3 phong cách, studio, tủ đồ
- [x] `DollRenderer` (layer + z-order), danh mục đồ, tháo/hoàn tác
- [x] Item data theo theme (id, category, layer, theme, ảnh)
- [x] Responsive cơ bản
- **DoD:** Chọn theme, thay thử đồ đã mở; không vỡ layout trên laptop/tablet.

### Sprint 2 — Câu hỏi & luật khóa đồ (4–5 ngày)
- [x] Schema + question bank JSON (bản đầu)
- [x] `questionPicker`: random môn theo tỷ lệ cấu hình, ≤2 liên tiếp, tránh lặp
- [x] Question modal: đúng/sai, gợi ý, thử lại
- [x] `unlockStore` + localStorage có version
- [x] Icon ổ khóa, luồng `onSelectItem` / `onAnswer`
- **DoD:** Sai không mặc được; đúng mở khóa; reload vẫn lưu; đồ đã sở hữu không hỏi lại.

### Sprint 3 — Polish & test (4–5 ngày)
- [x] Hiệu ứng, âm thanh, màn Collection, thông báo tự lưu
- [~] Hoàn thiện 60 câu (đã soạn đủ 60; còn chờ người rà soát thủ công)
- [x] Accessibility: nút/chữ lớn, không chỉ dùng màu đúng/sai, modal không bị cắt
- [x] Vitest + Playwright (đúng / sai / reload / đổi theme)
- [~] Sửa lỗi, kiểm tra license lần cuối (đã ghi ASSET_LOG; chờ xác nhận license bộ casual nếu dùng)
- **DoD:** Chạy trọn luồng Home → phối đồ; mọi test chính qua.

## 7. Checklist kiểm thử

- [x] Chọn món khóa luôn hiện đúng 1 câu hỏi
- [x] Câu hỏi luôn Toán hoặc Tiếng Việt, không chọn môn thủ công
- [x] Sai → không vào `unlockedItems`, không render lên búp bê
- [x] Đúng → mở khóa, mặc ngay, lưu
- [x] Reload → đồ đã mở dùng được, không hỏi lại
- [x] Đổi theme → không mất tiến trình, không hiện nhầm item
- [x] Không câu trùng liên tục khi còn câu khác
- [x] Nút/chữ/đáp án đủ lớn; không chỉ phân biệt bằng màu
- [x] Chuột + cảm ứng; popup không bị cắt trên màn nhỏ
- [x] Không thu thập dữ liệu cá nhân

## 8. Rủi ro & xử lý

| Rủi ro | Xử lý |
|---|---|
| Asset lệch tỷ lệ/layer | Prototype ghép layer trước UI; chọn bộ đồng bộ hoặc chỉnh anchor |
| 3 phong cách quá khác nhau | Dùng chung UI/logic; theme chỉ đổi nhân vật, palette, nền, bộ đồ |
| Câu hỏi vượt chương trình | Gắn stage/skill; chỉ lấy câu hợp giai đoạn |
| Trẻ đoán mò/spam | Gợi ý sau sai, giải thích ngắn, không phạt nặng |
| License không rõ | Lưu URL/license/tác giả/ngày; không dùng asset chưa xác minh |

## 9. Tiêu chí nghiệm thu MVP

- [x] Chọn được 1 trong 3 phong cách
- [x] Chọn, mở khóa, mặc, tháo nhiều món
- [x] Môn học ngẫu nhiên, mặc định 50/50, cấu hình được
- [x] Sai → vẫn khóa; đúng → mở khóa vĩnh viễn
- [x] Reload vẫn giữ tiến trình
- [~] ≥30 câu Toán + ≥30 câu Tiếng Việt (đủ 60; chờ người rà soát thủ công)
- [x] Không lỗi nghiêm trọng ở luồng chọn đồ, trả lời, lưu, đổi theme

## 10. Việc cần quyết định sớm

1. Base doll + bộ đồ nào đủ đồng bộ cho cả 3 theme (hay giảm còn 1–2 theme nếu art không khớp)?
2. Ghép layer bằng DOM absolute hay canvas?
3. Nội dung 60 câu hỏi: ai soạn và rà soát theo chương trình lớp 1?
