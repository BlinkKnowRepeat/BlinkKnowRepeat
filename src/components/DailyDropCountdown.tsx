import React, { useState, useEffect } from 'react';
import { Clock, Bell, Calendar, Sparkles, Check } from 'lucide-react';
import { playClickSound, playZapSound } from '../utils/sound';

export const DailyDropCountdown: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  const [reminderSet, setReminderSet] = useState(false);

  useEffect(() => {
    const calculateTimeUntil7PM = () => {
      const now = new Date();
      const target = new Date();

      target.setHours(19, 0, 0, 0); // 7:00:00 PM

      if (now.getTime() >= target.getTime()) {
        // If already passed 7 PM today, target is 7 PM tomorrow
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    };

    calculateTimeUntil7PM();
    const interval = setInterval(calculateTimeUntil7PM, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleDownloadCalendar = () => {
    playZapSound();
    setReminderSet(true);

    // Generate .ics file for Daily 7 PM
    const icsData = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Blink Know Repeat//Daily 7PM Drop//EN',
      'BEGIN:VEVENT',
      'SUMMARY:⚡ Blink, Know, Repeat — Daily 7 PM Intel Drop',
      'DESCRIPTION:Tech, business & global shifts in a blink. Watch today’s 30s breakdown.',
      'RRULE:FREQ=DAILY',
      'DTSTART:20261115T190000',
      'DURATION:PT15M',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsData], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'BlinkKnowRepeat-Daily7PM.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setReminderSet(false), 4000);
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-[#0a1426] via-[#0d1a33] to-[#0a1426] border border-[#1e345e] shadow-2xl overflow-hidden">
          {/* Subtle volt pulse ring in corner */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#d9fa22]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#070d18] border border-[#1e345e] text-xs font-mono text-[#d9fa22] mb-3">
                <Clock className="w-3.5 h-3.5" /> SYNCHRONIZED BROADCAST SCHEDULE
              </div>
              <h3 className="text-2xl sm:text-3xl font-black font-['Syne',sans-serif] text-white">
                Next Drop Arrives in:
              </h3>
              <p className="mt-2 text-sm text-[#889bb8] max-w-md">
                Every single day at 7:00 PM, a fresh 30-second investigation goes live. No clickbait, just unadulterated reality.
              </p>
            </div>

            {/* Countdown Clock Cluster */}
            <div className="flex items-center gap-3 font-mono">
              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-[#070d18] border border-[#1e345e] min-w-[70px] sm:min-w-[85px]">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#d9fa22]">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#889bb8] uppercase mt-1 tracking-wider">Hours</span>
              </div>

              <span className="text-2xl font-bold text-[#889bb8]">:</span>

              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-[#070d18] border border-[#1e345e] min-w-[70px] sm:min-w-[85px]">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#d9fa22]">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#889bb8] uppercase mt-1 tracking-wider">Mins</span>
              </div>

              <span className="text-2xl font-bold text-[#889bb8]">:</span>

              <div className="flex flex-col items-center p-3 sm:p-4 rounded-2xl bg-[#070d18] border border-[#1e345e] min-w-[70px] sm:min-w-[85px]">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-[#889bb8] uppercase mt-1 tracking-wider">Secs</span>
              </div>
            </div>

            {/* Action */}
            <div>
              <button
                onClick={handleDownloadCalendar}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#070d18] hover:bg-[#d9fa22] text-[#d9fa22] hover:text-[#070d18] border border-[#1e345e] hover:border-[#d9fa22] font-bold text-xs font-mono uppercase tracking-wider transition-all duration-300 shadow-lg cursor-pointer"
              >
                {reminderSet ? <Check className="w-4 h-4 text-emerald-400" /> : <Calendar className="w-4 h-4" />}
                <span>{reminderSet ? 'Calendar Synced!' : 'Sync Daily 7PM Alarm'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
