function Vertex(index, x, y) {
  this.index = index;
  this.x = x;
  this.y = y;

  this.angle = 180;
  this.color = "#000";
  this.coords = function() {
    return this.x + " " + this.y;
  };

this.resetColor = function(){
 this.color = "#000";
}

  this.draw = function() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, radius, radius);



    //text(index+1, this.x, this.y-20);
    textSize(25);
    var currentTextX = this.x + cos(this.angle*3.14/180);
    var currentTextY = this.y + sin(this.angle*3.14/180);
    rectMode(CORNER);
    fill("#ffffff");

    textAlign(CENTER, CENTER);
    text(index+1, this.x, this.y);

  }


}
