INSERT INTO resources (
    user_id, description, title, link)
     VALUES (
    1, 'Create the perfect pallete or get inspired by thousands of beautiful color schemes', 'The super fast color palletes generator', 'https://coolors.co/'),
    (
    1, 'Useful PostgreSQL CHEAT SHEET', 'PostgreSQL CHEAT SHEET', 'https://www.postgresqltutorial.com/wp-content/uploads/2018/03/PostgreSQL-Cheat-Sheet.pdf'),
     (
    2, 'This is the article in the Express series where we will focus on handling errors in Node.js applications written using Express ', 'Error Handling in Express', 'https://reflectoring.io/express-error-handling/'),
     (
    3, 'Useful practical resourse for flex-box concepts', 'Demos for W3C CSS Flexbox Specification', 'https://yoksel.github.io/flex-cheatsheet/#section-align-items-self'),
         (
    4, 'The basics of Sass, BEM (block-element-modifier), and the principles of responsive design', 'Sass and BEM for beginners', 'https://www.youtube.com/watch?v=jfMHA8SqUL4'),
             (
    4, 'Free online diagram software for making flowcharts, process diagrams, org charts, UML', 'Diagram Tool', 'https://app.diagrams.net'),
             (
    4, 'API platform for building and using APIs', 'Postman', 'https://www.postman.com'),
      (
    4, 'Trello is the flexible work management tool where teams can ideate plans, collaborate on projects, organize workflows, and track progress in a visual, productive, and rewarding way', 'Trello', 'https://trello.com'),
     (
    4, 'Lorem ipsum dolor sit amet, consectetur adipiscing...', 'Placeholders', 'https://meettheipsums.com'),
         (
    4, 'The internet`s source for visuals. Powered by creators everywhere.', 'Unsplash', 'https://unsplash.com');


INSERT INTO favourite_resources (user_id, resource_id)
  VALUES (1, 6),
   (1, 3),
   (1, 4),
   (1, 9),
   (2, 1),
   (2, 10),
   (3, 1),
   (3, 5),
   (3, 7),
   (4, 2);



 INSERT INTO resource_ratings (user_id, resource_id, rating)
VALUES (1, 6, 5),
  (1, 6, 3),
  (1, 3, DEFAULT),
  (1, 7, DEFAULT),
  (2, 7, 4),
  (2, 7, 4),
  (3, 1, DEFAULT),
  (5, 4, 5),
  (5, 9, 5),
  (4, 8, 3);



INSERT INTO resource_comments (user_id,  resource_id, comment)
 VALUES (1,6, 'My favorite'),
 (1,3, 'Read daily'),
 (1,7, '👎'),
 (2,7, 'Like it'),
 (3,1, 'Use in my projects'),
 (5,4, 'Helpful'),
 (5,9, '😀'),
 (4,8, '💯');



INSERT INTO  categories (name)
 VALUES ('design'),
 ('css'),
 ('databases'),
 ('express'),
 ('sass'),
 ('diagram Tools'),
 ('api'),
 ('project management'),
 ('communication tool'),
 ('placeholder'),
 ('html');


INSERT INTO resource_categories (resource_id, category_id)
VALUES (1,1),
(2,3),
(3,4),
(5,5),
(4,2),
(6,6),
(7,7),
(8,8),
(8,9),
(10,11),
(10,1);
