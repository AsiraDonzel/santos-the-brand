import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import StoreAPI from "@/endpoints/storeApi";

export const useProducts = (shouldWait: boolean = false) => {
  return useQuery({
    queryKey: ["products"],
    queryFn: StoreAPI.getAllProducts,
    enabled: !shouldWait,
    staleTime: 1000 * 60 * 10,
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => StoreAPI.getProduct(productId),
  });
};

export const useFeatured = () => {
    return useQuery({
        queryKey: ["featuredProducts"],
        queryFn: StoreAPI.getFeaturedProducts,
    });
};
export const useTrending = () => {
    return useQuery({
        queryKey: ["trendingProducts"],
        queryFn:  StoreAPI.getTrendingProducts,
    });
};

export const useGallery = () => {
  return useQuery({
    queryKey: ["galleryProducts"],
    queryFn: StoreAPI.getGallery,
  });
};
export const useShowcase = (shouldWait: boolean = false) => {
  return useQuery({
    queryKey: ["showcaseProducts"],
    queryFn: StoreAPI.getShowcase,
    enabled: !shouldWait,
    staleTime: 1000 * 60 * 10,
  });
};
export const useEvents = (shouldWait: boolean = false) => {
  return useQuery({
    queryKey: ["eventsProducts"],
    queryFn: StoreAPI.getEvents,
    enabled: !shouldWait,
    staleTime: 1000 * 60 * 10,
  });
};

export const useWebsiteStatus = () => {
    return useQuery({
        queryKey: ["websiteStatus"],
        queryFn: StoreAPI.getWebsiteStatus,
    });
};

export const useSubscribe = () => {
    return useMutation({
        mutationFn: StoreAPI.subscribeToNewsletter,
    });
};

export const useFeaturedAndTrending = () => {
    return useQuery({
        queryKey: ["featuredAndTrendingProducts"],
        queryFn: StoreAPI.getFeaturedAndTrendingProducts,
    });
};

