# Proyecto Node.js con Express y Mongoose

## Descripción

Este es un proyecto básico de Node.js que utiliza Express para la creación de APIs RESTful y Mongoose para gestionar la conexión y operaciones con MongoDB.

__Requisitos previos__

- [x]	Node.js (v14 o superior)
- [x]	MongoDB (local o en la nube)
- [x]	npm (v6 o superior)

### ***Instalación***

    1. Clona este repositorio:
        - git clone https://github.com/YanethM/fullstack-bootcamp-179-test.git
        - cd fullstack-bootcamp-179-test

    2. Instalación de dependencias
        - npm i

    3. Crea un archivo .env con tus variables de entorno
        - MONGODB_URI
        - JWT_SECRET
        - PORT_CONNECTION
        - NODE_ENV = test

    4. Inicia el servidor
        npm run dev
        npm run start

### ***Scripts***

	•	npm start: Inicia el servidor en modo producción.
	•	npm run dev: Inicia el servidor en modo desarrollo utilizando nodemon.
	•	npm test: Ejecuta las pruebas con jest y supertest.

### ***Endpoints***
	•	POST /api/auth/login
    •	POST /api/auth/register

    •	GET /api/v1/hello

### Licencia

>Este proyecto está bajo la licencia MIT.
>Es decir, es de código abierto y tiene una licencia permisiva. Cualquiera lo puede
>usar, copiar, modificar y distribuir, tanto para proyectos personales como comerciales.