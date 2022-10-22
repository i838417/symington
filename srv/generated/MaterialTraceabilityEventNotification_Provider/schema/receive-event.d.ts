import type { DeliveryItem } from './delivery-item';
import type { Quantity } from './quantity';
import type { Property } from './property';
/**
 * Provides data about the received batch.
 */
export declare type ReceiveEvent = {
    /**
     * The batch/lot number (this data is part of the batch key, which is used to identify the batch).
     * @example "BAT-S001-R"
     * Max Length: 30.
     */
    'batchId': string;
    /**
     * The product/material number (this data is part of the batch key, which is used to identify the batch).
     * @example "BROWN_SUGAR"
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
     * Received deliveries.
     * Min Items: 1.
     */
    'deliveryItemKeys': DeliveryItem[];
    /**
     * The received amount, defined in terms of the qualifier.
     * @example [
     *   {
     *     "qualifier": "BASE_UNIT",
     *     "value": "250",
     *     "unit": "KGM"
     *   }
     * ]
     */
    'quantities'?: Quantity[];
    /**
     * Individual batch attributes.
     * @example [
     *   {
     *     "name": "FAIR_TRADE",
     *     "value": "true"
     *   }
     * ]
     */
    'properties'?: Property[];
    /**
     * The date when the received batch was produced (YYYYMMDD).
     * @example "20180501"
     * Format: "date".
     */
    'creationDate': string;
    /**
     * The date when the received batch will expire (YYYYMMDD).
     * @example "20200501"
     * Format: "date".
     */
    'expirationDate'?: string;
    /**
     * The name of the product.
     * @example "Brown Sugar"
     * Max Length: 255.
     */
    'productName'?: string;
    /**
     * The plant where the batch was received.
     * @example "F2C_RCV"
     * Max Length: 10.
     */
    'plant'?: string;
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
//# sourceMappingURL=receive-event.d.ts.map