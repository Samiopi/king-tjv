
	const Discord = require("discord.js");
	const low = require("lowdb");
	const FileSync = require("lowdb/adapters/FileSync")
	const shopadapter = new FileSync(`shop.json`);
	const shopdb = low(shopadapter);
	const adapter = new FileSync("datatbase.json")
	const db = low(adapter)
	db.defaults({ histoires: [], xp: [], inventory: []}).write()
	var bot = new Discord.Client();
	var prefix = ("/");
	var randnum = 0
	var storynumber = db.get("histoires").map("story_value").value();
	var a = ("Administrer")
	var f = ("Fortnite")

	bot.on("ready", () => {
		bot.user.setPresence({ game: { name: a}})
		console.log("Robot Prêt!");
	});
	bot.login("NDM4MDExMDQ2NzE2ODk5MzM4.DcZ1iQ.QBT-XcO83_gqdSn6LcIKAmP01qY");

	bot.on("guildMemberAdd", member => {
		let role = member.guild.roles.find("name", "Joueur");
		member.guild.channels.find("name", "général").send(`:wave: ${member.user.username} vient de joindre la famille des kings! :wink:`)
		member.addRole(role)
	})

	bot.on("guildMemberRemove", member =>{
		member.guild.channels.find("name", "général").send(`:cry: ${member.user.username} vient de quitter la famille, ce n'est qu'un aurevoir...`);
	})

	bot.on("message", message => {

		var msgauthor = message.author.id;

		if(message.author.bot)return;

		if(!db.get("inventory").find({user: msgauthor}).value()){
			db.get("inventory").push({user: msgauthor, item: "Vide"}).write();
	

		if(!db.get("xp").find({user: msgauthor}).value()){
			db.get("xp").push({user: msgauthor, xp: 1}).write();
		}else{
			var userxpdb = db.get("xp").filter({user: msgauthor}).find("xp").value();
			console.log("userxpdb");
			var userxp = Object.values(userxpdb)
			console.log("userxp");
			console.log(`Nombre d'xp : ${userxp[1]}`)

			db.get("xp").find({user: msgauthor}).assign({user: msgauthor, xp: userxp[1] += 1}).write();

		}}

		if (message.content === "ping"){
			message.reply("pong");
			console.log("ping pong");
		}
		if (message.content === prefix + "help"){
		var help_embed = new Discord.RichEmbed()
			.setColor("#23FE01")
			.addField("Commande du bot!", " -/help : Affiche les commande du bot \n -/newstory (votre histoire): Le bot va enregistrer votre histoire dans la base de données \n -/tellstory: Le bot va vous raconter un histoire de la base de données \n -/xpstat: Le bot affiche votre nombre d'xp sur le serveur \n -/kick (identfiant de la personne): Le bot va kick la personne \n -/ban (identifiant de la personne): Le bot va ban la personne")
			.addField("Interaction", "-ping : Le bot répond pong \n -Comment vas-tu?: Le bot répond une réponse aléatoire")
			.setFooter("Voilà la fin des commandes! :)")
		message.channel.sendEmbed(help_embed);
		//message.channel.sendMessage("Voici les commandes du bot :\n -/help pour afficher les commandes");
		console.log("help");
		}
		
		if (message.content === prefix + "xpstat"){
			var xp = db.get("xp").filter({user: msgauthor}).find(`xp`).value()
			var xpfinal = Object.values(xp);
			var xp_embed = new Discord.RichEmbed()
				.setTitle(`XP de ${message.author.username}`)
				.setDescription("Voici tout vos XP monsieur!")
				.addField("XP :", `${xpfinal[1]} XP`)
				.setColor("#23FE01")
			message.channel.send(xp_embed);
		}


	if (message.content === "Comment vas-tu?"){
		random();
		
		if (randnum == 0){
			message.reply("SUPER!")
			console.log("randnum0")
		}

		if (randnum == 1){
			message.reply("Merci je vais très bien!")
			console.log("randnum1")
		}
		if (randnum == 2){
			message.reply("Non je ne vais pas très bien mais merci de vous souciez de moi!")
			console.log("randnum2")
		}
		if (randnum == 3){
			message.reply("BOF!")
			console.log("randnum3")
		}
	}

		if (!message.content.startsWith(prefix)) return;
		var args = message.content.substring(prefix.length).split(" ");

	switch (args[0].toLowerCase()){

		case "newstory":
		var value = message.content.substr(10);
		var author = message.author.toString();
		var number = db.get("histoires").map("id").value();
		//var storyid = number + 1;
		console.log(value);
		message.reply("Ajout de l'histoire à la base de données")

		db.get("histoires")
			.push({ story_value: value, story_author: author})
			.write();

		break;

		case "tellstory" :

		console.log(randnum);
		var story = db.get(`histoires[${randnum}].story_value`).toString().value();
		var author_story = db.get(`histoires[${randnum}].story_author`).toString().value();

		message.channel.send(`Voici l'histoire : ${story} (Histoire de ${author_story})`)
		break;

		case "kick":

		if (!message.channel.permissionsFor(message.member).hasPermission("KICK_MEMBERS")){
			message.reply("Tu n'as pas le droit de kick!")
		}else{
			var memberkick = message.mentions.users.first()
			if (!memberkick){
				message.reply("Ce joueur n'éxiste pas!");
			}else{
				if (!message.guild.member(memberkick).kickable){
					message.reply("Joueur impossible à kick!");
				}else{
					message.guild.member(memberkick).kick().then((member) => {
					message.channel.send(`${member.displayName} a été kick! Dommage...`);
				}).catch(() => {
					message.channel.send("Kick refusé!")
				})
			}
		}

		break;

	}
	case "shop":
	var shop_embed = new Discord.RichEmbed()
		.setTitle("TJV Shop - Liste Des Articles")
		.setDescription("Salut, voici le TJV Shop. Ici, tu trouveras des items et des badges à acheter!")
		.addField("Items:", "Frite du bot [20XP] [ID: item1A] Description: Voilà une frite délicieusement électrifier!")
		.setColor("#F20000")

	message.channel.send({embed: shop_embed});
	break;

	case "buyitem":

		var itembuying = message.content.substr(9);
		if (!itembuying){
			itembuying = "Indeterminé!";
		}else{
			console.log(`ShopLogs: Demande d'achat d'item (${itembuying})`)
			if (shopdb.get("shop_items").find({itemID: itembuying}).value()){
				console.log("Item trouvé")
				var info = shopdb.get("shop_items").filter({itemID: itembuying}).find("name", "desc").value();
				var iteminfo = Object.values(info)
				console.log(iteminfo)
				var buy_embed = new Discord.RichEmbed()
					.setTitle("TJV Shop - Facture D'achat")
					.setDescription("Attention, liser bien cette facture on ne sait jamais! *Merci de votre achat*")
					.setColor("#F20000")
					.addField("Infos", `*ID:* ***${iteminfo[0]}***\n*Nom:* ***${iteminfo[1]}***\n*Description:* ***${iteminfo[2]}***\n*Prix:* ***${iteminfo[3]}***`)
				message.author.send({embed: buy_embed});

				var useritem = db.get("inventory").filter({user: msgauthor}).find("items").value();
				var itemdb = Object.values(useritem);
				var userxpdb = db.get("xp").filter({user: msgauthor}).find("xp").value();
				var userxp = Object.values(userxpdb);

				if (userxp[1] >= iteminfo[3]){
					message.reply(`***Information:*** Votre achat (${iteminfo[1]}) a été accepté. Retrait de ${iteminfo[3]} XP`)
						if (!db.get("inventory").filter({user: msgauthor}).find({items: "Vide"}).value()){
							console.log("Inventaire Pas Vide!")
							db.get("xp").filter({user: msgauthor}).find("xp").assign({user: msgauthor, xp: userxp[1] -= iteminfo[3]}).write();
							db.get("inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: itemdb[1] + " , " + iteminfo[1]}).write();
						}else{
							console.log("Inventaire Vide!");
							db.get("xp").filter({user: msgauthor}).find("xp").assign({user: msgauthor, xp: userxp[1] -= iteminfo[3]}).write();
							db.get("inventory").filter({user: msgauthor}).find("items").assign({user: msgauthor, items: iteminfo[1]}).write();
						}

						
				}else{
					message.reply("Erreur! Achat impossible, nombre d'XP insufisant");
				}

				}
			}
		

	break;	

	case "ban":

		if (!message.channel.permissionsFor(message.member).hasPermission("BAN_MEMBERS")){
			message.reply("Tu n'as pas le droit de ban!")
		}else{
			var memberban = message.mentions.users.first()
			if (!memberban){
				message.reply("Ce joueur n'éxiste pas!");
			}else{
				if (!message.guild.member(memberban).bannable){
					message.reply("Joueur impossible à ban");
				}else{
					message.guild.member(memberban).kick().then((member) => {
					message.channel.send(`${member.displayName} a été ban! Dommage...`);
				}).catch(() => {
					message.channel.send("Ban refusé!")
				})
			}
		}

		break;


	}

function random(min, max){
	min= Math.ceil(0);
	max= Math.floor(3);
	randnum = Math.floor(Math.random() * (max - min + 1) + min);
}}})
