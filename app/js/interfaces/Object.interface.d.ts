import { PositionInterface } from './Position.interface';
export declare type ObjectType = 'wood' | 'metal';
export interface ObjectInterface {
    pos: PositionInterface;
    state: number;
    getPosition(): PositionInterface;
    setPosition(pos: PositionInterface): any;
    modifyState(damage: number): any;
}
