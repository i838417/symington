import type { EventPackage } from './event-package';
/**
 * A wrapper object that contains the root element of PostMaterialTraceabilityEventNotification.
 */
export declare type MaterialTraceabilityEventNotification = {
    /**
     * A wrapper object that contains header information and a collection of event data related to a SAP Logistics Business Network message.
     */
    'PostMaterialTraceabilityEventNotification'?: {
        /**
         * Identifier of the sender party within SAP Logistics Business Network.
         * @example "1000222"
         * Max Length: 40.
         */
        'senderLbnId': string;
        /**
         * Identifier of the original sender system.
         * @example "ZEX_000"
         * Max Length: 60.
         */
        'senderSystemId': string;
        /**
         * Arbitrary identifier for a sent message like a unique identifier (for example UUID).
         * @example "1134-2223-333-3-111"
         * Max Length: 60.
         */
        'messageId': string;
        'eventPackage': EventPackage;
    } | Record<string, any>;
} | Record<string, any>;
//# sourceMappingURL=material-traceability-event-notification.d.ts.map