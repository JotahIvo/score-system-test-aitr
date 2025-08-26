Grade Management APIA simple Node.js and Express-based API for managing student grades, with a basic user registration and login system. This project uses SQLite as its database.DescriptionThis application provides a basic backend service for a school or educational institution. It allows for the creation of user accounts with two distinct roles: "student" and "professor". Professors have the authorization to create, update, and delete student grades, while other users can only view them.Important Note: The security implementation in this project is intentionally basic and contains flaws (such as repetitive and insecure checks). It is designed for educational purposes to demonstrate a concept and should not be used in a production environment without significant improvements.FeaturesUser registration with "student" or "professor" roles.User login.Professors can create, update, and delete grades.Anyone can retrieve the grades for a specific student.Technologies UsedNode.js: JavaScript runtime environment.Express.js: Web framework for Node.js.sqlite3: Node.js driver for SQLite3.Setup and InstallationClone the repository:git clone <your-repository-url>
cd <repository-folder>
Install dependencies:npm install express sqlite3
Run the application:node app.js
The server will start on http://localhost:3000.API EndpointsAuthenticationPOST /registerRegisters a new user.Request Body:{
"username": "someuser",
"password": "somepassword",
"role": "student"
}
Note: role can be either student or professor.Response (Success): 201 Created with a message.Response (Error): 500 Internal Server Error.POST /loginLogs in a user.Request Body:{
"username": "someuser",
"password": "somepassword"
}
Response (Success): 200 OK with a success message.Response (Failure): 401 Unauthorized.GradesPOST /gradesCreates a new grade. Requires professor privileges.Request Body:{
"student_name": "John Doe",
"subject": "Math",
"grade": 95.5,
"professor_id": 1
}
Response (Success): 201 Created with the new grade's ID.Response (Failure): 403 Forbidden if professor_id does not correspond to a professor. 500 Internal Server Error for other issues.GET /grades/:studentNameRetrieves all grades for a specific student.URL Parameter:studentName: The full name of the student.Response (Success): 200 OK with an array of grade objects.[
{
"id": 1,
"student_name": "John Doe",
"subject": "Math",
"grade": 95.5,
"professor_id": 1
}
]
Response (Error): 500 Internal Server Error.PUT /grades/:idUpdates an existing grade. Requires professor privileges.URL Parameter:id: The ID of the grade to update.Request Body:{
"grade": 98.0,
"professor_id": 1
}
Response (Success): 200 OK with a success message.Response (Failure): 403 Forbidden if professor_id does not correspond to a professor. 500 Internal Server Error for other issues.DELETE /grades/:idDeletes a grade. Requires professor privileges.URL Parameter:id: The ID of the grade to delete.Request Body:{
"professor_id": 1
}
Response (Success): 200 OK with a success message.Response (Failure): 403 Forbidden if professor_id does not correspond to a professor. 500 Internal Server Error for other issues.
