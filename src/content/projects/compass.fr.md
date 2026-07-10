---
slug: "compass"
name: "Compass"
tagline: "Plateforme de gestion de projets et tâches en architecture microservices"
description: "Une plateforme de gestion de projets et tâches (organisations, projets, tâches) construite comme 8 microservices Spring Boot indépendants : découverte de services, passerelle API, authentification JWT, messagerie événementielle RabbitMQ, et une stack de monitoring Prometheus/Grafana préconfigurée."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/compass"
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
    items: ["Spring Security 6", "OAuth2 Resource Server", "JWT (jjwt 0.12.5)"]
  - category: "Observabilité"
    items: ["Micrometer", "Prometheus", "Grafana (dashboard préconfiguré)", "Spring Actuator"]
  - category: "DevOps"
    items: ["Docker (multi-stage builds)", "Docker Compose (12 services)"]
  - category: "Documentation & Tests"
    items: ["springdoc-openapi (Swagger agrégé)", "JUnit 5", "Mockito", "Testcontainers"]
architectureDescription: "Suivez une requête de bout en bout : le client envoie un appel HTTPS avec un JWT à la gateway, qui résout le service cible par son nom via Eureka et transmet la requête. Chaque service métier revalide ce JWT indépendamment, appelle un voisin de façon synchrone uniquement pour vérifier qu'une référence existe (cette organisation du projet existe-t-elle ? ce projet de la tâche existe-t-il ?), et publie ce qui vient de se produire — une inscription, une création, un changement de statut — sur RabbitMQ plutôt que d'attendre que quelqu'un écoute. Chaque service alimente aussi Prometheus, qui nourrit le dashboard Grafana présenté sous le diagramme."
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
        specs: ["Spring Cloud Gateway", "Eureka", "Swagger agrégé"]
  - label: "Services métier"
    kind: "service"
    edgeLabel: "REST + events"
    nodes:
      - icon: "KeyRound"
        label: "Auth Service"
        specs: ["Inscription/connexion", "Refresh tokens"]
      - icon: "User"
        label: "User Service"
        specs: ["Organisations"]
      - icon: "FolderKanban"
        label: "Project Service"
        specs: ["CRUD projets"]
      - icon: "ListChecks"
        label: "Task Service"
        specs: ["Statut, priorité, assignation"]
      - icon: "Bell"
        label: "Notification Service"
        specs: ["Consumer async"]
  - label: "Données & Messagerie"
    kind: "data"
    edgeLabel: "métriques"
    nodes:
      - icon: "Database"
        label: "PostgreSQL"
        specs: ["1 base / service", "JPA"]
      - icon: "Radio"
        label: "RabbitMQ"
        specs: ["Topic compass.events"]
  - label: "Observabilité"
    kind: "observability"
    nodes:
      - icon: "Activity"
        label: "Prometheus"
        specs: ["Scrape 15s"]
      - icon: "BarChart3"
        label: "Grafana"
        specs: ["Dashboard Compass Overview"]
architectureInfra:
  - icon: "Container"
    label: "Docker"
    specs: ["build multi-stage"]
  - icon: "Boxes"
    label: "Docker Compose"
    specs: ["12 services, une commande"]
architectureSummary:
  - "8 services Spring Boot, démarrage en une commande"
  - "Database-per-service (PostgreSQL 16)"
  - "JWT + OAuth2 Resource Server (défense en profondeur)"
  - "RabbitMQ événementiel (compass.events)"
  - "Prometheus + Grafana, dashboard préconfiguré"
  - "Tests d'intégration avec Testcontainers"
lessonsLearned:
  - title: "Concevoir une architecture microservices"
    description: "Appris à découper un domaine unique en services indépendants, chacun avec sa propre base de données, reliés par de la découverte de services (Eureka) et une API gateway."
  - title: "Sécuriser un système distribué"
    description: "Pratiqué la validation d'un JWT indépendamment dans chaque service plutôt qu'une seule fois à la gateway, et compris pourquoi cette redondance a du sens."
  - title: "Choisir entre REST et événementiel"
    description: "Appris quand utiliser un appel REST synchrone (j'ai besoin d'une réponse maintenant) et quand utiliser un événement RabbitMQ asynchrone (quelque chose s'est produit, d'autres peuvent réagir plus tard)."
  - title: "Tests d'intégration avec Testcontainers"
    description: "Commencé à écrire des tests d'intégration contre une vraie instance PostgreSQL plutôt que de mocker la base de données, et détecté des bugs que les mocks n'auraient pas montrés."
  - title: "Mettre en place du monitoring"
    description: "Appris à exposer des métriques avec Spring Actuator/Micrometer et à les relier à Prometheus et à un dashboard Grafana."
