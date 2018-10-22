// Set up canvas.

var radius = 20;
var activeVertexIndex;
var mouseHasBeenDragged;
var hasSelected = false;
var selectedIndex = null;
var vertices = [];
var connections = [];
var mousePressedx;
var mousePressedy;
var G = [];
var scrollSpeed = 3;
var zoom = 1.00;
var sensitivity = 0.25;
var verticeDeleteButton;
var drawnLines = [];
var freePaintMode = false;

window.onload = function() {
  document.getElementById("AddVertexButton").addEventListener('click', addNewVertex);
  document.getElementById("GMatrixOutput").addEventListener('click', display_Gmatrix);

  // Draggable
  dragElement(document.getElementById("G-Output"));
  dragElement(document.getElementById("G-UserInput"));
  dragElement(document.getElementById("FreePaintOptions"));

  //Modal
}


function display_Gmatrix() {
  var vertexCount = vertices.length;
  G = [];
  for (var i = 0; i < vertexCount; i++) {
    var gRow = [];
    for (var j = 0; j < connections.length; j++) {
      if (connections[j].hasVertex(i) != null) {
        gRow.push(connections[j].hasVertex(i));
      }
    }
    G[i] = gRow;

  }
  tableCreate();
}

function addNewVertex() {
  var x = Math.floor(Math.random() * 500) + 20;
  var y = Math.floor(Math.random() * 500) + 20;
  var vertex = new Vertex(vertices.length, x, y);
  vertices.push(vertex);

}

function setup() {
  // Create canvas using width/height of window.


  canvas = createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  ellipseMode(RADIUS);

  var x = window.innerWidth / 3;
  var y = window.innerHeight / 2;
  for (var i = 0; i < 5; i++) {
    var vertex = new Vertex(i, x, y);
    vertices.push(vertex);
    x += 50;
  }

}

function drawVertices() {
  for (var i = 0; i < vertices.length; i++) {
    var vertice = vertices[i];
    stroke(vertice.color);
    vertice.draw();

  }
}

function drawConnections() {
  for (var i = 0; i < connections.length; i++) {
    var firstIndex = connections[i].firstVertexIndex;
    var secondIndex = connections[i].secondVertexIndex;

    connections[i].assignPoints(vertices[firstIndex].x, vertices[firstIndex].y,
      vertices[secondIndex].x, vertices[secondIndex].y);
    connections[i].draw();

  }
}



// Draw on the canvas.
function draw() {
  background('#fff');



  if (connections.length > 0) {
    drawConnections();
  }

  if (vertices.length > 0) {

    drawVertices();
  }

  if (verticeDeleteButton != null) verticeDeleteButton.draw();

  if (drawnLines.length > 0) {
    stroke("#FF0000");
    strokeWeight(10);
    for (var i = 0; i < drawnLines.length; i += 4) {
      line(drawnLines[i], drawnLines[i + 1], drawnLines[i + 2], drawnLines[i + 3]);
    }
  }

}


function pressedOnALine(firstVertex, secondVertex, index) {
  var vertexA = vertices[firstVertex];
  var vertexB = vertices[secondVertex];

  var midPointX = Math.abs(vertexA.x + vertexB.x) / 2;
  var midPointY = Math.abs(vertexA.y + vertexB.y) / 2;
  /*if ((mouseX < vertexA.x && mouseX > vertexB.x) || (mouseX < vertexB.x && mouseX > vertexA.x)) {
    if ((mouseY < vertexA.y && mouseY > vertexB.y) || (mouseY < vertexB.y && mouseY > vertexA.y)) {

    }
  }*/

  if (dist(mouseX, mouseY, midPointX, midPointY) < radius) {
    createDeleteConnectionButton(midPointX, midPointY, index);
    return true;
  }
  return false;
}


function toggleFreePaint(){


  if ( freePaintMode){
    drawnLines = [];
  }
  freePaintMode = !freePaintMode;
}
function createDeleteConnectionButton(x, y, index) {

  verticeDeleteButton = new VerticeDeleteButton(index, x, y);
}

function resetConnectionColors() {
  for (var j = 0; j < connections.length; j++) {
    if (connections[j].hasVertex(activeVertexIndex) != null) {
      connections[j].color = "#000";
    }
  }
}

function deleteConnection(index) {
  connections.splice(index, index + 1);
}

