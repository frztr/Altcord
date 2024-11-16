/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `TalkType` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TalkType_name_key" ON "TalkType"("name");
