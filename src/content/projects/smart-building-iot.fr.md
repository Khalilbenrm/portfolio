---
slug: "smart-building-iot"
name: "Smart Building IoT"
tagline: "Pipeline temps réel événementiel pour la télémétrie de capteurs IoT"
description: "Backend Spring Boot ingérant des données de température/humidité de cinq zones d'un bâtiment via MQTT, les relayant vers Kafka pour détection d'anomalies, puis les persistant dans MongoDB — exposé via une API REST documentée OpenAPI."
status: "completed"
featured: true
github: "https://github.com/Khalilbenrm/smart-building-iot-java"
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
architectureFlow:
  - label: "Capteurs"
    kind: "client"
    edgeLabel: "MQTT / REST"
    nodes:
      - icon: "Cpu"
        label: "Capteurs IoT"
        specs: ["5 zones simulées", "Profil Spring dédié"]
  - label: "Ingestion"
    kind: "gateway"
    edgeLabel: "après validation"
    nodes:
      - icon: "Radio"
        label: "MQTT Broker"
        specs: ["Mosquitto", "QoS 1"]
      - icon: "PlugZap"
        label: "API REST"
        specs: ["POST /api/sensors"]
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
architectureSummary:
  - "Pipeline MQTT → Kafka → MongoDB"
  - "Reconnexion MQTT automatique"
  - "Double voie d'ingestion (MQTT + REST)"
  - "Simulateur de capteurs isolé"
  - "Docker Compose (5 services)"
---

Smart Building IoT est un backend Spring Boot conçu pour ingérer, traiter et stocker en temps réel des données de température et d'humidité provenant de cinq zones simulées d'un bâtiment (bureau, salle de réunion, couloir, salle serveur, HVAC critique).

**Contexte et problème.** Les systèmes IoT doivent absorber un flux continu de mesures provenant de capteurs potentiellement peu fiables (perte de connexion, données aberrantes) tout en restant réactifs à des conditions anormales (surchauffe, humidité excessive). Le défi technique central n'est pas la collecte en elle-même, mais la robustesse du pipeline : que se passe-t-il si un capteur perd sa connexion MQTT ? Si Kafka rencontre une erreur de traitement ? Si une donnée est physiquement impossible ?

**Solution apportée.** Le projet répond à ces questions par un pipeline en trois étapes découplées : un abonné MQTT (Eclipse Paho) reçoit les mesures et gère explicitement la reconnexion et la re-souscription ; un service de validation rejette les valeurs hors bornes réalistes avant toute propagation ; les données validées transitent par Kafka (partitionné par appareil, avec une politique de nouvelle tentative bornée) avant d'être persistées dans MongoDB. Un simulateur de capteurs, isolé dans son propre profil Spring, permet de démontrer le pipeline de bout en bout sans matériel réel, sans jamais interférer avec le rôle de consommateur grâce à des profils Spring mutuellement exclusifs.

**Bénéfices et honnêteté du périmètre.** Le résultat est un pipeline événementiel cohérent, testé couche par couche, avec une gestion réaliste des pannes (reconnexion MQTT, retry Kafka borné). Ce projet assume aussi clairement ses limites actuelles : c'est un service backend pur sans interface graphique, la détection d'anomalie se limite à un avertissement journalisé plutôt qu'à un système d'alerte complet, et aucune authentification n'est encore en place — autant de points documentés comme pistes d'évolution plutôt que dissimulés.
