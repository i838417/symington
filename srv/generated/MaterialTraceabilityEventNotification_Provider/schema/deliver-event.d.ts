/**
 * Provides data about the delivered batch.
 */
export declare type DeliverEvent = {
    /**
     * The delivery number used by the vendor.
     * @example "VINT-W001"
     * Max Length: 35.
     */
    'vendorDeliveryId': string;
    /**
     * The batch/lot number used by the vendor (this data is part of the batch key, which is used to identify the batch).
     * @example "BAT-W001"
     * Max Length: 30.
     */
    'vendorBatchId': string;
    /**
     * The country/region where the vendor is registered (ISO 3166 / Alpha 2).
     * @example "DE"
     * Max Length: 2.
     */
    'vendorCountry': string;
    /**
     * The post code or zip code of the vendor.
     * @example "71111"
     * Max Length: 10.
     */
    'vendorPostalCode': string;
    /**
     * The purchase order number used by the purchaser.
     * @example "PO-015"
     * Max Length: 35.
     */
    'purchaseOrderId': string;
    /**
     * The purchase order item used by the purchaser.
     * @example "I015"
     * Max Length: 6.
     */
    'purchaseOrderItem': string;
    /**
     * The date of purchase (YYYYMMDD).
     * @example "20190321"
     * Format: "date".
     */
    'purchaseOrderDate': string;
    /**
     * The product/material number (this data is part of the batch key, which is used to identify the batch).
     * @example "WAFERS"
     * Max Length: 40.
     */
    'productId': string;
    /**
     * The system/namespace (this data is part of the batch key, which is used to identify the batch). The field can be left empty.
     * @example "F2C_INT"
     * Max Length: 60.
     */
    'systemId': string;
    /**
     * The plant that issued the product.
     * @example "F2C_DLV"
     * Max Length: 10.
     */
    'plant'?: string;
    /**
     * The date on which the product was dispatched (YYYYMMDD).
     * @example "20190329"
     * Format: "date".
     */
    'goodsIssueDate'?: string;
    /**
     * The status of the batch. Use status Invalid to hide (but not delete) an event that was created with an incorrect batch key. To update an event, for example from status Released to status Recalled, the event data can be simply resent with the updated status. The original event does not need to be hidden.
     * @example "RELEASED"
     */
    'status': 'RELEASED' | 'ONHOLD' | 'RECALLED' | 'INVALID';
    /**
     * An explanation for why the batch has its current status.
     * Max Length: 255.
     */
    'statusComment'?: string;
} | Record<string, any>;
//# sourceMappingURL=deliver-event.d.ts.map