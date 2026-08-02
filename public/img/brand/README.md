# Loga

`logo-kos.png` je **prozatímní** — vyříznuté z `návrhy loga.png` na Google Drivu
(nižší rozlišení, starší kresba loga).

Ostré logo je v design projektu na claude.ai/design
(„KOS servis - industry", soubor `assets/logo-kos.png`, 1187×443, jiná modernizovaná
kresba s navy gradientem). Přes DesignSync API ho nelze stáhnout celé —
`get_file` ořezává odpověď na 256 KiB a soubor je větší, takže dorazí
poškozený. Je potřeba ho stáhnout ručně z webového rozhraní a nahradit tady.

`logo-kos-simple.png` (zjednodušená varianta) je v design projektu připravená
jako budoucí nástupce — nasadit, až to klient odsouhlasí.

## Co používá web

Hlavička sází **`logo-kos.webp`** (390×120, zobrazuje se ve 130×40 — tedy 3× pro
retinu). `logo-kos.png` je jen zdroj, ze kterého se WebP generuje; sám na web
nechodí, protože má 181 kB proti 5,5 kB u WebP a je nad ohybem na každé stránce.

Po výměně za ostré logo vygeneruj WebP znovu:

```bash
node -e "require('sharp')('public/img/brand/logo-kos.png').resize({width:390}).webp({quality:88}).toFile('public/img/brand/logo-kos.webp')"
```

Pokud dorazí SVG, použij rovnou to a WebP zahoď.
