import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'voltvibe_project.settings')
django.setup()

from api.models import User

if not User.objects.filter(username='admin').exists():
    user = User.objects.create_user(username='admin', email='admin@voltvibe.com', password='adminpassword')
    user.role = 'ADMIN'
    user.save()
    print("Admin user created successfully! (Username: admin, Password: adminpassword)")
else:
    print("Admin user already exists! (Username: admin, Password: adminpassword)")
