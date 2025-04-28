from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Mock data storage (replace with database in production)
users = {
    "user1": {
        "id": "user1",
        "username": "demo_user",
        "email": "demo@example.com",
        "password": "password123",  # In production, this should be hashed
        "bio": "Demo user for testing",
        "avatar": "https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg"
    }
}

groups = [
    {
        "id": "group-1",
        "name": "Movie Night",
        "description": "Weekly movie night with friends",
        "creator_id": "user1",
        "members": ["user1"],
        "created_at": (datetime.now() - timedelta(days=7)).isoformat(),
        "polls": []
    }
]
polls = []
chats = []
friends = []

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "message": "Backend is running"}), 200

# Auth endpoints
@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    # Find user by email (in production, use proper password hashing)
    user = next((u for u in users.values() if u['email'] == email and u['password'] == password), None)
    
    if user:
        return jsonify({
            "user": {
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "bio": user['bio'],
                "avatar": user['avatar']
            }
        }), 200
    return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    # Check if email already exists
    if any(u['email'] == email for u in users.values()):
        return jsonify({"error": "Email already registered"}), 400
    
    # Create new user
    user_id = f"user{len(users) + 1}"
    new_user = {
        "id": user_id,
        "username": username,
        "email": email,
        "password": password,  # In production, hash the password
        "bio": "",
        "avatar": "https://images.pexels.com/photos/1261731/pexels-photo-1261731.jpeg"
    }
    users[user_id] = new_user
    
    return jsonify({
        "user": {
            "id": new_user['id'],
            "username": new_user['username'],
            "email": new_user['email'],
            "bio": new_user['bio'],
            "avatar": new_user['avatar']
        }
    }), 201

# User endpoints
@app.route('/api/users/profile', methods=['PUT'])
def update_profile():
    data = request.json
    user_id = data.get('id')
    
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404
    
    # Update user fields
    user = users[user_id]
    for field in ['username', 'bio']:
        if field in data:
            user[field] = data[field]
    
    return jsonify({
        "user": {
            "id": user['id'],
            "username": user['username'],
            "email": user['email'],
            "bio": user['bio'],
            "avatar": user['avatar']
        }
    }), 200

# Friend endpoints
@app.route('/api/friends/search', methods=['GET'])
def search_users():
    query = request.args.get('query', '').lower()
    if len(query) < 2:
        return jsonify([]), 200
    
    # Search users by username or email
    results = [
        {
            "id": u['id'],
            "username": u['username'],
            "email": u['email'],
            "avatar": u['avatar']
        }
        for u in users.values()
        if query in u['username'].lower() or query in u['email'].lower()
    ]
    return jsonify(results), 200

# Group endpoints
@app.route('/api/groups', methods=['GET'])
def get_groups():
    return jsonify(groups), 200

@app.route('/api/groups', methods=['POST'])
def create_group():
    data = request.json
    name = data.get('name')
    description = data.get('description')
    creator_id = data.get('creator_id')
    
    if not all([name, creator_id]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if creator_id not in users:
        return jsonify({"error": "Creator not found"}), 404
    
    new_group = {
        "id": f"group{len(groups) + 1}",
        "name": name,
        "description": description or "",
        "creator_id": creator_id,
        "members": [creator_id],
        "created_at": datetime.now().isoformat(),
        "polls": []
    }
    groups.append(new_group)
    return jsonify(new_group), 201

@app.route('/api/groups/<group_id>', methods=['GET'])
def get_group(group_id):
    group = next((g for g in groups if g['id'] == group_id), None)
    if not group:
        return jsonify({"error": "Group not found"}), 404
    
    # Get all polls for this group
    group_polls = [p for p in polls if p['group_id'] == group_id]
    
    # Get member details
    member_details = []
    for member_id in group['members']:
        user = users.get(member_id)
        if user:
            member_details.append({
                "id": user['id'],
                "username": user['username'],
                "email": user['email'],
                "avatar": user['avatar']
            })
    
    # Construct response
    response = {
        **group,
        "members": member_details,
        "polls": group_polls
    }
    
    return jsonify(response), 200

# Poll endpoints
@app.route('/api/groups/<group_id>/polls', methods=['POST'])
def create_poll(group_id):
    group = next((g for g in groups if g['id'] == group_id), None)
    if not group:
        return jsonify({"error": "Group not found"}), 404
    
    data = request.json
    question = data.get('question')
    options = data.get('options', [])
    creator_id = data.get('creator_id')
    
    if not all([question, options, creator_id]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if creator_id not in users:
        return jsonify({"error": "Creator not found"}), 404
    
    new_poll = {
        "id": f"poll{len(polls) + 1}",
        "group_id": group_id,
        "question": question,
        "options": [{
            "id": f"option{i+1}",
            "text": option,
            "votes": []
        } for i, option in enumerate(options)],
        "creator_id": creator_id,
        "created_at": datetime.now().isoformat(),
        "active": True
    }
    
    polls.append(new_poll)
    group['polls'].append(new_poll['id'])
    return jsonify(new_poll), 201

@app.route('/api/polls/<poll_id>/vote', methods=['POST'])
def vote_poll(poll_id):
    poll = next((p for p in polls if p['id'] == poll_id), None)
    if not poll:
        return jsonify({"error": "Poll not found"}), 404
    
    if not poll['active']:
        return jsonify({"error": "Poll is closed"}), 400
    
    data = request.json
    user_id = data.get('user_id')
    option_id = data.get('option_id')
    
    if not all([user_id, option_id]):
        return jsonify({"error": "Missing required fields"}), 400
    
    if user_id not in users:
        return jsonify({"error": "User not found"}), 404
    
    # Remove previous vote if exists
    for option in poll['options']:
        if user_id in option['votes']:
            option['votes'].remove(user_id)
    
    # Add new vote
    option = next((o for o in poll['options'] if o['id'] == option_id), None)
    if not option:
        return jsonify({"error": "Option not found"}), 404
    
    option['votes'].append(user_id)
    return jsonify(poll), 200

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
