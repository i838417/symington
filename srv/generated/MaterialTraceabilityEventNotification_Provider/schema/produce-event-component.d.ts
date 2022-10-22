/**
 * A component used in the production process.
 */
export declare type ProduceEventComponent = {
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
} | Record<string, any>;
//# sourceMappingURL=produce-event-component.d.ts.map