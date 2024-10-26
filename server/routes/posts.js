import { z } from 'zod';

const createPostSchema = z.object({
  groupId: z.number(),
  title: z.string().min(1),
  content: z.string().min(1),
  topicId: z.number().optional()
});

export default async function (fastify) {
  fastify.get('/api/groups/:url/posts', async (request, reply) => {
    const { url } = request.params;
    
    try {
      const [posts] = await fastify.mysql.execute(
        `SELECT p.*, u.firstName, u.lastName, u.profilePhoto
         FROM posts p
         JOIN users u ON p.userId = u.id
         JOIN groups g ON p.groupId = g.id
         WHERE g.url = ?
         ORDER BY p.isPinned DESC, p.createdAt DESC`,
        [url]
      );
      
      reply.send(posts);
    } catch (error) {
      reply.code(500).send(error);
    }
  });

  fastify.post('/api/posts', async (request, reply) => {
    try {
      const postData = createPostSchema.parse(request.body);
      const userId = request.user.id;
      
      const [result] = await fastify.mysql.execute(
        'INSERT INTO posts (groupId, userId, title, content, topicId) VALUES (?, ?, ?, ?, ?)',
        [postData.groupId, userId, postData.title, postData.content, postData.topicId]
      );
      
      const [posts] = await fastify.mysql.execute(
        'SELECT * FROM posts WHERE id = ?',
        [result.insertId]
      );
      
      reply.send(posts[0]);
    } catch (error) {
      reply.code(400).send(error);
    }
  });
}