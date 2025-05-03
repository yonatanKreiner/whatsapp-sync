
import React from 'react';

const testimonials = [
  {
    quote: "WhatsSync saved me so much time! I always wanted my Google contacts to have the same photos as WhatsApp.",
    name: "Sarah Johnson",
    title: "Marketing Professional",
    avatar: "https://i.pravatar.cc/150?img=1"
  },
  {
    quote: "Super easy to use. Connected both accounts and had my contacts synced within minutes.",
    name: "Michael Chen",
    title: "Software Developer",
    avatar: "https://i.pravatar.cc/150?img=2"
  },
  {
    quote: "I love how it keeps my contacts organized with updated profile pictures. Essential for my work!",
    name: "Emily Rodriguez",
    title: "Sales Manager",
    avatar: "https://i.pravatar.cc/150?img=3"
  }
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-whatsapp-light/30 to-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg text-gray-600">
            {`Join thousands of satisfied users who've simplified their contact management with WhatsSync.`}
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 flex-grow">
                  <svg className="w-8 h-8 text-whatsapp opacity-30" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="mt-4 text-gray-600 italic">{testimonial.quote}</p>
                </div>
                
                <div className="flex items-center mt-4 pt-4 border-t border-gray-100">
                  <img 
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-10 h-10 rounded-full mr-3 object-cover"
                  />
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
