---
slug: "smart-building-iot"
name: "Smart Building IoT"
tagline: "Pipeline temps réel événementiel pour la télémétrie de capteurs IoT"
description: "Backend Spring Boot ingérant des données de température/humidité de cinq zones d'un bâtiment via MQTT, les relayant vers Kafka pour détection d'anomalies, puis les persistant dans MongoDB — exposé via une API REST documentée OpenAPI."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/smart-building-iot-java"
cover: "smart-building-iot"
techStack:
  - category: "Langage & Framework"
    items: ["Java 17", "Spring Boot 3.2.5", "Maven"]
  - category: "Messagerie IoT"
    items: ["Eclipse Paho MQTT Client 1.2.5", "Mosquitto (broker MQTT)"]
  - category: "Streaming"
    items: ["Apache Kafka", "Spring Kafka", "Zookeeper"]
  - category: "Base de données"
    items: ["MongoDB", "Spring Data MongoDB"]
  - category: "API & Documentation"
    items: ["Spring Web (REST)", "springdoc-openapi 2.5.0 (Swagger UI)", "Bean Validation"]
  - category: "Observabilité"
    items: ["Spring Actuator (health, info)"]
  - category: "DevOps"
    items: ["Docker (multi-stage)", "Docker Compose (5 services)"]
  - category: "Tests"
    items: ["JUnit 5", "Mockito", "AssertJ", "spring-kafka-test", "@WebMvcTest / MockMvc"]
features:
  - icon: "Radio"
    title: "Ingestion MQTT temps réel"
    description: "Un abonné MQTT (SensorDataMqttSubscriber) écoute le topic wildcard iot/sensors/+/data en QoS 1 et traite chaque message entrant."
  - icon: "Workflow"
    title: "Pipeline événementiel MQTT → Kafka → MongoDB"
    description: "Chaque lecture validée est republiée sur un topic Kafka (iot-sensor-data, 3 partitions, clé = deviceId) avant persistance MongoDB, découplant ingestion et traitement."
  - icon: "AlertTriangle"
    title: "Détection d'anomalies par seuil"
    description: "Le consommateur Kafka signale (log WARN) les températures > 30°C et humidités > 80%, sans encore déclencher d'alerte structurée (limite connue, documentée)."
  - icon: "PlugZap"
    title: "Double voie d'ingestion"
    description: "Les données peuvent arriver via MQTT ou directement via l'endpoint REST POST /api/sensors/data, convergeant vers le même service de validation."
  - icon: "Cpu"
    title: "Simulateur de capteurs dédié"
    description: "Un profil Spring 'simulator' isolé publie des lectures aléatoires réalistes pour 5 zones (bureau, salle de réunion, couloir, salle serveur, HVAC critique), sans jamais s'auto-consommer grâce à des profils Spring mutuellement exclusifs."
  - icon: "FileSearch2"
    title: "API de consultation historique"
    description: "Endpoints GET pour interroger les relevés par device et par plage temporelle, indexés en base pour des requêtes efficaces."
  - icon: "ShieldAlert"
    title: "Validation stricte des données"
    description: "Bornes réalistes (-80°C à 150°C, 0-100% humidité) appliquées avant toute publication Kafka, avec exceptions dédiées et réponses d'erreur uniformes."
  - icon: "RefreshCw"
    title: "Résilience de connexion MQTT"
    description: "Reconnexion automatique Paho combinée à une re-souscription explicite au topic, car l'auto-reconnexion ne restaure pas les abonnements par défaut."
