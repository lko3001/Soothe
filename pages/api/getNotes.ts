import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const user = JSON.parse(req.body);
      const userId = await prisma.user.findUniqueOrThrow({
        where: { email: user.email },
        select: { id: true },
      });
      const notes = await prisma.note.findMany({
        where: { userId: userId.id },
      });
      res.json(notes);
    } catch (err) {
      res.json({ error: err });
    }
  } else {
    res.json("Nothing");
  }
}
