// NODE.JS : plateforme permettant de créer facilement des applications orientées serveur. 
// Il est principalement basé sur la mise en place d'événements permettant une gestion de données 
// asynchrone. 
// Applications possibles : jeux multi-joueurs (données temps réel), tchat, changement 
// de la page en fonction d'événements, etc..



// Plusieurs modules sont disponibles et permettent d'avoir des fonctionnalités supplémentaires 
// avec node.js. 
// Pour installer ces modules, il faut utiliser la console avec la commande suivante : 
// >> npm install <nom du module> --save 

// Le module express est un framework de node.js qui va vous permettre de créer l'interface rapidement
// (en définissant les routes, les fichiers à appeler en fonction de ces routes, les dossiers à 
// inclure dans l'application, l'utilisation des cookies et des sessions). 
// Pour résumer, express permet de créer le squelette de l'application.
var express = require("express");

// Pour utiliser un module, nous devons tout d'abord l'instancier : 
var app = express();

// Le module http (à télécharger aussi) correspond à un serveur HTTP qui permet l'utilisation de certains 
// protocoles difficiles à assimiler beaucoup plus facilement et de manière plus intuitive. Nous allons donc 
// Créer un serveur HTTP qui prendra "app" (l'instance du module express) afin que notre application puisse
// fonctionner autour de ce serveur. 
var server = require('http').createServer(app);

// Après avoir mis en place notre serveur et notre interface, il faut qu'on utilise des sockets afin d'être 
// en mesure de créer des nouveaux événements. Les sockets vont nous permettre de faire des changements dans 
// notre application de façon asynchrone. Il faut installer socket.io >>npm install socket.io
var io = require('socket.io').listen(server);

// Le module request va nous permettre de gérer les requêtes des clients. Ces requêtes seront traîtés et une 
// réponse sera renvoyée : (req, res)
var request = require('request');

// Le module postgre nous permettra de manipuler notre base de donnée librement. Il est nécessaire 
// de pouvoir sauvegarder, modifier et supprimer les données du site. Nous allons donc utiliser postgre 
// afin d'assurer la correspondance avec HEROKU
var pg = require('pg');

// Les trois modules suivants nous permettront d'utiliser les cookies et les sessions pour mieux sécuriser 
// la partie admin du dashboard
var cookie = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

// Cette variable contiendra toutes les données de session. Nous la déclarons au tout début de notre 
// serveur afin qu'elle soit accessible dans toutes nos fonctions. 
var sess;

// Le serveur doit utiliser un port afin d'écouter les demandes du client. Le port sur lequel écoute le serveur 
// n'est pas toujours le même sur HEROKU. Ainsi, nous devons préciser que le serveur écoute soit sur le port par
// défaut (3000), soit sur le port défini par l'environnement (process.env.port)
server.listen(process.env.PORT || 3000);


// A chaque deploiement, nous devons choisir les données de la BDD que nous allons utiliser : si nous sommes en local, 
// nous allons décommenter la configuration ayant pour host : localhost. 
// Si nous voulons déployer l'application sur HEROKU, il faut utiliser la configuration de HEROKU 


// Configuration locale BDD 
// var config = {};
// config.user = 'postgres';
// config.password = 'admin';
// config.database = 'dashboard';
// config.host = 'localhost';
// config.port = 5432;


// Configuration Heroku BDD
var config = {};
config.user = 'yntviqlzscnbqq';
config.password = 'w15ISVFDrLBp414QG9sXfbHBMY';
config.database = 'd80v1h0fvs1qi5';
config.host = 'ec2-54-204-35-248.compute-1.amazonaws.com';
config.port = 5432;


// Nous devons préciser que notre application utilise des cookies, puis les sessions. La déclaration 
// se fait dans cet ordre (cookies puis session). 
app.use(cookie());
app.use(session({secret:"anystringoftext",
				 saveUninitialized:true,
				 resave:true}));
app.use( bodyParser.json() );     
app.use(bodyParser.urlencoded({    
  extended: true
})); 

