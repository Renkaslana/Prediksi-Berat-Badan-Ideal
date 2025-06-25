from flask import Flask, render_template, request, jsonify
import joblib
import pandas as pd
import os # Untuk memeriksa keberadaan file

app = Flask(__name__)

# --- Daftar semua model yang tersedia ---
MODEL_FILES = {
    'SVM': 'models/obesity_classifier_simple_svm.pkl',
    'KNN': 'models/obesity_classifier_simple_knn.pkl',
    'RandomForest': 'models/obesity_classifier_simple_randomforest.pkl'
}

# Pre-load models to avoid loading on every request (untuk performa)
LOADED_MODELS = {}

for algo_name, file_path in MODEL_FILES.items():
    if os.path.exists(file_path):
        try:
            LOADED_MODELS[algo_name] = joblib.load(file_path)
            print(f"Model {algo_name} berhasil dimuat dari {file_path}")
        except Exception as e:
            print(f"Error saat memuat model {algo_name} dari {file_path}: {e}")
            LOADED_MODELS[algo_name] = None # Set ke None jika gagal dimuat
    else:
        print(f"Peringatan: File model {file_path} untuk {algo_name} tidak ditemukan.")
        LOADED_MODELS[algo_name] = None # Set ke None jika file tidak ada

@app.route('/')
def index():
    # Kirim daftar algoritma yang berhasil dimuat ke template
    available_algorithms = [name for name, model in LOADED_MODELS.items() if model is not None]
    return render_template('index.html', algorithms=available_algorithms)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ambil nama algoritma yang dipilih pengguna dari form
        selected_algorithm = request.form['algorithm_choice']
        
        # Periksa apakah algoritma yang dipilih tersedia dan berhasil dimuat
        if selected_algorithm not in LOADED_MODELS or LOADED_MODELS[selected_algorithm] is None:
            raise ValueError(f"Algoritma '{selected_algorithm}' tidak tersedia atau gagal dimuat.")

        model_pipeline = LOADED_MODELS[selected_algorithm]

        # Ambil data dari form hanya untuk 4 fitur yang diinginkan
        input_data = {
            'Gender': request.form['Gender'],
            'Age': float(request.form['Age']),
            'Height': float(request.form['Height']),
            'Weight': float(request.form['Weight'])
        }
        
        # Buat DataFrame dari input data
        # Penting: Nama kolom harus sama persis dengan yang digunakan saat melatih model
        input_df = pd.DataFrame([input_data])

        # Lakukan prediksi menggunakan pipeline yang dipilih
        prediction_result = model_pipeline.predict(input_df)
        prediction_proba = model_pipeline.predict_proba(input_df)

        # Ambil nama kelas dari model untuk probabilitas
        # (Akses classifier dari dalam pipeline)
        class_labels = model_pipeline.named_steps['classifier'].classes_
        probabilities = dict(zip(class_labels, prediction_proba[0]))
        
        # Ambil string nama kelas hasil prediksi
        result_text = prediction_result[0]

        # Return JSON response for AJAX requests
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'prediction': result_text, 'probabilities': probabilities, 'algorithm': selected_algorithm})
        else:
            # Fallback for non-AJAX (jika ada, jarang terjadi dengan setup AJAX)
            return render_template('index.html', 
                                   prediction=result_text, probabilities=probabilities, 
                                   input_data=input_data, algorithm=selected_algorithm, 
                                   algorithms=[name for name, model in LOADED_MODELS.items() if model is not None])
            
    except ValueError as ve:
        error_message = f"Input tidak valid: {str(ve)}. Pastikan semua nilai diisi dengan benar."
        print(f"Error in prediction: {error_message}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': error_message}), 400
        else:
            return render_template('index_multi_algo_simple_features.html', 
                                   error=error_message, input_data=request.form, 
                                   algorithms=[name for name, model in LOADED_MODELS.items() if model is not None])
    except KeyError as ke:
        error_message = f"Kolom input tidak lengkap: {str(ke)}. Pastikan semua field terisi."
        print(f"Error in prediction: {error_message}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': error_message}), 400
        else:
            return render_template('index_multi_algo_simple_features.html', 
                                   error=error_message, input_data=request.form, 
                                   algorithms=[name for name, model in LOADED_MODELS.items() if model is not None])
    except Exception as e:
        error_message = f"Terjadi kesalahan: {str(e)}. Silakan coba lagi."
        print(f"Error in prediction: {error_message}")
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return jsonify({'error': error_message}), 500
        else:
            return render_template('index_multi_algo_simple_features.html', 
                                   error=error_message, input_data=request.form, 
                                   algorithms=[name for name, model in LOADED_MODELS.items() if model is not None])

if __name__ == '__main__':
    app.run(debug=True, port=5050)