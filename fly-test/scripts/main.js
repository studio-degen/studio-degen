let flies = [];
let flyimg1, flyimg2;

function preload() {
    flyimg1 = loadImage('../assets/img/fly1.png');
    flyimg2 = loadImage('../assets/img/fly2.png');
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    for (let i = 0; i < 8; i++) {
        flies.push(new Fly());       
    }
    console.log(flies);
}

function draw() {
    clear();
    let target = new p5.Vector(mouseX, mouseY);
    flies.forEach((f) => {
        f.step();
        f.show();      
        f.seek(target); 
        f.separate(flies);
    });

}


class Fly {
    constructor() {
        this.pos = new p5.Vector(random(width), random(height));
        this.vel = new p5.Vector(random(-1, 1), random(-1, 1));
        this.field = 200;
        this.maxspeed = 0.8;
        this.sepdist = 30;
        this.perc = random(1);
    }
    
    applyForce(force) {
        this.vel.add(force);
    }

    step() {
        this.vel.limit(this.maxspeed);
        this.pos.add(this.vel);       

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

    show() {
        // fill(0);
        // circle(this.pos.x, this.pos.y, 10);
        if(this.perc < 0.5) {
            image(flyimg1, this.pos.x, this.pos.y, 20, 20);
        } else {
            image(flyimg2, this.pos.x, this.pos.y, 20, 20);
        }
    }

    seek(target) {
        let steer = createVector(0, 0);
        let d = p5.Vector.dist(this.pos, target);
        if (d < this.field) {
            let diff = p5.Vector.sub(target, this.pos);
            diff.normalize();
            steer.add(diff);
        }

        if (steer.mag() > 0) {
            steer.normalize();
            steer.sub(this.vel);
            steer.limit(this.maxspeed);
        }
        this.applyForce(steer);
    }

    separate(boids) {
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
            steer.sub(this.vel);
            steer.limit(this.maxspeed);
        }
        this.applyForce(steer);
    }
}