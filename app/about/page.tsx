import Header from "./../components/layouts/Header/Header";
import Footer from "./../components/layouts/Footer/Footer";

export default function About() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center min-h-screen bg-[#40494F] text-white px-6 text-center gap-6">
        <h1 className="text-3xl font-bold">こっこうた について</h1>
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl text-lg leading-relaxed text-[#E0E3E7] space-y-6">
          <p>
            「こっこうた」は、詩をそっと届けるひつじのキャラクター「こっこちゃん」が、<br />
            季節や時間に寄り添った言葉をつぶやく、ちいさな詩のアプリです。
          </p>
          <p>
            あわただしい日々のなか、ふっと立ち止まれる瞬間を持ってもらえたら。<br />
            美しい言葉が、心の呼吸を整えてくれる。そんな時間を目指してつくりました。
          </p>
          <p className="text-sm text-[#C2C8CD]">作った人より</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