---

Compass est une plateforme de gestion de projets et tâches (organisations, projets, tâches) construite pour affronter, en conditions réalistes, le vrai problème derrière une décision « on découpe en microservices » : décomposer un domaine monolithique unique en services déployables indépendamment sans casser la cohérence des données, la sécurité, ni la capacité de l'opérateur à réellement faire tourner le résultat.

**Contexte et problème.** Le besoin fonctionnel reste volontairement simple — des organisations créent des projets et y assignent des tâches — parce que le problème n'est pas la logique métier, c'est ce qui lui arrive une fois éclatée : chaque concept du domaine (auth, organisations, projets, tâches, notifications) passe d'un appel en mémoire à un appel réseau, chaque brique a besoin de sa propre base de données au lieu d'en partager une, et une requête qui n'était qu'une seule transaction traverse désormais des frontières de process où la panne partielle, la découverte de services et la confiance entre services deviennent de vrais sujets. C'est cette migration monolithe-vers-microservices que Compass cherche à démontrer de façon crédible, pas seulement à schématiser. C'est aussi le second passage, affiné, sur ce même exercice de décomposition, comblant les manques qu'une première tentative laissait ouverts : pas de démarrage en une commande, pas de dashboards prêts à l'emploi, et des tests d'intégration qui mockaient la base de données plutôt que de la solliciter réellement.

**Solution apportée.** Cinq services métier (auth, user/organisations, project, task, notification) sont placés derrière une Spring Cloud Gateway qui les résout par nom via Eureka et agrège leurs spécifications OpenAPI dans une seule Swagger UI. Chaque service possède sa propre base PostgreSQL et revalide indépendamment le JWT de l'appelant en tant qu'OAuth2 resource server, même si la gateway l'a déjà vérifié une première fois. Des appels REST synchrones (project-service → user-service, task-service → project-service) valident l'existence des entités référencées avant d'accepter une écriture ; tout ce qui s'est *produit* — un utilisateur inscrit, un projet créé, une tâche assignée ou terminée — est publié sur un topic exchange `compass.events` et transformé en entrée de log de notification de façon asynchrone. L'ensemble de la stack, avec Postgres, RabbitMQ, Prometheus et une instance Grafana dont le dashboard **Compass Overview** est déjà préconfiguré, démarre avec un simple `docker compose up --build` ; un parcours curl documenté déroule le chemin inscription → organisation → projet → tâche → notification de bout en bout.

**Bénéfices et honnêteté du périmètre.** Le découpage paie exactement là où un monolithe aurait peiné : chaque service scale, se déploie et tombe en panne indépendamment, la propriété des données par service évite qu'un changement de schéma dans un domaine ne se répercute sur un autre, et le JWT est revalidé à chaque saut plutôt que d'être considéré comme acquis dès la porte d'entrée. Par rapport à la version précédente de ce même exercice de migration, les gains sont opérationnels : un vrai démarrage en une commande plutôt qu'une suite d'instructions à suivre dans le bon ordre, des dashboards disponibles dès que la stack est levée plutôt qu'un endpoint Prometheus que personne ne consulte, et des tests d'intégration bâtis sur Testcontainers qui s'exécutent contre une vraie instance PostgreSQL plutôt qu'un substitut en mémoire. Ce qu'un monolithe obtient gratuitement — une transaction unique sur tout le domaine — n'est volontairement pas simulé : la cohérence inter-services est ici gérée explicitement, via des appels de validation synchrones et des événements asynchrones, pas cachée derrière un ORM. Le Config Server est branché dans la stack, mais chaque service résout encore localement son propre `application.yml` (`cloud.config.enabled: false`) — le même interrupteur assumé, pas encore activé. Une nouvelle limite est également documentée plutôt que dissimulée : le endpoint `/actuator/prometheus` du `config-server` lui-même n'est pas scrapé, car le routage générique `/{application}/{profile}` de Spring Cloud Config intercepte le chemin avant qu'Actuator ne puisse le traiter.
