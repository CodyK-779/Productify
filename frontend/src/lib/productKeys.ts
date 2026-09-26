export const productKeys = {
  all: ["products"] as const,
  myProducts: ["myProducts"] as const,
  details: (id: string) => ["product", id] as const
}