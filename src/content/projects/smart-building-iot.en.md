---
slug: "smart-building-iot"
name: "Smart Building IoT"
tagline: "Real-time event-driven pipeline for IoT sensor telemetry"
description: "Spring Boot backend ingesting temperature/humidity data from five zones of a building over MQTT, relaying it to Kafka for anomaly detection, then persisting it to MongoDB — exposed via an OpenAPI-documented REST API."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/smart-building-iot-java"
cover: "smart-building-iot"
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
features:
  - icon: "Radio"
    title: "Real-time MQTT ingestion"
    description: "An MQTT subscriber (SensorDataMqttSubscriber) listens on the wildcard topic iot/sensors/+/data at QoS 1 and processes every incoming message."
  - icon: "Workflow"
    title: "MQTT → Kafka → MongoDB event pipeline"
    description: "Each validated reading is republished to a Kafka topic (iot-sensor-data, 3 partitions, key = deviceId) before being persisted to MongoDB, decoupling ingestion from processing."
  - icon: "AlertTriangle"
    title: "Threshold-based anomaly detection"
    description: "The Kafka consumer flags (WARN log) temperatures > 30°C and humidity > 80%, without yet triggering a structured alert (a known, documented limitation)."
  - icon: "PlugZap"
    title: "Dual ingestion path"
    description: "Data can arrive via MQTT or directly through the REST endpoint POST /api/sensors/data, both converging on the same validation service."
  - icon: "Cpu"
    title: "Dedicated sensor simulator"
    description: "An isolated Spring 'simulator' profile publishes realistic random readings for 5 zones (office, meeting room, corridor, server room, critical HVAC), never self-consuming thanks to mutually exclusive Spring profiles."
  - icon: "FileSearch2"
    title: "Historical query API"
    description: "GET endpoints to query readings by device and by time range, indexed in the database for efficient queries."
  - icon: "ShieldAlert"
    title: "Strict data validation"
    description: "Realistic bounds (-80°C to 150°C, 0-100% humidity) applied before any Kafka publication, with dedicated exceptions and uniform error responses."
  - icon: "RefreshCw"
    title: "MQTT connection resilience"
    description: "Automatic Paho reconnection combined with explicit topic re-subscription, since auto-reconnect doesn't restore subscriptions by default."
