import type { SerialNumber } from './serial-number';
/**
 * Provides data about delivered serialized product.
 */
export declare type DeliverSerialNumberEvent = {
    /**
     * List of serial number IDs.
     * @example [
     *   {
     *     "serialId": "R90A2B4U7"
     *   }
     * ]
     * Min Items: 1.
     */
    'serialNumbers': SerialNumber[];
    /**
     * The delivery number used by the vendor.
     * @example "8000000101"
     * Max Length: 35.
     */
    'vendorDeliveryId': string;
    /**
     * The country/region where the vendor is registered (ISO 3166 / Alpha 2).
     * @example "DE"
     * Max Length: 2.
     */
    'vendorCountry': string;
    /**
     * The post code or zip code of the vendor.
     * @example "69190"
     * Max Length: 10.
     */
    'vendorPostalCode': string;
    /**
     * The purchase order number used by the purchaser.
     * @example "4500000101"
     * Max Length: 35.
     */
    'purchaseOrderId': string;
    /**
     * The purchase order item used by the purchaser.
     * @example "10"
     * Max Length: 6.
     */
    'purchaseOrderItem': string;
    /**
     * The date of purchase (YYYYMMDD).
     * @example "20210310"
     * Format: "date".
     */
    'purchaseOrderDate': string;
    /**
     * The date on which the product was dispatched (YYYYMMDD).
     * @example "20210315"
     * Format: "date".
     */
    'goodsIssueDate'?: string;
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
     * The plant that issued the serialized product.
     * @example "3100"
     * Max Length: 10.
     */
    'plant'?: string;
    /**
     * The status of the delivered serialized product.
     * @example "RELEASED"
     */
    'status': 'RELEASED' | 'ONHOLD' | 'RECALLED';
    /**
     * An explanation for why the serialized products have their current status.
     * Max Length: 255.
     */
    'statusComment'?: string;
} | Record<string, any>;
//# sourceMappingURL=deliver-serial-number-event.d.ts.map