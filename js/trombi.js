// A faire disparaitre en fonction du click
var first_content = document.getElementById("first_content"); 
var second_content = document.getElementById("second_content"); 
var delete_student = document.getElementById("delete_student");
var confirm_delete = document.getElementById("confirm_delete");
var add_student = document.getElementById("add_student");
var checkbox = document.getElementsByClassName("checkbox");

// les éléments de click
var promos = document.getElementsByClassName("btn btn-primary btn-lg active");

// Clicks sur les classes de promo
for (var i=0; i < promos.length; i++) 
	{
	  promos[i].onclick = function()
	  {
	  	first_content.style.display = "none";
	  	second_content.style.display = "inline-block";
	  }
	}

$('#nouvelle_promotion').click(function(){
		$('#window').show(); 
});

$('#nouvelle_promo_close').click(function(){
		$('#window').hide(); 
});

$('#nouvel_eleve_close').click(function(){
		$('#add_student').hide(); 
});

$('#add_student_button').click(function(){
		$('#add_student').show(); 	
});

delete_student.onclick = function(){
	for (var i = checkbox.length - 1; i >= 0; i--) 
	{
		if(checkbox[i].style.display == "none")
		{
		    checkbox[i].style.display = "block";
		    confirm_delete.style.display="block";
		}
		else
		{
			checkbox[i].style.display = "none";
			confirm_delete.style.display="none";
		}
	};
}	