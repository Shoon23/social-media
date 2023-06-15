# Social Media

## Overview
The social-media project is  a web-based social media application developed using React.js and other related technologies. It could be a platform that allows users to create accounts, connect with friends, post content, and interact with other users through features such as comments, likes, and sharing

## Getting Started
    git clone <repo link>
    cd keyboard_eccomrce
    
    npm install
    npm run dev



## Tech Stack
    Typescript
    Nextjs
    Tailwindcss
    Prisma
    Postgresql
    Cloudinary

## Features

### User Authentication

- Register 
  
  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686816155/md/social-media/Register.png)

  Users can sign up for an account by providing their email address, username, and password. The application validates the input and creates a new user account in the database. The user's password is typically hashed for security. Once registered, users can proceed to log in.

- Login 
  
  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686816133/md/social-media/Login.png)

  To log in, users enter their registered email address or username along with their password. The application verifies the credentials against the stored user data in the database. If the credentials match, the user is granted access to their account and redirected to the authenticated section of the application.

### User Post

- Post Feed
  
  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686816477/md/social-media/Post%20Feed.png)

  The application provides a feed where users can view posts from other users whom they are following or are friends with. This feed presents a collection of posts in a chronological order, allowing users to stay updated with the latest content shared by others.

- Create
  
  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686816481/md/social-media/Create%20Post.png)

  Authenticated users can create new posts. This functionality enables users to share their thoughts, images, or any other content with their followers or friends

- Update

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686816479/md/social-media/Update%20Post.png)

  Users can update their existing posts. This feature allows users to modify the content or make any necessary changes to their posts after they have been published.

- Delete

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686816477/md/social-media/Delete%20Post.png)

   Users have the ability to delete their own posts. This feature enables users to remove posts from their profile or feed if they no longer wish to have them visible to others.

- Single User View

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817008/md/social-media/User%20Profile.png)

   Users can view the posts and profile of a specific user by visiting their profile or a dedicated page.

### Likes and Comments

- Like a Post

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817690/md/social-media/Like%20Post.png)

   Users have the ability to like posts created by other users. This feature allows users to show their appreciation or approval for a particular post. It promotes engagement and interaction within the social media platform.

- Create a Comment on a Post

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817692/md/social-media/Add%20Comment.png)

   Users can create comments on posts to share their thoughts, opinions, or engage in discussions. Comments can be added to any post, including their own posts or posts from other users.


- Update a Comment on a Post

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817689/md/social-media/Update%20Comment.png)

   Update a Comment on a Post: Users can edit the content of their own comments on a post. This feature enables users to modify their comments if they want to correct a mistake or provide additional information.

- Delete a Comment on a Post

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817690/md/social-media/Delete%20Comment.png)

   Users have the option to delete their own comments on a post. This gives users control over their own comments and allows them to remove or edit any comment they have made.

- Like a Comment on a Post

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686831835/md/social-media/Like%20Comment.png)

   Along with liking posts, users can also like individual comments made on a post. This allows users to show appreciation or agreement with specific comments that resonate with them.




### Friends

- Search User

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817007/md/social-media/Screen_Shot_2023-06-15_at_4.13.48_PM_juzabz.png)

   Users can search for other users within the application.

- Add Friend

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817008/md/social-media/Add%20Friend.png)

   They can send friend requests to specific users they want to connect with.


- Accept/Decline Friend

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817008/md/social-media/Friend%20Request.png)
  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817007/md/social-media/Screen_Shot_2023-06-15_at_4.13.48_PM_juzabz.png)

   Upon receiving a friend request, the recipient user can accept or decline the request.


- Friend List

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817007/md/social-media/Friend%20List.png)

   If the request is accepted, both users become friends on the platform.



- Unfriend

  ![Image Alt Text](https://res.cloudinary.com/dkarsw8bs/image/upload/v1686817008/md/social-media/Unfriend.png)

   A user can remove a friend in his list.




