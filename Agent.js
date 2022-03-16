class Agent {

    phase = 0;

    /**
     * Método Constructor para la clase Agene
     * @param {*} gender 0=X o 1=Y
     * @param {*} phase 0=Infancia, 1=Juventud, 2=madurez, 3=vejez, 4=muerte
     * @param {*} energy de 0 a 100%
     * @param {*} coordX cordenada inicial en X
     * @param {*} coordY cordenada inicial en X
     */
    constructor(gender, age, energy, coordX, coordY) {
        this.gender = gender;
        this.age = age;
        this.setPhase();
        this.energy = energy;
        this.speed = this.generateSpeed(this.phase);
        this.size = this.setSize(this.phase);
        this.coordX = coordX;
        this.coordY = coordY;
        this.angle = this.steeringAngle(0, 360);
    }

    setPhase() {
        if (this.age >= 0 && this.age <= 10) {
            this.phase = 0;
        } else if (this.age >= 11 && this.age <= 20) {
            this.phase = 1;
        } else if (this.age >= 21 && this.age <= 60) {
            this.phase = 2;
        } else if (this.age >= 61 && this.age <= 100) {
            this.phase = 3;
        } else {
            this.phase = 4;
        }
        this.setSize(this.phase);
    }

    generateSpeed(phase) {
        let speed = 0;
        switch (phase) {
            case 0:
                speed = CHILD_SPEED;
                break;
            case 1:
                speed = YOUNG_SPEED;
                break;
            case 2:
                speed = ADULT_SPEED;
                break;
            case 3:
                speed = OLD_SPEED;
                break;
            default:
                break;
        }
        return speed;
    }

    setSize(phase) {
        let size = 0;
        switch (phase) {
            case 0:
                size = CHILD_SIZE;
                break;
            case 1:
                size = YOUNG_SIZE;
                break;
            case 2:
                size = ADULT_SIZE;
                break;
            case 3:
                size = OLD_SIZE;
                break;
            default:
                break;
        }
        return size;
    }

    move(widthArea, heightArea) {
        if (this.coordX <= 0) {
            this.angle = this.steeringAngle(270, 450);
        } else if (this.coordX >= widthArea) {
            this.angle = this.steeringAngle(90, 270);
        } else if (this.coordY <= 0) {
            this.angle = this.steeringAngle(0, 180);
        } else if (this.coordY >= heightArea) {
            this.angle = this.steeringAngle(180, 360);
        }
        let angleInRadians = this.angle * Math.PI / 180;
        this.coordX = Math.round(this.coordX + this.speed * Math.cos(angleInRadians));
        this.coordY = Math.round(this.coordY + this.speed * Math.sin(angleInRadians));
    }

    steeringAngle(min, max) {
        return Math.round(Math.random() * (max - min)) + min;
    }

    pickUpFood(foodList) {
        let getFood = false;
        let distanBetweenFood = 0;
        for (let i = 0; i < foodList.length; i++) {
            distanBetweenFood = Math.sqrt((((foodList[i].coordX + FOOD_SIZE) - (this.coordX + this.size))**2) +(((foodList[i].coordY + FOOD_SIZE) - (this.coordY + this.size))**2));
            if (distanBetweenFood - (this.size + FOOD_SIZE) <= 0) {
                getFood = true;
            }
            if (getFood) {
                this.energy = 100;
                foodList.splice(i, 1);
                break;
            }
        }
    }
}