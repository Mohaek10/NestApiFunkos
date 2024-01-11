-- Adminer 4.8.1 PostgreSQL 12.2 dump

DROP TABLE IF EXISTS "categorias";
CREATE TABLE "public"."categorias" (
    "id" uuid NOT NULL,
    "nombre" character varying(255) NOT NULL,
    "created_at" timestamp DEFAULT now() NOT NULL,
    "updated_at" timestamp DEFAULT now() NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL,
    CONSTRAINT "PK_3886a26251605c571c6b4f861fe" PRIMARY KEY ("id"),
    CONSTRAINT "UQ_ccdf6cd1a34ea90a7233325063d" UNIQUE ("nombre")
) WITH (oids = false);

INSERT INTO "categorias" ("id", "nombre", "created_at", "updated_at", "is_deleted") VALUES
('939cf843-5ecd-477c-a68a-0207122a4a88',	'Marvel',	'2024-01-08 15:01:33.423473',	'2024-01-08 15:01:33.423473',	'f');

DROP TABLE IF EXISTS "funko";
DROP SEQUENCE IF EXISTS funko_id_seq;
CREATE SEQUENCE funko_id_seq INCREMENT 1 MINVALUE 1 MAXVALUE 9223372036854775807 START 4 CACHE 1;

CREATE TABLE "public"."funko" (
    "id" bigint DEFAULT nextval('funko_id_seq') NOT NULL,
    "nombre" character varying(255) NOT NULL,
    "precio" character varying(255) NOT NULL,
    "cantidad" integer DEFAULT '0' NOT NULL,
    "imagen" character varying DEFAULT 'https://via.placeholder.com/150' NOT NULL,
    "fecha_creacion" timestamp DEFAULT now() NOT NULL,
    "fecha_actualizacion" timestamp DEFAULT now() NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL,
    "categoria_id" uuid,
    CONSTRAINT "PK_2159f453346bb15653b8825f3ec" PRIMARY KEY ("id")
) WITH (oids = false);

INSERT INTO "funko" ("id", "nombre", "precio", "cantidad", "imagen", "fecha_creacion", "fecha_actualizacion", "is_deleted", "categoria_id") VALUES
(1,	'Spiderman',	'500000',	20,	'https://via.placeholder.com/150',	'2024-01-08 15:01:41.953773',	'2024-01-08 15:01:41.953773',	'f',	'939cf843-5ecd-477c-a68a-0207122a4a88'),
(2,	'Spiderman',	'500000',	20,	'https://via.placeholder.com/150',	'2024-01-08 19:32:40.05201',	'2024-01-08 19:32:40.05201',	'f',	'939cf843-5ecd-477c-a68a-0207122a4a88'),
(3,	'Batman',	'9090099',	20,	'https://via.placeholder.com/150',	'2024-01-09 19:32:40.05201',	'2024-01-09 19:32:40.05201',	'f',	'939cf843-5ecd-477c-a68a-0207122a4a88');
ALTER TABLE ONLY "public"."funko" ADD CONSTRAINT "FK_65a8b6911e611599a6f532678d3" FOREIGN KEY (categoria_id) REFERENCES categorias(id) NOT DEFERRABLE;

