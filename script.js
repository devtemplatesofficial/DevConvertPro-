/**
 * DevLinkPro - Template Premium para Páginas de Links
 * Script principal com funcionalidades avançadas
 * Desenvolvido por DevTemplates
 */

document.addEventListener('DOMContentLoaded', function() {
    // Configurações iniciais
    const config = {
        enableAnimations: true,
        enableSmoothScroll: true,
        enableThemeToggle: true,
        enableFiltering: true,
        enableFormValidation: true,
        enableAnalytics: false, // Alterar para true se quiser rastreamento
        contactFormEndpoint: 'https://api.devlinkpro.com/contact', // Endpoint personalizado
        newsletterEndpoint: 'https://api.devlinkpro.com/newsletter' // Endpoint personalizado
    };

    // Estado da aplicação
    const state = {
        currentTheme: localStorage.getItem('theme') || 'light',
        activeFilter: 'all',
        formSubmitting: false,
        modalOpen: false,
        scrollPosition: 0,
        visitedSections: new Set()
    };

    // Inicialização
    init();

    /**
     * Inicializa todas as funcionalidades
     */
    function init() {
        console.log('🚀 DevLinkPro inicializado com sucesso!');
        
        // Aplicar tema salvo
        applyTheme();
        
        // Inicializar componentes
        initNavigation();
        initThemeToggle();
        initLinkFiltering();
        initForms();
        initBackToTop();
        initScrollAnimations();
        initModals();
        initAnalytics();
        initPerformanceMonitoring();
        
        // Adicionar eventos globais
        addGlobalEvents();
    }

    /**
     * Aplica o tema (claro/escuro) salvo no localStorage
     */
    function applyTheme() {
        if (state.currentTheme === 'dark') {
            document.body.classList.add('dark-mode');
            updateThemeToggleIcon(true);
        } else {
            document.body.classList.remove('dark-mode');
            updateThemeToggleIcon(false);
        }
        
        // Salvar no localStorage
        localStorage.setItem('theme', state.currentTheme);
        
        // Disparar evento personalizado
        document.dispatchEvent(new CustomEvent('themeChange', {
            detail: { theme: state.currentTheme }
        }));
    }

    /**
     * Atualiza o ícone do botão de alternância de tema
     */
    function updateThemeToggleIcon(isDarkMode) {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
                themeToggle.setAttribute('aria-label', 
                    isDarkMode ? 'Alternar para tema claro' : 'Alternar para tema escuro');
            }
        }
    }

    /**
     * Inicializa a navegação (menu mobile, scroll spy, etc.)
     */
    function initNavigation() {
        const menuToggle = document.getElementById('menuToggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('.header');

        // Menu mobile toggle
        if (menuToggle && navMenu) {
            menuToggle.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                menuToggle.setAttribute('aria-expanded', 
                    navMenu.classList.contains('active'));
                
                // Atualizar ícone
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = navMenu.classList.contains('active') 
                        ? 'fas fa-times' 
                        : 'fas fa-bars';
                }
            });

            // Fechar menu ao clicar em um link
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    if (menuToggle) {
                        menuToggle.setAttribute('aria-expanded', 'false');
                        const icon = menuToggle.querySelector('i');
                        if (icon) icon.className = 'fas fa-bars';
                    }
                });
            });
        }

        // Header scroll effect
        if (header) {
            let lastScrollTop = 0;
            
            window.addEventListener('scroll', function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                // Adicionar/remover classe quando scrollar
                if (scrollTop > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
                
                // Esconder/mostrar header baseado na direção do scroll
                if (scrollTop > lastScrollTop && scrollTop > 200) {
                    header.style.transform = 'translateY(-100%)';
                } else {
                    header.style.transform = 'translateY(0)';
                }
                
                lastScrollTop = scrollTop;
            });
        }

        // Scroll spy para navegação
        if (config.enableSmoothScroll && navLinks.length > 0) {
            window.addEventListener('scroll', debounce(function() {
                const scrollPosition = window.scrollY + 100;
                
                // Encontrar seção atual
                let currentSection = '';
                
                document.querySelectorAll('section[id]').forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                        currentSection = section.getAttribute('id');
                    }
                });
                
                // Atualizar link ativo
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    const href = link.getAttribute('href');
                    
                    if (href === `#${currentSection}` || 
                        (currentSection === 'home' && href === '#') ||
                        (currentSection === '' && href === '#')) {
                        link.classList.add('active');
                    }
                });
            }, 100));
        }

        // Smooth scroll para links internos
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                if (href === '#') return;
                
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    e.preventDefault();
                    
                    // Fechar menu mobile se aberto
                    if (navMenu && navMenu.classList.contains('active')) {
                        navMenu.classList.remove('active');
                        if (menuToggle) {
                            menuToggle.setAttribute('aria-expanded', 'false');
                            const icon = menuToggle.querySelector('i');
                            if (icon) icon.className = 'fas fa-bars';
                        }
                    }
                    
                    // Scroll suave
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                    
                    // Atualizar URL sem recarregar a página
                    history.pushState(null, null, href);
                }
            });
        });
    }

    /**
     * Inicializa o alternador de tema
     */
    function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        
        if (themeToggle && config.enableThemeToggle) {
            themeToggle.addEventListener('click', function() {
                // Alternar tema
                state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
                applyTheme();
                
                // Feedback tátil
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 150);
                
                // Registrar evento
                trackEvent('theme_toggle', { theme: state.currentTheme });
            });
        }
    }

    /**
     * Inicializa a filtragem de links
     */
    function initLinkFiltering() {
        if (!config.enableFiltering) return;
        
        const filterButtons = document.querySelectorAll('.btn-filter');
        const linkCards = document.querySelectorAll('.link-card');
        
        if (filterButtons.length === 0 || linkCards.length === 0) return;
        
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                const filter = this.getAttribute('data-filter');
                
                // Atualizar botões ativos
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Atualizar estado
                state.activeFilter = filter;
                
                // Filtrar cards
                linkCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'translateY(0)';
                        }, 10);
                    } else {
                        card.style.opacity = '0';
                        card.style.transform = 'translateY(10px)';
                        setTimeout(() => {
                            card.style.display = 'none';
                        }, 300);
                    }
                });
                
                // Feedback de áudio (opcional)
                playSound('click');
                
                // Registrar evento
                trackEvent('link_filter', { filter: filter });
            });
        });
    }

    /**
     * Inicializa os formulários (contato e newsletter)
     */
    function initForms() {
        const contactForm = document.getElementById('contactForm');
        const newsletterForm = document.getElementById('newsletterForm');
        
        // Formulário de contato
        if (contactForm && config.enableFormValidation) {
            contactForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                if (state.formSubmitting) return;
                
                // Validar formulário
                if (!validateForm(this)) return;
                
                // Mostrar estado de loading
                const submitButton = this.querySelector('button[type="submit"]');
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                submitButton.disabled = true;
                state.formSubmitting = true;
                
                try {
                    // Coletar dados do formulário
                    const formData = new FormData(this);
                    const data = Object.fromEntries(formData);
                    
                    // Aqui você faria a requisição para o backend
                    // Exemplo com fetch:
                    // const response = await fetch(config.contactFormEndpoint, {
                    //     method: 'POST',
                    //     headers: { 'Content-Type': 'application/json' },
                    //     body: JSON.stringify(data)
                    // });
                    
                    // Simular delay de rede
                    await new Promise(resolve => setTimeout(resolve, 1500));
                    
                    // Simular sucesso
                    showModal('Sucesso!', 'Sua mensagem foi enviada com sucesso. Entrarei em contato em breve.');
                    
                    // Limpar formulário
                    this.reset();
                    
                    // Registrar evento
                    trackEvent('contact_form_submit', { 
                        success: true,
                        subject: data.subject
                    });
                } catch (error) {
                    console.error('Erro ao enviar formulário:', error);
                    showModal('Erro', 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.');
                    
                    trackEvent('contact_form_submit', { 
                        success: false,
                        error: error.message
                    });
                } finally {
                    // Restaurar botão
                    submitButton.innerHTML = originalText;
                    submitButton.disabled = false;
                    state.formSubmitting = false;
                }
            });
        }
        
        // Formulário de newsletter
        if (newsletterForm && config.enableFormValidation) {
            newsletterForm.addEventListener('submit', async function(e) {
                e.preventDefault();
                
                const emailInput = this.querySelector('input[type="email"]');
                const submitButton = this.querySelector('button[type="submit"]');
                
                if (!emailInput.value || !isValidEmail(emailInput.value)) {
                    showError(emailInput, 'Por favor, insira um e-mail válido.');
                    return;
                }
                
                // Mostrar loading
                const originalHTML = submitButton.innerHTML;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                submitButton.disabled = true;
                
                try {
                    // Simular envio
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    // Sucesso
                    showToast('Inscrição realizada com sucesso!', 'success');
                    emailInput.value = '';
                    
                    trackEvent('newsletter_subscribe', { 
                        success: true,
                        email: emailInput.value
                    });
                } catch (error) {
                    showToast('Erro ao se inscrever. Tente novamente.', 'error');
                    
                    trackEvent('newsletter_subscribe', { 
                        success: false,
                        error: error.message
                    });
                } finally {
                    submitButton.innerHTML = originalHTML;
                    submitButton.disabled = false;
                }
            });
        }
    }

    /**
     * Inicializa o botão "Voltar ao topo"
     */
    function initBackToTop() {
        const backToTopButton = document.getElementById('backToTop');
        
        if (backToTopButton) {
            window.addEventListener('scroll', debounce(function() {
                if (window.pageYOffset > 300) {
                    backToTopButton.classList.add('visible');
                } else {
                    backToTopButton.classList.remove('visible');
                }
            }, 100));
            
            backToTopButton.addEventListener('click', function() {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                
                trackEvent('back_to_top');
            });
        }
    }

    /**
     * Inicializa animações de scroll
     */
    function initScrollAnimations() {
        if (!config.enableAnimations) return;
        
        const animatedElements = document.querySelectorAll(
            '.fade-in-up, .hero-content, .link-card, .project-card, .skill-progress'
        );
        
        // Observador de interseção para animações
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    
                    // Animar elementos com classe fade-in-up
                    if (element.classList.contains('fade-in-up')) {
                        element.style.animationPlayState = 'running';
                    }
                    
                    // Animar barras de habilidades
                    if (element.classList.contains('skill-progress')) {
                        const width = element.style.width;
                        element.style.width = '0';
                        setTimeout(() => {
                            element.style.width = width;
                        }, 100);
                    }
                    
                    // Registrar seção visitada
                    const section = element.closest('section[id]');
                    if (section && !state.visitedSections.has(section.id)) {
                        state.visitedSections.add(section.id);
                        trackEvent('section_view', { section: section.id });
                    }
                    
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }

    /**
     * Inicializa modais
     */
    function initModals() {
        // Criar modal container se não existir
        if (!document.querySelector('.modal')) {
            const modalHTML = `
                <div class="modal" id="globalModal">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 class="modal-title"></h3>
                            <button class="modal-close" aria-label="Fechar modal">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="modal-body"></div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }
        
        const modal = document.getElementById('globalModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        const modalClose = modal.querySelector('.modal-close');
        
        // Fechar modal com ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && state.modalOpen) {
                closeModal();
            }
        });
        
        // Fechar modal ao clicar fora
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });
        
        // Fechar com botão
        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }
    }

    /**
     * Inicializa analytics (se habilitado)
     */
    function initAnalytics() {
        if (!config.enableAnalytics) return;
        
        // Rastrear visualização de página
        trackEvent('page_view', {
            page_title: document.title,
            page_url: window.location.href,
            referrer: document.referrer
        });
        
        // Rastrear cliques em links externos
        document.querySelectorAll('a[href^="http"]').forEach(link => {
            if (!link.href.includes(window.location.hostname)) {
                link.addEventListener('click', function() {
                    trackEvent('external_link_click', {
                        url: this.href,
                        text: this.textContent
                    });
                });
            }
        });
    }

    /**
     * Inicializa monitoramento de performance
     */
    function initPerformanceMonitoring() {
        // Medir tempo de carregamento
        window.addEventListener('load', function() {
            const loadTime = window.performance.timing.domContentLoadedEventEnd - 
                           window.performance.timing.navigationStart;
            
            console.log(`⏱️  Página carregada em ${loadTime}ms`);
            
            trackEvent('performance', {
                load_time: loadTime,
                connection_type: navigator.connection ? navigator.connection.effectiveType : 'unknown'
            });
        });
    }

    /**
     * Adiciona eventos globais
     */
    function addGlobalEvents() {
        // Prevenir comportamentos indesejados
        document.addEventListener('contextmenu', function(e) {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        });
        
        // Feedback tátil para botões
        document.addEventListener('mousedown', function(e) {
            if (e.target.matches('.btn, .link-card, .social-link')) {
                e.target.style.transform = 'scale(0.98)';
            }
        });
        
        document.addEventListener('mouseup', function(e) {
            if (e.target.matches('.btn, .link-card, .social-link')) {
                e.target.style.transform = 'scale(1)';
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', function(e) {
            // Navegação por tabs em cards de links
            if (e.key === 'Tab' && document.activeElement.classList.contains('link-card')) {
                const cards = Array.from(document.querySelectorAll('.link-card'));
                const currentIndex = cards.indexOf(document.activeElement);
                
                if (e.shiftKey && currentIndex > 0) {
                    e.preventDefault();
                    cards[currentIndex - 1].focus();
                } else if (!e.shiftKey && currentIndex < cards.length - 1) {
                    e.preventDefault();
                    cards[currentIndex + 1].focus();
                }
            }
        });
    }

    /**
     * Funções auxiliares
     */
    
    // Validar formulário
    function validateForm(form) {
        let isValid = true;
        const inputs = form.querySelectorAll('input[required], textarea[required]');
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                showError(input, 'Este campo é obrigatório.');
                isValid = false;
            } else {
                clearError(input);
                
                // Validação específica para email
                if (input.type === 'email' && !isValidEmail(input.value)) {
                    showError(input, 'Por favor, insira um e-mail válido.');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }
    
    // Mostrar erro no campo
    function showError(input, message) {
        clearError(input);
        
        input.classList.add('error');
        input.setAttribute('aria-invalid', 'true');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #EF4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        input.parentNode.appendChild(errorElement);
        
        // Focar no campo com erro
        input.focus();
    }
    
    // Limpar erro do campo
    function clearError(input) {
        input.classList.remove('error');
        input.removeAttribute('aria-invalid');
        
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Validar email
    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
    
    // Debounce para eventos de scroll/resize
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Throttle para eventos frequentes
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
    
    // Mostrar modal
    function showModal(title, content) {
        const modal = document.getElementById('globalModal');
        const modalTitle = modal.querySelector('.modal-title');
        const modalBody = modal.querySelector('.modal-body');
        
        modalTitle.textContent = title;
        modalBody.innerHTML = `<p>${content}</p>`;
        
        modal.classList.add('active');
        state.modalOpen = true;
        
        // Focar no botão de fechar para acessibilidade
        setTimeout(() => {
            modal.querySelector('.modal-close').focus();
        }, 100);
        
        // Prevenir scroll no body
        document.body.style.overflow = 'hidden';
    }
    
    // Fechar modal
    function closeModal() {
        const modal = document.getElementById('globalModal');
        modal.classList.remove('active');
        state.modalOpen = false;
        document.body.style.overflow = '';
    }
    
    // Mostrar toast (notificação)
    function showToast(message, type = 'info') {
        // Remover toast existente
        const existingToast = document.querySelector('.toast');
        if (existingToast) existingToast.remove();
        
        // Criar toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            animation: toastIn 0.3s ease;
        `;
        
        // Adicionar ao body
        document.body.appendChild(toast);
        
        // Remover após 3 segundos
        setTimeout(() => {
            toast.style.animation = 'toastOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        // Adicionar keyframes para animação
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes toastIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes toastOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Reproduzir som (opcional)
    function playSound(type) {
        if (typeof Audio === 'undefined') return;
        
        // Criar contexto de áudio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Gerar som baseado no tipo
        let frequency = 440;
        let duration = 0.1;
        
        switch(type) {
            case 'click':
                frequency = 523.25; // C5
                break;
            case 'success':
                frequency = 659.25; // E5
                break;
            case 'error':
                frequency = 392.00; // G4
                break;
        }
        
        // Criar oscilador
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration);
    }
    
    // Rastrear eventos (para analytics)
    function trackEvent(eventName, properties = {}) {
        if (!config.enableAnalytics) return;
        
        const eventData = {
            event: eventName,
            properties: {
                ...properties,
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                theme: state.currentTheme
            }
        };
        
        // Aqui você enviaria para seu serviço de analytics
        // Exemplo: Google Analytics, Mixpanel, etc.
        console.log('📊 Evento:', eventData);
        
        // Exemplo com Google Analytics (se configurado)
        if (typeof gtag !== 'undefined') {
            gtag('event', eventName, properties);
        }
    }
    
    // Detectar preferência de redução de movimento
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    
    // Carregar lazy loading para imagens
    function initLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            document.querySelectorAll('img.lazy').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }
    
    // Copiar texto para área de transferência
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copiado para a área de transferência!', 'success');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            showToast('Erro ao copiar.', 'error');
        });
    }
    
    // Gerar QR Code para a página atual
    function generateQRCode(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const url = window.location.href;
        const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(url)}`;
        
        element.innerHTML = `<img src="${qrCodeURL}" alt="QR Code da página" style="border-radius: 8px;">`;
    }
    
    // Detectar dispositivo e orientação
    function getDeviceInfo() {
        return {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            isTablet: /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent),
            isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
            orientation: window.matchMedia("(orientation: portrait)").matches ? "portrait" : "landscape"
        };
    }
    
    // Exibir hora atual com formatação
    function displayCurrentTime(elementId) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        function updateTime() {
            const now = new Date();
            const timeString = now.toLocaleTimeString('pt-BR', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
            element.textContent = timeString;
        }
        
        updateTime();
        setInterval(updateTime, 1000);
    }
    
    // Sistema de notificações (requer permissão)
    function requestNotificationPermission() {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    console.log("Permissão para notificações concedida");
                }
            });
        }
    }
    
    // Enviar notificação
    function sendNotification(title, options = {}) {
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification(title, options);
        }
    }
    
    // Verificar conexão com a internet
    function checkConnection() {
        if (!navigator.onLine) {
            showToast('Você está offline. Algumas funcionalidades podem não estar disponíveis.', 'error');
        }
        
        window.addEventListener('online', () => {
            showToast('Conectado à internet.', 'success');
        });
        
        window.addEventListener('offline', () => {
            showToast('Conexão perdida.', 'error');
        });
    }
    
    // Exportar dados da página (para fins de backup)
    function exportPageData() {
        const data = {
            title: document.title,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            theme: state.currentTheme,
            visitedSections: Array.from(state.visitedSections)
        };
        
        const dataStr = JSON.stringify(data, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `devlinkpro-backup-${new Date().toISOString().slice(0,10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }
    
    // Funções expostas globalmente (opcional)
    window.DevLinkPro = {
        changeTheme: function(theme) {
            if (theme === 'light' || theme === 'dark') {
                state.currentTheme = theme;
                applyTheme();
            }
        },
        getCurrentTheme: function() {
            return state.currentTheme;
        },
        filterLinks: function(filter) {
            state.activeFilter = filter;
            const button = document.querySelector(`.btn-filter[data-filter="${filter}"]`);
            if (button) button.click();
        },
        showContactForm: function() {
            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        },
        exportData: exportPageData,
        copyToClipboard: copyToClipboard,
        generateQRCode: generateQRCode,
        getDeviceInfo: getDeviceInfo
    };
    
    // Inicializar funcionalidades adicionais
    initLazyLoading();
    checkConnection();
    requestNotificationPermission();
    
    // Exibir aviso de cookies (exemplo)
    function checkCookies() {
        if (!localStorage.getItem('cookies_accepted')) {
            setTimeout(() => {
                showModal('Cookies e Privacidade', 
                    'Utilizamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa política de privacidade.');
                
                const modalBody = document.querySelector('.modal-body');
                const acceptButton = document.createElement('button');
                acceptButton.textContent = 'Aceitar';
                acceptButton.className = 'btn btn-primary';
                acceptButton.style.marginTop = '1rem';
                acceptButton.addEventListener('click', () => {
                    localStorage.setItem('cookies_accepted', 'true');
                    closeModal();
                });
                
                modalBody.appendChild(acceptButton);
            }, 2000);
        }
    }
    
    checkCookies();
    
    console.log('✅ DevLinkPro totalmente carregado e funcionando!');
});