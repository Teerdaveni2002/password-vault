from rest_framework import status, viewsets, permissions
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import User, PasswordEntry, PasswordRequest
from .serializers import (
    UserRegistrationSerializer, UserSerializer,
    PasswordEntrySerializer, PasswordEntryDetailSerializer,
    PasswordRequestSerializer, PasswordRequestCreateSerializer,
    PasswordRequestActionSerializer
)


class IsAdmin(permissions.BasePermission):
    """Custom permission to only allow admins."""
    
    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and request.user.is_admin


class IsOwnerOrAdmin(permissions.BasePermission):
    """Custom permission to only allow owners or admins."""
    
    def has_object_permission(self, request, view, obj):
        if hasattr(obj, 'user'):
            return obj.user == request.user or request.user.is_admin
        return False


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Register a new user."""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Authenticate user and return JWT tokens."""
    email = request.data.get('email')
    password = request.data.get('password')
    
    if not email or not password:
        return Response(
            {'error': 'Please provide both email and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(email=email, password=password)
    
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'User account is disabled'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_profile(request):
    """Get current user profile."""
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class PasswordEntryViewSet(viewsets.ModelViewSet):
    """ViewSet for managing password entries."""
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return password entries for the current user."""
        return PasswordEntry.objects.filter(user=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve_with_password':
            return PasswordEntryDetailSerializer
        return PasswordEntrySerializer
    
    def perform_create(self, serializer):
        """Create a password entry for the current user."""
        serializer.save(user=self.request.user)
    
    def get_permissions(self):
        """Set permissions based on action."""
        if self.action == 'retrieve_with_password':
            return [IsAuthenticated(), IsOwnerOrAdmin()]
        return [IsAuthenticated()]
    
    @action(detail=True, methods=['get'], url_path='view-password')
    def retrieve_with_password(self, request, pk=None):
        """
        View decrypted password - requires active approved request.
        Only the owner can view their own passwords directly.
        """
        password_entry = self.get_object()
        
        # Check if user is the owner
        if password_entry.user == request.user:
            serializer = PasswordEntryDetailSerializer(password_entry)
            return Response(serializer.data)
        
        # If not owner, check for approved request
        if not request.user.is_admin:
            return Response(
                {'error': 'You do not have permission to view this password'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check for active approved request
        active_request = PasswordRequest.objects.filter(
            password_entry=password_entry,
            requester=request.user,
            status='approved'
        ).first()
        
        if not active_request or not active_request.is_active():
            return Response(
                {'error': 'No active approved request found or request has expired'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = PasswordEntryDetailSerializer(password_entry)
        return Response(serializer.data)


class PasswordRequestViewSet(viewsets.ModelViewSet):
    """ViewSet for managing password requests."""
    
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """Return password requests based on user role."""
        if self.request.user.is_admin:
            # Admins see all pending requests
            return PasswordRequest.objects.all()
        else:
            # Regular users see only their own requests
            return PasswordRequest.objects.filter(requester=self.request.user)
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'create':
            return PasswordRequestCreateSerializer
        return PasswordRequestSerializer
    
    def create(self, request, *args, **kwargs):
        """Create a new password request."""
        serializer = self.get_serializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        
        # Check if user already has a pending request for this password entry
        password_entry_id = serializer.validated_data['password_entry'].id
        existing_request = PasswordRequest.objects.filter(
            password_entry_id=password_entry_id,
            requester=request.user,
            status='pending'
        ).first()
        
        if existing_request:
            return Response(
                {'error': 'You already have a pending request for this password entry'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            PasswordRequestSerializer(serializer.instance).data,
            status=status.HTTP_201_CREATED,
            headers=headers
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsAdmin])
    def review(self, request, pk=None):
        """Admin action to approve or reject a password request."""
        password_request = self.get_object()
        
        if password_request.status != 'pending':
            return Response(
                {'error': 'This request has already been reviewed'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = PasswordRequestActionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        action_type = serializer.validated_data['action']
        notes = serializer.validated_data.get('notes', '')
        
        if action_type == 'approve':
            decryption_window = serializer.validated_data.get('decryption_window', 20)
            password_request.approve(request.user, decryption_window)
            message = f'Request approved. Password can be viewed for {decryption_window} seconds.'
        else:
            password_request.reject(request.user, notes)
            message = 'Request rejected.'
        
        return Response({
            'message': message,
            'request': PasswordRequestSerializer(password_request).data
        })
    
    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending requests (admin only) or user's pending requests."""
        if request.user.is_admin:
            pending_requests = PasswordRequest.objects.filter(status='pending')
        else:
            pending_requests = PasswordRequest.objects.filter(
                requester=request.user,
                status='pending'
            )
        serializer = PasswordRequestSerializer(pending_requests, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def check_status(self, request, pk=None):
        """Check the current status of a password request."""
        password_request = self.get_object()
        
        # Update status if expired
        password_request.check_expiration()
        password_request.refresh_from_db()
        
        serializer = PasswordRequestSerializer(password_request)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdmin])
def admin_dashboard(request):
    """Get admin dashboard statistics."""
    pending_count = PasswordRequest.objects.filter(status='pending').count()
    total_users = User.objects.count()
    total_passwords = PasswordEntry.objects.count()
    total_requests = PasswordRequest.objects.count()
    
    return Response({
        'pending_requests': pending_count,
        'total_users': total_users,
        'total_passwords': total_passwords,
        'total_requests': total_requests,
    })
