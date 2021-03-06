$( document ).ready(function() {

  //Scroll down to search area on click
  var scrollDown = function() {
    $('#topSearch').click(function(){
      var offset = $(this).offset();
      offset.top += 500;
      $('html, body').animate({
        scrollTop: offset.top,
      });
    });
  };
  scrollDown();

  //Dynamically generate dropdown menu by state
  var byStates = function() {
    for (var key in states) {
      $('<option>').val(key).text(states[key]).appendTo('#state');
    }
  };

  //Dynamically generate program and sub program drop down menu
  var resetLevelTwo = function () {
    $('#levelTwo').html(""); // clears out the existing stuff
    $('<option>').text("Select Sub Category").val("").appendTo('#levelTwo'); //Create header and add to top of list
    $('<option>').text("All").val("").appendTo('#levelTwo'); //Create All option and add to top of list
  };

  var resetLevelThree = function () {
    $('#levelThree').html(""); // clears out the existing stuff
    $('<option>').text("Select Sub Category").val("").appendTo('#levelThree'); //Create header and add to top of list
    $('<option>').text("All").val("").appendTo('#levelThree'); //Create All option and add to top of list
  };

  var byProgram = function() {
    for (var levelOneName in programCip) { //Loop through first element of obj
      var cip      = programCip[levelOneName].cip; //Defines cip of levelone programs
      var $newElem = $('<option>'); //Create new option elem
      $newElem.text(levelOneName).data("cip", cip); //Give new elem the text of level one name and data of matching cip
      $newElem.appendTo('#levelOne'); //Append newelem to dropdown menu
    }

    $('#levelOne').change(function(){ //Detects change in lvl 1 menu
      resetLevelTwo(); //Resets level2 and 3
      resetLevelThree();
      var levelOneChoice = $('#levelOne').val(); //Stores lvl1 choice in var
      if (levelOneChoice === 'All') { return false; } //Stops function is level 1 is all

      var levelTwo = programCip[levelOneChoice].sub; //set lvl2 as sub of lvl1 choice
      for (var levelTwoName in levelTwo) {
        var cip      = levelTwo[levelTwoName].cip;
        var $newElem = $('<option>');
        $newElem.text(levelTwoName).data("parent", levelOneChoice).data("cip", cip);
        $newElem.appendTo('#levelTwo');
      }
    });

    $('#levelTwo').change(function(){
      resetLevelThree();
      var levelTwoChoice = $('#levelTwo').val();
      if (levelTwoChoice === 'All') { return false; }

      var levelOneChoice = $('#levelTwo option:selected').data("parent");
      var levelThree     = programCip[levelOneChoice].sub[levelTwoChoice].sub;
      for (var levelThreeName in levelThree) {
        var cip      = levelThree[levelThreeName].cip;
        var $newElem = $('<option>');
        $newElem.text(levelThreeName).data("cip", cip);
        $newElem.appendTo('#levelThree');
      }
    });
  };

  // Getting unique CIP for search field
  var extractInput = function () {
    var params = {};

    // get the state
    params["s"] = $('#state').val(); //AK

    // get program cip
    var $levelOne   = $('#levelOne');
    var $levelTwo   = $('#levelTwo');
    var $levelThree = $('#levelThree');

    var progLvlOneCip   = $levelOne.val()   ? programCip[$levelOne.val()].cip : ""; //Check if has value
    var progLvlTwoCip   = $levelTwo.val()   ? programCip[$levelOne.val()].sub[$levelTwo.val()].cip : "";
    var progLvlThreeCip = $levelThree.val() ? programCip[$levelOne.val()].sub[$levelTwo.val()].sub[$levelThree.val()].cip : "";

    params["p"] = progLvlThreeCip || progLvlTwoCip || progLvlOneCip; //Select lowest cip level for search

    return params;
  };

  // Compose query string
  var querifyObject = function (obj) {
    var queryStr = "";

    for (var key in obj) {
      if (obj[key]) { //If selected & has key
        queryStr += key + "=" + obj[key] + "&";
      }
    }
    return queryStr;
  };

  //To rank colleges by selected params
  var rankByParam = function() {
    var params    = extractInput();
    var queryStr  = querifyObject(params)

    location.href = "/home?" + queryStr;
  };

  //Initialise functions
   var init = function () {
    $('#search').click(rankByParam); //Ranking function on click
    byStates();
    byProgram();
    };
  if(window.location.search != ""){ //Scroll to main section after search
    window.scrollTo(0, $('#main').offset().top);
  }

  init();

}); //End of doc ready func
