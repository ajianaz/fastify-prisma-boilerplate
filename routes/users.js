const prisma = require("../lib/prisma");

async function userRoutes(fastify, options) {
  // Get all users
  fastify.get("/users", async (request, reply) => {
    try {
      const users = await prisma.user.findMany({
        include: {
          posts: true,
        },
      });
      return { data: users };
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch users" });
    }
  });

  // Get user by ID
  fastify.get("/users/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const user = await prisma.user.findUnique({
        where: { id: parseInt(id) },
        include: {
          posts: true,
        },
      });

      if (!user) {
        return reply.code(404).send({ error: "User not found" });
      }

      return { data: user };
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch user" });
    }
  });

  // Create new user
  fastify.post(
    "/users",
    {
      schema: {
        body: {
          type: "object",
          required: ["email"],
          properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { email, name } = request.body;
        const user = await prisma.user.create({
          data: {
            email,
            name,
          },
        });

        reply.code(201).send({ data: user });
      } catch (error) {
        if (error.code === "P2002") {
          reply.code(400).send({ error: "Email already exists" });
        } else {
          reply.code(500).send({ error: "Failed to create user" });
        }
      }
    }
  );

  // Update user
  fastify.put(
    "/users/:id",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            email: { type: "string", format: "email" },
            name: { type: "string" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { email, name } = request.body;

        const user = await prisma.user.update({
          where: { id: parseInt(id) },
          data: {
            ...(email && { email }),
            ...(name && { name }),
          },
        });

        return { data: user };
      } catch (error) {
        if (error.code === "P2025") {
          reply.code(404).send({ error: "User not found" });
        } else if (error.code === "P2002") {
          reply.code(400).send({ error: "Email already exists" });
        } else {
          reply.code(500).send({ error: "Failed to update user" });
        }
      }
    }
  );

  // Delete user
  fastify.delete("/users/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      await prisma.user.delete({
        where: { id: parseInt(id) },
      });

      reply.code(204).send();
    } catch (error) {
      if (error.code === "P2025") {
        reply.code(404).send({ error: "User not found" });
      } else {
        reply.code(500).send({ error: "Failed to delete user" });
      }
    }
  });
}

module.exports = userRoutes;

