function sketch_fly(p) {
    let p5_canvas;
    let flies = [];
    let flyimg1, flyimg2;
    let frog;

    p.preload = function () {
        flyimg1 = p.loadImage('../assets/flies/fly1.png');
        flyimg2 = p.loadImage('../assets/flies/fly2.png');
        frog = p.loadImage('../assets/flies/frog.png');
    }

    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight);
        p5_canvas = document.querySelector('#defaultCanvas0');
        p5_canvas.classList.add("fly");
        p5_canvas.setAttribute("style", "");

        p.noStroke();
        p.frameRate(30);

        //frog = new Frog();

        for (let i = 0; i < 25; i++) {
            flies.push(new Fly());       
        }
        //console.log(flies);
    }

    p.draw = function () {
        p.clear();
        p.frameRate(30);
        //background(125);
        let tonx = 68;
        let tony = p.height - 55;

        let mouse = new p5.Vector(p.mouseX, p.mouseY);
        flies.forEach((f, i) => {
            f.step();
            f.show();      
            f.seekmouse(mouse); 
            f.separation(flies);
            f.alignment(flies);
            f.cohesion(flies);

            if(f.pos.x < 250 && f.pos.x > 20 && f.pos.y > p.height - 250 && f.pos.y < p.height - 20) {
                p.frameRate(5);
                //frog.lash(f);
                tonx = f.pos.x;
                tony = f.pos.y;
                flies.splice(i, 1);
            }

        });

        p.image(frog, 20, p.height - 70, 70, 70);

        p.stroke(255, 204, 195);
        p.strokeWeight(3);
        p.line(68, p.height - 55, tonx, tony);

        //console.log(tonx, tony);

    }

    class Fly {
        constructor() {
            this.pos = p.createVector(p.random(p.width), p.random(p.height/2));
            this.vel = p.createVector(p.random(-1, 1), p.random(-1, 1));
            this.acc = p.createVector(0, 0);
            this.mousefield = 200;
            this.flyfield = 70;
            this.maxspeed = 1.5;
            this.maxforce = 0.1;
            this.sepdist = 40;
            this.perc = p.random(1);
            this.isDead = false;
        }
        
        applyForce(force) {
            this.acc.add(force);
        }

        step() {
            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);     

            if (this.pos.x > p.width + 100) {
                this.pos.x = -100;
            } else if (this.pos.x < -100) {
                this.pos.x = p.width + 100;
            }
            if (this.pos.y > p.height + 100) {
                this.pos.y = -100;
            } else if (this.pos.y < -100) {
                this.pos.y = p.height + 100;
            }
        }

        show() {
            // fill(0);
            // circle(this.pos.x, this.pos.y, 10);
            if(this.perc < 0.5) {
                p.image(flyimg1, this.pos.x - 10, this.pos.y - 10, 20, 20);
            } else {
                p.image(flyimg2, this.pos.x - 10, this.pos.y - 10, 20, 20);
            }
        }

        seekmouse(mouse) {
            let steer = p.createVector(0, 0);
            let d = p5.Vector.dist(this.pos, mouse);
            if (d < this.mousefield) {
                let diff = p5.Vector.sub(mouse, this.pos);
                diff.normalize();
                diff.mult(this.maxspeed);
                steer = p5.Vector.sub(diff,this.vel);
                steer.limit(this.maxforce); 
            }
            this.applyForce(steer);
        }

        seek(target) {
            let desired = p5.Vector.sub(target,this.pos);
            desired.normalize();
            desired.mult(this.maxspeed);
            let steer = p5.Vector.sub(desired,this.vel);
            steer.limit(this.maxforce); 
            return steer;
        }

        separation(boids) {
            let steer = p.createVector(0, 0);
            let count = 0;
            // For every boid in the system, check if it's too close
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.pos, boids[i].pos);
                // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
                if ((d > 0) && (d < this.sepdist)) {
                let diff = p5.Vector.sub(this.pos, boids[i].pos);
                diff.normalize();
                diff.div(d);      
                steer.add(diff);
                count++;            
                }
            }
            if (count > 0) {
                steer.div(count);
            }

            if (steer.mag() > 0) {
                steer.normalize();
                steer.mult(this.maxspeed);
                steer.sub(this.velocity);
                steer.limit(this.maxforce);
            }
            steer.mult(1.5);
            this.applyForce(steer);
        }

        alignment(boids) {
            let sum = p.createVector(0,0);
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.pos ,boids[i].pos);
                if ((d > 0) && (d < this.flyfield)) {
                sum.add(boids[i].vel);
                count++;
                }
            }
            let steer = p.createVector(0, 0);
            if (count > 0) {
                sum.div(count);
                sum.normalize();
                sum.mult(this.maxspeed);
                steer = p5.Vector.sub(sum, this.vel);
                steer.limit(this.maxforce);
            }
            this.applyForce(steer);
        }

        cohesion(boids) {
            let sum = p.createVector(0, 0);  
            let count = 0;
            for (let i = 0; i < boids.length; i++) {
                let d = p5.Vector.dist(this.pos, boids[i].pos);
                if ((d > 0) && (d < this.flyfield)) {
                sum.add(boids[i].pos); 
                count++;
                }
            }
            let steer = p.createVector(0, 0);
            if (count > 0) {
                sum.div(count);
                steer = this.seek(sum);
            }
            this.applyForce(steer);
        }
    }
}

new p5(sketch_fly, 'main');
