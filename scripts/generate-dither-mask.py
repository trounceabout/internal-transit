"""Generate the theme-dissolve mask as a 1-bit-alpha PNG.

Cell grid with per-row probability ramping from sparse (leading edge) to
solid, matching the density curve measured off alike.page's divider:
~2% at the first row rising to ~87% by the last.

Written with zlib + struct only so it needs no third-party imports.
"""
import zlib, struct, random, base64

COLS, ROWS = 64, 10          # tile is 64 cells wide, 10 rows deep
random.seed(20260729)         # deterministic: same tile every build

# Density curve. Eased so it starts very sparse, accelerates through the
# middle, and saturates at the end — an even linear ramp reads mechanical.
def density(row):
    t = row / (ROWS - 1)
    return round(t ** 1.6, 4)

grid = [[1 if random.random() < density(r) else 0 for _ in range(COLS)]
        for r in range(ROWS)]

def chunk(tag, data):
    return (struct.pack(">I", len(data)) + tag + data
            + struct.pack(">I", zlib.crc32(tag + data) & 0xFFFFFFFF))


def encode(g):
    """8-bit greyscale+alpha PNG (colour type 4).

    Grey is always 0; only alpha varies, which is all a mask reads.
    """
    raw = b""
    for row in g:
        raw += b"\x00"                     # filter type 0 (None) per scanline
        for cell in row:
            raw += bytes([0, 255 if cell else 0])   # grey, alpha
    return (b"\x89PNG\r\n\x1a\n"
            + chunk(b"IHDR", struct.pack(">IIBBBBB", COLS, ROWS, 8, 4, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(raw, 9))
            + chunk(b"IEND", b""))

def preview(g, title):
    print(f"\n{title}")
    for r, row in enumerate(g):
        bar = "".join("#" if c else "." for c in row[:48])
        print(f"{r:>3}  {sum(row) / COLS:>5.0%}  {bar}")


# The ramp runs one way, so the upward sweep needs a vertically mirrored copy
# to keep its sparse end pointing at the leading edge.
flipped = list(reversed(grid))
png_down = encode(grid)
png_up = encode(flipped)

preview(grid, "--dither-noise (downward sweep, going dark)")
preview(flipped, "--dither-noise-flipped (upward sweep, going light)")

print(f"\n{COLS}x{ROWS} cells — {len(png_down)} and {len(png_up)} bytes")
print("\nPaste these into the :root block in src/styles/global.css:\n")
print(f'  --dither-noise: url("data:image/png;base64,'
      f'{base64.b64encode(png_down).decode()}");')
print(f'  --dither-noise-flipped: url("data:image/png;base64,'
      f'{base64.b64encode(png_up).decode()}");')
