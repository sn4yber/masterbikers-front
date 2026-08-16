# Master Bikers - Frontend (Prueba Técnica Grupo Red)

Este repositorio contiene la interfaz de usuario (Frontend) desarrollada como parte integral de la prueba técnica para el rol de **Ingeniero de Software Jr**. 

Aunque el objetivo principal de la prueba era construir un servicio backend de extracción asíncrona, se decidió implementar esta interfaz gráfica ("Master Bikers") para demostrar capacidades *Full-Stack*, manejo avanzado de flujos asíncronos en el cliente (RxJS) y un enfoque sólido en Experiencia de Usuario (UX) y Arquitectura Frontend.

---

## 🚀 Descripción General

**Master Bikers** es una simulación de un E-commerce de repuestos de motocicletas. 
La aplicación se conecta al backend desarrollado para la prueba y ofrece dos módulos principales:

1. **Scraping Hub (Inteligencia de Mercado):** 
   - Una interfaz que permite al usuario iniciar trabajos de extracción asíncronos pegando IDs o URLs del sitio `automationexercise.com`.
   - Utiliza **Polling reactivo con RxJS** para consultar el estado del trabajo (`PROCESSING`, `COMPLETED`, `FAILED`) y renderizar una barra de progreso en vivo.
   - Presenta métricas calculadas en tiempo real (Precio Promedio, Stock, etc.) a partir de los datos extraídos por el backend.

2. **Catálogo de Repuestos (Gestión CRUD):**
   - Consume la API REST para visualizar, filtrar, editar y eliminar los productos (tanto los creados manualmente como los extraídos).
   - Implementa un hack de atajo visual: Los productos extraídos adoptan automáticamente imágenes representativas basándose en palabras clave, permitiendo una visualización de alta fidelidad sin requerir un sistema complejo de subida de archivos (S3/Cloudinary) para un MVP.

---

## 🛠 Tecnologías Utilizadas

- **Framework:** Angular 18 (Standalone Components).
- **Estilos:** Vanilla CSS (Diseño "Editorial / Magazine" oscuro, tipografía Bebas Neue). Se evitó deliberadamente el uso de librerías de componentes prefabricadas (como Bootstrap o Material) para demostrar dominio puro de CSS (Flexbox, CSS Grid, variables nativas).
- **Reactividad:** RxJS (Manejo de estados asíncronos, polling de intervalos, control de subscripciones).
- **Routing:** Angular Router (SPA puro).
- **Despliegue:** Preparado para Netlify (`netlify.toml` incluido).

---

## 💡 Decisiones Técnicas y Trade-offs

1. **Standalone Components (Angular 18):** 
   Se prescindió completamente de `NgModules` para adoptar la arquitectura más moderna de Angular. Esto reduce el *boilerplate*, mejora el *tree-shaking* y hace que el código sea mucho más legible.

2. **Manejo del Asincronismo (Polling vs WebSockets):** 
   Dado que el backend procesa las extracciones de forma asíncrona, el frontend necesitaba enterarse del progreso. Se optó por una estrategia de **Polling cada 2 segundos con RxJS** (`interval + switchMap`) en lugar de *WebSockets* o *Server-Sent Events (SSE)*. 
   - *¿Por qué?* El polling es estadísticamente más robusto y fácil de implementar para un MVP de 3 días, reduciendo la complejidad en el backend sin sacrificar significativamente la experiencia en tiempo real del usuario.

3. **Arquitectura de Estilos (Vanilla CSS sobre Tailwind):**
   Aunque TailwindCSS es excelente para iterar rápido, se construyó una hoja de estilos base (`styles.css`) con un sistema de tokens (variables CSS) propio. Esto demuestra conocimiento fundamental de diseño web y permitió lograr una estética "Neo-Brutalista / Revista" muy específica que resalta frente a interfaces genéricas.

---

## ⚙️ Cómo Ejecutar el Proyecto

### Prerrequisitos
- Node.js (v18+)
- Angular CLI (`npm install -g @angular/cli`)
- **Tener el Backend corriendo en `http://localhost:8080`**.

### Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/sn4yber/masterbikers-front.git
   cd masterbikers-front
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. (Opcional) Configurar URL del backend:
   Si tu backend corre en un puerto distinto, modifica el archivo: `src/environments/environment.ts`.

4. Levantar el servidor de desarrollo:
   ```bash
   npm run start
   ```
5. Abrir en el navegador: `http://localhost:3000` (o el puerto que asigne Angular).

---



## 🔮 Qué mejoraría con más tiempo

1. **Store Management (NgRx / Signals):** Actualmente el estado (productos, carga, filtros) reside en los componentes. Para escalar, migraría a Angular Signals o un State Manager.
2. **Infinite Scrolling real:** El catálogo actualmente limita la petición a 100 elementos. Implementaría un scroll infinito utilizando un `IntersectionObserver` paginando de 20 en 20 para optimizar el rendimiento.
3. **Subida real de Imágenes:** Cambiar el atajo actual de mapeo de nombres por una integración real con un bucket S3.
