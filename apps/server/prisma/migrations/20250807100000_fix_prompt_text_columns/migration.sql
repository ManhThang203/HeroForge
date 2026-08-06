-- AlterTable: prompt và URL có thể dài hơn VARCHAR(191)
ALTER TABLE `generation_logs`
    MODIFY `sourceImageUrl` TEXT NULL,
    MODIFY `resultImageUrl` TEXT NULL,
    MODIFY `prompt` TEXT NOT NULL,
    MODIFY `errorMessage` TEXT NULL;
