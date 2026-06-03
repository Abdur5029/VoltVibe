import os
import django
import random
import uuid

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voltvibe_project.settings')
django.setup()

from api.models import Product

def create_product(id_str, name, desc, price, img, cat, brand, stock=15):
    return {
        "id": id_str,
        "name": name,
        "description": desc,
        "price": price,
        "image": img,
        "category": cat,
        "brand": brand,
        "stock": stock
    }

# Categories and their USD price ranges
CATEGORIES = {
    'wireless-earbuds': {'min': 20, 'max': 250},
    'headphones': {'min': 50, 'max': 400},
    'sound-bars': {'min': 100, 'max': 600},
    'speakers': {'min': 30, 'max': 300},
    'speaker-systems': {'min': 80, 'max': 500},
    'mobile-accessories': {'min': 10, 'max': 100},
    'monitors': {'min': 150, 'max': 1000},
    'laptops': {'min': 400, 'max': 2500},
    'keyboards': {'min': 20, 'max': 200},
    'printers': {'min': 100, 'max': 500},
    'cameras': {'min': 300, 'max': 2000},
    'gaming': {'min': 50, 'max': 600},
    'smart-tvs': {'min': 300, 'max': 3000},
    'smart-home': {'min': 20, 'max': 300},
    'power-banks': {'min': 20, 'max': 150},
    'networking': {'min': 30, 'max': 400},
}

BRANDS = ["SoundCore", "TechPro", "AudioMax", "VoltAudio", "PrimeTech"]
IMAGES = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    "https://images.unsplash.com/photo-1546435770-a3e426bf472b",
    "https://images.unsplash.com/photo-1583394838336-acd977736f90",
    "https://images.unsplash.com/photo-1611078486510-482a5146c243",
    "https://images.unsplash.com/photo-1593640408182-31c70c8268f5",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed",
    "https://images.unsplash.com/photo-1605901309584-818e25960b8f"
]

def run():
    print("Seeding database with USD prices and specific filter brands...")
    Product.objects.all().delete()
    
    products_to_create = []
    
    for cat_slug, price_range in CATEGORIES.items():
        # Generate 8 to 10 products per category
        num_products = random.randint(8, 10)
        for i in range(num_products):
            price = round(random.uniform(price_range['min'], price_range['max']), 2)
            brand = random.choice(BRANDS)
            image = random.choice(IMAGES)
            stock = random.randint(5, 50)
            
            p = Product(
                id=uuid.uuid4(),
                name=f"{brand} {cat_slug.replace('-', ' ').title()} Model {i+1}",
                description=f"High quality {cat_slug.replace('-', ' ')} from {brand}.",
                price=price,
                image=image,
                category=cat_slug,
                brand=brand,
                stock=stock
            )
            products_to_create.append(p)
    
    Product.objects.bulk_create(products_to_create)
    print(f"Successfully created {len(products_to_create)} products.")

if __name__ == '__main__':
    run()
