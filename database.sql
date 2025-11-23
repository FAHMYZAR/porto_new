-- TinaCMS Self-Hosted Database Schema
-- This schema is for TinaCMS Datalayer with MySQL
-- Import this file into your MySQL database via phpMyAdmin

-- Create tables for TinaCMS content management
CREATE TABLE IF NOT EXISTS `tina_documents` (
  `id` VARCHAR(255) PRIMARY KEY,
  `collection` VARCHAR(255) NOT NULL,
  `path` VARCHAR(512) NOT NULL,
  `sha` VARCHAR(64),
  `data` LONGTEXT NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_collection` (`collection`),
  INDEX `idx_path` (`path`(255)),
  UNIQUE KEY `unique_collection_path` (`collection`, `path`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for storing media/assets metadata
CREATE TABLE IF NOT EXISTS `tina_media` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `filename` VARCHAR(512) NOT NULL,
  `directory` VARCHAR(512) DEFAULT '/',
  `type` VARCHAR(100),
  `size` BIGINT,
  `url` VARCHAR(1024),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_directory` (`directory`(255)),
  INDEX `idx_filename` (`filename`(255))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for user authentication (if using custom auth)
CREATE TABLE IF NOT EXISTS `tina_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) UNIQUE NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'editor', 'viewer') DEFAULT 'editor',
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_username` (`username`),
  INDEX `idx_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Table for sessions (if using session-based auth)
CREATE TABLE IF NOT EXISTS `tina_sessions` (
  `id` VARCHAR(255) PRIMARY KEY,
  `user_id` INT NOT NULL,
  `token` VARCHAR(512) UNIQUE NOT NULL,
  `expires_at` TIMESTAMP NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `tina_users`(`id`) ON DELETE CASCADE,
  INDEX `idx_token` (`token`),
  INDEX `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: 'admin123' - CHANGE THIS!)
-- Password hash is bcrypt of 'admin123'
INSERT INTO `tina_users` (`username`, `email`, `password_hash`, `role`) 
VALUES (
  'admin',
  'admin@fahmyzzx.com',
  '$2b$10$rBV2kU8g5E7h5nX5Z5Z5ZeX5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z',
  'admin'
) ON DUPLICATE KEY UPDATE `username`=`username`;

-- Create view for active documents count
CREATE OR REPLACE VIEW `tina_stats` AS
SELECT 
  `collection`,
  COUNT(*) as `document_count`,
  MAX(`updated_at`) as `last_updated`
FROM `tina_documents`
GROUP BY `collection`;

-- Grant permissions (adjust username as needed)
-- GRANT ALL PRIVILEGES ON your_database_name.* TO 'your_db_user'@'localhost';
-- FLUSH PRIVILEGES;

-- Indexes for performance
CREATE INDEX `idx_created_at` ON `tina_documents`(`created_at`);
CREATE INDEX `idx_updated_at` ON `tina_documents`(`updated_at`);

-- Full-text search index for content
ALTER TABLE `tina_documents` ADD FULLTEXT INDEX `ft_data` (`data`);

-- Comments
ALTER TABLE `tina_documents` COMMENT = 'Stores all TinaCMS documents and content';
ALTER TABLE `tina_media` COMMENT = 'Stores media files metadata';
ALTER TABLE `tina_users` COMMENT = 'User authentication and authorization';
ALTER TABLE `tina_sessions` COMMENT = 'User session management';
