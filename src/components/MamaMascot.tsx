import React from 'react';
import { MamaMood } from '../types/game';

interface MamaMascotProps {
  mood?: MamaMood;
  speech?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showSpeechBubble?: boolean;
}

export const MamaMascot: React.FC<MamaMascotProps> = ({
  mood = 'happy',
  speech,
  size = 'md',
  className = '',
  showSpeechBubble = true,
}) => {
  const sizeMap = {
    sm: 'w-24 h-28',
    md: 'w-36 h-44',
    lg: 'w-48 h-56',
  };

  return (
    <div className={`relative flex items-end gap-3 select-none ${className}`}>
      {/* Cartoon Pharmacist Mascot (Mama) */}
      <div className={`relative flex-shrink-0 ${sizeMap[size]} animate-mama-float`}>
        <svg
          viewBox="0 0 200 240"
          className="w-full h-full drop-shadow-md overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Hair back */}
          <path
            d="M 50 110 C 30 70 50 20 100 20 C 150 20 170 70 150 110 C 130 140 70 140 50 110 Z"
            fill="#6d4c41"
          />
          {/* Cute Lab Coat Body */}
          <path
            d="M 60 160 L 40 230 L 160 230 L 140 160 Z"
            fill="#ffffff"
            stroke="#e2e8f0"
            strokeWidth="3"
          />
          {/* Lab coat collar & pink tie/stethoscope */}
          <path d="M 85 160 L 100 195 L 115 160 Z" fill="#ff6584" />
          <path
            d="M 70 160 L 95 190 L 80 230"
            stroke="#cbd5e1"
            strokeWidth="3"
            fill="none"
          />
          <path
            d="M 130 160 L 105 190 L 120 230"
            stroke="#cbd5e1"
            strokeWidth="3"
            fill="none"
          />
          {/* Stethoscope */}
          <path
            d="M 80 165 C 80 195 120 195 120 165"
            stroke="#0284c7"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="100" cy="195" r="7" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />

          {/* Pharmacist ID badge */}
          <rect x="68" y="195" width="18" height="14" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <line x1="72" y1="200" x2="82" y2="200" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="72" y1="204" x2="79" y2="204" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />

          {/* Face */}
          <ellipse cx="100" cy="105" rx="46" ry="48" fill="#ffe4d6" />

          {/* Ears */}
          <circle cx="53" cy="106" r="9" fill="#ffd5c0" />
          <circle cx="147" cy="106" r="9" fill="#ffd5c0" />

          {/* Hair Front Bangs */}
          <path
            d="M 54 90 C 70 65 130 65 146 90 C 135 75 115 72 100 75 C 85 72 65 75 54 90 Z"
            fill="#5d4037"
          />
          {/* Cute Pink Pharmacist Headband / Bow */}
          <path
            d="M 60 70 Q 100 50 140 70"
            stroke="#ff6584"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          {/* Bow on Headband */}
          <circle cx="130" cy="62" r="6" fill="#ff4081" />
          <ellipse cx="122" cy="60" rx="8" ry="5" fill="#ff6584" transform="rotate(-15 122 60)" />
          <ellipse cx="138" cy="64" rx="8" ry="5" fill="#ff6584" transform="rotate(15 138 64)" />

          {/* Eyeglasses */}
          <rect
            x="68"
            y="94"
            width="26"
            height="22"
            rx="8"
            fill="rgba(255,255,255,0.4)"
            stroke="#ec4899"
            strokeWidth="2.5"
          />
          <rect
            x="106"
            y="94"
            width="26"
            height="22"
            rx="8"
            fill="rgba(255,255,255,0.4)"
            stroke="#ec4899"
            strokeWidth="2.5"
          />
          <line x1="94" y1="104" x2="106" y2="104" stroke="#ec4899" strokeWidth="2.5" />

          {/* Cheeks Blush */}
          <ellipse cx="72" cy="118" rx="8" ry="4" fill="#ff8da1" opacity="0.6" />
          <ellipse cx="128" cy="118" rx="8" ry="4" fill="#ff8da1" opacity="0.6" />

          {/* Eyebrows */}
          {mood === 'worried' || mood === 'shocked' ? (
            <>
              <path d="M 72 88 Q 80 84 88 88" stroke="#4e342e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 112 88 Q 120 84 128 88" stroke="#4e342e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : mood === 'thinking' ? (
            <>
              <path d="M 72 87 Q 80 82 88 85" stroke="#4e342e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 112 84 Q 120 89 128 87" stroke="#4e342e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          ) : (
            <>
              <path d="M 72 86 Q 80 82 88 86" stroke="#4e342e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
              <path d="M 112 86 Q 120 82 128 86" stroke="#4e342e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </>
          )}

          {/* Eyes based on Mood */}
          {mood === 'starry' || mood === 'cheering' ? (
            <>
              {/* Star Eyes! */}
              <path
                d="M 81 97 L 83 103 L 89 105 L 83 107 L 81 113 L 79 107 L 73 105 L 79 103 Z"
                fill="#facc15"
              />
              <path
                d="M 119 97 L 121 103 L 127 105 L 121 107 L 119 113 L 117 107 L 111 105 L 117 103 Z"
                fill="#facc15"
              />
            </>
          ) : mood === 'shocked' ? (
            <>
              {/* Swirly / Wide Eyes */}
              <circle cx="81" cy="105" r="7" fill="#ffffff" stroke="#334155" strokeWidth="2" />
              <circle cx="81" cy="105" r="3" fill="#334155" />
              <circle cx="119" cy="105" r="7" fill="#ffffff" stroke="#334155" strokeWidth="2" />
              <circle cx="119" cy="105" r="3" fill="#334155" />
            </>
          ) : (
            <>
              {/* Cheerful anime eyes with shine */}
              <circle cx="81" cy="105" r="5.5" fill="#334155" />
              <circle cx="79" cy="103" r="2" fill="#ffffff" />
              <circle cx="119" cy="105" r="5.5" fill="#334155" />
              <circle cx="117" cy="103" r="2" fill="#ffffff" />
            </>
          )}

          {/* Mouth based on Mood */}
          {mood === 'happy' || mood === 'cheering' ? (
            <path
              d="M 92 122 Q 100 133 108 122"
              stroke="#e11d48"
              strokeWidth="2.5"
              fill="#fda4af"
              strokeLinecap="round"
            />
          ) : mood === 'starry' ? (
            <path
              d="M 90 120 Q 100 136 110 120 Z"
              fill="#e11d48"
              stroke="#be123c"
              strokeWidth="2"
            />
          ) : mood === 'worried' ? (
            <path
              d="M 92 126 Q 96 122 100 125 Q 104 128 108 124"
              stroke="#e11d48"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          ) : mood === 'shocked' ? (
            <ellipse cx="100" cy="126" rx="6" ry="9" fill="#be123c" stroke="#881337" strokeWidth="2" />
          ) : (
            /* Thinking */
            <path
              d="M 94 124 Q 100 120 106 124"
              stroke="#e11d48"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {/* Sweat drop for worried */}
          {mood === 'worried' && (
            <path
              d="M 148 92 C 148 92 143 100 143 104 C 143 107 145 109 148 109 C 151 109 153 107 153 104 C 153 100 148 92 148 92 Z"
              fill="#38bdf8"
            />
          )}

          {/* Sparkles for starry / cheering */}
          {(mood === 'starry' || mood === 'cheering') && (
            <>
              <path
                d="M 40 40 L 44 48 L 52 50 L 44 52 L 40 60 L 36 52 L 28 50 L 36 48 Z"
                fill="#fde047"
                className="animate-spin-slow"
              />
              <path
                d="M 160 35 L 163 41 L 169 43 L 163 45 L 160 51 L 157 45 L 151 43 L 157 41 Z"
                fill="#f472b6"
              />
            </>
          )}

          {/* Arms / Hand gestures */}
          {mood === 'cheering' ? (
            <>
              {/* Arms raised up */}
              <path
                d="M 50 170 Q 25 140 30 110"
                stroke="#ffffff"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="30" cy="108" r="8" fill="#ffe4d6" />
              <path
                d="M 150 170 Q 175 140 170 110"
                stroke="#ffffff"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="170" cy="108" r="8" fill="#ffe4d6" />
            </>
          ) : mood === 'thinking' ? (
            <>
              {/* One hand on chin */}
              <path
                d="M 150 170 Q 155 145 125 135"
                stroke="#ffffff"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="122" cy="133" r="8" fill="#ffe4d6" />
            </>
          ) : (
            <>
              {/* Holding clipboard or waving */}
              <path
                d="M 45 175 Q 30 185 45 205"
                stroke="#ffffff"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
              />
              <circle cx="45" cy="207" r="8" fill="#ffe4d6" />
            </>
          )}
        </svg>
      </div>

      {/* Cooking Mama Speech Bubble */}
      {showSpeechBubble && speech && (
        <div className="relative max-w-sm sm:max-w-md bg-white rounded-3xl p-4 shadow-mama border-3 border-pink-200 animate-pop-in">
          {/* Bubble tail pointing to Mama */}
          <div className="absolute -left-3 bottom-6 w-0 h-0 border-t-8 border-t-transparent border-r-12 border-r-white border-b-8 border-b-transparent drop-shadow-sm" />
          <div className="text-xs font-bold uppercase tracking-wider text-mama-pink flex items-center gap-1.5 mb-1">
            <span className="w-2 h-2 rounded-full bg-mama-pink animate-ping inline-block" />
            Pharma Mama says:
          </div>
          <p className="text-sm sm:text-base font-semibold text-slate-700 leading-snug">
            {speech}
          </p>
        </div>
      )}
    </div>
  );
};