architecture:
  overview: "Ce projet est un monolithe Spring Boot unique (pas une architecture microservices) organisé autour d'un pipeline événementiel en trois étapes : ingestion (MQTT ou REST), transport (Kafka) et persistance (MongoDB). Deux profils Spring mutuellement exclusifs permettent de faire tourner soit l'application complète (ingestion + traitement + API), soit un simulateur autonome qui ne fait que publier des données factices sur MQTT — évitant ainsi qu'un même processus s'auto-alimente. Aucune interface graphique n'est présente : c'est un service backend pur, exposant uniquement une API REST et une documentation Swagger générée."
  layers:
    - name: "Simulation (profil simulator)"
      responsibility: "Génère des lectures température/humidité réalistes pour 5 zones via un ScheduledExecutorService et les publie sur MQTT."
    - name: "Ingestion MQTT"
      responsibility: "SensorDataMqttSubscriber écoute le broker Mosquitto, désérialise les messages JSON et les transmet à la couche service."
    - name: "API REST"
      responsibility: "SensorDataController expose une voie d'ingestion alternative (POST) et des endpoints de consultation (GET), sans logique métier propre."
    - name: "Service métier"
      responsibility: "SensorDataService valide les bornes physiques des données, horodate côté serveur, puis délègue la publication Kafka."
    - name: "Streaming Kafka"
      responsibility: "SensorDataProducer publie sur le topic iot-sensor-data (clé = deviceId pour l'ordonnancement par appareil) ; SensorDataConsumer consomme, détecte les anomalies et persiste."
    - name: "Persistance MongoDB"
      responsibility: "SensorDataRepository (Spring Data MongoDB) stocke chaque lecture dans la collection sensor_data, indexée sur deviceId et timestamp."
  patterns:
    - name: "Observer"
      description: "SensorDataMqttSubscriber implémente MqttCallbackExtended, enregistré comme callback auprès du client Paho pour réagir aux messages entrants."
    - name: "Repository"
      description: "SensorDataRepository étend MongoRepository avec des requêtes dérivées (findByDeviceId, findByTimestampBetween)."
    - name: "DTO / Entity Mapping"
      description: "SensorDataDto et SensorDataEntity sont deux classes distinctes reliées par des méthodes de mapping explicites (fromEntity), plutôt qu'une classe unique partagée."
    - name: "Global Exception Handler"
      description: "Un @RestControllerAdvice centralise la gestion des erreurs de validation et des exceptions métier (InvalidSensorDataException) en réponses HTTP uniformes."
    - name: "Profils mutuellement exclusifs"
      description: "@Profile(\"!simulator\") sur l'abonné MQTT et @Profile(\"simulator\") sur le simulateur garantissent qu'un seul rôle s'exécute par processus, évitant une boucle d'auto-ingestion."
    - name: "Qualifier-based DI"
      description: "Un ObjectMapper dédié (@Qualifier(\"kafkaObjectMapper\")) est injecté explicitement partout où la sérialisation JSON est nécessaire, pour éviter tout conflit avec l'ObjectMapper par défaut de Spring MVC."
  solid:
    - principle: "Single Responsibility"
      application: "Chaque classe a un rôle unique et nommé : le contrôleur ne fait que du HTTP, le service ne fait que valider/orchestrer, le producteur/consommateur Kafka ne fait que transporter."
    - principle: "Open/Closed"
      application: "De nouveaux types de capteurs ou de nouvelles règles de validation peuvent être ajoutés sans modifier le flux de traitement Kafka existant."
    - principle: "Liskov Substitution"
      application: "SensorDataRepository respecte le contrat MongoRepository standard, entièrement substituable dans les tests via un mock."
    - principle: "Interface Segregation"
      application: "SensorDataService expose une interface dédiée (SensorDataServiceImpl) limitée aux opérations d'ingestion et de consultation, sans méthodes superflues."
    - principle: "Dependency Inversion"
      application: "Injection par constructeur (@RequiredArgsConstructor) partout : le contrôleur dépend de l'interface SensorDataService, pas de son implémentation."
  diagrams:
    - title: "Architecture générale"
      description: "Les deux profils Spring (application principale et simulateur) et leur point de convergence MQTT."
      diagram: |
        graph TD
          subgraph "Profil: simulator"
            SIM[IotSensorSimulator - ScheduledExecutorService]
          end

          MQ[(Mosquitto Broker - QoS 1)]

          subgraph "Profil: par défaut"
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
    - title: "Flux d'une lecture de capteur (workflow)"
      description: "Du capteur simulé jusqu'à la persistance, en passant par la détection d'anomalie."
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
          Svc->>Svc: valide bornes (-80/150°C, 0-100%)
          Svc->>Svc: horodate (Instant.now())
          Svc->>P: sendSensorData(dto)
          P->>K: publish (clé=deviceId)
          K->>C: consume()
          C->>C: detectAnomalies() (WARN si seuil dépassé)
          C->>DB: save(SensorDataEntity)
    - title: "Architecture backend en couches"
      description: "Organisation interne du service (package com.smariot)."
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
          EXC -.intercepte.-> CTRL
    - title: "Communication entre composants"
      description: "MQTT pour l'ingestion, Kafka pour le découplage interne, REST pour l'accès en lecture."
      diagram: |
        graph LR
          Sensors["Capteurs / Simulateur"] -- MQTT QoS1 --> Broker[(Mosquitto)]
          Broker -- wildcard iot/sensors/+/data --> App[Application Spring Boot]
          Client["Client REST"] -- POST/GET /api/sensors --> App
          App -- topic iot-sensor-data --> KafkaBroker[(Kafka)]
          KafkaBroker -- consume --> App
          App -- persist --> Mongo[(MongoDB)]
    - title: "Modèle de données"
      description: "Structure plate de la donnée de capteur, sans hiérarchie Room/Building (déduction : la 'zone' n'est qu'une convention de nommage deviceId)."
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
    └── src/test/java/com/smariot/ # tests par couche (controller, kafka, mqtt, service)
  notes:
    - path: "mqtt/"
      description: "Point d'entrée temps réel : abonnement MQTT et gestion de la reconnexion."
    - path: "kafka/"
      description: "Producteur et consommateur assurant le découplage entre ingestion et persistance."
    - path: "simulator/"
      description: "Générateur de données factices, actif uniquement sous le profil Spring 'simulator'."
    - path: "config/"
      description: "Configuration explicite de chaque intégration technique (MQTT, Kafka, Mongo, OpenAPI) — aucune configuration implicite."
