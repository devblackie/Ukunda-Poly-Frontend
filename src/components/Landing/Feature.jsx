import React from "react";
import { motion } from "framer-motion";
import AppName from "../../data/AppName";

export default function Feature() {
    const features = [
        {
          title: "Elite Faculty",
          description: "Mentorship from globally renowned educators.",
          image:
            "https://plus.unsplash.com/premium_photo-1683195785758-9906a4ccf554?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDV8fEVsaXRlJTIwRmFjdWx0eSUyME1lbnRvcnNoaXAlMjBmcm9tJTIwZ2xvYmFsbHklMjByZW5vd25lZCUyMGVkdWNhdG9ycyUyMCUyMCUyMGFmcmljYW58ZW58MHx8MHx8fDA%3D",
        },
        {
          title: "Innovative Facilities",
          description: "Cutting-edge labs and smart classrooms.",
          image:
            "https://images.unsplash.com/photo-1717386255886-6ae56e497f9a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NTV8fGlubm92YXRpdmUlMjBmYWNpbGl0aWVzfGVufDB8fDB8fHww",
            // "https://images.unsplash.com/photo-1667372525747-0268cfbc7c17?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D"
        },
        {
          title: "Global Programs",
          description: "Curriculums designed for a connected world.",
          image:
            "https://images.unsplash.com/photo-1719159381981-1327b22aff9b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R2xvYmFsJTIwUHJvZ3JhbXMlMjBDb21wdXRlciUyMGxlc3NvbnMlMjBBZnJpY2FufGVufDB8fDB8fHww",
        },
      ];
    
  return (
    <>
      <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-16"
        >
          Our Distinctive Edge
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative bg-white rounded-xl shadow-2xl overflow-hidden group"
            >
              <img
                src={feature.image}
                alt={feature.title}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-blue-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}
