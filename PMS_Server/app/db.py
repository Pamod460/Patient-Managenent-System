from app import mysql
from MySQLdb.cursors import DictCursor


# def fetch_one(query, params=None):
#     cur = mysql.connection.cursor()
#     cur.execute(query, params)
#     result = cur.fetchone()
#     cur.close()
#     return result


def fetch_one(query, params=None):
    cursor = mysql.connection.cursor()
    cursor.execute(query, params)
    row = cursor.fetchone()
    desc = cursor.description
    cursor.close()
   
    try:
        if row is not None:
            result = create_dict_from_row(desc, row)
            return result
        else:
            print("No data found.")
            return None
    except ValueError as e:
        print(e)
    return None


def fetch_all(query, params=None):
    cur = mysql.connection.cursor(DictCursor)
    cur.execute(query, params)
    result = cur.fetchall()
    cur.close()
    return result


def execute_query(query, params=()):
    cur = mysql.connection.cursor()
    cur.execute(query, params)
    mysql.connection.commit()
    cur.close()

def create_dict_from_row(desc, row):
    # Check if desc or row is None
    if desc is None or row is None:
        raise ValueError("desc or row cannot be None")

    # Check if lengths of desc and row are the same
    if len(desc) != len(row):
        raise ValueError("desc and row must have the same length")

    # Check if any element in desc or row is None
    for i in range(len(row)):
        if desc[i] is None or row[i] is None:
            raise ValueError(f"desc or row contains None at index {i}")

    # Ensure desc[i] has at least one element for desc[i][0]
    for i in range(len(row)):
        if not desc[i] or len(desc[i]) == 0:
            raise ValueError(f"desc[{i}] is empty or does not contain any elements")

    # Create the dictionary comprehension
    return {desc[i][0]: row[i] for i in range(len(row))}