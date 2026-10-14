---
title: "Viña Gran Hidalgo ERP"
description: "Proyecto de Práctica Intermedia (2 semestres) para un socio comunitario asignado por CFT San Agustín: diseño, modelado relacional 3FN y desarrollo de un ERP/SGI para digitalizar cuadrillas, labores de campo y enoturismo."
year: 2026
status: "Finalizado (Despliegue pendiente)"
role: "Arquitectura y Desarrollo Full Stack (Práctica Intermedia)"
tags: ["Práctica Intermedia", "Socio Comunitario", "CFT San Agustín", "ERP Vitivinícola", "PostgreSQL (3FN)", "Modelado UML / IEEE 830", "Digitalización de Procesos"]
---

> **Contexto de Práctica Intermedia & Estado del Proyecto:**
> Este proyecto corresponde al desarrollo de la **Práctica Intermedia** de la carrera de Analista Programador en **CFT San Agustín** (sede Cauquenes), vinculado a un **socio comunitario** real seleccionado por la casa de estudio: **Viña Gran Hidalgo**.
> El trabajo abarcó **2 semestres académicos continuos**, cubriendo desde la recopilación inicial de datos y entrevistas en terreno con el cliente hasta la especificación de requisitos (ERS bajo normas IEEE 830 / ISO 29148), acuerdo de nivel de servicio (SLA), modelado entidad-relación en 3FN para PostgreSQL y programación completa de la plataforma.
> **El proyecto se encuentra finalizado** en su totalidad a nivel de arquitectura y software; su **despliegue en producción quedó pendiente** por factores operativos del socio comunitario, y su **vista previa interactiva estará disponible pronto** en este portafolio.

## Contexto del Socio Comunitario
Viña Gran Hidalgo es una empresa familiar vitivinícola y turística situada en el Valle del Maule (Cauquenes), dedicada a la producción y embotellado de vinos tradicionales, turismo local, enoturismo guiado y hospedaje rural.

Fue seleccionada y asignada por **CFT San Agustín** como socio comunitario para vincular las competencias formativas de ingeniería de software con problemáticas productivas reales, permitiendo diseñar una solución digital adaptada a un entorno agrícola con dinámicas de trabajo exigentes y personal con baja familiaridad digital.

## Problema
Las operaciones comerciales, agrícolas y administrativas de la viña dependían en su totalidad de procesos manuales:
- **Cuadernos de campo en papel y planillas desconectadas:** Las faenas diarias (poda, riego, tratamientos fitosanitarios y vendimia) se anotaban a mano, generando desorden y riesgo crítico de extravío de información histórica.
- **Falta de trazabilidad agrícola e insumos:** No existía una correlación digital inmediata entre las cuadrillas de trabajadores, las labores ejecutadas y la cantidad de insumos agrícolas (fertilizantes, pesticidas) aplicados a cada sector o cuartel.
- **Gestión dispersa de personal y turismo:** La administración de contratos de trabajadores (temporales y permanentes), el control de asistencia y la gestión de reservas para degustaciones y hospedaje carecían de una plataforma centralizada.

## Análisis e Ingeniería de Requisitos (2 Semestres)
El proyecto se estructuró a lo largo de **dos semestres lectivos**, aplicando un ciclo de vida riguroso de ingeniería de software:

### 1. Levantamiento en Terreno y Actas de Reunión
Se sostuvieron reuniones presenciales periódicas con la gerencia, la administración y la jefatura de campo, documentando cada requerimiento en **Actas de Reunión de Socio Comunitario** para alinear expectativas de negocio y operativas.

### 2. Especificación Formal de Requisitos (ERS) y SLA
- Se elaboró el documento formal de **Especificación de Requisitos de Software (ERS)** para el **Sistema de Gestión de Información "Vinfor VGH" (SGI-VGH)** bajo las directrices internacionales **IEEE Std 830-1998** e **ISO/IEC/IEEE 29148:2018**.
- Se redactó un **Acuerdo de Nivel de Servicio (SLA)** estableciendo alcances de servicio, soporte, ventanas de mantenimiento y criterios de aceptación.
- Se definió una **Matriz de Trazabilidad** exhaustiva que vinculó 20 Requisitos Funcionales (RF) con 26 Requisitos No Funcionales (RNF), priorizando criterios de usabilidad (RNF-001 a RNF-005): tareas accesibles en un máximo de 3 clics, flujos guiados en menos de 5 pasos y feedback visual inmediato.

