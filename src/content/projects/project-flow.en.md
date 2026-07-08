---
slug: "project-flow"
name: "ProjectFlow"
tagline: "Project management platform built with a microservices architecture"
description: "A project management system (organizations, projects, tasks) built as 8 independent Spring Boot microservices: service discovery, API gateway, JWT authentication, event-driven messaging, and distributed observability."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/project-flow"
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
        specs: ["Spring Cloud Gateway", "Eureka"]
  - label: "Business services"
    kind: "service"
    edgeLabel: "REST + events"
    nodes:
      - icon: "KeyRound"
        label: "Auth Service"
        specs: ["OAuth2", "BCrypt"]
      - icon: "User"
        label: "User Service"
        specs: ["Organizations"]
      - icon: "FolderKanban"
        label: "Project Service"
        specs: ["Project CRUD"]
      - icon: "ListChecks"
        label: "Task Service"
        specs: ["Task CRUD"]
      - icon: "Bell"
        label: "Notification Service"
        specs: ["Async consumer"]
  - label: "Data & messaging"
    kind: "data"
    edgeLabel: "metrics + traces"
    nodes:
      - icon: "Database"
        label: "PostgreSQL"
        specs: ["1 DB / service", "JPA"]
      - icon: "Radio"
        label: "RabbitMQ"
        specs: ["Topic exchange"]
  - label: "Observability"
    kind: "observability"
    nodes:
      - icon: "Activity"
        label: "Prometheus"
        specs: ["Metrics"]
      - icon: "GitBranch"
        label: "Zipkin"
        specs: ["100% tracing"]
      - icon: "BarChart3"
        label: "Grafana"
        specs: ["Dashboards"]
architectureSummary:
  - "8 Spring Boot services"
  - "Database-per-service (PostgreSQL)"
  - "JWT + OAuth2 (defense in depth)"
  - "RabbitMQ (event-driven)"
  - "Zipkin + Prometheus + Grafana"
  - "Docker Compose"
---

ProjectFlow is a project management system built to explore, under realistic conditions, the real challenges of a microservices architecture: service discovery, centralized routing, data consistency across isolated databases, distributed security, and observability.

**Context and goals.** The project starts from a simple functional need — letting organizations create projects and assign tasks to them — in order to focus on the underlying architectural question: how to split this domain into independent services without sacrificing consistency or security. The goal wasn't functional richness, but the solidity of the distributed foundations.

**Solution.** The system is split into five business services (authentication, organizations, projects, tasks, notifications) and three infrastructure services (Eureka registry, gateway, config server). Each business service owns its own logical PostgreSQL database and applies an identical layered structure (domain, application, infrastructure, interfaces), which keeps the code predictable from one service to the next. Communication between services combines synchronous REST calls — to validate references (a task must reference an existing project) — with asynchronous messaging via RabbitMQ for notifications, decoupling that processing from the request's critical path.

**Benefits.** This architecture demonstrates real defense in depth (the JWT is revalidated at every level, not just at the gateway), observability designed in from the start (Prometheus metrics and Zipkin tracing on 100% of requests across all services), and data isolation that would allow each service to evolve independently. It's also an honest exercise: some building blocks, like the Config Server, are scaffolded but not yet wired up — a deliberate, disclosed choice rather than a hidden one, documented as an area for improvement.
