import React from 'react';

export const PuffPuffIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FFE3D8] via-[#FFD0C0] to-[#FFB59E] p-4 ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[2px_3px_0px_#2D1610]">
      {/* Decorative rays */}
      <circle cx="100" cy="110" r="75" fill="#FFEFEA" stroke="#2D1610" strokeWidth="3" strokeDasharray="6 6" />
      
      {/* Serving tray */}
      <ellipse cx="100" cy="148" rx="84" ry="24" fill="#2D1610" />
      <ellipse cx="100" cy="144" rx="80" ry="22" fill="#F5A623" stroke="#2D1610" strokeWidth="3.5" />
      <ellipse cx="100" cy="140" rx="72" ry="17" fill="#FFE5A3" />

      {/* Pillowy Doughnut Ball 1 (Back left) */}
      <circle cx="68" cy="108" r="30" fill="#E28738" stroke="#2D1610" strokeWidth="3.5" />
      <circle cx="62" cy="102" r="23" fill="#F7A24B" />
      <circle cx="56" cy="95" r="8" fill="#FFC988" />
      <circle cx="76" cy="118" r="4" fill="#9C4D11" />
      <circle cx="68" cy="122" r="2.5" fill="#9C4D11" />

      {/* Pillowy Doughnut Ball 2 (Back right) */}
      <circle cx="132" cy="108" r="30" fill="#E28738" stroke="#2D1610" strokeWidth="3.5" />
      <circle cx="138" cy="102" r="23" fill="#F7A24B" />
      <circle cx="144" cy="95" r="8" fill="#FFC988" />
      <circle cx="122" cy="118" r="3.5" fill="#9C4D11" />

      {/* Pillowy Doughnut Ball 3 (Center foreground - largest) */}
      <circle cx="100" cy="116" r="34" fill="#D37527" stroke="#2D1610" strokeWidth="3.5" />
      <circle cx="98" cy="112" r="28" fill="#F59E3D" />
      <circle cx="90" cy="100" r="10" fill="#FFD89C" />
      <circle cx="85" cy="94" r="4" fill="#FFF" />
      {/* Nutmeg speckles */}
      <circle cx="105" cy="120" r="2.5" fill="#75350B" />
      <circle cx="115" cy="112" r="2" fill="#75350B" />
      <circle cx="92" cy="130" r="2" fill="#75350B" />
      <circle cx="85" cy="116" r="2.5" fill="#75350B" />

      {/* Steam swirls */}
      <path d="M78 64 C70 52, 90 40, 78 28" fill="none" stroke="#FF4B82" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M102 58 C96 46, 112 36, 102 24" fill="none" stroke="#FF7E53" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M124 64 C132 52, 114 42, 122 30" fill="none" stroke="#F5A623" strokeWidth="3.5" strokeLinecap="round" />

      {/* Golden sparkle */}
      <polygon points="160,50 163,58 171,61 163,64 160,72 157,64 149,61 157,58" fill="#F5A623" stroke="#2D1610" strokeWidth="1.5" />
    </svg>
    <div className="absolute top-2 right-2 rotate-6 bg-[#3ED494] text-[#2D1610] font-heading font-black text-xs px-2 py-0.5 rounded-lg border-2 border-[#2D1610] shadow-[2px_2px_0px_#2D1610]">
      HOT & FLUFFY
    </div>
  </div>
);

