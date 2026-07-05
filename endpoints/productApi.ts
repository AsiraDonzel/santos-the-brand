import axios from "./axiosInstance"

const ProductsAPI = {
    trackVisit: async(productId: string) => {
        try {
            const response = await axios.post(`/products/${productId}/track-visit`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    submitReview: async(productId: string, reviewData: any) => {
        try {
            const response = await axios.post(`/products/${productId}/submit-review`, reviewData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteReview: async(reviewId: string) => {
        try {
            const response = await axios.post(`/products/${reviewId}/delete-review`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
}

export default ProductsAPI;