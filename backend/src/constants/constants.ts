
export enum Role {
    SUPER_ADMIN = 'SuperAdmin',
    ADMIN = 'Admin',
    BUSINESS_USER = 'BusinessUser',
}


export const Permission = {
    USER_CREATE: 'user.create',
    USER_READ: 'user.read',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
    ROLE_CREATE: 'role.create',
    ROLE_READ: 'role.read',
    ROLE_UPDATE: 'role.update',
    ROLE_DELETE: 'role.delete',
    PERMISSION_CREATE: 'permission.create',
    PERMISSION_READ: 'permission.read',
    PERMISSION_UPDATE: 'permission.update',
    PERMISSION_DELETE: 'permission.delete',
    SYSTEM_CONFIGURE: 'system.configure',
} as const;

export type PermissionName = (typeof Permission)[keyof typeof Permission];
