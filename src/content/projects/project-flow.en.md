---
slug: "project-flow"
name: "ProjectFlow"
tagline: "Project management platform built with a microservices architecture"
description: "A project management system (organizations, projects, tasks) built as 8 independent Spring Boot microservices: service discovery, API gateway, JWT authentication, event-driven messaging, and distributed observability."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/project-flow"
cover: "project-flow"
techStack:
  - category: "Language & Framework"
    items: ["Java 17", "Spring Boot 3.3.2", "Spring Cloud 2023.0.3", "Maven (multi-module)"]
  - category: "Distributed architecture"
    items: ["Spring Cloud Gateway", "Eureka (Service Discovery)", "Spring Cloud Config", "RestClient + @LoadBalanced"]
  - category: "Database"
    items: ["PostgreSQL 16", "Spring Data JPA / Hibernate", "Database-per-service"]
  - category: "Messaging"
    items: ["RabbitMQ", "Topic Exchange", "@RabbitListener"]
  - category: "Security"
    items: ["Spring Security 6", "OAuth2 Resource Server", "JWT (jjwt)", "BCrypt", "RBAC (@PreAuthorize)"]
  - category: "Observability"
    items: ["Micrometer", "Prometheus", "Zipkin / Brave", "Spring Actuator", "Grafana"]
  - category: "DevOps"
    items: ["Docker", "Docker Compose", "Multi-stage builds"]
  - category: "Documentation & Tests"
    items: ["springdoc-openapi (Swagger)", "JUnit 5", "Mockito"]
features:
  - icon: "Network"
    title: "Service discovery (Eureka)"
    description: "Every service registers with a Eureka discovery-server, enabling dynamic routing without hardcoded addresses."
  - icon: "ShieldCheck"
    title: "Defense-in-depth security"
    description: "The JWT is validated both at the gateway level (NimbusReactiveJwtDecoder) and at each business service (NimbusJwtDecoder), with RBAC via @PreAuthorize on sensitive operations."
  - icon: "Waypoints"
    title: "Centralized API Gateway"
    description: "Spring Cloud Gateway routes requests to the 5 business services and aggregates their OpenAPI documentation into a single Swagger entry point."
  - icon: "Database"
    title: "Database per service"
    description: "5 logically isolated PostgreSQL databases (auth, user, project, task, notification) on a single Postgres instance, each exclusively owned by its service."
  - icon: "Radio"
    title: "Asynchronous events"
    description: "RabbitMQ (projectflow.events topic exchange) broadcasts business events (registration, project/task creation) to the notification-service."
  - icon: "ActivitySquare"
    title: "Distributed observability"
    description: "Distributed tracing with Zipkin/Brave on 100% of requests and Prometheus metrics exposed by every service via Actuator."
  - icon: "KeyRound"
    title: "Complete JWT authentication"
    description: "Registration, login, BCrypt hashing, JWT issuance with a role claim, and refresh tokens persisted with a 7-day expiry."
  - icon: "Boxes"
    title: "Containerized deployment"
    description: "8 services + Postgres + RabbitMQ + Zipkin + Prometheus + Grafana orchestrated via a single docker-compose.yml with healthchecks."
