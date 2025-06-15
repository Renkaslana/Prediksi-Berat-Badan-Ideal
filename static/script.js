  // BMI Calculation Functions
  function calculateBMI(weight, height) {
    if (!weight || !height || weight <= 0 || height <= 0) return null;
    return weight / (height * height);
}

function getBMICategory(bmi) {
    if (bmi < 18.5) return { 
        category: 'Kurus', 
        color: 'text-blue-600', 
        bgColor: 'bg-blue-100', 
        borderColor: 'border-blue-200',
        gradientFrom: 'from-blue-400',
        gradientTo: 'to-blue-600'
    };
    if (bmi < 25) return { 
        category: 'Normal', 
        color: 'text-green-600', 
        bgColor: 'bg-green-100', 
        borderColor: 'border-green-200',
        gradientFrom: 'from-green-400',
        gradientTo: 'to-green-600'
    };
    if (bmi < 30) return { 
        category: 'Gemuk', 
        color: 'text-yellow-600', 
        bgColor: 'bg-yellow-100', 
        borderColor: 'border-yellow-200',
        gradientFrom: 'from-yellow-400',
        gradientTo: 'to-yellow-600'
    };
    return { 
        category: 'Obesitas', 
        color: 'text-red-600', 
        bgColor: 'bg-red-100', 
        borderColor: 'border-red-200',
        gradientFrom: 'from-red-400',
        gradientTo: 'to-red-600'
    };
}

function calculateIdealWeight(height) {
    if (!height || height <= 0) return null;
    const minWeight = 18.5 * height * height;
    const maxWeight = 24.9 * height * height;
    return { min: minWeight.toFixed(1), max: maxWeight.toFixed(1) };
}

function updateBMIDisplay(bmi) {
    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');
    const bmiRingValueEl = document.getElementById('bmiRingValue');
    const bmiProgressRing = document.getElementById('bmiProgressRing');

    if (bmi) {
        const { category, color, bgColor, borderColor } = getBMICategory(bmi);
        
        bmiValueEl.textContent = bmi.toFixed(1);
        bmiValueEl.className = `text-4xl font-bold mb-2 transition-all duration-500 ${color}`;
        
        bmiCategoryEl.textContent = category;
        bmiCategoryEl.className = `inline-block px-4 py-2 rounded-full text-sm font-medium transition-all duration-500 ${bgColor} ${color} border ${borderColor}`;
        
        bmiRingValueEl.textContent = bmi.toFixed(1);
        
        // Update progress ring
        const progress = Math.min((bmi / 40) * 314, 314);
        bmiProgressRing.style.strokeDashoffset = 314 - progress;
    } else {
        bmiValueEl.textContent = '--';
        bmiValueEl.className = 'text-4xl font-bold mb-2 transition-all duration-500 text-gray-800';
        bmiCategoryEl.textContent = 'Masukkan Data';
        bmiCategoryEl.className = 'inline-block px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 transition-all duration-500';
        bmiRingValueEl.textContent = '--';
        bmiProgressRing.style.strokeDashoffset = '314';
    }
}

function updateIdealWeight(height) {
    const idealWeightCard = document.getElementById('idealWeightCard');
    const idealWeightRange = document.getElementById('idealWeightRange');

    if (height && height > 0) {
        const ideal = calculateIdealWeight(height);
        idealWeightRange.textContent = `${ideal.min} - ${ideal.max}`;
        idealWeightCard.style.opacity = '1';
    } else {
        idealWeightCard.style.opacity = '0';
    }
}

