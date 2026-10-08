// Kalokai — comportamiento mínimo de la página

(function () {
  // Al abrir una página sin ancla (#...), empezar siempre desde arriba
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  // Línea bajo la cabecera al desplazarse
  var header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ------------------------------------------------------------------
  // Formulario de solicitud (ventana emergente, igual en todas las páginas)
  // Se abre con cualquier enlace que tenga el atributo data-solicitud.
  // data-solicitud="credito" abre el formulario con «Consultar crédito» marcado.
  // El envío prepara un correo a DESTINO con los datos, como hasta ahora.
  // ------------------------------------------------------------------
  var DESTINO = 'hola@kalokai.es';

  var plantilla =
    '<dialog class="form-dialog" id="solicitud" aria-labelledby="solicitud-title">' +
    '  <button class="dialog-close" type="button" aria-label="Cerrar">&times;</button>' +
    '  <h2 id="solicitud-title" class="dialog-title">Hablemos de tu equipo</h2>' +
    '  <p class="dialog-intro">Cuéntanos qué necesitas y te responderemos en dos días laborables.</p>' +
    '  <form class="form" id="solicitud-form" novalidate>' +
    '    <fieldset class="field field-wide">' +
    '      <legend>¿Qué necesitas?</legend>' +
    '      <div class="chips">' +
    '        <label><input type="radio" name="motivo" value="credito"> Consultar el crédito FUNDAE de mi empresa</label>' +
    '        <label><input type="radio" name="motivo" value="formacion" checked> Información sobre una formación</label>' +
    '        <label><input type="radio" name="motivo" value="otra"> Otra consulta</label>' +
    '      </div>' +
    '    </fieldset>' +
    '    <div class="field">' +
    '      <label for="s-nombre">Nombre</label>' +
    '      <input id="s-nombre" name="nombre" type="text" autocomplete="name" required>' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-empresa">Empresa</label>' +
    '      <input id="s-empresa" name="empresa" type="text" autocomplete="organization" required>' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-email">Correo electrónico</label>' +
    '      <input id="s-email" name="email" type="email" autocomplete="email" required>' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-telefono">Teléfono <span class="optional">(opcional)</span></label>' +
    '      <input id="s-telefono" name="telefono" type="tel" autocomplete="tel">' +
    '    </div>' +
    '    <div class="field">' +
    '      <label for="s-plantilla">Personas en la empresa</label>' +
    '      <select id="s-plantilla" name="plantilla">' +
    '        <option>1 a 5</option><option>6 a 9</option><option>10 a 49</option>' +
    '        <option>50 a 249</option><option>250 o más</option>' +
    '      </select>' +
    '    </div>' +
    '    <div class="field" data-solo="credito">' +
    '      <label for="s-cif">CIF de la empresa</label>' +
    '      <input id="s-cif" name="cif" type="text" autocomplete="off">' +
    '    </div>' +
    '    <div class="field" data-solo="formacion">' +
    '      <label for="s-area">Área de interés</label>' +
    '      <select id="s-area" name="area">' +
    '        <option>Aún no lo tengo claro</option><option>Salud física</option><option>Salud mental</option>' +
    '        <option>Equipo y ambiente</option><option>Varias áreas</option>' +
    '      </select>' +
    '    </div>' +
    '    <fieldset class="field field-wide" data-solo="formacion">' +
    '      <legend>Formato</legend>' +
    '      <div class="chips">' +
    '        <label><input type="radio" name="formato" value="Presencial" checked> Presencial</label>' +
    '        <label><input type="radio" name="formato" value="En remoto"> En remoto</label>' +
    '        <label><input type="radio" name="formato" value="Mixto"> Mixto</label>' +
    '      </div>' +
    '    </fieldset>' +
    '    <div class="field field-wide">' +
    '      <label for="s-mensaje">¿Algo más que debamos saber? <span class="optional">(opcional)</span></label>' +
    '      <textarea id="s-mensaje" name="mensaje" rows="3"></textarea>' +
    '    </div>' +
    '    <label class="check field-wide" data-solo="credito"><input type="checkbox" name="guia" checked> Enviadme también la guía de formación bonificada.</label>' +
    '    <label class="check field-wide"><input type="checkbox" id="s-acepto" name="acepto" required> <span>He leído la <a href="privacidad.html" target="_blank">política de privacidad</a> y acepto que Kalokai use estos datos para responder a mi solicitud.</span></label>' +
    '    <div class="field-wide form-foot">' +
    '      <button class="btn" type="submit">Enviar solicitud</button>' +
    '      <p class="form-status" id="solicitud-status" role="status" aria-live="polite"></p>' +
    '    </div>' +
    '  </form>' +
    '</dialog>';

  document.body.insertAdjacentHTML('beforeend', plantilla);

  var dialog = document.getElementById('solicitud');
  var form = document.getElementById('solicitud-form');
  var status = document.getElementById('solicitud-status');
  var titulo = document.getElementById('solicitud-title');

  function motivoActual() {
    var marcado = form.querySelector('input[name="motivo"]:checked');
    return marcado ? marcado.value : 'formacion';
  }

  // Muestra solo los campos que tocan según lo que se necesita
  function actualizarCampos() {
    var motivo = motivoActual();
    form.querySelectorAll('[data-solo]').forEach(function (el) {
      el.hidden = el.getAttribute('data-solo') !== motivo;
    });
    titulo.textContent = motivo === 'credito' ? 'Consulta tu crédito FUNDAE' : 'Hablemos de tu equipo';
  }
  form.querySelectorAll('input[name="motivo"]').forEach(function (r) {
    r.addEventListener('change', actualizarCampos);
  });

  function abrir(motivo) {
    if (motivo) {
      var radio = form.querySelector('input[name="motivo"][value="' + motivo + '"]');
      if (radio) radio.checked = true;
    }
    actualizarCampos();
    status.textContent = '';
    status.classList.remove('error');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.getElementById('s-nombre').focus();
  }

  function cerrar() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  document.querySelectorAll('[data-solicitud]').forEach(function (el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      abrir(el.getAttribute('data-solicitud'));
    });
  });

  dialog.querySelector('.dialog-close').addEventListener('click', cerrar);
  // Cerrar al pulsar fuera de la ventana
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) cerrar();
  });

  // Enlaces desde otras páginas: index.html#solicitud abre el formulario
  if (location.hash === '#solicitud') abrir();
  if (location.hash === '#solicitud-credito') abrir('credito');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var obligatorios = ['s-nombre', 's-empresa', 's-email'];
    if (motivoActual() === 'credito') obligatorios.push('s-cif');

    var faltan = [];
    obligatorios.forEach(function (id) {
      var input = document.getElementById(id);
      var valido = input.value.trim() !== '' && input.checkValidity();
      input.parentElement.classList.toggle('invalid', !valido);
      input.setAttribute('aria-invalid', String(!valido));
      if (!valido) faltan.push(input);
    });
    var acepto = document.getElementById('s-acepto');

    if (faltan.length || !acepto.checked) {
      status.textContent = faltan.length
        ? 'Revisa los campos marcados para poder enviar la solicitud.'
        : 'Marca la casilla de aceptación para poder enviar la solicitud.';
      status.classList.add('error');
      (faltan[0] || acepto).focus();
      return;
    }

    var d = new FormData(form);
    var motivo = motivoActual();
    var lineas = [
      'Nombre: ' + d.get('nombre'),
      'Empresa: ' + d.get('empresa'),
      'Correo: ' + d.get('email'),
      'Teléfono: ' + (d.get('telefono') || '—'),
      'Personas en la empresa: ' + d.get('plantilla')
    ];
    var asunto;
    if (motivo === 'credito') {
      asunto = 'Consulta de crédito FUNDAE · ' + d.get('empresa');
      lineas.push('CIF: ' + d.get('cif'));
      lineas.push('Quiere la guía FUNDAE: ' + (d.get('guia') ? 'Sí' : 'No'));
    } else if (motivo === 'formacion') {
      asunto = 'Solicitud de información · ' + d.get('empresa');
      lineas.push('Área de interés: ' + d.get('area'));
      lineas.push('Formato: ' + d.get('formato'));
    } else {
      asunto = 'Consulta · ' + d.get('empresa');
    }
    lineas.push('', d.get('mensaje') || '');

    window.location.href = 'mailto:' + DESTINO +
      '?subject=' + encodeURIComponent(asunto) +
      '&body=' + encodeURIComponent(lineas.join('\n'));

    status.classList.remove('error');
    status.textContent = 'Hemos abierto tu correo con la solicitud preparada. Solo falta enviarla.';
  });
})();
