const brands = [
  { name: 'My Fit Mood', src: 'https://i.postimg.cc/pXVkb9fx/MY-FIT-MOOD.jpg' },
  { name: 'VIVE FIT!', src: 'https://i.postimg.cc/NfGbqy6s/V-I-V-E-FIT.png' },
  { name: 'NKFIT', src: 'https://i.postimg.cc/J47KVyN8/NKFIT.png' },
]

const allBrands = [...brands, ...brands, ...brands, ...brands]

export default function Brands() {
  return (
    <section className="brands" style={{ padding: '20px 0 30px', overflow: 'hidden' }}>
      <div className="brands-marquee">
        <div className="brands-marquee__inner">
          {allBrands.map((brand, i) => (
            <div className="brand-item" key={i}>
              <img src={brand.src} alt={brand.name} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}