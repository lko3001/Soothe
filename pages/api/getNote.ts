import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import prisma from "../../prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const user = body.session.user;
  const id = body.redContext.query.slug;

  try {
    const note = await prisma.note.findFirstOrThrow({
      where: { id: id, userId: user.id },
    });
    res.json(note);
  } catch (err) {
    res.status(404).json("No note with that ID found");
  }
}
