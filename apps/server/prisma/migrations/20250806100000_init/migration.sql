-- CreateTable
CREATE TABLE `generation_logs` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `finishedAt` DATETIME(3) NULL,
    `name` VARCHAR(191) NOT NULL,
    `sourceImageUrl` TEXT NULL,
    `resultImageUrl` TEXT NULL,
    `prompt` TEXT NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `requestPayload` JSON NOT NULL,
    `httpStatus` INTEGER NULL,
    `responseSummary` JSON NULL,
    `latencyMs` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL,
    `errorMessage` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `generation_logs_createdAt_idx` ON `generation_logs`(`createdAt` DESC);
