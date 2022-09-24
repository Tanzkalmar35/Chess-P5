$("#SetFen").click(function () {
	var fenStr = $("#fenIn").val();	
	ParseFen(START_FEN);
	printBoard();
	searchPosition();
});