// Lorsqu'on utilise express et node.js, il faut préciser les dossiers qu'il faudra inclure dans l'application 
// ici, nous allons inclure tous nos fichiers statiques (css, jsvascript) afin qu'ils soient utilisés. Sans 
// ces déclarations, les fichiers ne seront pas lus par le serveur et le CSS ou le JavaScript ne fonctionnera 
// pas sur notre page
app.use("/bootstrap", express.static(__dirname + '/bootstrap'));
app.use("/bild", express.static(__dirname + '/build'));
app.use("/dist", express.static(__dirname + '/dist'));
app.use("/font", express.static(__dirname + '/font'));
app.use("/documentation", express.static(__dirname + '/documentation'));
app.use("/pages", express.static(__dirname + '/pages'));
app.use("/plugins", express.static(__dirname + '/plugins'));
app.use("/css", express.static(__dirname + '/css'));
app.use("/assets", express.static(__dirname + '/assets'));
app.use("/admin", express.static(__dirname + '/admin'));
app.use("/js", express.static(__dirname + '/js'));
// FIN DECLARATION D'UTILISATION DES FICHIERS STATIQUES

// Dans cette partie, nous déclarons pour chacun de nos fichiers HTML, les routes qui correspondent.
// De plus, nous ajoutons les variables de session à notre variable sess (déclaré au dessus) afin d'avoir 
// accès aux données de l'utilisateur 
app.get('/',function(req,res){
  sess=req.session;
  res.sendFile(__dirname + '/index.html');
});
app.get('/index.html',function(req,res){
  sess=req.session;
  res.sendFile(__dirname + '/index.html');
});
app.get('/admin',function(req,res){
  sess=req.session;
  res.sendFile(__dirname + '/admin/login.html');
});

// les commentaires font parti de la partie admin. Nous avons rajouté une variable de connexion 
// à la partie admin qui nous permet de savoir si l'utilisateur s'est connecté ou pas. Un exemple serait 
// de sécuriser d'avantage la partie admin par exemple en cryptant le mot de passe (qui ne l'est pas pour le 
// moment) 
app.get('/admin/lescommentaires',function(req,res){
  sess=req.session;
  if(sess.userid)
  {
  	res.sendFile(__dirname + '/admin/commentaires.html');
  }
  else
  {
  	res.sendFile(__dirname + '/admin/login.html');
  }
});
// Les liens font aussi parti de la partie admin donc les conditions d'accès sont les mêmes. 
app.get('/admin/lesliens',function(req,res){
  sess=req.session;
  if(sess.userid)
  {
  	res.sendFile(__dirname + '/admin/liens.html');
  }
  else
  {
  	res.sendFile(__dirname + '/admin/login.html');
  }
});
app.get('/admin/documentation',function(req,res){
  sess=req.session;
  if(sess.userid)
  {
  	res.sendFile(__dirname + '/admin/documentation.html');
  }
  else
  {
  	res.sendFile(__dirname + '/admin/login.html');
  }
});

app.get('/admin/logout',function(req,res){
  req.session.destroy();
  res.sendFile(__dirname + '/admin/login.html');
});

app.get('/admin/lesmessages',function(req,res){
  sess=req.session;
  if(sess.userid)
  {
  	res.sendFile(__dirname + '/admin/boite.html');
  }
  else
  {
  	res.sendFile(__dirname + '/admin/login.html');
  }
});
app.get('/admin/laccueil',function(req,res){
  sess=req.session;
  if(sess.userid)
  {
  	res.sendFile(__dirname + '/admin/administration.html');
  }
  else
  {
  	res.sendFile(__dirname + '/admin/login.html');
  }
});
// Ici, nous traitons un formulaire grâce à la méthode post. Nous utilisont les requêtes pour avoir accès aux données de 
// l'utilisateur dans la BDD. 
app.post('/admin/traitement', function(req,res){
	sess=req.session;
// la variable config est un tableau des données de connexion à la BDD (voir au dessus l'objet config). Une fois que la 
// connexion est établie, nous effectuons notre requête dans une fonction ainsi que les instructions souhaités. Ici, 
// nous avons selectionné dans la BDD le nom d'utilisateur et le mdp correspondant aus données validés dans le formulaire 
// de login. Ensuite nous avons redirigé l'utilisateur soir dans l'administration si les logins sont corrects, soit 
// a nouveau dans le login.
	if(sess.userid) 
	{
		res.sendFile(__dirname + '/admin/administration.html');
	}
	else
	{
	pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM login WHERE username = ($1) AND mdp = ($2)",[req.body.username,req.body.mdp], function(err, rows){
					 if(rows['rowCount'] > 0)
					 {
					 	sess.userid = req.body.username;
					 	res.sendFile(__dirname + '/admin/administration.html');
					 }
					 else
					 {
					 	res.sendFile(__dirname + '/admin/login.html');
					 }
					 client.end();
				}); 
		  });
	}
});

