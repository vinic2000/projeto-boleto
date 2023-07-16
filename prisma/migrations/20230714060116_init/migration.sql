-- CreateTable
CREATE TABLE "Lotes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "boletos" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome_sacado" TEXT NOT NULL,
    "id_lote" INTEGER NOT NULL,
    "valor" DECIMAL NOT NULL,
    "linha_digitavel" TEXT NOT NULL,
    "ativo" BOOLEAN NOT NULL,
    "criado_em" DATETIME NOT NULL,
    "lotesId" INTEGER,
    CONSTRAINT "boletos_lotesId_fkey" FOREIGN KEY ("lotesId") REFERENCES "Lotes" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
