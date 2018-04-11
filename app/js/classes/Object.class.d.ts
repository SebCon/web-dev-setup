import { ObjectInterface } from '../interfaces/Object.interface';
import { ObjectType } from '../interfaces/Object.interface';
import { PositionInterface } from '../interfaces/Position.interface';
export declare class Object implements ObjectInterface {
    pos: PositionInterface;
    state: number;
    static type: ObjectType;
    getPosition(): PositionInterface;
    setPosition(pos: PositionInterface): void;
    modifyState(damage: number): void;
}
