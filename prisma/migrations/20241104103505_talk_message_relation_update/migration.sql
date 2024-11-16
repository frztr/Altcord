-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_talkId_fkey";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_talkId_fkey" FOREIGN KEY ("talkId") REFERENCES "Talk"("id") ON DELETE CASCADE ON UPDATE CASCADE;
