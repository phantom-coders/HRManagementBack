/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `adminPassword` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mail_box` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mailAddress` VARCHAR(191) NOT NULL,
    `mailPassword` VARCHAR(191) NOT NULL,
    `mailCount` INTEGER NOT NULL,
    `mailBoxSize` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mail_box_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mail_box_setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `mailBoxName` VARCHAR(191) NOT NULL,
    `userMaxBox` INTEGER NOT NULL,
    `boxMaxSize` INTEGER NOT NULL,
    `boxValidity` INTEGER NOT NULL,
    `smtpServer` VARCHAR(191) NOT NULL,
    `smtpMailAddress` VARCHAR(191) NOT NULL,
    `smtpPassword` VARCHAR(191) NOT NULL,
    `smtpPort` INTEGER NOT NULL,
    `smtpSecurity` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `mail_box_setting_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reserved_box` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `reservedBoxEmail` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `reserved_box_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `user_id_key` ON `user`(`id`);

-- AddForeignKey
ALTER TABLE `admin` ADD CONSTRAINT `admin_id_fkey` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mail_box` ADD CONSTRAINT `mail_box_id_fkey` FOREIGN KEY (`id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mail_box_setting` ADD CONSTRAINT `mail_box_setting_id_fkey` FOREIGN KEY (`id`) REFERENCES `mail_box`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `reserved_box` ADD CONSTRAINT `reserved_box_id_fkey` FOREIGN KEY (`id`) REFERENCES `mail_box_setting`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
