import { Value } from './value';
/**
 * @hidden
 */
export declare type Buffer<T> = (T | undefined)[];
/**
 * @hidden
 */
export declare type BufferedValue<T> = Value<Buffer<T>>;
/**
 * @hidden
 */
export declare function initializeBuffer<T>(bufferSize: number): BufferedValue<T>;
/**
 * @hidden
 */
export declare function createPushedBuffer<T>(buffer: Buffer<T>, newValue: T): Buffer<T>;
