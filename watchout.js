

/*******************************************************************
 * Returns a random location on SVG canvas
 ******************************************************************/
function getRandomLocation() {
  var x = Math.random() * (parseInt(window.innerWidth) - 40) + 20;
  var y = Math.random() * (parseInt(window.innerHeight)- 40) + 20;
  return [x, y];
}

/*******************************************************************
 * Takes a number 'n'
 * Returns an array of 'n' random location on SVG canvas
 ******************************************************************/
function getNRandomLocations(n){
  var newPositions = [];

  for(var i=0; i<n; i++){
    newPositions[i]=getRandomLocation();
  }
  return newPositions;
}

/*******************************************************************
 * Randomly moves 'enemy' circles
 ******************************************************************/

function randomMoves () {
  var data = getNRandomLocations(numberOfEnemies);

  d3.selectAll('.enemy')
    .transition()
    .delay(function (d,i){ return i / 500;})
    .duration(2000)
    .attr('cx', function(prevX, index) { return data[index][0]; })
    .attr('cy', function(prevY, index) { return data[index][1]; });
}
/*******************************************************************
 * Returns true if there is a collision
 ******************************************************************/
function collisionDetected(id){
// // select 'enemy'
//   //get cx, cy for each ->store in array of array
// //select 'player'
//   // get cx cy ->store in array

// // if player cx,cy+/- radius is a subset of enemy position array
//   // return true 

// // (enemy.cx - player.cx)^2 + (enemy.cy - player.cy)^2 < (enemeye +dsred.seay.l
  var enemies = d3.selectAll('.enemy')[0];
  var dx, dy, dr;
  
  var player = d3.select('#'+id);
  var px = parseInt(player.attr('cx'));
  var py = parseInt(player.attr('cy'));
  
  for (var i = 0; i < enemies.length; i++) {
    dx = parseInt(enemies[i].attributes.cx.nodeValue) - px;
    dy = parseInt(enemies[i].attributes.cy.nodeValue) - py;
    dr = parseInt(enemies[i].attributes.r.nodeValue) + 10;
    if (dx*dx + dy*dy < dr*dr) {
      return [id,enemies[i].attributes.cx.nodeValue,enemies[i].attributes.cy.nodeValue];
      // return true;
    }
  }
  return false;
}

/*******************************************************************
 * Updates Player Current Score and High Scores
 ******************************************************************/

function resetScore(){

  //Reset clock
  start=Date.now();

}

/*******************************************************************
 * Move Pacman every second
 ******************************************************************/
 function movePacman(){
  var moveTo, removeCX, removeCY;
  
  setInterval(function(){
    moveTo = getRandomLocation();
    d3.select("#pacman")
      .transition()
      .ease('elastic')
      .duration(500)
      .attr("cx", moveTo[0])
      .attr("cy", moveTo[1]);

    // Make pacman 'eat' enemies
    var col = collisionDetected('pacman');
    
    if (col[0]==='pacman'){
      removeCX=col[1];
      removeCY=col[2];

    d3.selectAll('.enemy')
      .filter(function(d){return this.attributes.cx.nodeValue == removeCX && this.attributes.cy.nodeValue == removeCY; })
      .remove();
    }
  
  },1000);
  
}

/*******************************************************************
 * Toggle Pacman Music
 ******************************************************************/

function play(sound) {
  if(!sound.paused){
    sound.pause();
  } else {
    sound.play();
  } 
    
}

/*******************************************************************
 * Returns a random color from full color spectrum
 ******************************************************************/

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split(''); 
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * letters.length)];
  }
  return color;
}

/*******************************************************************
 * Draw Enemies
 ******************************************************************/

d3.select('svg').selectAll('circle')
  .data(asteroidPositions)
  .enter()
  .append('circle')
  .attr('class', function(d){return "enemy";})
  .attr('r', function(d,i){return Math.random()*10+15;})
  .attr('cx', function(d) { return d[0]; })
  .attr('cy', function(d) { return d[1]; })

  // remove style to get astroid image back
  .style("stroke", "black")
  .style("stroke-width", 0.5)

  // colors: Orange, Green, Blue
  .style("fill", function(d, i) { return color(i % 4); });
  // color combo2: All Colors
   
  //.style('fill', function (d) {return getRandomColor();}); 
 
/*******************************************************************
* Draw Player
******************************************************************/

// Draw Initial Player Position
d3.select('svg')
  .append('circle')
  .attr('id', 'player')
  .attr('cx', 400)
  .attr('cy', 400);


//Update Location on mouse move
d3.select('svg')
  .on("mousemove", function(d){
    d3.select("#player")
      .attr('cx', d3.mouse(this)[0])
      .attr('cy', d3.mouse(this)[1]);
    });

/*******************************************************************
* Draw and Move Pacman
******************************************************************/

var pacmanOnScreen= false;

d3.select('.helpDesk')
  .on("mousedown", function(){
  if(!pacmanOnScreen){
    //draw Pacman
    var moveTo = getRandomLocation();
    d3.select('svg')
      .append('circle')
      .attr('id', 'pacman')
      .attr('cx', moveTo[0])
      .attr('cy', moveTo[1])
      .attr('fill','url(#pacman)');
      pacmanOnScreen=true;
  }    
    movePacman();
  });


/*******************************************************************
 * Initialize Parameters and Start Game
 ******************************************************************/
var numberOfEnemies = 50;
var asteroidPositions = getNRandomLocations(numberOfEnemies);
// Shades of Orange, Green, Blue for enemies
var color = d3.scale.category10();
var sound = new Audio('pacman.mp3'); 
var start = Date.now();
var highScore = d3.select('.high').attr('span'); 
var numberOfCollisions = d3.select('.collisions').attr('span'); 

/*
 * Randomly move enemies
 */  

setInterval(randomMoves, 3000);

/*
 * Start timer and start keeping scores
 */ 
  
setInterval(function() {
  var elapsed = (Date.now() - start) / 1000;
  var minutes = (elapsed / 60) | 0;
  var seconds = (elapsed % 60) | 0;

  var score = seconds*26;
  
  if (score>highScore){
    highScore=score;
    d3.selectAll('.high span')
      .html(highScore);
  }

  d3.selectAll('.collisions span')
    .html(numberOfCollisions);

  d3.selectAll('.current span')
    .html(score);


  if (collisionDetected('player')[0]==='player') {
    if (score !==0){
      numberOfCollisions++;
    }
    resetScore();
  }
      
  
}, 500);

