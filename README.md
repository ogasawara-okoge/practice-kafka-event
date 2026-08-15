# Microservices Project (Shop, API, Processors, Kafka)

Docker Compose を用いて、フロントエンド（Next.js）、APIサーバー、Kafka、各種コンシューマーサービスを一括で起動・管理するためのプロジェクトです。

## 前提条件
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/) がインストールされていること

---

## 起動方法

### 1. 各種 `.env` ファイルの設定
各サービスのフォルダ（`order-api`, `order-processor`, `mail-service` など）の直下に `.env` ファイルを用意し、Kafkaの接続先を設定してください。

例 (`order-api/.env` など):
~~~~env
KAFKA_BROKER=kafka:29092
~~~~

### 2. コンテナの一括ビルドと起動
プロジェクトのルートディレクトリ（`docker-compose.yml` がある場所）で以下のコマンドを実行します。

~~~~bash
docker compose up --build
~~~~

初回起動時は依存関係のインストールやビルドが行われるため、少し時間がかかります。

---

## アクセス先・ポート一覧

* **Shop (フロントエンド):** http://localhost:3001
* **Order API (APIサーバー):** http://localhost:3000
* **Kafka (メッセージブローカー):** `localhost:9092`

---

## 停止・削除コマンド

~~~~bash
# 停止
docker compose down

# ボリューム（データ）も含めて完全にクリーンアップする場合
docker compose down -v
~~~~