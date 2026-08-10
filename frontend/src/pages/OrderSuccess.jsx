import { useParams } from "react-router";

export default function OrderSuccess() {
  const { id } = useParams();

  return (
    <div className="max-w-xl mx-auto text-center mt-20">
      <h1 className="text-3xl font-bold text-green-600">
        Order Placed Successfully
      </h1>

      <p className="mt-4">
        Your Order ID:{" "}
        <span className="font-semibold">{id}</span>
      </p>
    </div>
  );
}