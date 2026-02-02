/**
 * DevLinkPro - Template Premium para Produtos Digitais
 * Scripts principais
 * Versão: 1.0.0
 * Autor: DevTemplates
 */

// ============================================
// 1. INICIALIZAÇÃO DO DOCUMENTO
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('DevLinkPro - Template Premium carregado');
    
    // Inicializar todos os componentes
    initNavigation();
    initTestimonialsSlider();
    initFAQ();
    initPricingToggle();
    initModal();
    initToast();
    initScrollAnimations();
    initFormValidation();
    initVideoPlayer();
    
    // Configurar event listeners
    setupEventListeners();
    
    // Inicializar animações
    startAnimations();
});

// ============================================
// 2. NAVEGAÇÃO RESPONSIVA
// ============================================
function initNavigation() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const body = document.body;
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            
            // Mudar ícone do botão
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
            
            // Prevenir scroll do body quando menu está aberto
            if (navMenu.classList.contains('active')) {
                body.style.overflow = 'hidden';
            } else {
                body.style.overflow = '';
            }
        });
        
        // Fechar menu ao clicar em um link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
                
                body.style.overflow = '';
            });
        });
    }
    
    // Adicionar sombra à navbar ao rolar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ============================================
// 3. SLIDER DE DEPOIMENTOS
// ============================================
function initTestimonialsSlider() {
    const track = document.getElementById('testimonialsTrack');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const testimonials = document.querySelectorAll('.testimonial-card');
    
    if (!track || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    const totalSlides = testimonials.length;
    let slidesPerView = 1;
    
    // Determinar quantos slides mostrar por vez
    function updateSlidesPerView() {
        if (window.innerWidth >= 1024) {
            slidesPerView = 3;
        } else if (window.innerWidth >= 768) {
            slidesPerView = 2;
        } else {
            slidesPerView = 1;
        }
        
        // Ajustar o tamanho dos slides
        const slideWidth = 100 / slidesPerView;
        testimonials.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
        });
        
        // Ajustar a posição atual se necessário
        if (currentSlide > totalSlides - slidesPerView) {
            currentSlide = Math.max(0, totalSlides - slidesPerView);
            updateSliderPosition();
        }
    }
    
    function updateSliderPosition() {
        const slideWidth = 100 / slidesPerView;
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // Atualizar estado dos botões
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide >= totalSlides - slidesPerView;
        
        // Adicionar/remover classes de desabilitado
        if (prevBtn.disabled) {
            prevBtn.classList.add('disabled');
        } else {
            prevBtn.classList.remove('disabled');
        }
        
        if (nextBtn.disabled) {
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.classList.remove('disabled');
        }
    }
    
    prevBtn.addEventListener('click', function() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSliderPosition();
        }
    });
    
    nextBtn.addEventListener('click', function() {
        if (currentSlide < totalSlides - slidesPerView) {
            currentSlide++;
            updateSliderPosition();
        }
    });
    
    // Atualizar no redimensionamento da janela
    window.addEventListener('resize', updateSlidesPerView);
    
    // Inicializar
    updateSlidesPerView();
    updateSliderPosition();
    
    // Auto-slide (opcional)
    let autoSlideInterval;
    
    function startAutoSlide() {
        autoSlideInterval = setInterval(function() {
            if (currentSlide < totalSlides - slidesPerView) {
                currentSlide++;
            } else {
                currentSlide = 0;
            }
            updateSliderPosition();
        }, 5000); // Mudar slide a cada 5 segundos
    }
    
    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
        }
    }
    
    // Iniciar auto-slide
    startAutoSlide();
    
    // Pausar auto-slide ao interagir
    track.addEventListener('mouseenter', stopAutoSlide);
    track.addEventListener('mouseleave', startAutoSlide);
    prevBtn.addEventListener('mouseenter', stopAutoSlide);
    nextBtn.addEventListener('mouseenter', stopAutoSlide);
}

// ============================================
// 4. SISTEMA DE FAQ (ACORDEÃO)
// ============================================
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            // Fechar outros itens abertos
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    const otherAnswer = otherItem.querySelector('.faq-answer');
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = null;
                    }
                }
            });
            
            // Alternar item atual
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
    
    // Abrir primeiro item por padrão
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        const firstAnswer = faqItems[0].querySelector('.faq-answer');
        if (firstAnswer) {
            firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 'px';
        }
    }
}