export const ChinChinIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FEF5D6] via-[#FDE8A8] to-[#F8D272] p-4 ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[2px_3px_0px_#2D1610]">
      {/* Decorative sun ring */}
      <circle cx="100" cy="100" r="76" fill="#FFF9DF" stroke="#2D1610" strokeWidth="3" strokeDasharray="5 5" />
      
      {/* Big Festive Tub */}
      <path d="M44 88 L54 165 C55 172 65 178 100 178 C135 178 145 172 146 165 L156 88 Z" fill="#FF4B82" stroke="#2D1610" strokeWidth="3.5" />
      {/* Tub rim */}
      <ellipse cx="100" cy="88" rx="58" ry="16" fill="#FF7E53" stroke="#2D1610" strokeWidth="3.5" />
      <ellipse cx="100" cy="85" rx="54" ry="13" fill="#FFE2D5" stroke="#2D1610" strokeWidth="2.5" />

      {/* Tub Label Sticker */}
      <rect x="68" y="115" width="64" height="34" rx="6" fill="#FFF9F5" stroke="#2D1610" strokeWidth="3" transform="rotate(-3 100 132)" />
      <text x="100" y="132" textAnchor="middle" fill="#2D1610" fontWeight="900" fontSize="11" fontFamily="'Bricolage Grotesque', sans-serif">CRUNCH</text>
      <text x="100" y="143" textAnchor="middle" fill="#FF4B82" fontWeight="800" fontSize="8" fontFamily="'Onest', sans-serif">100% BUTTER</text>

      {/* Crunchy Chin Chin diamond cubes spilling over */}
      {/* Cube 1 */}
      <polygon points="76,68 92,60 102,74 86,82" fill="#EAA03E" stroke="#2D1610" strokeWidth="3" />
      <polygon points="76,68 86,82 86,92 76,78" fill="#B86F15" stroke="#2D1610" strokeWidth="2" />
      
      {/* Cube 2 (center) */}
      <polygon points="98,54 116,46 126,62 108,70" fill="#F8BC5C" stroke="#2D1610" strokeWidth="3" />
      <polygon points="108,70 126,62 126,72 108,80" fill="#CF831A" stroke="#2D1610" strokeWidth="2" />

      {/* Cube 3 */}
      <polygon points="120,68 136,58 148,72 132,82" fill="#F3A843" stroke="#2D1610" strokeWidth="3" />

      {/* Flying crispy diamond in air */}
      <g transform="translate(142, 38) rotate(22)">
        <polygon points="0,0 14,-6 22,6 8,12" fill="#F8BC5C" stroke="#2D1610" strokeWidth="2.5" />
      </g>
      <g transform="translate(42, 52) rotate(-18)">
        <polygon points="0,0 12,-5 18,5 6,10" fill="#EAA03E" stroke="#2D1610" strokeWidth="2.5" />
      </g>

      {/* Sparkles */}
      <polygon points="34,95 36,99 40,100 36,101 34,105 32,101 28,100 32,99" fill="#FF4B82" />
      <polygon points="166,110 168,114 172,115 168,116 166,120 164,116 160,115 164,114" fill="#F5A623" />
    </svg>
    <div className="absolute top-2 right-2 rotate-3 bg-[#FF4B82] text-white font-heading font-black text-xs px-2 py-0.5 rounded-lg border-2 border-[#2D1610] shadow-[2px_2px_0px_#2D1610]">
      ULTRA CRUNCH
    </div>
  </div>
);

export const FishRollIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#E2F7EF] via-[#C6F1DD] to-[#9DE4C1] p-4 ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[2px_3px_0px_#2D1610]">
      {/* Decorative backdrop */}
      <circle cx="100" cy="100" r="76" fill="#F1FCF7" stroke="#2D1610" strokeWidth="3" strokeDasharray="5 5" />
      
      {/* Platter plate */}
      <ellipse cx="100" cy="148" rx="82" ry="24" fill="#2D1610" />
      <ellipse cx="100" cy="144" rx="78" ry="21" fill="#FFF9F5" stroke="#2D1610" strokeWidth="3.5" />

      {/* Big Savory Golden Fish Roll / Pie */}
      <g transform="translate(100, 110) rotate(-14) translate(-100, -110)">
        {/* Main golden body */}
        <rect x="42" y="86" width="116" height="48" rx="24" fill="#D98028" stroke="#2D1610" strokeWidth="4" />
        <rect x="46" y="90" width="108" height="40" rx="20" fill="#F6A743" />
        {/* Crisp highlight ridge */}
        <path d="M54 100 Q100 92 146 100" fill="none" stroke="#FFDE96" strokeWidth="4" strokeLinecap="round" />

        {/* Diagonal savory score lines */}
        <line x1="68" y1="92" x2="62" y2="128" stroke="#2D1610" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="88" y1="92" x2="82" y2="128" stroke="#2D1610" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="108" y1="92" x2="102" y2="128" stroke="#2D1610" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="128" y1="92" x2="122" y2="128" stroke="#2D1610" strokeWidth="3.5" strokeLinecap="round" />

        {/* Herb thyme & pepper flakes */}
        <circle cx="75" cy="104" r="2" fill="#236B4A" />
        <circle cx="95" cy="116" r="2.5" fill="#C22718" />
        <circle cx="118" cy="106" r="2" fill="#236B4A" />
        <circle cx="135" cy="114" r="2" fill="#C22718" />
      </g>

      {/* Mini second roll in background */}
      <ellipse cx="70" cy="142" rx="28" ry="12" fill="#C76E1A" stroke="#2D1610" strokeWidth="3" />
      <ellipse cx="70" cy="140" rx="24" ry="10" fill="#F49E31" />

      {/* Savory aroma waves */}
      <path d="M85 58 Q95 44 85 30" fill="none" stroke="#3ED494" strokeWidth="3.5" strokeLinecap="round" />
      <path d="M115 54 Q105 40 115 26" fill="none" stroke="#FF7E53" strokeWidth="3.5" strokeLinecap="round" />

      {/* Fresh lemon slice accent */}
      <g transform="translate(150, 134) rotate(15)">
        <circle cx="12" cy="12" r="14" fill="#F5A623" stroke="#2D1610" strokeWidth="2.5" />
        <circle cx="12" cy="12" r="11" fill="#FFEFA3" stroke="#2D1610" strokeWidth="1.5" />
        <path d="M12 2 L12 22 M2 12 L22 12 M5 5 L19 19 M5 19 L19 5" stroke="#F5A623" strokeWidth="1.5" />
      </g>
    </svg>
    <div className="absolute top-2 right-2 -rotate-3 bg-[#F5A623] text-[#2D1610] font-heading font-black text-xs px-2 py-0.5 rounded-lg border-2 border-[#2D1610] shadow-[2px_2px_0px_#2D1610]">
      SAVORY & FLAKY
    </div>
  </div>
);

