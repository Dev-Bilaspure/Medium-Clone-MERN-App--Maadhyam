# Blogging-App-Express-Typescript-Server

Introducing a powerful REST API server for captivating blogging applications. Built on Express.js and TypeScript, it provides a scalable and efficient backend infrastructure for creating, publishing, and managing engaging blog posts. With user authentication, intuitive CRUD operations, comprehensive error handling, and robust validation, developers can confidently build secure and feature-rich blogging platforms. Its flexible and extensible architecture enables customization to meet unique application requirements.

#### React frontend is hosted here: https://storied-sorbet-6b366f.netlify.app
#### Frontend Repository: https://github.com/Dev-Bilaspure/blog-app-ui-react
#### New Front Repository (New: Migrating to TypeScript | Work In Progress): https://github.com/Dev-Bilaspure/Blogging-App-React-Typescript-Frontend

## API Documentation:

### API Routes:

Base URL:  `https://maadyam-app-server.onrender.com` (App is hosted on [Render](https://render.com/)) or `http://localhost:8000` (When running in local env.)


#### Auth Routes: 
- Base URL: `/api/auth`
  - `POST /signup` - Creates a new user.
  - `POST /login` - Logs in a user.
  - `GET /me` - Retrieves the currently authenticated user.



#### User Routes: 
- Base URL: `/api/users`
  - `GET /:userId` - Retrieves a user by their ID.
  - `PUT /:userId` - Updates a user by their ID.
  - `PUT /follow/:currentUserId` - Allows the currently authenticated user to follow another user.
  - `PUT /unfollow/:currentUserId` - Allows the currently authenticated user to unfollow a user.
  - `GET /followings/:userId` - Retrieves the users followed by a specific user.
  - `GET /followers/:userId` - Retrieves the followers of a specific user.
  - `PUT /bookmark/:userId` - Adds a post to the bookmarks of a user.
  - `PUT /unbookmark/:userId` - Removes a post from the bookmarks of a user.
  - `GET /bookmarked-posts/:userId` - Retrieves the posts bookmarked by a user.
  - `GET /users/suggestions` - Retrieves suggested users

#### Post Routes: 
- Base URL: `/api/posts`
  - `GET /` - Retrieves all posts.
  - `GET /:postId` - Retrieves a post by its ID.
  - `GET /user/:userId` - Retrieves posts by a specific user.
  - `POST /create-update-post` - Creates or updates a post.
  - `PUT /publish/:postId` - Publishes a post.
  - `PUT /unpublish/:postId` - Unpublishes a post.
  - `DELETE /:postId/:userId` - Deletes a post.
  - `PUT /like/:postId` - Likes a post.
  - `PUT /unlike/:postId` - Unlikes a post.
  - `GET /liked-posts/:userId` - Retrieves the posts liked by a user.

#### Comment Routes: 
- Base URL: `/api/comments`
  - `POST /` - Creates a new comment.
  - `GET /post/:postId` - Retrieves comments for a specific post.
  - `PUT /:commentId` - Updates a comment by its ID.
  - `DELETE /:commentId/:userId` - Deletes a comment.
  - `PUT /like/:commentId` - Likes a comment.
  - `PUT /unlike/:commentId` - Unlikes a comment.
