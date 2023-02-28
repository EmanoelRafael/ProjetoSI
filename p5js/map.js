class MAP{
  
    constructor(){
      this.tileSize = 10; 
      this.width = int(width/this.tileSize);
      this.height = int(height/this.tileSize);
      this.array = []
      this.noiseScale = 0.19;
      this.nodes = [];
      this.matrix = [];   
      
      this.timer = 1;
      this.current = 0;
      this.weight = 0;
      this.idx = 0;
      this.cordx = 0;
      this.cordy = 0;
      this.sourceidx = [];
      this.targetidx = [];
      this.source = 0;
      this.target = 0;
      this.came_from = [];
      this.not_in_came_from = true;
      this.frontier = [];
      this.flag = true;
      this.already_visited = [];
      this.path = [];
      this.nodeaux = 0;

      this.greedyBFSStructure = null;
      this.playerX = -1;
      this.playerY = -1;
      this.foodX = -1;
      this.foodY = -1;
    }
    
    grid(){
      for(let i = 0; i < this.width; i++){
        this.array[i] = [];
        for(let j = 0; j < this.height; j++){
          this.array[i][j] = [];
          this.array[i][j][0] = noise(i*this.noiseScale,j*this.noiseScale);
          this.array[i][j][1] = "unvisited";
        }
      }
    }
    
    setPlayer(){
      let i = int(random(0,this.width + 1));
      let j = int(random(0,this.height) + 1);
      let flag = true;
      let weight;
      
      while(flag){
        weight = this.array[i][j][0];
        if(weight < 0.1){
          i = int(random(0,this.width));
          j = int(random(0,this.height));
        }else{
          flag = false;
        }
      }
      this.array[i][j][1] = "player";
      this.playerX = i;
      this.playerY = j;
    }
    
    setFood(){
      let i = int(random(0,this.width + 1));
      let j = int(random(0,this.height) + 1);
      let flag = true;
      
      while(flag){
        if(this.array[i][j][0] < 0.1 || this.array[i][j][1] == "player"){
          i = int(random(0,this.width));
          j = int(random(0,this.height));
        }else{
          flag = false;
        }
      }
      this.array[i][j][1] = "food";
      this.foodX = i;
      this.foodY = j;
    }
    
    node(){
      
      for(let i = 0; i < this.width; i++){
        for(let j = 0; j < this.height; j++){
          append(this.nodes,[i,j]);
        }
      }
      //print(this.nodes)
    }
    
    adjMatrix(){
      let node1 = [];
      let node2 = [];
      let distx = 99;
      let disty = 99;
      let k;
      let l;
      
      for(let i = 0; i < this.width * this.height; i++){
        this.matrix[i] = []
        for(let j = 0; j < this.width * this.height; j++){
          
          node1 = this.nodes[i];
          node2 = this.nodes[j];
          
          k = this.nodes[j][0];
          l = this.nodes[j][1];
          
          distx = abs(node1[0] - node2[0]);
          disty = abs(node1[1] - node2[1]);
        
        //First Case, the node is compare with itself
        // Set weight to 99, it cant get into a looop
         if(i == j){
           this.matrix[i][j] = 99;
          //Second case, the node is compared with a neighbour
         }else if((distx + disty) == 1){
           if(this.array[k][l][0] < 0.1){
              this.matrix[i][j] = 99;
              }else if(this.array[k][l][0] < 0.3){
              this.matrix[i][j] = 1;
              }else if(this.array[k][l][0] < 0.4){
              this.matrix[i][j] = 5;
              }else{
                this.matrix[i][j] = 10;
              }
         }else{
            this.matrix[i][j] = 100;
          }
        }
      }
      //print(this.matrix);
    }
    
    config(){
        this.grid();
        this.setPlayer();
        this.setFood();
        this.node();
        this.adjMatrix();

        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                if (this.array[i][j][1] == "player") {
                    this.sourceidx[0] = i;
                    this.sourceidx[1] = j;
                }
                if (this.array[i][j][1] == "food") {
                    this.targetidx[0] = i;
                    this.targetidx[1] = j;
                }
            }
        }

        for (let i = 0; i < this.nodes.length; i++) {
            if(this.nodes[i][0] == this.sourceidx[0] && this.nodes[i][1] == this.sourceidx[1]){
                this.source = i;
            }
            if(this.nodes[i][0] == this.targetidx[0] && this.nodes[i][1] == this.targetidx[1]){
                this.target = i;
            }
        }

        append(this.frontier, this.source);
        this.current = this.frontier[0];
        this.frontier.splice(0,1);
        this.already_visited.push(this.current);

        for(let j = 0; j < this.width * this.height; j++){
        
            this.weight = this.matrix[this.current][j];
            if(this.weight < 50){
        
                this.frontier.push(j);
                this.came_from.push([this.current, j]);

                this.cordx = this.nodes[j][0];
                this.cordy = this.nodes[j][1];
                this.array[this.cordx][this.cordy][1] = "frontier";
            }
        }
    }

    bfs(){
      if(this.timer > 0){ 
            this.timer --;
        
      }if(this.timer == 0 && this.flag == true){
          this.timer = 1;

          this.current = this.frontier[0];
          this.frontier.splice(0,1);

          if(this.current == this.target){
              this.flag = false;
          }

          if(this.frontier.length > 0 && this.flag == true){
              this.cordx = this.nodes[this.current][0];
              this.cordy = this.nodes[this.current][1];
              this.array[this.cordx][this.cordy][1] = "visited";

              //Adicionando os vizinhos na lista de came_from
              for(let j = 0; j < this.width * this.height; j++){

                  if(this.matrix[this.current][j] < 50){
                      //Verifica se o vizinho ja esta la lista de came_from
                      for(let k = 0; k < this.came_from.length; k++){
                          if(this.came_from[k][0] == j || this.came_from[k][1] == j){
                              this.not_in_came_from = false;
                          }
                      }

                      //Se nao esta na lista de came_from adiciona na lista de fronteiras, adiciona na lista de caminhos
                      //Muda o status para fronteira
                      if(this.not_in_came_from == true){
                          append(this.frontier, j);
                          append(this.came_from, [this.current, j]);
                          this.cordx = this.nodes[j][0];
                          this.cordy = this.nodes[j][1];
                          this.array[this.cordx][this.cordy][1] = "frontier";
                      }
                      this.not_in_came_from = true;
                  }
              }
          }
      }

      //Se o atual for a comida
      if(this.flag == false){//&& flag2 == true){
          //Atualiza o status do atual como comida no array no mapa
          this.cordx = this.nodes[this.target][0];
          this.cordy = this.nodes[this.target][1];
          this.array[this.cordx][this.cordy][1] = "food";

          //Se o atual nao for o jogador
          if(this.current != this.source){

              //Obtendo o peso do atual
              this.cordx = this.nodes[this.current][0];
              this.cordy = this.nodes[this.current][1];
              if(this.array[this.cordx][this.cordy][0] < 0.3){
                  this.weight = 1;
              }else if(this.array[this.cordx][this.cordy][0] < 0.4){
                  this.weight = 5;
              }else{
                  this.weight = 10;
              }

              //Adicionando o elemento atual e seu peso no caminho
              this.path.push([this.current, this.weight]);

              //Obtendo o antecessor a partir do vetor de caminho came_from
              for(let i = 0; i < this.came_from.length; i++){
                  if(this.came_from[i][1] == this.current){
                      this.current = this.came_from[i][0];          
                  }
              }
          }


          //Atualizando o status dos elementos do caminho
          for(let i = 0; i < this.path.length; i++){
              this.nodeaux = this.path[i][0];
              this.cordx = this.nodes[this.nodeaux][0];
              this.cordy = this.nodes[this.nodeaux][1];
              if(this.array[this.cordx][this.cordy][1] != "food"){
                  this.array[this.cordx][this.cordy][1] = "path";
              }
          }
      }
    }
    
    dfs(){
      
      if(this.timer > 0){ 
            this.timer --;
        
      }if(this.timer == 0 && this.flag == true){
          this.timer = 1;

          this.current = this.frontier.slice(-1);
          this.frontier.splice(-1,1);

          if(this.current == this.target){
              this.flag = false;
          }

          if(this.frontier.length > 0 && this.flag == true){
              this.cordx = this.nodes[this.current][0];
              this.cordy = this.nodes[this.current][1];
              this.array[this.cordx][this.cordy][1] = "visited";

              //Adicionando os vizinhos na lista de came_from
              for(let j = 0; j < this.width * this.height; j++){

                  if(this.matrix[this.current][j] < 50){
                      //Verifica se o vizinho ja esta la lista de came_from
                      for(let k = 0; k < this.came_from.length; k++){
                          if(this.came_from[k][0] == j || this.came_from[k][1] == j){
                              this.not_in_came_from = false;
                          }
                      }

                      //Se nao esta na lista de came_from adiciona na lista de fronteiras, adiciona na lista de caminhos
                      //Muda o status para fronteira
                      if(this.not_in_came_from == true){
                          append(this.frontier, j);
                          append(this.came_from, [this.current, j]);
                          this.cordx = this.nodes[j][0];
                          this.cordy = this.nodes[j][1];
                          this.array[this.cordx][this.cordy][1] = "frontier";
                      }
                      this.not_in_came_from = true;
                  }
              }
          }
      }

      //Se o atual for a comida
      if(this.flag == false){//&& flag2 == true){
          //Atualiza o status do atual como comida no array no mapa
          this.cordx = this.nodes[this.target][0];
          this.cordy = this.nodes[this.target][1];
          this.array[this.cordx][this.cordy][1] = "food";

          //Se o atual nao for o jogador
          if(this.current != this.source){

              //Obtendo o peso do atual
              this.cordx = this.nodes[this.current][0];
              this.cordy = this.nodes[this.current][1];
              if(this.array[this.cordx][this.cordy][0] < 0.3){
                  this.weight = 1;
              }else if(this.array[this.cordx][this.cordy][0] < 0.4){
                  this.weight = 5;
              }else{
                  this.weight = 10;
              }

              //Adicionando o elemento atual e seu peso no caminho
              this.path.push([this.current, this.weight]);

              //Obtendo o antecessor a partir do vetor de caminho came_from
              for(let i = 0; i < this.came_from.length; i++){
                  if(this.came_from[i][1] == this.current){
                      this.current = this.came_from[i][0];          
                  }
              }
          }


          //Atualizando o status dos elementos do caminho
          for(let i = 0; i < this.path.length; i++){
              this.nodeaux = this.path[i][0];
              this.cordx = this.nodes[this.nodeaux][0];
              this.cordy = this.nodes[this.nodeaux][1];
              if(this.array[this.cordx][this.cordy][1] != "food"){
                  this.array[this.cordx][this.cordy][1] = "path";
              }
          }
      }
      
    }

    greedyBFS(){
      // console.log(search);
      if (this.greedyBFSStructure === null) {
        let first = {x: this.playerX, y: this.playerY, cost: 0, parent: null};
        this.greedyBFSStructure = {
          current: first,
          queue: [first],
          path: [],
          foodFound: false
        }
        

      } else {
        if(this.greedyBFSStructure.foodFound){
          // console.log('comida encontrada');
          if(this.greedyBFSStructure.current.parent != null){
            let current = this.greedyBFSStructure.current;
            this.array[current.x][current.y][1] = "path";
            this.greedyBFSStructure.current = current.parent;
          }
        } else {
          if(this.greedyBFSStructure.queue.length > 0){
            this.greedyBFSStructure.queue.sort((a, b) => b.cost - a.cost);
            this.greedyBFSStructure.current = this.greedyBFSStructure.queue.pop();
            // this.greedyBFSStructure.path.push({...this.greedyBFSStructure.current});
            
            let current = this.greedyBFSStructure.current;
            this.visited(current.x, current.y);
      
            let xLeft = current.x - 1;
            let xRight = current.x + 1;
            let yUp = current.y - 1;
            let yDown = current.y + 1;
      
            //this.array[i][j][0] < 0.1 && this.array[i][j][1] == "unvisited"
            // console.log(xLeft, this.array[xLeft][current.y][1],this.array[xLeft][current.y][0]);
            if(xLeft >= 0){
              if(this.array[xLeft][current.y][1] != "food"){
                if(this.array[xLeft][current.y][1] != "visited" && this.array[xLeft][current.y][0] >= 0.1){
                  this.fronteira(xLeft, current.y);
                  let son = {x: xLeft, y: current.y, cost: this.heuristic(xLeft, current.y), parent: current};
                  // console.log(son);
                  this.greedyBFSStructure.queue.push(son);
                }
              } else {
                this.greedyBFSStructure.foodFound = true;
              }
            }
  
            if(xRight < this.width){
              if(this.array[xRight][current.y][1] != "food"){
                if(this.array[xRight][current.y][1] != "visited" && this.array[xRight][current.y][0] >= 0.1){
                  this.fronteira(xRight, current.y);
                  let son = {x: xRight, y: current.y, cost: this.heuristic(xRight, current.y), parent: current};
                  // console.log(son);
                  this.greedyBFSStructure.queue.push(son);
                }
              } else {
                this.greedyBFSStructure.foodFound = true;
              }
            }
  
            if(yUp >= 0){
              if(this.array[current.x][yUp][1] != "food"){
                if(this.array[current.x][yUp][1] != "visited" && this.array[current.x][yUp][0] >= 0.1){
                  this.fronteira(current.x, yUp);
                  let son = {x: current.x, y: yUp, cost: this.heuristic(current.x, yUp), parent: current};
                  // console.log(son);
                  this.greedyBFSStructure.queue.push(son);
                }
              } else {
                this.greedyBFSStructure.foodFound = true;
              }
            }
  
            if(yDown < this.height){
              if(this.array[current.x][yDown][1] != "food"){
                if(this.array[current.x][yDown][1] != "visited" && this.array[current.x][yDown][0] >= 0.1){
                  this.fronteira(current.x, yDown);
                  let son = {x: current.x, y: yDown, cost: this.heuristic(current.x, yDown), parent: current};
                  // console.log(son);
                  this.greedyBFSStructure.queue.push(son);
                }
              } else {
                this.greedyBFSStructure.foodFound = true;
              }
            }
  
          } else {
            console.log('fila vazia: CAMINHO NÃO ENCONTRADO');
          }
        }
      }
    
    }
    

    // heuristica: custo do terreno
    // heuristic(x,y){
    //   if(this.array[x][y][0] < 0.1){
    //     return 100;
    //   } else if(this.array[x][y][0] < 0.3){
    //     return 1;
    //   } else if(this.array[x][y][0] < 0.4){
    //     return 5;
    //   } else {
    //     return 10;
    //   }
    // }

    // heuristica: distância em linha reta entre o player e a comida
    heuristic(x, y) {
      if(this.array[x][y][0] < 0.1){
        return 100;
      } else {
        let d = abs(x - this.foodX) + abs(y - this.foodY);
        // console.log(d);
        return d;
      }
    }
  
    show(){
      for(let i = 0; i < this.width; i++){
        for(let j = 0; j < this.height; j++){
          if(this.array[i][j][1] == "player"){
            fill("yellow");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][1] == "path"){
            fill("lime");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);          
          }else if(this.array[i][j][1] == "food"){
            fill("pink");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][1] == "frontier"){
            fill("orange");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][1] == "visited"){
            fill("purple");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][0] < 0.1 && this.array[i][j][1] == "unvisited"){
            fill("gray");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][0] < 0.30 && this.array[i][j][1] == "unvisited"){
            fill("green");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][0] < 0.40 && this.array[i][j][1] == "unvisited"){
            fill("brown");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if (this.array[i][j][0] > 0.4 && this.array[i][j][1] == "unvisited"){
            fill("blue");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }
  
        }
      }
    }

    visited(x, y){
      if(this.array[x][y][1] != "player"){
        this.array[x][y][1] = "visited";
      }
    }

    fronteira(x, y){
      if(this.array[x][y][1] != "player"){
        this.array[x][y][1] = "frontier";
      }
    }

  }
  
  
  //rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);