# AB Fitness · Arnau Badosa — Web

Rediseño de la web de [Arnau Badosa · AB Fitness](https://sites.google.com/view/ab-fitness-com/p%C3%A0gina-principal)
(entrenamiento híbrido, running y nutrición). Es una web estática de una sola página, en español, **sin dependencias
ni proceso de compilación**: HTML + CSS + un poco de JavaScript.

**Contenido real, no inventado.** Todos los textos de servicios, casos de éxito, biografía, contacto y enlaces
proceden de la web antigua de Google Sites. Lo único redactado de nuevo es el texto de apoyo (método y preguntas
frecuentes), construido a partir de lo que ya decía esa web y del formulario inicial.

## Estructura

```
index.html                 Página completa (secciones comentadas) + sprite de iconos
site.webmanifest           Metadatos para "añadir a pantalla de inicio"
assets/
  css/styles.css           Estilos (variables de marca al principio)
  js/main.js               Menú móvil, animaciones, filtro de casos, formulario → WhatsApp/email
  fonts/                   Barlow Condensed + Inter en woff2 (autoalojadas, licencia OFL incluida)
  img/                     Foto en varios tamaños (WebP), favicon, iconos e imagen para redes (og-image.jpg)
```

## Ver la web en local

```bash
python3 -m http.server 8000   # y abre http://localhost:8000
```

(También funciona abriendo `index.html` directamente en el navegador.)

## Qué editar

| Qué | Dónde |
| --- | --- |
| Teléfono / WhatsApp / email | `index.html` (busca `607` y `arnaubadosa@gmail.com`) y las dos constantes de arriba en `assets/js/main.js` |
| Formulario de inscripción (Google Forms) | `index.html` (busca `docs.google.com/forms`) |
| Formulario inicial (Typebot) | `index.html` (busca `typebot.co`) |
| Instagram / TikTok | `index.html` (busca `instagram.com` y `tiktok.com`) |
| Colores y tipografía | Variables `:root` al inicio de `assets/css/styles.css` (`--yellow`, `--ink`, `--paper`…) |
| Textos | Directamente en `index.html`; cada sección lleva un comentario con su nombre |

### Casos de éxito con fotos

La web antigua mostraba una foto en cada caso, pero no se pudo copiar (el entorno donde se construyó no tenía acceso a
Google Sites). Para añadirlas: guarda la imagen en `assets/img/casos/` y pega esto dentro del `<article class="case">`,
entre `.case__top` y `.case__body` (el estilo ya está en el CSS):

```html
<figure class="case__photo">
  <img src="assets/img/casos/media-maraton.webp" alt="Descripción de la foto" width="800" height="600" loading="lazy">
</figure>
```

Recomendado: WebP, ~800 px de ancho, y confirmar que cada persona ha autorizado que se publique su imagen.

## Publicar

Es contenido estático; sirve cualquier hosting:

- **GitHub Pages**: *Settings → Pages → Deploy from a branch* → rama principal, carpeta `/ (root)`.
- **Netlify / Cloudflare Pages / Vercel**: conecta el repositorio (sin comando de build; carpeta de publicación = raíz).

Cuando tengas el dominio definitivo:

1. En `index.html` (cabecera), pon URLs **absolutas** en `og:image` y añade `og:url` y `<link rel="canonical">`.
2. (Opcional) añade un `sitemap.xml` y `robots.txt`.

## Pendiente de decidir (no incluido)

- **Aviso legal y política de privacidad.** Para una web de actividad profesional en España conviene publicar el aviso
  legal (LSSI) con los datos del titular. La web no usa cookies ni servicios de terceros al cargar, y el formulario de
  contacto solo prepara un mensaje de WhatsApp/email (no guarda datos).
- **Cómo se entrena** (online / presencial / ubicación) y **tarifas**: la web antigua no lo indicaba, así que no se ha
  inventado. Si quieres mostrarlo, encaja bien en las tarjetas de *Servicios* o en la *FAQ*.
- Las secciones del menú de la web antigua (*Hábitos saludables, Nutrición, Entrenamientos rápidos, Mitos del fitness*)
  no tenían páginas publicadas, por lo que no se han migrado.

## Calidad

Lighthouse (local, sin compresión): Accesibilidad 100 · Buenas prácticas 100 · SEO 100 · Rendimiento 96 (móvil) / 100 (escritorio).
axe-core: 0 incidencias. Sin desbordes horizontales entre 320 y 1920 px. Respeta `prefers-reduced-motion`.

## Licencias de terceros

- Fuentes **Barlow Condensed** e **Inter** — SIL Open Font License 1.1 (`assets/fonts/LICENSE-*.txt`).
- Iconos de interfaz: **Lucide** (ISC). Logotipos de redes: **Simple Icons** (CC0).
