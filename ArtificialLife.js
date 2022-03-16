const inputAgents = document.getElementById('agent_quantity');
const inputYears = document.getElementById('input_years');
const execButton = document.getElementById('exec_button');
const pauseButton = document.getElementById('pause_button');
const replayButton = document.getElementById('replay_button');
const pYears = document.getElementById('year');
const canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let agentList = [];
let foodList = [];

let timeInterval;
let isSimulation = false;
let isPause = false;

execButton.addEventListener('click', executeSimulation);
pauseButton.addEventListener('click', pauseSimulation);
replayButton.addEventListener('click', replaySimulation);

function executeSimulation() {
    if (inputAgents.value && inputYears.value) {
        if (!isSimulation) {
            agentList = [];
            foodList = [];
            createAgents(inputAgents.value);
            drawAgents();
            simulateLife(inputYears.value);
        } else {
            window.alert('Hay una simulación en curso');
        }
    } else {
        window.alert('Aún no ha ingresado los datos');
    }
}

function pauseSimulation() {
    if (isSimulation) {
        isPause = true;
    }
}

function replaySimulation() {
    if (isPause) {
        isPause = false;
    }
}

function createAgents(numberOfAgents) {
    for (let i = 0; i < numberOfAgents; i++) {
        agentList.push(new Agent(randomGenerator(0,1), randomGenerator(0,100), randomGenerator(30, 100), randomGenerator(0, canvas.width), randomGenerator(0, canvas.height)));
    }
}

function randomGenerator(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function simulateLife(simulationYears) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    isSimulation = true;
    let actualYear = 1;
    let actualMonth = 1;
    timeInterval = setInterval(() => {
        if (!isPause) {
            if (actualMonth <= simulationYears*MONTHS) {
                pYears.innerText = actualYear;
                for (let i = 0; i < agentList.length; i++) {
                    agentList[i].move(canvas.width, canvas.height);
                }
                verifyAvailableFood();
                context.clearRect(0, 0, canvas.width, canvas.height);
                drawAgents();
                verifyDeaths();
                createFood();
                drawFood();
                validateCollisionBetweenAgents();
                validateCatchFood();

                if ((actualMonth % MONTHS) == 0) {
                    actualYear++;   
                    setAgentsAge();
                }
                actualMonth++;

            } else {
                clearInterval(timeInterval);
                isSimulation = false;
            }
        }
    }, 300);
}

function verifyDeaths() {
    for (let i = 0; i < agentList.length; i++) {
        if (agentList[i].phase == 4) {
            agentList.splice(i, 1);
        }
    }
}

function drawAgents() {
    let actualAgent;
    for (let i = 0; i < agentList.length; i++) {
        actualAgent = agentList[i];
        agentDie(actualAgent);
        drawAgent(actualAgent);
        reduceEnergy(actualAgent);
    }
}

function reduceEnergy(agent) {
    if (agent.energy > 0) {
        agent.energy--;
    }
}

function agentDie(agent) {
    if (agent.energy == 0 || agent.phase == 4) {
        agent.phase = 4;
        agent.energy = 0;
        agent.speed = 0;
    }
}

