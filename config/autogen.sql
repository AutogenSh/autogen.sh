CREATE TABLE `t_article` (
`id` int(11) NOT NULL AUTO_INCREMENT,
`status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '状态(0:未发布, 1:发布, 2:删除)',
`title` varchar(64) NOT NULL COMMENT '文章标题',
`summary` varchar(255) NOT NULL COMMENT '文章描述',
`create_by` int(11) NOT NULL COMMENT '创建者(用户ID)',
`create_at` timestamp(4) NOT NULL COMMENT '创建日期',
`modify_at` timestamp(4) NOT NULL COMMENT '修改日期',
PRIMARY KEY (`id`) ,
INDEX `idx_t_article_id` (`id` ASC) USING BTREE COMMENT '文章ID索引' ,
INDEX `idx_t_article_create_at` (`create_at` ASC) USING BTREE COMMENT '文章创建日期索引' ,
INDEX `idx_t_article_status` (`status` ASC) USING BTREE COMMENT '文章状态索引' ,
INDEX `idx_t_article_title` (`title` ASC) USING BTREE COMMENT '文章标题索引' ,
INDEX `idx_t_article_summary` (`summary` ASC) USING BTREE COMMENT '文章摘要索引' ,
INDEX `idx_t_article_create_by` (`create_by` ASC) USING BTREE COMMENT '文章创建人索引' ,
INDEX `idx_t_article_modify_at` (`modify_at` ASC) USING BTREE COMMENT '文章修改时间索引' 
)
COMMENT = '文章表';
CREATE TABLE `t_article_body` (
`article_id` int(11) NOT NULL COMMENT '文章ID',
`body` mediumtext NULL COMMENT '文章正文',
INDEX `idx_t_article_body_article_id` (`article_id` ASC) USING BTREE COMMENT '文章ID索引' 
)
COMMENT = '文章正文表';
CREATE TABLE `t_menu_item` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '菜单条目ID',
`name` varchar(32) NOT NULL COMMENT '菜单条目名',
`order` int(11) NOT NULL COMMENT '菜单条目顺序',
`permission` int(11) NOT NULL COMMENT '菜单条目需要的权限(权限ID)',
PRIMARY KEY (`id`) ,
INDEX `idx_t_menu_id` (`id` ASC) USING BTREE COMMENT '菜单条目ID索引' ,
INDEX `idx_t_menu_name` (`name` ASC) USING BTREE COMMENT '菜单条目名索引' ,
INDEX `idx_t_menu_order` (`order` ASC) USING BTREE COMMENT '菜单条目排序索引' 
)
COMMENT = '菜单条目表';
CREATE TABLE `t_user` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
`status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '用户状态(0:冻结,1:正常)',
`name` varchar(32) NOT NULL COMMENT '用户名',
`role` int(11) NOT NULL COMMENT '角色ID',
PRIMARY KEY (`id`) ,
INDEX `idx_t_user_id` (`id` ASC) USING BTREE COMMENT '用户ID索引' ,
INDEX `idx_t_user_name` (`name` ASC) USING BTREE COMMENT '用户名索引' ,
INDEX `idx_t_user_role` (`role` ASC) USING BTREE COMMENT '用户角色索引' ,
INDEX `idx_t_user_status` (`status` ASC) USING BTREE COMMENT '用户状态索引' 
)
COMMENT = '用户表';
CREATE TABLE `t_role` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '角色ID',
`name` varchar(32) NOT NULL COMMENT '角色名',
PRIMARY KEY (`id`) ,
INDEX `idx_t_role_id` (`id` ASC) USING BTREE COMMENT '角色ID索引' ,
INDEX `idx_t_role_name` (`name` ASC) USING BTREE COMMENT '角色名索引' 
)
COMMENT = '角色表';
CREATE TABLE `t_permission` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '权限ID',
`permission` varchar(32) NOT NULL COMMENT '权限',
`name` varchar(32) NOT NULL COMMENT '权限名',
PRIMARY KEY (`id`) ,
INDEX `idx_t_permission_id` (`id` ASC) USING BTREE COMMENT '权限ID索引' ,
INDEX `idx_t_permission` (`permission` ASC) USING BTREE COMMENT '权限索引' ,
INDEX `idx_t_permission_name` (`name` ASC) USING BTREE COMMENT '权限名索引' 
)
COMMENT = '权限表';
CREATE TABLE `t_tag` (
`id` int(11) NOT NULL AUTO_INCREMENT COMMENT '标签ID',
`status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '标签状态(0:删除,1:使用中)',
`name` varchar(32) NOT NULL COMMENT '标签名',
PRIMARY KEY (`id`) ,
INDEX `idx_t_tag_id` (`id` ASC) USING BTREE COMMENT '标签ID索引' ,
INDEX `idx_t_tag_name` (`name` ASC) USING BTREE COMMENT '标签名索引' ,
INDEX `idx_t_tag_status` (`status` ASC) USING BTREE COMMENT '标签状态索引' 
)
COMMENT = '标签表';
CREATE TABLE `t_article_tag` (
`article_id` int(11) NOT NULL COMMENT '文章ID',
`tag_id` int(11) NOT NULL COMMENT '标签ID',
PRIMARY KEY (`article_id`) ,
INDEX `idx_t_article_tag_article_id` (`article_id` ASC) USING BTREE COMMENT '文章ID索引' ,
INDEX `idx_t_article_tag_tag_id` (`tag_id` ASC) USING BTREE COMMENT '标签ID索引' 
)
COMMENT = '文章-标签关联表';
CREATE TABLE `t_role_permission` (
`role_id` int(11) NOT NULL COMMENT '角色ID',
`permission_id` int(11) NOT NULL COMMENT '权限ID',
PRIMARY KEY (`role_id`) ,
INDEX `idx_t_role_permission_permission_id` (`permission_id` ASC) USING BTREE COMMENT '权限ID索引' ,
INDEX `idx_t_role_permission_role_id` (`role_id` ASC) USING BTREE COMMENT '角色ID索引' 
)
COMMENT = '角色-权限表';
CREATE TABLE `t_menu_tag` (
`menu_id` int(11) NOT NULL,
`tag_id` int(11) NOT NULL,
PRIMARY KEY (`menu_id`) ,
INDEX `idx_t_menu_tag_menu_id` (`menu_id` ASC) USING BTREE COMMENT '菜单条目ID索引' ,
INDEX `idx_t_menu_tag_tag_id` (`tag_id` ASC) USING BTREE COMMENT '标签ID索引' 
);

ALTER TABLE `t_article_body` ADD CONSTRAINT `fk_t_article_body_t_article_id` FOREIGN KEY (`article_id`) REFERENCES `t_article` (`id`);
ALTER TABLE `t_article_tag` ADD CONSTRAINT `fk_t_article_tag_t_article_id` FOREIGN KEY (`article_id`) REFERENCES `t_article` (`id`);
ALTER TABLE `t_article_tag` ADD CONSTRAINT `fk_t_article_tag_t_tag_id` FOREIGN KEY (`tag_id`) REFERENCES `t_tag` (`id`);
ALTER TABLE `t_article` ADD CONSTRAINT `fk_t_article_t_user_id` FOREIGN KEY (`create_by`) REFERENCES `t_user` (`id`);
ALTER TABLE `t_user` ADD CONSTRAINT `fk_t_user_t_role_id` FOREIGN KEY (`role`) REFERENCES `t_role` (`id`);
ALTER TABLE `t_role_permission` ADD CONSTRAINT `fk_t_role_permission_role_id` FOREIGN KEY (`role_id`) REFERENCES `t_role` (`id`);
ALTER TABLE `t_role_permission` ADD CONSTRAINT `fk_t_role_permission_permission_id` FOREIGN KEY (`permission_id`) REFERENCES `t_permission` (`id`);
ALTER TABLE `t_menu_item` ADD CONSTRAINT `fk_t_menu_t_permission_id` FOREIGN KEY (`permission`) REFERENCES `t_permission` (`id`);
ALTER TABLE `t_menu_tag` ADD CONSTRAINT `fk_t_menu_tag_t_menu` FOREIGN KEY (`menu_id`) REFERENCES `t_menu_item` (`id`);
ALTER TABLE `t_menu_tag` ADD CONSTRAINT `fk_t_menu_tag_t_tag` FOREIGN KEY (`tag_id`) REFERENCES `t_tag` (`id`);

alter table `t_article_body` AUTO_INCREMENT=10000;
alter table `t_article_tag` AUTO_INCREMENT=10000;
alter table `t_article_tag` AUTO_INCREMENT=10000;
alter table `t_article` AUTO_INCREMENT=10000;
alter table `t_user` AUTO_INCREMENT=10000;
alter table `t_role_permission` AUTO_INCREMENT=10000;
alter table `t_permission` AUTO_INCREMENT=10000;
alter table `t_menu_item` AUTO_INCREMENT=10000;
alter table `t_menu_tag` AUTO_INCREMENT=10000;
alter table `t_menu_tag` AUTO_INCREMENT=10000;