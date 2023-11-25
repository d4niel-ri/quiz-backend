# Quiz - Backend

Basic express.js project with basic routes:
* Express
* Joi
* Fs

---

## How to Setup

1. Create `uploads` folder
2. Setup `.env` file
    ```
    PORT=<PORT>
    SALT=<SALT>
    JWT_SECRET=<JWT_SECRET>
    USERNAME_NODEMAILER=<EMAIL_THAT_IS_SET_SEND_EMAIL>
    PASSWORD_NODEMAILER=<PASSWORD_EMAIL_FOR_SEND_EMAIL>
    ```

3. Setup the database
    ```
    npx sequelize-cli db:drop
    npx sequelize-cli db:create
    npx sequelize-cli db:migrate
    npx sequelize-cli db:seed:all
    ```

## How to Run
```
npm start
```

## URL

_Server_
```
http://localhost:3000
```
---

## Global Response

_Response (500 - Internal Server Error)_
```
{
  "message": "Internal Server Error"
}
```

_Response (400 - Invalid or Expired Token)_
```
{
  "message": "Token is invalid"
}
```

_Response (400 - Not Authorized)_
```
{
  "message": "Not Authorized"
}
```

---

## RESTful endpoints

### Hello World

#### GET /

> Test an endpoint

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
Hello, express-auth's client!
```

### Public Images

#### GET :uploadUrl

> Get an image

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
<image>
```

### User

#### POST /api/user/verify-token

> Verify token (for checking expired or invalid)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response Body (200)_
```
{
  "status": "Success"
}
```

#### POST /api/user/login

> Login (user or admin)

_Request Header_
```
not needed
```

_Request Body_
```
{
  "email": <email>,
  "password": <password>
}
```

_Response 200_
```
{
  "token": <token>,
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"password\" is required"
}
```

_Response (400 - Invalid Username or Password)_
```
{
  "message": "Username or password is invalid"
}
```

---

#### POST /api/user/register

> Register (user only)

_Request Header_
```
not needed
```

_Request Body_
```
{
  "username": <username>,
  "email": <email>,
  "password": <password>
}
```

_Response (201)_
```
{
  "data": {
    "role": <role>,
    "id": <id>,
    "username": <username>,
    "email": <email>,
    "updatedAt": <updatedAt>,
    "createdAt": <createdAt>
  },
  "status": "Success"
}
```

_Response (400 - Validation Failed)_
```
{
  "status": "Validation Failed",
  "message": "\"role\" is not allowed"
}
```

_Response (400 - Username Exist)_
```
{
  "message": "Username already exist"
}
```

_Response (400 - Email Exist)_
```
{
  "message": "Email already exist"
}
```

---

#### POST /api/user/forgot-password

> Make the backend send an email form to reset password

_Request Header_
```
not needed
```

_Request Body_
```
{
  "email": <email>
}
```

_Response (200)_
```
{
  "message": "Reset password email sent successfully",
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"email\" is required"
}
```

_Response (404 - User Not Found)_
```
{
  "message": "User Not Found"
}
```

---

#### POST /api/user/reset-password

> Reset the password

_Request Header_
```
not needed
```

_Request Body_
```
{
  "resetToken": <resetToken>,
  "newPassword": <newPassword>
}
```

_Response (200)_
```
{
  "message": "Password reset successful",
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"newPassword\" is required"
}
```

_Response (400 - Token Is Invalid)_
```
{
  "message": "Reset token is invalid or expired"
}
```

---

#### GET /api/user

> Get all users (can be requested by admin only)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    <list_of_users>
  ],
  "status": "Success"
}
```

---

#### GET /api/user/:id

> Get user's data 

_Request Params_
```
/<id>
```

_Request Header_
```
not needed
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "username": <username>,
    "email": <email>
  },
  "status": "Success"
}
```

_Response (404)_
```
{
  "message": "User Not Found"
}
```

#### GET /api/user/my-data

> Get my account data

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "username": <username>,
    "email": <email>,
    "role": <role>,
    "imageUrl": <imageUrl>
  }
}
```

