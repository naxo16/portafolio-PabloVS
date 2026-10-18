# GEMINI.md — Directrices Técnicas, SDLC y Estándares de Ingeniería

> **Documento de Referencia Obligatoria para Sesiones de IA con Pablo Valdés**  
> Este archivo define los principios, estándares de arquitectura, paradigmas de ingeniería de software y el Ciclo de Vida del Desarrollo (SDLC) que deben aplicarse rigurosamente en cada sesión de trabajo.

---

## 1. Identidad, Posicionamiento y Filosofía

- **Desarrollador:** Pablo Valdés Sandoval.
- **Posicionamiento:** Backend Developer Junior (Python, FastAPI, PostgreSQL) y Analista Programador con perfil integral End-to-End (Docker, CI/CD, despliegue Linux).
- **Filosofía de Trabajo:** *"No vendo humo"*. 
  - Enfoque analítico y pragmático: comprender la restricción y el modelo de negocio antes de emitir una sola línea de código.
  - Cero venta de servicios o consultoría genérica; enfoque 100% en ingeniería de software, arquitectura limpia y contratación formal.
  - Tono técnico, sobrio, formal, individual (primera persona singular, jamás plurales de agencia comercial como "nosotros").

---

## 2. Paradigmas de Ingeniería de Software Aplicados

### A. Clean Architecture & Separación de Responsabilidades
- **Dominio Aislado:** La lógica de negocio no depende de frameworks ni librerías de infraestructura.
- **Validación en Frontera:** Los datos entrantes se validan estrictamente en la capa de entrada (Pydantic v2 en Python, Zod/TypeScript estricto en frontend) antes de ingresar al núcleo de la aplicación.
- **Inversión de Dependencias (DIP):** Los módulos de alto nivel no dependen de módulos de bajo nivel; ambos dependen de abstracciones.

### B. Principios SOLID & Código Limpio
- **Single Responsibility (SRP):** Cada clase, función o componente Astro/React/Flutter tiene un único motivo para cambiar.
- **Open/Closed (OCP):** Entidades abiertas a extensión pero cerradas a modificación directa de su contrato.
- **DRY, KISS y YAGNI:** Cero abstracciones prematuras; código directo, legible y libre de duplicidades redundantes.
- **Boy Scout Rule:** Siempre dejar el código más limpio, probado y ordenado de lo que se encontró.

### C. Programación Defensiva (Defensive Programming)
- Verificación de tipos estricta (TypeScript sin `any`, tipado completo en Python con `mypy` strict).
- Manejo explícito de casos borde: valores `null`, `undefined`, cadenas vacías, desbordes de contenedor, errores de red y políticas restrictivas del navegador (e.g., autoplay de audio/video bloqueado sin interacción de usuario).
- **Aislamiento de Desbordamiento:** Uso mandatorio de contención CSS (`contain: layout inline-size`, `overflow-x: clip`, `overscroll-behavior-x: contain`) para prevenir que scrollbars secundarios rompan la vista principal.

---

## 3. Ciclo de Vida del Desarrollo de Software (SDLC)

Toda tarea o refactorización debe ejecutarse siguiendo este flujo de 6 fases:

```
[1. Diagnóstico y Análisis de Restricciones]
                     ↓
[2. Diseño de Arquitectura y Modelo de Datos]
                     ↓
[3. Implementación Limpia y Tipado Estricto]
                     ↓
[4. Testing Automatizado y Casos de Prueba (TDD)]
                     ↓
[5. Optimización, Build Estático y Verificación]
                     ↓
[6. Commit Semántico, Push y Registro en Contexto]
```

### Fase 1: Diagnóstico y Análisis de Restricciones
- Identificar la causa raíz (*root cause*) del problema o restricción de negocio.
- Prohibido aplicar parches superficiales sin comprender el origen del fallo (ej. si una miniatura causa scroll horizontal al hacer clic, corregir la llamada de scroll en el DOM y la contención CSS, no solo ocultar con `overflow: hidden`).
- Validar requerimientos de cumplimiento legal (Ley 19.628 / 21.719 en Chile) y estándares criptográficos (RFC 6238 TOTP, JWT en almacenamiento seguro).

### Fase 2: Diseño de Arquitectura y Modelo de Datos
- **Frontend Web:** Astro SSG 100% estático, Zero-Backend, optimizado para Core Web Vitals (95-100 en Lighthouse) y alojado en Cloudflare Pages.
- **Canvas Rendering:** Aceleración por hardware vía WebGL/PixiJS v8 con degradación elegante (*graceful fallback*) a Canvas 2D nativo, escalado por DPI (`devicePixelRatio`), cálculo matemático de letterboxing y marco HUD.
- **Backend (Proyectos Referenciados):** FastAPI asíncrono, PostgreSQL normalizado en Tercera Forma Normal (3FN), Docker multistage y CI/CD en GitHub Actions.

### Fase 3: Implementación y Reglas de Código
- **Estándares CSS:**
  - Nomenclatura semántica con clases BEM para contenedores con estados especiales (ej. `.container--fixed`, `.thumbnails-container--fixed`).
  - Prevenir Cumulative Layout Shift (CLS): definir alturas mínimas o ratios fijos (`min-h-[220px]`, `aspect-video`) en componentes dinámicos como tarjetas de detalles o visualizadores multimedia.
  - Cero llamadas a `element.scrollIntoView()` en carruseles horizontales que puedan desplazar el viewport general de la ventana; emplear `parentContainer.scrollTo({ left, behavior: 'smooth' })`.
