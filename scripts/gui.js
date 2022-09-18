$("#SetFen").click(function() {
    var fenString = $("#fenIn").val();
    parseFen(fenString);
    printBoardToConsole();
    //searchPosition();
    perftTest(5);
});