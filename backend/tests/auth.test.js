const request = require("supertest");
const app = require("../index.js");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

beforeEach(async () => {
  await prisma.usuario.deleteMany({});
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("POST /auth/cadastro deve cadastrar usuario", async () => {
  const res = await request(app).post("/auth/cadastro").send({
    nome: "bbbaab",
    email: `bbaabbb${Date.now()}@email.com`, // email único
    password: "123456"
  });
  expect(res.statusCode).toBe(201);
  expect(res.body.mensagem).toBe("Usuário cadastrado com sucesso!");
  expect(res.body.erro).toBe(false);
  expect(res.body.token).toBeDefined();
});

test("POST /auth/login deve autenticar e retornar o token", async () => {
  // Primeiro cadastra o usuário
  const email = `admin${Date.now()}@email.com`;
  await request(app).post("/auth/cadastro").send({
    nome: "Admin",
    email,
    password: "123456"
  });

  // Depois testa o login
  const res = await request(app).post("/auth/login").send({
    email,
    password: "123456"
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.mensagem).toBe("Autenticado com sucesso!");
  expect(res.body.erro).toBe(false);
  expect(res.body.token).toBeDefined();
});

test("POST /auth/login deve falhar com senha incorreta", async () => {
  const email = `marina${Date.now()}@email.com`;
  await request(app).post("/auth/cadastro").send({
    nome: "Marina",
    email,
    password: "123456"
  });

  const res = await request(app).post("/auth/login").send({
    email,
    password: "44444"
  });

  expect(res.statusCode).toBe(401);
  expect(res.body.mensagem).toBe("Senha incorreta!");
  expect(res.body.erro).toBe(true);
});

test("POST /auth/login deve falhar se o usuário não existir", async () => {
  const res = await request(app).post("/auth/login").send({
    email: "naoexiste@email.com",
    password: "123456"
  });

  expect(res.statusCode).toBe(404);
  expect(res.body.mensagem).toBe("Usuário não existe!");
  expect(res.body.erro).toBe(true);
});