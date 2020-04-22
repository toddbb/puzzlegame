//*** NOTES
// 1) DONE: need to allow drag/drop on mobile
// 2) include pop-up when user achieves 1-15 sequence (compare array[1,2,3,4...])
// 3) user should be able to move multiple cells at one time (just like the real game)
// 4) TEST: if game-init equals 1,2,3...15, include a pop-up indicating automatic winner and probability of that happening
// 5) disable zoom
// 6) Instruction modal and (?) button

window.onload = function () {
  initGame();  
};

/******** EVENTS ************/
$('.btn-reset').on('click', function() {
  resetDragDrop();
  initGame();
});

$('.btn-test').on('click', function() {
    setContain(2).right();
});



//*********  INITIALIZE GAME ***************//
function initGame() {
  var emptyCell = -1;
  
  //strip cells of all style classes for "new game"
  $(".cell").removeClass("empty red white");  
  
  //create random array of 16 numbers (0-15)  
  var arrRandom = [];
  while(arrRandom.length < 16){
    var r = Math.floor(Math.random() * 16) + 1;
    if(arrRandom.indexOf(r) === -1) arrRandom.push(r);
  }
  
  //add vals and red/white class to each cell from random array
  arrRandom.forEach(function(v,i) {    
    let color = '';    
    (v%2 === 0) ? color='white' : color='red';
    $('#cell-'+i).text(v).addClass(color);
    if (v===16) {
      setCellProperties(i);
    }
  })   
}

//************* FUNCTIONS FOR SETTING DRAG/DROP PROPERTIES ***************///
function setCellProperties (initEmpty) {
  setEmptyCell(initEmpty);
  setSurroundingCells(initEmpty);
  if (initEmpty === $('.cell').length-1) { checkSequence(); }
}





function setEmptyCell (empty) {
  
  $('#cell-'+empty).addClass('empty'); //assign empty class to 16
  $('#cell-'+empty).droppable({
    accept: ".ui-draggable",
    drop: function (event, ui) {
      let currDrop = $(this).attr('id');
      let currDrag = ui.draggable.attr('id');
      swapCells (currDrop, currDrag);
    }
  });
  
}


function setSurroundingCells (currEmpty) {
 
  var axisX = { axis: "x" };  
  var axisY = { axis: "y" };    
  var options = {
    containment: "parent",
    revert: "invalid",
    snap: true,
    snapMode: "inner",
    snapTolerance: 50
  }
  
  
  if ((currEmpty > 3) && (currEmpty < 16)) {
    var cellUp = currEmpty - 4;
    //console.log("up = " + cellUp);
    options.containment = setContain(cellUp).up();
    $("#cell-" + cellUp).draggable(Object.assign(axisY, options)).addClass("movable");
  }
  
  if (((currEmpty + 1) % 4) !== 0) {
    var cellRight = currEmpty + 1;
    //console.log("right = " + cellRight);
    options.containment = setContain(cellRight).right();
    $("#cell-" + cellRight).draggable(Object.assign(axisX, options)).addClass("movable");
  }
  
  if ((currEmpty > -1) && (currEmpty < 12)) {
    var cellDown = currEmpty + 4;
    //console.log("down = " + cellDown);
    options.containment = setContain(cellDown).down();
    $("#cell-" + cellDown).draggable(Object.assign(axisY, options)).addClass("movable");
  }
  
  if ((currEmpty % 4) !== 0) {
    var cellLeft = currEmpty - 1;
    //console.log("left = " + cellLeft);
    options.containment = setContain(cellLeft).left();
    $("#cell-" + cellLeft).draggable(Object.assign(axisX, options)).addClass("movable");
  }
}


//**************************************************************************************//



//**** SET CONTAINER DIMENSIONS FOR DRAGGABLE ELEMENTS BASED ON CURRENT LOCATION  ******///

