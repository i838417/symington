import type { Quantity } from './quantity';
import type { Property } from './property';
/**
 * Additional data of a serialized product.
 */
export declare type ProductDetail = {
    /**
     * The name of the serialized product.
     * @example "CPU Core i9 VPro"
     * Max Length: 255.
     */
    'productName': string;
    /**
     * The amount of the serialized product, as defined by the qualifier.
     * @example [
     *   {
     *     "qualifier": "DISCRETE",
     *     "value": "1",
     *     "unit": "PC"
     *   }
     * ]
     */
    'quantities'?: Quantity[];
    /**
     * The attributes of serialized products that have been defined by you.
     * @example [
     *   {
     *     "name": "64-BIT-SUPPORT",
     *     "value": "true"
     *   }
     * ]
     */
    'properties'?: Property[];
    /**
     * The creation day of the serialized product (YYYYMMDD)
     * @example "20210202"
     * Format: "date".
     */
    'creationDate': string;
} | Record<string, any>;
//# sourceMappingURL=product-detail.d.ts.map