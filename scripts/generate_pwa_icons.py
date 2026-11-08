import zlib
import struct
import math
import os

def create_png(width, height, pixel_fn):
    raw_data = bytearray()
    for y in range(height):
        raw_data.append(0)  # Filter type 0 (None)
        for x in range(width):
            r, g, b, a = pixel_fn(x, y, width, height)
            raw_data.extend([
                max(0, min(255, int(r))),
                max(0, min(255, int(g))),
                max(0, min(255, int(b))),
                max(0, min(255, int(a)))
            ])

    def chunk(tag, data):
        return struct.pack('>I', len(data)) + tag + data + struct.pack('>I', zlib.crc32(tag + data) & 0xffffffff)

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0))
    idat = chunk(b'IDAT', zlib.compress(bytes(raw_data), 9))
    iend = chunk(b'IEND', b'')
    return header + ihdr + idat + iend

def clamp(val, low=0.0, high=1.0):
    return max(low, min(high, val))

def lerp(a, b, t):
    return a + (b - a) * t

def render_icon(x, y, w, h, is_maskable=False):
    # Normalized coordinates [-1, 1]
    nx = (x / (w - 1)) * 2.0 - 1.0
    ny = (y / (h - 1)) * 2.0 - 1.0
    
    # Scale factor: if maskable, shrink logo by 0.72 to preserve 15% safe margin
    scale = 0.70 if is_maskable else 0.88
    
    # Corner squircle / rounded rect for non-maskable
    if not is_maskable:
        # Distance to rounded rect (corner radius ~0.24)
        corner_r = 0.38
        cx = abs(nx) - (1.0 - corner_r)
        cy = abs(ny) - (1.0 - corner_r)
        if cx > 0 and cy > 0:
            corner_dist = math.sqrt(cx * cx + cy * cy)
            if corner_dist > corner_r:
                # Outside rounded rect
                return (0, 0, 0, 0)

    # Base Background Gradient (from #111827 to #030712)
    diag = (nx + ny + 2.0) / 4.0
    bg_r = lerp(17.0, 5.0, diag)
    bg_g = lerp(24.0, 8.0, diag)
    bg_b = lerp(39.0, 16.0, diag)
    bg_a = 255.0

    # Tech border for standard icons
    if not is_maskable:
        dist_to_edge = max(abs(nx), abs(ny))
        if 0.94 <= dist_to_edge <= 0.98:
            bg_r = lerp(bg_r, 227.0, 0.35)
            bg_g = lerp(bg_g, 30.0, 0.35)
            bg_b = lerp(bg_b, 43.0, 0.35)

    # Transform coordinates into logo space
    lx = nx / scale
    ly = ny / scale
    dist_center = math.sqrt(lx * lx + ly * ly)

    # Isometric 3D Box facets in background of logo
    # Box center is at ly=0.08
    bx = lx
    by = ly - 0.05
    # Diamond top face: abs(bx) / 0.55 + abs(by + 0.28) / 0.30 <= 1
    # We can render a soft glow behind the monogram
    glow_strength = clamp(1.0 - (dist_center / 0.85), 0.0, 1.0)
    if glow_strength > 0:
        bg_r += 227.0 * glow_strength * 0.22
        bg_g += 30.0 * glow_strength * 0.08
        bg_b += 43.0 * glow_strength * 0.08

    # O Monogram Ring: outer radius = 0.65, inner radius = 0.34
    r_outer = 0.65
    r_inner = 0.34
    aa = 2.5 / (w * scale * 0.5)

    if (r_inner - aa) <= dist_center <= (r_outer + aa):
        # Calculate coverage (antialiasing)
        outer_cov = clamp((r_outer - dist_center) / aa, 0.0, 1.0)
        inner_cov = clamp((dist_center - r_inner) / aa, 0.0, 1.0)
        cov = outer_cov * inner_cov

        if cov > 0:
            # Red gradient for O: top is vibrant #ff3b47, bottom is #a3121b
            t_ring = (ly + 0.65) / 1.30
            ring_r = lerp(255.0, 150.0, t_ring)
            ring_g = lerp(59.0, 15.0, t_ring)
            ring_b = lerp(71.0, 24.0, t_ring)

            # Highlight rim on top-left
            angle = math.atan2(ly, lx)
            rim_light = math.cos(angle - (-2.3)) * 0.5 + 0.5
            ring_r = lerp(ring_r, 255.0, rim_light * 0.28)
            ring_g = lerp(ring_g, 160.0, rim_light * 0.20)
            ring_b = lerp(ring_b, 170.0, rim_light * 0.20)

            bg_r = lerp(bg_r, ring_r, cov)
            bg_g = lerp(bg_g, ring_g, cov)
            bg_b = lerp(bg_b, ring_b, cov)

    # Center Gold Rhombus / Spark (Packaging folding crest)
    # Rhombus defined by |lx| / 0.16 + |ly| / 0.26 <= 1
    rhomb_dist = (abs(lx) / 0.16) + (abs(ly) / 0.25)
    rhomb_aa = aa * 4.0
    if rhomb_dist <= (1.0 + rhomb_aa):
        rhomb_cov = clamp((1.0 - rhomb_dist) / rhomb_aa, 0.0, 1.0)
        if rhomb_cov > 0:
            # Gold gradient #fde047 to #ca8a04
            t_rhomb = (ly + 0.25) / 0.50
            g_r = lerp(253.0, 180.0, t_rhomb)
            g_g = lerp(224.0, 120.0, t_rhomb)
            g_b = lerp(71.0, 10.0, t_rhomb)

            bg_r = lerp(bg_r, g_r, rhomb_cov)
            bg_g = lerp(bg_g, g_g, rhomb_cov)
            bg_b = lerp(bg_b, g_b, rhomb_cov)

    # Core white dot at exact center
    if dist_center <= (0.045 + aa):
        dot_cov = clamp((0.045 - dist_center) / aa, 0.0, 1.0)
        bg_r = lerp(bg_r, 255.0, dot_cov)
        bg_g = lerp(bg_g, 255.0, dot_cov)
        bg_b = lerp(bg_b, 255.0, dot_cov)

    return (bg_r, bg_g, bg_b, bg_a)

os.makedirs('public', exist_ok=True)

targets = [
    ('public/pwa-192x192.png', 192, 192, False),
    ('public/pwa-512x512.png', 512, 512, False),
    ('public/pwa-maskable-512x512.png', 512, 512, True),
    ('public/apple-touch-icon.png', 180, 180, False),
    ('public/favicon.png', 64, 64, False),
]

for path, w, h, maskable in targets:
    print(f'Rendering {path} ({w}x{h}, maskable={maskable})...')
    png_bytes = create_png(w, h, lambda x, y, width, height: render_icon(x, y, width, height, maskable))
    with open(path, 'wb') as f:
        f.write(png_bytes)
    print(f'Done {path}: {len(png_bytes)} bytes.')

# Also generate favicon.ico (can be a copy of 64x64 png or valid single-image ICO)
with open('public/favicon.png', 'rb') as f:
    png_data = f.read()

# ICO container wrapping PNG
ico_header = struct.pack('<HHH', 0, 1, 1) # reserved, type 1 (icon), 1 image
# ICONDIRENTRY: width, height, colors, reserved, planes, bpp, size, offset
ico_entry = struct.pack('<BBBBHHII', 64, 64, 0, 0, 1, 32, len(png_data), 6 + 16)
with open('public/favicon.ico', 'wb') as f:
    f.write(ico_header + ico_entry + png_data)
print('Done public/favicon.ico.')
