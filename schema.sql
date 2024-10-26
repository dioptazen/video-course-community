CREATE DATABASE community_platform;
USE community_platform;

CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  bio TEXT,
  location VARCHAR(255),
  website VARCHAR(255),
  instagram VARCHAR(255),
  twitter VARCHAR(255),
  youtube VARCHAR(255),
  facebook VARCHAR(255),
  linkedin VARCHAR(255),
  membershipDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  profilePhoto VARCHAR(255),
  timezone VARCHAR(100),
  followNotification BOOLEAN DEFAULT true,
  url VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE groups (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  description TEXT,
  ownerId INT NOT NULL,
  url VARCHAR(255) UNIQUE NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE group_members (
  groupId INT NOT NULL,
  userId INT NOT NULL,
  isAdmin BOOLEAN DEFAULT false,
  joinedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (groupId, userId),
  FOREIGN KEY (groupId) REFERENCES groups(id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE topics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  groupId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  FOREIGN KEY (groupId) REFERENCES groups(id)
);

CREATE TABLE posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  groupId INT NOT NULL,
  userId INT NOT NULL,
  topicId INT,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  isPinned BOOLEAN DEFAULT false,
  FOREIGN KEY (groupId) REFERENCES groups(id),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (topicId) REFERENCES topics(id)
);

CREATE TABLE course_modules (
  id INT PRIMARY KEY AUTO_INCREMENT,
  groupId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  parentId INT,
  orderIndex INT NOT NULL,
  type ENUM('MAIN', 'SECTION', 'LESSON') NOT NULL,
  videoUrl VARCHAR(255),
  FOREIGN KEY (groupId) REFERENCES groups(id),
  FOREIGN KEY (parentId) REFERENCES course_modules(id)
);

CREATE TABLE module_progress (
  userId INT NOT NULL,
  moduleId INT NOT NULL,
  completed BOOLEAN DEFAULT false,
  completedAt TIMESTAMP,
  PRIMARY KEY (userId, moduleId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (moduleId) REFERENCES course_modules(id)
);