// ============================================
// 5. ALTERNÂNCIA DE PREÇOS (MENSAL/ANUAL)
// ============================================
function initPricingToggle() {
    const toggle = document.getElementById('pricingToggle');
    
    if (!toggle) return;
    
    // Atualizar preços quando alternar
    toggle.addEventListener('change', function() {
        const monthlyPrices = document.querySelectorAll('.monthly');
        const annualPrices = document.querySelectorAll('.annually');
        const switcherLabels = document.querySelectorAll('.switcher-label');
        
        // Alternar classes ativas nos labels
        switcherLabels.forEach(label => {
            label.classList.toggle('active');
        });
        
        // Animar a mudança
        monthlyPrices.forEach(price => {
            price.style.opacity = toggle.checked ? '0' : '1';
        });
        
        annualPrices.forEach(price => {
            price.style.opacity = toggle.checked ? '1' : '0';
        });
    });
}

// ============================================
// 6. MODAL DE COMPRA
// ============================================
function initModal() {
    const modal = document.getElementById('purchaseModal');
    const openModalBtns = document.querySelectorAll('[id*="CtaBtn"], [id*="buyNowBtn"]');
    const closeModalBtn = document.getElementById('closeModal');
    const planOptions = document.querySelectorAll('.plan-option');
    
    // Abrir modal
    openModalBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            openModal();
        });
    });
    
    // Fechar modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }
    
    // Fechar modal ao clicar fora
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeModal();
            }
        });
        
        // Fechar com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }
    
    // Seleção de plano no modal
    planOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remover seleção anterior
            planOptions.forEach(opt => {
                opt.classList.remove('active');
            });
            
            // Selecionar atual
            this.classList.add('active');
        });
    });
    
    function openModal() {
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            
            // Rolar para o topo do modal
            setTimeout(() => {
                modal.scrollTop = 0;
            }, 10);
        }
    }
    
    function closeModal() {
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
}

// ============================================
// 7. NOTIFICAÇÕES TOAST
// ============================================
function initToast() {
    const toast = document.getElementById('successToast');
    const closeToastBtn = toast?.querySelector('.toast-close');
    
    if (!toast) return;
    
    // Fechar toast
    if (closeToastBtn) {
        closeToastBtn.addEventListener('click', function() {
            hideToast();
        });
    }
    
    // Auto-fechar após 5 segundos
    let toastTimeout;
    
    function showToast(message) {
        if (toast) {
            const toastMessage = toast.querySelector('.toast-message');
            if (toastMessage && message) {
                toastMessage.textContent = message;
            }
            
            toast.classList.add('show');
            
            // Resetar timeout anterior
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
            
            // Auto-fechar
            toastTimeout = setTimeout(() => {
                hideToast();
            }, 5000);
        }
    }
    
    function hideToast() {
        if (toast) {
            toast.classList.remove('show');
        }
    }
    
    // Expor função globalmente para uso em outros lugares
    window.showToast = showToast;
}

