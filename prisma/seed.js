const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const user1 = await prisma.user.create({
    data: {
      email: "john@example.com",
      name: "John Doe",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "jane@example.com",
      name: "Jane Smith",
    },
  });

  console.log("✅ Users created:", { user1, user2 });

  // Create posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with Fastify",
      content: "Fastify is a fast and low overhead web framework for Node.js...",
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Introduction to Prisma ORM",
      content: "Prisma is a next-generation ORM that makes working with databases easy...",
      published: true,
      authorId: user2.id,
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Draft Post",
      content: "This is a draft post that is not published yet.",
      published: false,
      authorId: user1.id,
    },
  });

  console.log("✅ Posts created:", { post1, post2, post3 });
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

