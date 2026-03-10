"use client";

import { MapPin, Phone } from "lucide-react";

interface FindUsProps {
    address?: string;
    phone?: string;
    mapEmbedUrl?: string;
}

export function FindUs({
    address = "Jl. Palagan, Sariharjo, Kec. Ngaglik, Kab. Sleman, DIY 55581",
    phone = "+628123456789",
    mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3952.2617539936046!2d110.37!3d-7.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zN8KwNDUnMDAuMCJTIDExMMKwMjInMTIuMCJF!5e0!3m2!1sen!2sid!4v1234567890",
}: FindUsProps) {
    return (
        <section className="bg-white px-4 sm:px-8 lg:px-16 py-16">
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
                {/* Left: Info */}
                <div>
                    <h2 className="text-3xl font-bold text-stone-800 mb-3">Find Us</h2>
                    <p className="text-stone-500 text-sm mb-8 leading-relaxed">
                        Visit us for an unforgettable dining experience in the heart of the city.
                    </p>

                    <div className="space-y-5">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <MapPin size={18} className="text-[#8B6E4E]" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Address</p>
                                <p className="text-sm text-stone-700 leading-relaxed">{address}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <Phone size={18} className="text-[#8B6E4E]" />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-1">Phone</p>
                                <a
                                    href={`tel:${phone}`}
                                    className="text-sm text-stone-700 hover:text-[#8B6E4E] transition-colors"
                                >
                                    {phone}
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right: Map */}
                <div className="rounded-2xl overflow-hidden shadow-md border border-stone-200 h-64 md:h-72 w-full">
                    <iframe
                        src={mapEmbedUrl}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Restaurant Location"
                    />
                </div>
            </div>
        </section>
    );
}