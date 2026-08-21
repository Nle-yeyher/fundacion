-- Ejecuta primero la estructura de schema.sql y luego este archivo.
INSERT INTO contenido (clave, valor, tipo, etiqueta, grupo, activo) VALUES
('mision.titulo', 'Impulsamos el desarrollo del Chocó', 'texto', 'Título', 'Misión', 1),
('mision.parrafo1', 'Nuestra misión es impulsar el desarrollo del departamento del Chocó mediante la ejecución de programas y proyectos en los ámbitos de la educación, la cultura, el deporte, el emprendimiento empresarial y la protección del medio ambiente.', 'texto', 'Texto principal 1', 'Misión', 1),
('mision.parrafo2', 'Trabajamos de manera articulada con comunidades, instituciones y organizaciones del territorio para construir un Chocó más equitativo, próspero y sostenible para todas las generaciones.', 'texto', 'Texto principal 2', 'Misión', 1),
('mision.card.titulo', 'Compromiso comunitario', 'texto', 'Título compromiso', 'Misión', 1),
('mision.card.texto', 'Todo lo que hacemos nace desde las comunidades y vuelve a ellas. Creemos que el verdadero cambio ocurre cuando las personas son protagonistas de su propio desarrollo y tienen las herramientas para lograrlo.', 'texto', 'Texto compromiso', 'Misión', 1),
('inicio.titulo', 'Jeedd Chocó trabaja por un futuro más justo', 'texto', 'Título principal', 'Inicio', 1),
('inicio.subtitulo', 'Educación, cultura, deporte, emprendimiento y medio ambiente', 'texto', 'Subtítulo', 'Inicio', 1),
('inicio.descripcion', 'Somos una fundación comprometida con el desarrollo integral del Chocó. Aquí puedes conocer nuestra misión, visión y cómo apoyar a la comunidad desde diferentes frentes.', 'texto', 'Descripción', 'Inicio', 1),
('inicio.que_titulo', 'Fortalecimiento Comunitario', 'texto', 'Título Qué hacemos', 'Inicio', 1),
('inicio.que_educacion', 'Ofrecemos formación en emprendimiento, habilidades técnicas, valores y conciencia ambiental, inspirando a las nuevas generaciones a valorar la educación como clave para su desarrollo.', 'texto', 'Educación', 'Inicio', 1),
('inicio.que_cultura', 'Potenciamos los talentos y habilidades de niños y jóvenes, ofreciendo espacios artísticos y deportivos que fomentan la creatividad, reducen problemas sociales y fortalecen la comunidad.', 'texto', 'Cultura y deporte', 'Inicio', 1),
('inicio.que_comunidad', 'Diseñamos e implementamos proyectos que desarrollan capacidades locales, generando tejido social sólido y redes de apoyo que permiten a las comunidades superar sus propios retos.', 'texto', 'Fortalecimiento comunitario', 'Inicio', 1),
('inicio.que_ambiente', 'Abogamos por la conservación de los recursos naturales, protegemos las cuencas hídricas y promovemos el ecoturismo para impulsar la economía garantizando un desarrollo sostenible.', 'texto', 'Protección ambiental', 'Inicio', 1),
('inicio.que_emprendimiento', 'Apoyamos la creación de microempresas que utilicen materiales autóctonos y productos regionales, contribuyendo a la reducción de la pobreza y al crecimiento económico del Chocó.', 'texto', 'Emprendimiento', 'Inicio', 1),
('donaciones.titulo', 'Tu donación transforma vidas', 'texto', 'Título', 'Donaciones', 1),
('donaciones.descripcion', 'Cada aporte, grande o pequeño, nos ayuda a continuar programas de educación, cultura, deporte, emprendimiento y conservación ambiental en el Chocó.', 'texto', 'Descripción', 'Donaciones', 1),
('donaciones.banco.titular', 'Fundación Jeedd Chocó', 'texto', 'Titular bancario', 'Donaciones', 1),
('donaciones.banco.numero', '000 000 000 00', 'texto', 'Cuenta Bancolombia', 'Donaciones', 1),
('donaciones.banco.nit', '000.000.000-0', 'texto', 'NIT Bancolombia', 'Donaciones', 1),
('donaciones.daviplata.numero', '+57 300 000 0000', 'texto', 'Daviplata', 'Donaciones', 1),
('donaciones.agradecimiento', '¡Gracias por tu apoyo! Después de realizar tu donación, envíanos el comprobante a nuestro correo fundacionjeeddchoco9013@gmail.com o por WhatsApp. Tu contribución es un paso real hacia un Chocó más fuerte.', 'texto', 'Mensaje de agradecimiento', 'Donaciones', 1),
('contacto.titulo', 'Sugerencias y opiniones', 'texto', 'Título', 'Contacto', 1),
('contacto.descripcion', 'Tu voz importa. Comparte tus ideas, preguntas o comentarios para mejorar nuestra labor social en el Chocó.', 'texto', 'Descripción', 'Contacto', 1),
('contacto.ubicacion', 'Condoto, Chocó, Colombia', 'texto', 'Ubicación', 'Contacto', 1),
('contacto.correo', 'fundacionjeeddchoco9013@gmail.com', 'texto', 'Correo', 'Contacto', 1),
('contacto.whatsapp', '+57 312 802 3522', 'texto', 'WhatsApp', 'Contacto', 1),
('vision.titulo', 'Un Chocó próspero y sostenible', 'texto', 'Título', 'Visión', 1),
('vision.parrafo', 'Ser reconocidos en el año 2030 como la fundación líder en el desarrollo social, cultural y ambiental del departamento del Chocó, generando impacto positivo y sostenible en las comunidades del territorio.', 'texto', 'Descripción', 'Visión', 1),
('vision.educacion', 'Jóvenes formados con acceso real a oportunidades educativas.', 'texto', 'Educación', 'Visión', 1),
('vision.ambiente', 'Ecosistemas conservados para las generaciones futuras.', 'texto', 'Medio ambiente', 'Visión', 1),
('vision.emprendimiento', 'Empresas chocoanas fuertes que generan empleo digno.', 'texto', 'Emprendimiento', 'Visión', 1),
('vision.cultura', 'El patrimonio afrochocoano valorado y preservado.', 'texto', 'Identidad cultural', 'Visión', 1),
('quienes.titulo', 'Al servicio del pueblo chocoano', 'texto', 'Título', 'Quiénes somos', 1),
('quienes.parrafo1', 'La Fundación Jeedd Chocó nació del amor profundo por el Chocó y el compromiso con sus comunidades. Somos un equipo de personas que cree que este territorio tiene todo el potencial para brillar.', 'texto', 'Texto 1', 'Quiénes somos', 1),
('quienes.parrafo2', 'Trabajamos articulados con comunidades, organizaciones locales e instituciones para crear programas que generen impacto real y duradero en la vida cotidiana de las personas.', 'texto', 'Texto 2', 'Quiénes somos', 1),
('quienes.parrafo3', 'Nos guían los valores de equidad, participación comunitaria y respeto por la identidad chocoana , una de las más ricas y diversas de Colombia.', 'texto', 'Texto 3', 'Quiénes somos', 1),
('quienes.valor1', 'Desarrollo sostenible', 'texto', 'Valor 1', 'Quiénes somos', 1),
('quienes.valor2', 'Sin ánimo de lucro', 'texto', 'Valor 2', 'Quiénes somos', 1),
('quienes.valor3', 'Raíces comunitarias', 'texto', 'Valor 3', 'Quiénes somos', 1),
('quienes.valor4', 'Identidad chocoana', 'texto', 'Valor 4', 'Quiénes somos', 1)
ON DUPLICATE KEY UPDATE valor=VALUES(valor), etiqueta=VALUES(etiqueta), grupo=VALUES(grupo), activo=1;

