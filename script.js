// Menu Mobile Toggle
const menuMobile = document.querySelector('.menu-mobile');
const navMenu = document.querySelector('.nav-menu');
let menuOpen = false;

menuMobile.addEventListener('click', () => {
    menuOpen = !menuOpen;
    if(menuOpen) {
        menuMobile.classList.add('active');
        navMenu.classList.add('active');
    } else {
        menuMobile.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 100;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Fecha o menu mobile se estiver aberto
            if (menuOpen) {
                menuMobile.click();
            }
        }
    });
});

// Animações de Scroll Reveal melhoradas
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
};

const animateElement = (element, delay = 0) => {
    setTimeout(() => {
        element.classList.add('animate');
    }, delay);
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animação para cards de serviços
            if (entry.target.classList.contains('servicos')) {
                const title = entry.target.querySelector('h2');
                const cards = entry.target.querySelectorAll('.servico-card');
                
                animateElement(title);
                cards.forEach((card, index) => {
                    animateElement(card, 200 * (index + 1));
                });
            }
            
            // Animação para seção sobre
            if (entry.target.classList.contains('sobre')) {
                const img = entry.target.querySelector('.sobre-img');
                const content = entry.target.querySelector('.sobre-content');
                
                animateElement(img);
                animateElement(content, 300);
            }

            // Animação geral para elementos com fade-up
            if (entry.target.classList.contains('fade-up')) {
                animateElement(entry.target);
            }

            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar elementos para animação
const elementsToAnimate = [
    ...document.querySelectorAll('.servicos'),
    ...document.querySelectorAll('.sobre'),
    ...document.querySelectorAll('.fade-up'),
    ...document.querySelectorAll('.servico-card')
];

elementsToAnimate.forEach(element => {
    observer.observe(element);
});

// Smooth Scroll melhorado
const smoothScroll = (target, duration = 1000) => {
    const targetPosition = target.getBoundingClientRect().top;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - 80; // 80px offset for header
    let startTime = null;

    const animation = currentTime => {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    };

    // Função de easing
    const ease = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };

    requestAnimationFrame(animation);
};

// Aplicar smooth scroll aos links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            smoothScroll(target);
            if (menuOpen) menuMobile.click();
        }
    });
});

// Adicionar classe aos elementos quando estiverem no viewport
const addClassOnScroll = () => {
    const elements = document.querySelectorAll('.fade-up:not(.animate)');
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.classList.add('animate');
        }
    });
};

// Listener para scroll
window.addEventListener('scroll', () => {
    addClassOnScroll();
    
    // Header scroll effect
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Iniciar animações quando a página carregar
window.addEventListener('load', () => {
    addClassOnScroll();
});

// Form Handling
const formContato = document.querySelector('#form-contato');
const inputs = formContato.querySelectorAll('input, textarea');

// Máscara para telefone
const maskTelefone = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1');
};

// Aplicar máscara ao telefone
const inputTelefone = document.querySelector('#telefone');
if (inputTelefone) {
    inputTelefone.addEventListener('input', (e) => {
        e.target.value = maskTelefone(e.target.value);
    });
}

// Validação de email
const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Mostrar erro
const showError = (input, message) => {
    const formGroup = input.parentElement;
    let errorMessage = formGroup.querySelector('.error-message');
    
    if (!errorMessage) {
        errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        formGroup.appendChild(errorMessage);
    }
    
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    input.classList.add('error');
};

// Remover erro
const removeError = (input) => {
    const formGroup = input.parentElement;
    const errorMessage = formGroup.querySelector('.error-message');
    
    if (errorMessage) {
        errorMessage.classList.remove('show');
    }
    input.classList.remove('error');
};

// Validação do formulário
if (formContato) {
    formContato.addEventListener('submit', async (e) => {
        e.preventDefault();
        let isValid = true;
        
        // Validar cada campo
        inputs.forEach(input => {
            if (!input.value.trim()) {
                isValid = false;
                showError(input, 'Este campo é obrigatório');
            } else {
                removeError(input);
                
                // Validação específica para email
                if (input.type === 'email' && !validateEmail(input.value)) {
                    isValid = false;
                    showError(input, 'Email inválido');
                }
                
                // Validação para telefone
                if (input.id === 'telefone' && input.value.replace(/\D/g, '').length < 10) {
                    isValid = false;
                    showError(input, 'Telefone inválido');
                }
            }
        });

        if (isValid) {
            const submitButton = formContato.querySelector('.btn-submit');
            const originalContent = submitButton.innerHTML;
            
            try {
                // Adicionar estado de loading
                submitButton.classList.add('loading');
                submitButton.innerHTML = '<i class="fas fa-spinner"></i> Enviando...';

                // Simular envio (substitua por sua lógica de envio real)
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Sucesso
                submitButton.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
                submitButton.style.background = '#28a745';
                formContato.reset();

                // Resetar botão após 3 segundos
                setTimeout(() => {
                    submitButton.innerHTML = originalContent;
                    submitButton.style.background = '';
                    submitButton.classList.remove('loading');
                }, 3000);

            } catch (error) {
                // Erro
                submitButton.innerHTML = '<i class="fas fa-times"></i> Erro ao enviar';
                submitButton.style.background = '#dc3545';

                setTimeout(() => {
                    submitButton.innerHTML = originalContent;
                    submitButton.style.background = '';
                    submitButton.classList.remove('loading');
                }, 3000);
            }
        }
    });

    // Remover erros quando o usuário começar a digitar
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            removeError(input);
        });
    });
} 