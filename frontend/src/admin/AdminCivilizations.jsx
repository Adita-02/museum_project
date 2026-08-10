import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router";
import { Landmark, Search, Trash2, Edit, Plus, Loader2 } from "lucide-react";

export default function AdminCivilizations() {
  const [civilizations, setCivilizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/civilizations");
      setCivilizations(res.data || []);
    } catch (err) {
      console.error("Error fetching civilizations:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = civilizations.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.region.toLowerCase().includes(search.toLowerCase()) ||
    c.era.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this civilization?")) return;
    try {
      await api.delete(`/civilizations/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8 font-sans">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500 tracking-tight mb-2">
            Civilizations
          </h2>
          <p className="text-neutral-400 text-lg">
            Manage the historical civilizations in your museum.
          </p>
        </div>
        <Link
          to="/admin/civilizations/add"
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-semibold text-white transition-all duration-300 ease-in-out bg-gradient-to-r from-amber-600 to-yellow-600 border border-amber-500/30 rounded-2xl shadow-[0_0_40px_-10px_rgba(217,119,6,0.4)] hover:shadow-[0_0_60px_-15px_rgba(217,119,6,0.6)] hover:-translate-y-0.5 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
          <Plus size={18} className="relative z-10" />
          <span className="relative z-10">Add Civilization</span>
        </Link>
      </div>

      {/* Search Bar Section */}
      {/* এখানে mb-8 কে mb-12 করা হয়েছে গ্যাপ বাড়ানোর জন্য */}
      <div className="relative mb-12 group"> 
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none transition-colors duration-300 group-focus-within:text-amber-400 text-neutral-500">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Search by name, region, or era…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="block w-full pl-14 pr-6 py-4 bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 rounded-2xl text-neutral-200 placeholder-neutral-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 focus:bg-neutral-900/80 shadow-inner"
        />
      </div>

      {/* Table Section */}
      <div className="bg-neutral-900/60 backdrop-blur-xl border border-neutral-800/60 rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-amber-500">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="text-neutral-400 font-medium">Loading historical archives...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center px-4">
            <div className="bg-neutral-800/50 p-6 rounded-full mb-6 border border-neutral-700/50">
              <Landmark size={48} className="text-neutral-500" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-200 mb-2">No Civilizations Found</h3>
            <p className="text-neutral-500 max-w-sm">
              We couldn't find any civilizations matching your search criteria. Try adjusting your filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-950/50 border-b border-neutral-800/60">
                  {/* প্রথম কলামে px-6 এর বদলে pl-10 pr-6 দেওয়া হয়েছে যাতে লেফট থেকে গ্যাপ থাকে */}
                  <th className="pl-10 pr-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Image</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Name</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Era</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Period</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest">Region</th>
                  <th className="px-6 py-5 text-xs font-semibold text-neutral-400 uppercase tracking-widest text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filtered.map((civ) => (
                  <tr
                    key={civ._id}
                    className="group transition-all duration-200 hover:bg-neutral-800/40"
                  >
                    {/* প্রথম কলামে pl-10 দেওয়া হয়েছে */}
                    <td className="pl-10 pr-6 py-4 whitespace-nowrap">
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-neutral-700/50 group-hover:border-amber-500/30 transition-colors shadow-sm">
                        <img
                          src={civ.img}
                          alt={civ.name}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                            e.currentTarget.parentElement.classList.add("bg-neutral-800", "flex", "items-center", "justify-center");
                            e.currentTarget.parentElement.innerHTML = '<span class="text-neutral-600 text-xs font-medium">No Image</span>';
                          }}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-neutral-200 text-lg group-hover:text-amber-400 transition-colors">
                        {civ.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-400 font-medium">{civ.era}</td>
                    <td className="px-6 py-4 text-neutral-500 text-sm">{civ.period}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
                        {civ.region}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center items-center gap-3 opacity-80 group-hover:opacity-100 transition-opacity">
                        <Link
                          to={`/admin/civilizations/edit/${civ._id}`}
                          className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_-5px_rgba(59,130,246,0.5)] transition-all duration-300"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => handleDelete(civ._id)}
                          className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_-5px_rgba(239,68,68,0.5)] transition-all duration-300"
                          title="Delete"
                        >
                          <Trash2 size={18} />
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
  );
}