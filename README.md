# Authentication_NodeJS-DynamoDB
Register &amp; Authenticate user logins in AWS DynamoDB.


Features to be added:
- Block IP address after 10 failed login attempts;
- Input serialization.

Requires setup:
- (2) DynamoDB tables
  - User credentials 
  - Session keys
- Generate random key for variable key on line 10.
- Input AWS credentials
- Checking for session id. 
  Insert the next line into a page that you want to require authentication for.
  - checkSessionID(req.get('sessionId').toString());
  
