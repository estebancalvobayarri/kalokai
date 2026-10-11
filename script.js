// Kalokai — comportamiento mínimo de la página

(function () {
  // Al abrir una página sin ancla (#...), empezar siempre desde arriba
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) window.scrollTo(0, 0);

  // ------------------------------------------------------------------
  // Menú para móvil y tablet: botón en la cabecera con las tres páginas.
  // Para cambiar los enlaces, edita la lista PAGINAS.
  // ------------------------------------------------------------------
  var PAGINAS = [
    ['index.html', 'Inicio'],
    ['bienestar-laboral.html', 'Bienestar laboral'],
    ['formacion-bonificada.html', 'Formación bonificada']
  ];
  var cabecera = document.querySelector('.header-inner');
  if (cabecera) {
    var actual = location.pathname.split('/').pop() || 'index.html';
    var boton = document.createElement('button');
    boton.className = 'menu-toggle';
    boton.type = 'button';
    boton.setAttribute('aria-expanded', 'false');
    boton.setAttribute('aria-controls', 'menu-movil');
    boton.setAttribute('aria-label', 'Abrir menú');
    boton.innerHTML = '<span></span><span></span><span></span>';
    cabecera.appendChild(boton);

    var panel = document.createElement('nav');
    panel.className = 'mobile-menu';
    panel.id = 'menu-movil';
    panel.setAttribute('aria-label', 'Menú');
    panel.hidden = true;
    panel.innerHTML = '<ul class="wrap">' + PAGINAS.map(function (p) {
      return '<li><a href="' + p[0] + '"' + (p[0] === actual ? ' aria-current="page"' : '') + '>' + p[1] + '</a></li>';
    }).join('') + '</ul>';
    cabecera.parentNode.appendChild(panel);

    function abrirMenu(abierto) {
      panel.hidden = !abierto;
      boton.setAttribute('aria-expanded', String(abierto));
      boton.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
      boton.classList.toggle('open', abierto);
    }
    boton.addEventListener('click', function () { abrirMenu(panel.hidden); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') abrirMenu(false); });
    window.addEventListener('resize', function () { if (window.innerWidth > 980) abrirMenu(false); });
  }

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

// --------------------------------------------------------------------
// Ventana «Descargar guía FUNDAE» (solo en las páginas con [data-guia])
// Muestra la portada de la guía y un formulario. Al enviarlo, se manda
// la guía por correo a la dirección que indique la persona.
// El correo lo envía EmailJS (emailjs.com) a través del correo de Hostinger
// (hola@kalokai.es). Rellena los tres datos de GUIA_EMAILJS con los de tu
// cuenta de EmailJS. Mientras estén vacíos, el formulario funciona en modo
// prueba: simula el envío y no manda nada.
// --------------------------------------------------------------------
(function () {
  var botones = document.querySelectorAll('[data-guia]');
  if (!botones.length) return;

  var GUIA_EMAILJS = {
    servicio: '',   // Service ID   (EmailJS > Email Services)
    plantilla: '',  // Template ID  (EmailJS > Email Templates)
    clave: ''       // Public Key   (EmailJS > Account)
  };
  // Enlace a la guía que se incluye en el correo
  var GUIA_PDF = 'https://www.kalokai.es/guia-formacion-bonificada-kalokai.pdf';

  var plantilla =
    '<dialog class="form-dialog guia-dialog" id="guia" aria-labelledby="guia-title">' +
    '  <button class="dialog-close" type="button" aria-label="Cerrar">&times;</button>' +
    '  <div class="guia-grid">' +
    '    <div class="guia-cover">' +
    '      <img src="guia-portada.jpg" width="640" height="905" alt="Portada de la Guía de la formación bonificada de Kalokai">' +
    '    </div>' +
    '    <div class="guia-body">' +
    '      <h2 id="guia-title" class="dialog-title">Guía de la formación bonificada</h2>' +
    '      <p class="dialog-intro">Cómo usar el crédito FUNDAE de tu empresa para cuidar a tu equipo, explicado de forma sencilla. Déjanos tus datos y te la enviamos por correo.</p>' +
    '      <form class="form guia-form" id="guia-form" novalidate>' +
    '        <div class="field">' +
    '          <label for="g-nombre">Nombre</label>' +
    '          <input id="g-nombre" name="nombre" type="text" autocomplete="name" required>' +
    '        </div>' +
    '        <div class="field">' +
    '          <label for="g-empresa">Empresa</label>' +
    '          <input id="g-empresa" name="empresa" type="text" autocomplete="organization" required>' +
    '        </div>' +
    '        <div class="field field-wide">' +
    '          <label for="g-email">Correo electrónico</label>' +
    '          <input id="g-email" name="email" type="email" autocomplete="email" required>' +
    '        </div>' +
    '        <div class="field field-wide">' +
    '          <label for="g-plantilla">Personas en la empresa</label>' +
    '          <select id="g-plantilla" name="plantilla">' +
    '            <option>1 a 5</option><option>6 a 9</option><option>10 a 49</option>' +
    '            <option>50 a 249</option><option>250 o más</option>' +
    '          </select>' +
    '        </div>' +
    '        <label class="check field-wide"><input type="checkbox" id="g-acepto" name="acepto" required> <span>He leído la <a href="privacidad.html" target="_blank">política de privacidad</a> y acepto que Kalokai use estos datos para enviarme la guía.</span></label>' +
    '        <div class="field-wide form-foot">' +
    '          <button class="btn" type="submit">Solicitar guía</button>' +
    '          <p class="form-status" id="guia-status" role="status" aria-live="polite"></p>' +
    '        </div>' +
    '      </form>' +
    '      <div class="guia-ok" id="guia-ok" hidden>' +
    '        <svg class="guia-ok-icon" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M7.5 12.5l3 3 6-6.5"/></svg>' +
    '        <p class="guia-ok-title">¡Guía en camino!</p>' +
    '        <p class="guia-ok-text">Te la hemos enviado a <strong id="guia-ok-email"></strong>. Si en unos minutos no la ves, revisa la carpeta de correo no deseado.</p>' +
    '      </div>' +
    '    </div>' +
    '  </div>' +
    '</dialog>';

  document.body.insertAdjacentHTML('beforeend', plantilla);

  var dialog = document.getElementById('guia');
  var form = document.getElementById('guia-form');
  var status = document.getElementById('guia-status');
  var ok = document.getElementById('guia-ok');
  var enviar = form.querySelector('button[type="submit"]');

  function abrir() {
    form.hidden = false;
    ok.hidden = true;
    status.textContent = '';
    status.classList.remove('error');
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
    document.getElementById('g-nombre').focus();
  }

  function cerrar() {
    if (typeof dialog.close === 'function') dialog.close();
    else dialog.removeAttribute('open');
  }

  botones.forEach(function (el) {
    el.addEventListener('click', function (event) {
      event.preventDefault();
      abrir();
    });
  });
  dialog.querySelector('.dialog-close').addEventListener('click', cerrar);
  dialog.addEventListener('click', function (event) {
    if (event.target === dialog) cerrar();
  });
  if (location.hash === '#guia') abrir();

  // Envía el correo con EmailJS. Sin datos configurados, simula el envío.
  function enviarGuia(datos) {
    var c = GUIA_EMAILJS;
    if (!c.servicio || !c.plantilla || !c.clave) {
      return new Promise(function (resolve) { setTimeout(resolve, 700); });
    }
    datos.enlace_guia = GUIA_PDF;
    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: c.servicio,
        template_id: c.plantilla,
        user_id: c.clave,
        template_params: datos
      })
    }).then(function (r) {
      if (!r.ok) throw new Error('Envío fallido');
    });
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var faltan = [];
    ['g-nombre', 'g-empresa', 'g-email'].forEach(function (id) {
      var input = document.getElementById(id);
      var valido = input.value.trim() !== '' && input.checkValidity();
      input.parentElement.classList.toggle('invalid', !valido);
      input.setAttribute('aria-invalid', String(!valido));
      if (!valido) faltan.push(input);
    });
    var acepto = document.getElementById('g-acepto');

    if (faltan.length || !acepto.checked) {
      status.textContent = faltan.length
        ? 'Revisa los campos marcados para poder enviarte la guía.'
        : 'Marca la casilla de aceptación para poder enviarte la guía.';
      status.classList.add('error');
      (faltan[0] || acepto).focus();
      return;
    }

    var d = new FormData(form);
    var datos = {
      nombre: d.get('nombre').trim(),
      empresa: d.get('empresa').trim(),
      email: d.get('email').trim(),
      plantilla: d.get('plantilla'),
      pagina: location.href
    };

    enviar.disabled = true;
    enviar.textContent = 'Enviando…';
    status.classList.remove('error');
    status.textContent = '';

    enviarGuia(datos).then(function () {
      document.getElementById('guia-ok-email').textContent = datos.email;
      form.hidden = true;
      ok.hidden = false;
      form.reset();
    }).catch(function () {
      status.textContent = 'No hemos podido enviar la guía. Inténtalo de nuevo o escríbenos a hola@kalokai.es.';
      status.classList.add('error');
    }).then(function () {
      enviar.disabled = false;
      enviar.textContent = 'Solicitar guía';
    });
  });
})();
