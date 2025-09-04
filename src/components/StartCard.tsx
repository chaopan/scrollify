type StartCardProps = {
  className?: string;
  onStart: () => void;
  loading: boolean;
};

export const StartCard = ({
  className = "",
  onStart,
  loading,
}: StartCardProps) => {
  return (
    <div
      className={`${className} h-640 w-360 group relative flex flex-col overflow-hidden rounded-2xl p-8 text-center shadow-xl`}
      style={{
        background:
          "linear-gradient(135deg, #5319ff 0%, #6C63FF 25%, #00E6A8 75%, #aef2fc 100%)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 8s ease infinite",
      }}
    >
      <div className="relative z-10 m-2 flex flex-1 flex-col justify-center rounded-xl bg-black/10 p-6 backdrop-blur-sm">
        <h1 className="mb-6 text-5xl font-black tracking-tight text-white drop-shadow-lg">
          Scrollify
        </h1>

        <p className="mx-auto max-w-xs text-lg font-medium leading-relaxed text-white/90 drop-shadow-md">
          Discover your next favorite song with AI-powered music recommendations
        </p>
      </div>

      <div className="relative z-10 mt-6">
        <button
          onClick={onStart}
          disabled={loading}
          className="group/btn text-song-secondary relative w-full cursor-pointer rounded-xl bg-white/95 px-8 py-4 font-bold shadow-xl transition-colors duration-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "cooking up some tracks" : "Let's Go!"}
        </button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/40 to-transparent"></div>
    </div>
  );
};