### 3. Modelado Conceptual y Lógico
- **Diagramas de Casos de Uso:** Modelado de interacciones para 5 perfiles: Administrador, Responsable de Personal (RRHH), Jefe de Campo, Responsable de Enoturismo y Operador General.
- **Diagrama de Clases UML:** Estructuración de clases de dominio, atributos, métodos y asociaciones de negocio.
- **Modelo Entidad-Relación en 3FN:** Diseño relacional normalizado en Tercera Forma Normal (3FN) con PostgreSQL (`roles`, `personal`, `sectores`, `labores`, `insumos`, `labores_insumos`, `turistas`, `visitas`), implementando integridad referencial en cascada (`ON UPDATE CASCADE / ON DELETE RESTRICT / SET NULL`), llaves primarias autoincrementales (`IDENTITY`) y validaciones lógicas vía cláusulas `CHECK`.

## Solución: Sistema ERP / SGI Vinfor VGH
Se desarrolló una plataforma web integral de gestión empresarial diseñada a medida con una arquitectura modular orientada a servicios:

- **Módulo Cuaderno de Campo & Labores Agrícolas:** Registro y programación de actividades vitivinícolas por cuartel o sector, asignación de trabajadores a faenas y control del consumo de insumos (litros/kilos) para trazabilidad desde el campo hasta la bodega.
- **Módulo de Trabajadores & RRHH:** Administración de fichas de colaboradores (datos personales, RUT, cargo, tipo de contrato, sueldo, contacto), seguimiento de labores y digitalización de documentos contractuales y certificados.
- **Módulo de Enoturismo & Hospedaje:** Registro de turistas nacionales y extranjeros, calendario de visitas guiadas, control de ocupación de habitaciones y levantamiento de encuestas de satisfacción.
- **Seguridad, Auditoría y Digitalización:** Autenticación por credenciales con control de acceso por roles, registro de logs de auditoría de operaciones críticas y respaldo estructurado de datos.
- **Interfaz y Prototipado UX:** Maquetas interactivas desarrolladas con HTML5, Bootstrap 5 y JavaScript, utilizando una identidad visual basada en la paleta vitivinícola de la viña (borgoña, crema y verde viñedo).

## Estado Actual y Despliegue
- **Desarrollo del Software:** El proyecto está **completamente finalizado**, habiendo superado con éxito las fases de análisis, diseño, modelado relacional y codificación funcional.
- **Despliegue a Producción:** El despliegue formal en los servidores locales/productivos de la viña quedó **pendiente** debido a tiempos operativos y definiciones de infraestructura técnica por parte del socio comunitario.
- **Vista Previa:** La **vista previa interactiva estará disponible pronto** en este sitio web para demostrar la navegación, módulos y flujos del sistema en vivo.

## Tecnologías y Estándares
- **Base de Datos:** PostgreSQL (Modelo relacional normalizado en 3FN con integridad referencial estricta).
- **Ingeniería de Requisitos:** ERS bajo estándares IEEE Std 830-1998 e ISO/IEC/IEEE 29148:2018, Anexo SLA, Matriz de Trazabilidad RF/RNF.
- **Modelado UML:** Diagramas de Casos de Uso, Diagramas de Clases, pgModeler y scripts SQL DDL/DML.
- **Frontend & Prototipado:** HTML5 semántico, JavaScript modular, CSS3 corporativo (`#7D2636`, `#5A1F2F`, `#F9F6F0`), Bootstrap 5.
- **Arquitectura de Software:** Patrón MVC (Model-View-Controller) modular con separación de lógica de negocio, persistencia y vistas.
