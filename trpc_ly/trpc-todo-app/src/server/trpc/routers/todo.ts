import { z } from "zod";
import { prisma } from "@/server/db/client";
import { publicProcedure, router } from "../trpc/trpc";



export const todoRouter = router({
  getAll: publicProcedure.query(async () => {
    return prisma.todo.findMany();
  }),
  add: publicProcedure
  .input(z.string())
  .mutation(async ({ input }: { input: string }) => {
    return prisma.todo.create({ data: { text: input } });
  }),
});
