import sqlite3

def fix():
    conn = sqlite3.connect('db.sqlite3')
    cursor = conn.cursor()
    
    try:
        conn.execute("UPDATE api_product SET image='/speaker_image.png' WHERE category='speakers'")
        conn.execute("UPDATE api_product SET image='/placeholder.jpg' WHERE image LIKE '%unsplash%'")
        conn.commit()
        print("Updated api_product")
    except Exception as e:
        print(f"Error: {e}")
        
    conn.close()

if __name__ == '__main__':
    fix()
