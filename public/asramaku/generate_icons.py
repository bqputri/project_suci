import zlib
import struct
import math

def make_png(filename, size):
    width, height = size, size
    raw_data = bytearray()
    
    # Generate an attractive pastel gradient with rounded corners & flower
    cx, cy = width / 2.0, height / 2.0
    radius = width * 0.44
    corner_r = width * 0.22
    
    for y in range(height):
        raw_data.append(0) # filter byte: none
        for x in range(width):
            # check rounded box
            dx = max(abs(x - cx) - (cx - corner_r), 0)
            dy = max(abs(y - cy) - (cy - corner_r), 0)
            dist_sq = dx*dx + dy*dy
            
            if dist_sq > corner_r * corner_r:
                # Transparent outside rounded box
                raw_data.extend((0, 0, 0, 0))
                continue
                
            # Gradient: top-left pink (#fb7185) to bottom-right purple (#818cf8)
            t = (x + y) / float(width + height)
            r = int(251 * (1 - t) + 129 * t)
            g = int(113 * (1 - t) + 140 * t)
            b = int(133 * (1 - t) + 248 * t)
            a = 255
            
            # Draw simple central blossom motif
            dcx = x - cx
            dcy = y - cy
            d_center = math.sqrt(dcx*dcx + dcy*dcy)
            
            # Central yellow dot
            if d_center < width * 0.08:
                r, g, b = 254, 240, 138 # pastel yellow
            elif d_center < width * 0.22:
                # 5 petals
                angle = math.atan2(dcy, dcx)
                petal_dist = (width * 0.15) * (1 + 0.3 * math.cos(5 * angle))
                if d_center < petal_dist:
                    r, g, b = 255, 255, 255 # white petals
                    
            raw_data.extend((r, g, b, a))
            
    # PNG format construction
    def chunk(chunk_type, data):
        c = chunk_type + data
        crc = struct.pack(">I", zlib.crc32(c) & 0xffffffff)
        return struct.pack(">I", len(data)) + c + crc

    header = b'\x89PNG\r\n\x1a\n'
    ihdr = chunk(b'IHDR', struct.pack('>IIBBBBB', width, height, 8, 6, 0, 0, 0)) # 8-bit RGBA
    idat = chunk(b'IDAT', zlib.compress(bytes(raw_data), 9))
    iend = chunk(b'IEND', b'')

    with open(filename, 'wb') as f:
        f.write(header + ihdr + idat + iend)
    print(f"Generated {filename} ({width}x{height})")

if __name__ == "__main__":
    make_png(r"c:\exstrakomputer\icons\icon-192.png", 192)
    make_png(r"c:\exstrakomputer\icons\icon-512.png", 512)
