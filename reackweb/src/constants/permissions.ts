/** 与后端 sys_menu 按钮 permission 字段一致 */
export const Perm = {
  Menu: {
    create: 'chenreact_system:menu:create',
    delete: 'chenreact_system:menu:delete',
    update: 'chenreact_system:menu:update'
  },
  Dept: {
    create: 'chenreact_system:dept:create',
    delete: 'chenreact_system:dept:delete',
    update: 'chenreact_system:dept:update'
  },
  DictType: {
    create: 'chenreact_system:dict_type:create',
    delete: 'chenreact_system:dict_type:delete',
    update: 'chenreact_system:dict_type:update'
  },
  DictData: {
    create: 'chenreact_system:dict_data:create',
    delete: 'chenreact_system:dict_data:delete',
    query: 'chenreact_system:dict_data:query',
    update: 'chenreact_system:dict_data:update'
  },
  Position: {
    create: 'chenreact_system:position:create',
    delete: 'chenreact_system:position:delete',
    update: 'chenreact_system:position:update'
  },
  Role: {
    create: 'chenreact_system:role:create',
    delete: 'chenreact_system:role:delete',
    detail: 'chenreact_system:role:detail',
    permission: 'chenreact_system:role:permission',
    update: 'chenreact_system:role:update'
  },
  User: {
    create: 'chenreact_system:user:create',
    delete: 'chenreact_system:user:delete',
    detail: 'chenreact_system:user:detail',
    update: 'chenreact_system:user:update'
  },
  Log: {
    delete: 'chenreact_system:log:delete',
    detail: 'chenreact_system:log:detail'
  },
  Notice: {
    create: 'chenreact_system:notice:create',
    delete: 'chenreact_system:notice:delete',
    detail: 'chenreact_system:notice:detail',
    update: 'chenreact_system:notice:update'
  },
  Online: {
    delete: 'chenreact_monitor:online:delete'
  },
  Resource: {
    copy: 'chenreact_monitor:resource:copy',
    createDir: 'chenreact_monitor:resource:create_dir',
    delete: 'chenreact_monitor:resource:delete',
    download: 'chenreact_monitor:resource:download',
    export: 'chenreact_monitor:resource:export',
    move: 'chenreact_monitor:resource:move',
    rename: 'chenreact_monitor:resource:rename',
    upload: 'chenreact_monitor:resource:upload'
  },
  Cache: {
    delete: 'chenreact_monitor:cache:delete'
  }
} as const;