architecture:
  overview: "This project is a single Spring Boot monolith (not a microservices architecture) organized around a three-stage event pipeline: ingestion (MQTT or REST), transport (Kafka), and persistence (MongoDB). Two mutually exclusive Spring profiles allow running either the full application (ingestion + processing + API) or a standalone simulator that only publishes fake data over MQTT — preventing a single process from feeding itself. There is no graphical interface: it's a pure backend service, exposing only a REST API and generated Swagger documentation."
  layers:
    - name: "Simulation (simulator profile)"
      responsibility: "Generates realistic temperature/humidity readings for 5 zones via a ScheduledExecutorService and publishes them over MQTT."
    - name: "MQTT Ingestion"
      responsibility: "SensorDataMqttSubscriber listens to the Mosquitto broker, deserializes JSON messages, and forwards them to the service layer."
    - name: "REST API"
      responsibility: "SensorDataController exposes an alternative ingestion path (POST) and query endpoints (GET), with no business logic of its own."
    - name: "Business Service"
      responsibility: "SensorDataService validates the physical bounds of the data, timestamps it server-side, then delegates Kafka publishing."
    - name: "Kafka Streaming"
      responsibility: "SensorDataProducer publishes to the iot-sensor-data topic (key = deviceId for per-device ordering); SensorDataConsumer consumes, detects anomalies, and persists."
    - name: "MongoDB Persistence"
      responsibility: "SensorDataRepository (Spring Data MongoDB) stores every reading in the sensor_data collection, indexed on deviceId and timestamp."
  patterns:
    - name: "Observer"
      description: "SensorDataMqttSubscriber implements MqttCallbackExtended, registered as a callback with the Paho client to react to incoming messages."
    - name: "Repository"
      description: "SensorDataRepository extends MongoRepository with derived queries (findByDeviceId, findByTimestampBetween)."
    - name: "DTO / Entity Mapping"
      description: "SensorDataDto and SensorDataEntity are two distinct classes linked by explicit mapping methods (fromEntity), rather than one shared class."
    - name: "Global Exception Handler"
      description: "A @RestControllerAdvice centralizes validation errors and business exceptions (InvalidSensorDataException) into uniform HTTP responses."
    - name: "Mutually Exclusive Profiles"
      description: "@Profile(\"!simulator\") on the MQTT subscriber and @Profile(\"simulator\") on the simulator guarantee that only one role runs per process, preventing a self-ingestion loop."
    - name: "Qualifier-based DI"
      description: "A dedicated ObjectMapper (@Qualifier(\"kafkaObjectMapper\")) is explicitly injected everywhere JSON serialization is needed, to avoid any conflict with Spring MVC's default ObjectMapper."
  solid:
    - principle: "Single Responsibility"
      application: "Every class has a single, named role: the controller only does HTTP, the service only validates/orchestrates, the Kafka producer/consumer only transports."
    - principle: "Open/Closed"
      application: "New sensor types or validation rules can be added without modifying the existing Kafka processing flow."
    - principle: "Liskov Substitution"
      application: "SensorDataRepository follows the standard MongoRepository contract, fully substitutable in tests via a mock."
    - principle: "Interface Segregation"
      application: "SensorDataService exposes a dedicated interface (SensorDataServiceImpl) limited to ingestion and query operations, with no superfluous methods."
    - principle: "Dependency Inversion"
      application: "Constructor injection (@RequiredArgsConstructor) everywhere: the controller depends on the SensorDataService interface, not its implementation."
  diagrams:
    - title: "General architecture"
      description: "The two Spring profiles (main application and simulator) and their MQTT convergence point."
      diagram: |
        graph TD
          subgraph "Profile: simulator"
            SIM[IotSensorSimulator - ScheduledExecutorService]
          end

          MQ[(Mosquitto Broker - QoS 1)]

          subgraph "Profile: default"
            SUB[SensorDataMqttSubscriber]
            API[SensorDataController - POST /api/sensors/data]
            SVC[SensorDataService]
            PROD[SensorDataProducer]
            KAFKA[(Kafka - topic iot-sensor-data, 3 partitions)]
            CONS[SensorDataConsumer]
            MONGO[(MongoDB - collection sensor_data)]
          end

          SIM -- publish iot/sensors/deviceId/data --> MQ
          MQ -- subscribe iot/sensors/+/data --> SUB
          SUB --> SVC
          API --> SVC
          SVC --> PROD
          PROD --> KAFKA
          KAFKA --> CONS
          CONS -- detectAnomalies WARN log --> CONS
          CONS --> MONGO
    - title: "Sensor reading flow (workflow)"
      description: "From the simulated sensor to persistence, including anomaly detection."
      diagram: |
        sequenceDiagram
          participant S as IotSensorSimulator
          participant M as Mosquitto
          participant Sub as MQTT Subscriber
          participant Svc as SensorDataService
          participant P as Kafka Producer
          participant K as Kafka Topic
          participant C as Kafka Consumer
          participant DB as MongoDB

          S->>M: publish iot/sensors/server-room-01/data (QoS1)
          M->>Sub: messageArrived()
          Sub->>Svc: ingestSensorData(dto)
          Svc->>Svc: validate bounds (-80/150°C, 0-100%)
          Svc->>Svc: timestamp (Instant.now())
          Svc->>P: sendSensorData(dto)
          P->>K: publish (key=deviceId)
          K->>C: consume()
          C->>C: detectAnomalies() (WARN if threshold exceeded)
          C->>DB: save(SensorDataEntity)
    - title: "Layered backend architecture"
      description: "Internal organization of the service (com.smariot package)."
      diagram: |
        graph TD
          CTRL[controller.SensorDataController]
          SVC[service.SensorDataServiceImpl]
          MQTT[mqtt.SensorDataMqttSubscriber]
          KPROD[kafka.producer.SensorDataProducer]
          KCONS[kafka.consumer.SensorDataConsumer]
          REPO[repository.SensorDataRepository]
          DTO[model.dto.SensorDataDto]
          ENT[model.entity.SensorDataEntity]
          EXC[exception.GlobalExceptionHandler]

          CTRL --> SVC
          MQTT --> SVC
          SVC --> DTO
          SVC --> KPROD
          KPROD --> KCONS
          KCONS --> REPO
          REPO --> ENT
          EXC -.intercepts.-> CTRL
    - title: "Communication between components"
      description: "MQTT for ingestion, Kafka for internal decoupling, REST for read access."
      diagram: |
        graph LR
          Sensors["Sensors / Simulator"] -- MQTT QoS1 --> Broker[(Mosquitto)]
          Broker -- wildcard iot/sensors/+/data --> App[Spring Boot Application]
          Client["REST Client"] -- POST/GET /api/sensors --> App
          App -- topic iot-sensor-data --> KafkaBroker[(Kafka)]
          KafkaBroker -- consume --> App
          App -- persist --> Mongo[(MongoDB)]
    - title: "Data model"
      description: "Flat structure for sensor data, with no Room/Building hierarchy (inference: the 'zone' is only a deviceId naming convention)."
      diagram: |
        erDiagram
          SENSOR_DATA {
            string id
            string deviceId
            double temperature
            double humidity
            instant timestamp
          }
