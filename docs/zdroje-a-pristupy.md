# Zdroje a přístupy

Všechny externí podklady k projektu na jednom místě. Bez tohohle seznamu se
identifikátory složek a dokumentů hledají znovu a dlouho.

## Design systém

**claude.ai/design → projekt „KOS servis - industry"**
`503fce73-96ac-40c0-b3a4-d4ac80fc6d85`

Přístup jen přes nástroj `DesignSync`. Klíčové soubory:

```
readme.md                            popis systému prózou + DO/DON'T pravidla
styles.css                           tokeny + komponentní vrstva (převzato do src/styles/)
theme.json                           strojově čitelné tokeny
uploads/kos-servis-design-brief.md   brief: záměr, publikum, otevřené body
templates/homepage-v2/               úvodka, kterou jsme použili jako výchozí
templates/sluzby/                    rozcestník
templates/paleni-plazmou/            referenční detail služby
templates/kontakt/                   kontakt s lidmi napřed
```

**Pozor: `get_file` ořezává na 256 KiB.** `assets/logo-kos.png` (1187×443)
a `assets/logo-kos-simple.png` (1208×440) proto nelze stáhnout — vrátí se
poškozené s `truncated: true`. Podrobně v `/data/bot/DESIGN-CODE-PIPELINE.md`.

Komponenty pushnuté zpět z tohoto projektu: `components/gallery.html`,
`timeline.html`, `breadcrumbs.html`, `navigation-mobile.html`, `form-states.html`.
Zdroje jsou v `design-sync/components/`.

## Obsahové dokumenty (Google Docs)

```
1pcoub8QN02lR-gMfGHJaTK1-e1eUFyTWwlA7GKgmsnw   Návrh struktury webu KOS servis
                                               ← HLAVNÍ zdroj obsahu: struktura, 9 služeb,
                                                 historie firmy, kariéra, kontakty
1ZIqvaeSelc4thUxhh07gAg7ogxCiRBKinVg8PZ5asXs   Úpravy struktury v2
                                               ← jen srovnávací poznámka + 2 otázky na klienta
```

Čtení přes `mcp__claude_ai_Google_Drive__read_file_content`. Vyžaduje připojený
konektor „claude.ai Google Drive" (`/mcp`).

## Google Drive — média

```
1_fRNGCbs5VKTJoZRQJ75QwJB_zMJppCt   Loga a texty
                                    ← návrhy loga.png (aktuální + 4 návrhy modernizace)
1vclDaYNst_KJqT2JvuCTbHeDJel8sbF3   Videa
                                    ← header-kos-servis.mp4 (hero), kontakt-video.mp4
1pa1wWQIsqCLaq1FY4xy5ZyZYETZLPzYY   Fotky z výroby (87 HEIC)
1GsUNSGMOoiG-aEiy3bWyKTl5oPy095DH   Jarní průchod firmou (31 HEIC + ~40 videí, ~1 GB)
```

### Jak z Drivu stahovat

Složky jsou sdílené odkazem, takže binárky jdou přes `curl` — a to je jediná
rozumná cesta, protože MCP vrací base64 do kontextu:

```bash
curl -sL -o soubor.bin "https://drive.google.com/uc?export=download&id=<FILE_ID>"
```

Kontrola, že nedorazila přihlašovací stránka místo souboru:

```bash
head -c 15 soubor.bin   # HTML = soubor není sdílený odkazem
```

**Seznam souborů nelze brát z HTML stránky složky** — donačítá se JavaScriptem
a část položek chybí. Autoritativní výpis dává
`mcp__claude_ai_Google_Drive__search_files` s dotazem `parentId = '<ID>'`.
Proto je seznam 118 fotek uložený natvrdo v `scripts/drive-photos.json`.

## Starý web

`https://www.kos-servis.cz` — v provozu, nahrazujeme ho.

Zrcadlo pro vytěžení obsahu a fotek:

```bash
wget --mirror --page-requisites --adjust-extension --convert-links \
     --no-parent --reject-regex '\?' -e robots=off https://www.kos-servis.cz/
```

Vytěžené texty jsou v `docs/podklady-stary-web.md`. Odtud pocházejí **reálná
telefonní čísla a e-maily** (design systém i dokumenty mají jen `+420 XXX XXX XXX`)
a kompletní tabulky parametrů plazmového střediska.

Ve zrcadle je i staré hero video `media/fullhd/111/kos-servis-s-r-o-uvod-web.mp4`
(24 MB) — nepoužité, nahradilo ho novější klientské.

## SMTP pro poptávkový formulář

Není nastavené. Vzor proměnných v `.env.example`, na Vercelu nastavit jako
env proměnné. Podle dřívějších projektů: `1pmail.cz`, port 587, STARTTLS.
