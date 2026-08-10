import { useEffect, useState } from "react";
import api from "../api/axios";
import { useParams } from "react-router";

export default function ArtifactDetails() {
  const { id } = useParams();
  const [artifact, setArtifact] = useState(null);

  const loadArtifact = async () => {
    const res = await api.get("/artifacts/");
    const p = res.data.find((item) => item._id === id);
    setArtifact(p);
  };

  useEffect(() => {
    loadArtifact();
  }, []);

  const addToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please login first");
      return;
    }

    const res = await api.post("/cart/add", {
      userId,
      artifactId: artifact._id,
    });

    const total = res.data.cart.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    localStorage.setItem("cartCount", total);
    window.dispatchEvent(new Event("cartUpdated"));
  };

  if (!artifact) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <img
        src={artifact.image}
        alt={artifact.title}
        className="w-full h-40 object-contain bg-white rounded"
      />
      <h1 className="text-2xl font-bold mt-4">{artifact.title}</h1>
      <p className="text-gray-700 mt-2">{artifact.description}</p>
      <p className="text-xl font-semibold mt-4">${artifact.price}</p>

      <button
        onClick={addToCart}
        className="mt-6 w-full md:w-1/2 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Add to Cart
      </button>
    </div>
  );
}