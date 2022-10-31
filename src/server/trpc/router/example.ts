import { z } from "zod";
import { prisma } from "../../../server/db/client";

import { router, publicProcedure } from "../trpc";
import ShortUniqueId from "short-unique-id";

export const exampleRouter = router({
  shorten: publicProcedure
    .input(
      z.object({
        longUrl: z.string(),
        customAlias: z.string().optional(),
        expireTime: z.date().optional(),
      })
    )
    .mutation(async ({ input: { longUrl, customAlias, expireTime } }) => {
      const id = customAlias ? customAlias : new ShortUniqueId({ length: 5 })();
      console.log("id", id);

      const { alias } = await prisma.url.create({
        data: {
          longUrl,
          alias: id,
          expireAt: expireTime ?? null,
        },
      });

      return {
        shortened: alias,
      };
    }),
});