// ============================================
// 8. ANIMAÇÕES DE SCROLL
// ============================================
function initScrollAnimations() {
    // Observador de interseção para animações
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    // Elementos para animar
    const animatableElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card, .benefit-stat');
    
    animatableElements.forEach(el => {
        observer.observe(el);
    });
    
    // Animação suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href === '#') return;
            
            e.preventDefault();
            const targetElement = document.querySelector(href);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80; // Ajustar para a navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ============================================
// 9. VALIDAÇÃO DE FORMULÁRIO
// ============================================
function initFormValidation() {
    const paymentForm = document.getElementById('paymentForm');
    
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (validateForm(this)) {
                // Simular processamento de pagamento
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processando...';
                
                // Simular delay de processamento
                setTimeout(() => {
                    // Fechar modal
                    const modal = document.getElementById('purchaseModal');
                    if (modal) {
                        modal.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                    
                    // Mostrar toast de sucesso
                    if (window.showToast) {
                        window.showToast('Compra realizada com sucesso! Em breve você receberá um e-mail de confirmação.');
                    }
                    
                    // Resetar formulário
                    paymentForm.reset();
                    
                    // Restaurar botão
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                    
                    // Rolar para o topo
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }, 2000);
            }
        });
        
        // Validação em tempo real
        const inputs = paymentForm.querySelectorAll('input[required]');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
    
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('input[required]');
        
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });
        
        // Validação específica para número do cartão
        const cardNumber = form.querySelector('#cardNumber');
        if (cardNumber && cardNumber.value.replace(/\s/g, '').length < 13) {
            showFieldError(cardNumber, 'Número de cartão inválido');
            isValid = false;
        }
        
        // Validação específica para CVV
        const cvv = form.querySelector('#cvv');
        if (cvv && (cvv.value.length < 3 || cvv.value.length > 4)) {
            showFieldError(cvv, 'CVV inválido');
            isValid = false;
        }
        
        return isValid;
    }
    
    function validateField(field) {
        let isValid = true;
        let errorMessage = '';
        
        if (!field.value.trim()) {
            errorMessage = 'Este campo é obrigatório';
            isValid = false;
        } else if (field.type === 'email' && !isValidEmail(field.value)) {
            errorMessage = 'E-mail inválido';
            isValid = false;
        } else if (field.id === 'expiryDate' && !isValidExpiryDate(field.value)) {
            errorMessage = 'Data de validade inválida';
            isValid = false;
        }
        
        if (!isValid) {
            showFieldError(field, errorMessage);
        } else {
            clearFieldError(field);
        }
        
        return isValid;
    }
    
    function showFieldError(field, message) {
        clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.textContent = message;
        errorElement.style.color = '#EF4444';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        
        field.parentNode.appendChild(errorElement);
    }
    
    function clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function isValidExpiryDate(date) {
        const dateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!dateRegex.test(date)) return false;
        
        const [month, year] = date.split('/');
        const now = new Date();
        const currentYear = now.getFullYear() % 100;
        const currentMonth = now.getMonth() + 1;
        
        if (parseInt(year) < currentYear) return false;
        if (parseInt(year) === currentYear && parseInt(month) < currentMonth) return false;
        
        return true;
    }
}

// ============================================
// 10. PLAYER DE VÍDEO
// ============================================
function initVideoPlayer() {
    const videoPlaceholders = document.querySelectorAll('.video-thumbnail');
    
    videoPlaceholders.forEach(placeholder => {
        placeholder.addEventListener('click', function() {
            // Substituir placeholder por iframe do YouTube/Vimeo
            const videoContainer = this.closest('.video-placeholder');
            
            if (videoContainer) {
                // Criar iframe
                const iframe = document.createElement('iframe');
                iframe.src = 'https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1'; // URL de exemplo
                iframe.title = 'Demo do DevLinkPro';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.border = 'none';
                
                // Substituir conteúdo
                videoContainer.innerHTML = '';
                videoContainer.style.height = '400px';
                videoContainer.appendChild(iframe);
            }
        });
    });
}

// ============================================
// 11. CONFIGURAÇÃO DE EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Botão de demonstração
    const demoBtns = document.querySelectorAll('[id*="demoBtn"], [id*="DemoBtn"]');
    demoBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Rolar para a seção de demonstração
            const demoSection = document.querySelector('.demo-section');
            if (demoSection) {
                const offsetTop = demoSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Simular clique no player de vídeo após um delay
                setTimeout(() => {
                    const videoThumbnail = document.querySelector('.video-thumbnail');
                    if (videoThumbnail) {
                        videoThumbnail.click();
                    }
                }, 800);
            }
        });
    });
    
    // Botão de assistir demonstração
    const watchDemoBtn = document.getElementById('watchDemoBtn');
    if (watchDemoBtn) {
        watchDemoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const videoThumbnail = document.querySelector('.video-thumbnail');
            if (videoThumbnail) {
                videoThumbnail.click();
            }
        });
    }
    
    // Botões de plano de preços
    const pricingBtns = document.querySelectorAll('.btn-pricing');
    pricingBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Abrir modal de compra
            const modal = document.getElementById('purchaseModal');
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
                
                // Selecionar plano correspondente
                const pricingCard = this.closest('.pricing-card');
                if (pricingCard) {
                    const planType = pricingCard.classList.contains('featured') ? 'professional' : 
                                   pricingCard.querySelector('.pricing-title').textContent.toLowerCase();
                    
                    const planOptions = document.querySelectorAll('.plan-option');
                    planOptions.forEach(option => {
                        option.classList.remove('active');
                        if (option.dataset.plan === planType) {
                            option.classList.add('active');
                        }
                    });
                }
            }
        });
    });
}

