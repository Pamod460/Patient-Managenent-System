from flask import render_template
import app


@app.route('/add_patient')
def method_name():
    return render_template('add_patient.html')

