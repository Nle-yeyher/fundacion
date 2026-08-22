(function () {
  /* ============================================================
     ESTADO GLOBAL
  ============================================================ */
  let cmsData = [];
  let publicaciones = [];
  let galeriaItems = [];

  const esc = v => String(v ?? '').replace(/[&<>"']/g, c =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  /* ============================================================
     INIT
  ============================================================ */
  comprobarSesion();

  document.getElementById('login-form').addEventListener('submit', async e => {
    e.preventDefault();
    const err = document.getElementById('login-error');
    err.classList.add('hidden');
    const r = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usuario: document.getElementById('usuario').value,
        password: document.getElementById('password').value
      })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok) { err.textContent = data.error || 'No se pudo iniciar sesión.'; err.classList.remove('hidden'); return; }
    await comprobarSesion();
  });

  document.getElementById('btn-logout').addEventListener('click', async () => {
    await fetch('/api/logout', { method: 'POST' });
    location.reload();
  });

  async function comprobarSesion() {
    const r = await fetch('/api/content?admin=1', { cache: 'no-store' });
    if (r.ok) { const d = await r.json(); mostrarAdmin(d); }
    else mostrarLogin();
  }

  function mostrarLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.getElementById('admin-screen').style.display = 'none';
  }

  async function mostrarAdmin(data) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('admin-screen').style.display = 'block';
    cmsData = data.items || [];
    document.getElementById('stat-campos').textContent = cmsData.length;
    await Promise.all([cargarPublicaciones(), cargarGaleria()]);
    renderizarCMS();
    renderizarDashboard();
    document.getElementById('pub-fecha').valueAsDate = new Date();
  }

  /* ============================================================
     NAVEGACIÓN
  ============================================================ */
  document.querySelectorAll('.sidebar-item[data-panel]').forEach(btn => {
    btn.addEventListener('click', () => irPanel(btn.dataset.panel));
  });

  window.irPanel = function(id) {
    document.querySelectorAll('.sidebar-item').forEach(b => b.classList.remove('active'));
    const btn = document.querySelector(`.sidebar-item[data-panel="${id}"]`);
    if (btn) btn.classList.add('active');
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    const panel = document.getElementById('panel-' + id);
    if (panel) panel.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (id === 'nueva-publicacion' && !document.getElementById('pub-edit-id').value) limpiarEditor();
  };

  /* ============================================================
     DASHBOARD
  ============================================================ */
  function renderizarDashboard() {
    const el = document.getElementById('dash-ultimas-pub');
    if (!publicaciones.length) {
      el.innerHTML = '<p style="color:var(--suave);font-size:.85rem">No hay publicaciones aún.</p>';
      return;
    }
    const ultimas = publicaciones.slice(0, 4);
    el.innerHTML = ultimas.map(p => `
      <div style="display:flex;align-items:center;gap:.7rem;padding:.6rem 0;border-bottom:1px solid var(--borde)">
        <div style="flex:1;min-width:0">
          <div style="font-size:.85rem;font-weight:700;color:var(--cafe);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${esc(p.titulo)}</div>
          <div style="font-size:.75rem;color:var(--suave)">${p.fecha || ''} · <span class="tag-categoria tag-${esc(p.categoria)}">${esc(p.categoria)}</span></div>
        </div>
        <button class="btn btn-azul btn-icono" onclick="editarPublicacion('${esc(p.id)}')">Editar</button>
      </div>`).join('');
  }

  /* ============================================================
     PUBLICACIONES
  ============================================================ */
  async function cargarPublicaciones() {
    try {
      const r = await fetch('/api/publicaciones', { cache: 'no-store' });
      if (r.ok) publicaciones = (await r.json()).items || [];
      else publicaciones = [];
    } catch { publicaciones = []; }
    document.getElementById('stat-pub').textContent = publicaciones.length;
    document.getElementById('badge-pub').textContent = publicaciones.length;
    renderizarPublicaciones();
  }

  function renderizarPublicaciones() {
    const lista = document.getElementById('pub-lista');
    const buscar = (document.getElementById('pub-buscar')?.value || '').toLowerCase();
    const cat = document.getElementById('pub-filtro-cat')?.value || '';
    let items = publicaciones;
    if (buscar) items = items.filter(p => p.titulo?.toLowerCase().includes(buscar));
    if (cat) items = items.filter(p => p.categoria === cat);
    if (!items.length) {
      lista.innerHTML = `<div class="estado-vacio"><div class="estado-vacio-icono">&#128240;</div><p>No hay publicaciones aún.<br>Crea la primera desde "Nueva publicación".</p></div>`;
      return;
    }
    lista.innerHTML = `<div class="pub-lista">${items.map(p => `
      <div class="pub-card">
        ${p.imagen ? `<img class="pub-thumb" src="${esc(p.imagen)}" alt="">` : `<div class="pub-thumb-empty">&#128247;</div>`}
        <div class="pub-info">
          <div class="pub-titulo">${esc(p.titulo)}</div>
          <div class="pub-meta">
            <span>${esc(p.fecha || '')}</span>
            <span class="tag-categoria tag-${esc(p.categoria || 'general')}">${esc(p.categoria || 'general')}</span>
            <span class="pub-estado ${esc(p.estado || 'borrador')}">${p.estado === 'publicado' ? '● Publicado' : '○ Borrador'}</span>
          </div>
          <div class="pub-extracto">${esc(p.extracto || '')}</div>
        </div>
        <div class="pub-acciones">
          <button class="btn btn-azul btn-icono" onclick="editarPublicacion('${esc(p.id)}')">Editar</button>
          <button class="btn btn-rojo btn-icono" onclick="eliminarPublicacion('${esc(p.id)}')">Eliminar</button>
        </div>
      </div>`).join('')}</div>`;
  }

  document.getElementById('pub-buscar')?.addEventListener('input', renderizarPublicaciones);
  document.getElementById('pub-filtro-cat')?.addEventListener('change', renderizarPublicaciones);

  function limpiarEditor() {
    document.getElementById('pub-edit-id').value = '';
    document.getElementById('pub-titulo').value = '';
    document.getElementById('pub-extracto').value = '';
    document.getElementById('editor-contenido').innerHTML = '';
    document.getElementById('pub-estado').value = 'borrador';
    document.getElementById('pub-categoria').value = 'general';
    document.getElementById('pub-img-preview').style.display = 'none';
    document.getElementById('pub-img-url').value = '';
    document.getElementById('pub-fecha').valueAsDate = new Date();
    document.getElementById('editor-panel-titulo').textContent = 'Nueva publicación';
  }

  window.editarPublicacion = function(id) {
    const p = publicaciones.find(x => x.id == id);
    if (!p) return;
    document.getElementById('pub-edit-id').value = id;
    document.getElementById('pub-titulo').value = p.titulo || '';
    document.getElementById('pub-extracto').value = p.extracto || '';
    document.getElementById('editor-contenido').innerHTML = p.contenido || '';
    document.getElementById('pub-estado').value = p.estado || 'borrador';
    document.getElementById('pub-categoria').value = p.categoria || 'general';
    document.getElementById('pub-fecha').value = p.fecha || '';
    if (p.imagen) {
      const prev = document.getElementById('pub-img-preview');
      prev.src = p.imagen; prev.style.display = 'block';
    }
    document.getElementById('pub-img-url').value = p.imagen || '';
    document.getElementById('editor-panel-titulo').textContent = 'Editar publicación';
    irPanel('nueva-publicacion');
  };

  window.guardarPublicacion = async function() {
    const titulo = document.getElementById('pub-titulo').value.trim();
    if (!titulo) { toast('El título es obligatorio', 'error'); return; }
    const id = document.getElementById('pub-edit-id').value;
    let imgUrl = document.getElementById('pub-img-url').value;
    const imgInput = document.getElementById('pub-img-input');
    if (imgInput.files[0]) {
      const form = new FormData(); form.append('file', imgInput.files[0]);
      const r = await fetch('/api/upload', { method: 'POST', body: form });
      const d = await r.json().catch(() => ({}));
      if (r.ok) imgUrl = d.url; else { toast('Error al subir la imagen', 'error'); return; }
    }
    const payload = {
      titulo, extracto: document.getElementById('pub-extracto').value,
      contenido: document.getElementById('editor-contenido').innerHTML,
      estado: document.getElementById('pub-estado').value,
      categoria: document.getElementById('pub-categoria').value,
      fecha: document.getElementById('pub-fecha').value,
      imagen: imgUrl
    };
    const url = id ? `/api/publicaciones/${id}` : '/api/publicaciones';
    const method = id ? 'PUT' : 'POST';
    const r = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const d = await r.json().catch(() => ({}));
    if (r.ok) {
      toast(id ? 'Publicación actualizada' : 'Publicación creada');
      await cargarPublicaciones();
      limpiarEditor();
      irPanel('publicaciones');
    } else toast(d.error || 'Error al guardar', 'error');
  };

  window.eliminarPublicacion = async function(id) {
    if (!confirm('¿Eliminar esta publicación? Esta acción no se puede deshacer.')) return;
    const r = await fetch(`/api/publicaciones/${id}`, { method: 'DELETE' });
    if (r.ok) { toast('Publicación eliminada'); await cargarPublicaciones(); }
    else toast('Error al eliminar', 'error');
  };

  /* Editor de contenido */
  window.fmt = cmd => document.execCommand(cmd, false, null);
  window.insertarParrafo = () => document.execCommand('insertParagraph', false, null);
  window.insertarEnlace = () => {
    const url = prompt('URL del enlace:');
    if (url) document.execCommand('createLink', false, url);
  };

  window.previsualizarPubImg = function(input) {
    if (!input.files[0]) return;
    const reader = new FileReader();
    reader.onload = e => {
      const prev = document.getElementById('pub-img-preview');
      prev.src = e.target.result; prev.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
  };

  /* ============================================================
     GALERÍA
  ============================================================ */
  async function cargarGaleria() {
    try {
      const r = await fetch('/api/galeria', { cache: 'no-store' });
      if (r.ok) galeriaItems = (await r.json()).items || [];
      else galeriaItems = [];
    } catch { galeriaItems = []; }
    document.getElementById('stat-img').textContent = galeriaItems.length;
    renderizarGaleria();
  }

  function renderizarGaleria() {
    const grid = document.getElementById('galeria-grid');
    if (!galeriaItems.length) {
      grid.innerHTML = `<div class="estado-vacio" style="grid-column:1/-1"><div class="estado-vacio-icono">&#128247;</div><p>No hay imágenes aún.<br>Sube la primera usando el área de arriba.</p></div>`;
      return;
    }
    grid.innerHTML = galeriaItems.map(img => `
      <div class="media-item">
        <img src="${esc(img.url)}" alt="${esc(img.nombre || '')}">
        <div class="media-item-info"><div class="media-item-name">${esc(img.nombre || 'imagen')}</div></div>
        <div class="media-item-overlay">
          <button class="btn btn-gris btn-icono" onclick="copiarUrl('${esc(img.url)}')">Copiar URL</button>
          <button class="btn btn-rojo btn-icono" onclick="eliminarGaleria('${esc(img.id)}')">Eliminar</button>
        </div>
      </div>`).join('');
  }

  window.subirGaleria = async function(input) {
    if (!input.files.length) return;
    const prog = document.getElementById('galeria-progreso');
    prog.classList.remove('hidden');
    let subidos = 0;
    for (const file of Array.from(input.files)) {
      prog.innerHTML = `<div class="loading-spinner">Subiendo ${file.name}...</div>`;
      const form = new FormData(); form.append('file', file);
      const r = await fetch('/api/upload', { method: 'POST', body: form });
      const d = await r.json().catch(() => ({}));
      if (r.ok) {
        await fetch('/api/galeria', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url: d.url, nombre: file.name }) });
        subidos++;
      }
    }
    prog.innerHTML = `<div class="alert-inline ok">&#10003; ${subidos} imagen(es) subida(s) correctamente</div>`;
    await cargarGaleria();
    setTimeout(() => prog.classList.add('hidden'), 3000);
  };

  window.copiarUrl = function(url) {
    navigator.clipboard.writeText(url).then(() => toast('URL copiada'));
  };

  window.eliminarGaleria = async function(id) {
    if (!confirm('¿Eliminar esta imagen de la galería?')) return;
    const r = await fetch(`/api/galeria/${id}`, { method: 'DELETE' });
    if (r.ok) { toast('Imagen eliminada'); await cargarGaleria(); }
    else toast('Error al eliminar', 'error');
  };

  /* ============================================================
     CMS — CONTENIDO POR GRUPO
  ============================================================ */
  const GRUPOS_CMS = {
    inicio:     { label: 'Inicio',          prefijo: 'inicio.' },
    mision:     { label: 'Misión',          prefijo: 'mision.' },
    vision:     { label: 'Visión',          prefijo: 'vision.' },
    quienes:    { label: 'Quiénes somos',   prefijo: 'quienes.' },
    donaciones: { label: 'Donaciones',      prefijo: 'donaciones.' },
    contacto:   { label: 'Contacto',        prefijo: 'contacto.' },
    redes:      { label: 'Redes sociales',  prefijo: 'redes.' },
    imagenes:   { label: 'Imágenes',        prefijo: '' }
  };

  function renderizarCMS() {
    Object.keys(GRUPOS_CMS).forEach(id => {
      const cfg = GRUPOS_CMS[id];
      const cont = document.getElementById('cms-' + id);
      if (!cont) return;
      const items = cmsData.filter(i => cfg.prefijo ? i.clave.startsWith(cfg.prefijo) : i.tipo === 'imagen');
      if (!items.length) { cont.innerHTML = `<div class="alert-inline info">No hay campos configurados para esta sección.</div>`; return; }
      cont.innerHTML = `<div class="fields-grid">${items.map(item => renderCampo(item)).join('')}</div>
        <div style="margin-top:1.2rem"><button class="btn btn-verde btn-grande" onclick="guardarGrupo('${id}')">Guardar todos los cambios</button></div>`;
    });
  }

  function renderCampo(item) {
    const esImagen = item.tipo === 'imagen';
    const esUrl = item.tipo === 'url';
    const esLargo = !esImagen && !esUrl && (item.valor || '').length > 120;
    return `<div class="field-item" id="field-${esc(item.clave)}">
      <div class="field-item-label">${esc(item.etiqueta)}</div>
      <div class="field-item-key">${esc(item.clave)}</div>
      ${esImagen ? `
        <div class="image-field-wrap">
          <img class="image-field-preview" src="${esc(item.valor || 'img/logo.png')}" id="prev-${esc(item.clave)}" alt="">
          <div>
            <label class="btn btn-gris" style="cursor:pointer">
              Cambiar imagen
              <input type="file" accept="image/*" style="display:none" onchange="subirImagenCMS(this,'${esc(item.clave)}')">
            </label>
          </div>
        </div>` :
        esUrl ? `<input class="campo input" type="url" id="val-${esc(item.clave)}" value="${esc(item.valor)}" placeholder="https://">` :
        esLargo ? `<textarea style="width:100%;border:1.5px solid var(--borde);border-radius:9px;padding:.65rem .9rem;font-size:.9rem;resize:vertical;min-height:90px;outline:none;background:#F9FAFB" id="val-${esc(item.clave)}">${esc(item.valor)}</textarea>` :
        `<input style="width:100%;border:1.5px solid var(--borde);border-radius:9px;padding:.65rem .9rem;font-size:.9rem;outline:none;background:#F9FAFB" type="text" id="val-${esc(item.clave)}" value="${esc(item.valor)}">`
      }
      ${!esImagen ? `<div class="field-item-actions">
        <button class="btn btn-verde" onclick="guardarCampoIndividual('${esc(item.clave)}','${esc(item.etiqueta)}','${esc(item.tipo)}','${esc(item.grupo)}')">Guardar</button>
        <button class="btn btn-rojo" onclick="limpiarCampo('${esc(item.clave)}')">Limpiar</button>
      </div>` : ''}
    </div>`;
  }

  window.guardarCampoIndividual = async function(clave, etiqueta, tipo, grupo) {
    const input = document.getElementById('val-' + clave);
    if (!input) return;
    const valor = input.value;
    const r = await fetch('/api/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ clave, valor, tipo, etiqueta, grupo }] })
    });
    if (r.ok) { toast('Guardado'); const item = cmsData.find(i => i.clave === clave); if (item) item.valor = valor; }
    else toast('Error al guardar', 'error');
  };

  window.guardarGrupo = async function(grupoId) {
    const cfg = GRUPOS_CMS[grupoId];
    const items = cmsData.filter(i => cfg.prefijo ? i.clave.startsWith(cfg.prefijo) : i.tipo === 'imagen');
    const cambios = items.filter(i => i.tipo !== 'imagen').map(i => {
      const input = document.getElementById('val-' + i.clave);
      return input ? { clave: i.clave, valor: input.value, tipo: i.tipo, etiqueta: i.etiqueta, grupo: i.grupo } : null;
    }).filter(Boolean);
    if (!cambios.length) { toast('No hay cambios de texto para guardar'); return; }
    const r = await fetch('/api/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items: cambios }) });
    if (r.ok) toast('Todos los cambios guardados');
    else toast('Error al guardar', 'error');
  };

  window.limpiarCampo = async function(clave) {
    if (!confirm('¿Limpiar el contenido de este campo?')) return;
    const r = await fetch('/api/content', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ clave }) });
    if (r.ok) {
      const input = document.getElementById('val-' + clave);
      if (input) input.value = '';
      toast('Campo limpiado');
    } else toast('Error', 'error');
  };

  window.subirImagenCMS = async function(input, clave) {
    if (!input.files[0]) return;
    const form = new FormData(); form.append('file', input.files[0]);
    const r = await fetch('/api/upload', { method: 'POST', body: form });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) { toast(d.error || 'Error al subir', 'error'); return; }
    const item = cmsData.find(i => i.clave === clave);
    const save = await fetch('/api/content', {
      method: 'PUT', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: [{ clave, valor: d.url, tipo: 'imagen', etiqueta: item?.etiqueta || clave, grupo: item?.grupo || 'Imágenes' }] })
    });
    if (save.ok) {
      const prev = document.getElementById('prev-' + clave);
      if (prev) prev.src = d.url;
      if (item) item.valor = d.url;
      toast('Imagen actualizada');
    } else toast('Imagen subida pero no guardada', 'error');
  };

  /* ============================================================
     TOAST
  ============================================================ */
  window.toast = function(msg, tipo = 'ok') {
    const t = document.getElementById('toast');
    t.textContent = (tipo === 'ok' ? '✓ ' : '✕ ') + msg;
    t.className = 'show ' + tipo;
    setTimeout(() => t.className = '', 3500);
  };

})();
