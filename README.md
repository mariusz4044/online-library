# Online Library

## Description

An online library platform featuring:

* Reader profiles with avatars.
* Captcha system for registration and login.
* Reading tracking system with auto-save for the last read page.
* Rating and comment system for books.
* Reporting panel.
* Admin management menu.

## Tech Stack

* **Backend:** Node.js, MongoDB, Express, Express-session
* **Frontend:** Vue.js

## Setup & Configuration

### Backend (Server)

1.  Navigate to the `server` directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or use install.bat if available
    ```
3.  Create a `.env` file in the `server` directory based on required environment variables (e.g., `DB_URL`, `PORT`, `COOKIE_SECRET`, `BOOK_HOME_PAGE`, `COMMENTS_PER_PAGE`). Example:
    ```dotenv
    DB_URL=mongodb://localhost:27017/onlineLibrary
    PORT=2137
    COOKIE_SECRET=yoursecretcookiekey
    BOOK_HOME_PAGE=10
    COMMENTS_PER_PAGE=5
    ```
4.  Start the server:
    ```bash
    npm start
    # or use run.bat if available
    ```
    The server should be running on `http://localhost:2137` (or the port specified in `.env`).

### Frontend

1.  Navigate to the `front` directory:
    ```bash
    cd front
    ```
2.  Install dependencies:
    ```bash
    npm install
    # or use install.bat if available
    ```
3.  Start the frontend development server:
    ```bash
    npm run serve
    # or use run.bat if available
    ```
    The frontend should be accessible, likely at `http://localhost:8080`.

## API Endpoints

### User Authentication & Session

<details>
<summary>`POST /user/register` - Register a new user</summary>

**Request Body:**
```json
{
  "nick": "String",
  "login": "String",
  "email": "String",
  "password": "String",
  "captcha": "String"
}
```
</details>

<details>
<summary>`POST /user/login` - Log in a user</summary>

**Request Body:**
```json
{
  "login": "String",
  "password": "String",
  "captcha": "String"
}
```
</details>

<details>
<summary>`GET /user/captcha` - Get a new captcha SVG</summary>
<br>
</details>

<details>
<summary>`GET /user/session` - Get current user session details</summary>
<br>
</details>

### User Profile & Settings

<details>
<summary>`GET /user/profile/{nickname}` - Get user profile details</summary>

**Path Parameters:**
* `nickname`: String - The nickname of the user profile to fetch.
</details>

<details>
<summary>`POST /user/avatar` - Change user avatar</summary>

**Request Body:**
```json
{
  "avatar": "String" // Base64 encoded image string (PNG or JPG)
}
```
</details>

<details>
<summary>`POST /user/changePass` - Change user password</summary>

**Request Body:**
```json
{
  "oldPassword": "String",
  "password": "String" // New password
}
```
</details>

### Books

<details>
<summary>`GET /user/getBooks/{page}` - Get a paginated list of books</summary>

**Path Parameters:**
* `page`: Number - The page number to retrieve.

**Query Parameters (Optional):**
* `name`: String - Filter by book title or author name.
* `year`: Number - Filter by publication year.
* `filtrOne`: String - Sort results ('komentarze', 'odsłony', 'polubione', 'oceny').
* `filtrTwo`: String - Filter by tag/type.
</details>

<details>
<summary>`GET /user/getBook/{id}` - Get details for a single book</summary>

**Path Parameters:**
* `id`: String (ObjectID) - The ID of the book.
</details>

<details>
<summary>`POST /user/book/action` - Record book reading actions (start, update progress)</summary>

**Request Body (for 'startRead'):**
```json
{
  "task": "startRead",
  "bookId": "String" // ObjectID
}
```
**Request Body (for 'update'):**
```json
{
  "task": "update",
  "bookId": "String", // ObjectID
  "cfi": "String", // Current reading position (ePUB CFI)
  "read": "Number", // Pages read in this session
  "atEnd": "Boolean" // Whether the user reached the end
}
```
</details>

<details>
<summary>`POST /user/book/rate` - Rate a book</summary>

**Request Body:**
```json
{
  "bookId": "String", // ObjectID
  "rate": "Number" // Rating from 1 to 5
}
```
</details>

<details>
<summary>`POST /user/book/like` - Add a book to favorites</summary>

**Request Body:**
```json
{
  "bookId": "String" // ObjectID
}
```
</details>

<details>
<summary>`POST /user/book/unLike` - Remove a book from favorites</summary>

**Request Body:**
```json
{
  "bookId": "String" // ObjectID
}
```
</details>

<details>
<summary>`GET /user/book/getFav` - Get the current user's favorite books</summary>
<br>
</details>

### Comments & Ratings

<details>
<summary>`POST /user/comment/new` - Add a new comment to a book</summary>

**Request Body:**
```json
{
  "bookId": "String", // ObjectID
  "comment": "String"
}
```
</details>

<details>
<summary>`POST /user/comment/get` - Get a paginated list of comments for a book</summary>

**Request Body:**
```json
{
  "bookId": "String", // ObjectID
  "page": "Number"
}
```
</details>

<details>
<summary>`POST /user/comment/rate` - Rate a comment (like/dislike)</summary>

**Request Body:**
```json
{
  "bookId": "String", // ObjectID
  "commentId": "String", // ObjectID
  "rate": "Number" // 1 for like, -1 for dislike
}
```
</details>

### Reporting

<details>
<summary>`POST /user/report` - Submit a bug report or issue</summary>

**Request Body:**
```json
{
  "message": "String"
}
```
</details>

### Admin

<details>
<summary>`POST /admin/createBook` - Add a new book (Admin only)</summary>

**Request Body:**
```json
{
  "image": "String", // Base64 encoded cover image
  "author": "String",
  "name": "String", // Book title
  "year": "Number",
  "language": "String",
  "tags": "String", // Semicolon-separated tags
  "desc": "String", // Description
  "epub": "String" // Base64 encoded EPUB file content
}
```
</details>

<details>
<summary>`POST /admin/changeBook` - Modify book details (Admin only)</summary>

**Request Body:**
```json
{
  "bookId": "String", // ObjectID
  "author": "String",
  "name": "String",
  "year": "Number",
  "language": "String",
  "tags": "String", // Semicolon-separated tags
  "desc": "String"
}
```
</details>

<details>
<summary>`POST /admin/removeBook` - Remove a book (Admin only)</summary>

**Request Body:**
```json
{
  "bookId": "String" // ObjectID
}
```
</details>

<details>
<summary>`GET /admin/getReports` - Get all user reports (Admin only)</summary>
<br>
</details>

## Additional Information

* The application uses `express-session` with `connect-mongodb-session` for session management, storing session data in MongoDB.
* Rate limiting is applied to several endpoints using `express-rate-limit` to prevent abuse.
* User IP is checked via `cf-connecting-ip` header or `req.connection.remoteAddress`.
* Avatars and EPUB files are stored locally and served statically.
* The `sharp` library is used for image processing (avatars, book covers).
* `svg-captcha` is used for generating captchas.

