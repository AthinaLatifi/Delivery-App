# Delivery-App
The Delivery App for Workers is a web application designed to streamline the delivery process for delivery personnel. This application allows delivery workers to efficiently manage their routes, communicate with support staff, and ensure timely delivery of parcels.
# Prerequisites
Before running the application, ensure you have the following installed:
•	Node.js (v14 or higher)
•	MongoDB (either locally or via MongoDB Atlas)
•	Git

# Setup Instructions
1.	Clone the repository:
git clone https://github.com/AthinaLatifi/Delivery-App.git
cd Delivery-App
2.  Install dependencies:
npm install
3.	Set up your .env file:
o	Create a .env file in the root directory of the project.
o	Add the environment variables from the file .env.sample
o	Replace your_database_name, your_mongodb_username, and your_mongodb_password with your MongoDB credentials.

#	Set up your MongoDB database:
**If using MongoDB Atlas, create a cluster and get the connection string.
**If using a local MongoDB instance, ensure the server is running.
**Create the following collections in your database:
users
costumers
archive

## Database Setup

If using MongoDB Atlas, create a cluster and get the connection string.  
**If using a local MongoDB instance, ensure the server is running.**  
Create the following collections in your database:

### Collections

1. **User  Collection (users)**
   {
       "fname": String,  // First name
       "lname": String,  // Last name
       "email": String,  // Email address
       "password": String,  // Password (should be hashed)
       "role": String  // User role (e.g., admin, user)
   }
2. **Costumer  Collection (costumer)**
{
    "id": String,  // Customer ID
    "fname": String,  // First name
    "lname": String,  // Last name
    "address": String,  // Address
    "city": String,  // City
    "postal": String,  // Postal code
    "packetID": Array,  // Array of packet IDs
    "floor": String,  // Floor number
    "door": String,  // Door number
    "comment": String,  // Additional comments
    "phone": String,  // Phone number
    "deliveryMail": String,  // Delivery email
    "status": String  // Delivery status
}
3. **Archived Customer Collection (archive)**
{
    "_id": String,  // Archived customer ID
    "fname": String,  // First name
    "lname": String,  // Last name
    "address": String,  // Address
    "city": String,  // City
    "postal": String,  // Postal code
    "packetID": Array,  // Array of packet IDs
    "floor": String,  // Floor number
    "door": String,  // Door number
    "comment": String,  // Additional comments
    "phone": String,  // Phone number
    "deliveryMail": String,  // Delivery email
    "status": String  // Delivery status
}

# Run the application
Use the ```npm init ``` command to create the needed directories
Run the program with ```nodemon index.js``` command 
The application will be accessible at http://localhost:3000 (or the port specified in your .env file).
