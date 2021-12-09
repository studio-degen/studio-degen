newdiv = document.createElement('div');
document.querySelector('body').appendChild(newdiv);
console.log('HI IM WORKING');

const obj = { name: 'tm' };

const navbar = document.getElementById('navbar');
const logo = document.getElementById('logo');

logo.addEventListener('mouseover',openNav);
logo.addEventListener('mouseout',closeNav);
navbar.addEventListener('mouseover',openNav);
navbar.addEventListener('mouseout',closeNav);

function openNav(){
    navbar.style.height="212px";
    logo.style.height="300px";
}

function closeNav(){
    navbar.style.height="0px";
    logo.style.height="100px";
}