from rest_framework import serializers
from .models import User, PasswordEntry, PasswordRequest
from django.contrib.auth.password_validation import validate_password


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'password', 'password2', 'is_admin')
        read_only_fields = ('id',)
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user details."""
    
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'is_admin', 'is_active', 'date_joined')
        read_only_fields = ('id', 'date_joined')


class PasswordEntrySerializer(serializers.ModelSerializer):
    """Serializer for password entry (without decrypted password)."""
    
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = PasswordEntry
        fields = ('id', 'application_name', 'username', 'email', 'password', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')
    
    def create(self, validated_data):
        password = validated_data.pop('password')
        password_entry = PasswordEntry.objects.create(**validated_data)
        password_entry.set_password(password)
        password_entry.save()
        return password_entry
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class PasswordEntryDetailSerializer(serializers.ModelSerializer):
    """Serializer for password entry with decrypted password."""
    
    decrypted_password = serializers.SerializerMethodField()
    
    class Meta:
        model = PasswordEntry
        fields = ('id', 'application_name', 'username', 'email', 'decrypted_password', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'decrypted_password')
    
    def get_decrypted_password(self, obj):
        """Get decrypted password - only if authorized."""
        return obj.get_password()


class PasswordRequestSerializer(serializers.ModelSerializer):
    """Serializer for password requests."""
    
    requester_username = serializers.CharField(source='requester.username', read_only=True)
    admin_username = serializers.CharField(source='admin.username', read_only=True, allow_null=True)
    application_name = serializers.CharField(source='password_entry.application_name', read_only=True)
    is_active = serializers.SerializerMethodField()
    
    class Meta:
        model = PasswordRequest
        fields = (
            'id', 'password_entry', 'requester', 'requester_username', 
            'admin', 'admin_username', 'application_name', 'status', 
            'requested_at', 'reviewed_at', 'expires_at', 'reason', 
            'admin_notes', 'is_active'
        )
        read_only_fields = (
            'id', 'requester', 'admin', 'status', 'reviewed_at', 
            'expires_at', 'admin_notes', 'requester_username', 
            'admin_username', 'application_name', 'is_active'
        )
    
    def get_is_active(self, obj):
        """Check if request is still active."""
        return obj.is_active()


class PasswordRequestCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating password requests."""
    
    class Meta:
        model = PasswordRequest
        fields = ('password_entry', 'reason')
    
    def create(self, validated_data):
        validated_data['requester'] = self.context['request'].user
        return super().create(validated_data)


class PasswordRequestActionSerializer(serializers.Serializer):
    """Serializer for admin actions on password requests."""
    
    action = serializers.ChoiceField(choices=['approve', 'reject'])
    notes = serializers.CharField(required=False, allow_blank=True)
    decryption_window = serializers.IntegerField(default=20, min_value=10, max_value=60)
