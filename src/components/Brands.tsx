const brands = [
  { name: 'Alto Giro', src: 'https://i.postimg.cc/jdPGLbQg/Gemini-Generated-Image-ee0c4ree0c4ree0c.png' },
  { name: 'Live!', src: 'https://i.postimg.cc/28hPVDFb/Gemini-Generated-Image-ee0c4ree0c4ree0c-(1).png' },
  { name: 'Colcci Fit', src: 'https://i.postimg.cc/4NVrmgbf/Gemini-Generated-Image-ee0c4ree0c4ree0c-(2).png' },
  { name: 'La Clofit', src: 'https://i.postimg.cc/y6wM1d98/Gemini-Generated-Image-ee0c4ree0c4ree0c-(3).png' },
  { name: 'Área Sports', src: 'https://i.postimg.cc/FF2MrRck/Gemini-Generated-Image-ee0c4ree0c4ree0c-(4).png' },
  { name: 'VIVE FIT', src: 'https://i.postimg.cc/BZdrS6Fy/Gemini-Generated-Image-ee0c4ree0c4ree0c-(5).png' },
]

export default function Brands() {
  return (
<section className="brands" style={{ padding: '20px 0 20px' }}>      
<div className="brands-track">
        {[...brands, ...brands].map((brand, i) => (
          <div className="brand-item" key={i}>
            <img src={brand.src} alt={brand.name} />
          </div>
        ))}
      </div>
    </section>
  )
}