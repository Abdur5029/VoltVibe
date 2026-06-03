import { Zap, Shield, Truck, HeartHandshake } from "lucide-react";

export function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-12 pb-24">
      {/* Hero Section */}
      <section className="container mx-auto px-4 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-6 tracking-tight">
          About <span className="text-[var(--primary)]">VoltVibe</span>
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          We are redefining the electronics retail experience by bringing you the latest technology with uncompromising quality and customer service.
        </p>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 mb-20">
        <div className="bg-[var(--surface)] border border-[var(--outline-variant)] rounded-3xl p-8 md:p-12 shadow-sm transition-transform hover:-translate-y-1 hover:shadow-lg duration-300">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1">
              <h2 className="text-3xl font-bold text-[var(--on-surface)] mb-4">Our Mission</h2>
              <p className="text-[var(--muted-foreground)] leading-relaxed text-lg">
                At VoltVibe, our mission is simple: to make cutting-edge technology accessible to everyone. We believe that the right gadget can transform how you work, play, and connect with the world. We meticulously curate our product lines to ensure that every item meets our high standards for performance and reliability.
              </p>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64 bg-[var(--primary)]/10 rounded-full flex items-center justify-center animate-pulse">
                <Zap className="w-32 h-32 text-[var(--primary)]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-[var(--on-surface)] mb-12">Why Choose Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Verified Quality",
              desc: "Every product goes through rigorous quality control before it reaches your hands.",
            },
            {
              icon: Truck,
              title: "Lightning Fast Delivery",
              desc: "We partner with top logistics networks to ensure your new tech arrives within 48 hours.",
            },
            {
              icon: HeartHandshake,
              title: "24/7 Support",
              desc: "Our dedicated AI and human support teams are always ready to help you with your tech needs.",
            },
          ].map((value, idx) => (
            <div 
              key={idx} 
              className="bg-[var(--surface-container)] rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] group"
            >
              <div className="w-16 h-16 mx-auto bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <value.icon className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-3">{value.title}</h3>
              <p className="text-[var(--muted-foreground)]">{value.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
