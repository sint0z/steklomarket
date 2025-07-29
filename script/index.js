const header = document.querySelector('.header-container');
const sidebar = document.querySelector('#sidebar');
const menu_button = document.querySelector('.button__mobile__menu');
const overlay = document.querySelector('.overlay');
const icon_button = menu_button.querySelector("i");
const map_button = document.querySelector('#map-button');
const headerHeight = header.offsetHeight;

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('main').style.paddingTop = headerHeight + 'px';
})

menu_button.addEventListener('click', e => {
    console.log('clicked');
    let isActive = e.target.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    icon_button.removeAttribute("bi-list")
    menu_button.setAttribute("aria-expanded", isActive);
    sidebar.setAttribute("aria-hidden", !isActive);

    if(isActive){
        sidebar.style.top = headerHeight + 'px';
        sidebar.style.height = `calc(100vh - ${headerHeight}px)`;

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
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    menu_button.setAttribute("aria-expanded","false");
    sidebar.setAttribute("aria-hidden", "true");

    map_button.style.display = 'inline-block';
    sidebar.style.top = "0";
    sidebar.style.height = `calc(100vh)`;
    icon_button.classList.remove("bi-x");
    icon_button.classList.add("bi-list");
})


document.addEventListener('DOMContentLoaded', e => {
    console.log('DOMContentLoaded');
})

document.addEventListener('click', e => {
    console.log(document.getSelection());
})