---

#### PUT /api/user

> Change user's own profile (username or email)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "username": <username>, // optional (but not empty)
  "email": <email>,       // optional (but not empty)
  "image": <image>,       // optional
}
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "username": <username>,
    "email": <email>,
    "role": <role>,
    "imageUrl": <imageUrl>
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"role\" is not allowed"
}
```

_Response (400 - Username Exist)_
```
{
  "message": "Username already exist"
}
```

_Response (400 - Email Exist)_
```
{
  "message": "Email already exist"
}
```

---

#### PUT /api/user/change-password

> Change user's own password

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "oldPassword": <oldPassword>,
  "password": <password>
}
```

_Response (200)_
```
{
  "message": "Password succesfully changed",
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"oldPassword\" is required"
}
```

_Response (400 - Invalid Old Password)_
```
{
  "message": "Invalid Old Password"
}
```

---

#### POST /api/user/create-admin

> Create an admin (can be done by admin only)

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "username": <username>,
  "email": <email>,
  "password": <password>
}
```

_Response (201)_
```
{
  "data": {
      "id": <id>,
      "username": <username>,
      "email": <email>
      "role": <role>,
      "updatedAt": <createdAt>,
      "createdAt": <updatedAt>
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"email\" is required"
}
```

_Response (400 - Username Exist)_
```
{
  "message": "Username already exist"
}
```

_Response (400 - Email Exist)_
```
{
  "message": "Email already exist"
}
```

---

#### DELETE /api/user/delete-user/:id

> Delete user or admin (can be done by admin only)

_Request Params_
```
/<id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "confirmationPassword": <confirmationPassword>
}
```

_Response (200)_
```
{
  "message": "Success delete <username>",
  "status": "Success"
}
```

_Response (404)_
```
{
  "message": "User Not Found"
}
```

---

### Quiz

#### GET /api/quiz

> If an account is admin, get all quiz data with each question counts and its author. If an account is user, get all *published* quiz data with each question counts and its author.

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    <list_of_quizzes_with_each_question_counts_&_its_author>
  ],
  "status": "Success"
}
```

---

#### GET /api/quiz?id=

> Get quiz data with its question count and its author

_Request Query_
```
?id=<id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "title": <title>,
    "description": <description>,
    "author_id": <author_id>,
    "is_published": <is_published>,
    "createdAt": <createdAt>,
    "updatedAt": <updatedAt>,
    "User": {
      "id": <author_id>,
      "username": <username>,
      "email": <email>
    },
    "questionCount": <questionCount>
  },
  "status": "Success"
}
```

_Response (404)_
```
{
  "message": "Quiz Not Found"
}
```

---

#### GET /api/quiz/my-completed-quizzes

> Get my account's completed quizzes with each question count, author and latest score

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    <list_of_my_completed_quizzes_with_question_count_&_author_&_latest_score>
  ],
  "status": "Success"
}
```

---

#### GET /api/quiz/my-created-quizzes

> Get my account's created quizzes

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    <list_of_my_created_quizzes_with_its_author_&_question_count>
  ],
  "status": "Success"
}
```

---

#### POST /api/quiz

