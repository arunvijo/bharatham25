export default function HomeVideo() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src="/videos/herovid.mp4"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  );
}