architecture:
  overview: "ProjectFlow follows a classic three-tier microservices architecture: an infrastructure tier (Eureka, Gateway, Config Server), a business tier (5 independent services each owning their own database), and a cross-cutting observability tier (Prometheus, Zipkin, Grafana). Synchronous communication (validating that an organization or project exists) goes through load-balanced REST calls via Eureka; asynchronous communication (notifications) goes through RabbitMQ. Every service applies the same layered structure (domain / application / infrastructure / interfaces), which keeps the code predictable from one service to the next."
  layers:
    - name: "Interfaces (REST Controllers)"
      responsibility: "Exposes HTTP endpoints and deserializes requests, with no business logic (validation is delegated to the application layer)."
    - name: "Application (Services & DTOs)"
      responsibility: "Business logic, orchestration of inter-service REST calls, DTO construction, event publishing."
    - name: "Domain (Entities & Repositories)"
      responsibility: "JPA data model and access to the service's own database (Repository pattern)."
    - name: "Infrastructure (Security, Messaging, Clients)"
      responsibility: "Spring Security/OAuth2 configuration, RabbitMQ producers/consumers, RestClient clients to other services."
    - name: "Gateway (Edge Layer)"
      responsibility: "Single entry point: routing to services via Eureka, reactive JWT validation, OpenAPI documentation aggregation."
    - name: "Observability (Cross-cutting)"
      responsibility: "Actuator + Micrometer expose Prometheus metrics; Brave/Zipkin traces 100% of requests across all services."
  patterns:
    - name: "API Gateway"
      description: "Spring Cloud Gateway centralizes routing and avoids exposing internal services directly."
    - name: "Service Discovery"
      description: "Eureka enables dynamic routing by logical service name (lb://service-name) rather than fixed address."
    - name: "Database per Service"
      description: "Each business service owns its own logical database, guaranteeing loose coupling at the data level."
    - name: "Repository Pattern"
      description: "Every JPA entity is accessed through a dedicated Spring Data interface (UserAccountRepository, ProjectRepository, etc.)."
    - name: "DTO Pattern"
      description: "Incoming requests are mapped to dedicated DTOs before being processed by the service layer."
    - name: "Builder Pattern"
      description: "Entities use Lombok @Builder for immutable, readable construction."
    - name: "Global Exception Handler"
      description: "A @RestControllerAdvice per service (except notification-service) centralizes error handling into consistent HTTP responses."
    - name: "Event-Driven / Pub-Sub"
      description: "A RabbitMQ topic exchange broadcasts business events to dedicated queues consumed by the notification-service."
    - name: "Defense in Depth"
      description: "The JWT is independently revalidated by each service (OAuth2 Resource Server), not just at the gateway."
  solid:
    - principle: "Single Responsibility"
      application: "Each microservice has a single business responsibility (auth, organizations, projects, tasks, notifications)."
    - principle: "Open/Closed"
      application: "GlobalExceptionHandler and DTOs allow adding new use cases without modifying the controllers' core logic."
    - principle: "Liskov Substitution"
      application: "Spring Data repositories (JpaRepository<T, ID>) are substitutable and testable through standard interfaces."
    - principle: "Interface Segregation"
      application: "REST controllers only expose operations relevant to their resource, with no catch-all interface."
    - principle: "Dependency Inversion"
      application: "Constructor injection (@RequiredArgsConstructor) everywhere: services depend on abstractions (repositories, clients) rather than concrete implementations."
  diagrams:
    - title: "General architecture"
      description: "Overview of the 8 services and the cross-cutting infrastructure."
      diagram: |
        graph TD
          Client[Client / Frontend]
          GW[Gateway Service]
          EU[Discovery Server - Eureka]
          CFG[Config Server]

          subgraph Business Services
            AUTH[Auth Service]
            USER[User Service]
            PROJ[Project Service]
            TASK[Task Service]
            NOTIF[Notification Service]
          end

          subgraph Data
            PG[(PostgreSQL - 5 logical databases)]
          end

          subgraph Messaging
            MQ[(RabbitMQ - topic exchange)]
          end

          subgraph Observability
            PROM[Prometheus]
            ZIP[Zipkin]
            GRAF[Grafana]
          end

          Client --> GW
          GW --> AUTH
          GW --> USER
          GW --> PROJ
          GW --> TASK
          GW --> NOTIF
          AUTH -. registers .-> EU
          USER -. registers .-> EU
          PROJ -. registers .-> EU
          TASK -. registers .-> EU
          NOTIF -. registers .-> EU
          GW -. registers .-> EU

          AUTH --> PG
          USER --> PG
          PROJ --> PG
          TASK --> PG
          NOTIF --> PG

          AUTH -- user.registered --> MQ
          PROJ -- project.created --> MQ
          TASK -- task.created/assigned/completed --> MQ
          MQ --> NOTIF

          AUTH -.metrics/traces.-> PROM
          USER -.metrics/traces.-> PROM
          PROJ -.metrics/traces.-> PROM
          TASK -.metrics/traces.-> PROM
          NOTIF -.metrics/traces.-> PROM
          PROM --> GRAF
          AUTH -.traces.-> ZIP
          PROJ -.traces.-> ZIP
          TASK -.traces.-> ZIP
    - title: "Request flow (task creation)"
      description: "Complete sequence from the client to the asynchronous notification."
      diagram: |
        sequenceDiagram
          participant C as Client
          participant G as Gateway
          participant T as Task Service
          participant P as Project Service
          participant DB as PostgreSQL (task_db)
          participant MQ as RabbitMQ
          participant N as Notification Service

          C->>G: POST /tasks (JWT)
          G->>G: JWT validation (NimbusReactiveJwtDecoder)
          G->>T: Route to lb://task-service
          T->>T: JWT revalidation (Resource Server)
          T->>P: GET /projects/{id} (RestClient, lb://project-service)
          P-->>T: 200 OK (project exists)
          T->>DB: INSERT TaskItem
          DB-->>T: Task persisted
          T->>MQ: publish task.created
          T-->>G: 201 Created
          G-->>C: 201 Created
          MQ->>N: consume task.created
          N->>N: Persist NotificationLog
    - title: "Layered architecture of a business service"
      description: "Identical internal structure applied to every service (e.g. task-service)."
      diagram: |
        graph TD
          REST[interfaces.rest - TaskController]
          SVC[application.service - TaskService]
          DTO[application.dto]
          DOM[domain.model - TaskItem]
          REPO[domain.repository - TaskRepository]
          CLIENT[infrastructure.client - ProjectClient]
          SEC[infrastructure.security - JWT Resource Server]
          MSG[infrastructure.messaging - TaskEventPublisher]

          REST --> SVC
          SVC --> DTO
          SVC --> REPO
          SVC --> CLIENT
          SVC --> MSG
          REPO --> DOM
          SEC --> REST
    - title: "Inter-service communication"
      description: "Synchronous calls (REST via Eureka) vs. asynchronous events (RabbitMQ)."
      diagram: |
        graph LR
          TASK[Task Service] -- REST sync: GET /projects/id --> PROJ[Project Service]
          PROJ -- REST sync: GET /organizations/id --> USER[User Service]
          AUTH[Auth Service] -- event: user.registered --> EX{{Topic Exchange projectflow.events}}
          PROJ -- event: project.created --> EX
          TASK -- event: task.created/assigned/completed --> EX
          EX -- queue bindings --> NOTIF[Notification Service]
    - title: "Data model (per service)"
      description: "One logical database per service on a shared PostgreSQL instance, with no cross-database foreign keys."
      diagram: |
        erDiagram
          ORGANIZATION {
            long id
            string name
            string description
            string createdBy
            datetime createdAt
          }
          PROJECT {
            long id
            string name
            string description
            long organizationId
            string createdBy
            datetime createdAt
          }
          TASK {
            long id
            string title
            string status
            string priority
            date dueDate
            long projectId
            string assigneeEmail
          }
          USER_ACCOUNT {
            long id
            string email
            string passwordHash
            string role
            string refreshToken
          }
          ORGANIZATION ||--o{ PROJECT : "organizationId (validated via REST, no FK)"
          PROJECT ||--o{ TASK : "projectId (validated via REST, no FK)"
structure:
  tree: |
    project-flow/
    ├── pom.xml                    # Parent POM (Maven reactor, 8 modules)
    ├── docker-compose.yml         # Postgres, RabbitMQ, 8 services, Zipkin, Prometheus, Grafana
    ├── docs/architecture.md       # Source architecture diagrams
    ├── postgres/init-databases.sh # Creates the 5 logical databases
    ├── monitoring/prometheus.yml  # Scrape configuration
    ├── discovery-server/          # Eureka server
    ├── config-server/             # Spring Cloud Config (scaffolded, disabled by consumers)
    ├── gateway-service/           # Spring Cloud Gateway + reactive JWT security
    ├── auth-service/
    │   └── src/main/java/.../auth/
    │       ├── domain/{model, repository}
    │       ├── application/{dto, service}
    │       ├── infrastructure/{security, messaging, exception}
    │       └── interfaces/rest/AuthController.java
    ├── user-service/              # Organizations
    ├── project-service/           # Projects + OrganizationClient
    ├── task-service/              # Tasks + ProjectClient
    └── notification-service/      # RabbitMQ consumers + notification log
  notes:
    - path: "domain/"
      description: "JPA entities and Repository interfaces — the business core, independent of the web framework."
    - path: "application/"
      description: "Services orchestrating business logic and input/output DTOs."
    - path: "infrastructure/"
      description: "Technical details: JWT security, inter-service REST clients, RabbitMQ producers/consumers."
    - path: "interfaces/rest/"
      description: "REST controllers, a thin HTTP presentation layer with no business logic."
workflow:
  - step: "1. Client request"
    description: "The client (frontend or Swagger) sends an HTTP request with a JWT to the Gateway."
  - step: "2. Validation & routing"
    description: "The Gateway reactively validates the JWT then routes the request to the relevant service via Eureka."
  - step: "3. Revalidation & business logic"
    description: "The target service revalidates the JWT (defense in depth), applies its business logic, and if needed, synchronously calls another service to validate a reference (e.g. task → project)."
  - step: "4. Persistence"
    description: "The service persists the entity in its dedicated PostgreSQL database."
  - step: "5. Event publishing"
    description: "A business event is published on the RabbitMQ exchange (e.g. task.created)."
  - step: "6. Response & asynchronous notification"
    description: "The HTTP response is returned to the client while the notification-service consumes the event in the background."
challenges:
  - problem: "Validating inter-service references without a distributed transaction (e.g. a task references a project in another database)."
    solution: "Synchronous validation via RestClient + Eureka at write time, accepting eventual consistency rather than a cross-database ACID transaction."
  - problem: "Propagating user identity across multiple services without full re-authentication."
    solution: "Forwarding the original Authorization header between services, combined with independent JWT revalidation at every level (gateway + service)."
  - problem: "Isolating data per service while keeping the infrastructure simple to deploy."
    solution: "A single PostgreSQL instance with 5 logical databases created at startup via an initialization script, rather than 5 separate physical instances."
  - problem: "Ensuring full visibility into a distributed system during development."
    solution: "Systematic instrumentation of every service with Micrometer/Prometheus and distributed Zipkin/Brave tracing at 100% sampling."
optimizations:
  performance:
    - "Load-balanced inter-service calls via Eureka to spread load across instances."
    - "Dedicated database per service, avoiding contention locks on a single shared database."
  security:
    - "JWT independently revalidated at every level (gateway + service) rather than implicit trust after the gateway."
    - "Passwords hashed with BCrypt, never stored in plain text."
    - "RBAC via @PreAuthorize on destructive operations (DELETE)."
  maintainability:
    - "Identical layered structure reproduced in every service, reducing the cognitive load of navigating from one service to another."
    - "DTOs kept separate from entities so the persistence model is never exposed over the network."
  scalability:
    - "Each service can be scaled independently thanks to Eureka and per-database decoupling."
    - "Asynchronous communication (RabbitMQ) for notifications, decoupling their processing from the request's critical path."
  quality:
    - "Mockito unit tests per business service at the service layer."
    - "OpenAPI documentation generated and automatically aggregated via the Gateway."
gallery:
  - caption: "Aggregated Swagger view via the Gateway"
  - caption: "Grafana dashboard / Prometheus metrics"
  - caption: "Zipkin distributed traces"
  - caption: "Docker Compose — services running"
learnings:
  - "Designing a coherent microservices architecture: service discovery, gateway, sync/async communication."
  - "Implementing defense-in-depth for JWT security rather than trusting the gateway alone."
  - "Managing data consistency across isolated databases without a classic distributed transaction."
  - "Instrumenting a distributed system with metrics and tracing from the design stage."
  - "Structuring a multi-module Maven monorepo with a reproducible layered organization."
caveats:
  - "The Config Server is present in the architecture but currently disabled by every consuming service (spring.cloud.config.enabled=false) and points to a shared configuration folder that doesn't exist yet in the repository."
  - "No resilience mechanism (circuit breaker / retry) wraps the synchronous inter-service REST calls."
  - "Tests are unit-level only (Mockito); no integration or end-to-end tests are present despite the declared Testcontainers dependency."
  - "The JWT secret is currently a hardcoded value, identical across every service — it should be externalized via environment variables before any real production deployment."
---

ProjectFlow is a project management system built to explore, under realistic conditions, the real challenges of a microservices architecture: service discovery, centralized routing, data consistency across isolated databases, distributed security, and observability.

**Context and goals.** The project starts from a simple functional need — letting organizations create projects and assign tasks to them — in order to focus on the underlying architectural question: how to split this domain into independent services without sacrificing consistency or security. The goal wasn't functional richness, but the solidity of the distributed foundations.

**Solution.** The system is split into five business services (authentication, organizations, projects, tasks, notifications) and three infrastructure services (Eureka registry, gateway, config server). Each business service owns its own logical PostgreSQL database and applies an identical layered structure (domain, application, infrastructure, interfaces), which keeps the code predictable from one service to the next. Communication between services combines synchronous REST calls — to validate references (a task must reference an existing project) — with asynchronous messaging via RabbitMQ for notifications, decoupling that processing from the request's critical path.

**Benefits.** This architecture demonstrates real defense in depth (the JWT is revalidated at every level, not just at the gateway), observability designed in from the start (Prometheus metrics and Zipkin tracing on 100% of requests across all services), and data isolation that would allow each service to evolve independently. It's also an honest exercise: some building blocks, like the Config Server, are scaffolded but not yet wired up — a deliberate, disclosed choice rather than a hidden one, documented as an area for improvement.