// ============================================
// 12. ANIMAÇÕES INICIAIS
// ============================================
function startAnimations() {
    // Animar elementos da hero section
    const heroElements = document.querySelectorAll('.hero-text > *');
    heroElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100 + 300);
    });
    
    // Animar showcase
    const showcase = document.querySelector('.showcase-container');
    if (showcase) {
        showcase.style.opacity = '0';
        showcase.style.transform = 'translateY(40px) scale(0.95)';
        
        setTimeout(() => {
            showcase.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            showcase.style.opacity = '1';
            showcase.style.transform = 'translateY(0) scale(1)';
        }, 800);
    }
}

// ============================================
// 13. CONTADOR DE ESTATÍSTICAS
// ============================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-number, .stat-value');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent);
        const suffix = counter.textContent.replace(/[0-9]/g, '');
        const duration = 2000; // 2 segundos
        const step = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            
            if (current < target) {
                counter.textContent = Math.floor(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        // Iniciar quando o elemento estiver visível
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Inicializar contadores após um delay
setTimeout(initCounters, 1000);

// ============================================
// 14. DETECÇÃO DE DISPOSITIVOS E RECURSOS
// ============================================
function checkDeviceFeatures() {
    // Verificar se é um dispositivo touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    } else {
        document.body.classList.add('no-touch-device');
    }
    
    // Verificar preferência por reduzir movimento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (prefersReducedMotion) {
        document.body.classList.add('reduce-motion');
    }
}

// Executar verificação
checkDeviceFeatures();

// ============================================
// 15. TRACKING DE EVENTOS (ANÁLISE)
// ============================================
function setupAnalytics() {
    // Track clicks em CTAs
    const ctaButtons = document.querySelectorAll('[class*="cta"], .btn-primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            const buttonText = this.textContent.trim();
            const buttonId = this.id || 'no-id';
            
            console.log(`CTA clicked: ${buttonText} (ID: ${buttonId})`);
            
            // Aqui você integraria com Google Analytics, Facebook Pixel, etc.
            // Exemplo: gtag('event', 'click', { 'event_category': 'CTA', 'event_label': buttonText });
        });
    });
    
    // Track scroll para seções
    const sections = document.querySelectorAll('section[id]');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.id;
                console.log(`Section viewed: ${sectionId}`);
                
                // Aqui você integraria com analytics
                // Exemplo: gtag('event', 'view', { 'event_category': 'Section', 'event_label': sectionId });
            }
        });
    }, { threshold: 0.5 });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

// Inicializar analytics
setTimeout(setupAnalytics, 2000);

// ============================================
// 16. OTIMIZAÇÃO DE PERFORMANCE
// ============================================
function optimizePerformance() {
    // Lazy loading para imagens
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Defer carregamento de fontes não críticas
    const loadFonts = () => {
        // Carregar fontes adicionais se necessário
    };
    
    // Carregar fontes após a página inicial
    if (document.readyState === 'complete') {
        loadFonts();
    } else {
        window.addEventListener('load', loadFonts);
    }
}

// Executar otimizações
optimizePerformance();

// ============================================
// 17. TRATAMENTO DE ERROS
// ============================================
window.addEventListener('error', function(e) {
    console.error('Erro capturado:', e.error);
    
    // Aqui você poderia enviar o erro para um serviço de logging
    // Exemplo: Sentry.captureException(e.error);
    
    return false;
});

// ============================================
// 18. EXPORTAR FUNÇÕES PARA USO GLOBAL
// ============================================
// Expor funções úteis para uso externo se necessário
window.DevLinkPro = {
    openPurchaseModal: function() {
        const modal = document.getElementById('purchaseModal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },
    
    closePurchaseModal: function() {
        const modal = document.getElementById('purchaseModal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },
    
    showNotification: function(message) {
        if (window.showToast) {
            window.showToast(message);
        }
    }
};

// ============================================
// 19. POLYFILLS PARA NAVEGADORES ANTIGOS
// ============================================
// Polyfill para forEach em NodeLists (IE)
if (window.NodeList && !NodeList.prototype.forEach) {
    NodeList.prototype.forEach = function(callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

// Polyfill para closest (IE)
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Polyfill para matches (IE)
if (!Element.prototype.matches) {
    Element.prototype.matches = 
        Element.prototype.matchesSelector || 
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector || 
        Element.prototype.oMatchesSelector || 
        Element.prototype.webkitMatchesSelector ||
        function(s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {}
            return i > -1;
        };
}

// ============================================
// 20. FINALIZAÇÃO
// ============================================
console.log('DevLinkPro - Scripts inicializados com sucesso');

// Sinalizar que a inicialização está completa
document.dispatchEvent(new Event('DevLinkProReady'));