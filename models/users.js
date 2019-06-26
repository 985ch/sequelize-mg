'use strict';

// fuck yeah

module.exports = function(sequelize, DataTypes) {
  // -------- begin sequelize-generator replace --------
  const model = sequelize.define('users', {
    UserID: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    UserName: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    PassWord: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    UserHeadID: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
    },
    LoginCheckCode: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    SafeQuetion: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    SafeAnswer: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    IsLocked: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    FailedPasswordLocked: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    FailedPasswordCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    Email: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    Tel: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    PhoneSerial: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    AgentCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    BelongAgentCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    BelongStartDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    BelongRegCode: {
      type: DataTypes.STRING(60),
      allowNull: false,
    },
    BelongType: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '-1',
    },
    RealName: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Address: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    Post: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Remark: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    NickName: {
      type: DataTypes.STRING(300),
      allowNull: true,
    },
    Sex: {
      type: DataTypes.DECIMAL,
      allowNull: false,
      defaultValue: '1',
    },
    Birthday: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    CreateDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    LastLoginDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    LastLogoutDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    LastLogIP: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    LockDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    FailedPasswordLockDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    LoginCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
    VipJson: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    SafeAnswerCount: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
    },
    SafeAnswerLockDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    RegClientType: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    QQ: {
      type: DataTypes.STRING(22),
      allowNull: true,
    },
    EventInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    PersonalInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    LastAppInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    Mode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    IntelligentId: {
      type: DataTypes.CHAR(20),
      allowNull: true,
    },
    WxUID: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Old_WuYou: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0',
    },
  }, {
    tableName: 'users',
  });
  // -------- end sequelize-generator replace --------

  // fuck off

  return model;
};
