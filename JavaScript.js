// Close the dropdown menu if the user clicks outside of it
window.addEventListener("click", function(event) {

  if (!event.target.matches('.dropbtn') && !event.target.matches('.dropdown-content') && !event.target.matches('.MenuButton')) {
    hideAllDropdowns();
  }
});


/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function showDropdown(a) {
  var dropDowns = document.getElementsByClassName("dropdown-content");
  for (var i = 0; i < dropDowns.length; i++) {
    if (i != a)
      dropDowns[i].classList.remove("show");
  }

  document.getElementsByClassName("dropdown-content")[a].classList.toggle("show");
}

function hideAllDropdowns() {
  var dropdowns = document.getElementsByClassName("dropdown-content");
  var i;
  for (i = 0; i < dropdowns.length; i++) {
    var openDropdown = dropdowns[i];
    if (openDropdown.classList.contains('show')) {
      openDropdown.classList.remove('show');
    }
  }
}


function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "-mover")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "-mover").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}
