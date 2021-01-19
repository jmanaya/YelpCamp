function validateForm() {
      'use strict'

      let forms = document.querySelectorAll('.validated-form');

      Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
          }

          form.classList.add('was-validated');
        }, false)
      })
}

validateForm();
