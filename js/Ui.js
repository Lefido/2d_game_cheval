
export class Ui {
    constructor(game) {
        this.game = game;
        this.fontSize = 35;
        this.fontFamily = "Bangers";
        this.color = 'white';
    }
    
    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black'
        context.font = this.fontSize + "px " + this.fontFamily;
        // Score
        context.fillText("Score : " + this.game.score, 20, 40);

        // Timer

        const formatedTime = (this.game.gameTime * 0.001).toFixed(1);
        context.fillText("Timer :" + formatedTime, 20, 110);
        // Game over messages
        if (this.game.gameOver) {
            context.textAlign = 'center'
            let message1;
            let message2;
            if (this.game.score > this.game.winningScore) {
                message1 = 'You Win!'
                message2 = 'Well done!'
            } else {
                message1 = 'You lose!'
                message2 = 'Try again next time!'
            }
            context.font = '50px ' + this.fontFamily;
            context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 40)
            context.font = '25px ' + this.fontFamily;
            context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 40)

        }

        // Ammo
        if (this.game.player.powerUp) context.fillStyle = '#ffffbd'
        for (let i = 0; i < this.game.ammo; i++) {
            context.fillRect(20 + 5 * i , 54, 3 , 20);
        }
        context.restore();
    }
}