function drawAgent(agent) {
    context.beginPath();
    switch (agent.phase) {
        case 0:
            context.fillStyle = COLOR_CHILD;
            context.strokeStyle = COLOR_CHILD;
            break;
        case 1:
            context.fillStyle = COLOR_YOUNG;
            context.strokeStyle = COLOR_YOUNG;
            break;
        case 2:
            context.fillStyle = COLOR_ADULT;
            context.strokeStyle = COLOR_ADULT;
            break;
        case 3:
            context.fillStyle = COLOR_OLD;
            context.strokeStyle = COLOR_OLD;
            break;
        case 4:
            context.fillStyle = COLOR_DIE;
            context.strokeStyle = '#FFFFFF';
            agent.size = DIE_SIZE;
            break;
        default:
            break;
    }

    context.arc(agent.coordX, agent.coordY, agent.size, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();

    context.beginPath();
    context.font = `${FONT_SIZE}px Arial`;
    switch (agent.phase) {
        case 4:
            context.fillStyle = '#FFFFFF';
            break;
        default:
            context.fillStyle = '#000000';
            break;
    }
    context.fillText(agent.gender==0?'X-'+agent.age:'Y-'+agent.age, agent.coordX-10, agent.coordY);
    context.fillText(agent.energy+'%', agent.coordX-10, agent.coordY+FONT_SIZE);
    context.fill();
    context.closePath();
}

function createFood() {
    let random = randomGenerator(0, 100);
    if (random < 30 && foodList.length < agentList.length*2) {
        foodList.push(new Food(randomGenerator(15, 30), randomGenerator(0, canvas.width), randomGenerator(0, canvas.height)));
    }
}

function deleteFood() {
    for (let i = 0; i < foodList.length; i++) {
        if (foodList[i].availableTime == 0) {
            foodList.splice(i, 1);
        }
    }
}

function drawFood() {
    for (let i = 0; i < foodList.length; i++) {
        context.beginPath();
        context.fillStyle = COLOR_FOOD;
        context.arc(foodList[i].coordX, foodList[i].coordY, FOOD_SIZE, 0, 2 * Math.PI);
        context.fill();
        context.closePath();

        context.beginPath();
        context.font = `${FONT_SIZE}px Arial`;
        context.fillStyle = '#000000';
        context.fillText('E', foodList[i].coordX-5, foodList[i].coordY);
        context.fillText(foodList[i].availableTime, foodList[i].coordX-7, foodList[i].coordY+FONT_SIZE);
        context.fill();
        context.closePath();

        reduceTimeFood(foodList[i]);
    }
}

function reduceTimeFood(food) {
    if (food.availableTime > 0) {
        food.availableTime--;
    }
}

function verifyAvailableFood() {
    for (let i = 0; i < foodList.length; i++) {
        if (foodList[i].availableTime == 0) {
            foodList.splice(i, 1);
        }
    }
}

function validateCollisionBetweenAgents() {
    let agentA;
    let agentB;
    let distanBetweenAgents = 0;
    let isCollision = false;
    for (let i = 0; i < agentList.length-1; i++) {
        for (let j = i+1; j < agentList.length; j++) {
            agentA = agentList[i];
            agentB = agentList[j];
            distanBetweenAgents = Math.sqrt((((agentB.coordX + (agentB.size)) - (agentA.coordX + (agentA.size)))**2) + (((agentB.coordY + (agentB.size)) - (agentA.coordY + (agentA.size)))**2));
            if (distanBetweenAgents - (agentA.size + agentB.size) <= 0) {
                isCollision = true;
            }
            if (isCollision) {
                if (agentA.gender == 0 && agentB.gender == 0) {
                    if (agentA.phase == 1 && agentB.phase == 1) {
                        let randonDie = randomGenerator(0, 1);
                        if (randonDie == 0) {
                            agentA.phase = 4;
                            agentA.energy = 0;
                        } else {
                            agentB.phase = 4;
                            agentB.energy = 0;
                        }
                    } else if (agentA.phase < 3 && agentA.phase > 0 &&
                        agentB.phase < 3 && agentB.phase > 0 && agentA.phase != agentB.phase) {
                        if (agentA.energy > agentB.energy) {
                            agentB.phase = 4;
                            agentB.energy = 0;
                        } else {
                            agentA.phase = 4;
                            agentA.energy = 0;
                        }
                    }
                } else if (agentA.gender !== agentB.gender && agentA.phase == 2 && agentB.phase == 2) {
                    agentList.push(new Agent(randomGenerator(0,1), 0, randomGenerator(50, 100), agentA.gender==1?agentA.coordX:agentB.coordX, agentA.gender==1?agentA.coordY:agentB.coordY));
                }
            }
            isCollision = false;
        }
    }
}

function validateCatchFood() {
    for (let i = 0; i < agentList.length; i++) {
        agentList[i].pickUpFood(foodList);
    }
}

function setAgentsAge() {
    for (let i = 0; i < agentList.length; i++) {
        agentList[i].age++;
        agentList[i].setPhase();
    }
}