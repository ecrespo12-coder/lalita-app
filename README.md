# Lalita 🌿 — Tu calendario inteligente de bienestar

App web con calendario interactivo, dashboard de estadísticas, exportación a Excel
y frases motivacionales generadas con IA. Pensada para usarse desde PC y celular.

Esta guía está escrita para alguien sin experiencia previa como programador/a.
Sigue los pasos en orden.

## Qué contiene el proyecto

```
lalita-app/
  backend/    → servidor (Node.js + Express + MongoDB)
  frontend/   → la app que ves en el navegador (React)
```

---

## Paso 0: Instalar programas necesarios (una sola vez)

1. **Node.js**: descarga la versión LTS desde https://nodejs.org e instálala
   (siguiente, siguiente, finalizar). Verifica que quedó instalado abriendo
   una terminal y escribiendo `node -v` (debe mostrar un número, ej. v20.x).
2. **Editor de código** (opcional pero recomendado): Visual Studio Code,
   gratis en https://code.visualstudio.com.

---

## Paso 1: Crear tu base de datos gratis (MongoDB Atlas)

1. Entra a https://www.mongodb.com/cloud/atlas/register y crea una cuenta gratis.
2. Crea un **Cluster gratuito (M0)**.
3. En "Database Access", crea un usuario y contraseña (guárdalos).
4. En "Network Access", agrega `0.0.0.0/0` para permitir conexión desde
   cualquier lugar (suficiente para empezar).
5. Click en "Connect" → "Drivers" → copia la cadena de conexión, se ve así:
   `mongodb+srv://usuario:<password>@cluster0.mongodb.net/...`
6. Reemplaza `<password>` por tu contraseña real y agrega `/lalita` antes del
   `?` para que la base se llame "lalita". Guarda esta cadena, la usarás en
   el paso 3.

---

## Paso 2: Conseguir una clave de IA (elige un solo proveedor)

Elige uno de estos (todos tienen capa gratuita o de bajo costo):

- **OpenAI**: https://platform.openai.com/api-keys → "Create new secret key".
- **Google Gemini**: https://aistudio.google.com/app/apikey → "Create API key".
- **Anthropic Claude**: https://console.anthropic.com/settings/keys → "Create Key".

Guarda la clave generada, la usarás en el paso 3.

---

## Paso 3: Configurar el backend (servidor)

1. Abre una terminal dentro de la carpeta `backend/`.
2. Copia el archivo de ejemplo de variables de entorno:
   ```
   cp .env.example .env
   ```
3. Abre `.env` con tu editor y completa:
   - `MONGODB_URI` → la cadena de conexión del Paso 1.
   - `AI_PROVIDER` → `openai`, `gemini` o `claude` (el que elegiste).
   - La clave correspondiente: `OPENAI_API_KEY`, `GEMINI_API_KEY` o `CLAUDE_API_KEY`.
4. Instala las dependencias:
   ```
   npm install
   ```
5. Inicia el servidor:
   ```
   npm start
   ```
   Deberías ver: `Servidor Lalita corriendo en el puerto 4000` y
   `Conectado a MongoDB correctamente`.

Deja esta terminal abierta y corriendo.

---

## Paso 4: Configurar el frontend (la app)

1. Abre **otra** terminal, dentro de la carpeta `frontend/`.
2. Copia el archivo de ejemplo:
   ```
   cp .env.example .env
   ```
   (el valor por defecto ya apunta al backend local, no hace falta cambiarlo).
3. Instala las dependencias:
   ```
   npm install
   ```
4. Inicia la app:
   ```
   npm run dev
   ```
5. Abre en tu navegador la dirección que aparece (normalmente
   http://localhost:5173).

Ya deberías ver Lalita funcionando: click en un día del calendario para
agregar actividades, cambia a la pestaña Dashboard para ver las gráficas,
y prueba el botón "Generar con IA" para la frase motivacional.

---

## Paso 5: Publicarla en internet (para usarla desde el celular)

### Backend → Render (gratis)

1. Sube la carpeta `backend/` a un repositorio de GitHub (crea una cuenta en
   github.com si no tienes, y usa "Upload files" para subir sin usar comandos).
2. Entra a https://render.com, crea cuenta gratis, "New +" → "Web Service".
3. Conecta tu repositorio de GitHub.
4. Configura:
   - Build command: `npm install`
   - Start command: `npm start`
5. En "Environment", agrega las mismas variables que pusiste en tu `.env`
   (MONGODB_URI, AI_PROVIDER, la clave de IA, y `CORS_ORIGIN` — déjala vacía
   por ahora, la completas en el paso siguiente).
6. Al terminar el despliegue, Render te da una URL como
   `https://lalita-backend.onrender.com`. Guárdala.

### Frontend → Vercel (gratis)

1. Sube la carpeta `frontend/` a otro repositorio de GitHub (o el mismo, en
   una subcarpeta).
2. Entra a https://vercel.com, crea cuenta gratis, "Add New" → "Project".
3. Conecta el repositorio. Si el frontend está en una subcarpeta, indica
   "Root Directory" = `frontend`.
4. En "Environment Variables", agrega:
   `VITE_API_URL = https://lalita-backend.onrender.com/api`
   (usa la URL real que te dio Render, agregando `/api` al final).
5. Click en "Deploy". Vercel te da una URL pública, por ejemplo
   `https://lalita.vercel.app` — ábrela desde tu celular y agrégala a
   pantalla de inicio para que se sienta como una app.
6. Vuelve a Render y en la variable `CORS_ORIGIN` del backend, pon la URL
   de Vercel (ej. `https://lalita.vercel.app`). Guarda y espera a que
   Render reinicie el servicio.

Netlify funciona igual que Vercel si prefieres usarlo en vez de Vercel.

---

## Personalizar categorías o colores

Las categorías predeterminadas (Medicamentos, Terapia, Comida, Ejercicio,
Arte, Autocuidado, Reflexión, Aprendizaje, Afirmación) y sus colores están
en `frontend/src/constants/categories.js`. Puedes editar ese archivo para
cambiar nombres, colores o emojis, o agregar categorías nuevas.

## Solución de problemas comunes

- **"No se pudo conectar con el servidor"** en la app → revisa que el
  backend esté corriendo (`npm start` en la carpeta `backend/`).
- **Error de MongoDB al iniciar el backend** → revisa que copiaste bien la
  cadena de conexión y que reemplazaste `<password>` por tu contraseña real.
- **El botón de IA da error** → revisa que la clave de API en `.env` sea
  correcta y corresponda al `AI_PROVIDER` elegido.
