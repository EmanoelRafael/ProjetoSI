let searchalg = 0;
let frameCount = 1;

function setup() {
    createCanvas(400, 400);
    map = new MAP();
    noiseDetail(2, 0.1);
    map.config();
}

function startMenu(){
  background("grey");
  textSize(30);
  textAlign(CENTER);
  text("Search Algorithm:", 50,50,300,100);
  
  bfsButton = createButton("BFS");
  bfsButton.position(180,100);
  
  dfsButton = createButton("DFS");
  dfsButton.position(180,150);
  
  gsButton = createButton("Greedy Search");
  gsButton.position(150,200);
  
  ucsButton = createButton("Uniform Cost Search");
  ucsButton.position(135,250);
  
  axsButton = createButton("A* Search");
  axsButton.position(165,300);
  
  bfsButton.mousePressed(setAlgToBFS);
  dfsButton.mousePressed(setAlgToDFS);
  gsButton.mousePressed(setAlgToGS);
  ucsButton.mousePressed(setAlgToUCS);
  axsButton.mousePressed(setAlgToAXS);
  
}

function deleteButtons(){
  buttons = document.getElementsByTagName('button');
  var nButtons = buttons.length;
  for(let i = nButtons - 1; i >= 0; i--){
    buttons[i].remove();
  }
}

function setAlgToBFS(){
  searchalg = 1;
  deleteButtons();
}
function setAlgToDFS(){
  searchalg = 2;
  deleteButtons();
}
function setAlgToGS(){
  searchalg = 3;
  deleteButtons();
}
function setAlgToUCS(){
  searchalg = 4;
  deleteButtons();
}
function setAlgToAXS(){
  searchalg = 5;
  deleteButtons();
}

function draw() {
    
    switch(searchalg){
      case 0:
        startMenu();
        if(frameCount%100==0){
          frameCount = 1;
          deleteButtons();
        }else{
          frameCount ++;
        }
        break;
      case 1:
        map.bfs();
        map.show();
        break;
      case 2:
        map.dfs();
        map.show();
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        break;
      default:
        break;
    }
}
