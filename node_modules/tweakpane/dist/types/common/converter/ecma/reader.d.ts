declare type Reader = (text: string, cursor: number) => string;
export declare function readWhitespace(text: string, cursor: number): string;
export declare const readNumericLiteral: Reader;
export {};
