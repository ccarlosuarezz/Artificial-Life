const canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

const MAX_NUMBER_AGENTS = 20;

const COLOR_CHILD = '#42C2FF';
const COLOR_ADULT = '#F76E11';
const COLOR_OLD = '#EEEEEE';
const COLOR_DIE = '#000000';
const FONT_SIZE = 11;

let agentList = [];

function createAgents() {
    for (let i = 0; i < MAX_NUMBER_AGENTS; i++) {
        let phase = randomGenerator(0,3);
        agentList.push(new Agent(randomGenerator(0,1), phase, phase!=3?randomGenerator(0, 100):0, randomGenerator(0, canvas.width), randomGenerator(0, canvas.height)));
    }
    console.log(agentList);
}

function randomGenerator(max, min) {
    return Math.round(Math.random() * (max - min)) + min;
}

function drawAgents() {
    let actualAgent;
    for (let i = 0; i < agentList.length; i++) {
        actualAgent = agentList[i];
        drawAgent(actualAgent.gender, actualAgent.phase, actualAgent.energy, actualAgent.coordX, actualAgent.coordY);
    }
}

function drawAgent(gender, phase, energy, coordX, coordY) {
    let size = 0;
    context.beginPath();
    switch (phase) {
        case 0:
            context.fillStyle = COLOR_CHILD;
            context.strokeStyle = COLOR_CHILD;
            size = 18;
            break;
        case 1:
            context.fillStyle = COLOR_ADULT;
            context.strokeStyle = COLOR_ADULT;
            size = 21;
            break;
        case 2:
            context.fillStyle = COLOR_OLD;
            context.strokeStyle = COLOR_OLD;
            size = 18;
            break;
        case 3:
            context.fillStyle = COLOR_DIE;
            context.strokeStyle = '#FFFFFF';
            size = 15;
            break;
        default:
            break;
    }

    context.arc(coordX, coordY, size, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
    context.closePath();

    context.beginPath();
    context.font = `${FONT_SIZE}px Arial`;
    switch (phase) {
        case 3:
            context.fillStyle = '#FFFFFF';
            break;
        default:
            context.fillStyle = '#000000';
            break;
    }
    context.fillText(gender==0?'X':'Y', coordX-5, coordY);
    context.fillText(energy+'%', coordX-10, coordY+FONT_SIZE);
    context.fill();
    context.closePath();
}

createAgents();
drawAgents();