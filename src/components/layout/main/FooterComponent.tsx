import { Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { COLORS } from "../../../assets";
import { Link } from "react-router-dom";

const FooterMainComponent = () => {
  return (
    <footer
      className="py-12 px-4"
      style={{ backgroundColor: COLORS.secondary }}
    >
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <MapPin className="w-6 h-6" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  Desa Sikara Tobata
                </h3>
                <p className="text-white/80">
                  Sistem Informasi Desa Sikara Tobata
                </p>
              </div>
            </div>
            <p className="text-white/80 mb-4">
              Melayani masyarakat dengan transparansi, efisiensi, dan kemudahan
              akses.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Kontak & Informasi
            </h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-white/80" />
                <span className="text-white/80">(021) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-white/80" />
                <span className="text-white/80">info@sikaratobata.id</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-white/80" />
                <span className="text-white/80">
                  Jl. Desa Sikara Tobata No. 123
                </span>
              </div>
              <Link to="#" className="flex items-center space-x-3">
                <ShieldCheck className="w-4 h-4 text-white/80" />
                <span className="text-white/80">Syarat & Kebijakan</span>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-4">
              Jam Operasional
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-white/80">Senin - Jumat</span>
                <span className="text-white">08:00 - 16:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Sabtu</span>
                <span className="text-white">08:00 - 12:00</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/80">Minggu</span>
                <span className="text-white">Tutup</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/80">© 2025 Syahrun Fathan Hidayah.</p>
        </div>
      </div>
    </footer>
  );
};

export default FooterMainComponent;
