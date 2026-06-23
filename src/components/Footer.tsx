import { Link } from "@tanstack/react-router";
import { Zap, Twitter, Github, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 bg-black/30">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-glow">
                <Zap className="h-5 w-5" />
              </span>
              <span className="text-lg font-bold">EVChargeHub</span>
            </div>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Smart EV charging — find, reserve, and pay at thousands of stations in seconds.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><Link to="/stations" className="hover:text-foreground">Stations</Link></li>
              <li><Link to="/locator" className="hover:text-foreground">Locator</Link></li>
              <li><Link to="/book" className="hover:text-foreground">Booking</Link></li>
              <li><Link to="/calculator" className="hover:text-foreground">Cost calculator</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li><a className="hover:text-foreground" href="#">About</a></li>
              <li><a className="hover:text-foreground" href="#">Careers</a></li>
              <li><a className="hover:text-foreground" href="#">Press</a></li>
              <li><a className="hover:text-foreground" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Get in touch</h4>
            <p className="mt-3 text-sm text-muted-foreground">hello@evchargehub.com</p>
            <p className="text-sm text-muted-foreground">+1 (415) 555-0142</p>
            <div className="mt-4 flex gap-2">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} EVChargeHub. All rights reserved.</p>
          <p>Charge smarter. Drive further.</p>
        </div>
      </div>
    </footer>
  );
}