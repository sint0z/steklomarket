// Кэширование основных элементов DOM
const sidebar = document.querySelector('#sidebar');
const menuButton = document.querySelector('.btn--mobile');
const overlay = document.querySelector('.overlay');
const mapButton = document.querySelector('.btn-map');

// Проверка наличия основных элементов
if (!sidebar || !menuButton || !overlay || !mapButton) {
    console.warn('Некоторые основные элементы DOM не найдены');
}

const iconButton = menuButton ? menuButton.querySelector("i") : null;

class Modal {
    constructor(modal) {
        this.modal = modal;
        this.closeButton = this.modal.querySelector('#modal-close');

        if (this.closeButton) {
            this.closeButton.addEventListener('click', this.hide.bind(this));
        }

        this.modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide();
            }
        });

        this.keydownHandler = (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.hide();
            }
        };

        window.addEventListener('keydown', this.keydownHandler);
    }

    hide() {
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    show() {
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    destroy() {
        window.removeEventListener('keydown', this.keydownHandler);
    }
}

class ProgressBar {
    static instance = null;

    preloader = null;
    progressBar = null;
    loadingText = null;

    constructor() {
        this.progress = 0;
        this.intervalId = null;

        if (ProgressBar.instance) {
            return ProgressBar.instance;
        }

        this.preloader = document.createElement('div');
        this.preloader.id = 'preloader';

        this.preloader.innerHTML = `<div>Подождите, контент загружается...</div>
                                        <div class="progress-bar-container">
                                            <div class="progress-bar" id="progress-bar"></div>
                                        </div>
                                    <div id="loading-text">0%</div>`;

        this.progressBar = this.preloader.querySelector('.progress-bar');
        this.loadingText = this.preloader.querySelector('#loading-text');
        ProgressBar.instance = this;

        return this;
    }

    show() {
        document.body.prepend(this.preloader);
        this.start();
    }

    start() {
        this.intervalId = setInterval(() => {
            if (this.progress < 90) {
                this.progress += Math.floor(Math.random() * 3) + 1;
                if (this.progress > 90) this.progress = 90;
                this.update();
            }
        }, 100);
    }

    update() {
        if (this.progressBar) {
            this.progressBar.style.width = this.progress + '%';
        }
        if (this.loadingText) {
            this.loadingText.textContent = this.progress + '%';
        }
    }

    hide() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.progress = 100;
        this.update();

        setTimeout(() => {
            if (this.preloader) {
                this.preloader.style.opacity = '0';
                this.preloader.style.pointerEvents = 'none';
                this.preloader.style.transition = 'opacity 0.5s ease';

                setTimeout(() => {
                    if (this.preloader) {
                        this.preloader.remove();
                    }

                    const content = document.getElementById('content');
                    if (content) {
                        content.classList.add('visible');
                    }
                }, 500);
            }
        }, 500);
    }
}

// Инициализация ProgressBar
const progressBar = new ProgressBar();
progressBar.show();

window.addEventListener('load', () => {
    progressBar.hide();
});

// Функция для debounce
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

function enableMapInteraction() {
    const mapWrapper = document.querySelector('.map-wrapper');
    if (!mapWrapper) return;

    const iframe = mapWrapper.querySelector('iframe');
    const mapOverlay = document.querySelector('.map-overlay');

    if (!iframe || !mapOverlay) return;

    mapOverlay.addEventListener('click', () => {
        iframe.style.pointerEvents = 'auto';
        mapOverlay.style.display = 'none';
        mapWrapper.style.cursor = 'default';
    });
}

// Обработчик меню
if (menuButton && sidebar && overlay && iconButton && mapButton) {
    menuButton.addEventListener('click', e => {
        const isActive = e.currentTarget.classList.toggle('active');
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
        menuButton.setAttribute("aria-expanded", isActive);
        sidebar.setAttribute("aria-hidden", !isActive);

        if (isActive) {
            mapButton.style.display = 'none';
            iconButton.classList.remove("bi-list");
            iconButton.classList.add("bi-x");
            sidebar.style.height = 'calc(100vh)';
        } else {
            mapButton.style.display = 'inline-block';
            iconButton.classList.remove("bi-x");
            iconButton.classList.add("bi-list");
            sidebar.style.height = '';
        }
    });
}

