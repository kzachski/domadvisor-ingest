# DomAdvisor Ingest – szybkie wdrożenie na Vercel (domadvisor.pl)

## 1) Co dostajesz
- `/api/ingest.js` – serwerless API, które pobiera stronę ogłoszenia i wyciąga pola (JSON-LD + OG + heurystyki).
- `test-online.html` – prosta strona do testu LIVE.
- `package.json` + `vercel.json` – gotowe do wrzucenia na Vercel.

## 2) 3 kroki wdrożenia
1. Wejdź na https://vercel.com, załóż konto (Google/GitHub).
2. Kliknij **Add New… → Project → Import** i przeciągnij folder ZIP tego projektu.
3. Po deployu dodaj domenę **domadvisor.pl** w Vercel → Domains (przeniesiesz DNS lub ustawisz CNAME).

Po podpięciu domeny, API będzie pod:
```
https://domadvisor.pl/api/ingest
```

## 3) Test
Otwórz w przeglądarce:
```
https://domadvisor.pl/test-online.html
```
Wklej link z Otodom/OLX/Morizon/Gratka → **POBIERZ DANE**.

> Uwaga: to API nie używa Playwright (działa na fetch + cheerio). Większość ogłoszeń ma JSON-LD/OG, więc zadziała. Część ogłoszeń może wymagać mocniejszego renderowania JS – wtedy można przenieść backend na np. Railway/Render z Playwrightem.

## 4) Nagłówki CORS
API jest otwarte (`Access-Control-Allow-Origin: *`), więc możesz wywoływać je z dowolnej podstrony domadvisor.pl.
