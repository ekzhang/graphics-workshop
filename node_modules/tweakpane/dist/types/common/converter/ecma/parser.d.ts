import { Evaluable } from './nodes';
/**
 * Parse ECMAScript expression with numeric literals.
 * https://262.ecma-international.org/
 * @param text The string to be parsed.
 * @return A parsing result, or null if failed.
 */
export declare function parseEcmaNumberExpression(text: string): Evaluable | null;
