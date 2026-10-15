import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { CATEGORY_META } from "../utils/imageFallback";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  Sparkles, 
  ArrowUpDown, 
  Layers,
  ChevronRight
} from "lucide-react";

function Products() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from URL query parameters if present
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Sync state when URL params change (e.g. from navbar search or home category clicks)
  useEffect(() => {
    const urlCategory = searchParams.get("category");
    const urlSearch = searchParams.get("search");
    if (urlCategory !== null && urlCategory !== category) {
      setCategory(urlCategory);
    }
    if (urlSearch !== null && urlSearch !== search) {
      setSearch(urlSearch);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getProducts(search, category, sort);
        setProducts(data.products || []);
      } catch (err) {
        setError("Unable to load products. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, category, sort]);

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setSort("");
    setSearchParams({});
  };

  const handleCategoryClick = (catSlug) => {
    setCategory(catSlug);
    if (catSlug) {
      setSearchParams((prev) => {
        prev.set("category", catSlug);
        return prev;
      });
    } else {
      setSearchParams((prev) => {
        prev.delete("category");
        return prev;
      });
    }
  };

  const activeFilterCount = (search ? 1 : 0) + (category ? 1 : 0) + (sort ? 1 : 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Link to="/" className="hover:text-orange-600 transition">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="font-semibold text-slate-800">Products</span>
          {category && (
            <>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-orange-600">{category}</span>
            </>
          )}
        </nav>

        {/* Header Title & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <span>{category ? `${category} Collection` : "All Products"}</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full">
                {products.length} {products.length === 1 ? "item" : "items"}
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Discover certified genuine products with express delivery and best price guarantee.
            </p>
          </div>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition cursor-pointer self-start sm:self-auto"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset all filters ({activeFilterCount})</span>
            </button>
          )}
        </div>

        {/* Filter Toolbar Card (Search, Categories, Sort) */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm mb-8 space-y-4">
          
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search products by title, keyword, brand..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 focus:bg-white text-sm text-slate-800 placeholder-slate-400 pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center min-w-44">
                <ArrowUpDown className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full appearance-none bg-slate-50 focus:bg-white text-xs sm:text-sm font-semibold text-slate-700 pl-9 pr-8 py-2.5 rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 outline-none cursor-pointer transition"
                >
                  <option value="">Sort: Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
                <span className="absolute right-3 pointer-events-none text-slate-400 text-xs">▼</span>
              </div>
            </div>

          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
              <Layers className="w-3.5 h-3.5" />
              Categories:
            </span>
            
            <button
              onClick={() => handleCategoryClick("")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                category === ""
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700"
              }`}
            >
              All
            </button>

            {CATEGORY_META.filter(c => c.slug).map((cat) => (
              <button
                key={cat.slug}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 flex items-center gap-1.5 ${
                  category === cat.slug
                    ? "bg-orange-600 text-white shadow-sm shadow-orange-500/20"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>

        </div>

        {/* Loading State: Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="w-full aspect-square rounded-xl animate-shimmer" />
                <div className="h-4 w-2/3 rounded animate-shimmer" />
                <div className="h-3 w-1/3 rounded animate-shimmer" />
                <div className="h-9 w-full rounded-xl animate-shimmer mt-4" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="rounded-2xl bg-rose-50 border border-rose-200 p-8 text-center max-w-lg mx-auto my-12">
            <p className="text-3xl mb-2">⚠️</p>
            <h3 className="text-base font-bold text-rose-800">{error}</h3>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-rose-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold hover:bg-rose-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-3xl bg-white border border-slate-200 py-20 px-6 text-center max-w-lg mx-auto shadow-sm my-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              No products found
            </h2>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">
              We couldn't find any items matching your active search or filters. Try adjusting your query.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 inline-flex items-center gap-2 bg-slate-900 hover:bg-orange-600 text-white text-xs font-bold px-6 py-3 rounded-xl transition shadow cursor-pointer"
            >
              <X className="w-4 h-4" />
              <span>Clear All Filters</span>
            </button>
          </div>
        )}

        {/* Product Cards Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
              />
            ))}
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}

export default Products;