> Create quiz

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "title": <title>,
  "description": <description>,
  "is_published": <is_published>  // optional
}
```

_Response (201)_
```
{
  "data": {
    "is_published": <is_published>,
    "id": <id>,
    "title": <title>,
    "description": <description>,
    "author_id": <author_id>,
    "updatedAt": <updatedAt>,
    "createdAt": <createdAt>
  }
}
```

_Response (400 - Validation Failed)_
```
{
  "status": "Validation Failed",
  "message": "\"description\" is required"
}
```

---


#### PUT /api/quiz/:id

> Update quiz (can be done by admin or its author only)

_Request Params_
```
/<id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "title": <title>,               // optional
  "description": <description>,   // optional
  "is_published": <is_published>  // optional
}
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "title": <title>,
    "description": <description>,
    "author_id": <author_id>,
    "is_published": <is_published>,
    "updatedAt": <updatedAt>,
    "createdAt": <createdAt>
  }
}
```

_Response (400 - Validation Failed)_
```
{
  "status": "Validation Failed",
  "message": "\"description\" is not allowed to be empty"
}
```

_Response (404 - Not Found)_
```
{
  "message": "Quiz Not Found"
}
```

---

#### DELETE /api/quiz

> Delete quiz (can be done by admin or its author only)

_Request Params_
```
/<id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "message": "Success delete <title>"
}
```

_Response (404)_
```
{
  "message": "Quiz Not Found"
}
```

---

### Questions

#### GET /api/question/single?question_id=

> Get single question's data

_Request Query_
```
?question_id=<question_id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "quiz_id": <quiz_id>,
    "question_no": <question_no>,
    "question_text": <question_text>,
    "answers": <answers>
  },
  "status": "Success"
}
```

_Response (400 - Need `question_id`)_
```
{
  "message": "Need query `question_id`"
}
```

_Response (404 - Not Found)_
```
{
  "message": "Question Not Found"
}
```

---

#### GET /api/question/:quiz_id

> Get questions' data with quiz_id

_Request Params_
```
/<quiz_id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    <list_of_questions_by_quiz_id>
  ],
  "status": "Success"
}
```

_Response (404)_
```
{
  "message": "Quiz Not Found"
}
```

---

#### POST /api/question/:quiz_id

> Create a question (can be done by admin or its quiz's author)

_Request Params_
```
/<quiz_id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "question_no": <question_no>,
  "question_text": <question_text>,
  "answers": [
    {
      "choice": <choice>,
      "text": <text>,
      "isCorrect": <isCorrect>, // boolean but in string
    },
    // same type with first element
  ]
}
```

_Response (201)_
```
{
  "data": {
    "id": <id>,
    "quiz_id": <quiz_id>,
    "question_no": <question_no>,
    "question_text": <question_text>,
    "answers": <answers>,
    "createdAt": <createdAt>,
    "updatedAt": <updatedAt>
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"question_text\" is not allowed to be empty"
}
```

_Response (404 - Quiz Not Found)_
```
{
  "message": "Quiz Not Found"
}
```

_Response (400 - Duplicate question_no)_
```
{
  "question_no": "This question_id already had this question_no"
}
```

---

#### PUT /api/question/:question_id

> Update a question (can be done by admin or its quiz's author)

_Request Params_
```
/<question_id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
{
  "question_text": <question_text>, // optional
  "answers": [                      // optional
    {
      "choice": <choice>,
      "text": <text>,
      "isCorrect": <isCorrect>, // boolean but in string
    },
    // same type with first element
  ]
}
```

_Response (200)_
```
{
  "data": {
    "id": <id>,
    "quiz_id": <quiz_id>,
    "question_no": <question_no>,
    "question_text": <question_text>,
    "answers": <answers>,
    "createdAt": <createdAt>,
    "updatedAt": <updatedAt>
  },
  "status": "Success"
}
```

_Response (400 - Validation Error)_
```
{
  "status": "Validation Failed",
  "message": "\"question_text\" is not allowed to be empty"
}
```

_Response (404 - Question Not Found)_
```
{
  "message": "Question Not Found"
}
```

---

#### DELETE /api/question/:question_id

> Delete a question (can be done by admin or its quiz's author)

_Request Params_
```
/<question_id>
```

_Request Header_
```
{
  "authorization": "Bearer <token>"
}
```

_Request Body_
```
not needed
```

_Response (200)_
```
{
  "data": [
    <list_of_questions_that_is_related_qith_question_by_quiz_id>
  ],
  "status": "Success"
}
```

_Response (404)_
```
{
  "message": "Question Not Found"
}
```

---