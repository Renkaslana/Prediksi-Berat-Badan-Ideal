from flask import Flask, render_template, request, jsonify
import joblib

app = Flask(__name__)

# Load model baru dengan 3 fitur
model = joblib.load('model_obesitas_simple.pkl')
label_encoder = joblib.load('label_encoder.pkl')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        input_data = [
            float(request.form['Age']),
            float(request.form['Height']),
            float(request.form['Weight'])
        ]
        prediction = model.predict([input_data])
        result = label_encoder.inverse_transform(prediction)
        
        # Check if request is AJAX
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'prediction': result[0]})
        else:
            # Return template for regular form submission (fallback)
            return render_template('index.html', prediction=result[0])
            
    except Exception as e:
        print(f"Error in prediction: {str(e)}")  # Debug logging
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': str(e)}), 400
        else:
            return render_template('index.html', error=str(e))

if __name__ == '__main__':
    app.run(debug=True, port=5050)
