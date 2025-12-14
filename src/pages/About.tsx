import React from 'react';
import heroImage from '../assets/24.jpg';

const About: React.FC = () => {
  return (
    <div className="flex w-full flex-1 flex-col items-center">
      <div className="flex w-full max-w-7xl flex-col">
        <main className="flex flex-col items-center">
          {/* Hero Section */}
          <section className="w-full max-w-[1200px] px-4 md:px-10 py-5">
            <div className="@container">
              <div className="flex flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-xl md:rounded-[3rem] items-center justify-center p-8 md:p-20 min-h-[480px] relative overflow-hidden" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.7) 100%), url(${heroImage})` }}>
                <div className="flex flex-col gap-4 text-center z-10 max-w-[700px]">
                  <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-[-0.033em]">
                    We are Shopazon
                  </h1>
                  <p className="text-neutral-200 text-base md:text-xl font-normal leading-relaxed">
                    Revolutionizing the way you shop. Connecting quality to convenience, one click at a time.
                  </p>
                </div>
                <button className="z-10 mt-4 flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-8 bg-orange-500 text-[#111814] text-base font-bold leading-normal tracking-[0.015em] hover:scale-105 transition-transform shadow-[0_0_20px_rgba(43,238,121,0.3)]">
                  <span className="truncate">View Our Story</span>
                </button>
              </div>
            </div>
          </section>
          {/* Mission & Vision */}
          <section className="w-full max-w-[960px] px-4 md:px-10 py-16">
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-4 text-center md:text-left">
                <h2 className="text-[#111418] text-3xl md:text-4xl font-bold leading-tight">
                  Our Purpose
                </h2>
                <p className="text-neutral-600 text-lg font-normal leading-normal max-w-[720px]">
                  Driven by a passion for quality and convenience, we bridge the gap between desire and delivery.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mission Card */}
                <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-8 hover:border-orange-500/50 transition-colors">
                  <div className="size-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <span className="material-symbols-outlined text-3xl">rocket_launch</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#111418] text-xl font-bold leading-tight">Our Mission</h3>
                    <p className="text-neutral-600 text-base font-normal leading-relaxed">
                      To deliver happiness and quality to doorsteps worldwide through seamless technology and logistics excellence.
                    </p>
                  </div>
                </div>
                {/* Vision Card */}
                <div className="flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-8 hover:border-orange-500/50 transition-colors">
                  <div className="size-12 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500">
                    <span className="material-symbols-outlined text-3xl">visibility</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <h3 className="text-[#111418] text-xl font-bold leading-tight">Our Vision</h3>
                    <p className="text-neutral-600 text-base font-normal leading-relaxed">
                      To become the world's most customer-centric marketplace where anything is possible and everything is accessible.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* Core Values Pills */}
          <section className="w-full max-w-[1200px] px-4 md:px-10 py-10">
            <h2 className="text-[#111418] text-3xl font-bold text-center mb-10">Our Core Values</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-neutral-100 border border-transparent hover:border-orange-500/30 transition-all cursor-default group">
                <span className="material-symbols-outlined text-4xl text-neutral-400 group-hover:text-orange-500 transition-colors">favorite</span>
                <h3 className="font-bold text-base md:text-lg">Customer First</h3>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-neutral-100 border border-transparent hover:border-orange-500/30 transition-all cursor-default group">
                <span className="material-symbols-outlined text-4xl text-neutral-400 group-hover:text-orange-500 transition-colors">lightbulb</span>
                <h3 className="font-bold text-base md:text-lg">Innovation</h3>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-neutral-100 border border-transparent hover:border-orange-500/30 transition-all cursor-default group">
                <span className="material-symbols-outlined text-4xl text-neutral-400 group-hover:text-orange-500 transition-colors">eco</span>
                <h3 className="font-bold text-base md:text-lg">Sustainability</h3>
              </div>
              <div className="flex flex-col items-center justify-center gap-3 p-6 rounded-lg bg-neutral-100 border border-transparent hover:border-orange-500/30 transition-all cursor-default group">
                <span className="material-symbols-outlined text-4xl text-neutral-400 group-hover:text-orange-500 transition-colors">verified_user</span>
                <h3 className="font-bold text-base md:text-lg">Trust</h3>
              </div>
            </div>
          </section>
          {/* Timeline Section */}
          <section className="w-full max-w-[960px] px-4 md:px-10 py-16">
            <h2 className="text-[#111418] text-3xl font-bold text-center mb-12">Our Journey So Far</h2>
            <div className="grid grid-cols-[40px_1fr] gap-x-6 px-4">
              {/* Item 1 */}
              <div className="flex flex-col items-center gap-1 pt-1">
                <div className="size-10 rounded-full bg-[#28392f] flex items-center justify-center text-orange-500 border border-[#3b5445] z-10">
                  <span className="material-symbols-outlined text-xl">garage_home</span>
                </div>
                <div className="w-[2px] bg-neutral-200 h-full grow min-h-[60px]"></div>
              </div>
              <div className="flex flex-col pb-12 pt-1">
                <span className="text-orange-500 text-sm font-bold tracking-wider uppercase mb-1">2015</span>
                <h3 className="text-[#111418] text-xl font-bold mb-1">Founded in a Garage</h3>
                <p className="text-neutral-600 text-base">San Francisco, CA - Where the first line of code was written and the first package shipped.</p>
              </div>
              {/* Item 2 */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-[2px] bg-neutral-200 h-6"></div>
                <div className="size-10 rounded-full bg-[#28392f] flex items-center justify-center text-orange-500 border border-[#3b5445] z-10">
                  <span className="material-symbols-outlined text-xl">groups</span>
                </div>
                <div className="w-[2px] bg-neutral-200 h-full grow min-h-[60px]"></div>
              </div>
              <div className="flex flex-col pb-12 pt-6">
                <span className="text-orange-500 text-sm font-bold tracking-wider uppercase mb-1">2018</span>
                <h3 className="text-[#111418] text-xl font-bold mb-1">First Million Users</h3>
                <p className="text-neutral-600 text-base">We hit a major milestone, proving that customer-centric shopping is what the world wanted.</p>
              </div>
              {/* Item 3 */}
              <div className="flex flex-col items-center gap-1">
                <div className="w-[2px] bg-neutral-200 h-6"></div>
                <div className="size-10 rounded-full bg-[#28392f] flex items-center justify-center text-orange-500 border border-[#3b5445] z-10">
                  <span className="material-symbols-outlined text-xl">public</span>
                </div>
                <div className="w-[2px] bg-neutral-200 h-full grow min-h-[20px]"></div>
              </div>
              <div className="flex flex-col pb-6 pt-6">
                <span className="text-orange-500 text-sm font-bold tracking-wider uppercase mb-1">2023</span>
                <h3 className="text-[#111418] text-xl font-bold mb-1">Global Expansion</h3>
                <p className="text-neutral-600 text-base">Now operating in 20+ countries, bringing Shopazon to a global audience.</p>
              </div>
            </div>
          </section>
          {/* Meet the Team */}
          <section className="w-full max-w-[1200px] px-4 md:px-10 py-16 bg-neutral-100/50 rounded-[3rem] my-10">
            <div className="flex flex-col items-center gap-10">
              <div className="text-center max-w-[600px]">
                <h2 className="text-[#111418] text-3xl font-bold mb-4">Meet the Team</h2>
                <p className="text-neutral-600">The creative minds and technical wizards behind the Shopazon platform.</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full">
                {/* Team Member 1 */}
                <div className="flex flex-col items-center group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-5 border-4 border-transparent group-hover:border-orange-500 transition-all duration-300 relative">
                    <img alt="Portrait of Sarah Jenkins" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBgGIeTqCSgbgfsfHsSYS6WZ9dfgqIQOraN6grBgfYxSFtkzJWrd6cE68U_xkJaOT2oIqQt2cy44k4VqMUcewtn2llQ2GAV1uZERbaPpQRlmKjOZGkz9bNyLjfAOOpQVUTPph3Q_KGjjHYSifyFEzFq3N0seSFDwxzqPHx4na7udeK_1FazKpq2wSODVLjlfB2R6gQhAnJFOd4HHKrzFTZ608PzL_d97_v4BS7W79Kdf_NKaZ2VpTtQvnRM2O9HWK5UJUdzvq3WzIzM" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111418]">Sarah Jenkins</h3>
                  <p className="text-sm text-orange-500 font-medium">CEO &amp; Founder</p>
                </div>
                {/* Team Member 2 */}
                <div className="flex flex-col items-center group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-5 border-4 border-transparent group-hover:border-orange-500 transition-all duration-300 relative">
                    <img alt="Portrait of Mike Thompson" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHzk9vArDEHgx61scw304C_l0AV3kFWVfd84zeU4VDv81CIWGx-4ZROkLKTuza-cXGztcXX5eSsy-3jyj9ledNGKLGi05-7OZdSA0wwxnZR6JUJPbHYJbmdbFJIdGa1eCDg83e2iGGPPj9SqlixtAgOkOxSVQeAqncSXDL9mdzsnJlT0_9YtfTHciou7vlcmGXT_E-XlJ57webS8mA6qozUuRscy_uDv7bcFHn3CjKbg4yqD84gw2221r651q0BVEAWloJWohh6xhz" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111418]">Mike Thompson</h3>
                  <p className="text-sm text-orange-500 font-medium">Head of Product</p>
                </div>
                {/* Team Member 3 */}
                <div className="flex flex-col items-center group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-5 border-4 border-transparent group-hover:border-orange-500 transition-all duration-300 relative">
                    <img alt="Portrait of Elena Rodriguez" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGlb-veUvzzoH8ljwHFEkmA2o2R8gIwneIP4yurPivp_36yUuL0M7wIqLAxinW-qCJI8Tm7M3fhOdJ_JOP-URbuTEnAO-apzJ9FMmLrUrsu44CLpUqa2HtMAJXewELQNXJaIMXlsoUibTTBANv_JNcBNSkDuwY976lnybqanr0Zro59Z0Q7lk0OgVgoA7EcqYE_P01TMKthPCpfCJ5CQPtbQQdzpKD-5hT2ZZAf6ouB-R9p0VGLEUagxOnLIGmuNdJ8KbRpvv-kEhK" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111418]">Elena Rodriguez</h3>
                  <p className="text-sm text-orange-500 font-medium">CTO</p>
                </div>
                {/* Team Member 4 */}
                <div className="flex flex-col items-center group">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden mb-5 border-4 border-transparent group-hover:border-orange-500 transition-all duration-300 relative">
                    <img alt="Portrait of David Chen" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfyyZIwCe41MhW0mCNHzAdQBytF-ov2m4p48ZTk-rIzG9twTnrvvCUqk5wfHpb6Yo9mEezKtS6u_cLwHBg0tLnBTxkRT0LMNjHB-Rug0qnn9A3VsrEsk8dKvXQilS8JULaO4vhfbYHwzyRak30IPP5hXut72bWXNGIsK9xQ7o56Q4y21C_a0dzjWfbEJ9ia-ePjC2mIdWDdVYUmpLIHnf1dizUAs9BowFjAGS-4eu9vi5u18vv-LFKBw-XRPjl6sC1gRfg5jRv3coG" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111418]">David Chen</h3>
                  <p className="text-sm text-orange-500 font-medium">Head of Design</p>
                </div>
              </div>
            </div>
          </section>
          {/* CTA Footer */}
          <section className="w-full bg-orange-500 py-16 mt-10">
            <div className="layout-container flex flex-col items-center justify-center text-center px-4">
              <h2 className="text-[#102217] text-3xl md:text-5xl font-black mb-6 max-w-[800px]">
                Ready to experience the future of shopping?
              </h2>
              <div className="flex gap-4">
                <button className="bg-[#102217] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-black transition-colors">
                  Start Shopping
                </button>
                <button className="bg-transparent border-2 border-[#102217] text-[#102217] px-8 py-4 rounded-full font-bold text-lg hover:bg-[#102217] hover:text-white transition-colors">
                  Contact Support
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default About;