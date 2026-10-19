---
title: "Fiscalis"
description: "Reducción del tiempo de captura de inspecciones en más del 85 % y eliminación de errores de transcripción, mejorando la eficiencia operativa de la fiscalización municipal."
year: 2026
status: "MVP en Pruebas"
role: "Arquitectura Backend y Desarrollo End-to-End"
tags: ["FastAPI", "PostgreSQL (3FN)", "Python", "Flutter", "Docker", "MFA/TOTP", "CI/CD"]
---

## Problema Operativo
La fiscalización municipal y de seguridad pública sufría de una grave redundancia operativa y desincronización de datos. Los inspectores en terreno registraban la misma infracción múltiples veces a través de medios fragmentados: formularios impresos en papel, mensajes informales por WhatsApp, cuadernos físicos de bitácora y, finalmente, transcripción manual al sistema administrativo en oficina.

Este flujo analógico provocaba cuellos de botella severos, inconsistencias por caligrafía ilegible, disputas legales por imprecisión en las coordenadas del procedimiento y un retraso crítico de hasta 72 horas para consolidar las actas en el tribunal o juzgado de policía local.

## Análisis y Levantamiento
Mapeé el ciclo de vida del dato desde el momento de la detección del incidente en la vía pública hasta su persistencia formal:
1. **Punto de fricción primario:** Desconexión absoluta entre el inspector en terreno y la base de datos relacional.
2. **Fragilidad de la evidencia:** Fotografías dispersas en teléfonos personales sin metadatos inmutables ni trazabilidad de cadena de custodia.
3. **Pérdida de tiempo administrativo:** Los inspectores dedicaban entre el 30% y el 40% de su jornada laboral a transcribir a mano lo que ya habían anotado en la calle.

## Solución de Ingeniería
Diseñé e implementé una solución integrada *offline-first* compuesta por una API RESTful asíncrona de alto rendimiento y una aplicación cliente móvil optimizada para uso riguroso en terreno:

- **Backend Robusto (FastAPI + PostgreSQL):**
  - Modelo relacional normalizado en Tercera Forma Normal (3FN), garantizando integridad referencial y atomicidad en cada transacción.
  - Validación de esquemas estricta en frontera con Pydantic v2 para impedir la entrada de datos corruptos o incompletos.
  - Autenticación institucional con control de acceso basado en roles y soporte de segundo factor (MFA/TOTP) bajo el estándar RFC 6238.
  - Pipeline de CI/CD automatizado con GitHub Actions y contenedorización reproducible en Docker.

- **Cliente Móvil en Terreno (Flutter):**
  - **Búsqueda instantánea de Patente Única (PPU):** Verificación inmediata de antecedentes vehiculares.
  - **Georreferenciación GPS automática:** Captura de coordenadas satelitales en un toque para eliminar disputas de ubicación.
  - **Evidencia fotográfica en el dispositivo:** Captura, compresión y estampado de metadatos antes de la transmisión.
  - **Cola local de sincronización:** Persistencia local instantánea para operar sin interrupciones incluso en sectores rurales sin cobertura celular, sincronizando automáticamente al reconectar con el servidor.

## Demostración Interactiva en Vivo
En la parte superior de este caso de estudio se encuentra el **Showcase Interactivo en Canvas**, renderizado con aceleración por hardware (PixiJS WebGL y Canvas 2D), donde es posible explorar el video de la operativa real (con audio removido para visualización silenciosa y óptima), así como el desglose pantalla a pantalla del flujo de fiscalización.

## Estado Actual y Proyección
Actualmente el proyecto es un **MVP en fase de pruebas operativas**. Las pruebas técnicas iniciales han verificado:
- **Reducción del tiempo de captura:** De ~12 minutos por procedimiento tradicional a menos de 90 segundos con el cliente móvil.
- **Tasa de error por transcripción:** Reducida a cero gracias a las validaciones de tipos en la API y el teclado contextual.
- **Sincronización:** 100% de actas respaldadas localmente e indexadas en PostgreSQL al detectar enlace de red.

## Stack Técnico
- **Core Backend:** Python 3.12, FastAPI, SQLAlchemy / Psycopg, PostgreSQL (3FN).
- **Seguridad & Auth:** JWT tokens seguros, Hash Argon2/Bcrypt, MFA TOTP.
- **Cliente Terreno:** Flutter (Dart), geolocalización por hardware, SQLite/Hive para buffer local.
- **Infraestructura:** Docker, Docker Compose, Linux, GitHub Actions.
