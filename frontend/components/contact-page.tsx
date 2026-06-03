import { Mail, Phone, MapPin, Send } from "lucide-react";

export function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] pt-12 pb-24">
      {/* Header */}
      <section className="container mx-auto px-4 mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[var(--on-surface)] mb-6 tracking-tight">
          Get in <span className="text-[var(--primary)]">Touch</span>
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Have a question about an order, a product, or need technical support? We're here to help.
        </p>
      </section>

      <section className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Contact Info */}
          <div className="flex-1 space-y-8">
            <div className="bg-[var(--surface-container)] rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-2">Phone Support</h3>
                  <p className="text-[var(--muted-foreground)] mb-2">Mon-Fri from 8am to 8pm.</p>
                  <a href="tel:+1234567890" className="text-[var(--primary)] font-medium hover:underline">+1 (800) 123-4567</a>
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface-container)] rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-2">Email Support</h3>
                  <p className="text-[var(--muted-foreground)] mb-2">We aim to respond within 24 hours.</p>
                  <a href="mailto:support@voltvibe.com" className="text-[var(--primary)] font-medium hover:underline">support@voltvibe.com</a>
                </div>
              </div>
            </div>

            <div className="bg-[var(--surface-container)] rounded-2xl p-8 transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-[var(--primary)]/10 text-[var(--primary)] rounded-full flex items-center justify-center shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[var(--on-surface)] mb-2">Headquarters</h3>
                  <p className="text-[var(--muted-foreground)]">
                    123 Innovation Drive<br />
                    Tech Valley, CA 94043<br />
                    United States
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="flex-[1.5]">
            <div className="bg-[var(--surface)] border border-[var(--outline-variant)] rounded-3xl p-8 md:p-10 shadow-sm">
              <h2 className="text-2xl font-bold text-[var(--on-surface)] mb-6">Send us a Message</h2>
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Message sent successfully!"); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--on-surface)]">First Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[var(--on-surface)]">Last Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="Doe" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--on-surface)]">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all" placeholder="john@example.com" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[var(--on-surface)]">Message</label>
                  <textarea required rows={5} className="w-full px-4 py-3 bg-[var(--surface-container)] border border-[var(--outline-variant)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all resize-none" placeholder="How can we help you?"></textarea>
                </div>

                <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-[var(--primary)] text-[var(--on-primary)] rounded-xl font-semibold hover:bg-[var(--primary)]/90 active:scale-[0.98] transition-all shadow-lg shadow-[var(--primary)]/25">
                  Send Message
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
