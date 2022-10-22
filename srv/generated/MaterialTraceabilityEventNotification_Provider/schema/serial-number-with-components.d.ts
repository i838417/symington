import type { SerialNumberComponent } from './serial-number-component';
/**
 * Components of a serialized product.
 */
export declare type SerialNumberWithComponents = {
    /**
     * The serial number ID.
     * @example "R90A2B4U7"
     * Max Length: 30.
     */
    'serialId': string;
    /**
     * The components of a serialized product.
     */
    'componentSerialNumbers'?: SerialNumberComponent[];
} | Record<string, any>;
//# sourceMappingURL=serial-number-with-components.d.ts.map