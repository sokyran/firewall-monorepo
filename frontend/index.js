document.addEventListener('DOMContentLoaded', () => {
  if (!window.location.pathname.endsWith('/')) {
    window.location.replace(window.location.pathname + '/');
  }
});