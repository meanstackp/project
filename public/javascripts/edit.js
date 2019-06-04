$(document).ready(function(){
	//alert("hi");
	$('.delete').click(function(){
		//alert.clicked;
		var id=$(this).val();
		alert(id);
		$.post("/Remove",{no:id},function(data){
			location.reload('/');

		});
	});
	$(".edit").click(function(){
		var id=$(this).val();
		alert(id);
		$.post("/edit",{no:id},function(data){
			var a=JSON.stringify(data);
			var parseddata=JSON.parse(a);
			//alert(parseddata[0].firstname);
			$("#id").val(parseddata[0]._id);
			$("#fname").val(parseddata[0].firstname);
			$("#lname").val(parseddata[0].lastname);
			$("#mail").val(parseddata[0].email);

		});
		$(".dontshow").show();
	});
});