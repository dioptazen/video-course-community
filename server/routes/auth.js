import bcrypt from 'bcrypt';
import { z } from 'zod';

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

export default async function (fastify) {
  fastify.post('/api/auth/register', async (request, reply) => {
    try {
      const { firstName, lastName, email, password } = registerSchema.parse(request.body);
      
      const hashedPassword = await bcrypt.hash(password, 10);
      const url = `@${firstName.toLowerCase()}-${lastName.toLowerCase()}-${Date.now()}`;
      
      const [result] = await fastify.mysql.execute(
        'INSERT INTO users (firstName, lastName, email, password, url) VALUES (?, ?, ?, ?, ?)',
        [firstName, lastName, email, hashedPassword, url]
      );
      
      const token = fastify.jwt.sign({ id: result.insertId });
      
      reply.send({ token });
    } catch (error) {
      reply.code(400).send(error);
    }
  });

  fastify.post('/api/auth/login', async (request, reply) => {
    const { email, password } = request.body;
    
    try {
      const [users] = await fastify.mysql.execute(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      
      if (users.length === 0) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const user = users[0];
      const valid = await bcrypt.compare(password, user.password);
      
      if (!valid) {
        return reply.code(401).send({ error: 'Invalid credentials' });
      }
      
      const token = fastify.jwt.sign({ id: user.id });
      reply.send({ token, user: { ...user, password: undefined } });
    } catch (error) {
      reply.code(500).send(error);
    }
  });
}