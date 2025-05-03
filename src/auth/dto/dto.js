class UserDTO {
  constructor(user) {
    this.user = user;
  }

  static toDTO(user) {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      loginAttempts: user.loginAttempts,
      isLocked: user.isLocked,
      nextUnlockTime: user.nextUnlockTime,
      lastActivity: user.lastActivity,
    };
  }
}
module.exports = UserDTO;
