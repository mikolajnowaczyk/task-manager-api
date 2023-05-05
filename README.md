# Task-manager-api
API for task management. There is a user and tasks related API. For most of the calls, a token is required. ~~[Link for live version](https://nowc-task-manager.herokuapp.com/) (with some features covered in fronend)~~ heroku is not available.

List of tools:
* MongoDB
* Mongoose
* Node js
* React + redux

List of fetures:
* Password are stored as hash
* User can create, update and delete an account
* User can log in and out
* User can upload and delete avatar picture
* User can create, update and delete task related to its account
* Middleware with user verification (if user exists and send correct token)
* On account deletion send a farewell email and delete all of user tasks
* On account creation send a welcome mail
* Password hash, tokens, avatar are filtered before sending back user object
* Tests suites for users and tasks 

List of user endpoints is presented below:
Method | Endpoint | Returns |Description
--- | --- | --- | ---
**POST** | /users | (sand an email), user, token | Create user account
**POST** | /users/login | user, token | Login user
**POST** | /users/logout | (clears user token of the current session) | Logout user (current session)
**POST** | /users/logoutAll | (clears all user tokens) | Logout user (all sessions)
**GET** | /users/me | user | Get user profile
**PATCH** | /users/me | user | Update user profile
**DELETE** | /users/me | user | Delete user profile
**GET** | /users/me/avatar | avatar (png) | Get user profile
**POST** | /users/me/avatar | --- | Create and update user avatar
**DELETE** | /users/me/avatar |  | Delete user avatar

Task related API endpoints:

Method | Endpoint | Returns |Description
--- | --- | --- | ---
**POST** | /tasks | task | Create task
**GET** | /tasks | tasks | Get tasks with additional parameters: limit, skip for pagination purposes
**GET** | /tasks/:id | task | Get task by task id
**PATCH** | /tasks/:id | task | Update task by task id
**DELETE** | /tasks/:id | task | Delete task by task id

User model:
Property | Type | Validators
--- | --- | ---
name | String | required, trim, lowercase
age | Number | optional, must be positive
email | String | required, valid email
password | String | required, minLength: 7, trim, must not contain "password"
tokens | Array of Strings| token is required
avatar | Buffer | optional

Task model:
Property | Type | Validators
--- | --- | ---
name | String | required, trim, lowercase
age | Number | optional, must be positive
email | String | required, valid email
password | String | required, minLength: 7, trim, must not contain "password"
tokens | Array of Strings| token is required
avatar | Buffer | optional
