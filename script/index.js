const header = document.querySelector('.header-container');
const sidebar = document.querySelector('#sidebar');
const menu_button = document.querySelector('.button__mobile__menu');
const overlay = document.querySelector('.overlay');
const icon_button = menu_button.querySelector("i");
const map_button = document.querySelector('#map-button');
const headerHeight = header.offsetHeight;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('main').style.paddingTop = headerHeight + 'px';
    sidebar.style.top = headerHeight + 'px';
    sidebar.style.height = `calc(100vh - ${headerHeight}px)`;
})

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

overlay.addEventListener('click', e => {
    closeSidebar()
})


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


scrollToSection(".btn-map", ".map__section", "index.html")