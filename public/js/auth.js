
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
function toggleProfileDropdown(){
  const menu = document.getElementById('profileDropdown')
  menu.classList.toggle('open');
}

document.addEventListener('click',function(e){
  const dropdown = document.querySelector(".nav-profile-dropdown");
  if(dropdown && !dropdown.contains(e.target)){
    const menu = document.getElementById('profileDropdown');
    if(menu) menu.classList.remove('open');
  }
});
