export const ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  EDITOR: 'EDITOR'
};

export const PERMISSIONS = {
  CREATE_PRODUCT: 'CREATE_PRODUCT',
  DELETE_PRODUCT: 'DELETE_PRODUCT',
  MANAGE_ORDERS: 'MANAGE_ORDERS',
  MANAGE_USERS: 'MANAGE_USERS'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.MANAGER]: [PERMISSIONS.CREATE_PRODUCT, PERMISSIONS.MANAGE_ORDERS],
  [ROLES.EDITOR]: [PERMISSIONS.CREATE_PRODUCT]
};

export function hasPermission(userRole: string, permission: string): boolean {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) ?? false;
}