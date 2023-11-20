INSERT INTO resources (
    owner_id, description, title, link)
    VALUES (
    1, 'Create the perfect pallete or get inspired by thousands of beautiful color schemes', 'The super fast color palletes generator', 'https://coolors.co/'),
   VALUES (
    1, 'Useful PostgreSQL CHEAT SHEET', 'PostgreSQL CHEAT SHEET', 'https://www.postgresqltutorial.com/wp-content/uploads/2018/03/PostgreSQL-Cheat-Sheet.pdf'),
    VALUES (
    2, 'This is the article in the Express series where we will focus on handling errors in Node.js applications written using Express ', 'Error Handling in Express', 'https://reflectoring.io/express-error-handling/'),
    VALUES (
    3, 'Useful practical resourse for flex-box concepts', 'Demos for W3C CSS Flexbox Specification', 'https://yoksel.github.io/flex-cheatsheet/#section-align-items-self'),
        VALUES (
    4, 'The basics of Sass, BEM (block-element-modifier), and the principles of responsive design', 'Sass and BEM for beginners', 'https://www.youtube.com/watch?v=jfMHA8SqUL4'),
            VALUES (
    4, 'Free online diagram software for making flowcharts, process diagrams, org charts, UML', 'Diagram Tool', 'https://app.diagrams.net'),
            VALUES (
    4, 'API platform for building and using APIs', 'Postman', 'https://www.postman.com'),
     VALUES (
    4, 'Trello is the flexible work management tool where teams can ideate plans, collaborate on projects, organize workflows, and track progress in a visual, productive, and rewarding way', 'Trello', 'https://trello.com'),
    VALUES (
    4, 'Lorem ipsum dolor sit amet, consectetur adipiscing...', 'Placeholders', 'https://meettheipsums.com'),
        VALUES (
    4, 'The internet`s source for visuals. Powered by creators everywhere.', 'Unsplash', 'https://unsplash.com');

INSERT INTO favourite_resources (user_id, resource_id)
  VALUES (1, 6),
  VALUES (1, 3),
  VALUES (1, 4),
  VALUES (1, 9),
  VALUES (2, 1),
  VALUES (2, 10),
  VALUES (3, 1),
  VALUES (3, 5),
  VALUES (3, 7),
  VALUES (4, 2);


 INSERT INTO resource_reviews (user_id, resource_id, rating DEFAULT 0, is_like DEFAULT false, comment  DEFAULT NULL)
 VALUES (1, 6, 5, true, 1),
 VALUES (1, 6, 3, true, DEFAULT),
 VALUES (1, 3, DEFAULT, true, 2),
 VALUES (1, 7, DEFAULT, DEFAULT, 3),
 VALUES (2, 7, 4, DEFAULT, 4),
 VALUES (2, 7, 4, DEFAULT, DEFAULT),
 VALUES (3,1, DEFAULT, DEFAULT, 5),
 VALUES (5,4, 5, true, 6),
 VALUES (5,9, 5, true, 7),
 VALUES (4,8, 3, true, 8);



INSERT INTO resource_comments (user_id,  resource_id, comment)
VALUES (1,6, 'My favorite'),
VALUES (1,3, 'Read daily'),
VALUES (1,7, '👎'),
VALUES (2,7, 'Like it'),
VALUES (3,1, 'Use in my projects'),
VALUES (5,4, 'Helpful'),
VALUES (5,9, '😀'),
VALUES (4,8, '💯');

INSERT INTO resource_categorys (resource_id, category_id)
VALUES(1,1),
VALUES(2,3),
VALUES(3,4),
VALUES(5,5),
VALUES(4,2),
VALUES(6,6),
VALUES(7,7),
VALUES(8,8),
VALUES(8,9),
VALUES(10,11),
VALUES(10,1);

INSERT INTO  categorys (name)
VALUES (Design),
VALUES (CSS),
VALUES (Databases),
VALUES (Express),
VALUES (Sass),
VALUES (Diagram Tools),
VALUES (API),
VALUES (Project Management),
VALUES (Communication Tool),
VALUES (Placeholder),
VALUES (HTML);

