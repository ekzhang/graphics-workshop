import { Value } from './value';
/**
 * Synchronizes two values.
 */
export declare function connectValues<T1, T2>({ primary, secondary, forward, backward, }: {
    primary: Value<T1>;
    secondary: Value<T2>;
    forward: (primary: Value<T1>, secondary: Value<T2>) => T2;
    backward: (primary: Value<T1>, secondary: Value<T2>) => T1;
}): void;
