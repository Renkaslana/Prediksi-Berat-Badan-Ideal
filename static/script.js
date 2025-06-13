  // Check if there's a prediction result from Flask template on page load
    document.addEventListener('DOMContentLoaded', function() {
        if (window.flaskData && window.flaskData.prediction) {
            showPredictionResult(window.flaskData.prediction);
        }
        if (window.flaskData && window.flaskData.error) {
            showErrorMessage(window.flaskData.error);
        }

        // Initialize components
        displayBMIHistory();
        initChart();
        updateChart();
        updateHealthTips();
        
        // Add entrance animations
        setTimeout(() => {
            document.querySelectorAll('.animate-scale-in').forEach((el, index) => {
                setTimeout(() => {
                    el.style.opacity = '1';
                    el.style.transform = 'scale(1)';
                }, index * 100);
            });
        }, 500);
    });

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
        const minWeight = 17.5 * height * height;
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
            
            // Show health status cards
            updateHealthStatus(bmi);
        } else {
            bmiValueEl.textContent = '--';
            bmiValueEl.className = 'text-4xl font-bold mb-2 transition-all duration-500 text-gray-800';
            bmiCategoryEl.textContent = 'Masukkan Data';
            bmiCategoryEl.className = 'inline-block px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-600 transition-all duration-500';
            bmiRingValueEl.textContent = '--';
            bmiProgressRing.style.strokeDashoffset = '314';
            
            // Hide health status cards
            document.getElementById('healthStatus').style.opacity = '0';
            document.getElementById('riskLevel').style.opacity = '0';
        }
    }

    function updateHealthStatus(bmi) {
        const healthStatusEl = document.getElementById('healthStatus');
        const riskLevelEl = document.getElementById('riskLevel');
        const statusIconEl = document.getElementById('statusIcon');
        const statusTextEl = document.getElementById('statusText');
        const riskIconEl = document.getElementById('riskIcon');
        const riskTextEl = document.getElementById('riskText');

        if (bmi) {
            const { category, gradientFrom, gradientTo } = getBMICategory(bmi);
            
            // Health Status
            statusIconEl.className = `w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${gradientFrom} ${gradientTo}`;
            statusTextEl.textContent = category;
            healthStatusEl.style.opacity = '1';

            // Risk Level
            let riskLevel, riskGradient;
            if (bmi < 18.5 || bmi >= 30) {
                riskLevel = 'Tinggi';
                riskGradient = 'from-red-400 to-red-600';
            } else if (bmi >= 25) {
                riskLevel = 'Sedang';
                riskGradient = 'from-yellow-400 to-yellow-600';
            } else {
                riskLevel = 'Rendah';
                riskGradient = 'from-green-400 to-green-600';
            }

            riskIconEl.className = `w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br ${riskGradient}`;
            riskTextEl.textContent = riskLevel;
            riskLevelEl.style.opacity = '1';
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

    function updateHealthTips(bmi) {
        const tipsContainer = document.getElementById('healthTips');
        let tips = [];

        if (!bmi) {
            tips = [
                { icon: 'fas fa-apple-alt', text: 'Konsumsi makanan bergizi seimbang setiap hari', color: 'from-green-400 to-green-600' },
                { icon: 'fas fa-tint', text: 'Minum air putih minimal 8 gelas per hari', color: 'from-blue-400 to-blue-600' },
                { icon: 'fas fa-running', text: 'Lakukan aktivitas fisik minimal 30 menit setiap hari', color: 'from-purple-400 to-purple-600' },
                { icon: 'fas fa-bed', text: 'Tidur yang cukup 7-9 jam per malam', color: 'from-indigo-400 to-indigo-600' }
            ];
        } else if (bmi < 18.5) {
            tips = [
                { icon: 'fas fa-utensils', text: 'Tingkatkan asupan kalori dengan makanan bergizi tinggi', color: 'from-blue-400 to-blue-600' },
                { icon: 'fas fa-dumbbell', text: 'Lakukan latihan kekuatan untuk membangun massa otot', color: 'from-purple-400 to-purple-600' },
                { icon: 'fas fa-user-md', text: 'Konsultasi dengan ahli gizi untuk program penambahan berat', color: 'from-green-400 to-green-600' },
                { icon: 'fas fa-clock', text: 'Makan dalam porsi kecil tapi sering (5-6 kali sehari)', color: 'from-orange-400 to-orange-600' }
            ];
        } else if (bmi >= 30) {
            tips = [
                { icon: 'fas fa-apple-alt', text: 'Fokus pada makanan rendah kalori tinggi nutrisi', color: 'from-red-400 to-red-600' },
                { icon: 'fas fa-running', text: 'Kombinasikan cardio dan latihan kekuatan', color: 'from-pink-400 to-pink-600' },
                { icon: 'fas fa-chart-line', text: 'Pantau asupan kalori harian dengan aplikasi', color: 'from-purple-400 to-purple-600' },
                { icon: 'fas fa-users', text: 'Bergabung dengan komunitas atau program penurunan berat', color: 'from-indigo-400 to-indigo-600' }
            ];
        } else if (bmi >= 25) {
            tips = [
                { icon: 'fas fa-balance-scale', text: 'Jaga keseimbangan kalori masuk dan keluar', color: 'from-yellow-400 to-yellow-600' },
                { icon: 'fas fa-walking', text: 'Tingkatkan aktivitas fisik harian secara bertahap', color: 'from-orange-400 to-orange-600' },
                { icon: 'fas fa-ban', text: 'Kurangi makanan olahan dan minuman manis', color: 'from-red-400 to-red-600' },
                { icon: 'fas fa-moon', text: 'Pastikan tidur berkualitas 7-9 jam per malam', color: 'from-purple-400 to-purple-600' }
            ];
        } else {
            tips = [
                { icon: 'fas fa-heart', text: 'Pertahankan pola makan seimbang dan bervariasi', color: 'from-green-400 to-green-600' },
                { icon: 'fas fa-bicycle', text: 'Tetap aktif dengan olahraga yang Anda sukai', color: 'from-blue-400 to-blue-600' },
                { icon: 'fas fa-smile', text: 'Jaga kesehatan mental dengan aktivitas positif', color: 'from-pink-400 to-pink-600' },
                { icon: 'fas fa-stethoscope', text: 'Lakukan check-up kesehatan rutin', color: 'from-purple-400 to-purple-600' }
            ];
        }

        tipsContainer.innerHTML = tips.map(tip => `
            <div class="flex items-start space-x-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300 hover:transform hover:scale-105">
                <div class="w-8 h-8 bg-gradient-to-br ${tip.color} rounded-lg flex items-center justify-center flex-shrink-0">
                    <i class="${tip.icon} text-white text-sm"></i>
                </div>
                <p class="text-sm text-gray-700 leading-relaxed">${tip.text}</p>
            </div>
        `).join('');
    }

    // Health Tips Based on Prediction Result
    function showHealthTipsBasedOnPrediction(prediction) {
        const personalizedHealthTips = document.getElementById('personalizedHealthTips');
        const personalizedTipsContainer = document.getElementById('personalizedTipsContainer');
        const personalizedTipsIcon = document.getElementById('personalizedTipsIcon');
        
        // Clear previous tips
        personalizedTipsContainer.innerHTML = '';
        
        // Define tips based on prediction
        let tips = [];
        let iconGradient = 'from-purple-400 to-purple-600';
        
        // Convert prediction to lowercase for easier matching
        const predictionLower = prediction.toLowerCase();
        
        if (predictionLower.includes('obesity') || predictionLower.includes('obesitas')) {
            iconGradient = 'from-red-400 to-red-600';
            tips = [
                { icon: 'fas fa-utensils', text: 'Kurangi porsi makan dan batasi makanan tinggi kalori' },
                { icon: 'fas fa-running', text: 'Mulai dengan jalan kaki 15-30 menit setiap hari' },
                { icon: 'fas fa-user-md', text: 'Konsultasi rutin dengan dokter untuk monitoring kesehatan' },
                { icon: 'fas fa-glass-water', text: 'Minum air putih 8-10 gelas per hari' },
                { icon: 'fas fa-brain', text: 'Kelola stres dengan meditasi atau yoga' }
            ];
        } else if (predictionLower.includes('overweight') || predictionLower.includes('gemuk')) {
            iconGradient = 'from-yellow-400 to-yellow-600';
            tips = [
                { icon: 'fas fa-balance-scale', text: 'Kurangi 300-500 kalori per hari secara bertahap' },
                { icon: 'fas fa-carrot', text: 'Pilih makanan dengan indeks glikemik rendah' },
                { icon: 'fas fa-dumbbell', text: 'Kombinasikan kardio dengan latihan kekuatan' },
                { icon: 'fas fa-moon', text: 'Pastikan tidur 7-8 jam setiap malam' },
                { icon: 'fas fa-book', text: 'Catat makanan harian untuk meningkatkan kesadaran' }
            ];
        } else if (predictionLower.includes('normal')) {
            iconGradient = 'from-green-400 to-green-600';
            tips = [
                { icon: 'fas fa-heart', text: 'Pertahankan pola makan seimbang yang sudah baik' },
                { icon: 'fas fa-apple-alt', text: 'Konsumsi makanan dari semua kelompok nutrisi' },
                { icon: 'fas fa-bicycle', text: 'Lakukan 150 menit aktivitas fisik per minggu' },
                { icon: 'fas fa-stethoscope', text: 'Check-up kesehatan rutin setahun sekali' },
                { icon: 'fas fa-smile', text: 'Jaga keseimbangan hidup dan kelola stres' }
            ];
        } else if (predictionLower.includes('insufficient') || predictionLower.includes('underweight') || predictionLower.includes('kurus')) {
            iconGradient = 'from-blue-400 to-blue-600';
            tips = [
                { icon: 'fas fa-hamburger', text: 'Konsumsi makanan padat nutrisi dan tinggi kalori' },
                { icon: 'fas fa-drumstick-bite', text: 'Pastikan asupan protein 1.6-2.2g per kg berat badan' },
                { icon: 'fas fa-dumbbell', text: 'Fokus pada latihan kekuatan untuk massa otot' },
                { icon: 'fas fa-clock', text: 'Makan 5-6 kali dalam porsi kecil sepanjang hari' },
                { icon: 'fas fa-blender', text: 'Konsumsi smoothies tinggi kalori sebagai camilan' }
            ];
        }
        
        // Update icon gradient
        personalizedTipsIcon.className = `w-10 h-10 bg-gradient-to-br ${iconGradient} rounded-xl flex items-center justify-center mr-3`;
        
        // Display tips in sidebar format
        if (tips.length > 0) {
            personalizedTipsContainer.innerHTML = tips.map(tip => `
                <div class="flex items-start space-x-3 p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                    <div class="w-8 h-8 bg-gradient-to-br ${iconGradient} rounded-lg flex items-center justify-center flex-shrink-0">
                        <i class="${tip.icon} text-white text-sm"></i>
                    </div>
                    <p class="text-sm text-gray-700 leading-relaxed">${tip.text}</p>
                </div>
            `).join('');
            
            // Show the personalized tips section
            personalizedHealthTips.style.opacity = '1';
        }
    }

    function showPredictionResult(prediction) {
        const resultDiv = document.getElementById('predictionResult');
        const predictionText = document.getElementById('predictionText');
        const errorDiv = document.getElementById('errorMessage');
        
        // Hide error message if visible
        errorDiv.classList.add('hidden');
        
        // Show result
        predictionText.textContent = prediction;
        resultDiv.classList.remove('hidden');
        
        // Add animation
        resultDiv.classList.add('animate-slide-up');
        
        // Show health tips based on prediction
        showHealthTipsBasedOnPrediction(prediction);
    }

    function showErrorMessage(message) {
        const errorDiv = document.getElementById('errorMessage');
        const errorText = document.getElementById('errorText');
        const resultDiv = document.getElementById('predictionResult');
        const personalizedHealthTips = document.getElementById('personalizedHealthTips');
        
        // Hide result if visible
        resultDiv.classList.add('hidden');
        personalizedHealthTips.style.opacity = '0';
        
        // Show error
        errorText.textContent = message;
        errorDiv.classList.remove('hidden');
        
        // Add animation
        errorDiv.classList.add('animate-shake');
    }

    // AJAX Form Submission Function
    async function submitPredictionForm(formData) {
        try {
            // Convert FormData to JSON
            const jsonData = {};
            formData.forEach((value, key) => {
                jsonData[key] = value;
            });

            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            if (result.error) {
                throw new Error(result.error);
            }
            return result.prediction;
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    // BMI History Management
    function saveBMIHistory(bmi, category) {
        if (!bmi) return;
        
        const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
        const now = new Date();
        const entry = {
            date: now.toLocaleDateString('id-ID'),
            time: now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
            bmi: bmi.toFixed(1),
            category: category
        };
        
        history.unshift(entry);
        if (history.length > 10) history.pop();
        
        localStorage.setItem('bmiHistory', JSON.stringify(history));
        displayBMIHistory();
        updateChart();
    }

    function displayBMIHistory() {
        const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
        const container = document.getElementById('bmiHistory');
        
        if (history.length === 0) {
            container.innerHTML = '<div class="text-center text-gray-500 text-sm py-8">Belum ada riwayat BMI</div>';
            return;
        }
        
        container.innerHTML = history.map(entry => {
            const { color, bgColor } = getBMICategory(parseFloat(entry.bmi));
            return `
                <div class="flex items-center justify-between p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/20 hover:bg-white/70 transition-all duration-300">
                    <div>
                        <div class="font-semibold ${color}">${entry.bmi}</div>
                        <div class="text-xs text-gray-500">${entry.date} ${entry.time}</div>
                    </div>
                    <div class="text-right">
                        <div class="text-xs ${color} font-medium">${entry.category}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function clearHistory() {
        if (confirm('Apakah Anda yakin ingin menghapus semua riwayat BMI?')) {
            localStorage.removeItem('bmiHistory');
            displayBMIHistory();
            updateChart();
        }
    }

    // Chart Management
    let bmiChart;

    function initChart() {
        const ctx = document.getElementById('bmiChart').getContext('2d');
        bmiChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: 'BMI',
                    data: [],
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 3,
                    fill: true,
                    tension: 0.4,
                    pointBackgroundColor: '#667eea',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 6,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 15,
                        max: 40,
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    },
                    x: {
                        grid: {
                            color: 'rgba(0,0,0,0.05)'
                        },
                        ticks: {
                            color: '#6b7280'
                        }
                    }
                }
            }
        });
    }

    function updateChart() {
        const history = JSON.parse(localStorage.getItem('bmiHistory') || '[]');
        const labels = history.reverse().map(entry => entry.date);
        const data = history.map(entry => parseFloat(entry.bmi));
        
        bmiChart.data.labels = labels;
        bmiChart.data.datasets[0].data = data;
        bmiChart.update();
    }

    // Real-time BMI calculation
    function updateRealTimeBMI() {
        const weight = parseFloat(document.getElementById('weight').value);
        const height = parseFloat(document.getElementById('height').value);
        
        const bmi = calculateBMI(weight, height);
        
        updateBMIDisplay(bmi);
        updateIdealWeight(height);
        updateHealthTips(bmi);
        
        if (bmi && weight && height) {
            const { category } = getBMICategory(bmi);
            saveBMIHistory(bmi, category);
        }
    }

    // Event Listeners
    document.getElementById('weight').addEventListener('input', updateRealTimeBMI);
    document.getElementById('height').addEventListener('input', updateRealTimeBMI);

    // AJAX Form submission
    document.getElementById('predictionForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const submitText = document.getElementById('submitText');
        const loadingSpinner = document.getElementById('loadingSpinner');
        
        // Show loading state
        submitText.style.display = 'none';
        loadingSpinner.classList.remove('hidden');
        submitBtn.disabled = true;
        
        try {
            // Create FormData from form
            const formData = new FormData(this);
            
            // Submit form via AJAX
            const prediction = await submitPredictionForm(formData);
            
            // Show result
            showPredictionResult(prediction);
            
        } catch (error) {
            console.error('Prediction error:', error);
            showErrorMessage(error.message || 'Terjadi kesalahan saat melakukan prediksi. Silakan coba lagi.');
        } finally {
            // Reset button state
            submitText.style.display = 'inline';
            loadingSpinner.classList.add('hidden');
            submitBtn.disabled = false;
        }
    });
