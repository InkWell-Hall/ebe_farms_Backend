# Ebe Farms Backend

This is the backend API for Ebe Farms, a platform for managing farm projects, investments, investors, user authentication, profiles, and payments.

## Features

- User registration, login, OTP verification, and password reset
- Farm project creation, update, listing, and closing
- Investor profile management
- Investment management and tracking
- Payment integration with Paystack
- Profile image uploads via Cloudinary

## Tech Stack

- Node.js, Express.js
- MongoDB (Mongoose ODM)
- Joi for validation
- JWT for authentication
- Nodemailer for email
- Cloudinary for image storage
- Paystack for payments

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB database
- Cloudinary account
- Paystack account (for test keys)
- Gmail account for SMTP

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/InkWell-Hall/ebe_farms_Backend.git
   cd ebe_farms_Backend
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Create a `.env` file in the root directory (see `.env.example` or below):

   ```
   PORT=your_port
   MONGODB_URI=your_mongodb_uri
   CLOUDINARY_URL=your_cloudinary_url
   PAYSTACK_SECRET=your_paystack_secret
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_email_password
   JWT_SECRET=your_jwt_secret
   OTP_SECRET=your_otp_secret
   ```

4. Run the application:
   ```sh
   npm run dev
   ```

5. Access the API at `http://localhost:your_port`.

## API Overview

Below are the main routes and their methods.  
**Note:** Most endpoints require authentication via JWT.

---

### Farm Project Routes

| Method | Endpoint                        | Middleware                        | Description                        |
|--------|---------------------------------|-----------------------------------|------------------------------------|
| POST   | `/farmProjects`                 | authenticate, multipleImages      | Create a new farm project          |
| POST   | `/farmProjects/:id`             | authenticate                      | Close a farm project               |
| GET    | `/farmProjects/:id`             | authenticate                      | Get a single farm project          |
| GET    | `/farmProjects`                 | None                              | Get all farm projects              |
| GET    | `/user/farmProjects/:id`        | authenticate                      | Get all farm projects for a user   |
| PUT    | `/farmProjects/:id`             | authenticate                      | Update a farm project              |
| DELETE | `/farmProjects/:id`             | authenticate                      | Delete a farm project              |

---

### User Routes

| Method | Endpoint                | Middleware     | Description                        |
|--------|-------------------------|---------------|------------------------------------|
| POST   | `/user/signUp`          | None          | Register a new user                |
| POST   | `/user/login`           | None          | User login                         |
| POST   | `/user/verify`          | None          | Verify user OTP                    |
| POST   | `/user/forgot-password` | None          | Request password reset             |
| POST   | `/user/reset-password`  | None          | Reset password                     |
| GET    | `/user`                 | authenticate  | Get all users                      |
| GET    | `/user/:id`             | authenticate  | Get a single user                  |
| PUT    | `/user/:id`             | authenticate  | Update user details                |
| DELETE | `/user/:id`             | authenticate  | Delete a user                      |

---

### Profile Routes

| Method | Endpoint           | Middleware     | Description                        |
|--------|--------------------|---------------|------------------------------------|
| GET    | `/profile/:id`     | authenticate  | Get user profile                   |
| PUT    | `/profile/:id`     | authenticate  | Update user profile                |
| DELETE | `/profile/:id`     | authenticate  | Delete user profile                |

---

### Investment Routes

| Method | Endpoint                | Middleware     | Description                        |
|--------|-------------------------|---------------|------------------------------------|
| POST   | `/investment`           | authenticate  | Create a new investment            |
| GET    | `/investment`           | authenticate  | Get all investments                |
| GET    | `/investment/:id`       | authenticate  | Get a single investment            |
| PUT    | `/investment/:id`       | authenticate  | Update an investment               |
| DELETE | `/investment/:id`       | authenticate  | Delete an investment               |

---

### Payment Routes

| Method | Endpoint                | Middleware     | Description                        |
|--------|-------------------------|---------------|------------------------------------|
| POST   | `/init-payment`         | authenticate  | Initiate a payment                 |
| GET    | `/payment`              | authenticate  | Get all user payments              |
| GET    | `/payment/:id`          | authenticate  | Get a single payment               |

---

## API Documentation

API documentation is available at `http://localhost:your_port/api-docs` after starting the server.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.