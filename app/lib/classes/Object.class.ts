import { ObjectInterface } from '../interfaces/Object.interface';
import { ObjectType } from '../interfaces/Object.interface';
import { PositionInterface } from '../interfaces/Position.interface';


export class Object implements ObjectInterface {
    pos : PositionInterface;    
    state : number;
    static type : ObjectType;

    public getPosition() : PositionInterface {
        return this.pos;
    }

    public setPosition(pos: PositionInterface) : void {
        this.pos = pos;
    }
    
    public modifyState(damage : number) : void {
        this.state = this.state - damage;
        if (this.state <= 0) {
            // destroy Object
        }
    }
}