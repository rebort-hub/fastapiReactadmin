/** Common enums */

/**
 * Enable status
 *
 * - "1": enabled
 * - "2": disabled
 */
export enum EnableStatus {
  /** Enabled */
  ENABLED = '1',
  /** Disabled */
  DISABLED = '2'
}

export type EnableStatusValue = `${EnableStatus}`;
