import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Landmark, Plus, Edit, Trash2, Loader2 } from "lucide-react";

export default function ArtifactList() {
    const { user, loading: authLoading } = useAuth();
    const [artifacts, setArtifacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const isAdmin = user?.role === 'admin';

    const loadArtifacts = async () => {
        try {
            setLoading(true);
            const response = await api.get("/artifacts");
            setArtifacts(response.data || []);
        } catch (err) {
            console.error("Error loading artifacts:", err);
        } finally {
            setLoading(false);
        }
    }

    const deletedArtifact = async (id) => {
        if (!window.confirm("Delete this artifact?")) return;
        try{
            await api.delete(`/artifacts/delete/${id}`);
            loadArtifacts();
        }catch(err){
            console.error("Error deleting Artifact:", err);
            alert(err.response?.data?.message || "Failed to delete artifact.");
        }
    }

    useEffect(() => {
        loadArtifacts();
    }, []);

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
                <p className="text-[#99907e] mb-5">Please sign in with an admin account to manage artifacts.</p>
                <Link to="/login" className="inline-block bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#17110b] font-semibold px-5 py-2.5 rounded-xl hover:scale-[1.02] transition">
                    Go to Login
                </Link>
            </div>
        );
    }

    return(
        <div className="max-w-6xl mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-[#e8e1d9] font-serif tracking-wide">Artifacts</h2>
                    <p className="text-[#99907e] mt-1">Manage the museum's collection of artifacts.</p>
                </div>
                <Link
                    to="/admin/artifacts/add"
                    className="flex items-center gap-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-[#17110b] font-semibold px-5 py-2.5 rounded-xl hover:scale-[1.02] transition-all shadow-lg shadow-[#d4af37]/10"
                >
                    <Plus size={18} />
                    Add New Artifact
                </Link>
            </div>

            <div className="bg-[#1c1510]/80 rounded-xl shadow-xl border border-[#e6c364]/20 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-[#d0c5b2] flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Loading artifacts...
                    </div>
                ) : artifacts.length === 0 ? (
                    <div className="p-12 text-center text-[#d0c5b2]">
                        <Landmark size={40} className="mx-auto mb-4 opacity-50" />
                        No artifacts added yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full table-auto text-white">
                            <thead>
                                <tr className="bg-[#2a221b] text-[#d0c5b2] uppercase text-sm">
                                    <th className="px-4 py-3 text-left">Title</th>
                                    <th className="px-4 py-3 text-left">Category</th>
                                    <th className="px-4 py-3 text-left">Price</th>
                                    <th className="px-4 py-3 text-left">Stock</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {artifacts.map((artifact) => (
                                    <tr
                                        key={artifact._id}
                                        className="border-t border-[#4d4637]/30 hover:bg-[#2a221b]/50 transition"
                                    >
                                        <td className="px-4 py-3 font-medium text-[#e8e1d9]">{artifact.title}</td>
                                        <td className="px-4 py-3 text-[#d0c5b2]">{artifact.category || "—"}</td>
                                        <td className="px-4 py-3 font-semibold text-[#e6c364]">${artifact.price}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${
                                                Number(artifact.stock) > 0
                                                    ? "bg-green-500/20 text-green-400 border-green-500/30"
                                                    : "bg-red-500/20 text-red-400 border-red-500/30"
                                            }`}>
                                                {artifact.stock}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex justify-center items-center gap-3">
                                                <Link
                                                    to={`/admin/artifacts/edit/${artifact._id}`}
                                                    className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => deletedArtifact(artifact._id)}
                                                    className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}