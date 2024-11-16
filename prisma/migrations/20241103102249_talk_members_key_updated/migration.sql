/*
  Warnings:

  - The primary key for the `TalkMembers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TalkMembers` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TalkMembers" DROP CONSTRAINT "TalkMembers_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "TalkMembers_pkey" PRIMARY KEY ("talkId", "userId");
