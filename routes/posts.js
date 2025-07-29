const prisma = require("../lib/prisma");

async function postRoutes(fastify, options) {
  // Get all posts
  fastify.get("/posts", async (request, reply) => {
    try {
      const posts = await prisma.post.findMany({
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return { data: posts };
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch posts" });
    }
  });

  // Get post by ID
  fastify.get("/posts/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      const post = await prisma.post.findUnique({
        where: { id: parseInt(id) },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!post) {
        return reply.code(404).send({ error: "Post not found" });
      }

      return { data: post };
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch post" });
    }
  });

  // Get published posts only
  fastify.get("/posts/published", async (request, reply) => {
    try {
      const posts = await prisma.post.findMany({
        where: { published: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      return { data: posts };
    } catch (error) {
      reply.code(500).send({ error: "Failed to fetch published posts" });
    }
  });

  // Create new post
  fastify.post(
    "/posts",
    {
      schema: {
        body: {
          type: "object",
          required: ["title", "authorId"],
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            published: { type: "boolean" },
            authorId: { type: "integer" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { title, content, published = false, authorId } = request.body;

        // Check if author exists
        const author = await prisma.user.findUnique({
          where: { id: authorId },
        });

        if (!author) {
          return reply.code(400).send({ error: "Author not found" });
        }

        const post = await prisma.post.create({
          data: {
            title,
            content,
            published,
            authorId,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        reply.code(201).send({ data: post });
      } catch (error) {
        reply.code(500).send({ error: "Failed to create post" });
      }
    }
  );

  // Update post
  fastify.put(
    "/posts/:id",
    {
      schema: {
        body: {
          type: "object",
          properties: {
            title: { type: "string" },
            content: { type: "string" },
            published: { type: "boolean" },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const { id } = request.params;
        const { title, content, published } = request.body;

        const post = await prisma.post.update({
          where: { id: parseInt(id) },
          data: {
            ...(title && { title }),
            ...(content !== undefined && { content }),
            ...(published !== undefined && { published }),
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        });

        return { data: post };
      } catch (error) {
        if (error.code === "P2025") {
          reply.code(404).send({ error: "Post not found" });
        } else {
          reply.code(500).send({ error: "Failed to update post" });
        }
      }
    }
  );

  // Delete post
  fastify.delete("/posts/:id", async (request, reply) => {
    try {
      const { id } = request.params;
      await prisma.post.delete({
        where: { id: parseInt(id) },
      });

      reply.code(204).send();
    } catch (error) {
      if (error.code === "P2025") {
        reply.code(404).send({ error: "Post not found" });
      } else {
        reply.code(500).send({ error: "Failed to delete post" });
      }
    }
  });
}

module.exports = postRoutes;

