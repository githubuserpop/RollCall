"""
Request validation utilities for Project Bolt

This module provides validation functions for API requests to ensure
data integrity and security.
"""

import re
from functools import wraps
from flask import request, jsonify

# Validation patterns
EMAIL_PATTERN = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
USERNAME_PATTERN = re.compile(r'^[a-zA-Z0-9_-]{3,20}$')

def validate_email(email):
    """Validate email format"""
    if not email or not EMAIL_PATTERN.match(email):
        return False
    return True

def validate_username(username):
    """Validate username format (3-20 chars, alphanumeric, underscore, hyphen)"""
    if not username or not USERNAME_PATTERN.match(username):
        return False
    return True

def validate_password(password):
    """Validate password strength (min 8 chars)"""
    if not password or len(password) < 8:
        return False
    return True

# Validation decorator for auth endpoints
def validate_auth_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.json
        
        # Check if request has JSON data
        if not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate required fields
        errors = {}
        
        # For login endpoint
        if request.path == '/api/auth/login':
            if not data.get('email'):
                errors['email'] = "Email is required"
            if not data.get('password'):
                errors['password'] = "Password is required"
        
        # For register endpoint
        elif request.path == '/api/auth/register':
            email = data.get('email', '')
            username = data.get('username', '')
            password = data.get('password', '')
            
            if not email:
                errors['email'] = "Email is required"
            elif not validate_email(email):
                errors['email'] = "Invalid email format"
                
            if not username:
                errors['username'] = "Username is required"
            elif not validate_username(username):
                errors['username'] = "Username must be 3-20 characters and contain only letters, numbers, underscores, or hyphens"
                
            if not password:
                errors['password'] = "Password is required"
            elif not validate_password(password):
                errors['password'] = "Password must be at least 8 characters long"
        
        # Return errors if any
        if errors:
            return jsonify({"errors": errors}), 400
            
        # If all validations pass, continue to the wrapped function
        return f(*args, **kwargs)
    
    return decorated_function

# Validation decorator for group endpoints
def validate_group_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.json
        
        # Check if request has JSON data for POST methods
        if request.method == 'POST' and not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate group creation
        if request.method == 'POST' and request.path == '/api/groups':
            errors = {}
            
            if not data.get('name'):
                errors['name'] = "Group name is required"
            elif len(data.get('name', '')) < 3:
                errors['name'] = "Group name must be at least 3 characters"
                
            if not data.get('creator_id'):
                errors['creator_id'] = "Creator ID is required"
            
            # Return errors if any
            if errors:
                return jsonify({"errors": errors}), 400
        
        # If all validations pass, continue to the wrapped function
        return f(*args, **kwargs)
    
    return decorated_function

# Validation decorator for poll endpoints
def validate_poll_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        data = request.json
        
        # Check if request has JSON data for POST methods
        if request.method == 'POST' and not data:
            return jsonify({"error": "No data provided"}), 400
        
        # Validate poll creation
        if request.method == 'POST' and '/polls' in request.path and not '/vote' in request.path:
            errors = {}
            
            if not data.get('question'):
                errors['question'] = "Poll question is required"
            
            options = data.get('options', [])
            if not options or len(options) < 2:
                errors['options'] = "At least 2 options are required"
                
            if not data.get('creator_id'):
                errors['creator_id'] = "Creator ID is required"
            
            # Return errors if any
            if errors:
                return jsonify({"errors": errors}), 400
                
        # Validate poll vote
        elif request.method == 'POST' and '/vote' in request.path:
            errors = {}
            
            if not data.get('user_id'):
                errors['user_id'] = "User ID is required"
                
            if not data.get('option_id'):
                errors['option_id'] = "Option ID is required"
            
            # Return errors if any
            if errors:
                return jsonify({"errors": errors}), 400
        
        # If all validations pass, continue to the wrapped function
        return f(*args, **kwargs)
    
    return decorated_function
#Final