structure:
  tree: |
    smart-building-iot-java/
    ├── pom.xml                   # Spring Boot 3.2.5, Java 17, Paho 1.2.5, springdoc 2.5.0
    ├── Dockerfile                 # multi-stage: maven build -> eclipse-temurin jre runtime
    ├── docker-compose.yml         # zookeeper, kafka, mosquitto, mongo, app
    ├── mosquitto/mosquitto.conf   # listener 1883, allow_anonymous true, persistence false
    ├── README.md
    ├── src/main/java/com/smariot/
    │   ├── SmartIotApplication.java
    │   ├── config/                # Kafka, Mongo, MQTT, OpenAPI
    │   ├── controller/SensorDataController.java
    │   ├── exception/             # GlobalExceptionHandler, InvalidSensorDataException
    │   ├── kafka/{consumer, producer}/
    │   ├── model/{dto, entity}/
    │   ├── mqtt/SensorDataMqttSubscriber.java
    │   ├── repository/SensorDataRepository.java
    │   ├── service/               # SensorDataService, SensorDataServiceImpl
    │   └── simulator/IotSensorSimulator.java
    ├── src/main/resources/        # application.yml, application-local.yml
    └── src/test/java/com/smariot/ # tests per layer (controller, kafka, mqtt, service)
  notes:
    - path: "mqtt/"
      description: "Real-time entry point: MQTT subscription and reconnection handling."
    - path: "kafka/"
      description: "Producer and consumer ensuring decoupling between ingestion and persistence."
    - path: "simulator/"
      description: "Fake data generator, active only under the Spring 'simulator' profile."
    - path: "config/"
      description: "Explicit configuration for each technical integration (MQTT, Kafka, Mongo, OpenAPI) — no implicit configuration."
workflow:
  - step: "1. Signal generation / reception"
    description: "The simulator generates a random reading (or a real sensor publishes) on the MQTT topic iot/sensors/{deviceId}/data."
  - step: "2. MQTT subscription"
    description: "SensorDataMqttSubscriber receives the message via the Paho callback and deserializes it into a DTO."
  - step: "3. Business validation"
    description: "SensorDataService checks realistic physical bounds and rejects outlier values before any publishing."
  - step: "4. Kafka transport"
    description: "The validated reading is published to the iot-sensor-data topic, partitioned by deviceId to preserve per-device ordering."
  - step: "5. Anomaly detection"
    description: "The Kafka consumer applies thresholds (temperature/humidity) and logs a warning if they're exceeded."
  - step: "6. Persistence & querying"
    description: "The reading is stored in MongoDB, then queryable via the GET endpoints (by device or by time range)."
