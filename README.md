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
  Captures database changes in real time.
- **Message Broker (Apache Kafka)**  
  Receives CDC events from TiDB.
- **Consumer Service (Node.js)**  
  Consumes Kafka messages and processes database change events.
- **Logging & Observability**  
  Structured JSON logging using log4js.

---

## Repository Structure

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
