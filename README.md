# 17-SignInSheet
Project 17 Sign In Sheet Web App


Sign-In Sheet Web Application


Sign-in Sheet is a single page application designed to offer dance studios a consumer facing check-in system, while allowing teachers and owners to generate reports and other metrics using the data that is created. The application allows for the creation of 3 different user roles with varying authorizations and is built using a full Javascript MEAN stack.


User Role: 

	Access: 
		-Sign-in sheet page

	Abilities: 
		-Add new students
		-Add new lessons


Teacher Role:

	Access: 
		-Sign-in sheet page
		-Teacher Profile page
		-Teacher Lesson Dashboard page

	Abilities: 
		-Add new students
		-View, add, edit and delete lessons (restricted to own TeacherId)
		-Filter viewed lessons by date ranges, students, and lesson duration
		-Edit teacher profile, and change user password

Admin Role:

	Access: 
		-Sign-in sheet page
		-Teacher Profile page
		-Teacher Lesson Dashboard page
		-Teacher Management page

	Abilities: 
		-Add new students
		-View, add, edit and delete lessons
		-Filter viewed lessons by date ranges, students, and lesson duration
		-Edit teacher profile and change user password
		-Create new teacher users and regular users
		-Create new teacher profiles
		-Report lessons taught by each teacher for any given month


Version 1.0.0

-Base functionality achieved for each user role.

-Protected API routes with middleware requiring token authentication and authorization

-Protected state routes with custom routing