import { PointNdAssembly } from '../../common/model/point-nd';
export interface Point3dObject {
    x: number;
    y: number;
    z: number;
}
export declare class Point3d {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    getComponents(): [number, number, number];
    static isObject(obj: any): obj is Point3dObject;
    static equals(v1: Point3d, v2: Point3d): boolean;
    toObject(): Point3dObject;
}
export declare const Point3dAssembly: PointNdAssembly<Point3d>;
