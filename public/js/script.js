(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()

const checkInInput = document.getElementById('checkIn');
const checkOutInput = document.getElementById('checkOut');
const priceSummary = document.getElementById('priceSummary');
const nightsText = document.getElementById('nightsText');
const nightsPrice = document.getElementById('nightsPrice');
const totalPriceEl = document.getElementById('totalPrice');


if (checkInInput) {
  checkInInput.addEventListener('change', function () {
    const checkInDate = new Date(this.value);
    checkInDate.setDate(checkInDate.getDate() + 1);
    const minCheckOut = checkInDate.toISOString().split('T')[0];
    checkOutInput.min = minCheckOut;

    if (checkOutInput.value && checkOutInput.value <= this.value) {
      checkOutInput.value = '';
    }

    updatePrice();
  })
}

if (checkOutInput) {
  checkOutInput.addEventListener('change', function () {
    updatePrice();
  })
}

function updatePrice() {
  if (!checkInInput || !checkOutInput) return;

  const checkIn = checkInInput.value;
  const checkOut = checkOutInput.value;

  if (checkIn && checkOut) {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));

    if (nights > 0) {
      const pricePerNight = parseInt(listingPrice || 0);
      const total = nights * pricePerNight;

      nightsText.textContent = `${nights} night${nights >1 ? 's' : ''}`;
      nightsPrice.textContent = `₹${(nights * pricePerNight).toLocaleString('en-IN')}` ;
      totalPriceEl.textContent = `₹${total.toLocaleString('en-IN')}`;

      priceSummary.classList.remove('d-none');
    }

  }else {
    if(priceSummary) priceSummary.classList.add('d-none');
  }
}