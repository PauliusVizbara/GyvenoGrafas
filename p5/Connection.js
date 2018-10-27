function Connection(firstVertexIndex, secondVertexIndex) {

  this.firstVertexIndex = firstVertexIndex;
  this.secondVertexIndex = secondVertexIndex;
  this.color = "#000";

  this.hasVertices = function(firstVertex, secondVertex) {
    if (firstVertex == firstVertexIndex && secondVertex == secondVertexIndex) {
      return true;
    }
    if (firstVertex == secondVertexIndex && secondVertex == firstVertexIndex) {
      return true;
    }
    return false;
  }

  this.hasVertex = function(index) {
    if (this.firstVertexIndex == index) {
      return secondVertexIndex;
    } else if (this.secondVertexIndex == index) {
      return firstVertexIndex;
    } else return null;


  }

  this.assignPoints = function(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
  }
  this.draw = function() {
    stroke(this.color);
    strokeWeight(3);
    line(this.x1, this.y1, this.x2, this.y2);

    fill(backgroundColor);
    var midPointX = Math.abs(this.x1 +this.x2) / 2;
    var midPointY = Math.abs(this.y1 + this.y2) / 2;
    ellipse(midPointX, midPointY,3,3);
  }


}
