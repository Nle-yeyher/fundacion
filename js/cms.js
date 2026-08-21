(function () {
  async function cargarContenido() {
    try {
      const respuesta = await fetch('/api/content', { cache: 'no-store' });
      if (!respuesta.ok) return;
      const contenido = await respuesta.json();
      document.querySelectorAll('[data-content]').forEach((elemento) => {
        const clave = elemento.dataset.content;
        if (Object.prototype.hasOwnProperty.call(contenido, clave)) elemento.textContent = contenido[clave];
      });
      document.querySelectorAll('[data-image]').forEach((elemento) => {
        const clave = elemento.dataset.image;
        if (contenido[clave]) elemento.src = contenido[clave];
      });
      document.querySelectorAll('[data-link]').forEach((elemento) => {
        const clave = elemento.dataset.link;
        if (contenido[clave]) elemento.href = contenido[clave];
      });
    } catch (error) {
      console.warn('No se pudo cargar el contenido administrable.', error);
    }
  }
  cargarContenido();
})();
