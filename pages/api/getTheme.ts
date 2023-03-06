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

  if (req.method === "GET" && user && user.id) {
    try {
      const customTheme = await prisma.user.findUniqueOrThrow({
        where: { id: user.id },
        select: { theme: true },
      });
      res.send(customTheme);
    } catch (err) {
      res.send({ error: "ERROR" });
    }
  }
}
