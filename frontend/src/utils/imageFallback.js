// Curated ultra-high resolution photography for shopping categories (Unsplash CDN with optimized WebP/auto parameters)
export const CATEGORY_IMAGES = {
  Electronics: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80",
  Fashion: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80",
  Books: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80",
  Home: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&auto=format&fit=crop&q=80",
  Default: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80",
};

export const CATEGORY_META = [
  {
    name: "All",
    slug: "",
    icon: "✨",
    image: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&auto=format&fit=crop&q=80",
    color: "from-amber-500 to-orange-500",
    tagline: "Trending Everything",
  },
  {
    name: "Electronics",
    slug: "Electronics",
    icon: "🎧",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
    color: "from-blue-600 to-indigo-600",
    tagline: "Smart Gadgets & Audio",
  },
  {
    name: "Fashion",
    slug: "Fashion",
    icon: "👗",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&auto=format&fit=crop&q=80",
    color: "from-rose-500 to-pink-600",
    tagline: "Runway & Casual Picks",
  },
  {
    name: "Books",
    slug: "Books",
    icon: "📚",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80",
    color: "from-amber-600 to-yellow-600",
    tagline: "Bestsellers & Classics",
  },
  {
    name: "Home",
    slug: "Home",
    icon: "🏡",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80",
    color: "from-emerald-500 to-teal-600",
    tagline: "Decor & Smart Living",
  },
];

export const HERO_BANNERS = [
  {
    id: 1,
    title: "The Great Shopping Festival",
    subtitle: "Up to 70% Off on Top Brands, Electronics & Designer Wear",
    badge: "⚡ LIMITED TIME OFFER",
    code: "FESTIVAL50",
    buttonText: "Shop the Collection",
    link: "/products",
    bgGradient: "from-rose-600 via-pink-600 to-orange-500",
    image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&auto=format&fit=crop&q=85",
  },
  {
    id: 2,
    title: "Next-Gen Audio & Gadgets",
    subtitle: "Immersive sound, noise cancellation & premium Apple & Sony gear",
    badge: "🎧 TRENDING TECH",
    code: "TECHBOOST",
    buttonText: "Explore Electronics",
    link: "/products?category=Electronics",
    bgGradient: "from-indigo-700 via-purple-700 to-pink-600",
    image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&auto=format&fit=crop&q=85",
  },
  {
    id: 3,
    title: "Spring & Summer Fits",
    subtitle: "Curated modern streetwear, ethnic elegance and everyday casuals",
    badge: "✨ NEW ARRIVALS",
    code: "STYLESZN",
    buttonText: "Discover Fashion",
    link: "/products?category=Fashion",
    bgGradient: "from-amber-600 via-orange-600 to-rose-600",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=85",
  },
];

export function getProductFallbackImage(category) {
  if (!category) return CATEGORY_IMAGES.Default;
  const match = Object.keys(CATEGORY_IMAGES).find(
    (key) => key.toLowerCase() === category.toLowerCase()
  );
  return match ? CATEGORY_IMAGES[match] : CATEGORY_IMAGES.Default;
}

export function handleImageFallback(event, category) {
  event.target.onerror = null;
  event.target.src = getProductFallbackImage(category);
}
