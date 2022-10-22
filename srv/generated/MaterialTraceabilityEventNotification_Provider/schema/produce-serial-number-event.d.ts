import type { SerialNumberWithComponents } from './serial-number-with-components';
import type { ProductDetail } from './product-detail';
import type { ProduceEventComponent } from './produce-event-component';
import type { EmptyArray } from './empty-array';
import type { Quantity } from './quantity';
import type { Property } from './property';
/**
 * Provides data for the serialized product produced by your company.
 */
export declare type ProduceSerialNumberEvent = {
    /**
     * List of components of serial number IDs.
     * @example [
     *   {
     *     "serialId": "R90A2B4U7",
     *     "componentSerialNumbers": [
     *       {
     *         "serialId": "9HL2288090191",
     *         "productId": "CPU-Core-i9-VPro",
     *         "systemId": "PC-SYS"
     *       }
     *     ]
     *   }
     * ]
     * Min Items: 1.
     */
    'serialNumbers': SerialNumberWithComponents[];
    /**
     * The product/material number (part of the serialized product key).
     * @example "Laptop-P1"
     * Max Length: 40.
     */
    'productId': string;
    /**
     * The system/namespace (part of the serialized product key).
     * @example "PC-SYS"
     * Max Length: 60.
     */
    'systemId': string;
    /**
     * The batch/lot number.
     * Max Length: 30.
     */
    'batchId'?: string;
    /**
     * @example {
     *   "productName": "Laptop P1",
     *   "quantities": [
     *     {
     *       "qualifier": "DISCRETE",
     *       "value": "1",
     *       "unit": "PC"
     *     }
     *   ],
     *   "properties": [
     *     {
     *       "name": "SSE3",
     *       "value": "true"
     *     }
     *   ],
     *   "creationDate": "20210305"
     * }
     * Max Items: 1.
     */
    'productDetail'?: ProductDetail[];
    /**
     * The product details of the serialized product.
     * @example []
     */
    'components'?: ProduceEventComponent | EmptyArray[];
    /**
     * The amount of the produced serialized product, as defined by the qualifier.
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
     *     "name": "POWER_REDUCTION",
     *     "value": "true"
     *   }
     * ]
     */
    'properties'?: Property[];
    /**
     * The date when the serialized product was produced (YYYYMMDD).
     * @example "20210305"
     * Format: "date".
     */
    'creationDate': string;
    /**
     * The place where the serialized product comes from. Use the appropriate industry code or naming convention.
     * @example "Walldorf"
     * Max Length: 60.
     */
    'location'?: string;
    /**
     * The plant where the serialized product was produced.
     * @example "3001"
     * Max Length: 10.
     */
    'plant'?: string;
    /**
     * The status of the produced serialized product.
     * @example "RELEASED"
     */
    'status': 'RELEASED' | 'ONHOLD' | 'RECALLED';
    /**
     * An explanation for why the serialized products have their current status.
     * Max Length: 255.
     */
    'statusComment'?: string;
} | Record<string, any>;
//# sourceMappingURL=produce-serial-number-event.d.ts.map