import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate, useParams, Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Landmark, Save, Loader2 } from "lucide-react";

const FIELD_META = {
    title: { label: "Title", type: "text", placeholder: "e.g. Golden Funerary Mask" },
    price: { label: "Price ($)", type: "number", placeholder: "0.00" },
    description: { label: "Description", type: "textarea", placeholder: "Short description of the artifact" },
    category: { label: "Category", type: "text", placeholder: "e.g. Egyptian, Roman, Greek" },
    image: { label: "Image URL", type: "text", placeholder: "https://..." },
    stock: { label: "Stock", type: "number", placeholder: "0" },
};

export default function EditArtifact() {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = user?.role === 'admin';
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    stock: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const allowedFields = ["title", "price", "description", "category", "image", "stock"];

  const loadArtifact = async () => {
    try {
      setLoading(true);
      const res = await api.get("/artifacts");
      const artifact = res.data.find((p) => p._id === id);
      if (artifact) setForm(artifact);
    } catch (err) {
      console.error("Error loading artifact:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadArtifact();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await api.put(`/artifacts/update/${id}`, form);
      navigate("/admin/artifacts");
    } catch (err) {
      console.error("Error updating artifact:", err);
      setError(err.response?.data?.message || "Failed to update artifact.");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
        <div className="flex items-center justify-center py-24 text-[#d0c5b2]">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            Loading...
        </div>
    );
  }

  if (!isAdmin) {
    return (
        <div className="max-w-md mx-auto mt-20 text-center bg-[#1c1510]/80 border border-[#e6c364]/20 rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-3 text-[#e8e1d9] font-serif">Admin Access Required</h2>
            <p className="text-[#99907e] mb-5">Please sign in with an admin account to edit artifacts.</p>
            <Link to="/login" className="inline-block bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#17110b] font-semibold px-5 py-2.5 rounded-xl hover:scale-[1.02] transition">
                Go to Login
            </Link>
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl bg-[#e6c364]/10 border border-[#e6c364]/30 flex items-center justify-center">
              <Landmark className="text-[#e6c364]" size={20} />
          </div>
          <div>
              <h2 className="text-2xl font-bold text-[#e8e1d9] font-serif tracking-wide">Edit Artifact</h2>
              <p className="text-[#99907e] text-sm">Update details for this museum piece.</p>
          </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 bg-[#1c1510]/80 border border-[#e6c364]/20 rounded-2xl text-[#d0c5b2]">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          Loading artifact...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-[#1c1510]/80 backdrop-blur-xl border border-[#e6c364]/20 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5"
        >
          {form.image && (
              <div className="w-full h-40 rounded-xl overflow-hidden border border-[#4d4637]/40 bg-[#0d0905] flex items-center justify-center">
                  <img
                      src={form.image}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
              </div>
          )}

          <div className="grid sm:grid-cols-2 gap-5">
            {allowedFields.map((key) => {
              const meta = FIELD_META[key] || { label: key, type: "text" };
              const isFull = meta.type === "textarea" || key === "image";
              return (
                <div key={key} className={isFull ? "sm:col-span-2" : ""}>
                  <label className="block text-xs uppercase tracking-wider text-[#c9b99a] mb-1.5 font-medium">
                      {meta.label}
                  </label>
                  {meta.type === "textarea" ? (
                      <textarea
                          name={key}
                          value={form[key] || ""}
                          onChange={handleChange}
                          placeholder={meta.placeholder}
                          rows={3}
                          className="w-full p-3 bg-[#0d0905] border border-[#4d4637]/40 rounded-xl text-[#e8e1d9] placeholder-[#6b6355] transition-all focus:outline-none focus:ring-2 focus:ring-[#e6c364]/40 focus:border-[#e6c364]/50 resize-none"
                      />
                  ) : (
                      <input
                          type={meta.type}
                          name={key}
                          value={form[key] || ""}
                          onChange={handleChange}
                          placeholder={meta.placeholder}
                          className="w-full p-3 bg-[#0d0905] border border-[#4d4637]/40 rounded-xl text-[#e8e1d9] placeholder-[#6b6355] transition-all focus:outline-none focus:ring-2 focus:ring-[#e6c364]/40 focus:border-[#e6c364]/50"
                      />
                  )}
                </div>
              );
            })}
          </div>

          {error && (
              <p className="text-sm text-[#ffb4ab] bg-[#93000a]/10 border border-[#93000a]/30 rounded-lg px-3 py-2">
                  {error}
              </p>
          )}

          <div className="flex items-center gap-3 pt-2">
              <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#17110b] font-semibold py-3 rounded-xl hover:scale-[1.01] transition-all disabled:opacity-60 disabled:hover:scale-100 shadow-lg shadow-[#d4af37]/10"
              >
                  {submitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {submitting ? "Updating..." : "Update Artifact"}
              </button>
              <Link
                  to="/admin/artifacts"
                  className="px-5 py-3 rounded-xl bg-[#2a241c] hover:bg-[#37342f] text-[#e8e1d9] text-sm font-medium border border-[#4d4637]/30 transition-colors"
              >
                  Cancel
              </Link>
          </div>
        </form>
      )}
    </div>
  );
}