/**
 * Sistema de animaciones avanzadas para Fábulas Emocionales
 * Proporciona efectos visuales y microinteracciones sofisticadas
 */

class AnimationSystem {
    constructor() {
        this.observers = new Map();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.setupIntersectionObserver();
        this.setupAnimationClasses();
    }

    /**
     * Configura el observador de intersección para animaciones de entrada
     */
    setupIntersectionObserver() {
        if (!('IntersectionObserver' in window)) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.triggerEnterAnimation(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // Observar elementos que necesitan animación de entrada
        document.addEventListener('DOMContentLoaded', () => {
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        });

        this.observers.set('intersection', observer);
    }

    /**
     * Agrega clases de animación a elementos específicos
     */
    setupAnimationClasses() {
        document.addEventListener('DOMContentLoaded', () => {
            // Añadir clases para animaciones automáticas
            const elements = {
                '.emotion-input': 'animate-on-scroll slide-in-bottom',
                '.quick-options': 'animate-on-scroll fade-in-scale',
                '.fabula': 'slide-in-left',
                'button': 'interactive-element'
            };

            Object.entries(elements).forEach(([selector, classes]) => {
                document.querySelectorAll(selector).forEach(el => {
                    if (!el.classList.contains('no-animate')) {
                        el.classList.add(...classes.split(' '));
                    }
                });
            });
        });
    }

    /**
     * Activa la animación de entrada para un elemento
     */
    triggerEnterAnimation(element) {
        if (this.isReducedMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        element.classList.add('animate-in');
        
        // Animación escalonada para elementos hijos
        const children = element.querySelectorAll('.stagger-child');
        children.forEach((child, index) => {
            child.style.animationDelay = `${index * 0.1}s`;
            child.classList.add('animate-in');
        });
    }

    /**
     * Animación de escritura para texto
     */
    typewriterAnimation(element, text, speed = 50) {
        if (this.isReducedMotion) {
            element.textContent = text;
            return Promise.resolve();
        }

        return new Promise(resolve => {
            element.textContent = '';
            let i = 0;
            
            const timer = setInterval(() => {
                element.textContent += text.charAt(i);
                i++;
                
                if (i > text.length) {
                    clearInterval(timer);
                    resolve();
                }
            }, speed);
        });
    }

    /**
     * Efecto de pulso suave para elementos
     */
    pulseElement(element, duration = 600) {
        if (this.isReducedMotion) return;

        element.style.animation = `pulse-soft ${duration}ms ease-in-out`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }

    /**
     * Animación de cambio de contenido
     */
    async morphContent(element, newContent) {
        if (this.isReducedMotion) {
            element.innerHTML = newContent;
            return;
        }

        // Fade out
        element.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
        element.style.opacity = '0';
        element.style.transform = 'translateY(-20px) scale(0.95)';

        await new Promise(resolve => setTimeout(resolve, 300));

        // Cambiar contenido
        element.innerHTML = newContent;

        // Fade in
        element.style.opacity = '1';
        element.style.transform = 'translateY(0) scale(1)';

        setTimeout(() => {
            element.style.transition = '';
        }, 300);
    }

    /**
     * Efecto de partículas de celebración
     */
    celebrationEffect(element) {
        if (this.isReducedMotion) return;

        const colors = ['#70a36f', '#f4a261', '#e76f51', '#2a9d8f'];
        const particles = 15;

        for (let i = 0; i < particles; i++) {
            const particle = document.createElement('div');
            particle.className = 'celebration-particle';
            particle.style.cssText = `
                position: absolute;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                animation: celebrate-particle 1.5s ease-out forwards;
            `;

            const rect = element.getBoundingClientRect();
            particle.style.left = `${rect.left + rect.width / 2}px`;
            particle.style.top = `${rect.top + rect.height / 2}px`;

            document.body.appendChild(particle);

            // Remover partícula después de la animación
            setTimeout(() => {
                particle.remove();
            }, 1500);
        }
    }

    /**
     * Animación de carga para botones
     */
    buttonLoadingState(button, isLoading = true) {
        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
            button.dataset.originalText = button.textContent;
            
            if (!this.isReducedMotion) {
                button.innerHTML = `
                    <span class="loading-text">${button.dataset.originalText}</span>
                    <span class="loading-spinner"></span>
                `;
            }
        } else {
            button.classList.remove('loading');
            button.disabled = false;
            button.textContent = button.dataset.originalText || button.textContent.replace(/\s*⟳/, '');
        }
    }

    /**
     * Efecto de ondas al hacer clic
     */
    rippleEffect(element, event) {
        if (this.isReducedMotion) return;

        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        ripple.className = 'ripple-effect';
        
        if (element.style.position !== 'absolute' && element.style.position !== 'relative') {
            element.style.position = 'relative';
        }
        
        element.style.overflow = 'hidden';
        element.appendChild(ripple);

        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    /**
     * Animación de entrada para nuevos elementos
     */
    animateNewElement(element, animationType = 'slideInFromBottom') {
        if (this.isReducedMotion) {
            element.style.opacity = '1';
            return;
        }

        element.classList.add('new-element', animationType);
        
        // Remover clases después de la animación
        setTimeout(() => {
            element.classList.remove('new-element', animationType);
        }, 800);
    }

    /**
     * Shake effect para errores
     */
    shakeElement(element) {
        if (this.isReducedMotion) return;

        element.classList.add('shake-error');
        
        setTimeout(() => {
            element.classList.remove('shake-error');
        }, 500);
    }

    /**
     * Limpia todos los observadores y animaciones
     */
    cleanup() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

// CSS dinámico para las animaciones
const animationStyles = `
@keyframes celebrate-particle {
    0% {
        transform: translateY(0) scale(1);
        opacity: 1;
    }
    100% {
        transform: translateY(-100px) translateX(${Math.random() * 200 - 100}px) scale(0);
        opacity: 0;
    }
}

@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes pulse-soft {
    0%, 100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

@keyframes shake-error {
    0%, 20%, 40%, 60%, 80%, 100% {
        transform: translateX(0);
    }
    10%, 50%, 90% {
        transform: translateX(-10px);
    }
    30%, 70% {
        transform: translateX(10px);
    }
}

.animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.animate-in {
    opacity: 1;
    transform: translateY(0);
}

.slide-in-bottom {
    transform: translateY(50px);
}

.slide-in-left {
    transform: translateX(-50px);
}

.fade-in-scale {
    transform: scale(0.8);
}

.fade-in-scale.animate-in {
    transform: scale(1);
}

.interactive-element {
    transition: transform 0.2s ease-out;
}

.interactive-element:active {
    transform: scale(0.95);
}

.loading-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: currentColor;
    animation: spin 1s ease-in-out infinite;
    margin-left: 8px;
}

.new-element {
    animation-duration: 0.8s;
    animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    animation-fill-mode: both;
}

.slideInFromBottom.new-element {
    animation-name: slideInFromBottom;
}

@media (prefers-reduced-motion: reduce) {
    .animate-on-scroll,
    .new-element,
    .interactive-element {
        animation: none !important;
        transition: none !important;
    }
}
`;

// Inyectar estilos CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = animationStyles;
document.head.appendChild(styleSheet);

// Exportar para uso global
window.AnimationSystem = AnimationSystem;
