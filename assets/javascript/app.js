AOS.init();
document.querySelector('.Burger').addEventListener('click', function () {
  document.querySelector('.nav').classList.toggle('is-open');
  document.querySelector(".nav").classList.toggle('overlay-open');
}); 