workflow:
  - step: "1. Génération / réception du signal"
    description: "Le simulateur génère une lecture aléatoire (ou un capteur réel publie) sur le topic MQTT iot/sensors/{deviceId}/data."
  - step: "2. Abonnement MQTT"
    description: "SensorDataMqttSubscriber reçoit le message via le callback Paho et le désérialise en DTO."
  - step: "3. Validation métier"
    description: "SensorDataService vérifie les bornes physiques réalistes et rejette les valeurs aberrantes avant toute publication."
  - step: "4. Transport Kafka"
    description: "La lecture validée est publiée sur le topic iot-sensor-data, partitionnée par deviceId pour préserver l'ordre par appareil."
  - step: "5. Détection d'anomalie"
    description: "Le consommateur Kafka applique des seuils (température/humidité) et journalise un avertissement en cas de dépassement."
  - step: "6. Persistance & consultation"
    description: "La lecture est stockée dans MongoDB puis consultable via les endpoints GET (par device ou par plage temporelle)."
challenges:
  - problem: "Éviter qu'un même processus ne s'auto-alimente en consommant les données qu'il vient de publier."
    solution: "Deux profils Spring mutuellement exclusifs (@Profile(\"simulator\") vs @Profile(\"!simulator\")) séparant physiquement le rôle de générateur et celui de consommateur."
  - problem: "La reconnexion automatique du client MQTT (Paho) ne restaure pas les abonnements existants."
    solution: "Implémentation explicite de connectComplete(reconnect=true) qui re-souscrit manuellement au topic après une reconnexion."
  - problem: "Garder une sérialisation JSON cohérente entre REST, MQTT et Kafka (notamment pour les types Instant)."
    solution: "Un unique ObjectMapper qualifié (kafkaObjectMapper) avec le module JavaTimeModule, injecté explicitement partout où c'est nécessaire."
  - problem: "Absorber les échecs de traitement Kafka sans bloquer le pipeline."
    solution: "DefaultErrorHandler avec FixedBackOff (3 tentatives, 1s d'intervalle) avant abandon et journalisation, au prix de l'absence de file de dead-letter."
