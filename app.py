from flask import Flask, render_template, request, jsonify
import pandas as pd
import numpy as np
import joblib
from flask_cors import CORS

# Load the model
scaler = joblib.load('model/scaler.pkl')
pca_best = joblib.load('model/pca_best.pkl')
svr_model = joblib.load('model/svr_model.pkl')

app = Flask(__name__, template_folder='templates', static_folder='static')
CORS(app)

@app.route('/')
def index():
    dataset = pd.read_csv('calories+exercise.csv')
    data = dataset.to_dict('records')
    return render_template('index.html', data=data)  

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        # Extract data from JSON
        gender = int(data['Gender'])
        age = int(data['Age'])
        height = int(data['Height'])
        weight = int(data['Weight'])
        duration = int(data['Duration'])
        heart_rate = int(data['Heart_Rate'])
        body_temp = float(data['Body_Temp'])

        # Create a NumPy array from the input data
        input_data = np.array([[gender, age, height, weight, duration, heart_rate, body_temp]])

        # Scale the input data
        input_data_scaled = scaler.transform(input_data)

        # Apply PCA transformation
        input_data_pca = pca_best.transform(input_data_scaled)

        # Make prediction
        prediction = svr_model.predict(input_data_pca)
        prediction_text = f"Prediksi kalori anda yang terbakar saat berolahraga adalah sekitar {prediction[0]:.2f} kcal"

        return jsonify({'prediction_text': prediction_text})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)

