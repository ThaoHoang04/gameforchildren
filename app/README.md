# Bé Diện Xinh

Web game mặc đồ cho búp bê kết hợp Toán và Tiếng Việt lớp 1. Kế hoạch: [../PLAN.md](../PLAN.md).

## Chạy

```bash
npm install --legacy-peer-deps   # --legacy-peer-deps tránh lỗi arborist của npm trên máy này
npm run dev                      # http://localhost:5173
npm run dev -- --host            # thử trên điện thoại cùng wifi
npm run build && npm run preview # bản build
```

Cần Node 20.19+ hoặc 22.12+ (Vite 8). Nếu gặp lỗi "Cannot find native binding", cài binding của máy:
`npm i -D @rolldown/binding-win32-x64-msvc@<version rolldown> @oxlint/binding-win32-x64-msvc@<version oxlint> --legacy-peer-deps`.

## Test

```bash
npm test      # Vitest: chọn câu hỏi, mặc đồ, lưu dữ liệu, ngân hàng câu hỏi
npm run e2e   # Playwright (Edge): trả lời sai/đúng, reload, đổi theme, màn hình điện thoại
npm run lint
```

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `src/data/questions.json` | 60 câu hỏi (sinh từ `scripts/gen-questions.mjs`) |
| `src/data/items.ts` | Danh sách đồ theo phong cách |
| `src/data/config.ts` | Tỷ lệ Toán/Việt, giai đoạn học đang bật, màu theme |
| `src/logic/` | `questionPicker`, `outfit`, `save`, `sound` |
| `src/components/Doll.tsx` | Vẽ búp bê và đồ (vector tạm, thay bằng PNG layer sau này) |
| `../assets-raw/ASSET_LOG.md` | Nguồn và license các asset đã tải |

## Cấu hình nhanh

- Đổi tỷ lệ môn: `GAME_CONFIG.mathRatio` trong `src/data/config.ts`.
- Chỉ bật giai đoạn đã học: sửa `GAME_CONFIG.activeStages`.
- Xóa tiến trình khi thử: xóa key `be-dien-xinh-save` trong localStorage.
