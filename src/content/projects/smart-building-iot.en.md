---
slug: "smart-building-iot"
name: "Smart Building IoT"
tagline: "Real-time event-driven pipeline for IoT sensor telemetry"
description: "Spring Boot backend ingesting temperature/humidity data from five zones of a building via REST, relaying it to Kafka for anomaly detection, then persisting it to MongoDB — exposed via an OpenAPI-documented REST API."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/smart-building-iot-java"
techStack:
  - category: "Language & Framework"
    items: ["Java 17", "Spring Boot 3.2.5", "Maven"]
  - category: "Streaming"
    items: ["Apache Kafka", "Spring Kafka", "Zookeeper"]
  - category: "Database"
    items: ["MongoDB", "Spring Data MongoDB"]
  - category: "API & Documentation"
    items: ["Spring Web (REST)", "springdoc-openapi 2.5.0 (Swagger UI)", "Bean Validation"]
  - category: "Observability"
    items: ["Spring Actuator (health, info)"]
  - category: "DevOps"
    items: ["Docker (multi-stage)", "Docker Compose (4 services)"]
  - category: "Tests"
    items: ["JUnit 5", "Mockito", "AssertJ", "spring-kafka-test", "@WebMvcTest / MockMvc"]
architectureFlow:
  - label: "Sensors"
    kind: "client"
    edgeLabel: "REST"
    nodes:
      - icon: "Cpu"
        label: "IoT Sensors"
        specs: ["5 simulated zones", "Dedicated Spring profile"]
  - label: "Ingestion"
    kind: "gateway"
    edgeLabel: "after validation"
    nodes:
      - icon: "PlugZap"
        label: "REST API"
        specs: ["POST /api/sensors/data", "Swagger UI"]
  - label: "Validation"
    kind: "service"
    edgeLabel: "publish to Kafka"
    nodes:
      - icon: "ShieldCheck"
        label: "Validation"
        specs: ["-80°C to 150°C", "0-100% humidity"]
  - label: "Streaming"
    kind: "service"
    edgeLabel: "consumer"
    nodes:
      - icon: "Workflow"
        label: "Kafka"
        specs: ["3 partitions", "key = deviceId"]
  - label: "Data & alerts"
    kind: "data"
    nodes:
      - icon: "Database"
        label: "MongoDB"
        specs: ["Indexed history"]
      - icon: "AlertTriangle"
        label: "Anomaly detection"
        specs: [">30°C / >80%"]
architectureInfra:
  - icon: "Container"
    label: "Docker"
    specs: ["multi-stage build"]
  - icon: "Boxes"
    label: "Docker Compose"
    specs: ["4 services"]
architectureSummary:
  - "REST → Kafka → MongoDB pipeline"
  - "Kafka consumer retry (3× / 1s backoff) before drop"
  - "Isolated sensor simulator (dedicated Spring profile)"
---

Smart Building IoT is a Spring Boot backend designed to ingest, process, and store in real time temperature and humidity data from five simulated zones of a building (office, meeting room, corridor, server room, critical HVAC).

**Context and problem.** IoT systems must absorb a continuous stream of measurements from potentially unreliable sensors (malformed payloads, physically impossible readings) while staying responsive to abnormal conditions (overheating, excessive humidity). The core technical challenge isn't the ingestion itself, but the robustness of what happens after: how do you keep a single bad reading or a transient processing error from blocking the whole pipeline?

**Solution.** The project answers this with a three-stage decoupled pipeline: a REST endpoint accepts readings and hands them to a validation service, which rejects out-of-bounds values (-80°C to 150°C, 0-100% humidity) before any propagation; validated readings are published to Kafka (partitioned by device, keyed by `deviceId`); a consumer processes them asynchronously, retrying failed records a bounded number of times before logging and skipping them rather than blocking the topic, running simple anomaly detection, and persisting valid readings to MongoDB. A sensor simulator, isolated in its own Spring profile, demonstrates the end-to-end pipeline without real hardware by calling the exact same service layer as the REST endpoint.

**Benefits and honest scoping.** The result is a coherent, decoupled event pipeline, tested layer by layer (service, Kafka producer/consumer, REST controller), with realistic failure handling — input validation up front and a bounded, non-blocking retry policy on the consumer. This project also clearly owns its current limitations: it's a pure backend service with no graphical interface, anomaly detection is limited to a logged warning rather than a full alerting system, and no authentication is in place yet — all documented as areas for future work rather than hidden.
