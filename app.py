import os
import csv
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, flash, send_from_directory

app = Flask(__name__)
app.secret_key = 'change_this-to-something-random-and-secret'

# --- DATA FILE SETUP ---
DATA_DIR = os.path.join(app.root_path, 'data')
os.makedirs(DATA_DIR, exist_ok=True)
CONTACT_FILE = os.path.join(DATA_DIR, 'contacts.csv')

if not os.path.exists(CONTACT_FILE):
    with open(CONTACT_FILE, mode='w', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['Timestamp', 'Name', 'Email', 'Subject', 'Message'])

# --- ROUTES ---

@app.route('/')
def home():
    """Renders the main homepage."""
    return render_template('index.html')

@app.route('/contact', methods=['POST'])
def contact():
    try:
        name = request.form.get('name')
        email = request.form.get('email')
        # Subject might not be in your form HTML anymore based on previous index.html, 
        # but keeping it here just in case you add it back.
        subject = request.form.get('subject', 'Portfolio Contact') 
        message = request.form.get('message')

        if not name or not email or not message:
            flash('Please fill in all required fields.', 'error')
            return redirect(url_for('home') + '#contact')

        with open(CONTACT_FILE, mode='a', newline='', encoding='utf-8') as file:
            writer = csv.writer(file)
            writer.writerow([datetime.now().strftime("%Y-%m-%d %H:%M:%S"), name, email, subject, message])

        flash('Your message has been sent successfully! Hari Om.', 'success')
        return redirect(url_for('home') + '#contact')

    except Exception as e:
        print(f"Error saving contact: {e}")
        flash('Something went wrong. Please try again later.', 'error')
        return redirect(url_for('home') + '#contact')

@app.route('/download_resume')
def download_resume():
    try:
        return send_from_directory(
            directory=os.path.join(app.root_path, 'static/files'),
            path='resume.pdf',
            as_attachment=True
        )
    except FileNotFoundError:
        flash("Resume file not found on server.", "error")
        return redirect(url_for('home'))

# --- MAIN BLOCK ---
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)