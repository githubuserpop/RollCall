"""
Simple SQLite database viewer for Project Bolt

This script connects directly to the SQLite database file and displays its contents.
It doesn't import the Flask app, avoiding any initialization conflicts.
"""

import sqlite3
import json
from datetime import datetime

DB_PATH = "instance/bolt.db"  # Flask stores SQLite databases in the instance folder by default

def dict_factory(cursor, row):
    """Convert database rows to dictionaries"""
    d = {}
    for idx, col in enumerate(cursor.description):
        d[col[0]] = row[idx]
    return d

def get_table_data(conn, table_name):
    """Get all data from a table"""
    cursor = conn.cursor()
    # Use quotes around table name to handle reserved keywords like 'group'
    cursor.execute(f"SELECT * FROM \"{table_name}\"")
    rows = cursor.fetchall()
    return rows

def get_table_names(conn):
    """Get all table names in the database"""
    cursor = conn.cursor()
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
    return [row['name'] for row in cursor.fetchall() if not row['name'].startswith('sqlite_')]

def view_database():
    """Display the contents of the database"""
    try:
        # Connect to the database
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = dict_factory
        
        # Get all table names
        tables = get_table_names(conn)
        
        print(f"\nFound {len(tables)} tables in {DB_PATH}:")
        print(", ".join(tables))
        
        # Show data from each table
        for table in tables:
            rows = get_table_data(conn, table)
            print(f"\n{'=' * 50}")
            print(f" {table.upper()} ({len(rows)})")
            print(f"{'=' * 50}")
            
            for row in rows:
                # Format dates for better display
                formatted_row = {}
                for key, value in row.items():
                    if key.endswith('_at') and value:
                        try:
                            # Try to parse as ISO format date
                            dt = datetime.fromisoformat(value)
                            formatted_row[key] = dt.strftime('%Y-%m-%d %H:%M:%S')
                        except:
                            formatted_row[key] = value
                    else:
                        formatted_row[key] = value
                
                print(json.dumps(formatted_row, indent=2))
        
        # Show relationships (for group_members)
        if 'group_members' in tables:
            print(f"\n{'=' * 50}")
            print(f" GROUP MEMBERSHIPS")
            print(f"{'=' * 50}")
            
            cursor = conn.cursor()
            cursor.execute("""
                SELECT g.name as group_name, u.username
                FROM "group_members" gm
                JOIN "group" g ON gm.group_id = g.id
                JOIN "user" u ON gm.user_id = u.id
            """)
            memberships = cursor.fetchall()
            
            for member in memberships:
                print(f"Group: {member['group_name']} - Member: {member['username']}")
                
        conn.close()
        
    except sqlite3.Error as e:
        print(f"SQLite error: {e}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    view_database()
