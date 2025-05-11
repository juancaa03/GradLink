# GradLink Setup & Execution

Este repositorio contiene dos partes: el **backend** (API REST con TypeORM y Stripe) y el **frontend** (React), cuyo punto de entrada es la sigueinte captura que muestra la pantalla de inicio (*Home*).

![Captura de Home](./Home.png)

## Requisitos previos

* Tener PostgreSQL instalado y ejecutándose.
* Crear la base de datos `gradlink` en PostgreSQL.
* Node.js v16+ y npm.

## Pasos de instalación

0. **Descargar [Postgres](https://www.postgresql.org/download/) y crear base de datos**

   ```bash
   CREATE DATABASE gradlink;
   ```

1. **Clonar el repositorio**

   ```bash
   https://github.com/juancaa03/GradLink.git
   cd GradLink
   ```

2. **Crea un fichero `.env` en la raíz del backend con el siguiente contenido:**

   ```dotenv
   PORT=4000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=postgres
   DB_DATABASE=gradlink
   JWT_SECRET=tujwt
   JWT_VERIF_SECRET=tuverifjwt
   STRIPE_SECRET_KEY=sk_test_tustripesecret
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:4000
   ALLOWED_INSTITUTIONAL_DOMAINS=array,de,instituciones,permitidas,urv.cat
   ```

3. **Instalar dependencias en backend**

   ```bash
   cd gradlink-backend
   npm install
   ```

4. **Ejecutar migraciones**

   ```bash
   npx typeorm migration:run --dataSource src/data-source.js
   ```

5. **Iniciar backend**

   En una terminal:
   ```bash
   npm run dev
   ```

6. **Instalar dependencias en frontend**

   En otra terminal:
   ```bash
   cd gradlink-frontend
   npm install
   ```

7. **Iniciar frontend**
   ```bash
   npm run dev
   ```

## Pruébalo

* Abre el navegador en `http://localhost:3000` para ver la página *Home*.
* Regístrate y crea pedidos.
* Para probar pagos con Stripe, utiliza la tarjeta de prueba:
  ```text
  4000 0072 4000 0007
  ```
* Los demas datos pueden ser inventados pero deben ser validos.

¡A jugar!