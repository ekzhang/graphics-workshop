export interface Evaluable {
    evaluate: () => number;
}
export declare class NumberLiteralNode implements Evaluable {
    readonly text: string;
    constructor(text: string);
    evaluate(): number;
    toString(): string;
}
export declare class BinaryOperationNode implements Evaluable {
    readonly left: Evaluable;
    readonly operator: string;
    readonly right: Evaluable;
    constructor(operator: string, left: Evaluable, right: Evaluable);
    evaluate(): number;
    toString(): string;
}
export declare class UnaryOperationNode implements Evaluable {
    readonly operator: string;
    readonly expression: Evaluable;
    constructor(operator: string, expr: Evaluable);
    evaluate(): number;
    toString(): string;
}
