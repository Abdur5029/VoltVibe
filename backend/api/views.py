from rest_framework import viewsets, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import authenticate
import os
from openai import OpenAI
from .models import User, Product, Order, OrderItem, Address, PaymentMethod, Review, Wishlist
from .serializers import UserSerializer, ProductSerializer, OrderSerializer, OrderItemSerializer, AddressSerializer, PaymentMethodSerializer, ReviewSerializer, WishlistSerializer

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({'error': 'Please provide email and password'}, status=status.HTTP_400_BAD_REQUEST)
            
        user = None
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(username=user_obj.username, password=password)
        except User.DoesNotExist:
            pass
            
        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
            
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class GoogleLoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        name = request.data.get('name', '')
        
        if not email:
            return Response({'error': 'Email is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            user = User.objects.get(email=email)
            if not user.is_verified:
                user.is_verified = True
                user.save()
        except User.DoesNotExist:
            username = email.split('@')[0]
            base_username = username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}{counter}"
                counter += 1
            
            parts = name.split(' ', 1)
            first_name = parts[0]
            last_name = parts[1] if len(parts) > 1 else ''
            
            user = User.objects.create(
                username=username,
                email=email,
                first_name=first_name,
                last_name=last_name,
                is_verified=True
            )
            user.set_unusable_password()
            user.save()
            
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

from rest_framework.decorators import action
from rest_framework.response import Response
import random
import string

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        email = request.data.get('email')
        if email:
            try:
                user = User.objects.get(email=email)
                if not user.is_verified:
                    otp = ''.join(random.choices(string.digits, k=6))
                    user.verification_code = otp
                    user.save(update_fields=['verification_code'])
                    try:
                        from django.core.mail import send_mail
                        from django.conf import settings
                        send_mail(
                            subject="VoltVibe - Your Verification Code",
                            message=f"Hi {user.first_name or user.username},\n\nYour account verification code is: {otp}\n\nPlease enter this code to activate your account.",
                            from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@voltvibe.com',
                            recipient_list=[user.email],
                            fail_silently=True,
                        )
                    except Exception as e:
                        print("Failed to send verification email:", e)
                        
                    return Response({
                        'message': 'Account exists but is unverified. Verification code has been resent.',
                        'email': email,
                        'resend': True
                    }, status=status.HTTP_200_OK)
            except User.DoesNotExist:
                pass
        return super().create(request, *args, **kwargs)

    def perform_create(self, serializer):
        user = serializer.save()
        if user.email:
            otp = ''.join(random.choices(string.digits, k=6))
            user.verification_code = otp
            user.save(update_fields=['verification_code'])
            try:
                from django.core.mail import send_mail
                from django.conf import settings
                send_mail(
                    subject="VoltVibe - Your Verification Code",
                    message=f"Hi {user.first_name or user.username},\n\nYour account verification code is: {otp}\n\nPlease enter this code to activate your account.",
                    from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@voltvibe.com',
                    recipient_list=[user.email],
                    fail_silently=True,
                )
            except Exception as e:
                print("Failed to send verification email:", e)
                
    @action(detail=False, methods=['post'])
    def verify(self, request):
        email = request.data.get('email')
        code = request.data.get('code')
        try:
            user = User.objects.get(email=email)
            if user.verification_code == code:
                user.is_verified = True
                user.verification_code = None
                user.save()
                return Response({'message': 'Verified successfully'}, status=status.HTTP_200_OK)
            return Response({'error': 'Invalid verification code'}, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

from django.core.mail import send_mail
from django.conf import settings

from rest_framework.exceptions import ValidationError

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    def get_queryset(self):
        queryset = Order.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        
        # In a real setup with token auth, request.user would be set.
        # Here we check if user is passed in data or we fetch from DB.
        user_id = self.request.data.get('user')
        if user_id:
            try:
                user = User.objects.get(id=user_id)
            except User.DoesNotExist:
                pass
                
        if user and not getattr(user, 'is_verified', True):
            raise ValidationError("You must verify your email address before placing an order.")

        order = serializer.save()
        if order.user and order.user.email:
            try:
                html_message = f"""
                <html>
                    <body>
                        <h2>Thank you for your order, {order.user.first_name or 'Valued Customer'}!</h2>
                        <p>Your order <strong>#{order.id}</strong> has been received and is currently being processed.</p>
                        <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
                        <br/>
                        <p>We will notify you once your items ship.</p>
                        <p>Best regards,<br/>The VoltVibe Team</p>
                    </body>
                </html>
                """
                send_mail(
                    subject=f"VoltVibe Order Confirmation - #{order.id}",
                    message=f"Thank you for your purchase! Your order #{order.id} has been received.\nTotal: ${order.totalAmount}",
                    from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, 'DEFAULT_FROM_EMAIL') else 'noreply@voltvibe.com',
                    recipient_list=[order.user.email],
                    html_message=html_message,
                    fail_silently=True,
                )
            except Exception as e:
                print("Failed to send order email:", e)

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_queryset(self):
        queryset = Review.objects.all()
        product_id = self.request.query_params.get('product', None)
        if product_id is not None:
            queryset = queryset.filter(product_id=product_id)
        return queryset

class WishlistViewSet(viewsets.ModelViewSet):
    queryset = Wishlist.objects.all()
    serializer_class = WishlistSerializer

    def get_queryset(self):
        queryset = Wishlist.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset

class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer

class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer

    def get_queryset(self):
        queryset = Address.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    def perform_create(self, serializer):
        user_id = self.request.data.get('user')
        if user_id:
            user = User.objects.get(id=user_id)
            serializer.save(user=user)
        else:
            serializer.save()

class PaymentMethodViewSet(viewsets.ModelViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer

    def get_queryset(self):
        queryset = PaymentMethod.objects.all()
        user_id = self.request.query_params.get('user', None)
        if user_id is not None:
            queryset = queryset.filter(user_id=user_id)
        return queryset

    def perform_create(self, serializer):
        user_id = self.request.data.get('user')
        if user_id:
            user = User.objects.get(id=user_id)
            serializer.save(user=user)
        else:
            serializer.save()

class ChatbotView(APIView):
    def post(self, request):
        messages = request.data.get('messages', [])
        if not messages:
            return Response({'error': 'No messages provided'}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Retrieve Context from Database
        products = Product.objects.filter(inStock=True)
        products_context = "\n".join([f"- {p.name}: ${p.price} (Category: {p.category}) (ID: {p.id})" for p in products])
        
        system_instruction = f"""You are a helpful AI Assistant for an e-commerce store called VoltVibe.
Here is our current in-stock product catalog:
{products_context}

Use this catalog to answer user questions, recommend products, and help them shop. Keep answers concise. If asked about a product not in this list, say it's currently out of stock or we don't carry it.

CRITICAL INSTRUCTION: When you recommend a specific product from the catalog, you MUST include its ID wrapped in a special markdown tag exactly like this:
[PRODUCT: <product_id>]

For example:
"I highly recommend the Bose SoundLink Mini II. [PRODUCT: 123e4567-e89b-12d3-a456-426614174000]"

This allows our frontend to render a clickable product card!"""

        api_key = os.environ.get('XAI_API_KEY')
        if not api_key:
            return Response({
                'role': 'assistant',
                'content': "I am running in local mode because no XAI_API_KEY was provided in the backend. "
                           "However, I can see that we have these products in stock: " + 
                           ", ".join([p.name for p in list(products)[:3]]) + "..."
            }, status=status.HTTP_200_OK)

        client = OpenAI(
            api_key=api_key,
            base_url="https://api.x.ai/v1",
        )

        # 2. Format history for OpenAI
        valid_history = [{"role": "system", "content": system_instruction}]
        for msg in messages:
            role = 'assistant' if msg.get('role') == 'assistant' else 'user'
            text = msg.get('content', '')
            valid_history.append({"role": role, "content": text})

        # 3. Generate Response
        try:
            completion = client.chat.completions.create(
                model="grok-4.3",
                messages=valid_history,
            )
            return Response({
                'role': 'assistant',
                'content': completion.choices[0].message.content
            }, status=status.HTTP_200_OK)
        except Exception as e:
            print("xAI API Error:", e)
            return Response({
                'role': 'assistant',
                'content': "I'm currently experiencing high demand and cannot answer your question right now. Please try again later."
            }, status=status.HTTP_200_OK)
