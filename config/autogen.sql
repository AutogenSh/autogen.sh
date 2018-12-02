/*
 Navicat Premium Data Transfer

 Source Server         : 192.168.50.128
 Source Server Type    : MariaDB
 Source Server Version : 100137
 Source Host           : 192.168.50.128:53802
 Source Schema         : autogen

 Target Server Type    : MariaDB
 Target Server Version : 100137
 File Encoding         : 65001

 Date: 02/12/2018 22:52:53
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for t_article
-- ----------------------------
DROP TABLE IF EXISTS `t_article`;
CREATE TABLE `t_article`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '??(0:???, 1:??, 2:??)',
  `title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '????',
  `summary` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '????',
  `create_by` int(11) NOT NULL COMMENT '???(??ID)',
  `create_at` timestamp(4) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '????',
  `modify_at` timestamp(4) NOT NULL DEFAULT '0000-00-00 00:00:00.0000' COMMENT '????',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_t_article_id`(`id`) USING BTREE COMMENT '??ID??',
  INDEX `idx_t_article_create_at`(`create_at`) USING BTREE COMMENT '????????',
  INDEX `idx_t_article_status`(`status`) USING BTREE COMMENT '??????',
  INDEX `idx_t_article_title`(`title`) USING BTREE COMMENT '??????',
  INDEX `idx_t_article_summary`(`summary`(191)) USING BTREE COMMENT '??????',
  INDEX `idx_t_article_create_by`(`create_by`) USING BTREE COMMENT '???????',
  INDEX `idx_t_article_modify_at`(`modify_at`) USING BTREE COMMENT '????????',
  CONSTRAINT `fk_t_article_t_user_id` FOREIGN KEY (`create_by`) REFERENCES `t_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for t_article_body
-- ----------------------------
DROP TABLE IF EXISTS `t_article_body`;
CREATE TABLE `t_article_body`  (
  `article_id` int(11) NOT NULL COMMENT '??ID',
  `body` mediumtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '????',
  INDEX `idx_t_article_body_article_id`(`article_id`) USING BTREE COMMENT '??ID??',
  CONSTRAINT `fk_t_article_body_t_article_id` FOREIGN KEY (`article_id`) REFERENCES `t_article` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '?????' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for t_article_tag
-- ----------------------------
DROP TABLE IF EXISTS `t_article_tag`;
CREATE TABLE `t_article_tag`  (
  `article_id` int(11) NOT NULL COMMENT '??ID',
  `tag_id` int(11) NOT NULL COMMENT '??ID',
  PRIMARY KEY (`article_id`) USING BTREE,
  INDEX `idx_t_article_tag_article_id`(`article_id`) USING BTREE COMMENT '??ID??',
  INDEX `idx_t_article_tag_tag_id`(`tag_id`) USING BTREE COMMENT '??ID??',
  CONSTRAINT `fk_t_article_tag_t_article_id` FOREIGN KEY (`article_id`) REFERENCES `t_article` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_t_article_tag_t_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `t_tag` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '??-?????' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for t_menu_item
-- ----------------------------
DROP TABLE IF EXISTS `t_menu_item`;
CREATE TABLE `t_menu_item`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '????ID',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '?????',
  `order` int(11) NOT NULL COMMENT '??????',
  `permission` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '?????????(??ID)',
  `logo` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_t_menu_id`(`id`) USING BTREE COMMENT '????ID??',
  INDEX `idx_t_menu_name`(`name`) USING BTREE COMMENT '???????',
  INDEX `idx_t_menu_order`(`order`) USING BTREE COMMENT '????????',
  INDEX `fk_t_menu_t_permission`(`permission`) USING BTREE,
  CONSTRAINT `fk_t_menu_t_permission` FOREIGN KEY (`permission`) REFERENCES `t_permission` (`permission`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10010 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '?????' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_menu_item
-- ----------------------------
INSERT INTO `t_menu_item` VALUES (10000, 'Node', 10, 'ARTICLE_READ', 'icon-nodejs');
INSERT INTO `t_menu_item` VALUES (10001, 'Mysql', 20, 'ARTICLE_READ', 'icon-mysql');
INSERT INTO `t_menu_item` VALUES (10002, 'Spring', 30, 'ARTICLE_READ', 'icon-spring');
INSERT INTO `t_menu_item` VALUES (10003, 'Python', 40, 'ARTICLE_READ', 'icon-python');
INSERT INTO `t_menu_item` VALUES (10004, 'Hadoop', 50, 'ARTICLE_READ', 'icon-hadoop');
INSERT INTO `t_menu_item` VALUES (10005, '????', 60, 'ARTICLE_WRITE', 'layui-icon-read');
INSERT INTO `t_menu_item` VALUES (10006, '????', 70, 'ARTICLE_WRITE', 'layui-icon-face-surprised');
INSERT INTO `t_menu_item` VALUES (10007, '????', 80, 'ARTICLE_WRITE', 'layui-icon-face-smile-fine');
INSERT INTO `t_menu_item` VALUES (10008, '????', 90, 'ARTICLE_WRITE', 'layui-icon-user');
INSERT INTO `t_menu_item` VALUES (10009, '????', 100, 'ARTICLE_WRITE', 'layui-icon-app');

-- ----------------------------
-- Table structure for t_menu_tag
-- ----------------------------
DROP TABLE IF EXISTS `t_menu_tag`;
CREATE TABLE `t_menu_tag`  (
  `menu_id` int(11) NOT NULL,
  `tag_id` int(11) NOT NULL,
  PRIMARY KEY (`menu_id`) USING BTREE,
  INDEX `idx_t_menu_tag_menu_id`(`menu_id`) USING BTREE COMMENT '????ID??',
  INDEX `idx_t_menu_tag_tag_id`(`tag_id`) USING BTREE COMMENT '??ID??',
  CONSTRAINT `fk_t_menu_tag_t_menu` FOREIGN KEY (`menu_id`) REFERENCES `t_menu_item` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_t_menu_tag_t_tag` FOREIGN KEY (`tag_id`) REFERENCES `t_tag` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for t_permission
-- ----------------------------
DROP TABLE IF EXISTS `t_permission`;
CREATE TABLE `t_permission`  (
  `permission` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '??',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???',
  PRIMARY KEY (`permission`) USING BTREE,
  INDEX `idx_t_permission`(`permission`) USING BTREE COMMENT '????',
  INDEX `idx_t_permission_name`(`name`) USING BTREE COMMENT '?????'
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_permission
-- ----------------------------
INSERT INTO `t_permission` VALUES ('ARTICLE_WRITE', '????');
INSERT INTO `t_permission` VALUES ('ARTICLE_READ', '????');

-- ----------------------------
-- Table structure for t_role
-- ----------------------------
DROP TABLE IF EXISTS `t_role`;
CREATE TABLE `t_role`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_t_role_id`(`id`) USING BTREE COMMENT '??ID??',
  INDEX `idx_t_role_name`(`name`) USING BTREE COMMENT '?????'
) ENGINE = InnoDB AUTO_INCREMENT = 10002 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_role
-- ----------------------------
INSERT INTO `t_role` VALUES (10001, '??');
INSERT INTO `t_role` VALUES (10000, '??');

-- ----------------------------
-- Table structure for t_role_permission
-- ----------------------------
DROP TABLE IF EXISTS `t_role_permission`;
CREATE TABLE `t_role_permission`  (
  `role_id` int(11) NOT NULL COMMENT '??ID',
  `permission` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '??',
  PRIMARY KEY (`role_id`, `permission`) USING BTREE,
  INDEX `idx_t_role_permission_role_id`(`role_id`) USING BTREE COMMENT '??ID??',
  INDEX `idx_t_role_permission_permission`(`permission`) USING BTREE COMMENT '????',
  CONSTRAINT `fk_t_role_permission_permission` FOREIGN KEY (`permission`) REFERENCES `t_permission` (`permission`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `fk_t_role_permission_role_id` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '??-???' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_role_permission
-- ----------------------------
INSERT INTO `t_role_permission` VALUES (10000, 'ARTICLE_READ');
INSERT INTO `t_role_permission` VALUES (10001, 'ARTICLE_READ');
INSERT INTO `t_role_permission` VALUES (10001, 'ARTICLE_WRITE');

-- ----------------------------
-- Table structure for t_tag
-- ----------------------------
DROP TABLE IF EXISTS `t_tag`;
CREATE TABLE `t_tag`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '????(0:??,1:???)',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_t_tag_id`(`id`) USING BTREE COMMENT '??ID??',
  INDEX `idx_t_tag_name`(`name`) USING BTREE COMMENT '?????',
  INDEX `idx_t_tag_status`(`status`) USING BTREE COMMENT '??????'
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???' ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for t_user
-- ----------------------------
DROP TABLE IF EXISTS `t_user`;
CREATE TABLE `t_user`  (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '??ID',
  `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '????(0:??,1:??)',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '???',
  `role` int(11) NOT NULL COMMENT '??ID',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_t_user_id`(`id`) USING BTREE COMMENT '??ID??',
  INDEX `idx_t_user_name`(`name`) USING BTREE COMMENT '?????',
  INDEX `idx_t_user_role`(`role`) USING BTREE COMMENT '??????',
  INDEX `idx_t_user_status`(`status`) USING BTREE COMMENT '??????',
  CONSTRAINT `fk_t_user_t_role_id` FOREIGN KEY (`role`) REFERENCES `t_role` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 10002 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '???' ROW_FORMAT = Compact;

-- ----------------------------
-- Records of t_user
-- ----------------------------
INSERT INTO `t_user` VALUES (10000, 1, 'autogen', 10001);
INSERT INTO `t_user` VALUES (10001, 1, 'guest', 10000);

SET FOREIGN_KEY_CHECKS = 1;