let setContain = (function (cellId) {
  //collect position and HxW info
  var cellH = $('#cell-' + cellId).outerHeight();
  var cellW = $('#cell-' + cellId).outerWidth();
  var emptyH = $('.empty').outerHeight();
  var emptyW = $('.empty').outerWidth();
  var strStyleCol = $('.game').css("grid-column-gap")
  var colGap = parseInt(strStyleCol.substring(0, strStyleCol.length - 2)); // remove 'px';
  var strStyleRow = $('.game').css("grid-row-gap")
  var rowGap = parseInt(strStyleRow.substring(0, strStyleRow.length - 2)); // remove 'px';
  var posCell = $('#cell-' + cellId).position();
  var posEmpty = $(".empty").position();
  
  return {
    up: function () {
      //console.log("UP............");
      var x1 = posCell.left;
      var y1 = posCell.top;
      var x2 = x1;
      var y2 = y1 + emptyH + rowGap;      
      return [x1, y1, x2, y2];      
    },
    
    right: function () {
      //console.log("RIGHT............");
      var x1 = posEmpty.left;
      var y1 = posEmpty.top;
      var x2 = x1 + colGap + cellW;
      var y2 = y1;      
      return [x1, y1, x2, y2];
    }, 
    down: function () {
      //console.log("DOWN.............");
      var x1 = posEmpty.left;
      var y1 = posEmpty.top;
      var x2 = x2;
      var y2 = y1 + rowGap + cellH;     
      return [x1, y1, x2, y2];
    }, 
    left: function () {
      //console.log("LEFT.............");
      var x1 = posCell.left;
      var y1 = posCell.top;
      var x2 = x1 + colGap + cellW;
      var y2 = y1;
      return [x1, y1, x2, y2];
    }
  }  
});









function resetDragDrop() {
  
  // Reset ui-draggables & class
  for (i=0; i<16; i++) {    
    var draggable = $('#cell-' + i).data("ui-draggable");
    if (draggable) { draggable.destroy(); }
  }
  $( ".cell" ).removeClass("movable")
  
  // Reset ui-droppable & class
  var droppable = $(".cell.empty").data("ui-droppable");
  if (droppable) { droppable.destroy(); };
  $(".cell").removeClass("empty");
  
}


// swap the HTML between the dragged cell and dropped cell
function swapCells (oldDrop, oldDrag) {
  
  resetDragDrop();
  
  let posReset = {
    'position': 'relative',
    'top': '0',
    'left': '0'    
  }  
    
  let divDropped = $('#'+oldDrop)[0].outerHTML;
  let divDragged = $('#'+oldDrag)[0].outerHTML;  
  $('#'+oldDrop).addClass('swap-dropped');
  $('#'+oldDrag).addClass('swap-dragged');
  
  //swap entire HTML
  document.getElementsByClassName('swap-dropped')[0].outerHTML = divDragged;
  document.getElementsByClassName('swap-dragged')[0].outerHTML = divDropped;  
  
  //swap ids back
  var oldElDrop = document.getElementById(oldDrop);
  var oldElDrag = document.getElementById(oldDrag);
  oldElDrop.id = oldDrag;
  oldElDrag.id = oldDrop;
  
  // reset positions to default: top=0, left=0;
  document.getElementById(oldDrop).style = posReset;
  document.getElementById(oldDrag).style = posReset;      
  
  var newEmpty = oldDrag.slice(5-(oldDrag.length));  //only pass the cell id number at end
  
  setCellProperties (parseInt(newEmpty));
  
}




/**********   CHECK IF SEQUENCE COMPLETED *******************/
function checkSequence() {
  var totalCells = $('.cell').length;
  console.log("Total Cells = " + totalCells);
  for (i=0; i<totalCells; i++) {
    var n = i+1;
    var match = false;
    if ($("#cell-" + i).text() === n.toString()) {
      console.log("cell-" + i + " = " + n);
      match = true;
    } else {
      match = false;
      i = 10000;
      break;
    }
  }
  
  console.log(match);
  if (match) { winner ()};
  
}

function winner () {
  alart("You won!!!");
}