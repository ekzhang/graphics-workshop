import { PointNdAssembly } from '../../common/model/point-nd';
export interface Point2dObject {
    x: number;
    y: number;
}
export declare class Point2d {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    getComponents(): [number, number];
    static isObject(obj: any): obj is Point2dObject;
    static equals(v1: Point2d, v2: Point2d): boolean;
    toObject(): Point2dObject;
}
export declare const Point2dAssembly: PointNdAssembly<Point2d>;
