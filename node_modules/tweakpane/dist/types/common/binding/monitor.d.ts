import { Ticker } from '../binding/ticker/ticker';
import { BufferedValue } from '../model/buffered-value';
import { Emitter } from '../model/emitter';
import { BindingReader } from './binding';
import { BindingTarget } from './target';
interface Config<T> {
    reader: BindingReader<T>;
    target: BindingTarget;
    ticker: Ticker;
    value: BufferedValue<T>;
}
/**
 * @hidden
 */
export interface MonitorBindingEvents<T> {
    update: {
        rawValue: T;
        sender: MonitorBinding<T>;
    };
}
/**
 * @hidden
 */
export declare class MonitorBinding<T> {
    readonly emitter: Emitter<MonitorBindingEvents<T>>;
    readonly target: BindingTarget;
    readonly ticker: Ticker;
    readonly value: BufferedValue<T>;
    private reader_;
    constructor(config: Config<T>);
    dispose(): void;
    read(): void;
    private onTick_;
}
export {};
