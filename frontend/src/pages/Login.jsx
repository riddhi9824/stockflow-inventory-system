import { useState } from "react";
import Button from "../components/common/Button";
import Input from "../components/common/Input";

function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name] : value,
        }));

        //Clear errors while typing
        setErrors((prev) => ({
            ...prev,
            [name] : "",
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const newErrors = {
            email: "",
            password: ""
        };

        //Email Validation
        if(!formData.email.trim()){
            newErrors.email = "Email is required";
        }

        //Password Validation
        if(!formData.password.trim()){
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        //Stop if there are any errors
        if(newErrors.email || newErrors.password){
            return;
        }

        console.log(formData);
    };

    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center px-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
                <h1 className="text-3xl font-bold text-center text-blue-600">
                    Stockflow
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-8">
                    Smart Inventory & Billing System
                </p>

                <form onSubmit={handleSubmit}>
                    <Input 
                       label="Email Address"
                       type="email"
                       name="email"
                       placeholder="Enter your email"
                       value={formData.email}
                       onChange={handleChange}
                       error={errors.email}
                    />

                    <Input 
                       label="Password"
                       type="password"
                       name="password"
                       placeholder="Enter your password"
                       value={formData.password}
                       onChange={handleChange}
                       error={errors.password}
                    />

                    <div className="flex justify-between items-center mb-6 text-sm">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" />
                               Remember Me
                        </label>

                        <button 
                           type="button"
                           className="text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <Button
                       type="submit"
                       className="w-full"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default Login;