import { prisma } from "@/lib/prisma";

export default async function Home() {
  const products = await prisma.product.findMany();

  return (
    <main>
      <h1>Products</h1>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            {p.name} – ${(p.price / 100).toFixed(2)}
          </li>
        ))}
      </ul>
    </main>
  );
}
