import os
import django
import json

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voltvibe_project.settings')
django.setup()

from api.models import Product

with open('speakers.json', 'r') as f:
    speakers = json.load(f)

for p in speakers:
    Product.objects.update_or_create(
        name=p['name'],
        defaults=p
    )

print(f"Added {len(speakers)} speakers to database.")
