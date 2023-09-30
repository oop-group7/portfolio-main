# Foliowatch

## Onboarding

### Installation

- Obtain the latest `.env` file and ensure that it is situated in the root directory of this repo.

### Running in production

- Build the Docker Compose image:

```bash
docker compose build
docker compose up -d
```

### Running in development

- Run the following command:

```bash
./mvnw spring-boot:run
```

### Developing Foliowatch

1. Open two terminals in your IDE. One of them will be used for developing the frontend and the other the backend.
2. For the frontend, navigate to the `frontend` folder (`cd frontend`) and run `npm run install`, then `npm run watch` to export the built files to Spring Boot.
3. For the backend, run `./mvnw spring-boot:run`. The website will be running in port 8080 by default. The application will be rebuilt if any Java source files are modified automatically. For the frontend, you will have to reload the page in your browser to realise any changes.
4. To get the Swagger OpenAPI documentation, navigate to `/api/docs/ui`.
5. To generate API fetching code for the frontend after adding new endpoints, run `npm run generate` in the `frontend` folder while the backend server is still running.
