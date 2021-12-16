const nav = document.getElementsByTagName("nav")[0];
const logo = document.getElementById('logo');

logo.addEventListener('mouseover',openNav);
logo.addEventListener('mouseout',closeNav);
nav.addEventListener('mouseover',openNav);
nav.addEventListener('mouseout',closeNav);

function openNav(){
    nav.style.height="212px";
    logo.style.height="300px";
}

function closeNav(){
    nav.style.height="0px";
    logo.style.height="100px";
}
