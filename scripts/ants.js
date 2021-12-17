function sketch_ant(p) {
    let antcanvas;
    let x, y;
    let eggs = [];
    let ants = [];

    p.setup = function () {
        antcanvas = p.createCanvas(window.innerWidth, window.innerHeight);
        // antcanvas.parent('scribble');
        p.background(0);
        
        x = p.width/2;
        y = p.height/2;
        
        p.frameRate(30);
    }

    p.draw = function () {


        p.noStroke();
        
        if (p.frameCount % 60 == 0){
            if(p.random(1) < 0.7){
                p.fill(86, 79, 161);
                p.rect(x, y, 10, 10); 
                eggs.push({pos: {x, y}});
            }
            console.log(eggs.length);
            // if(eggs.length > 1) {
            //   console.log(eggs[0]['pos']);
            // }
        }
        
        if (p.frameCount % 180 == 0){
            if(p.random(1) < 0.5 && eggs.length > 3){
                ants.push(new Ant(eggs));
                //console.log(ants[0].indexnum);
            }
            console.log(ants.length);
        }
        
        if(p.frameCount > 10000){
            if (p.frameCount % 240 == 0){
                if(p.random(1) < 0.6 && eggs.length > 3){
                    ants.push(new Ant(eggs));
                    //console.log(ants[0].indexnum);
                }
            //console.log(ants);
            }
        }
        
        ants.forEach((a) => {
            a.show();
            a.step();
        });
        
        
        p.fill(255, 255, 255, 20);
        p.rect(x, y, 10, 10);

        
        let r = p.int(p.random(4));
        //console.log(r);
        
        if(r == 0){
            x = x + 5;
        }else if(r == 1){
            x = x - 5;
        }else if(r == 2){
            y = y + 5;
        }else {
            y = y - 5;
        }
        
        if(x < 0) {
            x = p.width - 1;
        } else if(x > p.width) {
            x = 1;
        }
        
        if(y < 0) {
            y = p.height - 1;
        } else if(y > p.height) {
            y = 1;
        }
        // x = constrain(x, 0, width - 10);
        // y = constrain(y, 0, height - 10);
        
    }

    class Ant {
        constructor(eggs){
            this.eggs = eggs;
            this.indexnum = p.int(p.random(0, this.eggs.length - 1));
            this.posval = this.eggs[this.indexnum]['pos'];
            //this.eggs.splice(this.indexnum, 1);
            this.indexnumtar = p.int(p.random(0, this.eggs.length - 1))
            this.tarval = this.eggs[this.indexnumtar]['pos'];
            
            this.pos = p.createVector(this.posval.x, this.posval.y);
            this.tar = p.createVector(this.tarval.x, this.tarval.y);
            this.vel = p.createVector(0, 0);
            
        }
        
        show(){
            p.fill(147, 138, 194);
            p.rect(this.pos.x + 4, this.pos.y + 4, 2, 2);
        }
        
        step(){
            let move = p5.Vector.sub(this.tar, this.pos);
            this.vel.add(move);
            this.vel.normalize();
        //console.log(vel);
            this.vel.mult(0.5);
            
            if(p.dist(this.pos.x, this.pos.y, this.tar.x, this.tar.y) >= 1) {
            this.pos.add(this.vel);
            } 
        }
    }
}

new p5(sketch_ant, 'scribble');