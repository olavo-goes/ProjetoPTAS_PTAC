/*
  Warnings:

  - Added the required column `bairro` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cidade` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rua` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sobrenome` to the `Usuario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uf` to the `Usuario` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "sobrenome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "dataCadastro" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ultimaAtualizacao" DATETIME NOT NULL
);
INSERT INTO "new_Usuario" ("dataCadastro", "email", "id", "isAdmin", "nome", "password", "ultimaAtualizacao") SELECT "dataCadastro", "email", "id", "isAdmin", "nome", "password", "ultimaAtualizacao" FROM "Usuario";
DROP TABLE "Usuario";
ALTER TABLE "new_Usuario" RENAME TO "Usuario";
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
