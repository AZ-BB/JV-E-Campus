import { toast } from "react-toastify";
import { GeneralActionResponse } from "@/types/general-action-response";

// TODO: Add a custom toast component
const CustomToast = (message: string) => {
    return (
        <div className="flex items-center gap-2">
            <p>{message}</p>
        </div>
    )
}

const toaster = {
    success: (message: string) => {
        toast.success(message);
    },
    error: (message: string) => {
        toast.error(message);
    },
    promise: (promise: Promise<any>, successMessage: string, errorMessage: string) => {
        toast.promise(promise, {
            pending: "Loading...",
            success: successMessage,
            error: errorMessage,
        });
    },
    actionPromise: (promise: Promise<any>) => {
        toast.promise(promise, {
            pending: {
                render: () => <div>Loading...</div>
            },
            success: {
                render: ({ data }: { data: GeneralActionResponse<any> }) => <div>Success: {data.message}</div>
            },
            error: {
                render: ({ data }: { data: GeneralActionResponse<any> }) => <div>Error: {data.message}</div>
            },
        });
    },
};

export default toaster;