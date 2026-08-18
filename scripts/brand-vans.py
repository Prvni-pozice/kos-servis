#!/usr/bin/env python3
"""Nasadí logo firmy na servisní dodávky na fotkách pro /kontakt/.

Vozy zatím polepené nejsou – logo se do fotek dokresluje na přání klienta
(18. 8. 2026). Originální snímky zůstávají nedotčené v `public/img/firma/vyroba/`,
výsledek jde do `public/img/servisni-dodavky/`, takže se dá kdykoli přegenerovat
nebo zahodit. Až budou vozy polepené doopravdy, tenhle krok zmizí i s adresářem.

Logo se převádí na čistou bílou (podklad průhledný) a na každou fotku se sází
perspektivně na zadní boční panel – tedy na stejné fyzické místo vozu napříč
všemi snímky, jen z jiného úhlu. Souřadnice jsou v náhledu 900×675, protože
podle něj se vybíraly; na plnou velikost se přepočítají.

    python3 scripts/brand-vans.py
"""
from PIL import Image
import numpy as np
import os

SRC = 'public/img/firma/vyroba'
OUT = 'public/img/servisni-dodavky'
LOGO = 'public/img/brand/logo-kos.png'
PREVIEW_W = 900.0  # v jakém měřítku jsou souřadnice níž

# Prahy pro převod na bílou. Nad HI je podklad (bílá), pod LO plná kresba loga;
# mezi tím se alfa lineárně ramp-uje, takže zůstane vyhlazení hran. Rozmezí je
# nastavené tak, aby vypadl i světle šedý stín, který má logo v PNG pod sebou.
LUM_HI, LUM_LO = 238.0, 170.0

# Krytí bílé na modrém laku. Ne 100 %, ať to působí jako polep, ne jako nálepka
# přilepená na fotku v editoru.
OPACITY = 0.9

# Rohy plochy pro logo (TL, TR, BR, BL) v souřadnicích náhledu 900×675.
# Perspektiva odpovídá natočení vozu: čím víc je bok natočený od kamery,
# tím je čtyřúhelník užší.
VANS = [
    # Čelní tříčtvrteční pohled. Bok je silně zkrácený, takže je logo užší –
    # fyzicky je to stejně velký polep jako jinde, jen viděný pod ostrým úhlem.
    # Panel končí u otevřených dveří na x≈243, proto logo doběhne na 233.
    ('img-7216', [(143, 336), (233, 330), (233, 368), (143, 374)]),
    # Boční pohled s lehkým natočením; panel končí na x≈288.
    ('img-7214', [(120, 334), (270, 328), (270, 372), (120, 378)]),
    # img-7215 se z galerie vyřadil (18. 8. 2026) – panel je na něm vidět
    # nejkratší a logo tam nesedělo ani po dvou úpravách výšky a náklonu.
    # Nahradil ho záběr zezadu, na který se logo nekreslí; viz curate-galleries.mjs.
    # Čistý bok – prakticky bez perspektivy, panel má rezervu až k x≈345.
    ('img-7212', [(180, 336), (330, 335), (330, 379), (180, 380)]),
]


def bila_verze(cesta: str) -> Image.Image:
    """Z modrého loga na bílém podkladu udělá bílé logo na průhledném."""
    rgb = np.asarray(Image.open(cesta).convert('RGB'), dtype=np.float32)
    lum = rgb @ np.array([0.2126, 0.7152, 0.0722], dtype=np.float32)
    alpha = np.clip((LUM_HI - lum) / (LUM_HI - LUM_LO), 0.0, 1.0)

    out = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    out[..., :3] = 255                     # čistá bílá, žádný zbytek modré
    out[..., 3] = (alpha * 255).astype(np.uint8)
    im = Image.fromarray(out, 'RGBA')
    return im.crop(im.getchannel('A').getbbox())


def koeficienty(cil, zdroj):
    """Homografie pro Image.transform – mapuje bod výstupu zpět do vstupu."""
    m = []
    for (cx, cy), (zx, zy) in zip(cil, zdroj):
        m.append([zx, zy, 1, 0, 0, 0, -cx * zx, -cx * zy])
        m.append([0, 0, 0, zx, zy, 1, -cy * zx, -cy * zy])
    A = np.array(m, dtype=np.float64)
    B = np.array(cil, dtype=np.float64).reshape(8)
    return np.linalg.solve(A, B)


def main() -> None:
    os.makedirs(OUT, exist_ok=True)
    logo = bila_verze(LOGO)
    lw, lh = logo.size
    print(f'logo po převodu na bílou: {lw}×{lh}')

    for jmeno, rohy in VANS:
        foto = Image.open(f'{SRC}/{jmeno}.webp').convert('RGBA')
        k = foto.width / PREVIEW_W  # souřadnice jsou z náhledu, fotka je větší
        cil = [(x * k, y * k) for x, y in rohy]

        # Pillow potřebuje mapování výstup → vstup, proto je pořadí obrácené.
        coeffs = koeficienty([(0, 0), (lw, 0), (lw, lh), (0, lh)], cil)
        vrstva = logo.transform(foto.size, Image.PERSPECTIVE, coeffs,
                                resample=Image.BICUBIC)

        if OPACITY < 1.0:
            a = vrstva.getchannel('A').point(lambda v: int(v * OPACITY))
            vrstva.putalpha(a)

        hotovo = Image.alpha_composite(foto, vrstva).convert('RGB')
        cesta = f'{OUT}/{jmeno}.webp'
        hotovo.save(cesta, 'WEBP', quality=82, method=6)
        print(f'  {jmeno}  →  {cesta}  ({os.path.getsize(cesta) // 1024} kB)')


if __name__ == '__main__':
    main()