function showHealthTips(prediction) {
    const healthTipsCard = document.getElementById('healthTipsCard');
    const tipsContainer = document.getElementById('healthTips');
    const tipsIcon = document.getElementById('tipsIcon');
    const tipsSubtitle = document.getElementById('tipsSubtitle');
    
    let tips = [];
    let iconGradient = 'from-blue-400 to-purple-600';
    let subtitle = 'Tips khusus untuk Anda';
    
    const predictionLower = prediction.toLowerCase();
    
    if (predictionLower.includes('obesity') || predictionLower.includes('obesitas')) {
        iconGradient = 'from-red-400 to-red-600';
        subtitle = 'Tips khusus untuk mengatasi obesitas';
        tips = [
            { icon: 'fas fa-utensils', text: 'Kurangi porsi makan dan batasi makanan tinggi kalori' },
            { icon: 'fas fa-running', text: 'Mulai dengan jalan kaki 15-30 menit setiap hari' },
            { icon: 'fas fa-user-md', text: 'Konsultasi rutin dengan dokter untuk monitoring' },
            { icon: 'fas fa-glass-water', text: 'Minum air putih 8-10 gelas per hari' },
            { icon: 'fas fa-brain', text: 'Kelola stres dengan meditasi atau yoga' }
        ];
    } else if (predictionLower.includes('overweight') || predictionLower.includes('gemuk')) {
        iconGradient = 'from-yellow-400 to-yellow-600';
        subtitle = 'Tips untuk menurunkan berat badan';
        tips = [
            { icon: 'fas fa-balance-scale', text: 'Kurangi 300-500 kalori per hari secara bertahap' },
            { icon: 'fas fa-carrot', text: 'Pilih makanan dengan indeks glikemik rendah' },
            { icon: 'fas fa-dumbbell', text: 'Kombinasikan kardio dengan latihan kekuatan' },
            { icon: 'fas fa-moon', text: 'Pastikan tidur 7-8 jam setiap malam' },
            { icon: 'fas fa-book', text: 'Catat makanan harian untuk meningkatkan kesadaran' }
        ];
    } else if (predictionLower.includes('normal')) {
        iconGradient = 'from-green-400 to-green-600';
        subtitle = 'Tips mempertahankan berat badan ideal';
        tips = [
            { icon: 'fas fa-heart', text: 'Pertahankan pola makan seimbang yang sudah baik' },
            { icon: 'fas fa-apple-alt', text: 'Konsumsi makanan dari semua kelompok nutrisi' },
            { icon: 'fas fa-bicycle', text: 'Lakukan 150 menit aktivitas fisik per minggu' },
            { icon: 'fas fa-stethoscope', text: 'Check-up kesehatan rutin setahun sekali' },
            { icon: 'fas fa-smile', text: 'Jaga keseimbangan hidup dan kelola stres' }
        ];
    } else if (predictionLower.includes('insufficient') || predictionLower.includes('underweight')) {
        iconGradient = 'from-blue-400 to-blue-600';
        subtitle = 'Tips untuk menambah berat badan sehat';
        tips = [
            { icon: 'fas fa-hamburger', text: 'Konsumsi makanan padat nutrisi dan tinggi kalori' },
            { icon: 'fas fa-drumstick-bite', text: 'Pastikan asupan protein 1.6-2.2g per kg berat badan' },
            { icon: 'fas fa-dumbbell', text: 'Fokus pada latihan kekuatan untuk massa otot' },
            { icon: 'fas fa-clock', text: 'Makan 5-6 kali dalam porsi kecil sepanjang hari' },
            { icon: 'fas fa-blender', text: 'Konsumsi smoothies tinggi kalori sebagai camilan' }
        ];
    }
    
    // Update icon dan subtitle
    tipsIcon.className = `w-10 h-10 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center mr-3 transition-all duration-300`;
    tipsSubtitle.textContent = subtitle;
    
    // Update tips content
    tipsContainer.innerHTML = tips.map(tip => `
        <div class="flex items-start space-x-3 p-3 bg-white/50 rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
            <div class="w-8 h-8 bg-gradient-to-br ${iconGradient} rounded-lg flex items-center justify-center flex-shrink-0">
                <i class="${tip.icon} text-white text-sm"></i>
            </div>
            <p class="text-sm text-gray-700 leading-relaxed">${tip.text}</p>
        </div>
    `).join('');
    
    // Show the tips card
    healthTipsCard.classList.remove('hidden');
    healthTipsCard.classList.add('animate-slide-up');
}

