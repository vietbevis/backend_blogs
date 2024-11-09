const MESSAGES = {
  SUCCESS: {
    COMPLETED: 'Successfully',
    USER: {
      LOGIN: 'Login successfully',
      LOGOUT: 'Logout successfully',
      REGISTER: 'Register successfully',
      UPDATE: 'Update profile successfully',
      CHANGE_PASSWORD: 'Change password success',
      REFRESH_TOKEN: 'Refresh token successfully'
    },
    CATEGORY: {
      CREATE: 'Create category successfully'
    },
    TAG: {
      CREATE: 'Create category successfully'
    }
  },
  ERROR: {
    USER: {
      ACTIVE: 'User not active'
    },
    EMAIL: {
      ALREADY_EXISTS: 'Email already exists',
      NOT_FOUND: 'User not found'
    },
    PASSWORD: {
      REQUIRED: 'Password is required',
      NEW_PASSWORD: 'New password must be different from old password',
      CONFIRM_PASSWORD: 'Confirm password must match new password',
      NOT_MATCH: 'Passwords do not match'
    },
    TOKEN: {
      GENERATE: 'Generate Token Error'
    },
    CATEGORY: {
      EXISTS: 'Category already exists',
      NOT_FOUND: 'Category not found'
    },
    TAG: {
      EXISTS: 'Tag already exists',
      NOT_FOUND: 'Tag not found'
    }
  }
}

export default MESSAGES
