/*
  Warnings:

  - You are about to drop the column `birthdate` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `birthdate`,
    ADD COLUMN `birthDate` DATE NULL;