function hideOverlay(callback) {
    if (callback) {
        callback();
    }
    if (overlay) {
        overlay.classList.remove('active');
    }
}

function closeSidebar() {
    if (!sidebar || !menuButton || !mapButton || !iconButton) return;

    sidebar.classList.remove('active');
    hideOverlay();
    menuButton.classList.remove('active');
    menuButton.setAttribute("aria-expanded", "false");
    sidebar.setAttribute("aria-hidden", "true");
    mapButton.style.display = 'inline-block';
    sidebar.style.height = '';
    iconButton.classList.remove("bi-x");
    iconButton.classList.add("bi-list");
}

if (overlay) {
    overlay.addEventListener('click', closeSidebar);
}

window.onload = function () {
    window.scrollTo(0, 0);
};

// Объединенный обработчик DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    enableMapInteraction();

    // Инициализация header и scroll
    const header = document.querySelector('header');
    if (!header) return;

    const headerTop = header.querySelector('.header__top');
    const headerMain = header.querySelector('.header__main');
    const btnToTop = document.getElementById('btn-to-top');

    if (!headerTop || !headerMain) return;

    let topHeight = headerTop.offsetHeight;
    const hMainHeight = headerMain.offsetHeight;
    let headerHeight = topHeight + hMainHeight;

    if (btnToTop) {
        btnToTop.addEventListener('click', () => {
            window.scroll({ top: 0, behavior: 'smooth' });
        });
    }

    // Активация навигации
    const activeNav = () => {
        const body = document.body;
        const targetPage = body.getAttribute('page');

        if (!targetPage) {
            return;
        }

        document.querySelectorAll(`.nav__item[data-page='${targetPage}']`)
            .forEach(nav => {
                if (!nav.classList.contains('active')) {
                    nav.classList.add('active');
                }
            });
    };

    activeNav();

    // Функция прокрутки к секции
    function scrollToSection(buttonSelector, sectionSelector, redirectPage) {
        const buttons = document.querySelectorAll(buttonSelector);
        const section = document.querySelector(sectionSelector);

        if (!section) {
            if (redirectPage != null) {
                buttons.forEach(button => {
                    button.addEventListener('click', () => {
                        window.location.href = redirectPage;
                    });
                });
            }
            return;
        }

        buttons.forEach(button => {
            button.addEventListener('click', e => {
                if (sidebar && sidebar.classList.contains('active')) {
                    closeSidebar();
                }

                window.scroll({
                    top: section.offsetTop - hMainHeight,
                    behavior: 'smooth',
                    passive: true
                });
            });
        });
    }

    scrollToSection(".btn-map", "#map", "/contact");

    // Управление header
    let updated = false;

    function updateHeaderPositions() {
        topHeight = headerTop.offsetHeight;
        headerHeight = topHeight + hMainHeight;

        if (sidebar) {
            sidebar.style.paddingTop = headerHeight + 20 + 'px';
        }

        if (!updated) {
            headerMain.style.top = topHeight + 'px';
        }

        const pageElement = document.querySelector(".page");
        if (pageElement) {
            pageElement.style.paddingTop = headerHeight + 'px';
        }
    }

    function hideHeaderTop() {
        headerTop.classList.add('hidden');
        headerMain.classList.add('shift-top');
        headerMain.style.top = '0';
        updated = true;
    }

    function showHeaderTop() {
        headerTop.classList.remove('hidden');
        headerMain.classList.remove('shift-top');
        headerMain.style.top = topHeight + 'px';
        updated = false;
    }

    let ticking = false;

    function onScroll() {
        if (window.scrollY > topHeight + 10) {
            if (sidebar) {
                sidebar.style.paddingTop = hMainHeight + 20 + 'px';
            }
            hideHeaderTop();
        } else {
            if (sidebar) {
                sidebar.style.paddingTop = headerHeight + 20 + 'px';
            }
            showHeaderTop();
        }
        ticking = false;
    }

    updateHeaderPositions();

    // Оптимизированный resize с debounce
    const debouncedResize = debounce(() => {
        updateHeaderPositions();
    }, 150);

    window.addEventListener('resize', debouncedResize);

    // Scroll handler
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }

        if (btnToTop) {
            if (window.scrollY >= headerHeight) {
                btnToTop.classList.add('active');
            } else {
                btnToTop.classList.remove('active');
            }
        }
    });

    // Кэш для модальных окон
    const modalCache = new Map();

    // Инициализация модальных окон
    const modalButtons = document.querySelectorAll('[data-modal]');
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalSelector = button.getAttribute('data-modal');
            if (!modalSelector) return;

            let modal = modalCache.get(modalSelector);
            const modalElement = document.querySelector(modalSelector);

            if (!modalElement) {
                return;
            }

            if (!modal) {
                modal = new Modal(modalElement);
                modalCache.set(modalSelector, modal);
            }

            modal.show();
        });
    });

    // Обработка ошибок изображений
    const images = document.querySelectorAll('img[name="img"]');
    if (images.length > 0) {
        images.forEach(img => {
            img.addEventListener('error', e => {
                const imgElement = e.target;
                imgElement.onerror = null;
                imgElement.src = "image/no-image.jpg";
            });
        });
    }
});

