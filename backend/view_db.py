"""
Database viewer for Project Bolt

This script displays the contents of your SQLite database in a readable format.
Run it to see all the data stored in your database.

Usage:
    python view_db.py
"""

from app import app, db
from models import User, Group, Poll, PollOption, Vote
from datetime import datetime

def format_user(user):
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "bio": user.bio,
        "avatar": user.avatar,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }

def format_group(group):
    return {
        "id": group.id,
        "name": group.name,
        "description": group.description,
        "creator_id": group.creator_id,
        "created_at": group.created_at.isoformat() if group.created_at else None,
        "members": [member.username for member in group.members]
    }

def format_poll(poll):
    return {
        "id": poll.id,
        "title": poll.title,
        "description": poll.description,
        "group_id": poll.group_id,
        "creator_id": poll.creator_id,
        "created_at": poll.created_at.isoformat() if poll.created_at else None,
        "expire_at": poll.expire_at.isoformat() if poll.expire_at else None,
        "options": [format_option(option) for option in poll.options]
    }

def format_option(option):
    return {
        "id": option.id,
        "text": option.text,
        "votes": [vote.user_id for vote in option.votes]
    }

def format_vote(vote):
    return {
        "id": vote.id,
        "user_id": vote.user_id,
        "option_id": vote.option_id,
        "voted_at": vote.voted_at.isoformat() if vote.voted_at else None
    }

def print_section(title, data):
    print("\n" + "=" * 50)
    print(f" {title} ({len(data)})")
    print("=" * 50)
    
    for item in data:
        print(f"\n{item}")

def view_database():
    """Display the contents of the database"""
    with app.app_context():
        # Get all data from the database
        users = User.query.all()
        groups = Group.query.all()
        polls = Poll.query.all()
        options = PollOption.query.all()
        votes = Vote.query.all()
        
        # Format the data for display
        formatted_users = [format_user(user) for user in users]
        formatted_groups = [format_group(group) for group in groups]
        formatted_polls = [format_poll(poll) for poll in polls]
        formatted_votes = [format_vote(vote) for vote in votes]
        
        # Print the data
        print_section("USERS", formatted_users)
        print_section("GROUPS", formatted_groups)
        print_section("POLLS", formatted_polls)
        print_section("VOTES", formatted_votes)
        
        print("\nDatabase summary:")
        print(f"- {len(users)} users")
        print(f"- {len(groups)} groups")
        print(f"- {len(polls)} polls")
        print(f"- {len(options)} options")
        print(f"- {len(votes)} votes")

if __name__ == "__main__":
    view_database()
