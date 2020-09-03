# Voting-app

Simple Voting app created with Node.js and MySQL

Run the following commands in MySQL to initialise the database

      CREATE TABLE `data` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `username` varchar(50) NOT NULL,
      `password` varchar(50) NOT NULL,
      `voted` tinyint(1) DEFAULT NULL,
      PRIMARY KEY (`id`)
      )ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;


      CREATE TABLE `votes`(
      `id` int(10) NOT NULL,
      `numberVotes` int(11) DEFAULT NULL
      ) ENGINE=InnoDB DEFAULT CHARSET = utf8;
      
      INSERT INTO votes (id, numberVotes) VALUES 
      ('1', '0'),
      ('2', '0'),
      ('3', '0'),
      ('4', '0'),
      ('5', '0');
      
Run server.js to start the server and go to http://localhost:3000
