

export class Projectile {
    constructor(game, x, y) {

        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 20;
        this.height = 10;
        this.spedd = 3;
        this.markedForDeletion = false;
        this.image = document.getElementById('projectile')
    }
    update() {
        this.x += this.spedd
        if (this.x > this.game.width * 0.95) this.markedForDeletion = true;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
}