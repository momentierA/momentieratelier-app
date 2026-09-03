/**
 * Para produtos comprados em kit (ex: kit de 10 caixas por $12.96), `cost_price`
 * guarda o custo do kit inteiro. Cálculos de margem/lucro devem usar o custo
 * por unidade, não o custo do kit.
 */
export function getUnitCost(costPrice: number, kitQuantity?: number | null): number {
  const qty = kitQuantity && kitQuantity > 1 ? kitQuantity : 1
  return costPrice / qty
}
