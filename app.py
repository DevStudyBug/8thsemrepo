import pickle
from flask import request, Flask, render_template, redirect, url_for, flash, send_from_directory
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import os
# from flask_ngrok import run_with_ngrok

# Create app with explicit template and static folder configuration
app = Flask(__name__, 
           template_folder='templates',
           static_folder='static')

# run_with_ngrok(app)
# Configure secret key for session management
app.secret_key = 'your_secret_key_here'

# Ensure static folders exist
os.makedirs('static/images', exist_ok=True)
os.makedirs('static/styles', exist_ok=True)
os.makedirs('static/script', exist_ok=True)

try:
    # Loading models and datasets
    df = pd.read_csv('HR_comma_sep.csv')
    model = pickle.load(open('model.pkl', 'rb'))
    scaler = pickle.load(open('scaler.pkl', 'rb'))
except FileNotFoundError as e:
    print(f"Error loading required files: {e}")
    raise

# Dashboard functions
def reading_cleaning(df):
    df.drop_duplicates(inplace=True)
    cols = df.columns.tolist()
    df.columns = [x.lower() for x in cols]
    return df

df = reading_cleaning(df)

def employee_important_info(df):
    average_satisfaction = df['satisfaction_level'].mean()
    department_satisfaction = df.groupby('department')['satisfaction_level'].mean()
    salary_satisfaction = df.groupby('salary')['satisfaction_level'].mean()
    left_employees = len(df[df['left'] == 1])
    stayed_employees = len(df[df['left'] == 0])
    return average_satisfaction, department_satisfaction, salary_satisfaction, left_employees, stayed_employees

def plots(df, col):
    values = df[col].unique()
    plt.figure(figsize=(15, 10))
    explode = [0.1 if len(values) > 1 else 0] * len(values)
    plt.pie(df[col].value_counts(), explode=explode, startangle=40, autopct='%1.1f%%', shadow=True)
    labels = [f'{value} ({col})' for value in values]
    plt.legend(labels=labels, loc='upper right', fontsize=12)
    plt.title(f"Distribution of {col}", fontsize=16, fontweight='bold')
    save_path = os.path.join('static', 'images', f'{col}.png')
    plt.savefig(save_path)
    plt.close()

def distribution(df, col):
    values = df[col].unique()
    plt.figure(figsize=(15, 10))
    sns.countplot(x=df[col], hue='left', palette='Set1', data=df)
    labels = [f"{val} ({col})" for val in values]
    plt.legend(labels=labels, loc="upper right", fontsize=12)
    plt.title(f"Distribution of {col}", fontsize=16, fontweight='bold')
    plt.xticks(rotation=90)
    save_path = os.path.join('static', 'images', f'{col}_distribution.png')
    plt.savefig(save_path)
    plt.close()

def comparison(df, x, y):
    plt.figure(figsize=(15, 10))
    sns.barplot(x=x, y=y, hue='left', data=df, ci=None)
    plt.title(f'{x} vs {y}', fontsize=16, fontweight='bold')
    save_path = os.path.join('static', 'images', 'comparison.png')
    plt.savefig(save_path)
    plt.close()

def corr_with_left(df):
    df_encoded = pd.get_dummies(df)
    correlations = df_encoded.corr()['left'].sort_values()[:-1]
    colors = ['skyblue' if corr >= 0 else 'salmon' for corr in correlations]
    plt.figure(figsize=(15, 10))
    correlations.plot(kind='barh', color=colors)
    plt.title('Correlation with Left', fontsize=16, fontweight='bold')
    plt.xlabel('Correlation', fontsize=14, fontweight='bold')
    plt.ylabel('Features', fontsize=14, fontweight='bold')
    plt.tight_layout()
    save_path = os.path.join('static', 'images', 'correlation.png')
    plt.savefig(save_path)
    plt.close()

def histogram(df, col):
    fig, axes = plt.subplots(1, 2, figsize=(15, 10))
    sns.histplot(data=df, x=col, hue='left', bins=20, ax=axes[0])
    axes[0].set_title(f"Histogram of {col}", fontsize=16, fontweight='bold')
    sns.kdeplot(data=df, x='satisfaction_level', y='last_evaluation', hue='left', shade=True, ax=axes[1])
    axes[1].set_title("Kernel Density Estimation", fontsize=16, fontweight='bold')
    plt.tight_layout()
    save_path = os.path.join('static', 'images', f'{col}_histogram.png')
    plt.savefig(save_path)
    plt.close()

