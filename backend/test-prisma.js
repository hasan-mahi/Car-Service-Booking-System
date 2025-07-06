const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const all = await prisma.vehicle.findMany();
  console.log(all);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
