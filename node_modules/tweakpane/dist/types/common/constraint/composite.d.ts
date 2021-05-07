import { Class } from '../../misc/type-util';
import { Constraint } from './constraint';
/**
 * A constraint to combine multiple constraints.
 * @template T The type of the value.
 */
export declare class CompositeConstraint<T> implements Constraint<T> {
    readonly constraints: Constraint<T>[];
    constructor(constraints: Constraint<T>[]);
    constrain(value: T): T;
}
export declare function findConstraint<C>(c: Constraint<unknown>, constraintClass: Class<C>): C | null;
