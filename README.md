# Resource Allocation System

A full-stack web application for managing institutional resources and coordinating bookings for seminar halls, laboratories, classrooms, and other shared spaces.

The project separates the **Next.js frontend** from the **Spring Boot REST API** and uses **PostgreSQL** to store users, resources, bookings, and Training & Placement (TNP) requests.

**Live application:** https://edi-sem-2.vercel.app  
**Source code:** https://github.com/RiteshD2005/Resource_Allocation_System

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Security Notes](#security-notes)
- [Contributing](#contributing)

## Overview

Institutions often need to coordinate the use of shared spaces while avoiding scheduling conflicts and keeping booking decisions organized. The Resource Allocation System provides a central application for users to request resources and for authorized staff to manage those requests.

The database schema supports user accounts, resource details, time-based bookings, approval status, and dedicated TNP requests. Resources can be categorized as halls, labs, classrooms, or cabins, with visibility settings for public resources and TNP-only resources.

## Features

- **Resource management:** Store resource names, capacities, locations, amenities, types, and active status.
- **Booking records:** Capture booking purpose, requested time range, event details, expected attendance, and resource requirements.
- **Booking workflow:** Track requests through `PENDING`, `APPROVED`, `REJECTED`, and `CANCELLED` states.
- **Role-based access:** The data model supports Student, Faculty, Admin, and TNP roles.
- **TNP requests:** Record company/drive details, requested time slots, expected students, priority, approval information, and required halls.
- **Resource visibility:** Distinguish `PUBLIC` resources from `TNP_ONLY` resources.
- **Authentication and authorization:** Spring Security and JWT libraries are included in the backend.
- **Email support:** The backend includes Spring Boot mail support for email-related workflows.
- **API documentation support:** Springdoc OpenAPI is included in the backend dependencies.

> The exact availability of each feature depends on the implemented frontend and backend routes. See the source code for the definitive behavior.

## User Roles

The database schema defines the following roles:

| Role | Intended use |
|---|---|
| `STUDENT` | Request resources for student activities and events. |
| `FACULTY` | Request resources for academic or institutional activities. |
| `ADMIN` | Manage resource and booking workflows, including approval decisions. |
| `TNP` | Submit and manage Training & Placement-related resource requests. |

## Technology Stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Axios for HTTP requests
- Lucide React for icons

### Backend

- Java 21
- Spring Boot 3.5
- Spring Web
- Spring Data JPA / Hibernate
- Spring Security
- JWT (JJWT)
- Spring Boot Mail
- Spring Data Redis
- Spring Boot Validation
- Springdoc OpenAPI
- Maven

### Database and deployment

- PostgreSQL
- Vercel frontend deployment
- A PostgreSQL hosting provider can be used for a remotely accessible database; configure credentials through environment-specific settings.

## Architecture

```text
User / Browser
      |
      v
Next.js + React frontend
      |
      | HTTP requests (REST API)
      v
Spring Boot backend
  |       |        |
  |       |        +--> Email service (when configured)
  |       +-----------> Redis (when configured)
  +-------------------> PostgreSQL
```

The frontend handles the user interface, while the backend provides application logic, API endpoints, authentication, and database access.

## Repository Structure

```text
Resource_Allocation_System/
├── backend/          # Spring Boot application
├── frontend/         # Next.js application
├── DATABASE.sql      # SQL schema for core application tables
├── schema.sql        # Additional / expanded database schema
└── README.md
```

The repository may contain other development or local-environment files. Avoid committing credentials, database exports containing real personal data, or machine-specific logs.

## Getting Started

### Prerequisites

Install the following before running the project locally:

- Git
- Node.js and npm
- Java Development Kit (JDK) 21
- Maven (or use the Maven Wrapper if one is present)
- PostgreSQL
- Redis only if the backend configuration requires it

### 1. Clone the repository

```bash
git clone https://github.com/RiteshD2005/Resource_Allocation_System.git
cd Resource_Allocation_System
```

### 2. Configure the database and backend

1. Create a PostgreSQL database for the application.
2. Configure the database URL, username, and password in the backend's local configuration or environment variables.
3. Set any required JWT secret, email credentials, and Redis connection details using local environment-specific configuration.
4. Do not commit real secrets to Git.

See [Database Setup](#database-setup) and [Configuration](#configuration) below.

### 3. Install frontend dependencies

```bash
cd frontend
npm install
```

Create the frontend environment file required by the API client, if the code uses an environment variable for the backend URL. Check the frontend source for the exact variable name rather than assuming one.

### 4. Start the frontend

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Start the backend

In a second terminal:

```bash
cd backend
mvn spring-boot:run
```

If the repository includes a Maven Wrapper, you can use `./mvnw spring-boot:run` on macOS/Linux or `mvnw.cmd spring-boot:run` on Windows instead.

Make sure the backend's database and any required services are configured before starting it.

## Database Setup

The repository includes SQL files describing the database structure.

The core schema includes tables for:

- **`users`** — user identity, email, password hash, role, active status, and creation time.
- **`halls`** — resource name, capacity, location, amenities, type, visibility, and active status.
- **`booking`** — requested resource, user, time range, event information, booking status, and approval details.
- **`tnp_requests`** — company/drive details, requested schedule, expected student count, priority, and approval information.
- **`tnp_request_halls`** — links TNP requests with the required halls and requirement types.

To apply a schema manually, create/select your development database and run the SQL file that matches the schema expected by the current backend. For example, using the PostgreSQL command-line client:

```bash
psql -U <username> -d <database_name> -f DATABASE.sql
```

Replace `<username>` and `<database_name>` with your local PostgreSQL values. Check both SQL files before running them: they may represent different schema versions, so do not blindly execute both against the same database.

## Configuration

Keep configuration values local to your environment. Depending on the backend implementation, you may need to configure:

| Setting | Purpose |
|---|---|
| PostgreSQL JDBC URL | Connects the backend to the database. |
| Database username/password | Authenticates the database connection. |
| JWT signing secret | Signs and validates authentication tokens. Use a strong secret. |
| Mail host, port, username, password | Enables email functionality. |
| Redis host/port/password | Configures Redis if it is enabled for the application. |
| Frontend API base URL | Tells the frontend where the backend API is hosted. |

Use the exact property names expected by the application's configuration files. Do not put production credentials in source control.

## Running the Application

For local development, run the backend and frontend in separate terminals:

**Terminal 1 — backend**
```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 — frontend**
```bash
cd frontend
npm run dev
```

For a production frontend build:

```bash
cd frontend
npm run build
npm run start
```

The backend's port and the frontend's API base URL must match your local or deployed configuration.

## API Documentation

The backend includes Springdoc OpenAPI dependencies. If the OpenAPI UI is enabled in the active configuration, it is commonly available at:

- `http://localhost:8080/swagger-ui/index.html`
- `http://localhost:8080/v3/api-docs`

These URLs assume the backend runs on port `8080` and has not customized the documentation paths. Check the application configuration if they do not open.

## Deployment

The repository's About section links to the deployed frontend: https://edi-sem-2.vercel.app

For a typical deployment:

1. Deploy the `frontend` directory to Vercel.
2. Deploy the Spring Boot `backend` as a separate service that supports Java 21.
3. Provision a PostgreSQL database accessible to the backend.
4. Configure the frontend's API base URL to point to the deployed backend.
5. Set database, JWT, mail, and Redis settings as environment variables or secure service configuration.
6. Configure backend CORS to allow the deployed frontend origin.
7. Verify authentication, booking operations, approval flows, and database connectivity in the deployed environment.

The frontend URL alone does not confirm that the backend or all integrations are currently online.

## Security Notes

- Never commit database passwords, JWT secrets, email credentials, or production environment files.
- Store password hashes, not plaintext passwords.
- Use HTTPS for deployed frontend and backend services.
- Restrict CORS to trusted frontend origins.
- Validate booking inputs and enforce authorization on the backend, not only in the UI.
- Avoid publishing real user data or sensitive database exports.
