const page = document.getElementById("page");
const sidebar = document.querySelector('#sidebar');
const menu_button = document.querySelector('.btn--mobile');
const overlay = document.querySelector('.overlay');
const icon_button = menu_button.querySelector("i");
const map_button = document.querySelector('.btn-map');


class Modal{
    constructor(modal) {
        this.modal = modal;
        this.closeButton = this.modal.querySelector('#modal-close');

        this.closeButton.addEventListener('click', this.hide.bind(this));

        this.modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.hide()
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                this.hide()
            }
        })
    }

    hide(){
        console.log("Log")
        this.modal.classList.remove('active');
        this.modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    show(){
        this.modal.classList.add('active');
        this.modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

}

class ProgressBar{
    static instance = null; //Static variable for the singleton class

    preloader = null;
    progressBar = null;
    loadingText = null;

    constructor(){
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
                                    <div id="loading-text">0%</div>`

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
        this.progressBar.style.width = this.progress + '%';
        this.loadingText.textContent = this.progress + '%';
    }

    hide() {
        clearInterval(this.intervalId);
        this.progress = 100;
        this.update();

        setTimeout(() => {
            this.preloader.style.opacity = '0';
            this.preloader.style.pointerEvents = 'none';
            this.preloader.style.transition = 'opacity 0.5s ease';

            setTimeout(() => {
                this.preloader.remove();

                const content = document.getElementById('content');
                if (content) content.classList.add('visible');
            }, 500);
        }, 500);
    }
}


const progressBar = new ProgressBar();
progressBar.show()

window.addEventListener('load', () => {
    progressBar.hide();
});



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

menu_button.addEventListener('click', e => {
    let isActive = e.currentTarget.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    menu_button.setAttribute("aria-expanded", isActive);
    sidebar.setAttribute("aria-hidden", !isActive);

    if(isActive){
        map_button.style.display = 'none';
        icon_button.classList.remove("bi-list");
        icon_button.classList.add("bi-x");
        sidebar.style.height = 'calc(100vh)';
    }else {
        map_button.style.display = 'inline-block';
        icon_button.classList.remove("bi-x");
        icon_button.classList.add("bi-list");
        sidebar.style.height = '';
    }
});


function hideOverlay(callback){
    if(callback){
        callback();
    }
    overlay.classList.remove('active');
}

function closeSidebar() {
    sidebar.classList.remove('active');
    hideOverlay();
    menu_button.classList.remove('active');
    menu_button.setAttribute("aria-expanded","false");
    sidebar.setAttribute("aria-hidden", "true");
    map_button.style.display = 'inline-block';
    sidebar.style.height = ''; // сброс высоты
    icon_button.classList.remove("bi-x");
    icon_button.classList.add("bi-list");
}

overlay.addEventListener('click',closeSidebar);



window.onload = function () {
    window.scrollTo(0, 0);
};


document.addEventListener('DOMContentLoaded', () => {
    enableMapInteraction();

});


function btnClick(button, callback){
    if(!button) return;
    button.addEventListener('click', callback);
}

document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const headerTop = header.querySelector('.header__top');
    const headerMain = header.querySelector('.header__main');
    let topHeight = headerTop.offsetHeight;
    const hMainHeight = headerMain.offsetHeight;
    let headerHeight = topHeight + hMainHeight;
    const btnToTop = document.getElementById('btn-to-top');
    btnClick(btnToTop, () => window.scroll({top: 0, behavior: 'smooth'}));



    function scrollToSection(button_selector, section_selector, redirect_page) {
        let buttons = document.querySelectorAll(button_selector);
        let section = document.querySelector(section_selector);

        buttons.forEach(button => {
            button.addEventListener('click', e => {

                if(!document.querySelector(section_selector) && redirect_page != null) {
                    window.location.href = redirect_page
                }

                if(sidebar.classList.contains('active')) {
                    closeSidebar();
                }

                window.scroll({
                    top: section.offsetTop - hMainHeight,
                    behavior: 'smooth',
                    passive: true
                });
            })
        })
    }
    scrollToSection(".btn-map", "#map", "contact.html");

    let updated = false
    function updateHeaderPositions() {
        topHeight = headerTop.offsetHeight;
        headerHeight = topHeight + hMainHeight;
        sidebar.style.paddingTop = headerHeight + 20 + 'px';

        if(!updated) {
            headerMain.style.top = topHeight + 'px';
        }
        document.querySelector(".page").style.paddingTop = headerHeight + 'px';
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
            sidebar.style.paddingTop =  hMainHeight + 20 + 'px';
            hideHeaderTop();
        } else {
            sidebar.style.paddingTop =  headerHeight + 20 + 'px';
            showHeaderTop();
        }
        ticking = false;
    }

    updateHeaderPositions();

    window.addEventListener('resize',()=>{
        updateHeaderPositions();
    });

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(onScroll);
            ticking = true;
        }

        if(scrollY >= headerHeight){
            btnToTop.classList.add('active');
        }else {
            btnToTop.classList.remove('active');
        }

    });

    const modalButtons = document.querySelectorAll('[data-modal]');
    console.log(modalButtons);
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log('clicked');
            const modalSelector = button.getAttribute('data-modal');
            const modalElement = document.querySelector(modalSelector);

            console.log(modalElement);

            if (modalElement) {
                const modal = new Modal(modalElement);
                console.log(modal)
                modal.show();
            } else {
                console.warn('Модальное окно не найдено по селектору:', modalSelector);
            }
        });
    });


    const images = document.getElementsByName('img');
    if(images.length > 0){
        images.forEach(img => {
            img.addEventListener('error', e => {
                img.error = null;
                img.src = "images/no-image.png";
            })
        })
    }
});



(() => {
    const slider = document.getElementById('slider');

    if (!slider) return;

    const sliderTrack = slider.querySelector('#sliderTrack');
    const slides = sliderTrack.children;
    const totalSlides = slides.length;

    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;

    function getSlideWidth() {
        return slides[0].offsetWidth;
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
        prevBtn.disabled = currentIndex <= 0 ;
        console.log(currentIndex , slides.length);
    }

    prevBtn.onclick = () => {
        currentIndex--;
        updateSlider();
    };

    nextBtn.onclick = () => {
        currentIndex++;
        updateSlider();
    };


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

    window.addEventListener('resize', () => {
        updateSlider();
    });

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




(function (){
    const minimized = document.querySelector('.minimized'); // или '#minimized' для id

    if(!minimized){
        return;
    }

    const imgTitle = minimized.getAttribute('img-title')
    const pathToImage = minimized.getAttribute('src');
    const defaultZIndex = overlay.style.zIndex;

    const magnify = document.createElement('div');
    magnify.classList.add('magnify');
    magnify.innerHTML =  `<img src='${pathToImage}' alt=""><div id="close-popup"><i></i></div>`;

    if(imgTitle){
        magnify.insertAdjacentHTML('beforeend', `<div class=img-title><p class="text">${imgTitle}</p></div>`);
    }

    minimized.addEventListener('click', e => {
        overlay.classList.add('active');
        overlay.style.zIndex = '999';
        overlay.appendChild(magnify);
        disableScroll();
    })
    magnify.addEventListener('click', e => {
        e.stopPropagation();
    })

    magnify.querySelector("#close-popup").addEventListener('click', e => {
        if(magnify){
            hideOverlay(() => {
                magnify.remove()
                overlay.style.zIndex = defaultZIndex;
                enableScroll();
            });
        }
    })

    overlay.addEventListener('click', e => {
        if(magnify){
            hideOverlay(() => magnify.remove());
            overlay.style.zIndex = defaultZIndex;
            enableScroll();
        }
    })
})();



(function (){
    const contentContainer = document.querySelector(".price__container");
    console.log(contentContainer)
    if(!contentContainer){
        return;
    }

    function changeButton (buttonTab, activeBtn) {

        if (buttonTab.classList.contains('.active')) {
            return;
        }

        if (activeBtn) {
            activeBtn.classList.toggle('active');
            const triangle = activeBtn.nextElementSibling;

            if (triangle && triangle.classList.contains('triangle')) {
                activeBtn.parentNode.removeChild(triangle);
            }
            buttonTab.classList.toggle('active');
            buttonTab.parentNode.appendChild(triangle)
        }
    }

    function showTab(buttonTab){

        if(buttonTab.classList.contains('active')){
            return;

        }

        const targetData = buttonTab.getAttribute('data-target');

        const targetSection = contentContainer.querySelector(`.price-data__container[data-section='${targetData}']`);
        if(targetSection){
            const activeBtn = contentContainer.querySelector(".btn-tab.active");
            const activeTab = contentContainer.querySelector('.price-data__container.show');

            if (activeTab) activeTab.classList.remove('show');
            changeButton(buttonTab, activeBtn);

            targetSection.classList.add('show');
        }
    }

    contentContainer.querySelectorAll(".btn-tab").forEach((btn) => {
        if(!btn) return;
        console.log(btn)
        btn.addEventListener('click', () =>
            {
                showTab(btn)
            }
        );
    })
})();


(function (){
    const items = document.querySelectorAll(".faq__list .question");

    console.log(items);
    if(items.length <= 0){
        return;
    }

    function toggleAccordion(){
        this.classList.toggle('active');
        this.nextElementSibling.classList.toggle('active');
    }
    items.forEach(item => item.addEventListener('click', toggleAccordion));
})();