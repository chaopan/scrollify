type StartCardProps = {
  className?: string;
  onStart: () => void;
};

export const StartCard = ({ className = "", onStart }: StartCardProps) => {
  return (
    <div
      className={
        className + " h-640 w-360 rounded-xl bg-white text-center shadow-xl"
      }
    >
      <h1 className="mb-8 text-6xl font-bold text-gray-900">
        Welcome to <span className="text-indigo-600">Scrollify</span>
      </h1>
      <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
        An AI app to help you find new music! <br />
        Or just play the music you already like.
      </p>
      <div className=" ">
        <button
          onClick={onStart}
          className="transform rounded-lg bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700"
        >
          Lets go!
        </button>
      </div>
    </div>
  );
};
