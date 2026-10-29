#!/usr/bin/env python3
"""Vloží do skenů certifikátů na /certifikaty/ jemný vodoznak s logem KOS.

Na přání klienta (29. 10. 2026). Originální skeny zůstávají nedotčené v `docs/`,
výsledek jde do `public/dokumenty/`, takže se dá kdykoli přegenerovat.

Skeny jsou jen obrázky stránek bez textové vrstvy, proto se nic nepřekresluje –
logo se přidá jako další průhledný obrázek nad sken. Logo se převede na modrou
kresbu s průhledným podkladem, natočí se po úhlopříčce a sází se s nízkým
krytím doprostřed každé stránky.

    python3 scripts/watermark-pdfs.py
"""
import io
import os
import unicodedata
import numpy as np
import pymupdf
from PIL import Image

LOGO = 'public/img/brand/logo-kos.png'
OUT = 'public/dokumenty'
DOCS = {
    'docs/certifikát 3834 - 2 2020.pdf': 'certifikat-csn-en-iso-3834-2.pdf',
    'docs/rozhodnutí o vydání oprávnění.pdf': 'opravneni-zdvihaci-zarizeni.pdf',
    'docs/Oprávnění revize a zkoušky provozovaných tlakových zařízení.pdf': 'opravneni-tlakova-zarizeni.pdf',
}

# Krytí kresby loga. Text dokumentu musí zůstat bez potíží čitelný i tam,
# kde přes něj logo přechází.
OPACITY = 0.08
ANGLE = 35        # stupně proti směru hodinových ručiček
WIDTH = 0.85      # šířka loga (před natočením) vůči šířce stránky
LUM_HI, LUM_LO = 238.0, 170.0  # převod bílého podkladu na průhlednost, viz brand-vans.py


def watermark_png():
    rgb = np.asarray(Image.open(LOGO).convert('RGB')).astype(np.float32)
    lum = rgb @ [0.299, 0.587, 0.114]
    alpha = np.clip((LUM_HI - lum) / (LUM_HI - LUM_LO), 0, 1) * OPACITY * 255
    rgba = np.dstack([rgb, alpha]).astype(np.uint8)
    img = Image.fromarray(rgba, 'RGBA').rotate(ANGLE, expand=True, resample=Image.BICUBIC)
    buf = io.BytesIO()
    img.save(buf, 'PNG', optimize=True)
    return buf.getvalue(), img.size


def find(path):
    # Názvy v docs/ přišly z macOS rozložené (NFD), ve zdrojáku jsou složené (NFC).
    d, base = os.path.split(path)
    for f in os.listdir(d):
        if unicodedata.normalize('NFC', f) == unicodedata.normalize('NFC', base):
            return os.path.join(d, f)
    raise FileNotFoundError(path)


def main():
    png, (w, h) = watermark_png()
    for src, name in DOCS.items():
        doc = pymupdf.open(find(src))
        for page in doc:
            r = page.rect
            ww = r.width * WIDTH * w / Image.open(LOGO).width
            wh = ww * h / w
            box = pymupdf.Rect(r.x0 + (r.width - ww) / 2, r.y0 + (r.height - wh) / 2,
                               r.x0 + (r.width + ww) / 2, r.y0 + (r.height + wh) / 2)
            # Skeny z Ricohu mají stránku otočenou o 270°. insert_image bere obdélník
            # v neotočených souřadnicích a obrázek sám neotočí – bez obojího by logo
            # leželo napříč, pozpátku a mimo střed.
            page.insert_image(box * page.derotation_matrix, stream=png, overlay=True,
                              rotate=page.rotation)
        doc.save(f'{OUT}/{name}', garbage=3, deflate=True)
        print(f'{OUT}/{name}  {len(doc)} str.')


if __name__ == '__main__':
    main()
