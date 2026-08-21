(function () {
  const loginView = document.getElementById('login-view');
  const adminView = document.getElementById('admin-view');
  const groupsEl = document.getElementById('groups');
  const loginForm = document.getElementById('login-form');
  const loginError = document.getElementById('login-error');
  const saveStatus = document.getElementById('save-status');
  const state = new Map();

      // ✅ REEMPLÁZALO POR ESTA LÍNEA CORREGIDA (usando comillas dobles en el objeto):
    const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));


  async function comprobarSesion() {
    try {
      const r = await fetch('/api/content?admin=1', { cache: 'no-store' });
      if (r.ok) { mostrarAdmin(await r.json()); }
      else mostrarLogin();
    } catch { mostrarLogin(); }
  }

  function mostrarLogin() { loginView.classList.remove('hidden'); adminView.classList.add('hidden'); }
  function mostrarAdmin(data) { loginView.classList.add('hidden'); adminView.classList.remove('hidden'); renderizar(data.items || []); }

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); loginError.classList.add('hidden');
    const r = await fetch('/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({usuario:document.getElementById('usuario').value, password:document.getElementById('password').value}) });
    const data = await r.json().catch(()=>({}));
    if (!r.ok) { loginError.textContent=data.error||'No se pudo iniciar sesión.'; loginError.classList.remove('hidden'); return; }
    await comprobarSesion();
  });

  document.getElementById('logout').addEventListener('click', async () => { await fetch('/api/logout',{method:'POST'}); location.reload(); });

  function renderizar(items) {
    state.clear(); items.forEach(i=>state.set(i.clave,{...i}));
    const grouped={}; items.forEach(i=>(grouped[i.grupo] ||= []).push(i));
    groupsEl.innerHTML='';
    Object.entries(grouped).forEach(([grupo, list])=>{
      const section=document.createElement('section'); section.className='group';
      section.innerHTML=`<div class="group-head"><h2>${esc(grupo)}</h2><span class="group-count">${list.length} campos</span></div><div class="fields"></div>`;
      const fields=section.querySelector('.fields');
      list.forEach(item=>fields.appendChild(crearCampo(item)));
      groupsEl.appendChild(section);
    });
  }

  function crearCampo(item) {
    const wrap=document.createElement('div'); wrap.className='field' + (item.tipo==='texto' && (item.valor||'').length>180 ? ' full':'');
    const isUrl=item.tipo==='url'; const isImage=item.tipo==='imagen';
    wrap.innerHTML=`<div class="field-head"><div><div class="field-name">${esc(item.etiqueta)}</div><div class="field-key">${esc(item.clave)}</div></div></div>`;
    if(isImage){
      wrap.innerHTML += `<div class="upload-wrap"><img class="preview" src="${esc(item.valor || 'img/logo.png')}" alt="Vista previa"><input class="file-input" type="file" accept="image/*"><button class="btn primary mini upload-btn" type="button">Elegir imagen</button></div><input class="value-input" type="hidden" value="${esc(item.valor)}">`;
      wrap.querySelector('.file-input').addEventListener('change',()=>subirImagen(item,wrap));
      wrap.querySelector('.upload-btn').addEventListener('click',()=>wrap.querySelector('.file-input').click());
      const actions=document.createElement('div'); actions.className='field-actions';
      const del=document.createElement('button'); del.className='btn danger-outline mini'; del.textContent='Eliminar imagen';
      del.onclick=()=>eliminarCampo(item,wrap); actions.appendChild(del); wrap.appendChild(actions);
    } else if(isUrl){
      wrap.innerHTML += `<input class="value-input" type="url" value="${esc(item.valor)}" placeholder="https://...">`;
    } else if((item.valor||'').length>180){
      wrap.innerHTML += `<textarea class="value-input">${esc(item.valor)}</textarea>`;
    } else {
      wrap.innerHTML += `<input class="value-input" type="text" value="${esc(item.valor)}">`;
    }
    if(!isImage) {
      const actions=document.createElement('div'); actions.className='field-actions';
      const save=document.createElement('button'); save.className='btn primary mini'; save.textContent='Guardar';
      const del=document.createElement('button'); del.className='btn danger-outline mini'; del.textContent='Eliminar';
      save.onclick=()=>guardarCampo(item,wrap); del.onclick=()=>eliminarCampo(item,wrap);
      actions.append(save,del); wrap.appendChild(actions);
    }
    return wrap;
  }

  async function guardarCampo(item,wrap){
    const input=wrap.querySelector('.value-input'); const valor=input.value;
    const r=await fetch('/api/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[{clave:item.clave,valor,tipo:item.tipo,etiqueta:item.etiqueta,grupo:item.grupo}]})});
    const data=await r.json().catch(()=>({}));
    mostrarEstado(r.ok?'Cambios guardados correctamente.':(data.error||'No se pudo guardar.'),r.ok);
    if(r.ok) item.valor=valor;
  }

  async function eliminarCampo(item,wrap){
    if(!confirm(`¿Eliminar el contenido de “${item.etiqueta}”?`)) return;
    const r=await fetch('/api/content',{method:'DELETE',headers:{'Content-Type':'application/json'},body:JSON.stringify({clave:item.clave})});
    const data=await r.json().catch(()=>({}));
    if(r.ok){ wrap.querySelector('.value-input').value=''; item.valor=''; mostrarEstado('Contenido eliminado. Puedes volver a escribirlo cuando quieras.',true); }
    else mostrarEstado(data.error||'No se pudo eliminar.',false);
  }

  async function subirImagen(item,wrap){
    const input=wrap.querySelector('.file-input'); if(!input.files[0]) return alert('Selecciona una imagen primero.');
    const form=new FormData(); form.append('file',input.files[0]);
    const r=await fetch('/api/upload',{method:'POST',body:form}); const data=await r.json().catch(()=>({}));
    if(!r.ok) return mostrarEstado(data.error||'No se pudo subir la imagen.',false);
    wrap.querySelector('.preview').src=data.url; wrap.querySelector('.value-input').value=data.url;
    const save=await fetch('/api/content',{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[{clave:item.clave,valor:data.url,tipo:'imagen',etiqueta:item.etiqueta,grupo:item.grupo}]})});
    const result=await save.json().catch(()=>({}));
    mostrarEstado(save.ok?'Imagen subida y guardada correctamente.':(result.error||'Imagen subida, pero no se pudo guardar.'),save.ok);
    if(save.ok)item.valor=data.url;
  }

  function mostrarEstado(texto,ok){ saveStatus.textContent=texto; saveStatus.className='alert '+(ok?'success':'error'); window.scrollTo({top:0,behavior:'smooth'}); setTimeout(()=>saveStatus.classList.add('hidden'),4500); }
  comprobarSesion();
})();
