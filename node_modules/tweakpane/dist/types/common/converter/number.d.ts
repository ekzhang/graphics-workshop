import { Formatter } from './formatter';
/**
 * @hidden
 */
export declare function parseNumber(text: string): number | null;
/**
 * @hidden
 */
export declare function numberFromUnknown(value: unknown): number;
/**
 * @hidden
 */
export declare function numberToString(value: number): string;
/**
 * @hidden
 */
export declare function createNumberFormatter(digits: number): Formatter<number>;
