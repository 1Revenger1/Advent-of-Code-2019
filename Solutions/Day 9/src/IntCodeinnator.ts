import * as readline from 'readline';

let rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const PARAM_C_POINTER = 4;
const PARAM_B_POINTER = 2;
const PARAM_A_POINTER = 1;

interface OP {
    length : number;
    pointerMask : number;
    run(inst : Instruction, memory : number[]) : void;
}

interface Instruction {
    op : number;
    noun : number;
    verb : number;
    dest : number;
}

export class Storage {
    memory : number[] = [];

    constructor(input : number[]) {
        this.setMemory(input.concat(new Array(100000).fill(0)));
    }

    static importFile(input : string) : Storage {
        let strings = input.split(",");
        let memory : number[] = [];

        for(let i = 0; i < strings.length; i++) {
            memory[i] = parseInt(strings[i]);
        }
        return new Storage(memory);
    }

    getMemory() : number[] {
        return [...this.memory];
    }

    setMemory(newMem : number[]) : void {
        this.memory = [...newMem];
    }
}

export class IntCodeinnator {
    ops : Map<number, OP> = new Map<number, OP>();
    pointer : number;
    inst : Instruction;
    storage : Storage;
    memory : number[];
    halt = false;
    input : number[];
    inputIndex = 0;
    output = [];
    increment = true;
    inputFunction = null;
    outputFunction = null;
    relativeBase : number;

    constructor(image : Storage) {
        this.ops.set(1,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = inst.noun + inst.verb }}); // Add
        this.ops.set(2,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = inst.noun * inst.verb }}); // Mult
        this.ops.set(3,  { length: 2, pointerMask: PARAM_A_POINTER, run: async (inst, memory) => { memory[inst.noun] = ((this.input != null && this.inputIndex >= this.input.length) || this.input == null) ? await this.inputFunction(): this.input[this.inputIndex++]; }}); // Query -> Insert
        this.ops.set(4,  { length: 2, pointerMask: 0,               run: async (inst, memory) => { if(this.outputFunction) { this.outputFunction(inst.noun)}; this.output.push(inst.noun) }}); // Print
        this.ops.set(5,  { length: 3, pointerMask: 0,               run: async (inst, memory) => { if(inst.noun != 0) { this.pointer = inst.verb; this.increment = false; }}}); // Jump if Not Equal
        this.ops.set(6,  { length: 3, pointerMask: 0,               run: async (inst, memory) => { if(inst.noun == 0) { this.pointer = inst.verb; this.increment = false; }}}); // Jump if Equal
        this.ops.set(7,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = (inst.noun < inst.verb) ? 1 : 0}}); // Less Than
        this.ops.set(8,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = (inst.noun == inst.verb) ? 1 : 0}}); // Equal to
        this.ops.set(9,  { length: 2, pointerMask: 0              , run: async (inst, memory) => { this.relativeBase += inst.noun }});
        this.ops.set(99, { length: 1, pointerMask: 0,               run: async (inst, memory) => { this.halt = true; }}) // Halt
        
        this.storage = image;
        this.reset();
    }

    reset() {
        this.memory = this.storage.getMemory();
        this.halt = false;
        this.pointer = 0;
        this.inputIndex = 0;
        this.output = [];
        this.input  = [];
        this.inputFunction = null;
        this.outputFunction = null;
        this.relativeBase = 0;
    }

    /**
     * Check if given place is equal to 1
     * @param input input string
     * @param place place from right
     */
    calcImmedate(input : number, place: number) : boolean {
        let length = Math.pow(10, 2 + place);
        return input > length ?
            Math.floor(input / length % 10) == 1:
            false
    }

    calcRelative(input : number, place: number) : boolean {
        let length = Math.pow(10, 2 + place);
        return input > length ?
            Math.floor(input / length % 10) == 2:
            false
    }

    async run(noun? : number, verb? : number, input? : number[], inputFun? : CallableFunction, output? : CallableFunction) : Promise<number[]> {
        if(noun) this.memory[1] = noun;
        if(verb) this.memory[2] = verb;
        if(input) this.input = input;
        if(inputFun) this.inputFunction = inputFun;
        if(output) this.outputFunction = output;

        while(!this.halt) {
            this.increment = true;
            let opRaw = this.memory[this.pointer];

            let opNum = opRaw % 100;
            let op : OP = this.ops.get(opNum);
            if(op == undefined) {
                console.log(opNum);
            }

            let over1 = op.pointerMask & PARAM_A_POINTER;
            let over2 = op.pointerMask & PARAM_B_POINTER;
            let over3 = op.pointerMask & PARAM_C_POINTER;

            // Calculate if pointer or needs to be immediate
            let immedOne = over1 ? true : this.calcImmedate(opRaw, 0);
            let immedTwo = over2 ? true : this.calcImmedate(opRaw, 1);
            let immedThree = over3 ? true : this.calcImmedate(opRaw, 2);

            let pointerP1 = this.memory[this.pointer + 1];
            let pointerP2 = this.memory[this.pointer + 2];
            let pointerP3 = this.memory[this.pointer + 3];

            let relatOne = this.calcRelative(opRaw, 0);
            let relatTwo = this.calcRelative(opRaw, 1);
            let relatThree = this.calcRelative(opRaw, 2);

            this.inst = {
                op: opNum,
                noun: immedOne || over1 ? pointerP1 : (relatOne ? this.memory[this.relativeBase + pointerP1] : this.memory[pointerP1]),
                verb: immedTwo || over2 ? pointerP2 : (relatTwo ? this.memory[this.relativeBase + pointerP2] : this.memory[pointerP2]),
                dest: immedThree || over3 ? pointerP3 : (relatThree ? this.memory[this.relativeBase + pointerP3] : this.memory[pointerP3])
            }

            if(over1 && relatOne) this.inst.noun += this.relativeBase;
            if(over2 && relatTwo) this.inst.verb += this.relativeBase;
            if(over3 && relatThree) this.inst.dest += this.relativeBase;

            await op.run(this.inst, this.memory);
            
            if(this.increment) this.pointer += op.length;
        }
        return [...this.output];
    }
}
