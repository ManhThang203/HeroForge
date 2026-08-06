-- AlterTable
ALTER TABLE `generation_logs` MODIFY `sourceImageUrl` VARCHAR(191) NULL,
    MODIFY `resultImageUrl` VARCHAR(191) NULL,
    MODIFY `prompt` VARCHAR(191) NOT NULL,
    MODIFY `errorMessage` VARCHAR(191) NULL;
