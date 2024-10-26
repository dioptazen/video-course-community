import { z } from 'zod';

const createGroupSchema = z.object({
  name: z.string().min(3),
  description: z.string(),
  logo: z.string().url().optional()
});

export default async function (fastify) {
  fastify.get('/api/groups', async (request, reply) => {
    const { search } = request.query;
    let query = `
      SELECT g.*, 
        COUNT(DISTINCT gm.userId) as memberCount,
        COUNT(DISTINCT CASE WHEN gm.lastActive > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN gm.userId END) as onlineCount
      FROM groups g
      LEFT JOIN group_members gm ON g.id = gm.groupId
    `;
    
    const params = [];
    if (search) {
      query += ' WHERE g.name LIKE ? OR g.description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' GROUP BY g.id ORDER BY memberCount DESC';
    
    try {
      const [groups] = await fastify.mysql.execute(query, params);
      reply.send(groups);
    } catch (error) {
      reply.code(500).send(error);
    }
  });

  fastify.get('/api/groups/:url', async (request, reply) => {
    const { url } = request.params;
    
    try {
      const [groups] = await fastify.mysql.execute(
        `SELECT g.*, 
          COUNT(DISTINCT gm.userId) as memberCount,
          COUNT(DISTINCT CASE WHEN gm.lastActive > DATE_SUB(NOW(), INTERVAL 5 MINUTE) THEN gm.userId END) as onlineCount
        FROM groups g
        LEFT JOIN group_members gm ON g.id = gm.groupId
        WHERE g.url = ?
        GROUP BY g.id`,
        [url]
      );
      
      if (groups.length === 0) {
        return reply.code(404).send({ error: 'Group not found' });
      }
      
      reply.send(groups[0]);
    } catch (error) {
      reply.code(500).send(error);
    }
  });

  fastify.post('/api/groups/:id/join', async (request, reply) => {
    const { id } = request.params;
    const userId = request.user.id;
    
    try {
      await fastify.mysql.execute(
        'INSERT INTO group_members (groupId, userId) VALUES (?, ?)',
        [id, userId]
      );
      reply.send({ success: true });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        reply.code(400).send({ error: 'Already a member of this group' });
      } else {
        reply.code(500).send(error);
      }
    }
  });
}