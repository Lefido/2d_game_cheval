
import { Player } from "./Player.js";
import { Angler1, Angler2, LuckyFish, HiveWhale, Drone} from "./Enemy.js";
import { InputHandler } from "./InputHandler.js";
import { Ui } from "./Ui.js";
import { Background } from "./Backgroud.js";
import { Particule } from "./Particule.js";
import { FireExplosion, SmokeExplosion } from "./Explosion.js";


export class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height
        this.background = new Background(this)
        this.player = new Player(this);
        this.Input = new InputHandler(this);
        this.ui = new Ui(this);
        this.keys = [];
        this.enemies = [];
        this.particules = [];
        this.explosions = [];
        this.enemyTimer = 0;
        this.enemyInterval = 2000
        this.ammo = 20;
        this.maxAmmo = 50;
        this.ammoTimer = 0;
        this.ammoInterval = 350;
        this.gameOver = false;
        this.score = 0;
        this.winningScore = 100;
        this.gameTime = 0;
        this.timeLimite = 40000;
        this.speed = 1;
        this.debug = false;
       
    }
    update(deltaTime) {
        if (!this.gameOver) this.gameTime += deltaTime;
        if (this.gameTime > this.timeLimite) this.gameOver = true;
        this.background.update();
        this.background.layer4.update();
        this.player.update(deltaTime);
        if (this.ammoTimer > this.ammoInterval) {
            if (this.ammo < this.maxAmmo) this.ammo++
            this.ammoTimer = 0;
        } else {
            this.ammoTimer += deltaTime;
        }
        this.particules.forEach(particule => particule.update());
        this.particules = this.particules.filter(particule => !particule.markedForDeletion);

        this.explosions.forEach(explosion => explosion.update(deltaTime));
        this.explosions = this.explosions.filter(explosion => !explosion.markedForDeletion);
        

        this.enemies.forEach(enemy => {
            enemy.update()
            if (this.checkCollision (this.player, enemy)){
                enemy.markedForDeletion = true;
                this.addExplosion(enemy)
                for (let i = 0; i < enemy.score; i++) {
                    this.particules.push(new Particule(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                }
                if (enemy.type === "lucky") this.player.enterPowerUp()
                else if (!this.gameOver) this.score--;
            }
            this.player.projectiles.forEach(projectile => {
                // console.log(this.checkCollision(projectile, enemy))
                if (this.checkCollision(projectile, enemy)) {
                    enemy.lives--;
                    projectile.markedForDeletion = true;
                    this.particules.push(new Particule(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                    if (enemy.lives <= 0) {
                        for (let i = 0; i < enemy.score; i++) {
                            this.particules.push(new Particule(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                        }
                        enemy.markedForDeletion = true;
                        this.addExplosion(enemy);
                        if (enemy.type === "hive") {
                            for (let i = 0; i < 5; i++) {
                                this.enemies.push(new Drone(this, enemy.x + Math.random() * enemy.width, enemy.y + Math.random() * enemy.height * 0.5))
                            }
                           
                        }
                        if (!this.gameOver) this.score += enemy.score;

                        // if (this.score > this.winningScore) this.gameOver = true;

                    }
                } 
            })
            

        });
        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
        if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
        
    }
    draw(context) {
        this.background.draw(context);
        this.ui.draw(context);
        this.player.draw(context);
       
        this.particules.forEach(particule => particule.draw(context));
        this.enemies.forEach(enemy => {
            enemy.draw(context)
        });

        this.explosions.forEach(explosion => {
            explosion.draw(context)
        });

        
        this.background.layer4.draw(context);

    }
    addEnemy() {
        const randomize = Math.random()
        if (randomize < 0.3) this.enemies.push(new Angler1(this));
        else if (randomize < 0.6) this.enemies.push(new Angler2(this));
        else if (randomize < 0.7) this.enemies.push(new HiveWhale(this));
        else this.enemies.push(new LuckyFish(this));
        
    }

    addExplosion(enemy) {
        const randomize = Math.random()
        if (randomize < 0.5) { this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
        } else {
            this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5))
        }
    }

    checkCollision(rect1, rect2) {
        return ( rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y<rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y)

    }
}