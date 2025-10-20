import { Stack } from "@mui/system";
import AuthLayout from "../../../layouts/AuthLayout";
import useAuthForm from "./logic/useAuthForm";
import SigninForm from "./ui/SigninForm";

const Signin = () => {

    const { control, isSubmitting, error, clearError, handleSubmit, formState } = useAuthForm();

    return (
        <AuthLayout>
            <Stack spacing={4}>
                <SigninForm
                    control={control}
                    formState={formState}
                    handleSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    error={error}
                    clearError={clearError}
                />
            </Stack>
        </AuthLayout>
    )
}

export default Signin;