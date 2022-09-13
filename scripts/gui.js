$("#SetFen").click(function() {
    var fenString = $("#fenIn").val();
    try {
        parseFen(fenString);
        printBoardToConsole();

    } catch (error) {
        console.log(error);
    }
})