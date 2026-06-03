import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=50, default="USER")
    phone = models.CharField(max_length=20, null=True, blank=True)
    
    # AbstractUser already has username, password, email, first_name, last_name
    email = models.EmailField(unique=True)
    is_verified = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=6, null=True, blank=True)

    def __str__(self):
        return self.username

class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    brand = models.CharField(max_length=100, default='Generic')
    category = models.CharField(max_length=100, null=True, blank=True)
    price = models.FloatField()
    originalPrice = models.FloatField(default=0)
    discount = models.FloatField(default=0)
    rating = models.FloatField(default=0)
    reviews = models.IntegerField(default=0)
    image = models.TextField(null=True, blank=True)
    hoverImages = models.JSONField(default=list, blank=True)
    inStock = models.BooleanField(default=True)
    stock = models.IntegerField(default=10)
    isBestSeller = models.BooleanField(default=False)
    isNew = models.BooleanField(default=False)
    isHot = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Order(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    totalAmount = models.FloatField()
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='PENDING')
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order {self.id} by {self.user.username}"

class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='orderItems')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='orderItems')
    quantity = models.IntegerField()
    price = models.FloatField()

    def __str__(self):
        return f"{self.quantity} x {self.product.name}"

class Address(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    title = models.CharField(max_length=100, blank=True)
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    isDefault = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title or 'Address'} - {self.user.username}"

class PaymentMethod(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_methods')
    card_type = models.CharField(max_length=50)
    brand = models.CharField(max_length=50)
    last4 = models.CharField(max_length=4)
    holder = models.CharField(max_length=255)
    expires = models.CharField(max_length=5)
    isDefault = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.brand} ending in {self.last4} - {self.user.username}"

class Wishlist(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='wishlist')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='wishlisted_by')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

class Review(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_reviews')
    rating = models.IntegerField(default=5)
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review {self.rating}/5 for {self.product.name} by {self.user.username}"
