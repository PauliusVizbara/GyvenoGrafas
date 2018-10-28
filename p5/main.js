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
var scrollSpeed = 0.05;
var zoom = 1.00;
var verticeDeleteButton;
var drawnLines = [];
var freePaintMode = false;
var activeColor = "#ffa000";
var backgroundColor = "#f9f9f9";
var drawGrid = false;
var gridSize = 30;
var gridPoints = [];


window.onload = function() {
  document.getElementById("AddVertexButton").addEventListener('click', addNewVertex);
  document.getElementById("GMatrixOutput").addEventListener('click', display_Gmatrix);

  // Draggable
  dragElement(document.getElementById("G-Output"));
  dragElement(document.getElementById("G-UserInput"));
  dragElement(document.getElementById("FreePaintOptions"));
  dragElement(document.getElementById("GridOptions"));


  var gridRangeSlider = document.getElementById("gridRangeSlider");
  gridRangeSlider.oninput = function() {
    gridSize = parseInt(this.value);
    createGridPoints();
  }

  authorName();

}


function createGridPoints() {
  gridPoints = [];
  for (var i = gridSize; i < window.innerWidth; i += gridSize) {

    for (var j = gridSize; j < window.innerHeight; j += gridSize) {

      gridPoints.push(new Point(i, j));
    }
  }

  snapVertices();

}

function snapVertex(index) {
    var maximumDistance = Math.sqrt(2 * Math.pow(gridSize / 2, 2));
  for (var j = 0; j < gridPoints.length; j++) {
    if (dist(mouseX, mouseY, gridPoints[j].x, gridPoints[j].y) <= maximumDistance) {
      vertices[index].x = gridPoints[j].x;
      vertices[index].y = gridPoints[j].y;
      break;
    }
  }
}

function snapVertices() {
  var maximumDistance = Math.sqrt(2 * Math.pow(gridSize / 2, 2));
  console.log(gridPoints.length);

  for (var i = 0; i < vertices.length; i++) {
    for (var j = 0; j < gridPoints.length; j++) {
      if (dist(vertices[i].x, vertices[i].y, gridPoints[j].x, gridPoints[j].y) <= maximumDistance) {
        vertices[i].x = gridPoints[j].x;
        vertices[i].y = gridPoints[j].y;
        break;
      }
    }
  }
}

function showPanel(id) {
  var element = document.getElementById(id);
  element.style.display = "block";
}

function toggleGrid() {
  drawGrid = !drawGrid;
  if (drawGrid) createGridPoints();

}

function drawGridLines(size) {
  stroke("#444444");
  strokeWeight(1);
  for (var i = size; i < window.innerWidth; i += size) {
    line(i, 0, i, window.innerHeight);
  }

  for (var i = size; i < window.innerHeight; i += size) {
    line(0, i, window.innerWidth, i);
  }

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
  G_tableCreate();
}

