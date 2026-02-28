import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductsAPI from "@/endpoints/productApi";

export const useTrackVisit = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ProductsAPI.trackVisit,
    })
}

export const useSubmitReview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ProductsAPI.submitReview,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["product"]})
        }
    })
}

export const useDeleteReview = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ProductsAPI.deleteReview,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["product"]})
        }
    })
}