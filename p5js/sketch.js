let searchalg = 0;

function setAlg(algId){
  searchalg = algId;
  console.log("Chosen Algorithm: BFS");
}

function setup() {
    createCanvas(400, 400);
    map = new MAP();
    noiseDetail(2, 0.1);
    map.config();
}

function startMenu(){
  fill("black");
  textSize(30);
  textAlign(CENTER);
  text("Metodo de Busca:", 100,0,300,100);
  
}

function draw() {
    
    switch(searchalg){
      case 0:
        startMenu();
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
      default:
        break;
    }
    //map.dfs();
    //map.show();
}