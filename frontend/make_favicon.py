from PIL import Image, ImageDraw

def create_weather_favicon():
    # Create a 32x32 image with RGBA mode for transparency
    size = 32
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background circle - blue sky
    draw.ellipse([0, 0, size-1, size-1], fill=(74, 144, 226, 255))
    
    # Sun - yellow circle
    sun_center = (12, 10)
    sun_radius = 4
    draw.ellipse([sun_center[0]-sun_radius, sun_center[1]-sun_radius, 
                  sun_center[0]+sun_radius, sun_center[1]+sun_radius], 
                 fill=(255, 193, 7, 230))
    
    # Cloud - white shapes
    # Main cloud body
    draw.ellipse([14, 16, 26, 24], fill=(255, 255, 255, 242))
    # Cloud bumps
    draw.ellipse([14, 14, 20, 20], fill=(255, 255, 255, 242))
    draw.ellipse([20, 14, 26, 20], fill=(255, 255, 255, 242))
    
    # Small cloud
    draw.ellipse([5, 22, 11, 26], fill=(255, 255, 255, 179))
    draw.ellipse([4, 21, 8, 25], fill=(255, 255, 255, 179))
    
    return img

# Create both ICO and PNG versions
favicon = create_weather_favicon()

# Save as ICO file with multiple sizes
favicon_ico_path = 'public/favicon.ico'
favicon.save(favicon_ico_path, format='ICO', sizes=[(16,16), (32,32), (48,48)])

# Save as PNG for better compatibility
favicon_png_path = 'public/favicon.png'
favicon.save(favicon_png_path, format='PNG')

print(f"Weather favicon created successfully:")
print(f"ICO: {favicon_ico_path}")
print(f"PNG: {favicon_png_path}")
