/*
  Warnings:

  - You are about to drop the column `blogLikes` on the `Blog` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "BlogLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "blogliked" BOOLEAN NOT NULL DEFAULT false,
    "blogId" TEXT,
    "userId" TEXT,
    CONSTRAINT "BlogLike_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "BlogLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Blog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "blogLike" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Blog_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Blog" ("authorId", "description", "id", "profileId", "title") SELECT "authorId", "description", "id", "profileId", "title" FROM "Blog";
DROP TABLE "Blog";
ALTER TABLE "new_Blog" RENAME TO "Blog";
PRAGMA foreign_key_check("Blog");
PRAGMA foreign_keys=ON;