function showPredictionResult(prediction, probabilities) {
    const resultsSection = document.getElementById('resultsSection');
    const predictionText = document.getElementById('predictionText');
    const probabilitySection = document.getElementById('probabilitySection');
    const probabilityList = document.getElementById('probabilityList');
    const errorDiv = document.getElementById('errorMessage');
    
    errorDiv.classList.add('hidden');
    
    predictionText.textContent = prediction;
    resultsSection.classList.remove('hidden');
    
    // Show probabilities if available
    if (probabilities && Object.keys(probabilities).length > 0) {
        probabilityList.innerHTML = '';
        for (const [key, value] of Object.entries(probabilities)) {
            const percentage = (value * 100).toFixed(1);
            const progressWidth = Math.min(percentage, 100);
            
            probabilityList.innerHTML += `
                <div class="flex items-center justify-between">
                    <span class="text-sm font-medium text-gray-700">${key}</span>
                    <div class="flex items-center space-x-2 flex-1 ml-4">
                        <div class="flex-1 bg-gray-200 rounded-full h-2">
                            <div class="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000" 
                                 style="width: ${progressWidth}%"></div>
                        </div>
                        <span class="text-sm font-semibold text-gray-800 min-w-[3rem]">${percentage}%</span>
                    </div>
                </div>
            `;
        }
        probabilitySection.classList.remove('hidden');
    }
    
    // Show health tips based on prediction
    showHealthTips(prediction);
}

function showErrorMessage(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const resultsSection = document.getElementById('resultsSection');
    const healthTipsCard = document.getElementById('healthTipsCard');
    
    resultsSection.classList.add('hidden');
    healthTipsCard.classList.add('hidden');
    
    errorText.textContent = message;
    errorDiv.classList.remove('hidden');
}

// AJAX Form submission function
async function submitPredictionForm(formData) {
    try {
        const response = await fetch('/predict', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            return { prediction: result.prediction, probabilities: result.probabilities || {} };
        } else {
            const result = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(result, 'text/html');
            
            const predictionPatterns = [
                /Obesity Type \w+/i,
                /Normal Weight/i,
                /Overweight Level \w+/i,
                /Insufficient Weight/i
            ];
            
            const bodyText = doc.body.textContent || doc.body.innerText || '';
            
            for (const pattern of predictionPatterns) {
                const match = bodyText.match(pattern);
                if (match) {
                    return { prediction: match[0], probabilities: {} };
                }
            }
            
            return { prediction: "Prediksi berhasil diproses", probabilities: {} };
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}

function updateRealTimeBMI() {
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    
    const bmi = calculateBMI(weight, height);
    
    updateBMIDisplay(bmi);
    updateIdealWeight(height);
}

// Event Listeners
document.getElementById('weight').addEventListener('input', updateRealTimeBMI);
document.getElementById('height').addEventListener('input', updateRealTimeBMI);

document.getElementById('predictionForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    submitText.style.display = 'none';
    loadingSpinner.classList.remove('hidden');
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(this);
        const result = await submitPredictionForm(formData);
        showPredictionResult(result.prediction, result.probabilities);
    } catch (error) {
        console.error('Prediction error:', error);
        showErrorMessage('Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.');
    } finally {
        submitText.style.display = 'inline';
        loadingSpinner.classList.add('hidden');
        submitBtn.disabled = false;
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Check Flask data on page load
    if (window.flaskData && window.flaskData.prediction) {
        showPredictionResult(window.flaskData.prediction, window.flaskData.probabilities || {});
    }
    if (window.flaskData && window.flaskData.error) {
        showErrorMessage(window.flaskData.error);
    }
});