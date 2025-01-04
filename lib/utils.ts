/**
 * Converts a price to a displayable string
 *
 * @example 1000 -> 10.00
 */
export function displayablePrice(price?: number): string {
    if (!price) return "#.##";
    return (price / 100).toFixed(2);
}
