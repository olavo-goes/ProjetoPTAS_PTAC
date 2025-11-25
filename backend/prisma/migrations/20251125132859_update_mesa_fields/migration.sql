/*
  Warnings:

  - You are about to drop the column `codigo` on the `Mesa` table. All the data in the column will be lost.
  - You are about to drop the column `n_lugares` on the `Mesa` table. All the data in the column will be lost.
  - Added the required column `capacidade` to the `Mesa` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numero` to the `Mesa` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Mesa" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "numero" TEXT NOT NULL,
    "capacidade" INTEGER NOT NULL,
    "descricao" TEXT
);
INSERT INTO "new_Mesa" ("id") SELECT "id" FROM "Mesa";
DROP TABLE "Mesa";
ALTER TABLE "new_Mesa" RENAME TO "Mesa";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
