import { subscribe } from "diagnostics_channel";
import axios from "./axiosInstance";

const StoreAPI = {
  getAllProducts: async () => {
    try {
      const response = await axios.get("/product");
      return response.data.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getProduct: async (productId: string) => {
    try {
      const response = await axios.get(`/product/${productId}`);
      return response.data.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  searchProducts: async (searchQuery: string) => {
    try {
      const response = await axios.get(`/products/search?q=${searchQuery}`);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  filterProducts: async (filterData: any) => {
    try {
      const response = await axios.post("/products/filter", filterData);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getFeaturedProducts: async () => {
    try {
      const response = await axios.get("/products/featured");
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getTrendingProducts: async () => {
    try {
      const response = await axios.get("/products/trending");
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getGallery: async () => {
    try {
      const response = await axios.get("/gallery");
      return response.data.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getShowcase: async () => {
    try {
      const response = await axios.get("/showcase");
      return response.data.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getEvents: async () => {
    try {
      const response = await axios.get("/event");
      return response.data.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getReviews: async () => {
    try {
      const response = await axios.get("/reviews");
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getReview: async (reviewId: string) => {
    try {
      const response = await axios.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  addReview: async (reviewData: any) => {
    try {
      const response = await axios.post("/reviews/add", reviewData);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  updateReview: async (reviewId: string, reviewData: any) => {
    try {
      const response = await axios.post(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  deleteReview: async (reviewId: string) => {
    try {
      const response = await axios.post(`/reviews/${reviewId}/delete`);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getCategories: async () => {
    try {
      const response = await axios.get("/categories");
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getCategory: async (categoryId: string) => {
    try {
      const response = await axios.get(`/categories/${categoryId}`);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getTags: async () => {
    try {
      const response = await axios.get("/tags");
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getTag: async (tagId: string) => {
    try {
      const response = await axios.get(`/tags/${tagId}`);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getImages: async () => {
    try {
      const response = await axios.get("/images");
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getImage: async (imageId: string) => {
    try {
      const response = await axios.get(`/images/${imageId}`);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  uploadImage: async (imageData: any) => {
    try {
      const response = await axios.post("/images/upload", imageData);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  deleteImage: async (imageId: string) => {
    try {
      const response = await axios.post(`/images/${imageId}/delete`);
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getWebsiteStatus: async () => {
    const response = await axios.get("/lock/status");
    return response.data.data;
  },
  subscribeToNewsletter: async (email: string) => {
    try {
      const response = await axios.post("/newsletter/subscribe", { email });
      return response.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
  getFeaturedAndTrendingProducts: async () => {
    try {
      const response = await axios.get("/product/featured-and-trending");
      return response.data.data;
    } catch (error) {
      console.error("An error occured", error);
    }
  },
};

export default StoreAPI;
