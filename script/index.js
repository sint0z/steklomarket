const header = document.querySelector('.header-container');
const sidebar = document.querySelector('#sidebar');
const menu_button = document.querySelector('.button__mobile__menu');
const overlay = document.querySelector('.overlay');
const icon_button = menu_button.querySelector("i");


menu_button.addEventListener('click', e => {
    let isActive = e.target.classList.toggle('active');
    sidebar.classList.toggle('active');
    overlay.classList.toggle('active');
    icon_button.removeAttribute("bi-list")
    menu_button.setAttribute("aria-expanded", isActive);
    sidebar.setAttribute("aria-hidden", !isActive);


    const headerHeight = header.offsetHeight;

    if(isActive){
        sidebar.style.top = headerHeight + 'px';
        sidebar.style.height = `calc(100vh - ${headerHeight}px)`;

        icon_button.classList.remove("bi-list");
        icon_button.classList.add("bi-x");
    }else {
        icon_button.classList.remove("bi-x");
        icon_button.classList.add("bi-list");
    }
})

overlay.addEventListener('click', e => {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    menu_button.setAttribute("aria-expanded","false");
    sidebar.setAttribute("aria-hidden", "true");

    sidebar.style.top = "0";
    sidebar.style.height = `calc(100vh)`;
    icon_button.classList.remove("bi-x");
    icon_button.classList.add("bi-list");
})