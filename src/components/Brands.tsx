const brands = [
  { name: 'My Fit Mood', src: 'https://i.postimg.cc/ZY3rhQHh/1.png' },
  { name: 'VIVE FIT', src: 'https://i.postimg.cc/xjHKSZ5n/2.png' },
  { name: 'NKFIT', src: 'https://i.postimg.cc/DfsqKN6h/3.png' },
]

// Duplicar exatamente 2x = mínimo necessário pro loop com -50%
const loopBrands = [...brands, ...brands]

export default function Brands() {
  return (
    <section className="brands" style={{ overflow: 'hidden' }}>
      <div className="brands-marquee">
        <div className="brands-marquee__inner">
          {loopBrands.map((brand, i) => (
            <div className="brand-item" key={i}>
              <img src={brand.src} alt={brand.name} aria-hidden={i >= brands.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}