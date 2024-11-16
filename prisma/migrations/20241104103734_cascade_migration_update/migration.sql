-- DropForeignKey
ALTER TABLE "Talk" DROP CONSTRAINT "Talk_typeId_fkey";

-- DropForeignKey
ALTER TABLE "TalkMembers" DROP CONSTRAINT "TalkMembers_talkId_fkey";

-- DropForeignKey
ALTER TABLE "TalkMembers" DROP CONSTRAINT "TalkMembers_userId_fkey";

-- AddForeignKey
ALTER TABLE "Talk" ADD CONSTRAINT "Talk_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "TalkType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalkMembers" ADD CONSTRAINT "TalkMembers_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "Talk"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TalkMembers" ADD CONSTRAINT "TalkMembers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
