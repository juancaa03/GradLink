
# GradLink


Teneis que hacer esto como setup ANTES DE PONEROS CON EL CODIGO:

1. Instalar PostgreSQL en el PC
2. Crear la bd con:
   ```sql
   CREATE DATABASE gradlink;
   ```
3. Crear un `.env` en la carpeta del backend con esto (poned vuestra contra real):

   ```env
   PORT=4000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=tu contra
   DB_DATABASE=gradlink
   JWT_SECRET=lo que sea pero largo
   ```

---

##  Lo que hay de backemd

### API:

- Registro de usuarios (`/api/auth/register`)
- Login con JWT (`/api/auth/login`)
- Ruta devuelve el usuario para verificar jwt (`/api/auth/me`)
- Crear servicio(con token) (`POST /api/services`)
- Listar servicios por título y/o tags (`GET /api/services`)
- Lo usaremos para cuando el usuario haga click en uno de los servicios (`GET /api/services/:id`)

### Para que veais y entendais mejor, ñas pruebas que he heco con Postman:

#### Registro (`POST /api/auth/register`)
![Registro](./postman-registro-gradlink.png)

---

#### Login (`POST /api/auth/login`)
![Login](./postman-login-gradlink.png)

---

#### Me (`GET /api/auth/me` con token)
> Tienes que poner el token en el header como `Authorization: Bearer <token>`
![JWT](./postman-jwt-gradlink.png)

---

ANTES DE TOCAR CODIGO PROBAD EXACTAMENTE LO MISMO, HASTA QUE NO OS FUNCIONE PERF NO METAIS CODIGO QUE SINO LIADA

mas cositas

### Crear servicio (`POST /api/services`)

- **Endpoint:** `http://localhost:4000/api/services`
- **Método:** POST
- **Headers:**
  ```
  Authorization: Bearer <token>
  Content-Type: application/json
  ```
- **Body (JSON):**
```json
{
  "title": "Clases de programación web",
  "description": "Te enseño HTML, CSS y JavaScript desde cero en clases online.",
  "price": 15,
  "tags": [
    { "name": "html" },
    { "name": "css" },
    { "name": "clases" },
    { "name": "programación" }
  ]
}
```
- **Respuesta esperada (resumen):**
```json
{
  "id": 1,
  "title": "Clases de programación web",
  "description": "Te enseño HTML, CSS y JavaScript desde cero en clases online.",
  "price": "15",
  "tags": [
    { "id": 1, "name": "html" },
    { "id": 2, "name": "css" }
  ],
  "user": {
    "id": 1,
    "name": "Juan Dev"
  }
}
```

---

### Buscar servicios (`GET /api/services`)

Se puede hacer la consulta de muchas formas:

- Todos:
  ```
  GET /api/services
  ```

- por título:
  ```
  GET /api/services?q=clases
  ```

- por tags:
  ```
  GET /api/services?tags=html,css
  ```

- junto:
  ```
  GET /api/services?q=web&tags=html,programación
  ```