import type { ProduceEventComponent } from './produce-event-component';
import type { Quantity } from './quantity';
import type { Property } from './property';
/**
 * Provides data about a batch produced by your company.
 */
export declare type ProduceEvent = {
    /**
     * The batch/lot number (this data is part of the batch key, which is used to identify the batch).
     * @example "BAT-W001"
     * Max Length: 30.
     */
    'batchId': string;
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
     * The product batch keys of the components used in the batch.
     */
    'components'?: ProduceEventComponent[];
    /**
     * The amount of the produced batch, as defined by the qualifier.
     * @example [
     *   {
     *     "qualifier": "BASE_UNIT",
     *     "value": "450",
     *     "unit": "KGM"
     *   }
     * ]
     */
    'quantities'?: Quantity[];
    /**
     * The attributes of the batch.
     * @example [
     *   {
     *     "name": "FAIR_TRADE",
     *     "value": "true"
     *   }
     * ]
     */
    'properties'?: Property[];
    /**
     * The date when the batch was produced (YYYYMMDD).
     * @example "20190318"
     * Format: "date".
     */
    'creationDate': string;
    /**
     * The date when the batch will expire (YYYYMMDD).
     * @example "20220318"
     * Format: "date".
     */
    'expirationDate'?: string;
    /**
     * The name of the product.
     * @example "Wafers"
     * Max Length: 255.
     */
    'productName': string;
    /**
     * The place where the batch comes from. Use the appropriate industry code or naming convention.
     * @example "DE (country/region code (Iso 3166)."
     * Max Length: 60.
     */
    'location'?: string;
    /**
     * The plant where the batch was produced.
     * @example "F2C_PRD"
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
//# sourceMappingURL=produce-event.d.ts.map