import { FileText, Lock, Zap, Cloud } from "lucide-react";

export default function AuthLayout({ children }) {
  return (
    <div className="h-screen w-full overflow-hidden bg-[#080a0d] text-white">

      <div className="grid h-screen min-h-0 lg:grid-cols-[minmax(0,1fr)_480px]">

        {/* LEFT SIDE */}
        <div className="relative hidden h-screen min-h-0 overflow-hidden lg:flex flex-col justify-between px-8 py-6 xl:px-10 xl:py-7">

          {/* BACKGROUND GLOW */}
          <div className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-purple-600/10 blur-[110px]"/>

          <div className="pointer-events-none absolute bottom-[-100px] right-[-80px] h-[350px] w-[350px] rounded-full bg-purple-500/10 blur-[110px]"/>


          {/* LOGO */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 shadow-lg shadow-purple-600/30">
              <FileText size={20} />
            </div>

            <span className="text-lg font-semibold">
              MyNotes
            </span>

          </div>


          {/* HERO */}
          <div className="relative max-w-2xl">

            <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight xl:text-5xl">
              Your thoughts,
              <br />

              perfectly{" "}
              <span className="text-purple-400">
                organized.
              </span>
            </h1>


            <p className="mt-4 max-w-xl text-base leading-7 text-gray-400 xl:text-lg">
              Capture ideas, organize your notes,
              and keep everything you need in one
              beautiful workspace.
            </p>



            {/* MOCK NOTE CARD */}

            <div className="relative mt-6">
              <div className="absolute inset-x-16 bottom-0 h-16 rounded-full bg-purple-600/25 blur-3xl"/>

              {/* Note Card */}
              <div className="relative w-[330px] rotate-[-3deg] rounded-2xl border border-white/[0.08] bg-[#101318] p-4 shadow-2xl shadow-black/50 xl:w-[350px]">

                {/* Header */}
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-600">
                    <FileText size={15} />
                  </div>
                  <div className="h-3 w-28 rounded bg-white/10" />
                </div>

                {/* Notes */}
                <div className="mt-4 space-y-3">

                  {/* Note 1 */}

                  <div className="rounded-xl bg-white/[0.03] p-3">

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-purple-400" />

                      <div className="h-2.5 w-28 rounded bg-white/20" />

                    </div>

                    <div className="mt-2.5 h-2 w-44 rounded bg-white/[0.08]" />

                    <div className="mt-1.5 h-2 w-32 rounded bg-white/[0.06]" />

                  </div>


                  {/* Note 2 */}

                  <div className="rounded-xl bg-white/[0.03] p-3">

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-blue-400" />

                      <div className="h-2.5 w-36 rounded bg-white/20" />

                    </div>

                    <div className="mt-2.5 h-2 w-48 rounded bg-white/[0.08]" />

                  </div>


                  {/* Note 3 */}

                  <div className="rounded-xl bg-purple-600/10 p-3">

                    <div className="flex items-center gap-2">

                      <span className="h-2 w-2 rounded-full bg-purple-400" />

                      <div className="h-2.5 w-32 rounded bg-purple-300/30" />

                    </div>

                  </div>

                </div>

              </div>


  
              {/* FLOATING STAR */}
              <div
                className="
                  absolute
                  left-[315px]
                  top-2
                  flex
                  h-11
                  w-11
                  rotate-12
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-yellow-400/20
                  bg-yellow-400/10
                  text-xl
                  xl:left-[335px]
                "
              >
                ⭐
              </div>


  
              {/* FLOATING PIN */}

              <div
                className="
                  absolute
                  left-[270px]
                  bottom-[-8px]
                  flex
                  h-10
                  w-10
                  rotate-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-purple-400/20
                  bg-purple-600/20
                  text-lg
                "
              >
                📌
              </div>

            </div>

          </div>


          {/* FEATURES */}

          <div className="relative grid grid-cols-3 gap-4">

            <Feature
              icon={Lock}
              title="Private & Secure"
              description="Your notes stay protected."
            />

            <Feature
              icon={Zap}
              title="Fast & Reliable"
              description="Quick access everywhere."
            />

            <Feature
              icon={Cloud}
              title="Always Accessible"
              description="Your notes, anywhere."
            />

          </div>

        </div>


        {/* RIGHT SIDE */}
        <div className="relative flex h-screen min-h-0 min-w-0 items-center justify-center overflow-hidden border-l border-white/[0.06] bg-[#0b0e12] px-4 py-5">
          <div className="flex w-full max-w-[390px] min-w-0 flex-col items-center justify-center ">
            <div className=" w-full min-w-0 overflow-hidden">
              {children}
            </div>
            <p className="mt-3 text-center text-[10px] text-gray-600">
              Authentication powered by Clerk
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}

function Feature({
  icon: Icon,
  title,
  description,
}) {
  return (
    <div className="flex items-start gap-2.5">

      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-purple-600/10 text-purple-400">
        <Icon size={17} />
      </div>

      <div>

        <h3 className="text-xs font-medium text-gray-200 xl:text-sm">
          {title}
        </h3>

        <p className="mt-0.5 text-[10px] leading-4 text-gray-500 xl:text-xs">
          {description}
        </p>

      </div>

    </div>
  );
}