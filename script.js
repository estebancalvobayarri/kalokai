// Kalokai — comportamiento mínimo de la página

(function () {
  // Línea bajo la cabecera al desplazarse
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Formulario de contacto: prepara un correo con los datos
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var DESTINO = 'hola@kalokai.com';

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var faltan = [];
    ['nombre', 'empresa', 'email'].forEach(function (id) {
      var input = document.getElementById(id);
      var valido = input.value.trim() !== '' && input.checkValidity();
      input.parentElement.classList.toggle('invalid', !valido);
      input.setAttribute('aria-invalid', String(!valido));
      if (!valido) faltan.push(input);
    });

    if (faltan.length) {
      status.textContent = 'Completa nombre, empresa y un correo válido para enviar la solicitud.';
      status.classList.add('error');
      faltan[0].focus();
      return;
    }

    var datos = new FormData(form);
    var asunto = 'Solicitud de propuesta · ' + datos.get('empresa');
    var cuerpo = [
      'Nombre: ' + datos.get('nombre'),
      'Empresa: ' + datos.get('empresa'),
      'Correo: ' + datos.get('email'),
      'Área de interés: ' + datos.get('area'),
      '',
      datos.get('mensaje') || ''
    ].join('\n');

    window.location.href = 'mailto:' + DESTINO +
      '?subject=' + encodeURIComponent(asunto) +
      '&body=' + encodeURIComponent(cuerpo);

    status.classList.remove('error');
    status.textContent = 'Hemos abierto tu correo con la solicitud preparada. Solo falta enviarla.';
  });
})();
