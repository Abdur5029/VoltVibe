import sqlite3
import os
import urllib.request
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

speaker_data = [
    {
        "url": "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=800",
        "name": "Marshall Acton II Wireless",
        "desc": "Classic vintage design bluetooth speaker with deep bass and clear highs.",
        "price": 249.99
    },
    {
        "url": "https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800",
        "name": "Bose SoundLink Mini II",
        "desc": "Ultra-compact portable speaker delivering deep, rich sound.",
        "price": 199.99
    },
    {
        "url": "https://images.unsplash.com/photo-1520170350707-b2da59970118?q=80&w=800",
        "name": "Harman Kardon Aura Studio",
        "desc": "Visually stunning transparent speaker with ambient lighting and 360 audio.",
        "price": 299.99
    },
    {
        "url": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800",
        "name": "Premium Audio Headset & Speakers",
        "desc": "Immersive sound experience with premium audio gear.",
        "price": 149.99
    },
    {
        "url": "https://images.unsplash.com/photo-1611078516082-13eb10d0689b?q=80&w=800",
        "name": "Sonos Smart Audio Setup",
        "desc": "Smart speaker setup with voice control built-in, rich room-filling sound.",
        "price": 219.99
    }
]

target_dir = r"c:\Users\pc\.gemini\antigravity\scratch\VoltVibe\frontend\public\speakers"
os.makedirs(target_dir, exist_ok=True)

opener = urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
opener.addheaders = [('User-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)')]
urllib.request.install_opener(opener)

db_path = r"c:\Users\pc\.gemini\antigravity\scratch\VoltVibe\backend\db.sqlite3"
conn = sqlite3.connect(db_path)
c = conn.cursor()

c.execute("SELECT id FROM api_product WHERE LOWER(category) = 'speakers' LIMIT 5")
rows = c.fetchall()

for i, row in enumerate(rows):
    if i < len(speaker_data):
        pid = row[0]
        data = speaker_data[i]
        
        # Determine image
        local_filename = f"speaker_new_{i+1}.jpg"
        local_path = os.path.join(target_dir, local_filename)
        if os.path.exists(local_path):
            data["image"] = f"/speakers/{local_filename}"
        else:
            try:
                print(f"Downloading {data['url']}...")
                urllib.request.urlretrieve(data["url"], local_path)
                data["image"] = f"/speakers/{local_filename}"
                print(f"Downloaded {local_filename}")
            except Exception as e:
                print(f"Failed to download {data['url']}: {e}")
                data["image"] = "/speaker_image.png"

        print(f"Updating DB for {data['name']}")
        # Update DB
        c.execute('''
            UPDATE api_product
            SET name = ?, description = ?, price = ?, image = ?
            WHERE id = ?
        ''', (data["name"], data["desc"], data["price"], data["image"], pid))

conn.commit()
conn.close()
print("Database updated perfectly!")
