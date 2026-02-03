    import React, { useContext, useEffect, useState } from 'react';
    import { toast } from 'react-toastify';
    import { 
    Mail, 
    Lock, 
    User, 
    ChevronRight, 
    PenTool, 
    Layout, 
    Layers,
    Zap 
    } from 'lucide-react';
    import axios from "axios";
    import { useNavigate } from "react-router-dom";
    import { AuthContext } from '../context/AuthContext';



    const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const {backendURL, setToken, setUser} = useContext(AuthContext);

    const navigate = useNavigate();
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password)
            return toast.error("Email & Password required");
        
        if (!isLogin && !name)
            return toast.error("Name required");

        try {

            const api = isLogin
            ? `${backendURL}/api/auth/login`
            : `${backendURL}/api/auth/signup`;

            const payload = isLogin
                ? { email, password }
                : { name, email, password };

            const { data } = await axios.post(api, payload);

            setUser(data.user);
            setToken(data.token);
            toast.success(data.message);
            navigate("/dashboard");

        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
        
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-950 p-6">
        
        
        <div className="flex w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden h-160 border border-slate-100">
            
            
            <div className="hidden lg:flex w-2/5 bg-slate-900 p-10 flex-col justify-between relative overflow-hidden">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-10 blur-3xl" />
            
            <div className="relative z-10">
                <div className="flex items-center gap-4 mb-12">
                <div className="p-3 bg-indigo-600 rounded-2xl">
                    <Layout className="text-white w-6 h-6" />
                </div>
                <span className="text-white font-black text-xl tracking-tighter uppercase">Workspace</span>
                </div>
                
                <h1 className="text-4xl font-bold text-white leading-tight mb-10">
                Manage your <br /> 
                <span className="text-slate-500">Content</span> <br /> 
                Ecosystem.
                </h1>
                
                <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700">
                    <PenTool className="text-indigo-400" size={18} />
                    </div>
                    <div>
                    <p className="text-slate-200 font-bold text-sm">Smart Editor</p>
                    <p className="text-slate-500 text-xs tracking-wide">Effortless Writing</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800 border border-slate-700">
                    <Layers className="text-indigo-400" size={18} />
                    </div>
                    <div>
                    <p className="text-slate-200 font-bold text-sm">Role Access</p>
                    <p className="text-slate-500 text-xs tracking-wide">Team Collaboration</p>
                    </div>
                </div>
                </div>
            </div>

            <div className="relative z-10 p-4 bg-indigo-600 rounded-2xl flex items-center gap-3">
                <Zap className="text-white fill-current" size={18} />
                <span className="text-white text-xs font-bold uppercase tracking-widest">Ready to Publish</span>
            </div>
            </div>

            
            <div className="flex flex-col justify-center w-full lg:w-3/5 p-8 md:p-20 bg-white">
            <div className="mb-10 text-left">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                {isLogin ? 'Sign In' : 'Join Workspace'}
                </h2>
                <p className="text-slate-400 mt-2 text-sm font-medium">
                Your central hub for content management.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                <div className="relative group border-b-2 border-slate-100 focus-within:border-indigo-600 transition-all duration-300">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <div className="flex items-center py-2">
                    <User className="text-slate-300 mr-3 w-5 h-5 group-focus-within:text-indigo-600" />
                    <input 
                        type="text" name="name"
                        value={name} 
                        onChange={(e)=>setName(e.target.value)}
                        required
                        className="w-full bg-transparent border-none text-slate-700 focus:outline-none font-medium text-sm"
                        placeholder="John Doe"
                    />
                    </div>
                </div>
                )}

                <div className="relative group border-b-2 border-slate-100 focus-within:border-indigo-600 transition-all duration-300">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                <div className="flex items-center py-2">
                    <Mail className="text-slate-300 mr-3 w-5 h-5 group-focus-within:text-indigo-600" />
                    <input 
                    type="email" name="email" 
                    value={email} 
                    onChange={(e)=>setEmail(e.target.value)} 
                    required
                    className="w-full bg-transparent border-none text-slate-700 focus:outline-none font-medium text-sm"
                    placeholder="name@company.com"
                    />
                </div>
                </div>

                <div className="relative group border-b-2 border-slate-100 focus-within:border-indigo-600 transition-all duration-300">
                <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                    {isLogin && <button type="button" className="text-xs font-bold text-indigo-600">Forgot?</button>}
                </div>
                <div className="flex items-center py-2">
                    <Lock className="text-slate-300 mr-3 w-5 h-5 group-focus-within:text-indigo-600" />
                    <input 
                    type="password" name="password" 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)} 
                    required
                    className="w-full bg-transparent border-none text-slate-700 focus:outline-none font-medium text-sm"
                    placeholder="••••••••"
                    />
                </div>
                </div>

                <button 
                type="submit"
                className="flex items-center justify-center gap-2 w-full mt-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-slate-200"
                >
                <span className="text-xs uppercase tracking-widest">{isLogin ? 'Enter Workspace' : 'Get Started'}</span>
                <ChevronRight className="w-4 h-4" />
                </button>
            </form>

            <div className="mt-12 text-center">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {isLogin ? "Need access?" : "Have an account?"}
                <button 
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-2 text-indigo-600 hover:text-indigo-800 font-black underline underline-offset-4 decoration-2"
                >
                    {isLogin ? 'Create Account' : 'Login'}
                </button>
                </p>
            </div>
            </div>
        </div>
        </div>
    );
    };

    export default Auth;