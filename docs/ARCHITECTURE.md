# Arquitectura del Sistema - Portafolio Pablo Valdés

## 1. Visión General
El proyecto es el portafolio web profesional de desarrollo de software y fact sheet técnico de Pablo Valdés, diseñado para operar bajo los principios de **Zero-Backend** (cero dependencias de servidor) y **Static Site Generation (SSG)**. 
Su propósito es ofrecer máxima velocidad, seguridad intrínseca y cero costos de mantenimiento de infraestructura (Hosteado en entornos Edge como Cloudflare Pages).

## 2. Decisiones Tecnológicas (Stack)

### 2.1 Framework Core: Astro
- **Motivación**: Se requiere un sitio de rendimiento extremo sin sobrecarga de JavaScript en el lado del cliente (Island Architecture).
- **Rol**: Compilación de HTML estático, manejo de colecciones de contenido (Markdown) y enrutamiento basado en archivos.

### 2.2 Estilos: Tailwind CSS
- **Motivación**: Desarrollo ágil con utilidad-first, garantizando consistencia a través de tokens de diseño configurados centralmente en `tailwind.config.mjs` y variables CSS en `Layout.astro`.

### 2.3 Animaciones: GSAP y CSS Nativo
- **Motivación**: Crear un aspecto "Cyber" premium e interacciones dinámicas. GSAP se utiliza puntualmente en el carrusel de servicios, mientras que el resto emplea CSS y `IntersectionObserver`.

### 2.4 Gestión de Contenido: Markdown + Astro Content Collections
- **Motivación**: Separar los datos de la presentación. Los "Casos de Estudio" residen en `src/content/casos-estudio/` garantizando un pipeline tipo Git-CMS, fácilmente auditable y sin base de datos.

## 3. Modelo de Seguridad y Privacidad de Datos

El diseño arquitectónico del proyecto responde estrictamente a la **Ley 21.719 de Protección de Datos Personales (Chile)** (y sus equivalentes internacionales), así como a las mejores prácticas de **ISO 27001** y **COBIT** respecto al tratamiento de información.

### 3.1 Ausencia de Almacenamiento (Zero-Data Storage)
- No existen bases de datos conectadas a la aplicación.
- No hay funciones Serverless ni workers que intercepten datos de usuario en tránsito hacia almacenes propietarios.

### 3.2 Formulario de Contacto Frontend-Only
El formulario de contacto (`/sobre-mi#contact`) no hace peticiones HTTP POST a servidores intermedios.
- **Flujo**: Utiliza Vanilla JavaScript para recolectar el estado del formulario y genera un link nativo `mailto:`, delegando la gestión de cifrado, transmisión y seguridad de los datos al cliente de correo electrónico (Gmail, Outlook) del usuario final.

## 4. Topología de Despliegue (Deployment)
- **Proveedor**: Cloudflare Pages.
- **Mecanismo**: Integración continua vía GitHub. Cada push a `main` dispara el pipeline de `npm run build`.
- **Artefactos**: El directorio `dist/` resultante es un compendio de HTML, CSS y assets minificados que se distribuyen globalmente mediante la CDN (Content Delivery Network).
