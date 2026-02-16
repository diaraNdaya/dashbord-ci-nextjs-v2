import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";

export function ToastCard({
  kind = "info",
  title,
  message,
  action,
}: {
  kind?: "success" | "error" | "warning" | "info" | "loading";
  title?: string;
  message?: string | React.ReactNode;
  action?: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    success: "border-emerald-200 bg-emerald-50 text-emerald-900",
    error: "border-rose-200 bg-rose-50 text-rose-900",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    info: "border-slate-200 bg-white text-slate-900",
    loading: "border-slate-200 bg-white text-slate-900",
  };
  return (
    <div
      className={`w-full max-w-md rounded-xl border p-4 shadow-lg ${styles[kind]}`}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          {kind === "loading" ? (
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                opacity="0.25"
              />
              <path
                d="M22 12a10 10 0 0 1-10 10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
            </svg>
          ) : null}
        </div>
        <div className="flex-1">
          {title ? (
            <p className="font-semibold leading-tight">{title}</p>
          ) : null}
          {message ? (
            <div className="mt-0.5 text-sm opacity-90">{message}</div>
          ) : null}
          {action ? <div className="mt-3">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
export function toastLoading(message: string, title = "Veuillez patienter") {
  return toast.custom(
    () => <ToastCard kind="loading" title={title} message={message} />,
    {
      duration: Infinity,
      position: "top-center",
    }
  );
}
export function toastSuccess(message: string, title = "Succès") {
  return toast.custom(
    () => <ToastCard kind="success" title={title} message={message} />,
    {
      duration: 3500,
      position: "top-center",
    }
  );
}
export function toastInfo(message: string, title = "Info") {
  return toast.custom(
    () => <ToastCard kind="info" title={title} message={message} />,
    {
      duration: 3500,
      position: "top-center",
    }
  );
}
export function toastWarn(message: string, title = "Attention") {
  return toast.custom(
    () => <ToastCard kind="warning" title={title} message={message} />,
    {
      duration: 4000,
      position: "top-center",
    }
  );
}
export function toastErr(message: string, title = "Erreur") {
  return toast.custom(
    () => <ToastCard kind="error" title={title} message={message} />,
    {
      duration: 5500,
      position: "top-center",
    }
  );
}
export function toastCartAdded(opts: {
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  color?: string;
  size?: string;
}) {
  return toast.custom(
    (tId) => (
      <CartToastCard
        id={tId}
        name={opts.name}
        imageUrl={opts.imageUrl}
        quantity={opts.quantity}
        unitPrice={opts.unitPrice}
        color={opts.color}
        size={opts.size}
      />
    ),
    {
      duration: 4000,
      position: "top-center",
    }
  );
}

type CartToastCardProps = {
  id: string | number;
  name: string;
  imageUrl: string;
  quantity: number;
  unitPrice: number;
  color?: string;
  size?: string;
};

export function CartToastCard({
  id,
  name,
  imageUrl,
  quantity,
  unitPrice,
  color,
  size,
}: CartToastCardProps) {
  const total = unitPrice * quantity;

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-start gap-3 w-full max-w-md">
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 object-cover rounded-md flex-shrink-0"
      />
      <div className="flex-1">
        <div className="flex justify-between gap-2 items-start">
          <h3 className="font-medium text-gray-900 line-clamp-2">{name}</h3>
          <button
            onClick={() => toast.dismiss(id)}
            className="text-gray-400 hover:text-gray-600"
            aria-label="Fermer la notification"
          >
            ×
          </button>
        </div>

        <p className="text-sm text-gray-600 mt-1">
          {quantity} unité{quantity > 1 ? "s" : ""} ajoutée
          {quantity > 1 ? "s" : ""} au panier
        </p>

        {color && (
          <p className="text-sm text-gray-600 mt-1">
            Couleur : <span className="font-medium">{color}</span>
          </p>
        )}
        {size && (
          <p className="text-sm text-gray-600 mt-1">
            Taille : <span className="font-medium">{size}</span>
          </p>
        )}

        <div className="flex justify-between items-center mt-3 gap-2">
          <span className="font-semibold text-gray-900">
            Total : {formatPrice(total)}
          </span>
          <Button
            size="sm"
            className="bg-violet-vif hover:bg-violet-vif/80 text-white"
            onClick={() => {
              window.location.href = "/cart";
              toast.dismiss(id);
            }}
          >
            Voir le panier
          </Button>
        </div>
      </div>
    </div>
  );
}