export const FondantCakeIllustration: React.FC<{ className?: string }> = ({ className = 'w-full h-full' }) => (
  <div className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#FFE7F0] via-[#FFD0E2] to-[#FFA7C8] p-4 ${className}`}>
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-[2px_3px_0px_#2D1610]">
      {/* Decorative rays */}
      <circle cx="100" cy="100" r="76" fill="#FFF2F7" stroke="#2D1610" strokeWidth="3" strokeDasharray="5 5" />

      {/* Gold metallic cake stand */}
      <ellipse cx="100" cy="176" rx="65" ry="12" fill="#2D1610" />
      <ellipse cx="100" cy="172" rx="62" ry="10" fill="#F5A623" stroke="#2D1610" strokeWidth="3" />
      <path d="M85 172 L92 154 L108 154 L115 172 Z" fill="#E69512" stroke="#2D1610" strokeWidth="2.5" />
      <ellipse cx="100" cy="154" rx="72" ry="12" fill="#F5A623" stroke="#2D1610" strokeWidth="3.5" />

      {/* TIER 1 (Bottom Tier - Cocoa & Poppy Pink) */}
      <rect x="48" y="118" width="104" height="34" rx="6" fill="#FF4B82" stroke="#2D1610" strokeWidth="3.5" />
      <ellipse cx="100" cy="118" rx="52" ry="9" fill="#FF6F9C" stroke="#2D1610" strokeWidth="3.5" />
      {/* Fondant ruffles at bottom tier */}
      <path d="M52 144 Q58 140 64 144 Q70 140 76 144 Q82 140 88 144 Q94 140 100 144 Q106 140 112 144 Q118 140 124 144 Q130 140 136 144 Q142 140 148 144" fill="none" stroke="#2D1610" strokeWidth="2.5" />

      {/* TIER 2 (Middle Tier - Cream Vanilla & Gold Flakes) */}
      <rect x="62" y="80" width="76" height="32" rx="5" fill="#FFF9F5" stroke="#2D1610" strokeWidth="3.5" />
      <ellipse cx="100" cy="80" rx="38" ry="8" fill="#FFEBD9" stroke="#2D1610" strokeWidth="3" />
      {/* Gold foil flecks */}
      <polygon points="76,92 78,96 82,97 78,98 76,102 74,98 70,97 74,96" fill="#F5A623" />
      <polygon points="118,90 120,93 123,94 120,95 118,98 116,95 113,94 116,93" fill="#F5A623" />
      <polygon points="96,98 98,101 101,102 98,103 96,106 94,103 91,102 94,101" fill="#F5A623" />

      {/* TIER 3 (Top Tier - Vivid Tangerine) */}
      <rect x="76" y="52" width="48" height="24" rx="4" fill="#FF7E53" stroke="#2D1610" strokeWidth="3" />
      <ellipse cx="100" cy="52" rx="24" ry="6" fill="#FFA180" stroke="#2D1610" strokeWidth="3" />

      {/* Top Cherry Topper with stem */}
      <circle cx="100" cy="38" r="9" fill="#D31A3A" stroke="#2D1610" strokeWidth="3" />
      <circle cx="97" cy="35" r="2.5" fill="#FFF" />
      <path d="M100 30 C100 20 114 18 118 14" fill="none" stroke="#2D1610" strokeWidth="3" strokeLinecap="round" />
      <path d="M118 14 C122 12 126 15 125 18 C122 20 118 17 118 14" fill="#3ED494" stroke="#2D1610" strokeWidth="1.5" />

      {/* Celebration sparkle */}
      <polygon points="155,40 157,46 163,48 157,50 155,56 153,50 147,48 153,46" fill="#F5A623" stroke="#2D1610" strokeWidth="1.5" />
      <polygon points="38,70 40,75 45,76 40,78 38,83 36,78 31,76 36,75" fill="#FF4B82" stroke="#2D1610" strokeWidth="1.5" />
    </svg>
    <div className="absolute top-2 right-2 rotate-6 bg-[#2D1610] text-[#F5A623] font-heading font-black text-xs px-2 py-0.5 rounded-lg border-2 border-[#F5A623] shadow-[2px_2px_0px_#2D1610]">
      LUXURY BESPOKE
    </div>
  </div>
);

export const ProductIllustration: React.FC<{ theme: string; className?: string }> = ({ theme, className }) => {
  switch (theme) {
    case 'puffpuff':
      return <PuffPuffIllustration className={className} />;
    case 'chinchin':
      return <ChinChinIllustration className={className} />;
    case 'fishroll':
      return <FishRollIllustration className={className} />;
    case 'fondantcake':
    default:
      return <FondantCakeIllustration className={className} />;
  }
};
