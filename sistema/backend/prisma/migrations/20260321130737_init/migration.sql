-- CreateTable
CREATE TABLE "questoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "enunciado" TEXT NOT NULL,
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "alternativas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "questaoId" INTEGER NOT NULL,
    "correta" BOOLEAN NOT NULL,
    "descricao" TEXT NOT NULL,
    CONSTRAINT "alternativas_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "provas" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipoDeResposta" TEXT NOT NULL DEFAULT 'LETRAS',
    "dataCriacao" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataModificacao" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "prova_questoes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "provaId" INTEGER NOT NULL,
    "questaoId" INTEGER NOT NULL,
    "ordem" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "prova_questoes_provaId_fkey" FOREIGN KEY ("provaId") REFERENCES "provas" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "prova_questoes_questaoId_fkey" FOREIGN KEY ("questaoId") REFERENCES "questoes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "prova_questoes_provaId_questaoId_key" ON "prova_questoes"("provaId", "questaoId");
