# SkanderChayoukhi-Klaire_coding_game

# 🌍 API Adresse & Risques Environnementaux

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)

## 🚨 Correction Critique
**URL corrigée pour l'API Géorisques** (l'originale était obsolète)  :
```bash
https://georisques.gouv.fr/api/v1/resultats_rapport_risque?latlon={lon},{lat}


## 🚀 Fonctionnalités

- 🔍 Recherche d'adresses via l'API BAN (Base Adresse Nationale)
- ⚠️ Consultation des risques environnementaux via l'API Géorisques
- 💾 Persistance des données en SQLite
- 🐳 Containerisation avec Docker

## 🛠 Stack Technique

graph TD
    A[NestJS] --> B[TypeORM]
    B --> C[SQLite]
    A --> D[Axios]
    D --> E[API BAN]
    D --> F[API Géorisques]
    A --> G[Docker]

## 🏗 Installation

1. Cloner le dépôt :
```bash
git clone [https://github.com/votre-utilisateur/klaire-api.git](https://github.com/SkanderChayoukhi/SkanderChayoukhi-Klaire_coding_game.git)
cd klaire-api

2. Configurer l'environnement :

```bash
cp .env.example .env

3. Démarrer les services :

```bash
docker compose up --build