// Слайдер
(function () {
    const slider = document.getElementById('slider');

    if (!slider) return;

    const sliderTrack = slider.querySelector('#sliderTrack');
    if (!sliderTrack) return;

    const slides = sliderTrack.children;
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function getSlideWidth() {
        return slides[0] ? slides[0].offsetWidth : 0;
    }

    function getGap() {
        return parseInt(window.getComputedStyle(sliderTrack).gap) || 0;
    }

    function getVisibleSlidesCount() {
        const sliderWidth = slider.offsetWidth;
        const slideWidth = getSlideWidth();
        const gap = getGap();
        const count = Math.floor(sliderWidth / (slideWidth + gap));
        return count > 0 ? count : 1;
    }

    function updateSlider() {
        const slideWidth = getSlideWidth();
        const gap = getGap();
        const visibleCount = getVisibleSlidesCount();

        if (currentIndex < 0) currentIndex = 0;
        if (currentIndex > totalSlides - visibleCount) currentIndex = totalSlides - visibleCount;

        const offset = currentIndex * (slideWidth + gap);
        sliderTrack.style.transform = `translateX(-${offset}px)`;

        nextBtn.disabled = currentIndex >= totalSlides - visibleCount;
        prevBtn.disabled = currentIndex <= 0;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex--;
        updateSlider();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex++;
        updateSlider();
    });

    // Поддержка свайпа
    let startX = 0;
    let endX = 0;
    let isSwiping = false;

    sliderTrack.addEventListener('touchstart', e => {
        startX = e.touches[0].clientX;
        isSwiping = false;
    });

    sliderTrack.addEventListener('touchmove', e => {
        endX = e.touches[0].clientX;
        if (Math.abs(endX - startX) > 15) isSwiping = true;
    });

    sliderTrack.addEventListener('touchend', e => {
        if (!isSwiping) return;

        const diff = startX - endX;
        const threshold = 50;
        if (diff > threshold) {
            currentIndex++;
            updateSlider();
        } else if (diff < -threshold) {
            currentIndex--;
            updateSlider();
        }
        startX = 0;
        endX = 0;
        isSwiping = false;
    });

    const debouncedSliderResize = debounce(() => {
        updateSlider();
    }, 150);

    window.addEventListener('resize', debouncedSliderResize);

    updateSlider();
})();

function enableScroll() {
    const scrollY = parseInt(document.body.style.top || '0') * -1;
    document.body.classList.remove('no-scroll');
    document.body.style.top = '';
    window.scrollTo(0, scrollY);
}

