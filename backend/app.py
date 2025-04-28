from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from validation import validate_auth_request, validate_group_request, validate_poll_request

# Load environment variables
load_dotenv()

app = Flask(__name__)
# Configure CORS with more permissive settings for development
CORS(app, resources={
    r"/*": {
        "origins": "*",  # Allow all origins in development
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": "*",
        "supports_credentials": True
    }
})

# Database configuration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bolt.db'  # Use sqlite for development
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Initialize extensions
from extensions import db, migrate
db.init_app(app)
migrate.init_app(app, db)

# Import models - must be after db initialization
from models import User, Group, Poll, PollOption, Vote


# Skip creating demo user - we already have seed data
# The database has already been populated with sample data

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

# Auth endpoints
@app.route('/api/auth/login', methods=['POST'])
@validate_auth_request
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Find user by email
    user = User.query.filter_by(email=email).first()
    
    # Verify password with secure hash comparison
    if user and user.check_password(password):
        return jsonify({
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "bio": user.bio,
                "avatar": user.avatar
            }
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/auth/register', methods=['POST'])
@validate_auth_request
def register():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "Email already registered"}), 400
    
    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"error": "Username already taken"}), 400
    
    # Create new user with secure password hashing
    import uuid
    user_id = str(uuid.uuid4())
    new_user = User(
        id=user_id,
        username=username,
        email=email,
        password="temporary",  # Will be overwritten by set_password
        bio="",
        avatar="https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg"
    )
    
    # Set password using the secure hashing method
    new_user.set_password(password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "user": {
            "id": new_user.id,
            "username": new_user.username,
            "email": new_user.email,
            "bio": new_user.bio,
            "avatar": new_user.avatar
        }
    }), 201

# User endpoints
@app.route('/api/users/profile', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = data.get('id')
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Update user fields
    for field in ['username', 'bio']:
        if field in data:
            setattr(user, field, data[field])
    
    db.session.commit()
    
    return jsonify({
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "bio": user.bio,
            "avatar": user.avatar
        }
    }), 200

# Friend endpoints
@app.route('/api/friends/search', methods=['GET'])
def search_users():
    query = request.args.get('query', '').lower()
    if len(query) < 2:
        return jsonify([]), 200
    
    # Search users by username or email using SQLAlchemy
    users = User.query.filter(
        db.or_(
            User.username.ilike(f'%{query}%'),
            User.email.ilike(f'%{query}%')
        )
    ).all()
    
    results = [
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "avatar": user.avatar
        } for user in users
    ]
    return jsonify(results), 200

# Group endpoints
@app.route('/api/groups', methods=['GET'])
def get_groups():
    all_groups = Group.query.all()
    result = [{
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "creator_id": group.creator_id,
        "created_at": group.created_at.isoformat() if group.created_at else None,
        "members": [member.id for member in group.members]
    } for group in all_groups]
    
    return jsonify(result), 200

