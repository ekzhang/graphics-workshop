import { BindingTarget } from './binding/target';
/**
 * The union of primitive types.
 */
export declare type Primitive = boolean | number | string;
/**
 * Writes the primitive value.
 * @param target The target to be written.
 * @param value The value to write.
 */
export declare function writePrimitive<T extends Primitive>(target: BindingTarget, value: T): void;
