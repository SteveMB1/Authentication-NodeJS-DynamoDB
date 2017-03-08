# Authentication Node.js DynamoDB

#### About: 
User authentication backend within NodeJS, for use for a custom built application or anyone looking to migrate their application into the AWS cloud. Features include: Password hashing in SHA512, session key management, user registration(with fail safes), user login.

#### Features to be added:
- Block IP address after 10 failed login attempts;
- Input serialization.

#### Requires setup:
- (2) DynamoDB tables
  - User credentials 
  - Session keys
- Generate random key for variable key on line 10.
- Input AWS credentials
- Checking for session id. 
  Insert the next line into a page that you want to require authentication for.
  - checkSessionID(req.get('sessionId').toString());
  
