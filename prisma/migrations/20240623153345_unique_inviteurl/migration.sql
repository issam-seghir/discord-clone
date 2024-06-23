/*
  Warnings:

  - A unique constraint covering the columns `[imageUrl]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Profile_imageUrl_key" ON "Profile"("imageUrl");
