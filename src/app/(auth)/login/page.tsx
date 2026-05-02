"use client";

import { useState } from "react";
import { useLogin } from "@/hooks/useAuth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useLogin();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[url('/bg-hero.jpeg')] bg-cover bg-center relative p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative z-10 flex flex-col md:flex-row max-w-5xl w-full gap-8 items-center">        
        <div className="hidden md:flex flex-col p-10 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white w-1/2">
          <div className="mb-6">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
          </div>
          <h1 className="text-4xl font-bold italic mb-4 leading-tight">
            Crafted for <br /> Exceptional Service
          </h1>
          <p className="text-gray-200 text-sm leading-relaxed max-w-sm">
            Where great service begins. Empower your team to create memorable dining experiences for every guest.
          </p>
        </div>

        {/* Right Side: Login Form */}
        <div className="bg-[#F4EFEA] p-10 rounded-2xl w-full md:w-1/2 shadow-2xl relative">
          <div className="absolute -top-6 right-8 bg-[#4A5D23] p-4 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>

          <p className="text-sm text-[#8C6D56] font-semibold tracking-widest mb-2">— LOGIN</p>
          <h2 className="text-3xl font-bold text-[#3E2723] mb-2">Selamat Datang</h2>
          <p className="text-sm text-gray-500 mb-8">Silakan masuk ke akun Anda untuk melanjutkan</p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-[#8C6D56] uppercase tracking-wider mb-2">Username or Email</label>
              <div className="relative">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#EFE8DF] border border-transparent focus:border-[#8C6D56] rounded-lg p-3 outline-none text-[#3E2723] transition-all"
                  placeholder="admin@gmail.com"
                  required
                />
                <span className="absolute right-4 top-3 text-gray-400">@</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold text-[#8C6D56] uppercase tracking-wider">Password</label>
                <a href="#" className="text-xs font-bold text-[#8C6D56] hover:underline">FORGOT?</a>
              </div>
              <div className="relative">
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#EFE8DF] border border-transparent focus:border-[#8C6D56] rounded-lg p-3 outline-none text-[#3E2723] transition-all"
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" id="remember" className="w-4 h-4 rounded border-gray-300 text-[#795548] focus:ring-[#795548]" />
              <label htmlFor="remember" className="text-sm text-gray-600">Remember for 30 days</label>
            </div>

            <button 
              type="submit" 
              disabled={loginMutation.isPending}
              className="w-full bg-[#795548] hover:bg-[#5D4037] text-white font-semibold py-3 rounded-xl transition-colors flex justify-center items-center gap-2 disabled:opacity-70"
            >
              {loginMutation.isPending ? "Signing In..." : "Sign In"}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Having trouble? <a href="#" className="text-[#4A5D23] font-bold hover:underline">Contact System Support</a>
          </p>
        </div>
      </div>
    </div>
  );
}