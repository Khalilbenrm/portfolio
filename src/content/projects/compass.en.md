---
slug: "compass"
name: "Compass"
tagline: "Project & task management platform built as a microservices system"
description: "A project & task management platform (organizations, projects, tasks) built as 8 independent Spring Boot microservices: service discovery, API gateway, JWT authentication, RabbitMQ event-driven messaging, and a pre-provisioned Prometheus/Grafana monitoring stack."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/compass"
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
    items: ["Spring Security 6", "OAuth2 Resource Server", "JWT (jjwt 0.12.5)"]
  - category: "Observability"
    items: ["Micrometer", "Prometheus", "Grafana (provisioned dashboard)", "Spring Actuator"]
  - category: "DevOps"
    items: ["Docker (multi-stage builds)", "Docker Compose (12 services)"]
  - category: "Documentation & Tests"
    items: ["springdoc-openapi (aggregated Swagger)", "JUnit 5", "Mockito", "Testcontainers"]
architectureDescription: "Follow one request end to end: the client sends an HTTPS call with a JWT to the gateway, which resolves the target service by name through Eureka and forwards it. Each business service revalidates that JWT independently, calls a neighbor synchronously only to check a reference exists (does this project's organization exist? does this task's project exist?), and publishes what just happened — a signup, a creation, a status change — onto RabbitMQ instead of blocking on who's listening. Every service also feeds Prometheus, which powers the Grafana dashboard shown below the diagram."
architectureFlow:
  - label: "Client"
    kind: "client"
    edgeLabel: "HTTPS + JWT"
    nodes:
      - icon: "Users"
        label: "Client / Frontend"
        specs: ["HTTPS", "JWT Bearer"]
  - label: "Gateway"
    kind: "gateway"
    edgeLabel: "lb:// routing"
    nodes:
      - icon: "Waypoints"
        label: "API Gateway"
        specs: ["Spring Cloud Gateway", "Eureka", "Aggregated Swagger"]
  - label: "Business services"
    kind: "service"
    edgeLabel: "REST + events"
    nodes:
      - icon: "KeyRound"
        label: "Auth Service"
        specs: ["Register/login", "Refresh tokens"]
      - icon: "User"
        label: "User Service"
        specs: ["Organizations"]
      - icon: "FolderKanban"
        label: "Project Service"
        specs: ["Project CRUD"]
      - icon: "ListChecks"
        label: "Task Service"
        specs: ["Status, priority, assignment"]
      - icon: "Bell"
        label: "Notification Service"
        specs: ["Async consumer"]
  - label: "Data & messaging"
    kind: "data"
    edgeLabel: "metrics"
    nodes:
      - icon: "Database"
        label: "PostgreSQL"
        specs: ["1 DB / service", "JPA"]
      - icon: "Radio"
        label: "RabbitMQ"
        specs: ["compass.events topic"]
  - label: "Observability"
    kind: "observability"
    nodes:
      - icon: "Activity"
        label: "Prometheus"
        specs: ["15s scrape"]
      - icon: "BarChart3"
        label: "Grafana"
        specs: ["Compass Overview dashboard"]
architectureInfra:
  - icon: "Container"
    label: "Docker"
    specs: ["multi-stage builds"]
  - icon: "Boxes"
    label: "Docker Compose"
    specs: ["12 services, one command"]
architectureSummary:
  - "8 Spring Boot services, one-command bootstrap"
  - "Database-per-service (PostgreSQL 16)"
  - "JWT + OAuth2 Resource Server (defense in depth)"
  - "RabbitMQ event-driven (compass.events)"
  - "Prometheus + Grafana, dashboard pre-provisioned"
  - "Testcontainers-backed integration tests"
lessonsLearned:
  - title: "Designing a microservices architecture"
    description: "Learned how to split a single domain into independent services, each with its own database, and connect them with service discovery (Eureka) and an API gateway."
  - title: "Securing a distributed system"
    description: "Practiced validating a JWT independently in every service instead of only once at the gateway, and understood why that redundancy matters."
  - title: "Choosing between REST and events"
    description: "Learned when to use a synchronous REST call (I need an answer now) versus an asynchronous RabbitMQ event (something happened, others can react later)."
  - title: "Integration testing with Testcontainers"
    description: "Started writing integration tests against a real PostgreSQL instance instead of mocking the database, and caught bugs mocks wouldn't have shown."
  - title: "Setting up monitoring"
    description: "Learned to expose metrics with Spring Actuator/Micrometer and wire them into Prometheus and a Grafana dashboard."
---

Compass is a project & task management platform (organizations, projects, tasks) built to work through, under realistic conditions, the actual problem behind a "let's split it into microservices" decision: decomposing a single monolithic domain into independently deployable services without breaking data consistency, security, or the operator's ability to actually run the result.

**Context and problem.** The functional need is deliberately simple — organizations create projects and assign tasks to them — because the problem isn't the business logic, it's what happens to that logic once it's pulled apart: each domain concept (auth, organizations, projects, tasks, notifications) turns from an in-process call into a network call, each piece needs its own database instead of sharing one, and a request that used to be a single transaction now crosses process boundaries where partial failure, service discovery, and trust between services all become real concerns. That's the monolith-to-microservices migration path Compass sets out to demonstrate credibly, not just diagram. This is also the second, refined pass at that same decomposition exercise, closing gaps an earlier attempt left open: no one-command bootstrap, no dashboards ready out of the box, and integration tests that mocked the database away instead of exercising it.

**Solution.** Five business services (auth, user/organizations, project, task, notification) sit behind a Spring Cloud Gateway that resolves them by name through Eureka and aggregates their OpenAPI specs into a single Swagger UI. Each service owns its own PostgreSQL database and validates the caller's JWT independently as an OAuth2 resource server, even though the gateway already checked it once. Synchronous REST calls (project-service → user-service, task-service → project-service) validate that referenced entities exist before a write is accepted; everything that has *happened* — a user registered, a project created, a task assigned or completed — is published on a `compass.events` topic exchange and turned into a notification log entry asynchronously. The whole stack, plus Postgres, RabbitMQ, Prometheus, and a Grafana instance with a **Compass Overview** dashboard already provisioned, comes up with a single `docker compose up --build`; a documented curl golden path walks through register → organization → project → task → notification end to end.

**Benefits and honest scoping.** The split pays off exactly where a monolith would have struggled: each service scales, deploys, and fails independently, data ownership per service prevents a schema change in one domain from rippling into another, and the JWT is revalidated at every hop instead of being trusted once at the front door. Compared to the earlier version of this same migration exercise, the gains are operational: a genuine one-command bootstrap instead of a set of instructions to follow in the right order, dashboards that exist the moment the stack is up instead of a Prometheus endpoint nobody looks at, and integration tests built on Testcontainers that run against a real Postgres instance rather than an in-memory stand-in. What a monolith gets for free — a single transaction across the whole domain — is deliberately not simulated away: cross-service consistency here is handled explicitly, through synchronous validation calls and asynchronous events, not hidden behind an ORM. The Config Server ships wired into the stack but each service still resolves its own `application.yml` locally (`cloud.config.enabled: false`) — the same disclosed, not-yet-flipped switch as before. One new limitation is also documented rather than hidden: `config-server`'s own `/actuator/prometheus` endpoint isn't scraped, because Spring Cloud Config's generic `/{application}/{profile}` routing intercepts the path before Actuator gets to handle it.
