export declare const SVG_NS = "http://www.w3.org/2000/svg";
export declare function forceReflow(element: HTMLElement): void;
export declare function disableTransitionTemporarily(element: HTMLElement, callback: () => void): void;
export declare function supportsTouch(doc: Document): boolean;
export declare function getWindowDocument(): Document;
export declare function getCanvasContext(canvasElement: HTMLCanvasElement): CanvasRenderingContext2D | null;
declare const ICON_ID_TO_INNER_HTML_MAP: {
    [key in string]: string;
};
declare type IconId = keyof typeof ICON_ID_TO_INNER_HTML_MAP;
export declare function createSvgIconElement(document: Document, iconId: IconId): Element;
export declare function insertElementAt(parentElement: Element, element: Element, index: number): void;
export declare function removeElement(element: Element): void;
export declare function removeChildElements(element: Element): void;
export declare function removeChildNodes(element: Element): void;
export declare function indexOfChildElement(element: Element): number;
export declare function findNextTarget(ev: FocusEvent): HTMLElement | null;
export {};
