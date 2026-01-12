# SRE Home Assignment – Fullstack System with TiDB, Kafka & Observability

This project was built as part of an **SRE (Site Reliability Engineering) home assignment**.

The goal of the assignment is to demonstrate the ability to design, deploy, and operate a distributed system with:
- Application services
- Database infrastructure
- Messaging systems
- Observability and logging
- Full containerization and reproducibility

The entire system can be started with a single Docker Compose command.

---

## System Architecture

The system consists of the following components:

- **API Service (Node.js + Express)**  
  Provides authentication, token management, and REST endpoints.

- **Database (TiDB Cluster)**  
  Distributed SQL database composed of PD, TiKV, and TiDB components.

- **Change Data Capture (TiDB CDC)**  
  Captures database changes in real time and streams them to Kafka.

- **Message Broker (Apache Kafka)**  
  Receives CDC events from TiDB.

- **Consumer Service (Node.js)**  
  Consumes Kafka messages and processes database change events.

- **Logging & Observability**  
  Structured JSON logging using `log4js`.

---

## Repository Structure

.
├── api/
│ ├── index.js # REST API
│ ├── db.js # TiDB connection
│ ├── auth.js # Authentication middleware
│ ├── logger.js # log4js configuration
│ ├── Dockerfile
│ └── package.json
│
├── consumer/
│ ├── index.js # Kafka consumer
│ └── Dockerfile
│
├── infra/
│ ├── docker-compose.yml
│ └── db-init/
│ └── 01-init.sql # Database schema and seed data
│
├── .gitignore
└── README.md

yaml
Copy code

---

## Prerequisites

- Docker
- Docker Compose
- Git

No additional software is required on the host machine.

---

## Running the System

From the project root directory:

```bash
docker compose -f infra/docker-compose.yml up --build
This command will:

Start the TiDB cluster (PD, TiKV, TiDB)

Initialize the database schema automatically

Start Kafka and Zookeeper

Start TiDB CDC and create a changefeed to Kafka

Start the API service

Start the Kafka consumer

API Endpoints
Health Check
http
Copy code
GET /health
Response:

json
Copy code
{ "status": "ok" }
Login
http
Copy code
POST /login
Request body:

json
Copy code
{
  "email": "admin@test.com",
  "password": "temp-password"
}
Response:

json
Copy code
{
  "token": "<UUID_TOKEN>"
}
Authenticated Endpoint
http
Copy code
GET /me
Headers:

makefile
Copy code
Authorization: Bearer <UUID_TOKEN>
Response:

json
Copy code
{
  "userId": 1
}
Database Initialization
The database is initialized automatically using a dedicated db-init container.

It performs:

Database creation

Table creation (users, tokens)

Seed user insertion

This ensures the system is fully reproducible and safe to restart.

Observability & Logging
Application logs are written in structured JSON format

Login events are logged with timestamp, user ID, action, and source IP

Logs are suitable for ingestion into centralized logging systems

SRE Considerations
This project demonstrates key SRE principles:

Service isolation using containers

Explicit dependencies between services

Idempotent initialization

Stateless API design

Distributed database usage

Event-driven architecture

Operational reproducibility

Future Improvements
Prometheus metrics

Grafana dashboards

Kubernetes manifests

Secrets management

Alerting rules

CI/CD pipeline

Summary
This project reflects real-world SRE responsibilities:

Designing resilient systems

Managing distributed infrastructure

Ensuring reproducibility

Thinking in terms of reliability and operations