optimizations:
  performance:
    - "Partitionnement Kafka par deviceId garantissant l'ordre des messages par appareil sans bloquer les autres appareils."
    - "Index MongoDB sur deviceId et timestamp pour accélérer les requêtes historiques."
  security:
    - "Validation stricte des bornes physiques avant toute propagation dans le pipeline."
  maintainability:
    - "Séparation DTO/Entity avec mapping explicite plutôt qu'une classe unique, limitant les effets de bord entre couche API et couche persistance."
    - "Configuration explicite par intégration (MqttConfig, KafkaProducerConfig, KafkaConsumerConfig, MongoConfig) plutôt que des valeurs implicites dispersées."
  scalability:
    - "Le découplage MQTT → Kafka → MongoDB permet d'absorber des pics d'ingestion sans bloquer la couche de persistance."
    - "Le nombre de partitions Kafka (3) permet un parallélisme de consommation."
  quality:
    - "Couverture de tests unitaires sur chaque couche : contrôleur (@WebMvcTest), service, producteur, consommateur et abonné MQTT (Mockito)."
gallery:
  - caption: "Swagger UI — endpoints /api/sensors"
  - caption: "Logs de détection d'anomalie (WARN)"
  - caption: "Docker Compose — zookeeper, kafka, mosquitto, mongo, app"
learnings:
  - "Construire un pipeline événementiel temps réel combinant MQTT (edge) et Kafka (backbone interne)."
  - "Gérer la résilience d'une connexion MQTT (reconnexion, re-souscription) au-delà du cas nominal."
  - "Isoler un simulateur de charge du chemin de traitement réel via des profils Spring, sans code conditionnel fragile."
  - "Concevoir une validation de données physiques réalistes avant propagation dans un pipeline distribué."
caveats:
  - "Ce projet est un backend headless : aucune interface graphique (pas de JavaFX, pas de frontend) n'est présente dans le dépôt, malgré le nom \"Smart Building\" qui pourrait le laisser supposer."
  - "La détection d'anomalie se limite à un log WARN — aucune entité d'alerte, aucune notification, aucun topic Kafka dédié aux alertes n'existe encore (amélioration listée dans le README d'origine)."
  - "Aucune authentification n'est en place : l'API REST est ouverte, le broker MQTT accepte les connexions anonymes non chiffrées, et Kafka ne définit aucun ACL."
  - "Le modèle de domaine reste plat (un seul type SensorData) : les \"zones\" du bâtiment ne sont qu'une convention de nommage deviceId, sans entité Room/Building/Device dédiée."
---

Smart Building IoT est un backend Spring Boot conçu pour ingérer, traiter et stocker en temps réel des données de température et d'humidité provenant de cinq zones simulées d'un bâtiment (bureau, salle de réunion, couloir, salle serveur, HVAC critique).

**Contexte et problème.** Les systèmes IoT doivent absorber un flux continu de mesures provenant de capteurs potentiellement peu fiables (perte de connexion, données aberrantes) tout en restant réactifs à des conditions anormales (surchauffe, humidité excessive). Le défi technique central n'est pas la collecte en elle-même, mais la robustesse du pipeline : que se passe-t-il si un capteur perd sa connexion MQTT ? Si Kafka rencontre une erreur de traitement ? Si une donnée est physiquement impossible ?

**Solution apportée.** Le projet répond à ces questions par un pipeline en trois étapes découplées : un abonné MQTT (Eclipse Paho) reçoit les mesures et gère explicitement la reconnexion et la re-souscription ; un service de validation rejette les valeurs hors bornes réalistes avant toute propagation ; les données validées transitent par Kafka (partitionné par appareil, avec une politique de nouvelle tentative bornée) avant d'être persistées dans MongoDB. Un simulateur de capteurs, isolé dans son propre profil Spring, permet de démontrer le pipeline de bout en bout sans matériel réel, sans jamais interférer avec le rôle de consommateur grâce à des profils Spring mutuellement exclusifs.

**Bénéfices et honnêteté du périmètre.** Le résultat est un pipeline événementiel cohérent, testé couche par couche, avec une gestion réaliste des pannes (reconnexion MQTT, retry Kafka borné). Ce projet assume aussi clairement ses limites actuelles : c'est un service backend pur sans interface graphique, la détection d'anomalie se limite à un avertissement journalisé plutôt qu'à un système d'alerte complet, et aucune authentification n'est encore en place — autant de points documentés comme pistes d'évolution plutôt que dissimulés.
