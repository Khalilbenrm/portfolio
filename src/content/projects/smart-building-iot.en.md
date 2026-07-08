---
slug: "smart-building-iot"
name: "Smart Building IoT"
tagline: "Real-time event-driven pipeline for IoT sensor telemetry"
description: "Spring Boot backend ingesting temperature/humidity data from five zones of a building over MQTT, relaying it to Kafka for anomaly detection, then persisting it to MongoDB — exposed via an OpenAPI-documented REST API."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/smart-building-iot-java"
techStack:
  - category: "Language & Framework"
    items: ["Java 17", "Spring Boot 3.2.5", "Maven"]
  - category: "IoT Messaging"
    items: ["Eclipse Paho MQTT Client 1.2.5", "Mosquitto (MQTT broker)"]
  - category: "Streaming"
    items: ["Apache Kafka", "Spring Kafka", "Zookeeper"]
  - category: "Database"
    items: ["MongoDB", "Spring Data MongoDB"]
  - category: "API & Documentation"
    items: ["Spring Web (REST)", "springdoc-openapi 2.5.0 (Swagger UI)", "Bean Validation"]
  - category: "Observability"
    items: ["Spring Actuator (health, info)"]
  - category: "DevOps"
    items: ["Docker (multi-stage)", "Docker Compose (5 services)"]
  - category: "Tests"
    items: ["JUnit 5", "Mockito", "AssertJ", "spring-kafka-test", "@WebMvcTest / MockMvc"]
architectureFlow:
  - label: "Sensors"
    kind: "client"
    edgeLabel: "MQTT / REST"
    nodes:
      - icon: "Cpu"
        label: "IoT Sensors"
        specs: ["5 simulated zones", "Dedicated Spring profile"]
  - label: "Ingestion"
    kind: "gateway"
    edgeLabel: "after validation"
    nodes:
      - icon: "Radio"
        label: "MQTT Broker"
        specs: ["Mosquitto", "QoS 1"]
      - icon: "PlugZap"
        label: "REST API"
        specs: ["POST /api/sensors"]
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
architectureSummary:
  - "MQTT → Kafka → MongoDB pipeline"
  - "Automatic MQTT reconnection"
  - "Dual ingestion path (MQTT + REST)"
  - "Isolated sensor simulator"
  - "Docker Compose (5 services)"
---

Smart Building IoT is a Spring Boot backend designed to ingest, process, and store in real time temperature and humidity data from five simulated zones of a building (office, meeting room, corridor, server room, critical HVAC).

**Context and problem.** IoT systems must absorb a continuous stream of measurements from potentially unreliable sensors (connection loss, outlier data) while staying responsive to abnormal conditions (overheating, excessive humidity). The core technical challenge isn't the collection itself, but the robustness of the pipeline: what happens if a sensor loses its MQTT connection? If Kafka hits a processing error? If a reading is physically impossible?

**Solution.** The project answers these questions with a three-stage decoupled pipeline: an MQTT subscriber (Eclipse Paho) receives measurements and explicitly handles reconnection and re-subscription; a validation service rejects out-of-bounds values before any propagation; validated data flows through Kafka (partitioned by device, with a bounded retry policy) before being persisted to MongoDB. A sensor simulator, isolated in its own Spring profile, demonstrates the end-to-end pipeline without real hardware, never interfering with the consumer role thanks to mutually exclusive Spring profiles.

**Benefits and honest scoping.** The result is a coherent event pipeline, tested layer by layer, with realistic failure handling (MQTT reconnection, bounded Kafka retry). This project also clearly owns its current limitations: it's a pure backend service with no graphical interface, anomaly detection is limited to a logged warning rather than a full alerting system, and no authentication is in place yet — all documented as areas for future work rather than hidden.
