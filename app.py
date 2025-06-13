from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# --- PENTING: Muat model pipeline LENGKAP yang baru Anda latih ---
# Pastikan nama file ini sesuai dengan yang Anda simpan dari script pelatihan yang dimodifikasi
try:
    model_pipeline = joblib.load('obesity_classifier_simple_rf.pkl') # Ganti jika nama file Anda berbeda
    print("Model pipeline sederhana berhasil dimuat.")
except FileNotFoundError:
    print("Error: Model file 'obesity_classifier_simple_rf.pkl' tidak ditemukan.")
    exit()
except Exception as e:
    print(f"Error saat memuat model: {e}")
    exit()


@app.route('/')
def index():
    return render_template('index.html') # Arahkan ke template HTML baru

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ambil data dari form HANYA untuk 4 fitur yang diinginkan
        input_data = {
            'Gender': request.form['Gender'],
            'Age': float(request.form['Age']),
            'Height': float(request.form['Height']),
            'Weight': float(request.form['Weight'])
        }
        
        # Buat DataFrame dari input data
        # Penting: DataFrame harus memiliki nama kolom yang sama persis
        # dan urutan yang sama dengan data asli saat melatih model
        input_df = pd.DataFrame([input_data])

        # Lakukan prediksi menggunakan pipeline
        prediction_result = model_pipeline.predict(input_df)
        prediction_proba = model_pipeline.predict_proba(input_df)

        # Ambil nama kelas dari model untuk probabilitas
        class_labels = model_pipeline.named_steps['classifier'].classes_
        probabilities = dict(zip(class_labels, prediction_proba[0]))
        
        # Format output prediksi
        result_text = prediction_result[0]

        # Check if request is AJAX
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'prediction': result_text, 'probabilities': probabilities})
        else:
            return render_template('index_simple.html', prediction=result_text, probabilities=probabilities, input_data=input_data)
            
    except ValueError as ve:
        error_message = f"Input tidak valid: {str(ve)}. Pastikan semua nilai numerik diisi dengan benar."
        print(f"Error in prediction: {error_message}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': error_message}), 400
        else:
            return render_template('index_simple.html', error=error_message, input_data=request.form)
    except KeyError as ke:
        error_message = f"Kolom input tidak lengkap: {str(ke)}. Pastikan semua field terisi."
        print(f"Error in prediction: {error_message}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': error_message}), 400
        else:
            return render_template('index_simple.html', error=error_message, input_data=request.form)
    except Exception as e:
        error_message = f"Terjadi kesalahan: {str(e)}. Silakan coba lagi."
        print(f"Error in prediction: {error_message}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': error_message}), 500
        else:
            return render_template('index_simple.html', error=error_message, input_data=request.form)

if __name__ == '__main__':
    app.run(debug=True, port=5050)