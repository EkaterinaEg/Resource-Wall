# Resource Wall

Pinterest for learners.

Allow learners to save learning resources like tutorials, blogs and videos in a central place that is publicly available to any user.

## Final Product

!["Screenshot of Home page"]()
!["Screenshot of My resources"]()
!["Screenshot of Resource page"]()
!["Screenshot of Add new resource"]()

## Requirements:

- users should be able to save an external URL along with a title and description
- users should be able to search for already-saved resources created by any user
- users should be able to categorize any resource under a topic
- users should be able to comment on any resource
- users should be able to rate any resource
- users should be able to like any resource
- users should be able to view all their own and all liked resources on one page ("My resources")
- users should be able to update their profile

## Technologies

### Front:

- HTML
- CSS
- SASS
- JS

### Back-end

- Express
- Node 10.x or above
- NPM 5.x or above
- PG 6.x

## Getting Started

1. Clone your repository onto your local device.
2. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
3. Update the .env file with your correct local information

- username: `labber`
- password: `labber`
- database: `midterm`

4. Install dependencies: `npm i`
5. Fix to binaries for sass: `npm rebuild node-sass`
6. Reset database: `npm run db:reset`
7. Run the server: `npm run local`

- Note: nodemon is used, so you should not have to restart your server

8. Visit `http://localhost:8080/`
