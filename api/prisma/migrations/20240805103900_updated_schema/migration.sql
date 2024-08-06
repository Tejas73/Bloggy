/*
  Warnings:

  - A unique constraint covering the columns `[userId,blogId]` on the table `BlogLike` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BlogLike_userId_blogId_key" ON "BlogLike"("userId", "blogId");
