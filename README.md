# gidersen.com (Vite + React + Tailwind)

## Kurulum
```bash
npm install
npm run dev
```

## Build (canlıya almak için)
```bash
npm run build
```
Build çıktısı: `dist/`

## Deploy seçenekleri
- **Statik hosting (önerilen):** Cloudflare Pages / Netlify / Vercel
  - Build command: `npm run build`
  - Output directory: `dist`
- **Kendi sunucunuz (Nginx/Apache):**
  - `dist/` klasörünü sunucuya kopyalayın ve statik site olarak servis edin.