- **Estándares JavaScript / TypeScript:**
  - Código modular y funciones puras para matemáticas de renderizado (`calculateFitDimensions`, `formatTime`, `getActiveNarrationCue`).
  - Limpieza de listeners y observadores en eventos de ciclo de vida (`astro:before-swap`).

### Fase 4: Testing Riguroso (No Saltarse el Testing)
Antes de dar cualquier funcionalidad por concluida, se deben ejecutar y aprobar todas las suites de prueba:
1. **Tests de Integridad de Assets (`tests/assets.test.mjs`):**
   - Comprobar existencia física en disco y peso no nulo de todas las imágenes y audios.
   - Verificar con FFmpeg que las grabaciones de video para web tengan la pista de audio 100% removida (`-an`).
   - Comprobar que no queden archivos temporales o con nombres no estandarizados.
2. **Tests de Lógica de Negocio y Matemáticas (`tests/canvasRenderer.test.mjs`):**
   - Validación de unicidad de IDs en datasets.
   - Pruebas unitarias de cálculo de centrado y letterboxing ante resoluciones arbitrarias o extremas (resiliencia a ceros o negativos).
   - Pruebas de secuencia temporal y lookup de marcas de narración e interlocución.
3. **Tests de Integración y Markup (`tests/integration.test.mjs`):**
   - Comprobar que la salida estática en `dist/` contenga todos los elementos críticos del DOM (canvas, badges, overlays, botones de control, modal pop-up, etc.).
- **Ejecución obligatoria:** `npm test` usando el test runner nativo de Node 24 (`node --experimental-strip-types --test`).

### Fase 5: Optimización Multimedia y Build Estático
- **Video:** H.264 optimizado, pista de audio removida y átomo `moov` al inicio (`-movflags +faststart`) para evitar demoras en streaming web.
- **Audio:** Síntesis neuronal de alta fidelidad (`edge-tts` con español chileno `es-CL-LorenzoNeural`), bitrate comprimido (48-64 kbps) para carga instantánea.
- **Autoplay Compliance:** Videos en reproducción automática deben iniciar silenciados (`muted playsinline loop`); la activación de pistas sonoras o voz IA debe requerir gesto explícito del usuario (`click`).
- **Verificación de Compilación:** Ejecutar obligatoriamente `npm run build` y certificar que todas las rutas se generen sin advertencias ni errores.

### Fase 6: Git y Control de Versiones con Buenas Prácticas
- **Conventional Commits:**
  - `feat(...)`: Nueva funcionalidad o componente (ej. `feat(fiscalis): add AI voice narration guide MVP and synced subtitle HUD`).
  - `fix(...)`: Corrección de bug o fallo de UI/UX (ej. `fix(fiscalis): isolate thumbnail scroll and enforce container--fixed layout`).
  - `refactor(...)`: Mejora de código sin cambiar comportamiento externo.
  - `test(...)`: Incorporación o ajuste de pruebas automatizadas.
  - `docs(...)`: Actualización de documentación de contexto o README.
- **Sincronización:** Confirmar estado limpio con `git status`, commitear con descripción estructurada y subir cambios a la rama principal (`git push origin main`).

---

## 4. Estándares Visuales y de Diseño (UI/UX)

- **Estética:** Cyber minimalista oscuro, sobrio, enfocado en ingeniería.
- **Paleta Semántica:**
  - Fondo: Superficies oscuras profundas (`#07090e`, `#0b101b`, `surface-container-low`).
  - Acentos: Cian y cielo tecnológico (`primary`: `#89ceff`, `cyan-400`, `sky-300`) con toques de esmeralda (`#10b981`) para confirmaciones de estado exitoso.
  - Bordes: Sutiles con transparencia (`border-primary/20`, `border-outline-variant/30`).
- **Tipografías:**
  - Títulos y encabezados: `Geist`, `font-display`, semibold / extrabold.
  - Cuerpo de texto: `Inter`, `font-body`, alta legibilidad.
  - Etiquetas técnicas, métricas y código: `JetBrains Mono`, `font-code-sm`.
- **Efectos:**
  - Tarjetas con desenfoque de fondo (*backdrop blur*): `.glass-card`.
  - Resplandores difusos (*ambient glow*) y confeti sutil para micro-celebraciones de logros técnicos (`canvas-confetti`).

---

## 5. Mantenimiento del Contexto del Proyecto

- **Archivo Central:** [`CONTEXTO_PROYECTO.md`](file:///C:/Users/Seiketsu_Yamigiri/Downloads/stitch_professional_ti_services_hub/renkaidev-web/CONTEXTO_PROYECTO.md).
- **Regla Inmutable:** Cada vez que se implemente una nueva característica, se corrija un bug relevante o se tome una decisión arquitectónica, el historial de decisiones técnicas en `CONTEXTO_PROYECTO.md` debe actualizarse inmediatamente.
- **Consistencia:** Mantener sincronizada la documentación con el código en producción para permitir que cualquier sesión de IA futura continúe el trabajo con máxima agilidad, precisión y sin fricción.
