const header = document.querySelector('.header-container');
const sidebar = document.querySelector('#sidebar');
const menu_button = document.querySelector('.button__mobile__menu');
const overlay = document.querySelector('.overlay');
const icon_button = menu_button.querySelector("i");
const map_button = document.querySelector('#map-button');
const headerHeight = header.offsetHeight;

const preloader = document.getElementById('preloader');
let progress = 0;
let intervalId = null;

function generatePreloader() {
    const preloaderElement = document.createElement('div');
    preloaderElement.id = 'preloader';

    preloaderElement.innerHTML = `<div>Подождите, контент загружается...</div>
                                        <div class="progress-bar-container">
                                            <div class="progress-bar" id="progress-bar"></div>
                                        </div>
                                    <div id="loading-text">0%</div>`

    document.body.prepend(preloaderElement);

    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');

    startLoading(progressBar, loadingText, preloaderElement);
}

function startLoading(progressBar, loadingText, preloader) {
    intervalId = setInterval(() => {
        if (progress < 90) {
            progress += Math.floor(Math.random() * 3) + 1;
            if (progress > 90) progress = 90;
            progressBar.style.width = progress + '%';
            loadingText.textContent = progress + '%';
        }
    }, 100);
}


function hidePreloader(preloader) {
    setTimeout(() => {

        preloader.style.opacity = '0';
        preloader.style.pointerEvents = 'none';
        preloader.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            preloader.remove();

            const content = document.getElementById('content');
            if (content) {
                content.classList.add('visible');
            }
        }, 500);
    }, 500);
}

window.addEventListener('load', () => {
    clearInterval(intervalId);
    progress = 100;
    const progressBar = document.getElementById('progress-bar');
    const loadingText = document.getElementById('loading-text');
    const preloader = document.getElementById('preloader');

    if (progressBar && loadingText) {
        progressBar.style.width = '100%';
        loadingText.textContent = '100%';
    }
    if (preloader) {
        hidePreloader(preloader);
    }
});


menu_button.addEventListener('click', e => {
    let isActive = e.target.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    icon_button.removeAttribute("bi-list")
    menu_button.setAttribute("aria-expanded", isActive);
    sidebar.setAttribute("aria-hidden", !isActive);

    if(isActive){
        map_button.style.display = 'none';
        icon_button.classList.remove("bi-list");
        icon_button.classList.add("bi-x");
    }else {
        map_button.style.display = 'inline-block';
        icon_button.classList.remove("bi-x");
        icon_button.classList.add("bi-list");
    }
})

overlay.addEventListener('click',closeSidebar)


function closeSidebar() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    menu_button.setAttribute("aria-expanded","false");
    sidebar.setAttribute("aria-hidden", "true");
    map_button.style.display = 'inline-block';
    sidebar.style.height = `calc(100vh)`;
    icon_button.classList.remove("bi-x");
    icon_button.classList.add("bi-list");
}

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
                    top: section.offsetTop - headerHeight + 20,
                    behavior: 'smooth'
                });
        })
    })
}


scrollToSection(".btn-map", ".map__section", "contact.html")


const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('modalCloseBtn');


function openModal() {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
}


function closeModal() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

closeModalBtn.addEventListener('click', closeModal);

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
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


const HIDE_DURATION = 300000;

function closeBanner(btnBanner){
    const banner = btnBanner.closest('.banner');

    if(banner){
        banner.remove();
        localStorage.setItem('bannerClosedAt', Date.now());
        checkAndShowBanner();
    }
}


function generateBanner(){

    const banner = document.createElement('div');
    banner.id = 'banner__info';
    banner.classList.add('banner');

    banner.innerHTML = `<button id="btn__banner-close" onClick="closeBanner(this)" aria-label="Скрыть баннер">&times;</button>
                        <span id="banner-title"> Dev-версия сайта не для коммерческой реализации</span>
                        <span id ="banner-text">За информацией обращаться к разработчику:</span>
                        <a href="https://t.me/sikita_s">
                              <i class="bi-telegram"></i>
                              <span>S1ntoz (Стоцкий Никита)</span>
                        </a>`


    document.body.appendChild(banner);
}

function checkAndShowBanner() {
    console.log("check")
    const closedAt = localStorage.getItem('bannerClosedAt');
    if (closedAt) {
        const elapsed = Date.now() - closedAt;
        if (elapsed >= HIDE_DURATION) {
            generateBanner();
            localStorage.removeItem('bannerClosedAt');
        } else {

            setTimeout(() => {
                generateBanner();
                localStorage.removeItem('bannerClosedAt');
            }, HIDE_DURATION - elapsed);
        }
    } else {
        generateBanner();
    }
}

