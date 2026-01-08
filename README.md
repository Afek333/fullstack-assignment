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