@app.route('/api/groups', methods=['POST'])
@validate_group_request
def create_group():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    creator_id = data.get('creator_id')
    
    if not all([name, creator_id]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if creator exists
    creator = User.query.get(creator_id)
    if not creator:
        return jsonify({"error": "Creator not found"}), 404
    
    # Create new group
    import uuid
    new_group = Group(
        id=str(uuid.uuid4()),
        name=name,
        description=description or "",
        creator_id=creator_id,
        created_at=datetime.now()
    )
    
    # Add creator as a member
    new_group.members.append(creator)
    
    db.session.add(new_group)
    db.session.commit()
    
    # Format response
    response = {
        "id": new_group.id,
        "name": new_group.name,
        "description": new_group.description,
        "creator_id": new_group.creator_id,
        "created_at": new_group.created_at.isoformat(),
        "members": [creator_id]
    }
    
    return jsonify(response), 201

@app.route('/api/groups/<group_id>', methods=['GET'])
def get_group(group_id):
    # Find the group by ID
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404
    
    # Get all polls for this group
    group_polls = Poll.query.filter_by(group_id=group_id).all()
    poll_list = [
        {
            "id": poll.id,
            "title": poll.title,
            "description": poll.description,
            "group_id": poll.group_id,
            "creator_id": poll.creator_id,
            "created_at": poll.created_at.isoformat() if poll.created_at else None,
            "expire_at": poll.expire_at.isoformat() if poll.expire_at else None,
            "options": [
                {
                    "id": option.id,
                    "text": option.text,
                    "votes": len(option.votes)
                } for option in poll.options
            ]
        } for poll in group_polls
    ]
    
    # Get member details
    member_details = [
        {
            "id": member.id,
            "username": member.username,
            "email": member.email,
            "avatar": member.avatar
        } for member in group.members
    ]
    
    # Construct response
    response = {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "creator_id": group.creator_id,
        "created_at": group.created_at.isoformat() if group.created_at else None,
        "members": member_details,
        "polls": poll_list
    }
    
    return jsonify(response), 200

# Poll endpoints
@app.route('/api/groups/<group_id>/polls', methods=['POST'])
@validate_poll_request
def create_poll(group_id):
    # Find the group by ID
    group = Group.query.get(group_id)
    if not group:
        return jsonify({"error": "Group not found"}), 404
    
    data = request.json
    title = data.get('question') or data.get('title')  # Accept both 'question' and 'title'
    options = data.get('options', [])
    # Check for both creator_id and createdBy to be compatible with frontend
    creator_id = data.get('creator_id') or data.get('createdBy')
    expire_days = data.get('expire_days', 7)  # Default 7 days to expire
    
    # Make sure we have the required fields
    if not all([title, options]):
        return jsonify({"error": "Missing question or options"}), 400
        
    # If creator_id was not provided in the request, return an error
    if not creator_id:
        return jsonify({"error": "Creator ID is required"}), 400
    
    # Check if creator exists
    creator = User.query.get(creator_id)
    if not creator:
        return jsonify({"error": "Creator not found"}), 404
    
    # Create new poll
    import uuid
    new_poll = Poll(
        id=str(uuid.uuid4()),
        title=title,
        description="",
        group_id=group_id,
        creator_id=creator_id,
        created_at=datetime.now(),
        expire_at=datetime.now() + timedelta(days=expire_days)
    )
    
    db.session.add(new_poll)
    
    # Create poll options
    for option_text in options:
        option = PollOption(
            id=str(uuid.uuid4()),
            poll_id=new_poll.id,
            text=option_text
        )
        db.session.add(option)
    
    db.session.commit()
    
    # Format response
    response = {
        "id": new_poll.id,
        "group_id": new_poll.group_id,
        "question": new_poll.title,
        "options": [{
            "id": option.id,
            "text": option.text,
            "votes": []
        } for option in new_poll.options],
        "creator_id": new_poll.creator_id,
        "created_at": new_poll.created_at.isoformat(),
        "expire_at": new_poll.expire_at.isoformat() if new_poll.expire_at else None,
        "active": datetime.now() < new_poll.expire_at if new_poll.expire_at else True
    }
    
    return jsonify(response), 201

@app.route('/api/polls/<poll_id>/vote', methods=['POST'])
@validate_poll_request
def vote_poll(poll_id):
    # Find poll by ID
    poll = Poll.query.get(poll_id)
    if not poll:
        return jsonify({"error": "Poll not found"}), 404
    
    # Check if poll is active (not expired)
    is_active = not poll.expire_at or datetime.now() < poll.expire_at
    if not is_active:
        return jsonify({"error": "Poll is closed"}), 400
    
    data = request.json
    user_id = data.get('user_id')
    option_id = data.get('option_id')
    
    if not all([user_id, option_id]):
        return jsonify({"error": "Missing required fields"}), 400
    
    # Check if user exists
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    # Check if option exists and belongs to this poll
    option = PollOption.query.filter_by(id=option_id, poll_id=poll_id).first()
    if not option:
        return jsonify({"error": "Option not found"}), 404
    
    # Remove previous votes by this user for this poll
    existing_votes = Vote.query.join(PollOption).filter(
        Vote.user_id == user_id,
        PollOption.poll_id == poll_id
    ).all()
    
    for vote in existing_votes:
        db.session.delete(vote)
    
    # Create new vote
    import uuid
    new_vote = Vote(
        id=str(uuid.uuid4()),
        option_id=option_id,
        user_id=user_id,
        voted_at=datetime.now()
    )
    db.session.add(new_vote)
    db.session.commit()
    
    # Format response with updated poll data
    options_data = []
    for opt in poll.options:
        votes = [vote.user_id for vote in opt.votes]
        options_data.append({
            "id": opt.id,
            "text": opt.text,
            "votes": votes
        })
    
    response = {
        "id": poll.id,
        "group_id": poll.group_id,
        "question": poll.title,
        "options": options_data,
        "creator_id": poll.creator_id,
        "created_at": poll.created_at.isoformat() if poll.created_at else None,
        "expire_at": poll.expire_at.isoformat() if poll.expire_at else None,
        "active": is_active
    }
    
    return jsonify(response), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
#final