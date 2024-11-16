/*
  Warnings:

  - The primary key for the `TalkMembers` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "TalkMembers" DROP CONSTRAINT "TalkMembers_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "TalkMembers_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "TalkMembers_id_seq";
