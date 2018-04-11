
import { PositionInterface } from './Position.interface';

export type ObjectType = 'wood' | 'metal';

export interface ObjectInterface {
    pos : PositionInterface;  
    state : number;  
    getPosition() : PositionInterface;
    setPosition(pos: PositionInterface);
    modifyState(damage : number);
}