import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import AdminAPI from "@/endpoints/adminApi";

export const useAllUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => AdminAPI.getAllUsers(),
  });
};

export const useUser = (userId: string) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => AdminAPI.getUser(userId),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.updateUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useAllOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: () => AdminAPI.getAllOrders(),
  });
};

export const useOrder = (orderId: string) => {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: () => AdminAPI.getOrder(orderId),
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, orderData }: { orderId: string; orderData: any }) =>
      AdminAPI.updateOrder(orderId, orderData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.deleteOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useAllProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: () => AdminAPI.getAllProducts(),
  });
};

export const useProduct = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: () => AdminAPI.getProduct(productId),
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      productData,
    }: {
      productId: string;
      productData: any;
    }) => AdminAPI.updateProduct(productId, productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productData: any) => AdminAPI.createProduct(productData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => AdminAPI.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useSetFeaturedProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => AdminAPI.setFeaturedProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useSetTrendingProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (productId: string) => AdminAPI.setTrendingProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useAllReviews = () => {
  return useQuery({
    queryKey: ["reviews"],
    queryFn: () => AdminAPI.getAllReviews(),
  });
};

export const useReview = (reviewId: string) => {
  return useQuery({
    queryKey: ["review", reviewId],
    queryFn: () => AdminAPI.getReview(reviewId),
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.updateReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.deleteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
};

export const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: () => AdminAPI.getAllCategories(),
  });
};

export const useCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ["category", categoryId],
    queryFn: () => AdminAPI.getCategory(categoryId),
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.updateCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export const useAllTags = () => {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => AdminAPI.getAllTags(),
  });
};

export const useTag = (tagId: string) => {
  return useQuery({
    queryKey: ["tag", tagId],
    queryFn: () => AdminAPI.getTag(tagId),
  });
};

export const useUpdateTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.updateTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useDeleteTag = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.deleteTag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });
};

export const useFeatured = () => {
  return useQuery({
    queryKey: ["featured"],
    queryFn: () => AdminAPI.getFeatured(),
  });
};

export const useUpdateFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.updateFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featured"] });
    },
  });
};

export const useDeleteFeatured = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.deleteFeatured,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["featured"] });
    },
  });
};

export const useTrending = () => {
  return useQuery({
    queryKey: ["trending"],
    queryFn: () => AdminAPI.getTrending(),
  });
};

export const useUpdateTrending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.updateTrending,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trending"] });
    },
  });
};

export const useDeleteTrending = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.deleteTrending,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trending"] });
    },
  });
};

export const useUpdateGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      galleryId,
      galleryData,
    }: {
      galleryId: string;
      galleryData: any;
    }) => AdminAPI.updateGallery(galleryId, galleryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryProducts"] });
    },
  });
};

export const useCreateGalleryImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ galleryData }: { galleryData: any }) =>
      AdminAPI.createGalleryImage(galleryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryProducts"] });
    },
  });
};

export const useDeleteGallery = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ galleryId }: { galleryId: string }) =>
      AdminAPI.deleteGallery(galleryId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["galleryProducts"] });
    },
  });
};

export const useUpdateShowcase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      showcaseId,
      showcaseData,
    }: {
      showcaseId: string;
      showcaseData: any;
    }) => AdminAPI.updateShowcase(showcaseId, showcaseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcaseProducts"] });
    },
  });
};

export const useCreateShowcase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ showcaseData }: { showcaseData: any }) =>
      AdminAPI.createShowcase(showcaseData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcaseProducts"] });
    },
  });
};

export const useDeleteShowcase = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ showcaseId }: { showcaseId: string }) =>
      AdminAPI.deleteShowcase(showcaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcaseProducts"] });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId, eventData }: { eventId: string; eventData: any }) =>
      AdminAPI.updateEvent(eventId, eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsProducts"] });
    },
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventData }: { eventData: any }) =>
      AdminAPI.createEvent(eventData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsProducts"] });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ eventId }: { eventId: string }) =>
      AdminAPI.deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["eventsProducts"] });
    },
  });
};

export const lockWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.lockWebsite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteStatus"] });
    },
  });
};

export const unlockWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: AdminAPI.unlockWebsite,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteStatus"] });
    },
  });
};

export const toggleLockWebsite = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({lockData}: {lockData: any}) => AdminAPI.toggleLockWebsite(lockData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["websiteStatus"] });
    },
  });
};

export const getWebsiteStatus = () => {
  return useQuery({
    queryKey: ["websiteStatus"],
    queryFn: () => AdminAPI.getWebsiteStatus(),
  });
};

export const useCreatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promoCodeData }: { promoCodeData: any }) =>
      AdminAPI.createPromoCode(promoCodeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
    },
  });
};

export const useUpdatePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      promoCodeId,
      promoCodeData,
    }: {
      promoCodeId: string;
      promoCodeData: any;
    }) => AdminAPI.updatePromoCode(promoCodeId, promoCodeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
    },
  });
};

export const useDeletePromoCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ promoCodeId }: { promoCodeId: string }) =>
      AdminAPI.deletePromoCode(promoCodeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
    },
  });
};

export const useTogglePromoStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      promoCodeId,
      promoCodeData,
    }: {
      promoCodeId: string;
      promoCodeData: any;
    }) => AdminAPI.togglePromoStatus(promoCodeId, promoCodeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["promoCodes"] });
    },
  });
};

export const useGetPromoCodes = () => {
  return useQuery({
    queryKey: ["promoCodes"],
    queryFn: () => AdminAPI.getPromoCodes(),
  });
};

export const useGetPromoCode = (promoCodeId: string) => {
  return useQuery({
    queryKey: ["promoCode", promoCodeId],
    queryFn: () => AdminAPI.getPromoCode(promoCodeId),
  });
};
