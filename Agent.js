class Agent {
    /**
     * Método Constructor para la clase Agene
     * @param {*} gender 0=X o 1=Y
     * @param {*} phase 0=Infancia, 1=madurez, 2=vejez, 3=muerte
     * @param {*} energy de 0 a 100%
     * @param {*} coordX cordenada inicial en X
     * @param {*} coordY cordenada inicial en X
     */
    constructor(gender, phase, energy, coordX, coordY) {
        this.gender = gender;
        this.phase = phase;
        this.energy = energy;
        this.coordX = coordX;
        this.coordY = coordY;
    }

    move() {
        
    }
}