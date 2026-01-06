import Image from 'next/image';

export default function FooterVoting() {
  return (
    <footer className="flex justify-center mx-auto">
      <div className="w-11/12 text-start">
        <span>Realização:</span>
        <div className="flex justify-between w-full">
          <Image
            src={'/acesaj.png'}
            alt="Associação Comercial e Empresarial de Santo Antônio de Jesus"
            width={191.43}
            height={60}
            style={{ width: 'auto', height: '30px' }}
          />
          <Image
            src={'/cdl.png'}
            alt="Câmara de Dirigentes Lojistas e Sindicato Patronal do Comércio Varejista de Santo Antônio de Jesus"
            width={124.9}
            height={45}
            style={{ width: 'auto', height: '30px' }}
          />
          <Image
            src={'/sincromsaj.png'}
            alt="Sindicado do sistema comércio em Santo Antônio de Jesus"
            width={136.41}
            height={60}
            style={{ width: 'auto', height: '30px' }}
          />
          <Image
            src={'/sindbarh.png'}
            alt="sindicato patronal do sebrae restaurantes e hoteis Santo Antônio de Jesus"
            width={59.28}
            height={45}
            style={{ width: 'auto', height: '30px' }}
          />
          <Image
            src={'/comercio.png'}
            alt="Santo Antônio de Jesus, O comércio mais barato da Bahia"
            width={40.61}
            height={45}
            style={{ width: 'auto', height: '30px' }}
          />
        </div>
      </div>
    </footer>
  );
}