def prediction(sl_no, gender, ssc_p, hsc_p, degree_p, workex, etest_p, specialisation, mba_p):
    try:
        data = {
            'sl_no': [float(sl_no)],
            'gender': [gender],
            'ssc_p': [float(ssc_p)],
            'hsc_p': [float(hsc_p)],
            'degree_p': [float(degree_p)],
            'workex': [workex],
            'etest_p': [float(etest_p)],
            'specialisation': [specialisation],
            'mba_p': [float(mba_p)]
        }
        data = pd.DataFrame(data)
        data['gender'] = data['gender'].map({'Male':1, "Female":0})
        data['workex'] = data['workex'].map({"Yes":1, "No":0})
        data['specialisation'] = data['specialisation'].map({"Mkt&HR":1, "Mkt&Fin":0})
        scaled_df = scaler.transform(data)
        result = model.predict(scaled_df).reshape(1, -1)
        return result[0]
    except Exception as e:
        print(f"Prediction error: {e}")
        return None

# Routes
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/index')
def home():
    return render_template("index.html")

@app.route('/job')
def job():
    return render_template('job.html')

@app.route('/feedback')
def feedback():
    return render_template('feedback.html')

@app.route('/products')
def product_page():
    return render_template('products.html')

@app.route('/jobfair')
def jobfair():
    return render_template('jobfair.html')


@app.route('/login')
def login():
    return render_template('login.html')

@app.route('/signup')
def singup():
    return render_template('signup.html')
@app.route('/chatbot')
def chatbot():
    return render_template('chatbot.html')
@app.route('/faq')
def faq():
    return render_template('faq.html')

# @app.route('/logout')
# def logout():
#     flash('You have been logged out successfully', 'success')
#     return redirect(url_for('index'))

@app.route('/delivery')
def delivery():
    return render_template('delivery.html')

@app.route('/terms-condition')

def terms():
    return render_template('terms&condition.html')
@app.route('/privacy')
def privacy():
    return render_template('privacy.html')
# @app.route('/course')
# def couses():
#     return render_template('course.html')


@app.route('/ana')
def ana():
    try:
        average_satisfaction, department_satisfaction, salary_satisfaction, left_employees, stayed_employees = employee_important_info(df)
        
        # Generate all plots
        plots(df, 'left')
        plots(df, 'salary')
        plots(df, 'number_project')
        plots(df, 'department')
        distribution(df, 'salary')
        distribution(df, 'department')
        comparison(df, 'department', 'satisfaction_level')
        corr_with_left(df)
        histogram(df, 'satisfaction_level')
        
        # Convert Series to dictionaries
        department_satisfaction = department_satisfaction.to_dict()
        salary_satisfaction = salary_satisfaction.to_dict()
        
        return render_template('ana.html',  # Removed 'templates/' prefix
                             df=df.head(),
                             average_satisfaction=average_satisfaction,
                             department_satisfaction=department_satisfaction,
                             salary_satisfaction=salary_satisfaction,
                             left_employees=left_employees,
                             stayed_employees=stayed_employees)
    except Exception as e:
        flash(f"Error generating analytics: {str(e)}")
        return redirect(url_for('index'))

@app.route("/placement", methods=['POST', 'GET'])
def placement():
    if request.method == 'POST':
        try:
            form_data = {
                'sl_no': request.form['sl_no'],
                'gender': request.form['gender'],
                'ssc_p': request.form['ssc_p'],
                'hsc_p': request.form['hsc_p'],
                'degree_p': request.form['degree_p'],
                'workex': request.form['workex'],
                'etest_p': request.form['etest_p'],
                'specialisation': request.form['specialisation'],
                'mba_p': request.form['mba_p']
                
            }
            
            result = prediction(**form_data)
            
            if result is not None:
                pred = "Placed" if result == 1 else "Not Placed"
                rec = ("We recommend you that this is the best candidate for your business" 
                      if result == 1 
                      else "We recommend you that this is not the best candidate for your business")
                return render_template('job.html', result=pred, rec=rec)
            else:
                flash("Error processing prediction")
                return render_template('job.html', error="Prediction failed")
        except Exception as e:
            flash(f"Error processing form: {str(e)}")
            return render_template('job.html', error="Form processing failed")

    return redirect(url_for('index'))

# Error handlers
@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_server_error(e):
    return render_template('500.html'), 500

# Static file handlers
@app.route('/static/<path:filename>')
def serve_static(filename):
    return send_from_directory(app.static_folder, filename)

if __name__ == "__main__":
    # app.run("0.0.0.0",1000)
    app.run()
    # app.run(debug=True)