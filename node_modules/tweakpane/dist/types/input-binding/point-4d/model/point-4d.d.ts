import { Tuple4 } from '../../../misc/type-util';
import { PointNdAssembly } from '../../common/model/point-nd';
export interface Point4dObject {
    x: number;
    y: number;
    z: number;
    w: number;
}
export declare class Point4d {
    x: number;
    y: number;
    z: number;
    w: number;
    constructor(x?: number, y?: number, z?: number, w?: number);
    getComponents(): Tuple4<number>;
    static isObject(obj: any): obj is Point4dObject;
    static equals(v1: Point4d, v2: Point4d): boolean;
    toObject(): Point4dObject;
}
export declare const Point4dAssembly: PointNdAssembly<Point4d>;
