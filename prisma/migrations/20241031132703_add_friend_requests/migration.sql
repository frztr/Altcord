-- CreateTable
CREATE TABLE "_UserFriendRequests" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserFriendRequests_AB_unique" ON "_UserFriendRequests"("A", "B");

-- CreateIndex
CREATE INDEX "_UserFriendRequests_B_index" ON "_UserFriendRequests"("B");

-- AddForeignKey
ALTER TABLE "_UserFriendRequests" ADD CONSTRAINT "_UserFriendRequests_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserFriendRequests" ADD CONSTRAINT "_UserFriendRequests_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
