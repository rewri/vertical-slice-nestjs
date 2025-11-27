-- Script de inicialização do banco de dados
-- Este arquivo será executado automaticamente na primeira inicialização do MariaDB

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `users` (`name`, `email`) VALUES
('Admin User', 'admin@example.com'),
('João Silva', 'joao@example.com'),
('Maria Santos', 'maria@example.com');

CREATE TABLE IF NOT EXISTS `profiles` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `profiles_title_unique` (`title`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `profiles` (`title`) VALUES
('ADMINISTRADOR'),
('ESPECIALISTA'),
('TECNICO');

CREATE TABLE IF NOT EXISTS `user_profiles` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `profile_id` bigint(20) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_profiles_user_profile_unique` (`user_id`, `profile_id`),
  KEY `user_profiles_user_id_foreign` (`user_id`),
  KEY `user_profiles_profile_id_foreign` (`profile_id`),
  CONSTRAINT `user_profiles_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `user_profiles_profile_id_foreign` FOREIGN KEY (`profile_id`) REFERENCES `profiles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `user_profiles` (`user_id`, `profile_id`) VALUES
(1, 1), -- Admin User tem perfil ADMINISTRADOR
(2, 2), -- João Silva tem perfil ESPECIALISTA  
(2, 3), -- João Silva também tem perfil TECNICO
(3, 3); -- Maria Santos tem perfil TECNICO

SELECT 'Inicialização do banco concluída!' as status;
SELECT COUNT(*) as total_users FROM users;
SELECT COUNT(*) as total_profiles FROM profiles;
SELECT COUNT(*) as total_user_profiles FROM user_profiles;