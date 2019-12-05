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
        this.setMemory(input);
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
    increment = true;

    constructor(image : Storage) {
        this.ops.set(1,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = inst.noun + inst.verb }}); // Add
        this.ops.set(2,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = inst.noun * inst.verb }}); // Mult
        this.ops.set(3,  { length: 2, pointerMask: PARAM_A_POINTER, run: async (inst, memory) => { memory[inst.noun] = await new Promise((res, rej) => rl.question("?", answer => res(parseInt(answer))))}}); // Query -> Insert
        this.ops.set(4,  { length: 2, pointerMask: 0,               run: async (inst, memory) => { console.log(inst.noun) }}); // Print
        this.ops.set(5,  { length: 3, pointerMask: 0,               run: async (inst, memory) => { if(inst.noun != 0) { this.pointer = inst.verb; this.increment = false; }}}); // Jump if Not Equal
        this.ops.set(6,  { length: 3, pointerMask: 0,               run: async (inst, memory) => { if(inst.noun == 0) { this.pointer = inst.verb; this.increment = false; }}}); // Jump if Equal
        this.ops.set(7,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = (inst.noun < inst.verb) ? 1 : 0}}); // Less Than
        this.ops.set(8,  { length: 4, pointerMask: PARAM_C_POINTER, run: async (inst, memory) => { memory[inst.dest] = (inst.noun == inst.verb) ? 1 : 0}}); // Equal to
        this.ops.set(99, { length: 1, pointerMask: 0,               run: async (inst, memory) => { this.halt = true; }}) // Halt
        
        this.storage = image;
        this.reset();
    }

    reset() {
        this.memory = this.storage.getMemory();
        this.halt = false;
        this.pointer = 0;
    }

    /**
     * Check if given place is equal to 1
     * @param input input string
     * @param place place from right
     */
    calcImmedate(input : string, place: number) : boolean {
        return input.length > place ?
            // 0 index, subtract 1
            parseInt(input.charAt(input.length - place - 1)) == 1:
            false
    }

    async run(noun? : number, verb? : number) : Promise<number[]> {
        if(noun) this.memory[1] = noun;
        if(verb) this.memory[2] = verb;

        while(!this.halt) {
            this.increment = true;
            let opStr = "" + this.memory[this.pointer];

            let opNum = parseInt(opStr.substring(opStr.length > 2 ? opStr.length - 2 : 0));
            let op : OP = this.ops.get(opNum);

            // Calculate if pointer or needs to be immediate
            let immedOne = op.pointerMask & PARAM_A_POINTER ? true : this.calcImmedate(opStr, 2);
            let immedTwo = op.pointerMask & PARAM_B_POINTER ? true : this.calcImmedate(opStr, 3);
            let immedThree = op.pointerMask & PARAM_C_POINTER ? true : this.calcImmedate(opStr, 4);

            let pointerP1 = this.memory[this.pointer + 1];
            let pointerP2 = this.memory[this.pointer + 2];
            let pointerP3 = this.memory[this.pointer + 3];

            this.inst = {
                op: opNum,
                noun: immedOne ? pointerP1 : this.memory[pointerP1],
                verb: immedTwo ? pointerP2 : this.memory[pointerP2],
                dest: immedThree ? pointerP3 : this.memory[pointerP3]
            }

            await op.run(this.inst, this.memory);
            if(this.increment) this.pointer += op.length;
        }

        return [...this.memory];
    }
}
