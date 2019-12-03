interface OP {
    length : number;
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

    constructor(image : Storage) {
        this.ops.set(1, { length: 4, run: (inst, memory) => { memory[inst.dest] = memory[inst.noun] + memory[inst.verb]}});
        this.ops.set(2, { length: 4, run: (inst, memory) => { memory[inst.dest] = memory[inst.noun] * memory[inst.verb]}});
        this.ops.set(99, {length: 0, run: (inst, memory) => { this.halt = true; }})
        
        this.storage = image;
        this.reset();
    }

    reset() {
        this.memory = this.storage.getMemory();
        this.halt = false;
        this.pointer = 0;
    }

    run(noun : number, verb : number) : number[] {
        this.memory[1] = noun;
        this.memory[2] = verb;

        while(!this.halt) {
            this.inst = {
                op: this.memory[this.pointer],
                noun: this.memory[this.pointer + 1],
                verb: this.memory[this.pointer + 2],
                dest: this.memory[this.pointer + 3] 
            }

            let op : OP = this.ops.get(this.inst.op);
            op.run(this.inst, this.memory);

            this.pointer += op.length;
        }

        return [...this.memory];
    }
}
