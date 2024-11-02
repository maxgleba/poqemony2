const createCharacter = ({ name, healthElement, attackButton, specialButton }) => ({
    name,
    health: 100,
    healthElement,
    attackButton,
    specialButton,
    enemy: null,

    attack() {
        return Math.floor(Math.random() * 10) + 5;
    },
    specialAttack() {
        return Math.floor(Math.random() * 20) + 10;
    },
    updateHealthBar() {
        this.healthElement.style.width = this.health + '%';
        if (this.health <= 0) {
            this.health = 0;
            alert(`${this.name} has fainted!`);
        }
    },
    showPokeball() {
        const pokeball = document.getElementById('pokeball');
        pokeball.style.visibility = 'visible';

        const { top: attackerTop, left: attackerLeft } = this.attackButton.parentElement.getBoundingClientRect();
        const { top: targetTop, left: targetLeft } = this.enemy.attackButton.parentElement.getBoundingClientRect();

        pokeball.style.top = `${attackerTop}px`;
        pokeball.style.left = `${attackerLeft}px`;

        setTimeout(() => {
            pokeball.style.top = `${targetTop}px`;
            pokeball.style.left = `${targetLeft}px`;
        }, 50);

        setTimeout(() => {
            pokeball.style.visibility = 'hidden';
        }, 800);
    },
    battle(isSpecial = false) {
        if (isAttacking) return;
        isAttacking = true;
        this.showPokeball();
        
        const damage = isSpecial ? this.specialAttack() : this.attack();
        this.enemy.health -= damage;
        if (this.enemy.health < 0) this.enemy.health = 0;
        
        this.enemy.updateHealthBar();
        
        addLog(`${this.name} used ${isSpecial ? 'Special Attack' : 'Attack'} on ${this.enemy.name}. Damage: ${damage}. ${this.enemy.name} has ${this.enemy.health} HP left.`);
        
        setTimeout(() => isAttacking = false, 800);
    }
});

const addLog = (message) => {
    const logs = document.getElementById('logs');
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    logs.prepend(logEntry);
};

const createClickCounter = (limit) => {
    let clicks = 0;
    return () => {
        if (clicks < limit) {
            clicks++;
            console.log(`Button clicked ${clicks} times. ${limit - clicks} clicks remaining.`);
            return true;
        } else {
            console.log(`No clicks remaining.`);
            return false;
        }
    };
};

const pikachu = createCharacter({
    name: 'Pikachu',
    healthElement: document.getElementById('health1'),
    attackButton: document.getElementById('attack1'),
    specialButton: document.getElementById('special1')
});

const charmander = createCharacter({
    name: 'Charmander',
    healthElement: document.getElementById('health2'),
    attackButton: document.getElementById('attack2'),
    specialButton: document.getElementById('special2')
});

pikachu.enemy = charmander;
charmander.enemy = pikachu;

let isAttacking = false;

const pikachuAttackCounter = createClickCounter(6);
const pikachuSpecialCounter = createClickCounter(6);
const charmanderAttackCounter = createClickCounter(6);
const charmanderSpecialCounter = createClickCounter(6);

pikachu.attackButton.addEventListener('click', () => {
    if (pikachuAttackCounter()) pikachu.battle();
});
pikachu.specialButton.addEventListener('click', () => {
    if (pikachuSpecialCounter()) pikachu.battle(true);
});
charmander.attackButton.addEventListener('click', () => {
    if (charmanderAttackCounter()) charmander.battle();
});
charmander.specialButton.addEventListener('click', () => {
    if (charmanderSpecialCounter()) charmander.battle(true);
});
