// A faire disparaitre en fonction du click
var first_content = document.getElementById("first_content"); 
//var bouton_delete_message = document.getElementById("delete_message");
//var checkbox = document.getElementsByClassName("checkbox");
//var affichage = document.getElementById("modif_affichage");
//var le_message = document.querySelectorAll(".le_message");

// les éléments de click

$("#bouton_ajout_formulaire").click(function(){
	$("#formulaire_nouveau_message").show();
});

$("#nouveau_message_close").click(function(){
	$("#formulaire_nouveau_message").hide();
});

// Supprimer un message
// bouton_delete_message.onclick = function(){
// 	for (var i = checkbox.length - 1; i >= 0; i--) {
// 		if(checkbox[i].style.display == "none")
// 		{
// 			checkbox[i].style.display = "block";
// 		}
// 		else
// 		{
// 			checkbox[i].style.display = "none";
// 		}
// 	};
// }

// Modifier l'affichage
// affichage.onclick = function(){
// 	for (var i = checkbox.length - 1; i >= 0; i--) {
// 		if(checkbox[i].style.display == "none")
// 		{
// 			checkbox[i].style.display = "block";
// 		}
// 		else
// 		{
// 			checkbox[i].style.display = "none";
// 		}
// 	};
// }

// for (var j = 0; j < le_message.length - 1; j++) 
// {
// 	le_message[j].onclick = function(){
//  		if(formulaire_nouveau_message.style.display == "none")
//  		{
//  			formulaire_nouveau_message.style.display = "block";
//  		}
//  		else
//  		{
//  			formulaire_nouveau_message.style.display = "none";
//  			//le_message[i].style.backgroundColor = "white";
//  		}
// 	}
// };