function generateRow(size){

    if(size < 0) throw ErrorEvent("Size 0");

    let rows = [];
    for (let i = 0; i < size; i++) {
        const row = document.createElement('tr');
        row.innerHTML = `<tr>
                            <th data-label="Наименование" >Стекло красивое №${i}</th>
                            <th data-label="Производитель">Salawat</th>
                            <th data-label="Толщина, мм">4</th>
                            <th data-label="Цена">от 100 руб/</th>
                            <th data-label="Цена">Фото</th> 
                        </tr>`
        rows.push(row);
    }

    return rows;
}


function isMobile() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}


document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('main').style.paddingTop = headerHeight + 'px';
    sidebar.style.top = headerHeight + 'px';
    sidebar.style.height = `calc(100vh - ${headerHeight}px)`;
    enableMapInteraction();
    setTimeout(generateBanner, 2000);
    activeNav();

    const tb = document.getElementById('data-table-body');

    generateRow(15).forEach(row =>{
        tb.appendChild(row);
    })

    const dropdownToggles = document.querySelectorAll('.dropdown-toggle')

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {

            if (isMobile()) {
                e.preventDefault();
            }

            const subNav = toggle.nextElementSibling;
            const icon = toggle.querySelector('.bi.bi-caret-down-fill');


            if (subNav.style.display === 'flex') {
                subNav.style.display = 'none';
                if (icon) icon.classList.toggle('rotate');
            } else {
                document.querySelectorAll('.sub-nav').forEach(menu => {
                    menu.style.display = 'none';
                });
                subNav.style.display = 'flex';
                if (icon && !icon.classList.contains('rotate')) icon.classList.add('rotate');
            }
        });
    })

    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-toggle')) {
            document.querySelectorAll('.bi.bi-caret-down-fill').forEach(icon => {
                if (icon && icon.classList.contains('rotate')) icon.classList.toggle('rotate');
            })
            document.querySelectorAll('.sub-nav').forEach(menu => {
                if (menu.style.display === 'flex') {
                    menu.style.display = 'none';
                }
            });
        }
    });
})

generatePreloader();

const changeButton = (buttonTab, activeBtn) => {

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

const showTab = (buttonTab) => {
    const contentContainer = buttonTab.closest(".price__list");

    if(buttonTab.classList.contains('active')){
        console.log("Click active")
        return;
    }

    const targetData = buttonTab.getAttribute('data-target');
    const targetSection = contentContainer.querySelector(`.price__data-content[data-section='${targetData}']`);
    if(targetSection){
        const activeBtn = contentContainer.querySelector(".tab-button.active");
        const activeTab = contentContainer.querySelector('.price__data-content.show');

        if (activeTab) activeTab.classList.remove('show');
        changeButton(buttonTab, activeBtn);

        targetSection.classList.add('show');
    }
}


window.addEventListener('scroll', () => {

    const flList = document.getElementById('following_list');
    const placeholder = flList.parentElement;
    const currentPosition = flList.style.position;

    const startPos = placeholder.offsetTop - 20;
    const endPos = placeholder.offsetTop + placeholder.offsetHeight - flList.offsetHeight - 20;
    const scrollY = window.scrollY + headerHeight;

    if (scrollY >= startPos && scrollY <= endPos) {
        if (currentPosition !== 'fixed') {
            flList.style.position = 'fixed';
            flList.style.top = (headerHeight + 20) + 'px';
            flList.style.bottom = '';
            flList.style.width = placeholder.offsetWidth + 'px';
        }
    } else if (scrollY > endPos) {
        if (currentPosition !== 'absolute') {
            flList.style.position = 'absolute';
            flList.style.top = '';
            flList.style.bottom = '0';
            flList.style.width = '100%';
        }
    } else {
        if (currentPosition !== 'static') {
            flList.style.position = 'static';
            flList.style.top = '';
            flList.style.bottom = '';
        }
    }

});


const activeNav = () =>{
    const body = document.getElementsByTagName('body')[0]

    const targetPage = body.getAttribute('page');

    if(!targetPage){
        return;
    }

    document.querySelectorAll(`.nav-item[data-page='${targetPage}']`)
        .forEach(nav => {
            if(!nav.classList.contains('active')) {
                nav.classList.add('active');
            }
    })
}
