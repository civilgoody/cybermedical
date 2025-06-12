import { Card } from "@/components/ui/card";
import { Github, Mail } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

export function Footer() {
  return (
    <footer className="border-t border-[#1F1F1F] bg-[#0A0A0A] mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Project Info */}
          <div className="text-center md:text-left">
            <h3 className="text-lg font-semibold text-white mb-2">
              Cyber Security Dashboard
            </h3>
            <p className="text-[#999999] text-sm max-w-md">
              Real-time cybersecurity monitoring and AI-powered threat analysis platform.
              Built for portfolio demonstration.
            </p>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="flex items-center gap-4">
              {/* GitHub */}
              <a
                href="https://github.com/civilgoody/cybermedical"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#999999] hover:text-primary transition-colors group"
              >
                <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Source Code</span>
              </a>

              {/* X (Twitter) */}
              <a
                href="https://x.com/giftofgoody"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#999999] hover:text-primary transition-colors group"
              >
                <FaXTwitter className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">@giftofgoody</span>
              </a>

              {/* Email */}
              <a
                href="mailto:giftofgoody@gmail.com"
                className="flex items-center gap-2 text-[#999999] hover:text-primary transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Support</span>
              </a>
            </div>

            {/* Developer Credit */}
            <div className="text-center text-[#666666] text-xs">
              <p>© 2025 Goody</p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-[#1F1F1F] mt-6 pt-4">
          <p className="text-center text-[#666666] text-xs">
            This is a demonstration project showcasing cybersecurity monitoring capabilities.
            Not intended for production use.
          </p>
        </div>
      </div>
    </footer>
  );
} 
 