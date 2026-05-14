# TIMELESS — Site Setup

Sito gallery per i 3 format: P.O.V., Time2Ape, Not So Rich.  
Le foto vengono caricate automaticamente da Cloudinary tramite tag — zero manutenzione.

---

## Stack
- **Next.js 14** — framework React
- **Cloudinary** — hosting foto, recuperate via tag
- **Vercel** — deploy automatico da GitHub

---

## Setup locale

```bash
# 1. Clona il repo
git clone https://github.com/TUO_USERNAME/timeless-site.git
cd timeless-site

# 2. Installa dipendenze
npm install

# 3. Crea il file delle variabili d'ambiente
cp .env.example .env.local
# Apri .env.local e inserisci le tue credenziali Cloudinary

# 4. Avvia in locale
npm run dev
# → http://localhost:3000
```

---

## Credenziali Cloudinary

Vai su [cloudinary.com](https://cloudinary.com) → Dashboard → copia:
- **Cloud Name**
- **API Key**
- **API Secret**

Mettile in `.env.local` (locale) e nelle **Environment Variables** di Vercel (produzione).

---

## Deploy su Vercel

1. Vai su [vercel.com](https://vercel.com) → **New Project**
2. Importa il repository GitHub
3. In **Environment Variables** aggiungi:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
4. Click **Deploy** → fatto!

Ogni push su `main` fa il deploy automaticamente.

---

## Come aggiungere nuove foto

**Non devi toccare il codice.** Basta:
1. Caricare la foto su Cloudinary
2. Aggiungere il tag corretto: `pov`, `t2a`, oppure `nsr`
3. La foto appare sul sito entro ~5 minuti (cache)

---

## Struttura tag Cloudinary

| Format      | Tag Cloudinary |
|-------------|---------------|
| P.O.V.      | `pov`         |
| Time2Ape    | `t2a`         |
| Not So Rich | `nsr`         |
