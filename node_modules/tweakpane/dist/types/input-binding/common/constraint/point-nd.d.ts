import { Constraint } from '../../../common/constraint/constraint';
import { PointNdAssembly } from '../model/point-nd';
interface Config<PointNd> {
    assembly: PointNdAssembly<PointNd>;
    components: (Constraint<number> | undefined)[];
}
/**
 * @hidden
 */
export declare class PointNdConstraint<PointNd> implements Constraint<PointNd> {
    readonly components: (Constraint<number> | undefined)[];
    private readonly asm_;
    constructor(config: Config<PointNd>);
    constrain(value: PointNd): PointNd;
}
export {};
