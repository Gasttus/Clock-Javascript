window.Drawer = function (ctx, radius) {

    this.ctx = ctx;
    this.radius = radius;

    this.drawClock = () => {
        this.drawFace(this.ctx, this.radius);
        this.drawNumbers(this.ctx, this.radius);
    }

    this.drawTime = (secondAngle, minuteAngle, hourAngle, secondColor, minuteColor, hourColor) => {
        this.drawHand(secondAngle, this.radius * 0.9, this.radius * 0.02, secondColor);
        this.drawHand(minuteAngle, this.radius * 0.8, this.radius * 0.07, minuteColor);
        this.drawHand(hourAngle, this.radius * 0.5, this.radius * 0.07, hourColor);
        
    }

    this.drawHand = (pos, length, width, hexColor) => {
        this.ctx.beginPath();
        this.ctx.strokeStyle = hexColor;
        this.ctx.lineWidth = width;
        this.ctx.lineCap = "round";
        this.ctx.moveTo(0, 0);
        this.ctx.rotate(pos);
        this.ctx.lineTo(0, -length);
        this.ctx.stroke();
        this.ctx.rotate(-pos);
        return pos;
    }

    this.drawFace = () => {
        let gradTwo = this.ctx.createRadialGradient(0, 0, this.radius * 0.4, 0, 0, this.radius * 1.05);
        gradTwo.addColorStop(0, "#006600");
        gradTwo.addColorStop(1, "#00cc00");
        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius, 0, 2 * Math.PI);
        this.ctx.fillStyle = gradTwo;
        this.ctx.fill();

        let gradOne = this.ctx.createRadialGradient(0, 0, this.radius * 0.95, 0, 0, this.radius * 1.05);
        gradOne.addColorStop(0, 'Black');
        gradOne.addColorStop(0.3, '#1f94ad');
        gradOne.addColorStop(0.5, '#33b299');
        this.ctx.strokeStyle = gradOne;
        this.ctx.lineWidth = this.radius * 0.1;
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(0, 0, this.radius * 0.1, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#330000';
        this.ctx.fill();
    }

    this.drawNumbers = () => {
        let ang;
        let num;
        this.ctx.font = this.radius * 0.15 + "px arial";
        this.ctx.textBaseline = "middle";
        this.ctx.textAlign = "Left";
        for (num = 1; num < 13; num++) {
            ang = num * Math.PI / 6;
            this.ctx.rotate(ang);
            this.ctx.translate(0, -this.radius * 0.87);
            this.ctx.rotate(-ang);
            this.ctx.fillText(num.toString(), -25, 0);
            this.ctx.rotate(ang);
            this.ctx.translate(0, this.radius * 0.87);
            this.ctx.rotate(-ang);
        }
    }
}