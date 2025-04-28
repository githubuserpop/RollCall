from extensions import db
from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

# User model
class User(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)  # Stores the hashed password
    bio = db.Column(db.Text, nullable=True)
    avatar = db.Column(db.String(255), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def set_password(self, password):
        """Hash and set the user's password"""
        self.password = generate_password_hash(password)
        
    def check_password(self, password):
        """Check if the provided password matches the stored hash"""
        return check_password_hash(self.password, password)

# Group model
class Group(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    creator_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    creator = db.relationship('User', backref='created_groups')
    members = db.relationship('User', secondary='group_members', backref='groups')

# Group members association table
group_members = db.Table('group_members',
    db.Column('group_id', db.String(36), db.ForeignKey('group.id'), primary_key=True),
    db.Column('user_id', db.String(36), db.ForeignKey('user.id'), primary_key=True),
    db.Column('joined_at', db.DateTime, default=datetime.utcnow)
)

# Poll model
class Poll(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=True)
    group_id = db.Column(db.String(36), db.ForeignKey('group.id'), nullable=False)
    creator_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    expire_at = db.Column(db.DateTime, nullable=True)
    
    # Relationships
    group = db.relationship('Group', backref='polls')
    creator = db.relationship('User', backref='created_polls')
    options = db.relationship('PollOption', backref='poll', cascade='all, delete-orphan')

# Poll option model
class PollOption(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    poll_id = db.Column(db.String(36), db.ForeignKey('poll.id'), nullable=False)
    text = db.Column(db.String(200), nullable=False)
    
    # Relationship
    votes = db.relationship('Vote', backref='option', cascade='all, delete-orphan')

# Vote model
class Vote(db.Model):
    id = db.Column(db.String(36), primary_key=True)
    option_id = db.Column(db.String(36), db.ForeignKey('poll_option.id'), nullable=False)
    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)
    voted_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='votes')