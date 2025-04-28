"""
Database seeder for Project Bolt

This script populates the database with sample data for development and testing.
Run this script after setting up your database with `flask db upgrade`.

Usage:
    python seed.py
"""

import uuid
from datetime import datetime, timedelta
from app import app, db
from models import User, Group, Poll, PollOption, Vote

def create_users():
    """Create sample users"""
    print("Creating sample users...")
    
    # Clear existing users (comment out if you want to keep existing data)
    User.query.delete()
    
    # Create admin user
    admin = User(
        id="user1",
        username="admin",
        email="admin@example.com",
        bio="Application administrator",
        avatar="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",
        created_at=datetime.now() - timedelta(days=30)
    )
    admin.set_password("admin123")
    
    # Create regular users
    user1 = User(
        id="user2",
        username="johndoe",
        email="john@example.com",
        bio="Hi, I'm John! I love movies and music.",
        avatar="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
        created_at=datetime.now() - timedelta(days=25)
    )
    user1.set_password("password123")
    
    user2 = User(
        id="user3",
        username="janedoe",
        email="jane@example.com",
        bio="Hey there! I'm interested in photography and travel.",
        avatar="https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
        created_at=datetime.now() - timedelta(days=20)
    )
    user2.set_password("password123")
    
    # Add users to database
    db.session.add_all([admin, user1, user2])
    db.session.commit()
    
    return [admin, user1, user2]

def create_groups(users):
    """Create sample groups"""
    print("Creating sample groups...")
    
    # Clear existing groups
    Group.query.delete()
    
    # Create groups
    movie_night = Group(
        id="group1",
        name="Movie Night",
        description="Weekly movie night with friends. We vote on what to watch!",
        creator_id=users[0].id,
        created_at=datetime.now() - timedelta(days=15)
    )
    
    book_club = Group(
        id="group2",
        name="Book Club",
        description="Monthly book discussion group. We read and discuss one book per month.",
        creator_id=users[1].id,
        created_at=datetime.now() - timedelta(days=10)
    )
    
    travel_buddies = Group(
        id="group3",
        name="Travel Buddies",
        description="Group for planning trips and sharing travel experiences.",
        creator_id=users[2].id,
        created_at=datetime.now() - timedelta(days=5)
    )
    
    # Add members to groups
    movie_night.members.append(users[0])
    movie_night.members.append(users[1])
    movie_night.members.append(users[2])
    
    book_club.members.append(users[0])
    book_club.members.append(users[1])
    
    travel_buddies.members.append(users[0])
    travel_buddies.members.append(users[2])
    
    # Add groups to database
    db.session.add_all([movie_night, book_club, travel_buddies])
    db.session.commit()
    
    return [movie_night, book_club, travel_buddies]

def create_polls(groups, users):
    """Create sample polls"""
    print("Creating sample polls...")
    
    # Clear existing polls, options, and votes
    Vote.query.delete()
    PollOption.query.delete()
    Poll.query.delete()
    
    # Create polls for the movie night group
    weekend_poll = Poll(
        id="poll1",
        title="What movie should we watch this weekend?",
        description="Vote for your favorite movie for our Saturday movie night!",
        group_id=groups[0].id,
        creator_id=users[0].id,
        created_at=datetime.now() - timedelta(days=2),
        expire_at=datetime.now() + timedelta(days=1)
    )
    
    # Create options for the weekend poll
    option1 = PollOption(
        id="option1",
        poll_id=weekend_poll.id,
        text="The Shawshank Redemption"
    )
    option2 = PollOption(
        id="option2",
        poll_id=weekend_poll.id,
        text="Inception"
    )
    option3 = PollOption(
        id="option3",
        poll_id=weekend_poll.id,
        text="The Dark Knight"
    )
    
    # Create a poll for the book club
    book_poll = Poll(
        id="poll2",
        title="Which book should we read next month?",
        description="Vote for next month's book selection",
        group_id=groups[1].id,
        creator_id=users[1].id,
        created_at=datetime.now() - timedelta(days=5),
        expire_at=datetime.now() + timedelta(days=3)
    )
    
    # Create options for the book poll
    book_option1 = PollOption(
        id="option4",
        poll_id=book_poll.id,
        text="To Kill a Mockingbird"
    )
    book_option2 = PollOption(
        id="option5",
        poll_id=book_poll.id,
        text="1984"
    )
    book_option3 = PollOption(
        id="option6",
        poll_id=book_poll.id,
        text="The Great Gatsby"
    )
    
    # Add all poll options to the database
    db.session.add_all([
        weekend_poll, option1, option2, option3,
        book_poll, book_option1, book_option2, book_option3
    ])
    db.session.commit()
    
    # Create some votes
    votes = [
        Vote(id=str(uuid.uuid4()), option_id=option1.id, user_id=users[0].id, voted_at=datetime.now() - timedelta(hours=12)),
        Vote(id=str(uuid.uuid4()), option_id=option2.id, user_id=users[1].id, voted_at=datetime.now() - timedelta(hours=10)),
        Vote(id=str(uuid.uuid4()), option_id=option3.id, user_id=users[2].id, voted_at=datetime.now() - timedelta(hours=8)),
        Vote(id=str(uuid.uuid4()), option_id=book_option1.id, user_id=users[0].id, voted_at=datetime.now() - timedelta(hours=6)),
        Vote(id=str(uuid.uuid4()), option_id=book_option2.id, user_id=users[1].id, voted_at=datetime.now() - timedelta(hours=4))
    ]
    db.session.add_all(votes)
    db.session.commit()
    
    return [weekend_poll, book_poll]

def seed_database():
    """Main function to seed the database"""
    with app.app_context():
        # Confirm before proceeding
        print("This will delete existing data and create sample data in the database.")
        confirm = input("Do you want to continue? (y/n): ")
        
        if confirm.lower() != 'y':
            print("Database seeding cancelled.")
            return
        
        # Create samples
        users = create_users()
        groups = create_groups(users)
        polls = create_polls(groups, users)
        
        print("Database seeding completed successfully!")
        print(f"- {len(users)} users created")
        print(f"- {len(groups)} groups created")
        print(f"- {len(polls)} polls created with options and votes")

if __name__ == "__main__":
    seed_database()
