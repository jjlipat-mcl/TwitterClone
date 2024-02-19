history.scrollRestoration = "manual";
const loader = document.querySelector('.loader-section');
const loaderIconWrapper = document.querySelector('.loader-icon-wrapper');
const loaderLogo = document.querySelector('.loader-logo');

window.addEventListener('load', () => {
  loader.classList.add('fade-out');
  loaderIconWrapper.classList.add('zoom-out');
  loaderLogo.classList.add('zoom-out');
  
  loader.classList.add('loader-hidden');
  loader.addEventListener('transitionend', () => {
    if (document.body.contains(loader)) {
      document.body.removeChild(loader);
    }
  });
});