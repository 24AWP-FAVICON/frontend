# Front-End Features Introduction

## 1. Home
**Main Page Functionality**: This section includes the core layout and functionalities of the main page, consisting of sections for creating travel plans, showcasing travel tips, and highlighting popular destinations.

### Detailed Description
#### 1. Introduction and Search
- **Introduction**: Displays a welcoming message and an invitation to start planning a trip.
- **Search Functionality**: Users can search for locations to plan their trips.

#### 2. Travel Tips Carousel
- **Carousel Functionality**: Displays travel tips with an image and description in a carousel format.
- **Navigation**: Users can navigate through tips using previous and next buttons.

#### 3. Popular Destinations
- **Destination Cards**: Displays a grid of popular travel destinations with images and location names.
- **Navigation**: Clicking on a destination navigates the user to the planning page for that location.

### Community Screen Shot
#### 1. Main Page Overview
![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/1d87f60f-78c5-410c-8d86-76aa082ae7ce)
#### 2. Travel Tips Carousel
![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/f7898bfe-1db2-4385-962d-89c50ae9ef52)
#### 3. Popular Destinations
![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/5ab3d521-7d7e-4c22-b67b-b1c7bdc3d6ae)

## 2. Community
**Community Functionality**: This section handles the core functionalities of the community page, including fetching posts, liking/unliking posts, adding comments, and creating new posts.

### Detailed Description

#### 1. Fetching and Displaying Posts
- **Initial Fetch**: When the component mounts, it fetches posts from the API using the **fetchPosts** function.
- **Post Enhancement**: Each post is enhanced with comments and like count using **fetchCommentsByPostId**.
- **Sorting**: Posts are sorted by creation date in descending order.
- **Infinite Scroll**: Uses Intersection Observer API to load more posts as the user scrolls down.

#### 2. Searching Posts
- **Search Function**: Filters posts based on the search term entered by the user.

#### 3. Modal Management
- **Post Modal**: Opens a modal to show post details and comments when a post is clicked.
- **Create Post Modal**: Opens a modal to create a new post.

#### 4. Adding Comments
- **Comment Function**: Adds a comment to the selected post and updates the comment count.

#### 5. Liking/Unliking Posts
- **Like Function**: Toggles the like status of a post and triggers a heart animation.
- **Unlike Function**: Toggles the unlike status of a post and triggers a blue heart animation.

#### 6. Creating New Posts
- **Create Post Function**: Handles the creation of a new post, including uploading an image and updating the post with the image URL if provided.

### Community Screen Shot
#### 1. Community Main Page
  ![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/ba329f84-a433-4d7a-8e25-54b207b951d4)
#### 2. Post Modal
![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/d536cbd7-b877-415d-a4b1-c92dfcebc2bb)
#### 3. Create Post Modal
![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/da8e63b8-8805-4042-81e7-9d9d519c0350)

## 3. Login
**Login Successful Processing**: After OAuth authentication, the user information is saved and redirected. If the user successfully logs in through Google OAuth, the user information is imported using the issued access token and the refresh token, which is then stored in the cookie. Then, the user is redirected to the main page.

### Detailed Description

#### 1. Verify Tokens and Request User Information
- Runs when the component is mounted using the **useEffect** hook.
- Retrieves the **access token** and **refresh token** from the cookies.
- If the token exists, makes an API call to get user information.

#### 2. Save User Information
- If the API call is successful, the returned user information is stored in the cookies.
- For example, you can store **userEmail** in cookies so that other components can utilize this information.

#### 3. Redirection
- After storing user information, redirects the user to the main page (`/`).
- If the API call fails or the token does not exist, redirects the user to the login page to prompt re-login.

#### 4. Show Loading Status
- While importing user information, displays a "Loading..." message to inform the user that processing is underway.

### Login Screen Shot
#### 1. Login Page
   ![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/65aec526-4297-4f47-adf1-5fac7bd686be)
#### 2. Google Login
   ![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/90b3d234-2e58-4e43-af40-3e5f3a739be8)
#### 3. Successful Login
   ![image](https://github.com/24AWP-FAVICON/frontend/assets/117453101/b48870b2-4e03-41e8-830b-ff8f783917a4)
    

## 4. SNS


## 5. Plan