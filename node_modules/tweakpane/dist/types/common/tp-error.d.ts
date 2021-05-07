interface ErrorContext {
    alreadydisposed: undefined;
    invalidparams: {
        name: string;
    };
    nomatchingcontroller: {
        key: string;
    };
    nomatchingview: {
        params: Record<string, unknown>;
    };
    notbindable: undefined;
    propertynotfound: {
        name: string;
    };
    shouldneverhappen: undefined;
}
declare type ErrorType = keyof ErrorContext;
interface Config<T extends ErrorType> {
    context?: ErrorContext[T];
    type: T;
}
export declare class TpError<T extends ErrorType> {
    static alreadyDisposed(): TpError<'alreadydisposed'>;
    static notBindable(): TpError<'notbindable'>;
    static propertyNotFound(name: string): TpError<'propertynotfound'>;
    static shouldNeverHappen(): TpError<'shouldneverhappen'>;
    readonly message: string;
    readonly name: string;
    readonly stack?: string;
    readonly type: ErrorType;
    constructor(config: Config<T>);
}
export {};
