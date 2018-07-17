import { GaProperty, GaAccountHeader } from "../../api/protos";

export function gaPropertiesForAccount(accountId: number, 
  gaAccountHeaders: GaAccountHeader[], gaProperties: Map<number, GaProperty>): GaProperty[] {
  const account = gaAccountHeaders.find((account) => account.accountId === accountId);
  if (!account) { return []; }
  return account.propertyIds.reduce(
    (result, propertyId) => [...result, gaProperties.get(propertyId)], []);
}
