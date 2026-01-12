# SRE Home Assignment – Fullstack System with TiDB, Kafka & Observability

This project was built as part of an **SRE (Site Reliability Engineering) home assignment**.

The objective is to demonstrate the ability to **design, deploy, and operate a production-like distributed system**, with a strong emphasis on reliability, reproducibility, and operational thinking.

The entire system is fully containerized and can be started with **a single Docker Compose command**.

---

## Objectives

This project demonstrates the following core capabilities:

- Application service design
- Distributed database infrastructure
- Event-driven architecture
- Change Data Capture (CDC)
- Observability and structured logging
- Full containerization and reproducibility
- Operational readiness from day one

---

## System Architecture

The system is composed of the following services:

### API Service (Node.js + Express)
- Provides authentication and token-based access
- Exposes REST endpoints
- Stateless design suitable for horizontal scaling

### Database – TiDB Cluster
- Distributed SQL database
- Composed of:
  - **PD** – cluster metadata and scheduling
  - **TiKV** – distributed key-value storage
  - **TiDB** – SQL interface

### Change Data Capture (TiDB CDC)
- Streams real-time database changes
- Publishes change events directly to Kafka

### Message Broker – Apache Kafka
- Acts as the event backbone
- Receives CDC events from TiDB
- Enables asynchronous and decoupled processing

### Consumer Service (Node.js)
- Subscribes to Kafka topics
- Processes database change events
- Designed to be independently scalable

### Observability & Logging
- Structured JSON logging using `log4js`
- Logs include timestamps, actions, user IDs, and source IPs
- Ready for ingestion into centralized logging systems

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

The following tools are required:

- Docker
- Docker Compose
- Git

No additional dependencies are required on the host machine.

---

## Running the System

From the project root directory:

```bash
docker compose -f infra/docker-compose.yml up --build
This single command will:

Start the TiDB cluster (PD, TiKV, TiDB)

Automatically initialize the database schema and seed data

Start Kafka and Zookeeper

Start TiDB CDC and create a changefeed to Kafka

Start the API service

Start the Kafka consumer service

The system is fully reproducible and safe to restart at any time.

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
Database initialization is handled automatically by a dedicated db-init container.

Initialization steps include:

Database creation

Table creation (users, tokens)

Seed user insertion

This guarantees:

Idempotent startup

No manual intervention

Safe re-deployment and recovery

Observability & Logging
All application logs are emitted in structured JSON format

Login events are logged with:

Timestamp

User ID

Action

Source IP

Logs are suitable for ingestion into systems such as:

ELK Stack

Loki

Cloud logging platforms

SRE Considerations
This project intentionally reflects real SRE design principles:

Strong service isolation using containers

Explicit service dependencies

Stateless application design

Distributed data storage

Event-driven communication

Reproducible infrastructure

Operational-first mindset

Future Improvements
Potential enhancements include:

Prometheus metrics exposure

Grafana dashboards

Kubernetes manifests

Secret management solutions

Alerting rules

CI/CD pipeline integration

Summary
This project mirrors real-world SRE responsibilities:

Designing reliable distributed systems

Managing complex infrastructure components

Ensuring reproducibility and recoverability

Thinking beyond code into operations and lifecycle management
