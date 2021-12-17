function sketch_ant(p) {
    let antcanvas;
    let x, y;
    let eggs = [];
    let ants = [];

    p.setup = function () {
        antcanvas = p.createCanvas(window.innerWidth, window.innerHeight);
        pg = p.createGraphics(window.innerWidth, window.innerHeight);

        // antcanvas.parent('scribble');
        p.background(0);
        
        x = p.width/2;
        y = p.height/2;
        
        p.frameRate(60);
    }

    p.draw = function () {


        p.noStroke();
        
        if (p.frameCount < 15000) {
            if (p.frameCount % 240 == 0){
                if(p.random(1) < 0.7){
                    pg.noStroke();
                    pg.fill(147, 138, 194);
                    pg.rect(x - 10, y - 10, 20, 20); 
                    eggs.push({pos: {x, y}});
                }
                //console.log(eggs.length);
                // if(eggs.length > 1) {
                //   console.log(eggs[0]['pos']);
                // }
            }
        }

        if (p.frameCount < 12000) {
            if (p.frameCount % 360 == 0){
                if(p.random(1) < 0.5 && eggs.length > 3){
                    ants.push(new Ant(eggs));
                    //console.log(ants[0].indexnum);
                }
                //console.log(ants.length);
            }
            
            if(p.frameCount > 3000){
                if (p.frameCount % 240 == 0){
                    if(p.random(1) < 0.6 && eggs.length > 3){
                        ants.push(new Ant(eggs));
                        //console.log(ants[0].indexnum);
                    }
                //console.log(ants);
                }
            }
            
            p.fill(255, 255, 255, 20);
            p.rect(x, y, 10, 10);
        }

        ants.forEach((a) => {
            a.show();
            a.step();
        });

        
        let choice  = [0, 1, 2, 3, p.int(p.random(4)), p.int(p.random(4))];
        let r = p.random(choice);
        //console.log(r);
        
        if(r == 0){
            x = x + 10;
        }else if(r == 1){
            x = x - 10;
        }else if(r == 2){
            y = y + 10;
        }else {
            y = y - 10;
        }
        
        if(x < 20) {
            x = p.width - 20;
        } else if(x > p.width - 20) {
            x = 20;
        }
        
        if(y < 20) {
            y = p.height - 20;
        } else if(y > p.height - 20) {
            y = 20;
        }
        // x = constrain(x, 0, width - 10);
        // y = constrain(y, 0, height - 10);
        
        p.image(pg, 0, 0);

    }

    class Ant {
        constructor(eggs){
            this.eggs = eggs.slice();
            this.indexnum = p.int(p.random(0, this.eggs.length - 1));
            this.posval = this.eggs[this.indexnum]['pos'];
            this.pos = p.createVector(this.posval.x, this.posval.y);

            this.eggs.splice(this.indexnum, 1);
            this.dists = [];
            this.antcoords = [];
            
            this.eggs.forEach((e) => {
                let temp = p.createVector(e['pos'].x, e['pos'].y);
                let d = p.int(p.dist(this.pos.x, this.pos.y, temp.x, temp.y));
                this.dists.push(d);
                this.antcoords.push({distance: d, coord: temp});
            });
            
            //console.log(this.dists);
            let maxdist = p.max(this.dists);
            let mindist = p.min(this.dists);
            
            if (p.random(1) < 0.7) {
                this.antcoords.forEach((c) => {
                    if (c['distance'] == maxdist) {
                    this.tar = c['coord'];
                    }
                });
            } else {
                this.antcoords.forEach((c) => {
                    if (c['distance'] == mindist) {
                    this.tar = c['coord'];
                    }
                });
            };

            //this.eggs.splice(this.indexnum, 1);
            // this.indexnumtar = p.int(p.random(0, this.eggs.length - 1))
            // this.tarval = this.eggs[this.indexnumtar]['pos'];
            
            
            // this.tar = p.createVector(this.tarval.x, this.tarval.y);
            this.vel = p.createVector(0, 0);
            
        }
        
        show(){
            p.fill(86, 79, 161); 
            p.rect(this.pos.x -1.5, this.pos.y - 1.5, 3, 3);
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