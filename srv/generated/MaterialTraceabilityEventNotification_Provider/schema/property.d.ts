/**
 * Properties provide additional metadata about a batch or a serialized product – just like an attribute except properties are user-defined. Properties are defined as a name-value pair. To use a property in the API message, you must first create the property in the Define Properties app. For more information, use the in-app help.
 */
export declare type Property = {
    /**
     * The name of the property. The name must match the property that you created in the Define Properties app.
     * Max Length: 40.
     */
    'name': string;
    /**
     * The value of the property. The format of the value must match the type of property that you created in the Define Properties app.
     * Max Length: 255.
     */
    'value': string;
} | Record<string, any>;
//# sourceMappingURL=property.d.ts.map