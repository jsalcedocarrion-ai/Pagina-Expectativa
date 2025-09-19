


// DOM Elements
const form = document.getElementById('notification-form-element');
const formContainer = document.getElementById('form-container');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');

// Toast notification system
function showToast(title, description, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    toast.innerHTML = `
        <div class="toast-title">${title}</div>
        <div class="toast-description">${description}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => {
                if (toast.parentNode) {
                    toastContainer.removeChild(toast);
                }
            }, 300);
        }
    }, 5000);
}

// Add slideOut animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateForm() {
    const email = emailInput.value.trim();
    
    if (!email) {
        showToast('Error', 'Por favor ingresa tu correo electrónico', 'error');
        emailInput.focus();
        return false;
    }
    
    if (!validateEmail(email)) {
        showToast('Error', 'Por favor ingresa un correo electrónico válido', 'error');
        emailInput.focus();
        return false;
    }
    
    return true;
}

// Success state UI
function showSuccessState() {
    formContainer.innerHTML = `
        <div class="success-card">
            <div class="success-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22,4 12,14.01 9,11.01"/>
                </svg>
            </div>
            <h3>¡Te hemos registrado!</h3>
            <p>Recibirás una notificación tan pronto como el sistema esté disponible.</p>
        </div>
    `;
}

// Form submission handler
function handleFormSubmit(e) {
    e.preventDefault();
    
    if (isSubmitted) {
        return;
    }
    
    if (!validateForm()) {
        return;
    }
    
    // Disable form during submission
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        isSubmitted = true;
        showSuccessState();
        showToast(
            '¡Registrado exitosamente!', 
            'Te notificaremos cuando el sistema esté disponible',
            'success'
        );
        
        // Store submission data (you can send this to your backend)
        const formData = {
            email: emailInput.value.trim(),
            phone: phoneInput.value.trim(),
            timestamp: new Date().toISOString()
        };
        
        console.log('Form submitted:', formData);
        
        // Here you would typically send the data to your server
        // Example: sendToServer(formData);
        
    }, 1000);
}

// Smooth scroll to form
function scrollToForm() {
    const formSection = document.getElementById('canales-form');
    formSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Phone number formatting
function formatPhone(value) {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');
    
    // Format as (809) 000-0000
    if (digits.length >= 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    } else if (digits.length >= 6) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else if (digits.length >= 3) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else {
        return digits;
    }
}

// Input handlers
function handlePhoneInput(e) {
    const formatted = formatPhone(e.target.value);
    e.target.value = formatted;
}

// Animation on scroll
function handleScroll() {
    const elements = document.querySelectorAll('.feature-card, .contact-card');
    
    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !el.classList.contains('animate-in')) {
            el.classList.add('animate-in');
        }
    });
}

// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
    .feature-card, .contact-card {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .feature-card.animate-in, .contact-card.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyle);

// Keyboard navigation
function handleKeyboard(e) {
    if (e.key === 'Enter' && e.target.tagName !== 'BUTTON' && e.target.type !== 'submit') {
        e.preventDefault();
        const form = e.target.closest('form');
        if (form) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.click();
            }
        }
    }
}

// Initialize event listeners
function initializeEventListeners() {
    // Form submission
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
    
    // Phone formatting
    if (phoneInput) {
        phoneInput.addEventListener('input', handlePhoneInput);
    }
    
    // Scroll animations
    window.addEventListener('scroll', handleScroll);
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
    
    // Initial scroll check
    handleScroll();
}

// Utility function for external API integration
function sendToServer(formData) {
    // Example implementation - replace with your actual API endpoint
    /*
    fetch('/api/notifications', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('Error', 'Hubo un problema al enviar el formulario. Inténtalo de nuevo.', 'error');
    });
    */
}

// Form data export function
function exportFormData() {
    const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    
    if (submissions.length === 0) {
        showToast('Información', 'No hay datos para exportar', 'info');
        return;
    }
    
    const csv = [
        ['Email', 'Teléfono', 'Fecha de Registro'],
        ...submissions.map(sub => [sub.email, sub.phone || '', sub.timestamp])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registro-notificaciones.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Store form data locally (backup)
function storeFormDataLocally(formData) {
    try {
        const submissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('formSubmissions', JSON.stringify(submissions));
    } catch (error) {
        console.error('Error storing form data locally:', error);
    }
}

// Enhanced form submission with local storage backup
const originalHandleFormSubmit = handleFormSubmit;
handleFormSubmit = function(e) {
    e.preventDefault();
    
    if (isSubmitted || !validateForm()) {
        return;
    }
    
    const submitButton = form.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    const formData = {
        email: emailInput.value.trim(),
        phone: phoneInput.value.trim(),
        timestamp: new Date().toISOString()
    };
    
    // Store locally as backup
    storeFormDataLocally(formData);
    
    setTimeout(() => {
        isSubmitted = true;
        showSuccessState();
        showToast(
            '¡Registrado exitosamente!', 
            'Te notificaremos cuando el sistema esté disponible',
            'success'
        );
        
        console.log('Form submitted:', formData);
        // sendToServer(formData); // Uncomment when backend is ready
        
    }, 1000);
};

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeEventListeners);
} else {
    initializeEventListeners();
}

// Export functions for global access
window.scrollToForm = scrollToForm;
window.exportFormData = exportFormData;



