import { Link } from "react-router";
import type { MyProducts } from "@/types";
import { Img } from "@page-speed/img";

interface Props {
  product: MyProducts;
}

const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const ProductCard = ({ product }: Props) => {
  const isNew = new Date(product.createdAt) > oneWeekAgo;

  return (
    <Link
      to={`/product/${product.id}`}
      className="card bg-base-300 hover:bg-base-200 transition-colors"
    >
      <figure className="px-4 pt-4">
        <div className="rounded-xl h-40 w-full overflow-hidden">
          <Img
            src={product.image}
            alt={product.title}
            className="object-cover"
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      </figure>
      <div className="card-body p-4">
        <h2 className="card-title text-base">
          {product.title}
          {isNew && <span className="badge badge-secondary badge-sm">NEW</span>}
        </h2>
        <p className="text-sm text-base-content/70 line-clamp-2">
          {product.description}
        </p>

        <div className="divider my-1"></div>

        <div className="flex items-center justify-between">
          {product.user && (
            <div className="flex items-center gap-2">
              <div className="avatar">
                <div className="size-6 rounded-full ring-1 ring-primary overflow-hidden flex items-center justify-center bg-[#1DB954]">
                  {product.user.image ? (
                    <Img
                      src={product.user.image}
                      alt={product.user.name}
                      className="object-cover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  ) : (
                    <span className="font-bold text-black">
                      {product.user.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              <span className="text-xs text-base-content/60">
                {product.user.name}
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
