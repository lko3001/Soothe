import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email || "" },
  });

  if (req.method === "POST" && user && user.id) {
    try {
      const body = JSON.parse(req.body);
      const note = {
        title: body.title,
        content: body.content,
        userId: user.id,
      };

      const createdNote = await prisma.note.upsert({
        where: { id: body.id },
        update: { ...note, updatedAt: new Date() },
        create: { ...note, createdAt: new Date(), updatedAt: new Date() },
      });
      res.send({ createdNote, body });
    } catch (err) {
      res.send({ error: err });
    }
  }
}