app.post('/admin/traiter', function(req,res){
	console.log(req.body.nomutilisateur);
	pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM login WHERE username = ($1) AND mdp = ($2)",[req.body.nomutilisateur,req.body.oldpw], function(err, rows){
				if(rows['rowCount'] > 0)
					{
					 	if(req.body.oldpw == rows['rows'][0].mdp)
					 	{
					 		if(req.body.newpw == req.body.c_newpw)
					 		{
					 			if(req.body.oldpw != req.body.c_newpw)
					 			{
						 			client.query("UPDATE login SET mdp = ($1) WHERE username = ($2)",[req.body.newpw,req.body.nomutilisateur], function(err){
						 				if(err)
						 				{
						 					console.log(err)
						 				}
						 				else
						 				{
						 					console.log('mdp a ete changé');
						 					client.end();
						 				}
						 			});
							 	}
							 	else
							 	{
							 		console.log("les mdp sont déjà les mêmes");
							 	}
							}
							else
							{
								console.log("le nouveau mdp est ambigu");
							}
						 }
						 else
						 {
						 	console.log("vous avez rentré le mauvais mdp");
						 }
						res.sendFile(__dirname + '/admin/administration.html');
					 }
					 else
					 {
					 	console.log("Soit le mdp, soit le nom d'utilisateur n'est pas correct")
					 	res.sendFile(__dirname + '/admin/administration.html');
					 }
				}); 
		  });
});
// OpenWeatherMAp : nous récupérons les données MTO grâce à cette fonction. Nous déclarons d'abord 
// la fonction suivante qui nous permettra de récupérer un tableau JSON  qui se trouve dans l'URL souhaîté. 
// Nous pourrons ensuite utiliser ce tableau et les sockets pour renvoyer un résultat au client. 
var openweathermeteo = function(url, callback){
	
	request(url, function(err, response, body){
		try{
			var result = JSON.parse(body);
			  		
			callback(null, result);
		}catch(e){
			callback(e); 
		}
	});
}

// Quand un client se connecte, on lui envoi les infos de la page principale. C'est à dire d'abord les données MTO.
// L'instruction suivante indique que les événements se passeront lorsqu'un client se connecte au serveur. 
// Tous nos événements doivent être à l'intérieur de cette fonction. (socket.on et socket.emit).
io.sockets.on('connection', function (socket) {
// On appelle la fonction MTO avec l'URL correspondante
	openweathermeteo('http://api.openweathermap.org/data/2.5/weather?q=montreuil,fr', function(err, result){
		if(err) return console.log(err);
// On inclut ces données dans une variable que nous retransmettrons aux clients à travers les sockets. 
		var mto = [];
		mto['temp'] = result['main']['temp'];
		mto['desc'] = result['weather'][0].description;
		console.log(mto['desc']);
// L'instruction socket.emit permet d'envoyer des données ou des messages aux clients. La syntaxe est la 
// suivante : socket.emit('nom_evenement','variable ou message associé'). Voir les sockets.emit de la page comme
// exemple :
		socket.emit("meteo", {temperature : mto['temp'], description : mto['desc']});
	});

// Les instructions suivantes permettent de récupérer les messages du slider dans la BDD afin de les afficher. Après avoir 
// déclaré un tableau, nous allons effectuer une requête afin de récupérer les messages qu'il faut afficher. 
		var messages_affiche = [];
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM messages WHERE slider = true", function(err, rows){
// push(rows) sert à rajouter les résultats de la requête (qui sont dans rows) dans notre tableau.
					messages_affiche.push(rows);
// Un autre exemple du socket.emit, ici avec les résultats d'une requête
					socket.emit("messages_affiches", messages_affiche[0].rows);
// Il ne faut jamais oublier de fermer la connexion à la BDD. Sinon l'application ne fonctionnera pas 
// correctement. 
					 client.end();
				}); 
		  });

// Nous faisons le même type de fonction pour récupérer les liens afin de les afficher sur la page d'accueil 
// du dashboard. 
		var liens_affiches = [];
		pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM liens", function(err, rows){
					liens_affiches.push(rows);