INSERT INTO contenido (clave, valor, tipo, etiqueta, grupo, activo) VALUES
('redes.instagram', 'https://www.instagram.com/fundacion_jeeddchoco/', 'url', 'redes.instagram', 'Redes sociales', 1),
('redes.facebook', 'https://www.facebook.com/profile.php?id=100067883673774', 'url', 'redes.facebook', 'Redes sociales', 1),
('redes.youtube', 'https://www.youtube.com/@fundacionjeeddchoco9983', 'url', 'redes.youtube', 'Redes sociales', 1),
('redes.x', 'https://x.com/FundacionJeedd', 'url', 'redes.x', 'Redes sociales', 1),
('redes.tiktok', 'https://www.tiktok.com/@fundacionjeeddchoco', 'url', 'redes.tiktok', 'Redes sociales', 1),
('redes.whatsapp', 'https://wa.me/573128023522', 'url', 'redes.whatsapp', 'Redes sociales', 1)
ON DUPLICATE KEY UPDATE valor=VALUES(valor), etiqueta=VALUES(etiqueta), grupo=VALUES(grupo), activo=1;
INSERT INTO contenido (clave, valor, tipo, etiqueta, grupo, activo) VALUES
('branding.logo', 'img/logo.jpg', 'imagen', 'Logo de la fundación', 'Imágenes', 1),
('inicio.imagen_principal', 'img/logo.png', 'imagen', 'Imagen principal', 'Imágenes', 1)
ON DUPLICATE KEY UPDATE valor=VALUES(valor), etiqueta=VALUES(etiqueta), grupo=VALUES(grupo), activo=1;
