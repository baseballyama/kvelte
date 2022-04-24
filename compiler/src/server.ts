import Fastify, { FastifyInstance, RouteShorthandOptions } from "fastify";
import { Server, IncomingMessage, ServerResponse } from "http";

const server: FastifyInstance = Fastify({});

server.get<{ Body: { path: string } }>("/", async (request, reply) => {
  const { path } = request.body;
  reply.type("application/json").code(200).send({ message: "pong" });
});

export const start = async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
