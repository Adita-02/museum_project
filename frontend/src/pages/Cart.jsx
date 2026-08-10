import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router";

export default function Cart() {
  const userId = localStorage.getItem("userId");
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  //Load cart data
  const loadCart = async () => {
    if (!userId) return;
    const res = await api.get(`/cart/${userId}`);
    setCart(res.data);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const removeItem = async (artifactId) => {
    await api.post(`/cart/remove`, { userId, artifactId });
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  //Update item quantity
  const updateQty = async (artifactId, quantity) => {
    if (quantity === 0) {
      await removeItem(artifactId);
      return;
    }

    await api.post(`/cart/update`, { userId, artifactId, quantity });
    loadCart();
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!cart) {
    return <div>Loading...</div>;
  }

  const total = cart.items.reduce(
    (sum, item) => sum + item.artifactId.price * item.quantity,
    0
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

      {cart.items.length === 0 ? (
        <div>Your cart is empty.</div>
      ) : (
        <div className="space-y-4">
          {cart.items.map((item) => (
            <div
              key={item.artifactId._id}
              className="flex items-center justify-between p-4 border rounded"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.artifactId.image}
                  alt={item.artifactId.title}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h2 className="text-lg font-semibold">
                    {item.artifactId.title}
                  </h2>
                  <p className="text-gray-600">
                    ${item.artifactId.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQty(item.artifactId._id, item.quantity - 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    updateQty(item.artifactId._id, item.quantity + 1)
                  }
                  className="px-2 py-1 bg-gray-200 rounded"
                >
                  +
                </button>
              </div>
              <div>
                <p className="font-semibold">
                  ${(item.artifactId.price * item.quantity).toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => removeItem(item.artifactId._id)}
                className="text-red-500"
              >
                Remove
              </button>
            </div>
          ))}

          <div className="text-right mt-4">
            <h2 className="text-xl font-bold">Total: ${total.toFixed(2)}</h2>
          </div>
          <button onClick={()=> navigate("/checkout-address")} className="w-full bg-blue-500 text-white p-2 rounded">
            Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  );
}