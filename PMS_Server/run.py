import click
from app import app

def clear_terminal():
    click.clear()

if __name__ == "__main__":
    clear_terminal()
    app.run(debug=True)
