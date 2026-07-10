---
slug: "smart-building-iot"
name: "Smart Building IoT"
tagline: "Pipeline temps réel événementiel pour la télémétrie de capteurs IoT"
description: "Backend Spring Boot ingérant des données de température/humidité de cinq zones d'un bâtiment via REST, les relayant vers Kafka pour détection d'anomalies, puis les persistant dans MongoDB — exposé via une API REST documentée OpenAPI."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/smart-building-iot-java"
techStack:
  - category: "Langage & Framework"
    items: ["Java 17", "Spring Boot 3.2.5", "Maven"]
  - category: "Streaming"
    items: ["Apache Kafka", "Spring Kafka", "Zookeeper"]
  - category: "Base de données"
    items: ["MongoDB", "Spring Data MongoDB"]
  - category: "API & Documentation"
    items: ["Spring Web (REST)", "springdoc-openapi 2.5.0 (Swagger UI)", "Bean Validation"]
  - category: "Observabilité"
    items: ["Spring Actuator (health, info)"]
  - category: "DevOps"
    items: ["Docker (multi-stage)", "Docker Compose (4 services)"]
  - category: "Tests"
    items: ["JUnit 5", "Mockito", "AssertJ", "spring-kafka-test", "@WebMvcTest / MockMvc"]
architectureDescription: "Suivez une mesure de bout en bout : un capteur poste une mesure sur l'API REST, qui la transmet à la couche de validation avant toute autre chose. Les valeurs hors bornes sont rejetées immédiatement ; les valeurs valides sont publiées sur Kafka, partitionnées par appareil pour que les mesures d'un même capteur arrivent toujours dans l'ordre. Un consumer les récupère de façon asynchrone, retente un nombre borné de fois en cas d'échec plutôt que de bloquer le topic, applique une détection d'anomalie par seuil simple, puis persiste la mesure dans MongoDB."
architectureFlow:
  - label: "Capteurs"
    kind: "client"
    edgeLabel: "REST"
    nodes:
      - icon: "Cpu"
        label: "Capteurs IoT"
        specs: ["5 zones simulées", "Profil Spring dédié"]
  - label: "Ingestion"
    kind: "gateway"
    edgeLabel: "après validation"
    nodes:
      - icon: "PlugZap"
        label: "API REST"
        specs: ["POST /api/sensors/data", "Swagger UI"]
  - label: "Validation"
    kind: "service"
    edgeLabel: "publish Kafka"
    nodes:
      - icon: "ShieldCheck"
        label: "Validation"
        specs: ["-80°C à 150°C", "0-100% humidité"]
  - label: "Streaming"
    kind: "service"
    edgeLabel: "consumer"
    nodes:
      - icon: "Workflow"
        label: "Kafka"
        specs: ["3 partitions", "clé = deviceId"]
  - label: "Données & alertes"
    kind: "data"
    nodes:
      - icon: "Database"
        label: "MongoDB"
        specs: ["Historique indexé"]
      - icon: "AlertTriangle"
        label: "Détection d'anomalies"
        specs: [">30°C / >80%"]
architectureInfra:
  - icon: "Container"
    label: "Docker"
    specs: ["build multi-stage"]
  - icon: "Boxes"
    label: "Docker Compose"
    specs: ["4 services"]
architectureSummary:
  - "Pipeline REST → Kafka → MongoDB"
  - "Retry consumer Kafka (3× / backoff 1s) avant abandon"
  - "Simulateur de capteurs isolé (profil Spring dédié)"
lessonsLearned:
  - title: "Construire un pipeline événementiel avec Kafka"
    description: "Appris à produire et consommer des messages, et à partitionner un topic par deviceId pour que les mesures d'un même capteur restent dans l'ordre."
  - title: "Gérer les pannes sans tout bloquer"
    description: "Mis en place un retry borné (quelques tentatives, puis journalisation et abandon) pour qu'un enregistrement corrompu ne bloque pas tout le pipeline."
  - title: "Valider les données en amont"
    description: "Appris à rejeter les données hors bornes dès leur arrivée, avant qu'elles n'atteignent Kafka, plutôt que de les traiter plus loin dans le pipeline."
  - title: "Tester chaque couche séparément"
    description: "Pratiqué les tests du service, du producer/consumer Kafka et du contrôleur REST indépendamment (JUnit, Mockito, spring-kafka-test)."
---

Smart Building IoT est un backend Spring Boot conçu pour ingérer, traiter et stocker en temps réel des données de température et d'humidité provenant de cinq zones simulées d'un bâtiment (bureau, salle de réunion, couloir, salle serveur, HVAC critique).

**Contexte et problème.** Les systèmes IoT doivent absorber un flux continu de mesures provenant de capteurs potentiellement peu fiables (payloads malformés, données physiquement impossibles) tout en restant réactifs à des conditions anormales (surchauffe, humidité excessive). Le défi technique central n'est pas l'ingestion en elle-même, mais la robustesse de ce qui se passe après : comment éviter qu'une donnée invalide ou une erreur de traitement transitoire ne bloque tout le pipeline ?

**Solution apportée.** Le projet répond à cela par un pipeline en trois étapes découplées : un endpoint REST reçoit les mesures et les transmet à un service de validation, qui rejette les valeurs hors bornes réalistes (-80°C à 150°C, 0-100% d'humidité) avant toute propagation ; les données validées sont publiées sur Kafka (partitionné par appareil, avec une clé `deviceId`) ; un consumer les traite de façon asynchrone, retentant les enregistrements en échec un nombre borné de fois avant de les journaliser et de les ignorer plutôt que de bloquer le topic, applique une détection d'anomalie simple, puis persiste les données valides dans MongoDB. Un simulateur de capteurs, isolé dans son propre profil Spring, permet de démontrer le pipeline de bout en bout sans matériel réel en appelant exactement la même couche service que l'endpoint REST.

**Bénéfices et honnêteté du périmètre.** Le résultat est un pipeline événementiel cohérent et découplé, testé couche par couche (service, producer/consumer Kafka, contrôleur REST), avec une gestion réaliste des pannes — validation en amont et politique de retry bornée et non bloquante côté consumer. Ce projet assume aussi clairement ses limites actuelles : c'est un service backend pur sans interface graphique, la détection d'anomalie se limite à un avertissement journalisé plutôt qu'à un système d'alerte complet, et aucune authentification n'est encore en place — autant de points documentés comme pistes d'évolution plutôt que dissimulés.
