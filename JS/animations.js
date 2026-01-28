/**
 * Плавные анимации для сайта психолога
 * Подключение: <script src="animations.js"></script> перед </body>
 */

(function() {
  'use strict';

  // ==================== КОНФИГУРАЦИЯ ====================
  const CONFIG = {
    accordionDuration: 300,      // Длительность анимации аккордеона (мс)
    scrollDuration: 800,         // Длительность плавной прокрутки (мс)
    fadeInDelay: 100,            // Задержка между появлением элементов (мс)
    fadeInDuration: 600,         // Длительность fade-in анимации (мс)
    observerThreshold: 0.1       // Порог видимости для анимации появления
  };

  // ==================== УТИЛИТЫ ====================
  
  // Функция плавности (easeOutCubic)
  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // Функция плавности (easeInOutCubic)
  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  // ==================== АККОРДЕОН ====================
  
  function initAccordion() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      
      if (!trigger || !content) return;
      
      // Подготовка стилей для анимации
      content.style.overflow = 'hidden';
      content.style.transition = `height ${CONFIG.accordionDuration}ms ease, opacity ${CONFIG.accordionDuration}ms ease`;
      
      // Если изначально открыт — установить правильную высоту
      if (item.classList.contains('open')) {
        content.style.height = 'auto';
        content.style.opacity = '1';
      } else {
        content.style.height = '0';
        content.style.opacity = '0';
        content.style.display = 'block';
      }
      
      trigger.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');
        
        if (isOpen) {
          // Закрытие
          const height = content.scrollHeight;
          content.style.height = height + 'px';
          
          // Принудительный reflow
          content.offsetHeight;
          
          content.style.height = '0';
          content.style.opacity = '0';
          
          setTimeout(() => {
            item.classList.remove('open');
          }, CONFIG.accordionDuration);
        } else {
          // Открытие
          item.classList.add('open');
          const height = content.scrollHeight;
          
          content.style.height = height + 'px';
          content.style.opacity = '1';
          
          setTimeout(() => {
            content.style.height = 'auto';
          }, CONFIG.accordionDuration);
        }
      });
    });
  }

  // ==================== СВОРАЧИВАЕМЫЙ БЛОК ПОДДЕРЖКИ ====================
  
  function initSupportToggle() {
    const toggle = document.querySelector('.support-toggle');
    const trigger = toggle?.querySelector('.support-trigger');
    const content = toggle?.querySelector('.support-content');
    
    if (!trigger || !content) return;
    
    content.style.overflow = 'hidden';
    content.style.transition = `height ${CONFIG.accordionDuration}ms ease, opacity ${CONFIG.accordionDuration}ms ease`;
    content.style.height = '0';
    content.style.opacity = '0';
    content.style.display = 'block';
    
    trigger.addEventListener('click', () => {
      const isOpen = toggle.classList.contains('open');
      
      if (isOpen) {
        const height = content.scrollHeight;
        content.style.height = height + 'px';
        content.offsetHeight;
        content.style.height = '0';
        content.style.opacity = '0';
        
        setTimeout(() => {
          toggle.classList.remove('open');
        }, CONFIG.accordionDuration);
      } else {
        toggle.classList.add('open');
        const height = content.scrollHeight;
        content.style.height = height + 'px';
        content.style.opacity = '1';
        
        setTimeout(() => {
          content.style.height = 'auto';
        }, CONFIG.accordionDuration);
      }
    });
  }

  // ==================== ПЛАВНАЯ ПРОКРУТКА ====================
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (!target) return;
        
        const startPosition = window.pageYOffset;
        const targetPosition = target.getBoundingClientRect().top + startPosition - 80; // 80px offset для header
        const distance = targetPosition - startPosition;
        let startTime = null;
        
        function animation(currentTime) {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / CONFIG.scrollDuration, 1);
          const ease = easeInOutCubic(progress);
          
          window.scrollTo(0, startPosition + distance * ease);
          
          if (timeElapsed < CONFIG.scrollDuration) {
            requestAnimationFrame(animation);
          }
        }
        
        requestAnimationFrame(animation);
      });
    });
  }

  // ==================== FADE-IN АНИМАЦИЯ ПРИ ПРОКРУТКЕ ====================
  
  function initFadeInOnScroll() {
    // Добавляем стили для анимации
    const style = document.createElement('style');
    style.textContent = `
      .fade-in-element {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity ${CONFIG.fadeInDuration}ms ease, transform ${CONFIG.fadeInDuration}ms ease;
      }
      .fade-in-element.visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);
    
    // Элементы для анимации
    const selectors = [
      '.card',
      '.package',
      '.quote-block',
      '.accordion-item',
      '.contact-card',
      'section h2',
      'section .section-subtitle'
    ];
    
    const elements = document.querySelectorAll(selectors.join(', '));
    
    elements.forEach((el, index) => {
      el.classList.add('fade-in-element');
      el.style.transitionDelay = `${(index % 4) * CONFIG.fadeInDelay}ms`;
    });
    
    // Intersection Observer для появления элементов
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: CONFIG.observerThreshold,
      rootMargin: '0px 0px -50px 0px'
    });
    
    elements.forEach(el => observer.observe(el));
  }

  // ==================== АНИМАЦИЯ HEADER ПРИ ПРОКРУТКЕ ====================
  
  function initHeaderAnimation() {
    const header = document.querySelector('header');
    if (!header) return;
    
    let lastScroll = 0;
    
    header.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      
      // Добавляем тень при прокрутке
      if (currentScroll > 10) {
        header.style.boxShadow = '0 4px 20px -4px rgba(0,0,0,0.1)';
      } else {
        header.style.boxShadow = 'none';
      }
      
      // Скрытие/показ header при прокрутке (опционально)
      // if (currentScroll > lastScroll && currentScroll > 100) {
      //   header.style.transform = 'translateY(-100%)';
      // } else {
      //   header.style.transform = 'translateY(0)';
      // }
      
      lastScroll = currentScroll;
    });
  }

  // ==================== HOVER ЭФФЕКТЫ ДЛЯ КНОПОК ====================
  
  function initButtonEffects() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(btn => {
      btn.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease';
      
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateY(-2px)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateY(0)';
      });
      
      // Эффект нажатия
      btn.addEventListener('mousedown', () => {
        btn.style.transform = 'translateY(0) scale(0.98)';
      });
      
      btn.addEventListener('mouseup', () => {
        btn.style.transform = 'translateY(-2px)';
      });
    });
  }

  // ==================== ПАРАЛЛАКС ДЛЯ ДЕКОРАТИВНЫХ ЭЛЕМЕНТОВ ====================
  
  function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero-bg-1, .hero-bg-2, .bg-circle-1, .bg-circle-2');
    
    if (parallaxElements.length === 0) return;
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach((el, index) => {
        const speed = 0.3 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
  }

  // ==================== ИНИЦИАЛИЗАЦИЯ ====================
  
  function init() {
    // Ждём загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initAll);
    } else {
      initAll();
    }
  }
  
  function initAll() {
    initAccordion();
    initSupportToggle();
    initSmoothScroll();
    initFadeInOnScroll();
    initHeaderAnimation();
    initButtonEffects();
    initParallax();
    
    console.log('✨ Animations initialized');
  }
  
  // Запуск
  init();
  
})();
