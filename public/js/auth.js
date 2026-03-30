
function openAuthModal(tab) {
  document.getElementById('authModalBackdrop').classList.add('open');
  document.getElementById('authModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchTab(tab || 'login');
}
function closeAuthModal() {
  document.getElementById('authModalBackdrop').classList.remove('open');
  document.getElementById('authModal').classList.remove('open');
  document.body.style.overflow = '';
}
function switchTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginToggle = document.getElementById('loginToggle');
  const signupToggle = document.getElementById('signupToggle');
  if(tab === 'login') {
    loginForm.classList.add('active-form');
    signupForm.classList.remove('active-form');
    loginToggle.classList.add('active');
    signupToggle.classList.remove('active');
  } else {
    signupForm.classList.add('active-form');
    loginForm.classList.remove('active-form');
    signupToggle.classList.add('active');
    loginToggle.classList.remove('active');
  }
}
// <% if(typeof showAuthModal !== 'undefined' && showAuthModal){ %>
//   document.addEventListener('DOMContentLoaded', function() {
//     openAuthModal('<%= authTab || "login" %>');
//   });
// <% } %>
