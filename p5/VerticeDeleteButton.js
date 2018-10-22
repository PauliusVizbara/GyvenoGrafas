function VerticeDeleteButton(index,x,y) {
  this.index = index;
  this.color = "#FFA000";
  this.x = x;
  this.y = y;
  this.radius = radius-5;
  this.draw = function() {
    noStroke();
    fill("#000");
    ellipse(this.x, this.y, this.radius+2, this.radius+2);
    fill(this.color);

    ellipse(this.x, this.y, this.radius, this.radius);

    var topRightCornerX = (this.x+this.radius/2.5);
    var topRightCornerY = (this.y-this.radius/2.5);
    topRightCornerX++;
    topRightCornerY--;
    stroke("#ffffff");
    strokeWeight(3);
    line(topRightCornerX,topRightCornerY,topRightCornerX-this.radius,topRightCornerY+this.radius);
    line(topRightCornerX-this.radius,topRightCornerY,topRightCornerX,topRightCornerY+this.radius);

    point(topRightCornerX,topRightCornerY);


    console.log(topRightCornerX,topRightCornerY);

  }

}
