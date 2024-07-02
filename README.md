# Bloggy

## Goal

The main objective of Bloggy is to provide a platform where users can create, share, and interact with blog posts. It aims to be a user-friendly and feature-rich blogging application that supports user authentication, blog creation, commenting, and more.

## Context

Bloggy was developed to offer a seamless and engaging blogging experience. With a focus on usability and feature richness, the application enables users to create and share blog posts easily, comment on others' posts, and engage in meaningful discussions. The platform supports secure user authentication and aims to foster a community of bloggers and readers.

## Process

- **Frontend Development**: Built with React and TypeScript to create a responsive and dynamic user interface.
- **Backend Development**: Implemented with Node.js and Express.js for handling server-side logic and API endpoints.
- **Database Management**: Used Prisma with PostgreSQL for database management and ORM.
- **Authentication**: Integrated Passport.js and JWT for secure user authentication and authorization.
- **Sanitization**: Applied sanitization on the backend to ensure content safety before storing in the database.
- **Deployment**: Deployed the application using suitable hosting services (e.g., Heroku, Vercel).

## Quick Start

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Tejas73/Bloggy.git
    cd Bloggy
    ```

2. **Install Dependencies**:
    ```bash
    cd server
    npm install
    cd ../client
    npm install
    ```

3. **Configure Environment Variables**:
    Create a `.env` file in the `server` directory with the following variables:
    ```env
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
    JWT_SECRET="your_jwt_secret_key"
    ```

4. **Apply Database Migrations**:
    ```bash
    cd server
    npx prisma migrate dev --name init
    ```

5. **Start the Server**:
    ```bash
    cd server
    npm start
    ```

6. **Start the Client**:
    ```bash
    cd client
    npm start
    ```

## Troubleshooting

- **Database Connection Issues**:
    - Ensure that your PostgreSQL server is running and the credentials in `.env` are correct.
    - Check if the `DATABASE_URL` environment variable is properly formatted.

- **JWT Authentication Errors**:
    - Verify that the `JWT_SECRET` in your `.env` file matches the secret used for signing tokens.
    - Ensure that the client includes the JWT token in the Authorization header for protected routes.

- **Frontend Not Loading**:
    - Make sure the client development server is running on the correct port (default: 3000).
    - Check the browser console for any errors and address them accordingly.

## Code Description

### Client

- **Components**: Contains reusable UI components (e.g., Button, Input, CommentDropDown).
- **Pages**: Contains main pages like Feed, BlogPost, CreateBlog.
- **Hooks**: Custom hooks for handling authentication and other logic.
- **Store**: State management using Recoil for managing global state.

### Server

- **Routes**: Defines API endpoints for blogs, comments, and authentication.
- **Controllers**: Contains logic for handling requests and responses.
- **Middlewares**: Custom middlewares for authentication, error handling, etc.
- **Prisma**: Database schema and client setup for interacting with PostgreSQL.

## External Documentation and Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Node.js Documentation](https://nodejs.org/en/docs/)
- [Express.js Documentation](https://expressjs.com/en/starter/installing.html)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Passport.js Documentation](http://www.passportjs.org/docs/)
- [JWT Documentation](https://jwt.io/introduction/)

## To-Do

### Feature Enhancements

- Add user profile pages.
- Implement like/dislike functionality for comments.
- Add categories/tags for blog posts.
- Implement search functionality for blogs.

### Code Improvements

- Improve error handling and validation.
- Optimize database queries.
- Refactor code for better readability and maintainability.

### Testing

- Write unit and integration tests for the backend.
- Add end-to-end tests for the frontend.

---

_Last Reviewed: 2024-07-02_