// Run when the mouse/touch is down.
function mousePressed() {

  if ( freePaintMode) return;

  resetConnectionColors();

  if (verticeDeleteButton != null && dist(mouseX, mouseY, verticeDeleteButton.x, verticeDeleteButton.y) < radius - 5) {
    deleteConnection(verticeDeleteButton.index);
    verticeDeleteButton = null;
    return;

  }
  verticeDeleteButton = null;

  for (var i = 0; i < connections.length; i++) {
    if (pressedOnALine(connections[i].firstVertexIndex, connections[i].secondVertexIndex, i)) {
      /*var closeButtonX = Math.abs(connections[i].firstVertexIndex.x - connections[i].secondVertexIndex.x);
      var closeButtonY = Math.abs(connections[i].firstVertexIndex.y - connections[i].secondVertexIndex.y);
      createDeleteConnectionButton(closeButtonX, closeButtonY, 0);*/
    }
  }
  mousePressedx = mouseX;
  mousePressedy = mouseY;

  if (activeVertexIndex != null) {
    for (var i = 0; i < vertices.length; i++) {
      distance = dist(mouseX, mouseY, vertices[i].x, vertices[i].y);
      if (distance < radius) {
        var connectionExist = false;
        for (var j = 0; j < connections.length; j++) {
          if (connections[j].hasVertices(vertices[i].index, activeVertexIndex)) {
            connectionExist = true;
            break;
          }
        }
        if (!connectionExist) {
          resetConnectionColors();
          connections.push(new Connection(activeVertexIndex, i));
          vertices[activeVertexIndex].resetColor();
          activeVertexIndex = null;
          return;
        }
      }
    }
  }

  if (vertices.length > 0) {

    var hasPressedOnVertex = false;
    for (var i = 0; i < vertices.length; i++) {
      distance = dist(mouseX, mouseY, vertices[i].x, vertices[i].y);
      if (distance < radius) {
        hasPressedOnVertex = true;
        activeVertexIndex = i;
        vertices[i].color = "#ffA000";

        for (var j = 0; j < connections.length; j++) {
          if (connections[j].hasVertex(activeVertexIndex) != null) {
            connections[j].color = "#ffA000";
          }
        }

      } else {
        vertices[i].color = "#000";
      }
    }

    if (!hasPressedOnVertex && activeVertexIndex != null) {
      resetConnectionColors();
      vertices[activeVertexIndex].color = "#000";
      activeVertexIndex = null;
    }



  }

}

function mouseReleased() {

  if (mouseHasBeenDragged && activeVertexIndex != null) {
    resetConnectionColors();
    vertices[activeVertexIndex].resetColor();
    activeVertexIndex = null;
    mouseHasBeenDragged = false;
  }


}
// Run when the mouse/touch is dragging.
function mouseDragged() {

  if (freePaintMode && mouseButton == LEFT) {
    drawnLines.push(mouseX);
    drawnLines.push(mouseY);
    drawnLines.push(pmouseX);
    drawnLines.push(pmouseY);
    return;
  }


  var distanc = dist(mouseX, mouseY, mousePressedx, mousePressedy);
  if (distanc < radius && !mouseHasBeenDragged) {
    mouseHasBeenDragged = false;
    return;
  } else {
    mouseHasBeenDragged = true;
  }


  if (vertices.length > 0 && activeVertexIndex != null) {

    var isNearOtherVertice = false;
    for (var i = 0; i < vertices.length; i++) {
      if (i != activeVertexIndex) {
        var distanceToVertex = dist(vertices[activeVertexIndex].x, vertices[activeVertexIndex].y, vertices[i].x, vertices[i].y);
        var distanceToVertex = dist(mouseX, mouseY, vertices[i].x, vertices[i].y);
        if (distanceToVertex < 2 * radius) {

          //var angleBetweenVertices = Math.asin( distanceToVertex / Math.abs(vertices[activeVertexIndex].y - vertices[i].y));
          //console.log(angleBetweenVertices);
          //var newX = this.x + cos(this.angle*3.14/180);
          //var newY = this.y + sin(this.angle*3.14/180);
          isNearOtherVertice = true;
          break;
        }
      }
    }
    if (!isNearOtherVertice) {
      vertices[activeVertexIndex].x = mouseX;
      vertices[activeVertexIndex].y = mouseY;
    }
  } else if (mouseButton == "center") {
    var scrollX = mousePressedx - mouseX;
    var scrollY = mousePressedy - mouseY;

    scrollX *= sensitivity;
    scrollY *= sensitivity;

    //var mouseDeltaX = (mouseX - mousePressedx) / scrollSpeed;
    //var mouseDeltaY = (mouseY - mousePressedy) / scrollSpeed;

    for (var i = 0; i < vertices.length; i++) {
      vertices[i].x += scrollX;
      vertices[i].y += scrollY;
    }

    for (var i = 0; i < drawnLines.length; i+=2) {
      drawnLines[i] += scrollX;
      drawnLines[i+1] += scrollY;
    }


  }

  // Prevent default functionality.
  //return false;
}

function mouseWheel(event) {
  zoom -= sensitivity * event.delta;
  //uncomment to block page scrolling
  return false;
}

function createGraphFromGInput() {
  var x = $("#G-UserInput textarea").val();
  for (var i = 0; i < x.length; i++) {
    console.log(i + ": " + x[i]);
  }

}

function tableCreate() {

  var outputWindow = document.getElementsByClassName("DragElementContent")[0];
  $("#G-Output table").remove();
  var body = document.body,
    tbl = document.createElement('table');
  tbl.classList.add('MatrixTable');

  var tr = tbl.insertRow();
  var td = tr.insertCell();
  td.appendChild(document.createTextNode("G: "));
  td.setAttribute('rowspan', vertices.length + 1);


  for (var i = 0; i < vertices.length; i++) {
    var tr = tbl.insertRow();
    var td = tr.insertCell();


    td.appendChild(document.createTextNode(i + 1));
    if (G[i].length == 0) {
      var td = tr.insertCell();
      td.appendChild(document.createTextNode("-"));
    }

    for (var j = 0; j < G[i].length; j++) {
      var td = tr.insertCell();
      td.appendChild(document.createTextNode(G[i][j] + 1));
    }
  }
  outputWindow.appendChild(tbl);
}
