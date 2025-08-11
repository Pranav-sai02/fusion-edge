// roles.constants.ts
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};
export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.USER]: 'User',
  [ROLES.GUEST]: 'Guest'
};
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['manage_users', 'view_reports', 'edit_settings'],
  [ROLES.USER]: ['view_content', 'submit_feedback'],
  [ROLES.GUEST]: ['view_content']
};
export const ROLE_ICONS = {
  [ROLES.ADMIN]: 'admin_panel_settings',
  [ROLES.USER]: 'person',
  [ROLES.GUEST]: 'person_outline'
};
