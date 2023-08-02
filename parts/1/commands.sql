CREATE TABLE blogs  (
   id SERIAL PRIMARY KEY,
   author text ,
   url text NOT NULL,
   title text NOT NULL,
   likes int DEFAULT 0
);

insert into blogs (author, url, title) values ('C.Ziskas', 'https://www.amazon.com/?tag=operadesktop-sd-generic-20', 'TUC');
insert into blogs (author, url, title) values ('M.Manarwlh', 'https://www.instagram.com', 'Panepisthmio Aigiou');
insert into blogs (url, title) values ('https://www.instagram.com', 'APTH');

\d blogs;
select * from blogs;