function addNewVertex() {
  var spawnedNear = false;
  var count = 0;
  var x;
  var y;
  while (count < 100000) {
    x = Math.floor(Math.random() * window.innerWidth/3) + window.innerWidth / 3;
    y = Math.floor(Math.random() * window.innerHeight/3) + window.innerHeight / 3;
    for (var i = 0; i < vertices.length; i++) {
      if (dist(x, y, vertices[i].x, vertices[i].y) <= radius * 2 + 5) {
        spawnedNear = true;
      }
    }

    if (!spawnedNear) {
      var vertex = new Vertex(vertices.length, x, y);
      vertices.push(vertex);
      return;
    }
    count++;
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

function setup() {
  // Create canvas using width/height of window.


  canvas = createCanvas(window.innerWidth, window.innerHeight);
  noStroke();
  ellipseMode(RADIUS);
  frameRate(144);
  var x = window.innerWidth / 3;
  var y = window.innerHeight / 2;
  for (var i = 0; i < 5; i++) {
    var vertex = new Vertex(i, x, y);
    vertices.push(vertex);
    x += 100;
  }

}

$(window).resize(function() {
  canvas = createCanvas(window.innerWidth, window.innerHeight);
});

// Draw on the canvas.
function draw() {

  background(backgroundColor);

  if (drawGrid) {
    drawGridLines(gridSize);
  }

  if (connections.length > 0) {
    drawConnections();
  }

  if (vertices.length > 0) {

    drawVertices();
  }

  if (verticeDeleteButton != null) verticeDeleteButton.draw();

  if (drawnLines.length > 0) {
    stroke("#FF0000");
    strokeWeight(4);

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
    if (activeVertexIndex != null) {
      vertices[activeVertexIndex].color = "#000";
      activeVertexIndex = null;
    }
    return true;
  }
  return false;
}

function resetFreePaint() {
  drawnLines = [];
}

function toggleFreePaint() {

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
  connections.splice(index, 1);
}

// Run when the mouse/touch is down.
function mousePressed() {
  mousePressedx = mouseX;
  mousePressedy = mouseY;

  if (freePaintMode) return;

  resetConnectionColors();

  if (verticeDeleteButton != null && dist(mouseX, mouseY, verticeDeleteButton.x, verticeDeleteButton.y) < radius - 5) {
    deleteConnection(verticeDeleteButton.index);
    verticeDeleteButton = null;
    return;
  }

  verticeDeleteButton = null;




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
        if (!connectionExist && vertices[activeVertexIndex].index != vertices[i].index) {
          resetConnectionColors();
          connections.push(new Connection(activeVertexIndex, vertices[i].index));
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
        vertices[i].color = activeColor;
        for (var j = 0; j < connections.length; j++) {
          if (connections[j].hasVertex(activeVertexIndex) != null) {
            connections[j].color = activeColor;
          }
        }

      } else {
        vertices[i].color = "#000";
      }
    }

    if (!hasPressedOnVertex)
      for (var i = 0; i < connections.length; i++) {
        if (pressedOnALine(connections[i].firstVertexIndex, connections[i].secondVertexIndex, i)) {
          return;
        };
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
  } else if (mouseHasBeenDragged && activeVertexIndex == null) {
    mouseHasBeenDragged = false;
  }



}
// Run when the mouse/touch is dragging.
function mouseDragged() {

  if ($('.DragElementBody:hover').length != 0 && freePaintMode) {
    return;
  }

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
      if (drawGrid) {
        snapVertex(activeVertexIndex);

      } else {
        vertices[activeVertexIndex].x = mouseX;
        vertices[activeVertexIndex].y = mouseY;
      }
    }
  } else if (mouseButton == "center") {
    var scrollX = mousePressedx - mouseX;
    var scrollY = mousePressedy - mouseY;

    scrollX *= scrollSpeed;
    scrollY *= scrollSpeed;
    scrollX = -scrollX;
    scrollY = -scrollY;
    //var mouseDeltaX = (mouseX - mousePressedx) / scrollSpeed;
    //var mouseDeltaY = (mouseY - mousePressedy) / scrollSpeed;

    for (var i = 0; i < vertices.length; i++) {
      vertices[i].x += scrollX;
      vertices[i].y += scrollY;
    }

    for (var i = 0; i < drawnLines.length; i += 2) {
      drawnLines[i] += scrollX;
      drawnLines[i + 1] += scrollY;
    }


  }

  // Prevent default functionality.
  //return false;
}

function mouseWheel(event) {
  /*zoom -= sensitivity * event.delta;*/
  //uncomment to block page scrolling
  return false;
}

function createGraphFromGInput() {

  var x = $("#G-UserInput textarea").val();

  var lines = x.split('\n');

  for (var i = 0; i < lines.length; i++) {
    if (lines[i] == "") {
      lines.splice(i, 1);
    }
  }

  var vertexCount = 0;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].split(' ');
    for (var j = 0; j < line.length; j++) {
      if (line[j] > vertexCount) vertexCount = line[j];
    }
  }

  if (vertexCount == 0) return;
  vertices = [];
  connections = [];

  for (var i = 0; i < vertexCount; i++) {

    addNewVertex();
  }

  for (var i = 0; i < lines.length; i++) {
    var GRow = lines[i].split(' ');
    console.log("Heyy " + GRow.length);
    for (var j = 0; j < GRow.length; j++) {
      var connectionExists = false;
      for (var k = 0; k < connections.length; k++) {
        if (connections[k].hasVertices(i, GRow[j] - 1)) {
          connectionExists = true;
          break;
        }
      }
      if (!connectionExists)
        connections.push(new Connection(i, GRow[j] - 1));
    }
  }

}

function G_tableCreate() {

  var outputWindow = document.getElementById("G-Output");
  outputWindow.style.display = "block";
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
  outputWindow.getElementsByClassName("DragElementContent")[0].appendChild(tbl);
}


function hideElement(id) {
  document.getElementById(id).style.display = "none";
}
