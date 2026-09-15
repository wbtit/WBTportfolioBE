import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Qwerty!23456", 10);

  const admin = await prisma.user.upsert({
    where: {
      username: "admin",
    },
    update: {
      password,
      is_admin: true,
      f_name: "Admin",
      m_name: "",
      l_name: "User",
    },
    create: {
      username: "admin",
      password,
      is_admin: true,
      f_name: "Admin",
      m_name: "",
      l_name: "User",
    },
  });

  console.log("Admin user created:", admin.username);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });