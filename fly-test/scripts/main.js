let flies = [];
let flyimg1, flyimg2;
let frog;

function preload() {
    flyimg1 = loadImage('../assets/img/fly1.png');
    flyimg2 = loadImage('../assets/img/fly2.png');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);

    noStroke();

    frog = new Frog();

    for (let i = 0; i < 20; i++) {
        flies.push(new Fly());       
    }
    console.log(flies);
}

function draw() {
    clear();
    //background(125);
    noStroke();
    fill('red');
    rect(0, height - 400, 400, 400);

    frog.show();

    let mouse = new p5.Vector(mouseX, mouseY);
    flies.forEach((f) => {
        f.step();
        f.show();      
        f.seekmouse(mouse); 
        f.separation(flies);
        f.alignment(flies);
        f.cohesion(flies);

        if(f.pos.x < 350 && f.pos.y > height - 350) {
            frog.lash(f);
            f.isDead = true;
        }
    });

}

class Frog {
    constructor() {
        this.pos = createVector(70, height-70);
        this.tongue = createVector(70, height-70);
    }

    show() {
        fill(255);
        circle(this.pos.x, this.pos.y, 20);
        circle(this.tongue.x, this.tongue.y, 5);
    }

    lash(fly) {
        // let dx = (fly.pos.x - this.tongue.x) * 0.01;
        // let dy = (fly.pos.y - this.tongue.y) * 0.01;

        // this.tongue.x += dx;
        // this.tongue.y += dy;

        // if (this.tongue.x == fly.pos.x && this.tongue.y == fly.pos.y) {
        //     this.tongue = createVector(70, height-70);
        // } 

        stroke(0);
        strokeWeight(2);
        line(this.pos.x, this.pos.y, fly.pos.x, fly.pos.y);
    }
    
}



class Fly {
    constructor() {
        this.pos = createVector(random(width), random(height));
        this.vel = createVector(random(-1, 1), random(-1, 1));
        this.acc = createVector(0, 0);
        this.mousefield = 200;
        this.flyfield = 70;
        this.maxspeed = 0.8;
        this.maxforce = 0.05;
        this.sepdist = 30;
        this.perc = random(1);
        this.isDead = false;
    }
    
    applyForce(force) {
        this.acc.add(force);
    }

    step() {
        if(!this.isDead) {
            this.vel.add(this.acc);
            this.vel.limit(this.maxspeed);
            this.pos.add(this.vel);
            this.acc.mult(0);     

            if (this.pos.x > width + 100) {
                this.pos.x = -100;
            } else if (this.pos.x < -100) {
                this.pos.x = width + 100;
            }
            if (this.pos.y > height + 100) {
                this.pos.y = -100;
            } else if (this.pos.y < -100) {
                this.pos.y = height + 100;
            }
        }
    }

    show() {
        if(!this.isDead) {
            // fill(0);
            // circle(this.pos.x, this.pos.y, 10);
            if(this.perc < 0.5) {
                image(flyimg1, this.pos.x, this.pos.y, 20, 20);
            } else {
                image(flyimg2, this.pos.x, this.pos.y, 20, 20);
            }
        }
    }

    seekmouse(mouse) {
        let steer = createVector(0, 0);
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
        let steer = createVector(0, 0);
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
        let sum = createVector(0,0);
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.pos ,boids[i].pos);
            if ((d > 0) && (d < this.flyfield)) {
            sum.add(boids[i].vel);
            count++;
            }
        }
        let steer = createVector(0, 0);
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
        let sum = createVector(0, 0);  
        let count = 0;
        for (let i = 0; i < boids.length; i++) {
            let d = p5.Vector.dist(this.pos, boids[i].pos);
            if ((d > 0) && (d < this.flyfield)) {
            sum.add(boids[i].pos); 
            count++;
            }
        }
        let steer = createVector(0, 0);
        if (count > 0) {
            sum.div(count);
            steer = this.seek(sum);
        }
        this.applyForce(steer);
    }
}