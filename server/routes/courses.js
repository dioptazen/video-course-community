import { z } from 'zod';

const createModuleSchema = z.object({
  groupId: z.number(),
  title: z.string().min(1),
  description: z.string(),
  parentId: z.number().optional(),
  type: z.enum(['MAIN', 'SECTION', 'LESSON']),
  videoUrl: z.string().url().optional(),
  image: z.string().url().optional()
});

export default async function (fastify) {
  fastify.get('/api/groups/:url/modules', async (request, reply) => {
    const { url } = request.params;
    
    try {
      const [modules] = await fastify.mysql.execute(
        `SELECT m.*
         FROM course_modules m
         JOIN groups g ON m.groupId = g.id
         WHERE g.url = ?
         ORDER BY m.parentId, m.orderIndex`,
        [url]
      );
      
      reply.send(modules);
    } catch (error) {
      reply.code(500).send(error);
    }
  });

  fastify.get('/api/groups/:url/progress', async (request, reply) => {
    const { url } = request.params;
    const userId = request.user.id;
    
    try {
      const [progress] = await fastify.mysql.execute(
        `SELECT mp.*
         FROM module_progress mp
         JOIN course_modules m ON mp.moduleId = m.id
         JOIN groups g ON m.groupId = g.id
         WHERE g.url = ? AND mp.userId = ?`,
        [url, userId]
      );
      
      reply.send(progress);
    } catch (error) {
      reply.code(500).send(error);
    }
  });

  fastify.post('/api/modules/:id/complete', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.id;
    
    try {
      await fastify.mysql.execute(
        `INSERT INTO module_progress (userId, moduleId, completed, completedAt)
         VALUES (?, ?, true, CURRENT_TIMESTAMP)
         ON DUPLICATE KEY UPDATE completed = true, completedAt = CURRENT_TIMESTAMP`,
        [userId, id]
      );
      
      const [progress] = await fastify.mysql.execute(
        'SELECT * FROM module_progress WHERE userId = ? AND moduleId = ?',
        [userId, id]
      );
      
      reply.send(progress[0]);
    } catch (error) {
      reply.code(500).send(error);
    }
  });
}