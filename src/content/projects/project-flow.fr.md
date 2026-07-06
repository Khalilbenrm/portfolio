---
slug: "project-flow"
name: "ProjectFlow"
tagline: "Plateforme de gestion de projets en architecture microservices"
description: "Système de gestion de projets (organisations, projets, tâches) construit comme 8 microservices Spring Boot indépendants : découverte de services, passerelle API, authentification JWT, messagerie événementielle et observabilité distribuée."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/project-flow"
cover: "project-flow"
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
features:
  - icon: "Network"
    title: "Découverte de services (Eureka)"
    description: "Chaque service s'enregistre auprès d'un discovery-server Eureka, permettant un routage dynamique sans adresses codées en dur."
  - icon: "ShieldCheck"
    title: "Sécurité en profondeur"
    description: "Le JWT est validé à la fois au niveau de la gateway (NimbusReactiveJwtDecoder) et de chaque service métier (NimbusJwtDecoder), avec RBAC via @PreAuthorize sur les opérations sensibles."
  - icon: "Waypoints"
    title: "API Gateway centralisée"
    description: "Spring Cloud Gateway route les requêtes vers les 5 services métier et agrège leur documentation OpenAPI en un seul point d'entrée Swagger."
  - icon: "Database"
    title: "Base de données par service"
    description: "5 bases PostgreSQL logiquement isolées (auth, user, project, task, notification) sur une seule instance Postgres, chacune possédée exclusivement par son service."
  - icon: "Radio"
    title: "Événements asynchrones"
    description: "RabbitMQ (topic exchange projectflow.events) diffuse les événements métier (inscription, création de projet/tâche) vers le notification-service."
  - icon: "ActivitySquare"
    title: "Observabilité distribuée"
    description: "Traçage distribué avec Zipkin/Brave sur 100% des requêtes et métriques Prometheus exposées par chaque service via Actuator."
  - icon: "KeyRound"
    title: "Authentification JWT complète"
    description: "Inscription, connexion, hachage BCrypt, émission de JWT avec claim de rôle, et refresh tokens persistés avec expiration à 7 jours."
  - icon: "Boxes"
    title: "Déploiement conteneurisé"
    description: "8 services + Postgres + RabbitMQ + Zipkin + Prometheus + Grafana orchestrés via un unique docker-compose.yml avec healthchecks."
