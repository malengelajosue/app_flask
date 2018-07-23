import sqlite3
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH=os.path.join(BASE_DIR,'database/db.sqlite3')
conn = sqlite3.connect(DB_PATH)
print ("Opened database successfully");
conn.execute('CREATE TABLE students (name TEXT, addr TEXT, city TEXT, pin TEXT)')
print ("Table created successfully");
conn.close()


