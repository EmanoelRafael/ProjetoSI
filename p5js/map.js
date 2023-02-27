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
    
    ucs() {
      
    }
    
    show(){
      for(let i = 0; i < this.width; i++){
        for(let j = 0; j < this.height; j++){
          if(this.array[i][j][1] == "player"){
            fill("yellow");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][1] == "path"){
            fill("rgb(255,255,255)");
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
            if(this.array[i][j][0] < 0.1){
              fill("black");
              //noStroke();
              rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
            }else if(this.array[i][j][0] < 0.30){
              fill("rgb(1,94,1)");
              //noStroke();
              rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
            }else if(this.array[i][j][0] < 0.40){
              fill("rgb(101,26,26)");
              //noStroke();
              rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
            }else{
              fill("rgb(4,4,126)");
              //noStroke();
              rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
            }
            //fill("purple");
            //noStroke();
            //rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][0] < 0.1 && this.array[i][j][1] == "unvisited"){
            fill("black");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][0] < 0.30 && this.array[i][j][1] == "unvisited"){
            fill("rgb(3,198,3)");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if(this.array[i][j][0] < 0.40 && this.array[i][j][1] == "unvisited"){
            fill("rgb(201,59,59)");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }else if (this.array[i][j][0] > 0.4 && this.array[i][j][1] == "unvisited"){
            fill("rgb(15,194,255)");
            //noStroke();
            rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
          }
  
        }
      }
    }
  }
  
  
  //rect(i*this.tileSize, j*this.tileSize, this.tileSize, this.tileSize);
