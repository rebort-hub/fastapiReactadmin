declare namespace Api {
  namespace SystemModule {
    /** 用户状态：0 启用，1 禁用 */
    type UserStatus = '0' | '1';

    /** 性别：0 男，1 女，2 未知 */
    type UserGender = '0' | '1' | '2';

    type IdNameItem = {
      id: number;
      name: string;
      code?: string;
    };

    type ChangePasswordForm = {
      old_password: string;
      new_password: string;
    };

    type CurrentUserProfile = User & {
      menus?: BackendMenu[];
    };

    /** 后端菜单（动态路由，字段与 MenuOutSchema 一致） */
    type BackendMenu = {
      affix?: boolean;
      always_show?: boolean;
      children?: BackendMenu[];
      client?: string;
      component_path?: string | null;
      hidden?: boolean;
      icon?: string | null;
      id?: number;
      keep_alive?: boolean;
      name: string;
      order?: number;
      parent_id?: number | null;
      permission?: string | null;
      redirect?: string | null;
      route_name?: string | null;
      route_path?: string | null;
      status?: string;
      title?: string | null;
      type: MenuType;
    };

    type CurrentUserProfileForm = {
      avatar?: string;
      email?: string;
      gender?: UserGender;
      mobile?: string;
      name?: string;
    };

    type UserSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        username?: string;
        name?: string;
        mobile?: string;
        email?: string;
        gender?: UserGender;
        dept_id?: number;
        status?: UserStatus;
      }
    >;

    type User = {
      id: number;
      username: string;
      name: string;
      mobile?: string | null;
      email?: string | null;
      gender?: UserGender | null;
      status?: UserStatus | null;
      avatar?: string | null;
      dept_id?: number | null;
      dept_name?: string | null;
      dept?: IdNameItem | null;
      roles?: IdNameItem[];
      positions?: IdNameItem[];
      description?: string | null;
      is_superuser?: boolean;
      last_login?: string | null;
      created_time?: string;
      updated_time?: string;
    };

    type UserForm = {
      username: string;
      name: string;
      mobile?: string;
      email?: string;
      gender?: UserGender;
      status?: UserStatus;
      dept_id?: number | null;
      role_ids?: number[];
      position_ids?: number[];
      password?: string;
      description?: string;
    };

    type BatchSetAvailable = {
      ids: number[];
      status: UserStatus;
    };

    /** 菜单类型：1 目录 2 菜单 3 按钮 4 外链 */
    type MenuType = 1 | 2 | 3 | 4;

    type Menu = {
      id: number;
      name: string;
      type: MenuType;
      permission?: string | null;
      parent_id?: number | null;
      order?: number;
      status?: string;
      children?: Menu[];
    };

    type RoleSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        name?: string;
        status?: UserStatus;
      }
    >;

    type Role = {
      id: number;
      name: string;
      code: string;
      order?: number;
      data_scope?: number;
      status?: UserStatus | null;
      description?: string | null;
      menus?: Menu[];
      depts?: IdNameItem[];
      created_time?: string;
      updated_time?: string;
    };

    type RoleForm = {
      name: string;
      code: string;
      order?: number;
      data_scope?: number;
      status?: UserStatus;
      description?: string;
    };

    type RolePermissionSetting = {
      data_scope: number;
      role_ids: number[];
      menu_ids: number[];
      dept_ids?: number[];
    };

    type PositionSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        name?: string;
        status?: UserStatus;
      }
    >;

    type Position = {
      id: number;
      name: string;
      order?: number;
      status?: UserStatus | null;
      description?: string | null;
      created_time?: string;
      updated_time?: string;
    };

    type PositionForm = {
      name: string;
      order?: number;
      status?: UserStatus;
      description?: string;
    };

    type SearchParams = CommonType.RecordNullable<Common.CommonSearchParams & Record<string, unknown>>;

    type Dept = {
      id: number;
      name: string;
      code?: string;
      order?: number;
      leader?: string | null;
      phone?: string | null;
      email?: string | null;
      parent_id?: number | null;
      parent_name?: string | null;
      status?: UserStatus | null;
      description?: string | null;
      created_time?: string;
      updated_time?: string;
      children?: Dept[];
    };

    type DeptSearchParams = CommonType.RecordNullable<{
      name?: string;
      status?: UserStatus;
    }>;

    type DeptForm = {
      name: string;
      code: string;
      order?: number;
      leader?: string;
      phone?: string;
      email?: string;
      parent_id?: number | null;
      status?: UserStatus;
      description?: string;
    };

    type DictType = {
      id: number;
      dict_name: string;
      dict_type: string;
      status?: UserStatus | null;
      description?: string | null;
      created_time?: string;
      updated_time?: string;
    };

    type DictTypeSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        dict_name?: string;
        dict_type?: string;
        status?: UserStatus;
      }
    >;

    type DictTypeForm = {
      dict_name: string;
      dict_type: string;
      status?: UserStatus;
      description?: string;
    };

    type DictData = {
      id: number;
      dict_sort?: number;
      dict_label: string;
      dict_value: string;
      dict_type: string;
      dict_type_id: number;
      css_class?: string | null;
      list_class?: string | null;
      is_default?: boolean;
      status?: UserStatus | null;
      description?: string | null;
      created_time?: string;
      updated_time?: string;
    };

    type DictDataSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        dict_label?: string;
        dict_type?: string;
        dict_type_id?: number;
        status?: UserStatus;
      }
    >;

    type DictDataForm = {
      dict_sort: number;
      dict_label: string;
      dict_value: string;
      dict_type: string;
      dict_type_id: number;
      css_class?: string;
      list_class?: string;
      is_default?: boolean;
      status?: UserStatus;
      description?: string;
    };

    type CacheMonitor = {
      command_stats?: { name: string; value: string }[];
      db_size?: number;
      info?: Record<string, unknown>;
    };

    type CacheInfo = {
      cache_key: string;
      cache_name: string;
      cache_value?: unknown;
      remark?: string | null;
    };

    type Log = {
      id: number;
      type?: number;
      request_path?: string | null;
      request_method?: string | null;
      request_ip?: string | null;
      login_location?: string | null;
      request_browser?: string | null;
      request_os?: string | null;
      response_code?: number | null;
      request_payload?: string | null;
      response_json?: string | null;
      process_time?: string | null;
      status?: string | null;
      description?: string | null;
      created_time?: string;
      updated_time?: string;
    };

    type LogSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        type?: number;
        request_path?: string;
        request_method?: string;
        request_ip?: string;
        response_code?: number;
        created_time?: string[];
      }
    >;

    type NoticeSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        notice_title?: string;
        notice_type?: string;
        status?: UserStatus;
        created_time?: string[];
      }
    >;

    type Notice = {
      id: number;
      notice_title: string;
      notice_type?: string;
      notice_content?: string | null;
      status?: UserStatus | null;
      description?: string | null;
      created_time?: string;
      updated_time?: string;
    };

    type HomeOverview = {
      onlineCount: number;
      userCount: number;
      logCount: number;
      noticeCount: number;
      roleCount: number;
      deptCount: number;
      todayLoginCount: number;
      todayOperationCount: number;
      availableNoticeCount: number;
    };

    type NoticeForm = {
      notice_title: string;
      notice_type: string;
      notice_content: string;
      status?: UserStatus;
      description?: string;
    };

    type ServerCpu = {
      cpu_num: number;
      used: number;
      sys: number;
      free: number;
    };

    type ServerMemory = {
      total: string;
      used: string;
      free: string;
      usage: number;
    };

    type ServerSys = {
      computer_ip: string;
      computer_name: string;
      os_arch: string;
      os_name: string;
      user_dir: string;
    };

    type ServerPython = {
      name: string;
      version: string;
      start_time: string;
      run_time: string;
      home: string;
      memory_used: string;
      memory_usage: number;
      memory_total: string;
      memory_free: string;
    };

    type ServerDisk = {
      dir_name: string;
      sys_type_name: string;
      type_name: string;
      total: string;
      used: string;
      free: string;
      usage: number;
    };

    type ServerMonitor = {
      cpu: ServerCpu;
      mem: ServerMemory;
      py: ServerPython;
      sys: ServerSys;
      disks: ServerDisk[];
    };

    type OnlineUser = {
      session_id: string;
      user_id?: number;
      name?: string;
      user_name?: string;
      ipaddr?: string | null;
      login_location?: string | null;
      browser?: string | null;
      os?: string | null;
      login_time?: string | null;
      login_type?: string | null;
    };

    type OnlineSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        name?: string;
        ipaddr?: string;
        login_location?: string;
      }
    >;

    type ResourceSearchParams = CommonType.RecordNullable<
      Common.CommonSearchParams & {
        name?: string;
        path?: string;
      }
    >;

    type Resource = {
      name: string;
      file_url: string;
      relative_path?: string;
      is_file?: boolean;
      is_dir?: boolean;
      size?: number | null;
      created_time?: string | null;
      modified_time?: string | null;
      is_hidden?: boolean;
    };

    type ResourceMoveForm = {
      source_path: string;
      target_path: string;
      overwrite?: boolean;
    };

    type ResourceRenameForm = {
      old_path: string;
      new_name: string;
    };

    type ResourceCreateDirForm = {
      parent_path: string;
      dir_name: string;
    };
  }
}
