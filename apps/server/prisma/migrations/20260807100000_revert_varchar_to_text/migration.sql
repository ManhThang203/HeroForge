-- AlterTable: khôi phục TEXT sau migration VARCHAR(191) gây lỗi prompt quá dài
ALTER TABLE `generation_logs`
    MODIFY `sourceImageUrl` TEXT NULL,
    MODIFY `resultImageUrl` TEXT NULL,
    MODIFY `prompt` TEXT NOT NULL,
    MODIFY `errorMessage` TEXT NULL;
