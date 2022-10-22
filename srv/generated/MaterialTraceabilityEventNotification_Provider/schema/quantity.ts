/*
 * Copyright (c) 2022 SAP SE or an SAP affiliate company. All rights reserved.
 *
 * This is a generated file powered by the SAP Cloud SDK for JavaScript.
 */
    
    /**
     * Quantity defined in terms of the qualifier.
     */
    export type Quantity = {
      /**
       * * DISCRETE - Quantity in discrete base unit, such as "EA"-Each, "PC"-Piece.
       * * BASE_UNIT - Quantity in non-discrete base unit, such as "KGM"-Kilogram.
       * * ACTIVE_INGREDIENT - Quantity of active ingredient (related to Quantity in Base Unit).
       * * PER_PACK - Max. quantity contained in one package; either in DISCRETE or BASE_UNIT unit.
       * * TOTAL_HU - Number of Handling Units (HU)
       * * PACKAGES_IN_HU - Max. number of packages that can be contained in one HU. If PER_PACK is not defined, the unit of DISCRETE is expected.
       * * NET_WEIGHT - Net-Weight related to either DISCRETE or BASE_UNIT Quantity of 1. 
       * * TOTAL_GROSS_WEIGHT - Total Gross-Weight.
       * * TOTAL_VOLUME - Total Volume.
       * * PFM_BASIC_CO2 - Product carbon footprint as quantity of CO2 equivalent per DISCRETE or BASE_UNIT unit.
       * 
       */
      'qualifier': 'DISCRETE' | 'BASE_UNIT' | 'ACTIVE_INGREDIENT' | 'PER_PACK' | 'TOTAL_HU' | 'PACKAGES_IN_HU' | 'NET_WEIGHT' | 'TOTAL_GROSS_WEIGHT' | 'TOTAL_VOLUME' | 'PFM_BASIC_CO2';
      /**
       * Max Length: 16.
       */
      'value': string;
      /**
       * The unit of measure for quantity (ISO codes expected (see also SAP note 69063) )
       * Max Length: 3.
       */
      'unit': string;
    } | Record<string, any>;
