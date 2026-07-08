---
slug: "project-flow"
name: "ProjectFlow"
tagline: "Plateforme de gestion de projets en architecture microservices"
description: "Système de gestion de projets (organisations, projets, tâches) construit comme 8 microservices Spring Boot indépendants : découverte de services, passerelle API, authentification JWT, messagerie événementielle et observabilité distribuée."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/project-flow"
techStack:
  - category: "Langage & Framework"
    items: ["Java 17", "Spring Boot 3.3.2", "Spring Cloud 2023.0.3", "Maven (multi-module)"]
  - category: "Architecture distribuée"
    items: ["Spring Cloud Gateway", "Eureka (Service Discovery)", "Spring Cloud Config", "RestClient + @LoadBalanced"]
  - category: "Base de données"
    items: ["PostgreSQL 16", "Spring Data JPA / Hibernate", "Database-per-service"]
  - category: "Messagerie"
    items: ["RabbitMQ", "Topic Exchange", "@RabbitListener"]
  - category: "Sécurité"
    items: ["Spring Security 6", "OAuth2 Resource Server", "JWT (jjwt)", "BCrypt", "RBAC (@PreAuthorize)"]
  - category: "Observabilité"
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
    edgeLabel: "routage lb://"
    nodes:
      - icon: "Waypoints"
        label: "API Gateway"
        specs: ["Spring Cloud Gateway", "Eureka"]
  - label: "Services métier"
    kind: "service"
    edgeLabel: "REST + events"
    nodes:
      - icon: "KeyRound"
        label: "Auth Service"
        specs: ["OAuth2", "BCrypt"]
      - icon: "User"
        label: "User Service"
        specs: ["Organisations"]
      - icon: "FolderKanban"
        label: "Project Service"
        specs: ["CRUD projets"]
      - icon: "ListChecks"
        label: "Task Service"
        specs: ["CRUD tâches"]
      - icon: "Bell"
        label: "Notification Service"
        specs: ["Consumer async"]
  - label: "Données & Messagerie"
    kind: "data"
    edgeLabel: "metrics + traces"
    nodes:
      - icon: "Database"
        label: "PostgreSQL"
        specs: ["1 base / service", "JPA"]
      - icon: "Radio"
        label: "RabbitMQ"
        specs: ["Topic exchange"]
  - label: "Observabilité"
    kind: "observability"
    nodes:
      - icon: "Activity"
        label: "Prometheus"
        specs: ["Métriques"]
      - icon: "GitBranch"
        label: "Zipkin"
        specs: ["Traçage 100%"]
      - icon: "BarChart3"
        label: "Grafana"
        specs: ["Dashboards"]
architectureSummary:
  - "8 services Spring Boot"
  - "Database-per-service (PostgreSQL)"
  - "JWT + OAuth2 (défense en profondeur)"
  - "RabbitMQ (événementiel)"
  - "Zipkin + Prometheus + Grafana"
  - "Docker Compose"
---

ProjectFlow est un système de gestion de projets construit pour explorer, en conditions concrètes, les défis réels d'une architecture microservices : découverte de services, routage centralisé, cohérence des données entre bases isolées, sécurité distribuée et observabilité.

**Contexte et objectifs.** Le projet part d'un besoin fonctionnel simple — permettre à des organisations de créer des projets et d'y assigner des tâches — pour se concentrer sur la question architecturale sous-jacente : comment découper ce domaine en services indépendants sans sacrifier la cohérence ni la sécurité. L'objectif n'était pas la richesse fonctionnelle, mais la solidité des fondations distribuées.

**Solution apportée.** Le système est découpé en cinq services métier (authentification, organisations, projets, tâches, notifications) et trois services d'infrastructure (registre Eureka, gateway, config server). Chaque service métier possède sa propre base de données PostgreSQL logique et applique une structure en couches identique (domaine, application, infrastructure, interfaces), ce qui rend le code prévisible d'un service à l'autre. Les échanges entre services combinent appels REST synchrones — pour valider des références (une tâche doit référencer un projet existant) — et messagerie asynchrone via RabbitMQ pour les notifications, découplant ce traitement du chemin critique de la requête.

**Bénéfices.** Cette architecture démontre une défense en profondeur réelle (le JWT est revalidé à chaque niveau, pas seulement à la gateway), une observabilité pensée dès la conception (métriques Prometheus et traçage Zipkin sur 100% des requêtes dans tous les services), et une isolation des données qui permettrait de faire évoluer chaque service indépendamment. C'est aussi un exercice honnête : certaines briques, comme le Config Server, sont scaffoldées mais pas encore branchées — un choix assumé plutôt que dissimulé, et documenté comme piste d'amélioration.
