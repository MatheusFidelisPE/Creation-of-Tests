import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Limpar dados existentes
  await prisma.provaQuestao.deleteMany();
  await prisma.prova.deleteMany();
  await prisma.alternativa.deleteMany();
  await prisma.questao.deleteMany();

  // Criar questões de exemplo
  const questao1 = await prisma.questao.create({
    data: {
      enunciado: "Qual é a capital do Brasil?",
      alternativas: {
        create: [
          { descricao: "São Paulo", correta: false },
          { descricao: "Brasília", correta: true },
          { descricao: "Rio de Janeiro", correta: false },
          { descricao: "Belo Horizonte", correta: false },
        ],
      },
    },
  });

  const questao2 = await prisma.questao.create({
    data: {
      enunciado: "Qual é o maior planeta do sistema solar?",
      alternativas: {
        create: [
          { descricao: "Marte", correta: false },
          { descricao: "Saturno", correta: false },
          { descricao: "Júpiter", correta: true },
          { descricao: "Netuno", correta: false },
        ],
      },
    },
  });

  const questao3 = await prisma.questao.create({
    data: {
      enunciado: "Quantos lados tem um triângulo?",
      alternativas: {
        create: [
          { descricao: "2 lados", correta: false },
          { descricao: "3 lados", correta: true },
          { descricao: "4 lados", correta: false },
          { descricao: "5 lados", correta: false },
        ],
      },
    },
  });

  const questao4 = await prisma.questao.create({
    data: {
      enunciado: "Qual é a cor do céu em um dia claro?",
      alternativas: {
        create: [
          { descricao: "Verde", correta: false },
          { descricao: "Vermelho", correta: false },
          { descricao: "Azul", correta: true },
          { descricao: "Rosa", correta: false },
        ],
      },
    },
  });

  const questao5 = await prisma.questao.create({
    data: {
      enunciado: "Qual é o animal terrestre mais rápido?",
      alternativas: {
        create: [
          { descricao: "Chita", correta: true },
          { descricao: "Leão", correta: false },
          { descricao: "Cavalo", correta: false },
          { descricao: "Leopardo", correta: false },
        ],
      },
    },
  });

  console.log("✓ Questões criadas com sucesso!");
  console.log(`  - ${questao1.enunciado}`);
  console.log(`  - ${questao2.enunciado}`);
  console.log(`  - ${questao3.enunciado}`);
  console.log(`  - ${questao4.enunciado}`);
  console.log(`  - ${questao5.enunciado}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