architecture:
  overview: "ProjectFlow suit une architecture microservices classique à trois strates : une strate d'infrastructure (Eureka, Gateway, Config Server), une strate métier (5 services indépendants possédant chacun leur base de données) et une strate transverse d'observabilité (Prometheus, Zipkin, Grafana). Les communications synchrones (validation de l'existence d'une organisation ou d'un projet) passent par des appels REST load-balancés via Eureka ; les communications asynchrones (notifications) passent par RabbitMQ. Chaque service applique la même structure en couches (domain / application / infrastructure / interfaces), ce qui rend le code prévisible d'un service à l'autre."
  layers:
    - name: "Interfaces (REST Controllers)"
      responsibility: "Exposition des endpoints HTTP, désérialisation des requêtes, aucune logique métier (validation déléguée à la couche application)."
    - name: "Application (Services & DTO)"
      responsibility: "Logique métier, orchestration des appels aux clients REST inter-services, construction des DTO, publication d'événements."
    - name: "Domain (Entités & Repositories)"
      responsibility: "Modèle de données JPA et accès à la base de données propre au service (Repository pattern)."
    - name: "Infrastructure (Security, Messaging, Clients)"
      responsibility: "Configuration Spring Security/OAuth2, producteurs/consommateurs RabbitMQ, clients RestClient vers les autres services."
    - name: "Gateway (Edge Layer)"
      responsibility: "Point d'entrée unique : routage vers les services via Eureka, validation JWT réactive, agrégation de la documentation OpenAPI."
    - name: "Observabilité (Transverse)"
      responsibility: "Actuator + Micrometer exposent les métriques Prometheus ; Brave/Zipkin trace 100% des requêtes à travers tous les services."
  patterns:
    - name: "API Gateway"
      description: "Spring Cloud Gateway centralise le routage et évite d'exposer directement les services internes."
    - name: "Service Discovery"
      description: "Eureka permet un routage dynamique par nom logique de service (lb://service-name) plutôt que par adresse fixe."
    - name: "Database per Service"
      description: "Chaque service métier possède sa propre base logique, garantissant un couplage faible au niveau des données."
    - name: "Repository Pattern"
      description: "Chaque entité JPA est accédée via une interface Spring Data dédiée (UserAccountRepository, ProjectRepository, etc.)."
    - name: "DTO Pattern"
      description: "Les requêtes entrantes sont mappées vers des DTO dédiés avant traitement par la couche service."
    - name: "Builder Pattern"
      description: "Les entités utilisent Lombok @Builder pour une construction immuable et lisible."
    - name: "Global Exception Handler"
      description: "Un @RestControllerAdvice par service (sauf notification-service) centralise la gestion des erreurs en réponses HTTP cohérentes."
    - name: "Event-Driven / Pub-Sub"
      description: "Un exchange RabbitMQ de type topic diffuse les événements métier vers des files dédiées consommées par le notification-service."
    - name: "Defense in Depth"
      description: "Le JWT est revalidé indépendamment par chaque service (Resource Server OAuth2), pas seulement au niveau de la gateway."
  solid:
    - principle: "Single Responsibility"
      application: "Chaque microservice possède une unique responsabilité métier (auth, organisations, projets, tâches, notifications)."
    - principle: "Open/Closed"
      application: "Le GlobalExceptionHandler et les DTO permettent d'ajouter de nouveaux cas d'usage sans modifier la logique centrale des contrôleurs."
    - principle: "Liskov Substitution"
      application: "Les repositories Spring Data (JpaRepository<T, ID>) sont substituables et testables via des interfaces standard."
    - principle: "Interface Segregation"
      application: "Les contrôleurs REST n'exposent que les opérations pertinentes à leur ressource, sans interface fourre-tout."
    - principle: "Dependency Inversion"
      application: "Injection par constructeur (@RequiredArgsConstructor) partout : les services dépendent d'abstractions (repositories, clients) plutôt que d'implémentations concrètes."
  diagrams:
    - title: "Architecture générale"
      description: "Vue d'ensemble des 8 services et de l'infrastructure transverse."
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
            PG[(PostgreSQL - 5 bases logiques)]
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
          AUTH -. registre .-> EU
          USER -. registre .-> EU
          PROJ -. registre .-> EU
          TASK -. registre .-> EU
          NOTIF -. registre .-> EU
          GW -. registre .-> EU

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
    - title: "Flux d'une requête (création de tâche)"
      description: "Séquence complète depuis le client jusqu'à la notification asynchrone."
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
          G->>G: Validation JWT (NimbusReactiveJwtDecoder)
          G->>T: Route vers lb://task-service
          T->>T: Revalidation JWT (Resource Server)
          T->>P: GET /projects/{id} (RestClient, lb://project-service)
          P-->>T: 200 OK (projet existe)
          T->>DB: INSERT TaskItem
          DB-->>T: Tâche persistée
          T->>MQ: publish task.created
          T-->>G: 201 Created
          G-->>C: 201 Created
          MQ->>N: consume task.created
          N->>N: Persist NotificationLog
    - title: "Architecture en couches d'un service métier"
      description: "Structure interne identique appliquée à chaque service (ex. task-service)."
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
    - title: "Communication inter-services"
      description: "Appels synchrones (REST via Eureka) vs événements asynchrones (RabbitMQ)."
      diagram: |
        graph LR
          TASK[Task Service] -- REST sync: GET /projects/id --> PROJ[Project Service]
          PROJ -- REST sync: GET /organizations/id --> USER[User Service]
          AUTH[Auth Service] -- event: user.registered --> EX{{Topic Exchange projectflow.events}}
          PROJ -- event: project.created --> EX
          TASK -- event: task.created/assigned/completed --> EX
          EX -- queue bindings --> NOTIF[Notification Service]
    - title: "Modèle de données (par service)"
      description: "Une base logique par service sur une instance PostgreSQL partagée, sans clés étrangères inter-bases."
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
          ORGANIZATION ||--o{ PROJECT : "organizationId (validé via REST, pas de FK)"
          PROJECT ||--o{ TASK : "projectId (validé via REST, pas de FK)"
structure:
  tree: |
    project-flow/
    ├── pom.xml                    # POM parent (reactor Maven, 8 modules)
    ├── docker-compose.yml         # Postgres, RabbitMQ, 8 services, Zipkin, Prometheus, Grafana
    ├── docs/architecture.md       # Diagrammes d'architecture source
    ├── postgres/init-databases.sh # Création des 5 bases logiques
    ├── monitoring/prometheus.yml  # Configuration de scraping
    ├── discovery-server/          # Serveur Eureka
    ├── config-server/             # Spring Cloud Config (scaffolded, désactivé par les clients)
    ├── gateway-service/           # Spring Cloud Gateway + sécurité JWT réactive
    ├── auth-service/
    │   └── src/main/java/.../auth/
    │       ├── domain/{model, repository}
    │       ├── application/{dto, service}
    │       ├── infrastructure/{security, messaging, exception}
    │       └── interfaces/rest/AuthController.java
    ├── user-service/              # Organizations
    ├── project-service/           # Projects + OrganizationClient
    ├── task-service/              # Tasks + ProjectClient
    └── notification-service/      # Consommateurs RabbitMQ + journal de notifications
  notes:
    - path: "domain/"
      description: "Entités JPA et interfaces Repository — le cœur métier, indépendant du framework web."
    - path: "application/"
      description: "Services orchestrant la logique métier et DTO d'entrée/sortie."
    - path: "infrastructure/"
      description: "Détails techniques : sécurité JWT, clients REST inter-services, producteurs/consommateurs RabbitMQ."
    - path: "interfaces/rest/"
      description: "Contrôleurs REST, fine couche de présentation HTTP sans logique métier."
workflow:
  - step: "1. Requête client"
    description: "Le client (frontend ou Swagger) envoie une requête HTTP avec un JWT vers la Gateway."
  - step: "2. Validation & routage"
    description: "La Gateway valide le JWT de manière réactive puis route la requête vers le service concerné via Eureka."
  - step: "3. Revalidation & logique métier"
    description: "Le service cible revalide le JWT (defense in depth), applique sa logique métier et, si nécessaire, appelle un autre service en synchrone pour valider une référence (ex. tâche → projet)."
  - step: "4. Persistance"
    description: "Le service persiste l'entité dans sa base PostgreSQL dédiée."
  - step: "5. Publication d'événement"
    description: "Un événement métier est publié sur l'exchange RabbitMQ (ex. task.created)."
  - step: "6. Réponse & notification asynchrone"
    description: "La réponse HTTP est renvoyée au client pendant que le notification-service consomme l'événement en tâche de fond."
challenges:
  - problem: "Valider des références inter-services sans transaction distribuée (ex. une tâche référence un projet dans une autre base de données)."
    solution: "Validation synchrone via RestClient + Eureka au moment de l'écriture, acceptant une cohérence éventuelle plutôt qu'une transaction ACID inter-bases."
  - problem: "Propager l'identité de l'utilisateur à travers plusieurs services sans ré-authentification complète."
    solution: "Transfert de l'en-tête Authorization d'origine entre services, combiné à une revalidation JWT indépendante à chaque niveau (gateway + service)."
  - problem: "Isoler les données par service tout en gardant une infrastructure simple à déployer."
    solution: "Une seule instance PostgreSQL avec 5 bases logiques créées au démarrage via un script d'initialisation, plutôt que 5 instances physiques séparées."
  - problem: "Assurer une visibilité complète sur un système distribué en développement."
    solution: "Instrumentation systématique de chaque service avec Micrometer/Prometheus et traçage distribué Zipkin/Brave à 100% d'échantillonnage."
optimizations:
  performance:
    - "Appels inter-services load-balancés via Eureka pour répartir la charge entre instances."
    - "Base de données dédiée par service évitant les verrous de contention sur une base partagée unique."
  security:
    - "JWT revalidé indépendamment à chaque niveau (gateway + service) plutôt qu'une confiance implicite post-gateway."
    - "Mots de passe hachés avec BCrypt, jamais stockés en clair."
    - "RBAC via @PreAuthorize sur les opérations destructives (DELETE)."
  maintainability:
    - "Structure en couches identique reproduite dans chaque service, réduisant la charge cognitive pour naviguer d'un service à l'autre."
    - "DTO séparés des entités pour ne pas exposer le modèle de persistance sur le réseau."
  scalability:
    - "Chaque service peut être scalé indépendamment grâce à Eureka et au découplage par base de données."
    - "Communication asynchrone (RabbitMQ) pour les notifications, découplant leur traitement du chemin critique de la requête."
  quality:
    - "Tests unitaires Mockito par service métier sur la couche service."
    - "Documentation OpenAPI générée et agrégée automatiquement via la Gateway."
gallery:
  - caption: "Vue Swagger agrégée via la Gateway"
  - caption: "Dashboard Grafana / métriques Prometheus"
  - caption: "Traces distribuées Zipkin"
  - caption: "Docker Compose — services démarrés"
learnings:
  - "Concevoir une architecture microservices cohérente : découverte de services, gateway, communication sync/async."
  - "Mettre en place une défense en profondeur pour la sécurité JWT plutôt que de faire confiance uniquement à la gateway."
  - "Gérer la cohérence des données entre bases de données isolées sans transaction distribuée classique."
  - "Instrumenter un système distribué avec des métriques et du traçage dès la conception."
  - "Structurer un monorepo Maven multi-modules avec une organisation en couches reproductible."
caveats:
  - "Le Config Server est présent dans l'architecture mais actuellement désactivé par tous les services consommateurs (spring.cloud.config.enabled=false) et pointe vers un dossier de configuration partagé qui n'existe pas encore dans le dépôt."
  - "Aucun mécanisme de résilience (circuit breaker / retry) n'entoure les appels REST synchrones inter-services."
  - "Les tests sont unitaires uniquement (Mockito) ; aucun test d'intégration ou de bout en bout n'est présent malgré la dépendance Testcontainers déclarée."
  - "Le secret JWT est actuellement une valeur codée en dur identique dans chaque service — à externaliser via variables d'environnement avant toute mise en production réelle."
---

ProjectFlow est un système de gestion de projets construit pour explorer, en conditions concrètes, les défis réels d'une architecture microservices : découverte de services, routage centralisé, cohérence des données entre bases isolées, sécurité distribuée et observabilité.

**Contexte et objectifs.** Le projet part d'un besoin fonctionnel simple — permettre à des organisations de créer des projets et d'y assigner des tâches — pour se concentrer sur la question architecturale sous-jacente : comment découper ce domaine en services indépendants sans sacrifier la cohérence ni la sécurité. L'objectif n'était pas la richesse fonctionnelle, mais la solidité des fondations distribuées.

**Solution apportée.** Le système est découpé en cinq services métier (authentification, organisations, projets, tâches, notifications) et trois services d'infrastructure (registre Eureka, gateway, config server). Chaque service métier possède sa propre base de données PostgreSQL logique et applique une structure en couches identique (domaine, application, infrastructure, interfaces), ce qui rend le code prévisible d'un service à l'autre. Les échanges entre services combinent appels REST synchrones — pour valider des références (une tâche doit référencer un projet existant) — et messagerie asynchrone via RabbitMQ pour les notifications, découplant ce traitement du chemin critique de la requête.

**Bénéfices.** Cette architecture démontre une défense en profondeur réelle (le JWT est revalidé à chaque niveau, pas seulement à la gateway), une observabilité pensée dès la conception (métriques Prometheus et traçage Zipkin sur 100% des requêtes dans tous les services), et une isolation des données qui permettrait de faire évoluer chaque service indépendamment. C'est aussi un exercice honnête : certaines briques, comme le Config Server, sont scaffoldées mais pas encore branchées — un choix assumé plutôt que dissimulé, et documenté comme piste d'amélioration.
