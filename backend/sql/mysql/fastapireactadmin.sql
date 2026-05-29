/*
 Navicat Premium Dump SQL

 Source Server         : rebort-测试开发平台开发
 Source Server Type    : MySQL
 Source Server Version : 80042 (8.0.42)
 Source Host           : localhost:3306
 Source Schema         : fastapireactadmin

 Target Server Type    : MySQL
 Target Server Version : 80042 (8.0.42)
 File Encoding         : 65001

 Date: 28/05/2026 16:01:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for apscheduler_jobs
-- ----------------------------
DROP TABLE IF EXISTS `apscheduler_jobs`;
CREATE TABLE `apscheduler_jobs`  (
  `id` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `next_run_time` double NULL DEFAULT NULL,
  `job_state` blob NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `ix_apscheduler_jobs_next_run_time`(`next_run_time` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apscheduler_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for sys_dept
-- ----------------------------
DROP TABLE IF EXISTS `sys_dept`;
CREATE TABLE `sys_dept`  (
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门名称',
  `order` int NOT NULL COMMENT '显示排序',
  `code` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '部门编码',
  `leader` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '部门负责人',
  `phone` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机',
  `email` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `parent_id` int NULL DEFAULT NULL COMMENT '父级部门ID',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `ix_sys_dept_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_dept_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_dept_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_dept_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_dept_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_dept_parent_id`(`parent_id` ASC) USING BTREE,
  INDEX `ix_sys_dept_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_dept_status`(`status` ASC) USING BTREE,
  CONSTRAINT `sys_dept_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `sys_dept` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '部门表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dept
-- ----------------------------
INSERT INTO `sys_dept` VALUES ('总公司', 1, 'GROUP', '部门负责人', '15695845875', 'reactadmin@example.com', NULL, 1, 'c76c3640-d47b-4b23-912a-4638cb60d466', '0', '总公司', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);

-- ----------------------------
-- Table structure for sys_dict_data
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_data`;
CREATE TABLE `sys_dict_data`  (
  `dict_sort` int NOT NULL COMMENT '字典排序',
  `dict_label` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典标签',
  `dict_value` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典键值',
  `css_class` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '样式属性（其他样式扩展）',
  `list_class` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '表格回显样式',
  `is_default` tinyint(1) NOT NULL COMMENT '是否默认（True是 False否）',
  `dict_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典类型',
  `dict_type_id` int NOT NULL COMMENT '字典类型ID',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ix_sys_dict_data_uuid`(`uuid` ASC) USING BTREE,
  INDEX `dict_type_id`(`dict_type_id` ASC) USING BTREE,
  INDEX `ix_sys_dict_data_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_dict_data_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_dict_data_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_dict_data_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_dict_data_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_dict_data_created_time`(`created_time` ASC) USING BTREE,
  CONSTRAINT `sys_dict_data_ibfk_1` FOREIGN KEY (`dict_type_id`) REFERENCES `sys_dict_type` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 35 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '字典数据表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict_data
-- ----------------------------
INSERT INTO `sys_dict_data` VALUES (1, '男', '0', 'blue', NULL, 1, 'sys_user_sex', 1, 1, 'd7369964-a7e7-4e7f-ac3f-bb0b43422893', '0', '性别男', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '女', '1', 'pink', NULL, 0, 'sys_user_sex', 1, 2, '2c49380b-03c7-4908-96bd-5a91d3305d2d', '0', '性别女', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (3, '未知', '2', 'red', NULL, 0, 'sys_user_sex', 1, 3, 'e5c68eb3-3f75-4309-b1dd-4dc4a72a4119', '0', '性别未知', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '是', '1', '', 'primary', 1, 'sys_yes_no', 2, 4, 'fdf60c15-30b2-4a6a-a0d1-e14f994416bd', '0', '是', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '否', '0', '', 'danger', 0, 'sys_yes_no', 2, 5, '2f50777d-a6f4-40fd-9495-051f8399c359', '0', '否', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '启用', '1', '', 'primary', 0, 'sys_common_status', 3, 6, '41d2e710-bd14-4b6f-a11c-70e03282ec9d', '0', '启用状态', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '停用', '0', '', 'danger', 0, 'sys_common_status', 3, 7, '1322d7bd-76d9-41fd-a6ea-9b33c2713d71', '0', '停用状态', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '通知', '1', 'blue', 'warning', 1, 'sys_notice_type', 4, 8, '6e551f7d-f90f-48c6-bdfa-40e0dceffed8', '0', '通知', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '公告', '2', 'orange', 'success', 0, 'sys_notice_type', 4, 9, 'b7ecf957-0ec5-4660-953a-cf74a4e9912e', '0', '公告', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (99, '其他', '0', '', 'info', 0, 'sys_oper_type', 5, 10, '9bd43a33-b1e0-4f58-b111-5e24f6be673c', '0', '其他操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '新增', '1', '', 'info', 0, 'sys_oper_type', 5, 11, '67312215-4f27-4ee6-a3ad-327cfcc0095b', '0', '新增操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '修改', '2', '', 'info', 0, 'sys_oper_type', 5, 12, '33ce1e6d-97f6-43fc-a962-a9befdc47022', '0', '修改操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (3, '删除', '3', '', 'danger', 0, 'sys_oper_type', 5, 13, '4e97e6ab-0d42-46e5-b3f5-3c4a3d1b14b4', '0', '删除操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (4, '分配权限', '4', '', 'primary', 0, 'sys_oper_type', 5, 14, '664d7dd7-222e-48ad-a865-bdbc5abb36f6', '0', '授权操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (5, '导出', '5', '', 'warning', 0, 'sys_oper_type', 5, 15, '7feb8923-ba4e-4df2-a85d-4be99b41f7e7', '0', '导出操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (6, '导入', '6', '', 'warning', 0, 'sys_oper_type', 5, 16, '2d49674b-1353-43fc-bf1c-5bfffe6eed05', '0', '导入操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (7, '强退', '7', '', 'danger', 0, 'sys_oper_type', 5, 17, '1f38a4f6-be57-4e0a-b3c7-64fa953b4f96', '0', '强退操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (8, '生成代码', '8', '', 'warning', 0, 'sys_oper_type', 5, 18, 'd7bd8788-eb21-45b5-9e79-daa4b5e1276f', '0', '生成操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (9, '清空数据', '9', '', 'danger', 0, 'sys_oper_type', 5, 19, '6c80ee81-c3f1-4e91-8cc1-a04af4533271', '0', '清空操作', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '默认(Memory)', 'default', '', NULL, 1, 'sys_job_store', 6, 20, '942fe79c-e3f9-49fb-9af7-c391ffcadaeb', '0', '默认分组', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '数据库(Sqlalchemy)', 'sqlalchemy', '', NULL, 0, 'sys_job_store', 6, 21, '16fe4a78-f36d-4b33-b60d-fcd8a743af01', '0', '数据库分组', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (3, '数据库(Redis)', 'redis', '', NULL, 0, 'sys_job_store', 6, 22, '9ddde0f0-c8b3-408e-99f6-9843f9b032e1', '0', 'reids分组', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '线程池', 'default', '', NULL, 0, 'sys_job_executor', 7, 23, 'c3777448-6c98-47b6-abf6-3be31b81fb42', '0', '线程池', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '进程池', 'processpool', '', NULL, 0, 'sys_job_executor', 7, 24, '9bcbb4ed-d766-41a9-beba-929e5d31b4e9', '0', '进程池', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '演示函数', 'scheduler_test.job', '', NULL, 1, 'sys_job_function', 8, 25, '5319a51e-3bb7-42df-950c-92911d0ebc39', '0', '演示函数', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '指定日期(date)', 'date', '', NULL, 1, 'sys_job_trigger', 9, 26, '84bcf92e-9e16-4aa6-ab80-2e14994d913f', '0', '指定日期任务触发器', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '间隔触发器(interval)', 'interval', '', NULL, 0, 'sys_job_trigger', 9, 27, '2360dff8-3c30-42e9-9057-0792b10ef446', '0', '间隔触发器任务触发器', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (3, 'cron表达式', 'cron', '', NULL, 0, 'sys_job_trigger', 9, 28, '84928fc8-dcf7-4aa2-8daa-4c7ac46dc956', '0', '间隔触发器任务触发器', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (1, '默认(default)', 'default', '', NULL, 1, 'sys_list_class', 10, 29, '3da2e5ea-ce51-4ddf-9593-2779791697e7', '0', '默认表格回显样式', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (2, '主要(primary)', 'primary', '', NULL, 0, 'sys_list_class', 10, 30, '550f9efd-0374-4854-864e-6f3353391362', '0', '主要表格回显样式', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (3, '成功(success)', 'success', '', NULL, 0, 'sys_list_class', 10, 31, 'dc10604b-98ae-40f2-98fa-66991862cd2c', '0', '成功表格回显样式', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (4, '信息(info)', 'info', '', NULL, 0, 'sys_list_class', 10, 32, 'b46a0032-1639-4b38-ad78-d17e4e9f7b6c', '0', '信息表格回显样式', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (5, '警告(warning)', 'warning', '', NULL, 0, 'sys_list_class', 10, 33, 'd2e94c88-b8d4-4fb5-bf53-1355a268ba32', '0', '警告表格回显样式', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_data` VALUES (6, '危险(danger)', 'danger', '', NULL, 0, 'sys_list_class', 10, 34, 'e29e71ab-36b3-415c-aa4f-2e74be504dca', '0', '危险表格回显样式', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);

-- ----------------------------
-- Table structure for sys_dict_type
-- ----------------------------
DROP TABLE IF EXISTS `sys_dict_type`;
CREATE TABLE `sys_dict_type`  (
  `dict_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典名称',
  `dict_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '字典类型',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `dict_type`(`dict_type` ASC) USING BTREE,
  UNIQUE INDEX `ix_sys_dict_type_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_dict_type_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_dict_type_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_dict_type_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_dict_type_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_dict_type_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_dict_type_updated_time`(`updated_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '字典类型表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_dict_type
-- ----------------------------
INSERT INTO `sys_dict_type` VALUES ('用户性别', 'sys_user_sex', 1, 'cd3f94c8-2554-4091-bd59-8b3d3b693ec9', '0', '用户性别列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('系统是否', 'sys_yes_no', 2, 'cc4e497c-0b63-422b-8f90-ff7739b95775', '0', '系统是否列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('系统状态', 'sys_common_status', 3, '98dd529b-2a44-4c3f-b359-a524dd374353', '0', '系统状态', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('通知类型', 'sys_notice_type', 4, 'd82563c1-46ea-405f-b16f-4e4eb3091c33', '0', '通知类型列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('操作类型', 'sys_oper_type', 5, '11184cb7-6074-486a-9ac4-14573cf5a6b5', '0', '操作类型列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('任务存储器', 'sys_job_store', 6, '62757bc9-d8e0-47bc-973a-3eb24e3b637c', '0', '任务分组列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('任务执行器', 'sys_job_executor', 7, '78b73ce9-aeb3-4d0b-a5b4-c988f29fa67b', '0', '任务执行器列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('任务函数', 'sys_job_function', 8, 'f227d8da-3e26-42b3-8d11-420a9dc2bb35', '0', '任务函数列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('任务触发器', 'sys_job_trigger', 9, '94794300-6534-4c53-814c-03e4f0865dd0', '0', '任务触发器列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_dict_type` VALUES ('表格回显样式', 'sys_list_class', 10, 'ffe4455a-2a17-4eec-8200-47ee333a7a38', '0', '表格回显样式列表', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);

-- ----------------------------
-- Table structure for sys_log
-- ----------------------------
DROP TABLE IF EXISTS `sys_log`;
CREATE TABLE `sys_log`  (
  `type` int NOT NULL COMMENT '日志类型(1登录日志 2操作日志)',
  `request_path` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '请求路径',
  `request_method` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '请求方式',
  `request_payload` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '请求体',
  `request_ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '请求IP地址',
  `login_location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '登录位置',
  `request_os` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '操作系统',
  `request_browser` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '浏览器',
  `response_code` int NOT NULL COMMENT '响应状态码',
  `response_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '响应体',
  `process_time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '处理时间',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `created_id` int NULL DEFAULT NULL COMMENT '创建人ID',
  `updated_id` int NULL DEFAULT NULL COMMENT '更新人ID',
  `deleted_id` int NULL DEFAULT NULL COMMENT '删除人ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ix_sys_log_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_log_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_log_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_log_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_log_created_id`(`created_id` ASC) USING BTREE,
  INDEX `ix_sys_log_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_log_updated_id`(`updated_id` ASC) USING BTREE,
  INDEX `ix_sys_log_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_log_deleted_id`(`deleted_id` ASC) USING BTREE,
  INDEX `ix_sys_log_created_time`(`created_time` ASC) USING BTREE,
  CONSTRAINT `sys_log_ibfk_1` FOREIGN KEY (`created_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_log_ibfk_2` FOREIGN KEY (`updated_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_log_ibfk_3` FOREIGN KEY (`deleted_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_log
-- ----------------------------

-- ----------------------------
-- Table structure for sys_menu
-- ----------------------------
DROP TABLE IF EXISTS `sys_menu`;
CREATE TABLE `sys_menu`  (
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '菜单名称',
  `type` int NOT NULL COMMENT '菜单类型(1:目录 2:菜单 3:按钮/权限 4:链接)',
  `order` int NOT NULL COMMENT '显示排序',
  `permission` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '权限标识(如:chenreact_system:user:query)',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '菜单图标',
  `route_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '路由名称',
  `route_path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '路由路径',
  `component_path` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '组件路径',
  `redirect` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '重定向地址',
  `hidden` tinyint(1) NOT NULL COMMENT '是否隐藏(True:隐藏 False:显示)',
  `keep_alive` tinyint(1) NOT NULL COMMENT '是否缓存(True:是 False:否)',
  `always_show` tinyint(1) NOT NULL COMMENT '是否始终显示(True:是 False:否)',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '菜单标题',
  `params` json NULL COMMENT '路由参数(JSON对象)',
  `affix` tinyint(1) NOT NULL COMMENT '是否固定标签页(True:是 False:否)',
  `client` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pc' COMMENT '终端(pc:管理端桌面 app:移动端)',
  `parent_id` int NULL DEFAULT NULL COMMENT '父菜单ID',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ix_sys_menu_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_menu_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_menu_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_menu_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_menu_parent_id`(`parent_id` ASC) USING BTREE,
  INDEX `ix_sys_menu_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_menu_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_menu_status`(`status` ASC) USING BTREE,
  CONSTRAINT `sys_menu_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `sys_menu` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 86 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '菜单表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_menu
-- ----------------------------
INSERT INTO `sys_menu` VALUES ('首页', 2, 1, NULL, 'mdi:monitor-dashboard', '(base)_home', '/home', '(base)_home', NULL, 0, 1, 0, '首页', 'null', 0, 'pc', NULL, 1, '22b93c6d-de3d-40c7-868d-9fd232edfa97', '0', 'reackweb 首页', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('系统管理', 1, 2, NULL, 'carbon:cloud-service-management', '(base)_manage', '/manage', NULL, '/manage/user', 0, 1, 0, '系统管理', 'null', 0, 'pc', NULL, 2, '33e7b1ef-6763-4ff5-96cb-8ad26f9d58e4', '0', 'reackweb 管理模块', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('菜单管理', 2, 1, 'chenreact_system:menu:query', 'ri:menu-line', '(base)_manage_menu', '/manage/menu', '(base)_manage_menu', NULL, 0, 1, 0, '菜单管理', 'null', 0, 'pc', 2, 3, '0034a982-c1df-47a9-a1a8-9daf991e3b4d', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('在线用户', 2, 1, 'chenreact_monitor:online:query', 'ri:customer-service-2-line', '(base)_manage_online', '/manage/online', '(base)_manage_online', NULL, 0, 1, 0, '在线用户', 'null', 0, 'pc', 2, 4, 'a5aa8227-705f-4c16-82ac-42fab66fdccd', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('部门管理', 2, 2, 'chenreact_system:dept:query', 'ri:node-tree', '(base)_manage_dept', '/manage/dept', '(base)_manage_dept', NULL, 0, 1, 0, '部门管理', 'null', 0, 'pc', 2, 5, 'eca02f0d-3360-4295-b0d7-40df4a14db2d', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('服务器监控', 2, 2, 'chenreact_monitor:server:query', 'ri:dashboard-3-line', '(base)_manage_server', '/manage/server', '(base)_manage_server', NULL, 0, 1, 0, '服务器监控', 'null', 0, 'pc', 2, 6, '9bd600bb-bc35-4aad-8338-3f1d9a4d3970', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('字典管理', 2, 3, 'chenreact_system:dict_type:query', 'ri:book-2-line', '(base)_manage_dict', '/manage/dict', '(base)_manage_dict', NULL, 0, 1, 0, '字典管理', 'null', 0, 'pc', 2, 7, 'd9d40a8a-2e06-49c0-9463-7590ce1a7746', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('岗位管理', 2, 3, 'chenreact_system:position:query', 'ri:map-pin-line', '(base)_manage_position', '/manage/position', '(base)_manage_position', NULL, 0, 1, 0, '岗位管理', 'null', 0, 'pc', 2, 8, '7c866954-e83c-4ace-bdee-ea65eaf3c396', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('缓存监控', 2, 3, 'chenreact_monitor:cache:query', 'ri:timer-flash-line', '(base)_manage_cache', '/manage/cache', '(base)_manage_cache', NULL, 0, 1, 0, '缓存监控', 'null', 0, 'pc', 2, 9, '5ff4905f-0352-41d8-9164-7d97b3291a93', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('角色管理', 2, 4, 'chenreact_system:role:query', 'ri:admin-line', '(base)_manage_role', '/manage/role', '(base)_manage_role', NULL, 0, 1, 0, '角色管理', 'null', 0, 'pc', 2, 10, '6c34b0d1-432a-454c-be62-939799fbfff0', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('文件管理', 2, 4, 'chenreact_monitor:resource:query', 'ri:folder-5-line', '(base)_manage_resource', '/manage/resource', '(base)_manage_resource', NULL, 0, 1, 0, '文件管理', 'null', 0, 'pc', 2, 11, 'b0fdd162-229c-42cf-98f2-c5264478585e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('用户管理', 2, 5, 'chenreact_system:user:query', 'ri:user-line', '(base)_manage_user', '/manage/user', '(base)_manage_user', NULL, 0, 1, 0, '用户管理', 'null', 0, 'pc', 2, 12, '53b84877-a621-4015-a901-0cdc8cba5049', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('日志管理', 2, 6, 'chenreact_system:log:query', 'ri:focus-3-line', '(base)_manage_log', '/manage/log', '(base)_manage_log', NULL, 0, 1, 0, '日志管理', 'null', 0, 'pc', 2, 13, '500167d9-16bf-42f3-910e-7f02f22f8d82', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('公告管理', 2, 7, 'chenreact_system:notice:query', 'ri:notification-3-line', '(base)_manage_notice', '/manage/notice', '(base)_manage_notice', NULL, 0, 1, 0, '公告管理', 'null', 0, 'pc', 2, 14, '66cf0c31-96ba-4e7e-9c5f-e1622b21a755', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建菜单', 3, 1, 'chenreact_system:menu:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建菜单', 'null', 0, 'pc', 3, 15, '18ea7450-b258-4c4f-802f-3829f53a0395', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('修改菜单', 3, 2, 'chenreact_system:menu:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改菜单', 'null', 0, 'pc', 3, 16, '75b05680-931e-4679-b286-3a6317c2335a', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('删除菜单', 3, 3, 'chenreact_system:menu:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '删除菜单', 'null', 0, 'pc', 3, 17, 'd894ca31-ef86-4c78-8e70-bf0acfef1484', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('批量修改菜单状态', 3, 4, 'chenreact_system:menu:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '批量修改菜单状态', 'null', 0, 'pc', 3, 18, 'ef6a9e90-43b4-4118-8101-a6d7c90b6cd3', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('详情菜单', 3, 5, 'chenreact_system:menu:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '详情菜单', 'null', 0, 'pc', 3, 19, '83806716-8549-4d2a-ba8a-8e5572d8da72', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询菜单', 3, 6, 'chenreact_system:menu:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询菜单', 'null', 0, 'pc', 3, 20, '2435c5d9-487b-4fe6-b716-dbec4202f0c2', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('在线用户强制下线', 3, 1, 'chenreact_monitor:online:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '在线用户强制下线', 'null', 0, 'pc', 4, 21, '40b097dc-d0a8-49b5-83aa-8bc8dde22676', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建部门', 3, 1, 'chenreact_system:dept:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建部门', 'null', 0, 'pc', 5, 22, '97f322a3-43b4-4ec7-b90e-a968319557a9', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('修改部门', 3, 2, 'chenreact_system:dept:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改部门', 'null', 0, 'pc', 5, 23, '2507b040-c81a-4251-95b5-081c9af24b5f', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('删除部门', 3, 3, 'chenreact_system:dept:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '删除部门', 'null', 0, 'pc', 5, 24, 'c7584d4f-c18d-4993-9728-d1aa1d038e70', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('批量修改部门状态', 3, 4, 'chenreact_system:dept:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '批量修改部门状态', 'null', 0, 'pc', 5, 25, 'e434a100-be91-4ecc-b65b-b9add98dd664', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('详情部门', 3, 5, 'chenreact_system:dept:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '详情部门', 'null', 0, 'pc', 5, 26, 'ca9f2556-9691-4c05-bce9-f9cff96509d6', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询部门', 3, 6, 'chenreact_system:dept:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询部门', 'null', 0, 'pc', 5, 27, '9bb14864-3416-42ea-9da0-4d60dc610e55', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建字典类型', 3, 1, 'chenreact_system:dict_type:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建字典类型', 'null', 0, 'pc', 7, 28, '6c122e67-7001-4e14-b92f-ca294a809470', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('修改字典类型', 3, 2, 'chenreact_system:dict_type:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改字典类型', 'null', 0, 'pc', 7, 29, 'ac527710-be46-4ed4-b33a-5a5fdb8fbdfc', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('删除字典类型', 3, 3, 'chenreact_system:dict_type:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '删除字典类型', 'null', 0, 'pc', 7, 30, '64d420e0-7878-4bb4-9eb7-8db1959dd159', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('导出字典类型', 3, 4, 'chenreact_system:dict_type:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '导出字典类型', 'null', 0, 'pc', 7, 31, '8221b22e-e5a0-483a-ab5d-564eb74580a2', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('批量修改字典状态', 3, 5, 'chenreact_system:dict_type:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '导出字典类型', 'null', 0, 'pc', 7, 32, '89a0f36a-3723-4733-9d38-af3ddc675ff8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('字典数据查询', 3, 6, 'chenreact_system:dict_data:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '字典数据查询', 'null', 0, 'pc', 7, 33, 'd570e8c1-532d-4b39-bba6-b567e8a4a678', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建字典数据', 3, 7, 'chenreact_system:dict_data:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建字典数据', 'null', 0, 'pc', 7, 34, '89eae19d-a9f5-4b4c-b7ed-227f47eb4b7a', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('修改字典数据', 3, 8, 'chenreact_system:dict_data:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改字典数据', 'null', 0, 'pc', 7, 35, 'e4ecb0f3-52ae-4af8-97e0-31b775ae64c8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('删除字典数据', 3, 9, 'chenreact_system:dict_data:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '删除字典数据', 'null', 0, 'pc', 7, 36, 'd5e8ec56-4465-469d-a406-44a63c7c4f7f', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('导出字典数据', 3, 10, 'chenreact_system:dict_data:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '导出字典数据', 'null', 0, 'pc', 7, 37, '08109899-4a3f-4f33-96a2-74c6559863d1', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('批量修改字典数据状态', 3, 11, 'chenreact_system:dict_data:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '批量修改字典数据状态', 'null', 0, 'pc', 7, 38, 'b8ae7278-a82c-401c-87a5-9b308df60653', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('详情字典类型', 3, 12, 'chenreact_system:dict_type:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '详情字典类型', 'null', 0, 'pc', 7, 39, 'd30e15b3-e42d-4b94-bd88-fab27aaf611a', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询字典类型', 3, 13, 'chenreact_system:dict_type:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询字典类型', 'null', 0, 'pc', 7, 40, '9bd5fd85-4b54-4055-992b-5ef108ec6fb8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('详情字典数据', 3, 14, 'chenreact_system:dict_data:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '详情字典数据', 'null', 0, 'pc', 7, 41, '160d3f3f-5609-49c6-a5a0-d7c8c3f82f57', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建岗位', 3, 1, 'chenreact_system:position:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建岗位', 'null', 0, 'pc', 8, 42, '69211760-4598-4713-a58e-73529f921043', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('修改岗位', 3, 2, 'chenreact_system:position:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改岗位', 'null', 0, 'pc', 8, 43, 'fcd696f4-560a-4608-8144-171815afe9fb', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('删除岗位', 3, 3, 'chenreact_system:position:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改岗位', 'null', 0, 'pc', 8, 44, '7d118233-f3e5-49d6-99da-4d8728b7c86e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('批量修改岗位状态', 3, 4, 'chenreact_system:position:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '批量修改岗位状态', 'null', 0, 'pc', 8, 45, '683a43d8-7c35-43fd-a74f-cb4d3df6ab2e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('岗位导出', 3, 5, 'chenreact_system:position:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '岗位导出', 'null', 0, 'pc', 8, 46, '64d3d1da-135a-493b-a346-af625ba7f183', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('详情岗位', 3, 6, 'chenreact_system:position:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '详情岗位', 'null', 0, 'pc', 8, 47, 'e90d68d4-a552-4a71-9243-34306e82ee19', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询岗位', 3, 7, 'chenreact_system:position:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询岗位', 'null', 0, 'pc', 8, 48, '138ea4d2-1589-4baf-ad23-283824f36a9e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('清除缓存', 3, 1, 'chenreact_monitor:cache:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '清除缓存', 'null', 0, 'pc', 9, 49, '7ed3af48-8313-4b5c-bf39-e477e413cec8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建角色', 3, 1, 'chenreact_system:role:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建角色', 'null', 0, 'pc', 10, 50, '32d63c61-04a4-4e76-962c-f33b7248fa73', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('修改角色', 3, 2, 'chenreact_system:role:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改角色', 'null', 0, 'pc', 10, 51, 'f6fbd3d7-dfcc-491e-9bcc-7bbb89add7d4', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('删除角色', 3, 3, 'chenreact_system:role:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '删除角色', 'null', 0, 'pc', 10, 52, '63f93d30-b7e6-4948-bd3e-587f1aa8ef1d', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('批量修改角色状态', 3, 4, 'chenreact_system:role:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '批量修改角色状态', 'null', 0, 'pc', 10, 53, '530d2e5d-e4f8-409e-ae94-9bc11e9f4758', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('角色导出', 3, 5, 'chenreact_system:role:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '角色导出', 'null', 0, 'pc', 10, 54, '6070215f-c1de-4d3d-9711-2e7b1867fe20', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('详情角色', 3, 6, 'chenreact_system:role:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '详情角色', 'null', 0, 'pc', 10, 55, 'fc986d96-2f4a-4e71-8e05-b1733a919bc2', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询角色', 3, 7, 'chenreact_system:role:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询角色', 'null', 0, 'pc', 10, 56, '2aae4fed-a890-47df-af4d-8d049b9bd4b2', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('分配权限', 3, 8, 'chenreact_system:role:permission', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '分配权限', 'null', 0, 'pc', 10, 57, 'f045c8ed-e1f1-46b5-aa00-c203f5e2495a', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('文件上传', 3, 1, 'chenreact_monitor:resource:upload', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '文件上传', 'null', 0, 'pc', 11, 58, 'e3fa2f9d-9fd5-468d-945d-9c6fb7d8a2d4', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('文件下载', 3, 2, 'chenreact_monitor:resource:download', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '文件下载', 'null', 0, 'pc', 11, 59, '5d14fbaf-8465-4ab7-9e12-e2433e0bfffd', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('文件删除', 3, 3, 'chenreact_monitor:resource:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '文件删除', 'null', 0, 'pc', 11, 60, 'd5e8b3a5-1173-482a-8639-a69b9a0d5b8a', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('文件移动', 3, 4, 'chenreact_monitor:resource:move', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '文件移动', 'null', 0, 'pc', 11, 61, '0b56021b-f5ff-4be9-9185-218e0a05e2ad', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('文件复制', 3, 5, 'chenreact_monitor:resource:copy', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '文件复制', 'null', 0, 'pc', 11, 62, '71794064-0605-437e-b3f6-e94538765e97', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('文件重命名', 3, 6, 'chenreact_monitor:resource:rename', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '文件重命名', 'null', 0, 'pc', 11, 63, '5a4dd119-5773-49da-9a6d-d6bf42b2fb91', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建目录', 3, 7, 'chenreact_monitor:resource:create_dir', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建目录', 'null', 0, 'pc', 11, 64, '8018cc42-2720-4c27-968b-21737f42857e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('导出文件列表', 3, 9, 'chenreact_monitor:resource:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '导出文件列表', 'null', 0, 'pc', 11, 65, '82bf00fd-bb1b-4f29-90a6-0dc49d3a2138', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('创建用户', 3, 1, 'chenreact_system:user:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '创建用户', 'null', 0, 'pc', 12, 66, '8d46a825-8eee-4b31-9299-430f5278a5e4', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('修改用户', 3, 2, 'chenreact_system:user:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改用户', 'null', 0, 'pc', 12, 67, 'cba15be0-22c0-4744-8e1e-06b3bd7e853c', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('删除用户', 3, 3, 'chenreact_system:user:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '删除用户', 'null', 0, 'pc', 12, 68, 'ee5dd295-f792-4b2b-98dd-b78c29f82035', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('批量修改用户状态', 3, 4, 'chenreact_system:user:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '批量修改用户状态', 'null', 0, 'pc', 12, 69, '8f7748a9-654f-4114-81f2-4af9ab5a92c8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('导出用户', 3, 5, 'chenreact_system:user:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '导出用户', 'null', 0, 'pc', 12, 70, '01976ae7-1b56-483d-911e-c7e292f2da9b', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('导入用户', 3, 6, 'chenreact_system:user:import', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '导入用户', 'null', 0, 'pc', 12, 71, 'dde7a18a-2397-4aba-b9b7-f13f95cf659c', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('下载用户导入模板', 3, 7, 'chenreact_system:user:download', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '下载用户导入模板', 'null', 0, 'pc', 12, 72, 'bb8ea7f5-6618-4e0d-8d00-1bcbb7508726', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('详情用户', 3, 8, 'chenreact_system:user:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '详情用户', 'null', 0, 'pc', 12, 73, 'c697fd3c-27fa-4eae-8937-d0bc6fade8b5', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询用户', 3, 9, 'chenreact_system:user:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询用户', 'null', 0, 'pc', 12, 74, '8e4ba613-6571-42a3-acf4-ca7c46cd95af', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('日志删除', 3, 1, 'chenreact_system:log:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '日志删除', 'null', 0, 'pc', 13, 75, '53108404-b031-4d81-b225-55c56f872c3e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('日志导出', 3, 2, 'chenreact_system:log:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '日志导出', 'null', 0, 'pc', 13, 76, 'e8092cfb-20fb-45f1-9101-c1c7526f9406', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('日志详情', 3, 3, 'chenreact_system:log:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '日志详情', 'null', 0, 'pc', 13, 77, 'a49afb67-23e8-466d-bbde-a3950ee61217', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询日志', 3, 4, 'chenreact_system:log:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询日志', 'null', 0, 'pc', 13, 78, '547c448d-8d41-4569-86ea-40f4749e7ea6', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('公告创建', 3, 1, 'chenreact_system:notice:create', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '公告创建', 'null', 0, 'pc', 14, 79, 'de6bf3ff-3e24-4f45-8f8c-9bc2bf519287', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('公告修改', 3, 2, 'chenreact_system:notice:update', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '修改用户', 'null', 0, 'pc', 14, 80, 'b97a54d9-ec38-4b02-a957-d3f1c72dad1f', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('公告删除', 3, 3, 'chenreact_system:notice:delete', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '公告删除', 'null', 0, 'pc', 14, 81, 'dd2646ca-35ff-4fe5-aed1-8e7eae3840d9', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('公告导出', 3, 4, 'chenreact_system:notice:export', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '公告导出', 'null', 0, 'pc', 14, 82, '6f358457-49ed-48d3-8706-348ed0e680c8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('公告批量修改状态', 3, 5, 'chenreact_system:notice:patch', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '公告批量修改状态', 'null', 0, 'pc', 14, 83, '9e9f90b5-0d8c-4064-80e1-19f9805fb61c', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('公告详情', 3, 6, 'chenreact_system:notice:detail', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '公告详情', 'null', 0, 'pc', 14, 84, 'a6fe5f72-3f20-4a25-9ad3-35a9c65e86c1', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_menu` VALUES ('查询公告', 3, 5, 'chenreact_system:notice:query', NULL, NULL, NULL, NULL, NULL, 0, 1, 0, '查询公告', 'null', 0, 'pc', 14, 85, 'c5012e5b-3291-4489-a312-9975b9fec540', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);

-- ----------------------------
-- Table structure for sys_notice
-- ----------------------------
DROP TABLE IF EXISTS `sys_notice`;
CREATE TABLE `sys_notice`  (
  `notice_title` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告标题',
  `notice_type` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '公告类型(1通知 2公告)',
  `notice_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '公告内容',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `created_id` int NULL DEFAULT NULL COMMENT '创建人ID',
  `updated_id` int NULL DEFAULT NULL COMMENT '更新人ID',
  `deleted_id` int NULL DEFAULT NULL COMMENT '删除人ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ix_sys_notice_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_notice_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_notice_created_id`(`created_id` ASC) USING BTREE,
  INDEX `ix_sys_notice_deleted_id`(`deleted_id` ASC) USING BTREE,
  INDEX `ix_sys_notice_updated_id`(`updated_id` ASC) USING BTREE,
  INDEX `ix_sys_notice_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_notice_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_notice_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_notice_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_notice_created_time`(`created_time` ASC) USING BTREE,
  CONSTRAINT `sys_notice_ibfk_1` FOREIGN KEY (`created_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_notice_ibfk_2` FOREIGN KEY (`updated_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_notice_ibfk_3` FOREIGN KEY (`deleted_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '通知公告表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_notice
-- ----------------------------

-- ----------------------------
-- Table structure for sys_param
-- ----------------------------
DROP TABLE IF EXISTS `sys_param`;
CREATE TABLE `sys_param`  (
  `config_name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '参数名称',
  `config_key` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '参数键名',
  `config_value` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '参数键值',
  `config_type` tinyint(1) NULL DEFAULT NULL COMMENT '系统内置(True:是 False:否)',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ix_sys_param_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_param_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_param_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_param_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_param_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_param_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_param_id`(`id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 18 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统参数表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_param
-- ----------------------------
INSERT INTO `sys_param` VALUES ('网站名称', 'sys_web_title', 'FastApiReactAdmin', 1, 1, '8e998f52-bb6a-4e41-8ec5-a94a912f4ea5', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('网站描述', 'sys_web_description', 'FastApiReactAdmin 是完全开源的权限管理系统', 1, 2, '80750679-a135-4acb-8b94-a810907596e7', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('网页图标', 'sys_web_favicon', 'http://127.0.0.1:8100/api/v1/static/image/favicon.png', 1, 3, 'dc08e0d1-b9da-492b-9f85-a3a014892ba8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('网站Logo', 'sys_web_logo', 'http://127.0.0.1:8100/api/v1/static/image/logo.png', 1, 4, 'eee046f2-1bde-489b-8736-9914b47a1960', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('登录背景', 'sys_login_background', 'http://127.0.0.1:8100/api/v1/static/image/background.svg', 1, 5, '5865736b-cf9b-4a8f-bb18-347e38cc2f3f', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('版权信息', 'sys_web_copyright', 'Copyright © 2026 fastapireactadmin 版权所有', 1, 6, '7ee97b65-2f94-4a13-a840-8378e8de1959', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('备案信息', 'sys_keep_record', '贵ICP备2026069493号-1', 1, 7, '4a93e9b1-916f-4695-a58b-585542515353', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('帮助文档', 'sys_help_doc', 'https://github.com/rebort-hub/fastapiReactadmin', 1, 8, '2aa754fc-0c15-40f0-bfa8-5176fc644792', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('隐私政策', 'sys_web_privacy', 'https://github.com/rebort-hub/fastapiReactadmin/blob/master/LICENSE', 1, 9, '6b58b493-60c3-4520-82f1-ff2bdc36721e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('用户协议', 'sys_web_clause', 'https://github.com/rebort-hub/fastapiReactadmin/blob/master/LICENSE', 1, 10, '121a6d89-9ef7-436b-89c8-4e583ce3c342', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('源码代码', 'sys_git_code', 'https://github.com/rebort-hub/fastapiReactadmin', 1, 11, '431b660e-8ded-43f7-8c19-78dbc3e305a8', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('项目版本', 'sys_web_version', '2.0.0', 1, 12, '982cf43d-78c3-422e-96e0-e0101d7caa4c', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('演示模式启用', 'demo_enable', 'false', 1, 13, 'e9d68db9-cf13-481a-a4aa-e412f235dc67', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('演示访问IP白名单', 'ip_white_list', '[\"127.0.0.1\"]', 1, 14, '1089b752-eb7c-4b2e-9366-bd51c7ac55b3', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('接口白名单', 'white_api_list_path', '[\"/api/v1/system/auth/login\", \"/api/v1/system/auth/token/refresh\", \"/api/v1/system/auth/captcha/get\", \"/api/v1/system/auth/logout\", \"/api/v1/system/config/info\", \"/api/v1/system/user/current/info\", \"/api/v1/system/notice/available\", \"/api/v1/system/auth/auto-login/users\", \"/api/v1/system/auth/auto-login/token\", \"/api/v1/system/auth/auto-login\"]', 1, 15, 'a1a3a14e-8365-4938-bd04-b64abad8943e', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('访问IP黑名单', 'ip_black_list', '[]', 1, 16, '4d55f7d7-8e4d-49c8-a07c-13f73133c2c6', '0', '初始化数据', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);
INSERT INTO `sys_param` VALUES ('调度器状态', 'scheduler_status', 'stopped', 1, 17, '3e427296-0319-4d0a-99a7-bb248f6ffdf4', '0', NULL, '2026-05-28 15:55:15', '2026-05-28 15:55:15', 0, NULL);

-- ----------------------------
-- Table structure for sys_position
-- ----------------------------
DROP TABLE IF EXISTS `sys_position`;
CREATE TABLE `sys_position`  (
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '岗位名称',
  `order` int NOT NULL COMMENT '显示排序',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `created_id` int NULL DEFAULT NULL COMMENT '创建人ID',
  `updated_id` int NULL DEFAULT NULL COMMENT '更新人ID',
  `deleted_id` int NULL DEFAULT NULL COMMENT '删除人ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ix_sys_position_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_position_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_position_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_position_deleted_id`(`deleted_id` ASC) USING BTREE,
  INDEX `ix_sys_position_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_position_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_position_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_position_created_id`(`created_id` ASC) USING BTREE,
  INDEX `ix_sys_position_updated_id`(`updated_id` ASC) USING BTREE,
  INDEX `ix_sys_position_updated_time`(`updated_time` ASC) USING BTREE,
  CONSTRAINT `sys_position_ibfk_1` FOREIGN KEY (`created_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_position_ibfk_2` FOREIGN KEY (`updated_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_position_ibfk_3` FOREIGN KEY (`deleted_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '岗位表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_position
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role
-- ----------------------------
DROP TABLE IF EXISTS `sys_role`;
CREATE TABLE `sys_role`  (
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色名称',
  `code` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '角色编码',
  `order` int NOT NULL COMMENT '显示排序',
  `data_scope` int NOT NULL COMMENT '数据权限范围(1:仅本人 2:本部门 3:本部门及以下 4:全部 5:自定义)',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `ix_sys_role_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_role_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_role_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_role_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_role_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_role_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_role_deleted_time`(`deleted_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role
-- ----------------------------
INSERT INTO `sys_role` VALUES ('超级管理员角色', 'ADMIN', 1, 4, 1, 'b243ef64-af75-4936-9a40-d1976782992c', '0', '初始化角色', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);

-- ----------------------------
-- Table structure for sys_role_depts
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_depts`;
CREATE TABLE `sys_role_depts`  (
  `role_id` int NOT NULL COMMENT '角色ID',
  `dept_id` int NOT NULL COMMENT '部门ID',
  PRIMARY KEY (`role_id`, `dept_id`) USING BTREE,
  INDEX `dept_id`(`dept_id` ASC) USING BTREE,
  CONSTRAINT `sys_role_depts_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_role_depts_ibfk_2` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色部门关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_depts
-- ----------------------------

-- ----------------------------
-- Table structure for sys_role_menus
-- ----------------------------
DROP TABLE IF EXISTS `sys_role_menus`;
CREATE TABLE `sys_role_menus`  (
  `role_id` int NOT NULL COMMENT '角色ID',
  `menu_id` int NOT NULL COMMENT '菜单ID',
  PRIMARY KEY (`role_id`, `menu_id`) USING BTREE,
  INDEX `menu_id`(`menu_id` ASC) USING BTREE,
  CONSTRAINT `sys_role_menus_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_role_menus_ibfk_2` FOREIGN KEY (`menu_id`) REFERENCES `sys_menu` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '角色菜单关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_role_menus
-- ----------------------------

-- ----------------------------
-- Table structure for sys_tenant
-- ----------------------------
DROP TABLE IF EXISTS `sys_tenant`;
CREATE TABLE `sys_tenant`  (
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '租户名称',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '租户编码',
  `start_time` datetime NULL DEFAULT NULL COMMENT '开始时间',
  `end_time` datetime NULL DEFAULT NULL COMMENT '结束时间',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `ix_sys_tenant_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_sys_tenant_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_tenant_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_tenant_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_tenant_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_tenant_id`(`id` ASC) USING BTREE,
  INDEX `ix_sys_tenant_updated_time`(`updated_time` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '租户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_tenant
-- ----------------------------
INSERT INTO `sys_tenant` VALUES ('系统租户', 'system', NULL, NULL, 1, '8cba71f7-958f-4af6-9343-8c96bf8029fa', '0', '平台默认租户，id 固定为 1', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL);

-- ----------------------------
-- Table structure for sys_user
-- ----------------------------
DROP TABLE IF EXISTS `sys_user`;
CREATE TABLE `sys_user`  (
  `username` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户名/登录账号',
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '密码哈希',
  `name` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '昵称',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮箱',
  `gender` varchar(1) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '性别(0:男 1:女 2:未知)',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '头像URL地址',
  `is_superuser` tinyint(1) NOT NULL COMMENT '是否超管',
  `last_login` datetime NULL DEFAULT NULL COMMENT '最后登录时间',
  `gitee_login` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Gitee登录',
  `github_login` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'Github登录',
  `wx_login` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '微信登录',
  `qq_login` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT 'QQ登录',
  `dept_id` int NULL DEFAULT NULL COMMENT '部门ID',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `tenant_id` int NOT NULL COMMENT '租户ID',
  `created_id` int NULL DEFAULT NULL COMMENT '创建人ID',
  `updated_id` int NULL DEFAULT NULL COMMENT '更新人ID',
  `deleted_id` int NULL DEFAULT NULL COMMENT '删除人ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE,
  UNIQUE INDEX `ix_sys_user_uuid`(`uuid` ASC) USING BTREE,
  UNIQUE INDEX `mobile`(`mobile` ASC) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `ix_sys_user_dept_id`(`dept_id` ASC) USING BTREE,
  INDEX `ix_sys_user_updated_id`(`updated_id` ASC) USING BTREE,
  INDEX `ix_sys_user_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_sys_user_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_sys_user_status`(`status` ASC) USING BTREE,
  INDEX `ix_sys_user_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_sys_user_tenant_id`(`tenant_id` ASC) USING BTREE,
  INDEX `ix_sys_user_deleted_id`(`deleted_id` ASC) USING BTREE,
  INDEX `ix_sys_user_created_id`(`created_id` ASC) USING BTREE,
  INDEX `ix_sys_user_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_sys_user_id`(`id` ASC) USING BTREE,
  CONSTRAINT `sys_user_ibfk_1` FOREIGN KEY (`dept_id`) REFERENCES `sys_dept` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_user_ibfk_2` FOREIGN KEY (`tenant_id`) REFERENCES `sys_tenant` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `sys_user_ibfk_3` FOREIGN KEY (`created_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_user_ibfk_4` FOREIGN KEY (`updated_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `sys_user_ibfk_5` FOREIGN KEY (`deleted_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user
-- ----------------------------
INSERT INTO `sys_user` VALUES ('admin', '$2b$12$e2IJgS/cvHgJ0H3G7Xa08OXoXnk6N/NX3IZRtubBDElA0VLZhkNOa', '超级管理员', NULL, NULL, '0', 'http://127.0.0.1:8001/api/v1/static/image/avatar.png', 1, NULL, NULL, NULL, NULL, NULL, 1, 1, 'd82eff27-cd1e-4dc4-ace2-2506841d48b6', '0', '超级管理员', '2026-05-28 15:54:29', '2026-05-28 15:54:29', 0, NULL, 1, NULL, NULL, NULL);

-- ----------------------------
-- Table structure for sys_user_positions
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_positions`;
CREATE TABLE `sys_user_positions`  (
  `user_id` int NOT NULL COMMENT '用户ID',
  `position_id` int NOT NULL COMMENT '岗位ID',
  PRIMARY KEY (`user_id`, `position_id`) USING BTREE,
  INDEX `position_id`(`position_id` ASC) USING BTREE,
  CONSTRAINT `sys_user_positions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_user_positions_ibfk_2` FOREIGN KEY (`position_id`) REFERENCES `sys_position` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户岗位关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_positions
-- ----------------------------

-- ----------------------------
-- Table structure for sys_user_roles
-- ----------------------------
DROP TABLE IF EXISTS `sys_user_roles`;
CREATE TABLE `sys_user_roles`  (
  `user_id` int NOT NULL COMMENT '用户ID',
  `role_id` int NOT NULL COMMENT '角色ID',
  PRIMARY KEY (`user_id`, `role_id`) USING BTREE,
  INDEX `role_id`(`role_id` ASC) USING BTREE,
  CONSTRAINT `sys_user_roles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `sys_user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `sys_user_roles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `sys_role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户角色关联表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sys_user_roles
-- ----------------------------
INSERT INTO `sys_user_roles` VALUES (1, 1);

-- ----------------------------
-- Table structure for task_job
-- ----------------------------
DROP TABLE IF EXISTS `task_job`;
CREATE TABLE `task_job`  (
  `job_id` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务ID',
  `job_name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '任务名称',
  `trigger_type` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '触发方式: cron/interval/date/manual',
  `status` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '执行状态',
  `next_run_time` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '下次执行时间',
  `job_state` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '任务状态信息',
  `result` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '执行结果',
  `error` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '错误信息',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `ix_task_job_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_task_job_id`(`id` ASC) USING BTREE,
  INDEX `ix_task_job_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_task_job_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_task_job_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_task_job_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_task_job_job_id`(`job_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '任务执行日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_job
-- ----------------------------

-- ----------------------------
-- Table structure for task_node
-- ----------------------------
DROP TABLE IF EXISTS `task_node`;
CREATE TABLE `task_node`  (
  `name` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '节点名称',
  `code` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '节点编码',
  `jobstore` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '存储器',
  `executor` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '执行器',
  `trigger` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '触发器',
  `trigger_args` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '触发器参数',
  `func` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '代码块',
  `args` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '位置参数',
  `kwargs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '关键字参数',
  `coalesce` tinyint(1) NULL DEFAULT NULL COMMENT '是否合并运行',
  `max_instances` int NULL DEFAULT NULL COMMENT '最大实例数',
  `start_date` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '开始时间',
  `end_date` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '结束时间',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `created_id` int NULL DEFAULT NULL COMMENT '创建人ID',
  `updated_id` int NULL DEFAULT NULL COMMENT '更新人ID',
  `deleted_id` int NULL DEFAULT NULL COMMENT '删除人ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `ix_task_node_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_task_node_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_task_node_status`(`status` ASC) USING BTREE,
  INDEX `ix_task_node_deleted_id`(`deleted_id` ASC) USING BTREE,
  INDEX `ix_task_node_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_task_node_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_task_node_id`(`id` ASC) USING BTREE,
  INDEX `ix_task_node_created_id`(`created_id` ASC) USING BTREE,
  INDEX `ix_task_node_updated_id`(`updated_id` ASC) USING BTREE,
  INDEX `ix_task_node_updated_time`(`updated_time` ASC) USING BTREE,
  CONSTRAINT `task_node_ibfk_1` FOREIGN KEY (`created_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_node_ibfk_2` FOREIGN KEY (`updated_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_node_ibfk_3` FOREIGN KEY (`deleted_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '节点类型表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_node
-- ----------------------------

-- ----------------------------
-- Table structure for task_workflow
-- ----------------------------
DROP TABLE IF EXISTS `task_workflow`;
CREATE TABLE `task_workflow`  (
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '流程名称',
  `code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '流程编码',
  `workflow_status` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '流程状态: draft/published/archived',
  `nodes` json NULL COMMENT 'Vue Flow nodes JSON',
  `edges` json NULL COMMENT 'Vue Flow edges JSON',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `created_id` int NULL DEFAULT NULL COMMENT '创建人ID',
  `updated_id` int NULL DEFAULT NULL COMMENT '更新人ID',
  `deleted_id` int NULL DEFAULT NULL COMMENT '删除人ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uq_task_workflow_code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `ix_task_workflow_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_task_workflow_updated_id`(`updated_id` ASC) USING BTREE,
  INDEX `ix_task_workflow_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_task_workflow_id`(`id` ASC) USING BTREE,
  INDEX `ix_task_workflow_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_task_workflow_status`(`status` ASC) USING BTREE,
  INDEX `ix_task_workflow_deleted_id`(`deleted_id` ASC) USING BTREE,
  INDEX `ix_task_workflow_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_task_workflow_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_task_workflow_created_id`(`created_id` ASC) USING BTREE,
  CONSTRAINT `task_workflow_ibfk_1` FOREIGN KEY (`created_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_workflow_ibfk_2` FOREIGN KEY (`updated_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_workflow_ibfk_3` FOREIGN KEY (`deleted_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '工作流定义表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_workflow
-- ----------------------------

-- ----------------------------
-- Table structure for task_workflow_node_type
-- ----------------------------
DROP TABLE IF EXISTS `task_workflow_node_type`;
CREATE TABLE `task_workflow_node_type`  (
  `name` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '显示名称',
  `code` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '节点编码，对应画布 node.type',
  `category` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '分类: trigger/action/condition/control',
  `func` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Python 代码块，须定义 handler(*args,**kwargs)',
  `args` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '默认位置参数，逗号分隔',
  `kwargs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '默认关键字参数 JSON',
  `sort_order` int NOT NULL COMMENT '排序',
  `is_active` tinyint(1) NOT NULL COMMENT '是否启用',
  `id` int NOT NULL AUTO_INCREMENT COMMENT '主键ID',
  `uuid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'UUID全局唯一标识',
  `status` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '状态(0:正常 1:禁用)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '备注/描述',
  `created_time` datetime NOT NULL COMMENT '创建时间',
  `updated_time` datetime NOT NULL COMMENT '更新时间',
  `is_deleted` tinyint(1) NOT NULL COMMENT '是否已删除(0:未删除 1:已删除)',
  `deleted_time` datetime NULL DEFAULT NULL COMMENT '删除时间',
  `created_id` int NULL DEFAULT NULL COMMENT '创建人ID',
  `updated_id` int NULL DEFAULT NULL COMMENT '更新人ID',
  `deleted_id` int NULL DEFAULT NULL COMMENT '删除人ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `code`(`code` ASC) USING BTREE,
  UNIQUE INDEX `ix_task_workflow_node_type_uuid`(`uuid` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_updated_id`(`updated_id` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_deleted_time`(`deleted_time` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_created_id`(`created_id` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_updated_time`(`updated_time` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_status`(`status` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_created_time`(`created_time` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_deleted_id`(`deleted_id` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_is_deleted`(`is_deleted` ASC) USING BTREE,
  INDEX `ix_task_workflow_node_type_id`(`id` ASC) USING BTREE,
  CONSTRAINT `task_workflow_node_type_ibfk_1` FOREIGN KEY (`created_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_workflow_node_type_ibfk_2` FOREIGN KEY (`updated_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `task_workflow_node_type_ibfk_3` FOREIGN KEY (`deleted_id`) REFERENCES `sys_user` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '工作流编排节点类型（非定时任务节点）' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of task_workflow_node_type
-- ----------------------------

SET FOREIGN_KEY_CHECKS = 1;
