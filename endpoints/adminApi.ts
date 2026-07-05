import axios from "./axiosInstance"

const AdminAPI = {
    getAllUsers: async() => {
        try {
            const response = await axios.get("/admin/users");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getUser: async(userId: string) => {
        try {
            const response = await axios.get(`/admin/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateUser: async(userId: string, userData: any) => {
        try {
            const response = await axios.post(`/admin/users/${userId}`, userData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteUser: async(userId: string) => {
        try {
            const response = await axios.post(`/admin/users/${userId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getAllOrders: async() => {
        try {
            const response = await axios.get("/order/admin/orders");
            return response.data.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getOrder: async(orderId: string) => {
        try {
            const response = await axios.get(`/order/admin/orders/${orderId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateOrder: async(orderId: string, orderData: any) => {
        try {
            const response = await axios.put(`/order/admin/orders/${orderId}/status`, orderData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteOrder: async(orderId: string) => {
        try {
            const response = await axios.post(`/admin/orders/${orderId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getAllProducts: async() => {
        try {
            const response = await axios.get("/product");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getProduct: async(productId: string) => {
        try {
            const response = await axios.get(`/admin/products/${productId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    createProduct: async(productData: any) => {
        try {
            const response = await axios.post("/product/admin/create", productData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateProduct: async(productId: string, productData: any) => {
        try {
            const response = await axios.put(`/product/admin/${productId}`, productData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteProduct: async(productId: string) => {
        try {
            const response = await axios.delete(`/product/admin/${productId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    setFeaturedProduct: async(productId: string) => {
        try {
            const response = await axios.put(`/product/admin/${productId}/feature`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    setTrendingProduct: async(productId: string) => {
        try {
            const response = await axios.put(`/product/admin/${productId}/trend`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getAllReviews: async() => {
        try {
            const response = await axios.get("/admin/reviews");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getReview: async(reviewId: string) => {
        try {
            const response = await axios.get(`/admin/reviews/${reviewId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateReview: async(reviewId: string, reviewData: any) => {
        try {
            const response = await axios.post(`/admin/reviews/${reviewId}`, reviewData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteReview: async(reviewId: string) => {
        try {
            const response = await axios.post(`/admin/reviews/${reviewId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getAllCategories: async() => {
        try {
            const response = await axios.get("/admin/categories");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getCategory: async(categoryId: string) => {
        try {
            const response = await axios.get(`/admin/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateCategory: async(categoryId: string, categoryData: any) => {
        try {
            const response = await axios.post(`/admin/categories/${categoryId}`, categoryData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteCategory: async(categoryId: string) => {
        try {
            const response = await axios.post(`/admin/categories/${categoryId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getAllTags: async() => {
        try {
            const response = await axios.get("/admin/tags");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getTag: async(tagId: string) => {
        try {
            const response = await axios.get(`/admin/tags/${tagId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateTag: async(tagId: string, tagData: any) => {
        try {
            const response = await axios.post(`/admin/tags/${tagId}`, tagData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteTag: async(tagId: string) => {
        try {
            const response = await axios.post(`/admin/tags/${tagId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getAllImages: async() => {
        try {
            const response = await axios.get("/admin/images");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getImage: async(imageId: string) => {
        try {
            const response = await axios.get(`/admin/images/${imageId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateImage: async(imageId: string, imageData: any) => {
        try {
            const response = await axios.post(`/admin/images/${imageId}`, imageData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteImage: async(imageId: string) => {
        try {
            const response = await axios.post(`/admin/images/${imageId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getFeatured: async() => {
        try {
            const response = await axios.get("/admin/featured");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateFeatured: async(featuredId: string, featuredData: any) => {
        try {
            const response = await axios.post(`/admin/featured/${featuredId}`, featuredData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteFeatured: async(featuredId: string) => {
        try {
            const response = await axios.post(`/admin/featured/${featuredId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getTrending: async() => {
        try {
            const response = await axios.get("/admin/trending");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateTrending: async(trendingId: string, trendingData: any) => {
        try {
            const response = await axios.post(`/admin/trending/${trendingId}`, trendingData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteTrending: async(trendingId: string) => {
        try {
            const response = await axios.post(`/admin/trending/${trendingId}/delete`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    createGalleryImage: async(galleryData: any) => {
        try {
            const response = await axios.post("/gallery/admin/create", galleryData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateGallery: async(galleryId: string, galleryData: any) => {
        try {
            const response = await axios.put(`/gallery/admin/${galleryId}`, galleryData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteGallery: async(galleryId: string) => {
        try {
            const response = await axios.delete(`/gallery/admin/${galleryId}`);
            return response;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getShowcase: async() => {
        try {
            const response = await axios.get("/admin/showcase");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateShowcase: async(showcaseId: string, showcaseData: any) => {
        try {
            const response = await axios.put(`/showcase/admin/${showcaseId}`, showcaseData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    createShowcase: async(showcaseData: any) => {
        try {
            const response = await axios.post("/showcase/admin/create", showcaseData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deleteShowcase: async(showcaseId: string) => {
        try {
            const response = await axios.delete(`/showcase/admin/${showcaseId}`);
            return response;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updateEvent: async(eventId: string, eventData: any) => {
        try {
            const response = await axios.put(`/event/admin/${eventId}`, eventData);
            return response;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    createEvent: async(eventData: any) => {
        const response = await axios.post("/event/admin/create", eventData);
        return response;
   
    },
    deleteEvent: async(eventId: string) => {
        try {
            const response = await axios.delete(`/event/admin/${eventId}`);
            return response
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    lockWebsite: async() => {
        try {
            const response = await axios.post("/admin/lock");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    unlockWebsite: async() => {
        try {
            const response = await axios.post("/admin/unlock");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    toggleLockWebsite: async(lockData: any) => {
        try {
            const response = await axios.put("/lock/admin/toggle", lockData);
            return response.data.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getWebsiteStatus: async() => {
        try {
            const response = await axios.get("/admin/status");
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    createPromoCode: async(promoCodeData: any) => {
        try {
            const response = await axios.post("/promo/admin/create", promoCodeData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    updatePromoCode: async(promoCodeId: string, promoCodeData: any) => {
        try {
            const response = await axios.put(`/promo/admin/${promoCodeId}`, promoCodeData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    deletePromoCode: async(promoCodeId: string) => {
        try {
            const response = await axios.delete(`/promo/admin/${promoCodeId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getPromoCodes: async() => {
        try {
            const response = await axios.get("/promo/admin");
            return response.data.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    getPromoCode: async(promoCodeId: string) => {
        try {
            const response = await axios.get(`/promo/admin/${promoCodeId}`);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    },
    togglePromoStatus: async(promoCodeId: string, promoCodeData: any) => {
        try {
            const response = await axios.put(`/promo/admin/${promoCodeId}/toggle`, promoCodeData);
            return response.data;
        } catch (error) {
            console.error("An error occured", error);
            
        }
    }
}

export default AdminAPI
