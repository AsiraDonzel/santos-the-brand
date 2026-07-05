import { useMutation, useQueryClient } from "@tanstack/react-query";
import AccountAPI from "@/endpoints/accountApi";

export const useSignIn = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AccountAPI.signIn,
        onSuccess: (data: any) => {
           const adminData = {
            admin: data.data.admin,
            token: data.data.token,
           };
           localStorage.setItem("admin", JSON.stringify(adminData))
        }
    })
}

export const useSignOut = () => {
    return useMutation({
        mutationFn: () => {
            localStorage.removeItem("admin")
            return Promise.resolve()
        },
    })
}

export const useChangePassword = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: AccountAPI.changePassword,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ["admin"]})
        }
    })
}