// Il est intéressant de faire des console.log afin de tester les variables. Cela vous permet de vous assurer 
// que vous récupérez la bonne valeur. En le faisant au fur et à mesure, l'application devient plus facile à debugger. 
					socket.emit("liens_affiches", liens_affiches[0].rows);
					 client.end();
				}); 
		  });

// Lors de la connexion, nous effectuons une requête afin d'avoir tous les commentaires. 
	pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM commentaires", function(err, rows){
					if(err)
					{
						console.log(err);
					}
					var commentaires = [];
					commentaires.push(rows);
// Envoi des commentaires au client :
					socket.emit("commentaires", commentaires[0].rows);
					client.end();
				});
		  });

// Lors de la connexion, nous effectuons une requête afin d'avoir tous les commentaires. 
	pg.connect(config, function(err, client, done) {
			if (err)
				console.log(err); 
			else 
				client.query("SELECT * FROM info WHERE id=1", function(err, rows){
					if(err)
					{
						console.log(err);
					}
					var infos = [];
					infos.push(rows);
// Envoi des commentaires au client :
					socket.emit("infos", infos[0].rows);
					client.end();
				});
		  });

// Après avoir envoyé toutes les informations lors de la connexion au serveur, nous devons définir et créer les 
// événements de notre application. Ces événements vont ensuite nous permette de manipuler tout le site.

// socket.on permet de traiter un événement. Lorsque l'événement "new_comment" est validé par le client, nous 
// utilisons une fonction qui la traîte. Ici, lorsque l'utilisateur veut rajouter un commentaire sur le dashboard, 
// nous devons l'insérer dans la BDD.
	socket.on("new_comment", function (data){
		pg.connect(config, function(err, client, done) {
// Prennez l'habitude d'afficher vos erreurs dans le log afin de mieux débugger l'application. (voir instruction if 
// suivante).
			if (err)
				console.log(err); 
			else 
// INSERT INTO : syntaxe SQL postgre
				client.query('INSERT INTO commentaires(comm) VALUES($1)', [data], function(err){
					console.log(err);
					client.end();
				}); 
		  });
	});

// Même chose pour les liens. Lorsque l'utilisateur veut rajouter un lien, il faut l'insérer dans la BDD. Nous 
// devons donc créer un événement pour effectuer la requête au moment ou le client en a besoin 
	socket.on('new_link', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
			}
			else 
			{
				client.query('INSERT INTO liens(lien, lienlabel, description) VALUES($1,$2, $3)',[
					data['link'], data['label'], data['desc']], function(err){
					console.log(err);
					client.end();
				});
			}
		  });
	});

// L'utilisateur peut aussi supprimer un commentaire dans la partie admin. Il faut donc recevoir cet événement 
// et le traîter.
	socket.on('supprimer_commentaires', function (data){
// Connexion à la BDD :
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
				client.end();
			}
// Si il n'y a pas d'erreur, nous supprimons le commentaire de la BDD. Sinon nous affichons l'erreur dans la 
// console et nous fermons la connexion à la BDD. Autre exercice : voir à quel moment nous devont fermer la 
// connexion à la BDD. Est-elle automatique lorsqu'il y a une erreur ou est ce que l'instruction client.end est 
// nécessaire ici ? 
			else 
			{
				for(var i = 0; i < data.length; i++)
				{
					client.query('DELETE FROM commentaires WHERE id ='+data[i], function(err){
						console.log(err);
						client.end();
					}); 
				};
// Ici nous avons un exemple de socket.emit qui ne renvoi qu'un message. Cet événement nous permet de faire 
// un reload de la page afin que les commentaires qui ont été supprimés ne soient pas affichés
				socket.emit("reload", "reload");
			}
		  });
	});

		socket.on('supprimer_message', function (data){
			console.log(data);
// Connexion à la BDD :
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
			}
			else 
			{
				for(var k = 1; k < data.length; k++)
				{
					client.query('DELETE FROM messages WHERE messages.id ='+data[k], function(err){
						console.log(err);
						client.end();
					}); 
				};
			socket.emit("reload", "reload");
			}
		  });
	});

