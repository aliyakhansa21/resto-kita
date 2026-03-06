export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* Test Card dengan Tailwind Classes */}
      <div className="bg-blue-500 p-10 rounded-xl shadow-2xl hover:bg-orange-500 transition-colors duration-500 cursor-pointer">
        <h1 className="text-white text-4xl font-bold italic">
          Tailwind Check: Resto-Kita 🍕
        </h1>
        <p className="text-blue-100 mt-4 text-center">
          Kalau kotak ini biru dan berubah oranye saat di-hover, berarti Tailwind aman!
        </p>
      </div>
    </main>
  );
}