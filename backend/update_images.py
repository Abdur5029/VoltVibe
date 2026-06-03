import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voltvibe_project.settings')
django.setup()

from api.models import Product

def update_images():
    category_map = {
        'Laptops': {
            'main': '/images/products/base_laptops_1780404493415.png',
            'hover': ['/images/products/hover1_laptops_1780467653978.png', '/images/products/hover2_laptops_1780467670551.png']
        },
        'Smartphones': {
            'main': '/images/products/main_smartphones_1780467684648.png',
            'hover': ['/images/products/hover1_smartphones_1780467697132.png', '/images/products/hover2_smartphones_1780467709479.png']
        },
        'Tablets': {
            'main': '/images/products/main_tablets_1780467720897.png',
            'hover': ['/images/products/hover1_tablets_1780467743132.png', '/images/products/hover2_tablets_1780467756844.png']
        },
        'Watches': {
            'main': '/images/products/main_watches_1780467778275.png',
            'hover': ['/images/products/hover1_watches_1780467790342.png', '/images/products/hover2_watches_1780467802552.png']
        },
        'Accessories': {
            'main': '/images/products/base_mobileacc_1780404466239.png',
            'hover': ['/images/products/base_headphones_1780404423985.png', '/images/products/base_earbuds_1780404411326.png']
        },
        'Speakers': {
            'main': '/images/products/base_speakers_1780404451191.png',
            'hover': ['/images/products/bose_speaker_hover1_1780467826553.png', '/images/products/marshall_speaker_hover1_1780467863353.png']
        }
    }
    
    products = Product.objects.all()
    count = 0
    for p in products:
        cat = p.category
        if cat in category_map:
            imgs = category_map[cat]
            p.image = imgs['main']
            p.hoverImages = imgs['hover']
            
            # Custom logic for specific speakers
            if 'bose' in p.name.lower():
                p.image = '/images/products/bose_speaker_main_1780467815182.png'
                p.hoverImages = ['/images/products/bose_speaker_hover1_1780467826553.png', '/images/products/bose_speaker_hover2_1780467839921.png']
            elif 'marshall' in p.name.lower():
                p.image = '/images/products/marshall_speaker_main_1780467851715.png'
                p.hoverImages = ['/images/products/marshall_speaker_hover1_1780467863353.png', '/images/products/marshall_speaker_hover2_1780467884369.png']
            elif 'jbl' in p.name.lower() or 'portable' in p.name.lower():
                p.image = '/images/products/speaker_portable_1780425684298.png'
                p.hoverImages = ['/images/products/base_speakers_1780404451191.png', '/images/products/speaker_portable_1780425684298.png']
            
            p.save()
            count += 1
            
    print(f"Updated {count} products!")

if __name__ == '__main__':
    update_images()
