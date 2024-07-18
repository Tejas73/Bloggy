-- CreateTable
CREATE TABLE "CommentLike" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "liked" BOOLEAN NOT NULL,
    "disliked" BOOLEAN NOT NULL,
    "userId" TEXT NOT NULL,
    "commentId" TEXT NOT NULL,
    CONSTRAINT "CommentLike_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_userId_commentId_key" ON "CommentLike"("userId", "commentId");