function disableScroll() {
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    document.documentElement.style.setProperty('--scroll-position', `-${scrollY}px`);
    document.body.classList.add('no-scroll');
    document.body.style.top = `-${scrollY}px`;
}

// Magnify изображений
(function () {
    const minimizedElements = document.querySelectorAll('.minimized');

    if (minimizedElements.length === 0 || !overlay) return;

    minimizedElements.forEach((minimized) => {
        const imgTitle = minimized.getAttribute('img-title');
        const pathToImage = minimized.getAttribute('src');
        const defaultZIndex = overlay.style.zIndex;

        const magnify = document.createElement('div');
        magnify.classList.add('magnify');
        magnify.innerHTML = `<img src='${pathToImage}' alt=""><div id="close-popup"><i></i></div>`;

        if (imgTitle) {
            magnify.insertAdjacentHTML('beforeend', `<div class=img-title><p class="text">${imgTitle}</p></div>`);
        }

        minimized.addEventListener('click', e => {
            overlay.classList.add('active');
            overlay.style.zIndex = '999';
            overlay.appendChild(magnify);
            disableScroll();
        });

        magnify.addEventListener('click', e => {
            e.stopPropagation();
        });

        const closePopup = magnify.querySelector("#close-popup");
        if (closePopup) {
            closePopup.addEventListener('click', e => {
                hideOverlay(() => {
                    magnify.remove();
                    overlay.style.zIndex = defaultZIndex;
                    enableScroll();
                });
            });
        }

        overlay.addEventListener('click', e => {
            if (overlay.contains(magnify)) {
                hideOverlay(() => magnify.remove());
                overlay.style.zIndex = defaultZIndex;
                enableScroll();
            }
        });
    });
})();

// Табы для цен
(function () {
    const contentContainer = document.querySelector(".price__container");

    if (!contentContainer) {
        return;
    }

    function changeButton(buttonTab, activeBtn) {
        if (buttonTab.classList.contains('active')) {
            return;
        }

        if (activeBtn) {
            activeBtn.classList.toggle('active');
            const triangle = activeBtn.nextElementSibling;

            if (triangle && triangle.classList.contains('triangle')) {
                activeBtn.parentNode.removeChild(triangle);
            }
            buttonTab.classList.toggle('active');
            if (triangle) {
                buttonTab.parentNode.appendChild(triangle);
            }
        }
    }

    function showTab(buttonTab, saveState = true) {
        if (buttonTab.classList.contains('active')) {
            return;
        }

        const targetData = buttonTab.getAttribute('data-target');
        if (!targetData) return;

        const targetSection = contentContainer.querySelector(`.price-data__container[data-section='${targetData}']`);
        if (targetSection) {
            const activeBtn = contentContainer.querySelector(".btn-tab.active");
            const activeTab = contentContainer.querySelector('.price-data__container.show');

            if (activeTab) {
                activeTab.classList.remove('show');
            }
            changeButton(buttonTab, activeBtn);

            targetSection.classList.add('show');


            if (saveState) {
                localStorage.setItem('activePriceTab', targetData);
            }
        }
    }

    const savedTab = localStorage.getItem('activePriceTab');
    if (savedTab) {
        const savedButton = contentContainer.querySelector(`.btn-tab[data-target='${savedTab}']`);
        if (savedButton) {
            showTab(savedButton, false);
        }
    }

    contentContainer.querySelectorAll(".btn-tab").forEach((btn) => {
        if (btn) {
            btn.addEventListener('click', () => {
                showTab(btn);
            });
        }
    });
})();


// FAQ аккордеон
(function () {
    const items = document.querySelectorAll(".faq__list .question");

    if (items.length <= 0) {
        return;
    }

    function toggleAccordion() {
        this.classList.toggle('active');
        const nextSibling = this.nextElementSibling;
        if (nextSibling) {
            nextSibling.classList.toggle('active');
        }
        const parentElement = this.parentElement;
        if (parentElement) {
            parentElement.classList.toggle('active');
        }
    }

    items.forEach(item => {
        item.addEventListener('click', toggleAccordion);
    });
})();