// Nous pouvons aussi supprimer un lien dans la partie admin. 
	socket.on('supprimer_liens', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
				client.end();
			}
			else 
			{
				for(var i = 0; i < data.length; i++)
				{
					client.query('DELETE FROM liens WHERE id ='+data[i], function(err){
						console.log(err);
						client.end();
					}); 
				};
// Ici nous avons un exemple de socket.emit qui ne renvoi qu'un message. Cet événement nous permet de faire 
// un reload de la page afin que les commentaires qui ont été supprimés ne soient pas affichés. Nous 
// utilisons ce message lorsqu'on supprime un élément de la BDD. 
				socket.emit("reload", "reload");
			}
		  });
	});
	socket.on("changer_titre", function (data){
		pg.connect(config, function(err, client, done) {
// Prennez l'habitude d'afficher vos erreurs dans le log afin de mieux débugger l'application. (voir instruction if 
// suivante).
			if (err)
				console.log(err); 
			else 
// UPDATE : syntaxe SQL postgre
				client.query('UPDATE info SET titre = ($1) WHERE id=1', [data], function(err){
					console.log(err);
					client.end();
				}); 
				socket.emit("reload", "reload");
		  });
	});

	socket.on("changer_formation", function (data){
		pg.connect(config, function(err, client, done) {
// Prennez l'habitude d'afficher vos erreurs dans le log afin de mieux débugger l'application. (voir instruction if 
// suivante).
			if (err)
				console.log(err); 
			else 
// UPDATE : syntaxe SQL postgre
				client.query('UPDATE info SET formation = ($1) WHERE id=1', [data], function(err){
					console.log(err);
					client.end();
				}); 
		  });
	});

	socket.on("changer_projets", function (data){
		pg.connect(config, function(err, client, done) {
// Prennez l'habitude d'afficher vos erreurs dans le log afin de mieux débugger l'application. (voir instruction if 
// suivante).
			if (err)
				console.log(err); 
			else 
// UPDATE : syntaxe SQL postgre
				client.query('UPDATE info SET projets = ($1) WHERE id=1', [data], function(err){
					console.log(err);
					client.end();
				}); 
		  });
	});

	socket.on("changer_prix", function (data){
		pg.connect(config, function(err, client, done) {
// Prennez l'habitude d'afficher vos erreurs dans le log afin de mieux débugger l'application. (voir instruction if 
// suivante).
			if (err)
				console.log(err); 
			else 
// UPDATE : syntaxe SQL postgre
				client.query('UPDATE info SET prix = ($1) WHERE id=1', [data], function(err){
					console.log(err);
					client.end();
				}); 
		  });
	});

	socket.on("changer_essaimages", function (data){
		pg.connect(config, function(err, client, done) {
// Prennez l'habitude d'afficher vos erreurs dans le log afin de mieux débugger l'application. (voir instruction if 
// suivante).
			if (err)
				console.log(err); 
			else 
// UPDATE : syntaxe SQL postgre
				client.query('UPDATE info SET essaimages = ($1) WHERE id=1', [data], function(err){
					console.log(err);
					client.end();
				}); 
		  });
	});

	socket.on("changer_partenaires", function (data){
		pg.connect(config, function(err, client, done) {
// Prennez l'habitude d'afficher vos erreurs dans le log afin de mieux débugger l'application. (voir instruction if 
// suivante).
			if (err)
				console.log(err); 
			else 
// UPDATE : syntaxe SQL postgre
				client.query('UPDATE info SET partenariats = ($1) WHERE id=1', [data], function(err){
					console.log(err);
					client.end();
				}); 
		  });
	});

// Nous devons pouvoir rajouter un message au slider car les informations ne sont pas toujours les mêmes.
	socket.on('nouveau_message', function (data){
		pg.connect(config, function(err, client, done) {
			if (err)
			{
				console.log(err); 
			}
			else 
			{
				client.query('INSERT INTO messages(title, message, nom, prenom, slider, the_date) VALUES($1,$2,$3,$4,$5,$6)',[
					data['titre'], data['message'], data['nom'], data['prenom'], data['slider'], data['the_date']], function(err){
					console.log(err);
					client.end();
				}); 
			}
		});
		socket.emit("confirmation_nouveau_message", "Le message à été enregistré");
	});
});

// Les événements emis (socket.emit) sont reçus par (sockets.on) ayant le même nom. Cette syntaxe est utilisable 
// non seulement du côté serveur mais aussi du côté client.