challenges:
  - problem: "Preventing a single process from self-feeding by consuming the data it just published."
    solution: "Two mutually exclusive Spring profiles (@Profile(\"simulator\") vs @Profile(\"!simulator\")) physically separating the generator role from the consumer role."
  - problem: "The MQTT client's (Paho) automatic reconnection doesn't restore existing subscriptions."
    solution: "Explicit implementation of connectComplete(reconnect=true) that manually re-subscribes to the topic after a reconnection."
  - problem: "Keeping JSON serialization consistent across REST, MQTT, and Kafka (especially for Instant types)."
    solution: "A single qualified ObjectMapper (kafkaObjectMapper) with the JavaTimeModule, explicitly injected everywhere it's needed."
  - problem: "Absorbing Kafka processing failures without blocking the pipeline."
    solution: "DefaultErrorHandler with FixedBackOff (3 attempts, 1s interval) before giving up and logging, at the cost of not having a dead-letter queue."
optimizations:
  performance:
    - "Kafka partitioning by deviceId guaranteeing per-device message ordering without blocking other devices."
    - "MongoDB indexes on deviceId and timestamp to speed up historical queries."
  security:
    - "Strict validation of physical bounds before any propagation into the pipeline."
  maintainability:
    - "DTO/Entity separation with explicit mapping rather than a single class, limiting side effects between the API layer and the persistence layer."
    - "Explicit configuration per integration (MqttConfig, KafkaProducerConfig, KafkaConsumerConfig, MongoConfig) rather than scattered implicit values."
  scalability:
    - "The MQTT → Kafka → MongoDB decoupling absorbs ingestion spikes without blocking the persistence layer."
    - "The number of Kafka partitions (3) allows consumption parallelism."
  quality:
    - "Unit test coverage across every layer: controller (@WebMvcTest), service, producer, consumer, and MQTT subscriber (Mockito)."
gallery:
  - caption: "Swagger UI — /api/sensors endpoints"
  - caption: "Anomaly detection logs (WARN)"
  - caption: "Docker Compose — zookeeper, kafka, mosquitto, mongo, app"
learnings:
  - "Building a real-time event pipeline combining MQTT (edge) and Kafka (internal backbone)."
  - "Managing MQTT connection resilience (reconnection, re-subscription) beyond the happy path."
  - "Isolating a load simulator from the real processing path via Spring profiles, without fragile conditional code."
  - "Designing realistic physical data validation before propagation into a distributed pipeline."
caveats:
  - "This project is a headless backend: no graphical interface (no JavaFX, no frontend) is present in the repository, despite the name \"Smart Building\" possibly suggesting otherwise."
  - "Anomaly detection is limited to a WARN log — no alert entity, no notification, no dedicated Kafka alert topic exists yet (an improvement listed in the original README)."
  - "No authentication is in place: the REST API is open, the MQTT broker accepts anonymous unencrypted connections, and Kafka defines no ACLs."
  - "The domain model remains flat (a single SensorData type): the building's \"zones\" are only a deviceId naming convention, with no dedicated Room/Building/Device entity."
---

Smart Building IoT is a Spring Boot backend designed to ingest, process, and store in real time temperature and humidity data from five simulated zones of a building (office, meeting room, corridor, server room, critical HVAC).

**Context and problem.** IoT systems must absorb a continuous stream of measurements from potentially unreliable sensors (connection loss, outlier data) while staying responsive to abnormal conditions (overheating, excessive humidity). The core technical challenge isn't the collection itself, but the robustness of the pipeline: what happens if a sensor loses its MQTT connection? If Kafka hits a processing error? If a reading is physically impossible?

**Solution.** The project answers these questions with a three-stage decoupled pipeline: an MQTT subscriber (Eclipse Paho) receives measurements and explicitly handles reconnection and re-subscription; a validation service rejects out-of-bounds values before any propagation; validated data flows through Kafka (partitioned by device, with a bounded retry policy) before being persisted to MongoDB. A sensor simulator, isolated in its own Spring profile, demonstrates the end-to-end pipeline without real hardware, never interfering with the consumer role thanks to mutually exclusive Spring profiles.

**Benefits and honest scoping.** The result is a coherent event pipeline, tested layer by layer, with realistic failure handling (MQTT reconnection, bounded Kafka retry). This project also clearly owns its current limitations: it's a pure backend service with no graphical interface, anomaly detection is limited to a logged warning rather than a full alerting system, and no authentication is in place yet — all documented as areas for future work rather than hidden.
