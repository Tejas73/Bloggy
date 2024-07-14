-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Comment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "comment" TEXT NOT NULL,
    "commentLikes" INTEGER NOT NULL DEFAULT 0,
    "commentDislikes" INTEGER NOT NULL DEFAULT 0,
    "userId" TEXT,
    "blogId" TEXT NOT NULL,
    "profileId" TEXT,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Comment_blogId_fkey" FOREIGN KEY ("blogId") REFERENCES "Blog" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Comment_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Comment" ("blogId", "comment", "commentDislikes", "commentLikes", "id", "userId") SELECT "blogId", "comment", "commentDislikes", "commentLikes", "id", "userId" FROM "Comment";
DROP TABLE "Comment";
ALTER TABLE "new_Comment" RENAME TO "Comment";
PRAGMA foreign_key_check("Comment");
PRAGMA foreign_keys=ON;
